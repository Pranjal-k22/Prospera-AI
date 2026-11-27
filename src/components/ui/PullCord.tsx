'use client';

import React, { useEffect, useRef, useState } from 'react';
import { getStorageItem, setStorageItem } from '@/lib/brand';

interface SpringState {
  x: number;
  v: number;
  t: number;
  k: number;
  c: number;
}

interface RopePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface PullCordProps {
  /** Initial lighting state (true = warm light room, false = obsidian dark room) */
  initialLight?: boolean;
  /** Controlled external theme sync (optional) */
  isLight?: boolean;
  /** Callback fired when the lamp toggles, passing the new state */
  onToggleLight?: (light: boolean) => void;
  /** Idle hint (deprecated: kept for type compatibility, always false) */
  autoPlay?: boolean;
  /** Custom vertical wire drop in px (default adapts to viewport) */
  wireLength?: number;
  className?: string;
}

const createSpring = (x: number, k = 400, c = 30): SpringState => ({ x, v: 0, t: x, k, c });

const tuneSpring = (s: SpringState, k: number, c: number, reducedMotion: boolean) => {
  s.k = k;
  s.c = reducedMotion ? 2 * Math.sqrt(k) : c;
};

const stepSpring = (s: SpringState, dt: number) => {
  const a = -s.k * (s.x - s.t) - s.c * s.v;
  s.v += a * dt;
  s.x += s.v * dt;
};

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

function RoomFixture({ isLit }: { isLit: boolean }) {
  return (
    <>
      {/* Wire SVG from ceiling to cap */}
      <svg className="pull-cord-rope" aria-hidden="true">
        <path className="pull-cord-wire-path" />
      </svg>

      {/* Ceiling Lamp Fixture (cap, half-circle dome shade, round bulb) */}
      <div className="pull-cord-lamp">
        <div className="pull-cord-head">
          <div className={`pull-cord-bulb ${isLit ? 'is-lit' : ''}`} />
          <div className="pull-cord-shade" />
          <div className="pull-cord-cap" />
        </div>
      </div>

      {/* Physical Hanging Cord SVG */}
      <svg className="pull-cord-rope" aria-hidden="true">
        <path className="pull-cord-rope-path" />
      </svg>

      {/* White Pill-Shaped Weighted Pull Bead */}
      <div className="pull-cord-bead" />
    </>
  );
}

export function PullCord({
  initialLight,
  isLight,
  onToggleLight,
  wireLength,
  className = '',
}: PullCordProps) {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const darkRoomRef = useRef<HTMLDivElement | null>(null);
  const litLayerRef = useRef<HTMLDivElement | null>(null);
  const grabRef = useRef<HTMLButtonElement | null>(null);

  // Determine initial state: isLight prop -> initialLight prop -> saved storage -> default dark (false)
  const [initialLit] = useState<boolean>(() => {
    if (typeof isLight === 'boolean') return isLight;
    if (typeof initialLight === 'boolean') return initialLight;
    if (typeof window !== 'undefined') {
      return getStorageItem('theme') === 'light';
    }
    return false;
  });

  const [ariaChecked, setAriaChecked] = useState(initialLit);
  const [isHeld, setIsHeld] = useState(false);

  // Latest callback ref so rAF loop never restarts when callback identity changes
  const onToggleRef = useRef(onToggleLight);
  useEffect(() => {
    onToggleRef.current = onToggleLight;
  }, [onToggleLight]);

  useEffect(() => {
    const scene = sceneRef.current;
    const darkRoom = darkRoomRef.current;
    const lit = litLayerRef.current;
    const grab = grabRef.current;
    if (!scene || !darkRoom || !lit || !grab) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const getElements = (el: HTMLElement) => ({
      wire: el.querySelector<SVGPathElement>('.pull-cord-wire-path'),
      lamp: el.querySelector<HTMLDivElement>('.pull-cord-lamp'),
      head: el.querySelector<HTMLDivElement>('.pull-cord-head'),
      bulb: el.querySelector<HTMLDivElement>('.pull-cord-bulb'),
      path: el.querySelector<SVGPathElement>('.pull-cord-rope-path'),
      bead: el.querySelector<HTMLDivElement>('.pull-cord-bead'),
    });

    const darkEls = getElements(darkRoom);
    const lightEls = getElements(lit);

    let W = scene.clientWidth || window.innerWidth;
    let H = scene.clientHeight || window.innerHeight;

    // Responsive scaling: on mobile (<= 480px), scale down proportionally to 80%
    let scale = W <= 480 ? 0.8 : 1.0;
    let AX = 34 * scale;
    let AY = 63 * scale;
    const N = 12;
    let SEG = 9 * scale;
    let L = N * SEG;
    let CLICK = 22 * scale;
    let MAXS = 54 * scale;

    // Exact spring constants from DesignBookmark tokens & pull-cord specification
    // TH 46/3, TUG 300/13, R open 120/21 close 170/27, BP 420/13, HX/HY 210/22, K 300/17
    const TH = createSpring(0, 46, 3);
    const TUG = createSpring(0, 300, 13);
    const R = createSpring(initialLit ? 1 : 0, 120, 21);
    const BP = createSpring(1, 420, 13);
    const HX = createSpring(0, 210, 22);
    const HY = createSpring(0, 210, 22);
    const K = createSpring(1, 300, 17);

    // Initial state set without animation
    R.x = initialLit ? 1 : 0;
    R.t = initialLit ? 1 : 0;

    tuneSpring(TH, 46, 3, reducedMotion);
    tuneSpring(TUG, 300, 13, reducedMotion);
    tuneSpring(R, 120, 21, reducedMotion);
    tuneSpring(BP, 420, 13, reducedMotion);
    tuneSpring(K, 300, 17, reducedMotion);

    // Synchronize initial theme attributes without triggering flip()
    const initialThemeName = initialLit ? 'light' : 'dark';
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', initialThemeName);
      document.documentElement.dataset.theme = initialThemeName;
    }

    let on = initialLit;
    let armed = true;
    let held: {
      id: number;
      x: number;
      y: number;
      ox: number;
      oy: number;
      moved: number;
      sx: number;
      sy: number;
      flipped: boolean;
    } | null = null;
    let ghost = false;
    let stretch = 0;
    let lean = 0;
    let clock = 0;
    let lastToggleTime = -100; // Allow immediate first toggle
    const LOCKOUT_SEC = 0.4; // 400ms lockout against rapid double-taps
    let side = 1;
    let activeWire = wireLength ?? (W <= 480 ? 36 : (H < 760 ? 52 : 72));

    const timers: Array<{ t: number; fn: () => void }> = [];
    const after = (sec: number, fn: () => void) => {
      const entry = { t: sec, fn };
      timers.push(entry);
      return entry;
    };

    const pts: RopePoint[] = [];

    const anchor = (): [number, number] => {
      const c = Math.cos(TH.x);
      const s = Math.sin(TH.x);
      const y = activeWire + TUG.x + AY;
      return [W / 2 + AX * c - y * s, AX * s + y * c];
    };

    const bulbAt = (): [number, number] => {
      const c = Math.cos(TH.x);
      const s = Math.sin(TH.x);
      const y = activeWire + TUG.x + 63 * scale;
      return [W / 2 - y * s, y * c];
    };

    const measure = () => {
      const nextW = scene.clientWidth || window.innerWidth;
      const nextH = scene.clientHeight || window.innerHeight;
      const prevW = W;
      W = nextW;
      H = nextH;

      scale = W <= 480 ? 0.8 : 1.0;
      AX = 34 * scale;
      AY = 63 * scale;
      SEG = 9 * scale;
      L = N * SEG;
      CLICK = 22 * scale;
      MAXS = 54 * scale;
      activeWire = wireLength ?? (W <= 480 ? 36 : (H < 760 ? 52 : 72));

      if (!pts.length) {
        const [ax, ay] = anchor();
        for (let i = 0; i <= N; i++) {
          pts.push({ x: ax, y: ay + i * SEG, vx: 0, vy: 0 });
        }
        // Subtle welcoming physical pendulum sway on mount (strictly below click threshold)
        if (!reducedMotion) {
          TH.v = 0.18;
          pts[N].vx = 75 * scale;
        }
      } else if (prevW !== W) {
        const dx = (W - prevW) / 2;
        for (let i = 0; i <= N; i++) {
          pts[i].x += dx;
        }
      }
    };

    measure();

    const flip = (to = !on) => {
      if (to === on) return;
      if (clock - lastToggleTime < LOCKOUT_SEC) return;
      lastToggleTime = clock;

      on = to;
      setAriaChecked(on);

      // Bulb pops (scale 1.35 on, 0.8 off) & lamp gets downward kick
      BP.x = on ? 1.35 : 0.8;
      TUG.v += 150;

      // Lamp is single source of truth: Write theme directly once
      const themeName = on ? 'light' : 'dark';
      setStorageItem('theme', themeName);
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', themeName);
        document.documentElement.dataset.theme = themeName;
      }

      // Notify parent callback for card styling sync
      onToggleRef.current?.(on);
    };

    const pin = (): [number, number] | null => {
      if (held) return [held.x, held.y];
      if (ghost) return [HX.x, HY.x];
      return null;
    };

    const pull = () => {
      if (ghost || held || clock - lastToggleTime < LOCKOUT_SEC) return;
      const b = pts[N];
      ghost = true;
      armed = true;
      side = -side;
      HX.x = b.x;
      HY.x = b.y;
      HX.v = b.vx;
      HY.v = b.vy;
      const [ax, ay] = anchor();
      HX.t = ax + side * 22 * scale;
      HY.t = ay + L + 60 * scale;

      // Auto-release safety timeout so ghost pull can never get permanently stuck
      after(0.7, () => {
        ghost = false;
      });
    };

    const getLocalCoords = (e: PointerEvent): [number, number] => {
      const r = scene.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };

    const onPointerDown = (e: PointerEvent) => {
      const [x, y] = getLocalCoords(e);
      const b = pts[N];
      held = {
        id: e.pointerId,
        x: b.x,
        y: b.y,
        ox: b.x - x,
        oy: b.y - y,
        moved: 0,
        sx: x,
        sy: y,
        flipped: false,
      };
      ghost = false;
      // Only arm if cord is near slack
      if (stretch < 8 * scale) {
        armed = true;
      }
      try {
        grab.setPointerCapture(e.pointerId);
      } catch {
        // ignore capture failures
      }
      setIsHeld(true);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!held || e.pointerId !== held.id) return;
      const [x, y] = getLocalCoords(e);
      held.x = x + held.ox;
      held.y = y + held.oy;
      held.moved = Math.max(held.moved, Math.hypot(x - held.sx, y - held.sy));
    };

    const onDrop = (e: PointerEvent) => {
      if (!held || e.pointerId !== held.id) return;
      const isTap = held.moved < 5 && !held.flipped && e.type === 'pointerup';
      try {
        grab.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      held = null;
      setIsHeld(false);
      if (isTap) {
        pull();
      }
    };

    const onClick = (e: MouseEvent) => {
      // Keyboard Enter/Space activation (e.detail === 0)
      if (!e.detail) {
        pull();
      }
    };

    grab.addEventListener('pointerdown', onPointerDown);
    grab.addEventListener('pointermove', onPointerMove);
    grab.addEventListener('pointerup', onDrop);
    grab.addEventListener('pointercancel', onDrop);
    grab.addEventListener('click', onClick);

    let rafId = 0;
    let last = performance.now();

    const frame = (dt: number) => {
      clock += dt;
      [TH, TUG, R, BP, HX, HY, K].forEach((s) => stepSpring(s, dt));
      if (dt <= 0) return;

      const [ax, ay] = anchor();
      const p = pin();
      const b = pts[N];

      let px = 0;
      let py = 0;
      stretch = 0;
      lean = 0;

      if (p) {
        const dx = p[0] - ax;
        const dy = p[1] - ay;
        const d = Math.hypot(dx, dy) || 1;
        const over = Math.max(0, d - L);
        const give = MAXS * (1 - Math.exp(-over / 70));
        const r = Math.min(d, L) + give;
        px = ax + (dx / d) * r;
        py = ay + (dy / d) * r;
        stretch = give;
        lean = over > 0 ? dx / d : 0;
        if (over > 0) {
          K.x = K.t = r / L;
          K.v = 0;
        }

        // Toggle condition: armed + stretch exceeds CLICK + lockout passed
        if (armed && give > CLICK && clock - lastToggleTime >= LOCKOUT_SEC) {
          armed = false;
          flip();
          if (held) {
            held.flipped = true;
          } else {
            // Tap ghost pull: let go quickly once toggled
            after(0.12, () => {
              ghost = false;
            });
          }
        }
      }

      // Re-arm condition:
      // After a toggle, armed stays false until the cord returns slack (stretch < 6px) and ghost is false.
      // Holding the cord down past the threshold will NOT keep toggling.
      if (!armed && stretch < 6 * scale && !ghost) {
        armed = true;
      }

      if (!p || !stretch) K.t = 1;
      const seg = SEG * Math.max(1, K.x);
      TUG.t = stretch * 0.22;
      TH.t = clamp((-lean * stretch) / MAXS * 0.5, -0.3, 0.3);

      // Verlet rope integration with gravity (2600 px/s²) + damping
      const prev = pts.map((q) => [q.x, q.y] as const);
      for (let i = 1; i <= N; i++) {
        const q = pts[i];
        const k = Math.exp(-(i === N ? 1.1 : 2.4) * dt);
        q.vy += 2600 * dt;
        q.vx *= k;
        q.vy *= k;
        const sp = Math.hypot(q.vx, q.vy);
        if (sp > 2600) {
          q.vx *= 2600 / sp;
          q.vy *= 2600 / sp;
        }
        q.x += q.vx * dt;
        q.y += q.vy * dt;
      }

      // Distance constraint relaxation (8 passes)
      for (let it = 0; it < 8; it++) {
        pts[0].x = ax;
        pts[0].y = ay;
        if (p) {
          b.x = px;
          b.y = py;
        }
        for (let i = 0; i < N; i++) {
          const a = pts[i];
          const c = pts[i + 1];
          const dx = c.x - a.x;
          const dy = c.y - a.y;
          const d = Math.hypot(dx, dy) || 1e-6;
          const f = ((d - seg) / d) * 0.5;
          const wa = i === 0 ? 0 : 1;
          const wc = i + 1 === N ? (p ? 0 : 0.3) : 1;
          const sum = wa + wc || 1;
          a.x += ((dx * f * wa) / sum) * 2;
          a.y += ((dy * f * wa) / sum) * 2;
          c.x -= ((dx * f * wc) / sum) * 2;
          c.y -= ((dy * f * wc) / sum) * 2;
        }
      }

      pts[0].x = ax;
      pts[0].y = ay;
      if (p) {
        b.x = px;
        b.y = py;
      }
      for (let i = 1; i <= N; i++) {
        pts[i].vx = (pts[i].x - prev[i][0]) / dt;
        pts[i].vy = (pts[i].y - prev[i][1]) / dt;
      }

      R.t = on ? 1 : 0;
      if (on) {
        tuneSpring(R, 120, 21, reducedMotion);
      } else {
        tuneSpring(R, 170, 27, reducedMotion);
      }
    };

    const render = () => {
      if (scene.clientWidth !== W || scene.clientHeight !== H) measure();
      const th = TH.x;
      const tug = TUG.x;
      const b = pts[N];
      const e = pts[N - 1];

      let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
      for (let i = 1; i < N; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2;
        const my = (pts[i].y + pts[i + 1].y) / 2;
        d += `Q${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
      }
      d += `L${b.x.toFixed(1)} ${b.y.toFixed(1)}`;

      const ang = Math.atan2(e.x - b.x, b.y - e.y);
      const wl = activeWire + tug - 4;
      const wd = `M${(W / 2).toFixed(1)} -4L${(W / 2 - Math.sin(th) * wl).toFixed(2)} ${(
        Math.cos(th) * wl
      ).toFixed(2)}`;

      [darkEls, lightEls].forEach((o) => {
        if (o.lamp) o.lamp.style.transform = `rotate(${th.toFixed(4)}rad)`;
        if (o.wire) o.wire.setAttribute('d', wd);
        if (o.head) {
          o.head.style.transform = `translateY(${(activeWire + tug).toFixed(2)}px) scale(${scale})`;
        }
        if (o.bulb) {
          o.bulb.style.transform = `scale(${(BP.x * scale).toFixed(4)})`;
        }
        if (o.path) o.path.setAttribute('d', d);
        if (o.bead) {
          o.bead.style.transform = `translate(${b.x.toFixed(2)}px,${b.y.toFixed(
            2
          )}px) rotate(${ang.toFixed(4)}rad) scale(${scale})`;
        }
      });

      grab.style.transform = `translate(${b.x.toFixed(2)}px,${b.y.toFixed(2)}px) scale(${scale})`;

      // Circular light flood expanding outward from the bulb center
      const [bx, by] = bulbAt();
      const far = Math.hypot(Math.max(bx, W - bx), Math.max(by, H - by)) + 24;
      const radius = Math.max(0, R.x) * far;
      lit.style.visibility = radius < 4 ? 'hidden' : 'visible';
      lit.style.clipPath = `circle(${radius.toFixed(1)}px at ${bx.toFixed(1)}px ${by.toFixed(1)}px)`;
    };

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      for (let i = timers.length - 1; i >= 0; i--) {
        if ((timers[i].t -= dt) <= 0) {
          timers.splice(i, 1)[0].fn();
        }
      }

      // 4 physics sub-steps per frame for stability
      const sub = 4;
      for (let k = 0; k < sub; k++) {
        frame(dt / sub);
      }
      render();
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      grab.removeEventListener('pointerdown', onPointerDown);
      grab.removeEventListener('pointermove', onPointerMove);
      grab.removeEventListener('pointerup', onDrop);
      grab.removeEventListener('pointercancel', onDrop);
      grab.removeEventListener('click', onClick);
    };
  }, [initialLit, wireLength]);

  return (
    <div
      ref={sceneRef}
      className={`pull-cord-scene ${className}`}
    >
      {/* Layer 1: Dark Obsidian Room */}
      <div ref={darkRoomRef} className="pull-cord-room pull-cord-dark" aria-hidden="true">
        <RoomFixture isLit={false} />
      </div>

      {/* Layer 2: Warm Peach Lit Room (clipped to expanding circle from bulb) */}
      <div
        ref={litLayerRef}
        className="pull-cord-room pull-cord-light"
        aria-hidden="true"
      >
        <RoomFixture isLit={true} />
      </div>

      {/* The single accessible interactive pull bead handle */}
      <button
        ref={grabRef}
        type="button"
        role="switch"
        aria-checked={ariaChecked}
        aria-label={ariaChecked ? 'Turn off ceiling light' : 'Pull cord to turn on ceiling light'}
        title="Pull or click to toggle lighting"
        className={`pull-cord-grab ${isHeld ? 'is-held' : ''}`}
      />
    </div>
  );
}

export default PullCord;
