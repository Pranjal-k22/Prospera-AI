'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { initFogShader, FogShaderContext } from './fog-shader';

export interface UseFogClockOptions {
  /** Target time: false = morning (k=0), true = night (k=1) */
  initialNight?: boolean;
  /** Whether to play the intro fog rise animation on mount */
  playIntro?: boolean;
  /** Fast intro duration (e.g. 700ms for direct URL navigation) */
  fastIntro?: boolean;
  /** Callback fired at the deepest sink point (SINK = 240ms) when layers swap unseen */
  onSwap?: (toNight: boolean) => void;
  /** Custom glow point [x, y], defaults to [0.72, 0.74] */
  glowPos?: { x: number; y: number };
}

export interface FogClockDebugState {
  d: number;
  y: number;
  surge: number;
  dip: number;
  k: number;
  k2: number;
  isNight: boolean;
  animating: boolean;
  isIntro: boolean;
  fps: number;
}

export const SINK = 240;
export const RISE = 820;
export const DEPTH = 0.27;

export function clamp(x: number, a = 0, b = 1): number {
  return Math.min(b, Math.max(a, x));
}

export function smooth(a: number, b: number, x: number): number {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}

export function useFogClock(
  heroRef: React.RefObject<HTMLElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  options: UseFogClockOptions = {}
) {
  const {
    initialNight = false,
    playIntro = true,
    fastIntro = false,
    onSwap,
    glowPos = { x: 0.72, y: 0.74 },
  } = options;

  const [isNight, setIsNight] = useState<boolean>(initialNight);
  const [debugState, setDebugState] = useState<FogClockDebugState>({
    d: 0,
    y: 0,
    surge: 0,
    dip: 0,
    k: initialNight ? 1 : 0,
    k2: initialNight ? 1 : 0,
    isNight: initialNight,
    animating: false,
    isIntro: playIntro,
    fps: 60,
  });

  // Internal animation state ref (no re-renders per frame)
  const stateRef = useRef({
    night: initialNight,
    target: initialNight ? 1 : 0,
    from: initialNight ? 1 : 0,
    k: initialNight ? 1 : 0,
    k2: initialNight ? 1 : 0,
    animating: false,
    isIntro: playIntro,
    introStart: 0,
    introDuration: fastIntro ? 700 : 1100,
    start: 0,
    swapped: false,
    queued: null as number | null,
    heroHeight: 900,
    isVisible: true,
    fps: 60,
    lastFrameTime: 0,
    glowX: glowPos.x,
    glowY: glowPos.y,
  });

  const shaderRef = useRef<FogShaderContext | null>(null);
  const rAFRef = useRef<number | null>(null);

  useEffect(() => {
    stateRef.current.glowX = glowPos.x;
    stateRef.current.glowY = glowPos.y;
  }, [glowPos.x, glowPos.y]);

  // Switch time of day function
  const setTime = useCallback((toNight: boolean) => {
    const s = stateRef.current;
    const targetVal = toNight ? 1 : 0;

    // Check reduced motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      s.target = targetVal;
      s.from = targetVal;
      s.k = targetVal;
      s.k2 = targetVal;
      s.night = toNight;
      s.animating = false;
      s.isIntro = false;
      setIsNight(toNight);
      if (onSwap) onSwap(toNight);
      if (heroRef.current) {
        heroRef.current.style.setProperty('--sink', '0px');
        heroRef.current.style.setProperty('--k', targetVal.toString());
        heroRef.current.style.setProperty('--k2', targetVal.toString());
        heroRef.current.style.setProperty('--dip', '0');
      }
      return;
    }

    if (s.animating || s.isIntro) {
      if (s.target !== targetVal) {
        s.queued = targetVal;
      }
      return;
    }

    if (s.night === toNight && !s.animating) return;

    const now = performance.now();
    s.target = targetVal;
    s.from = s.k;
    s.start = now;
    s.swapped = false;
    s.animating = true;
    s.isIntro = false;
  }, [heroRef, onSwap]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize WebGL2 shader
    const shader = initFogShader(canvas);
    shaderRef.current = shader;

    // Set initial CSS variables on the hero element
    const s = stateRef.current;
    hero.style.setProperty('--sink', '0px');
    hero.style.setProperty('--k', s.k.toFixed(3));
    hero.style.setProperty('--k2', s.k2.toFixed(3));
    hero.style.setProperty('--dip', s.isIntro && !prefersReducedMotion ? '1.0' : '0.0');

    // Setup initial sizing
    const updateSize = () => {
      const rect = hero.getBoundingClientRect();
      s.heroHeight = rect.height || window.innerHeight;
      if (shader) {
        shader.resize(rect.width || window.innerWidth, s.heroHeight);
      }
    };
    updateSize();

    // ResizeObserver on the hero container
    const ro = new ResizeObserver(() => {
      updateSize();
    });
    ro.observe(hero);

    // IntersectionObserver to pause rendering when hero is out of view
    // (modal container scroll support)
    const modalScrollEl = hero.closest('.overflow-y-auto') || null;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          s.isVisible = entry.isIntersecting;
        }
      },
      { root: modalScrollEl, threshold: 0.05 }
    );
    io.observe(hero);

    // Handle visibilitychange (e.g. tab hidden)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        s.isVisible = false;
      } else {
        s.isVisible = true;
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Intro initiation
    if (s.isIntro && !prefersReducedMotion) {
      s.introStart = performance.now();
    } else {
      s.isIntro = false;
    }

    let debugTick = 0;

    // Main rAF Animation Clock Loop
    const frame = (now: number) => {
      // Calculate delta FPS
      if (s.lastFrameTime > 0) {
        const delta = now - s.lastFrameTime;
        if (delta > 0) {
          s.fps = Math.round(1000 / delta);
        }
      }
      s.lastFrameTime = now;

      let y = 0;
      let surge = 0;
      let dip = 0;
      let currentD = 0;

      // 1. Handle Intro Animation
      if (s.isIntro && !prefersReducedMotion) {
        const d = now - s.introStart;
        currentD = d;
        const dur = s.introDuration;

        if (d < dur) {
          const x = clamp(d / dur);
          y = Math.pow(1 - x, 3.4) * DEPTH;
          surge = 1 - smooth(70, dur * 0.92, d);
          dip = 1 - smooth(100, dur * 0.8, d);
        } else {
          s.isIntro = false;
          y = 0;
          surge = 0;
          dip = 0;
        }
      }
      // 2. Handle Switch Animation
      else if (s.animating && !prefersReducedMotion) {
        const d = now - s.start;
        currentD = d;

        if (d < SINK) {
          const x = d / SINK;
          y = x * x * (3 - 2 * x) * DEPTH;
        } else {
          if (!s.swapped) {
            s.swapped = true;
            s.night = s.target === 1;
            setIsNight(s.night);
            if (onSwap) onSwap(s.night);
          }
          const x = clamp((d - SINK) / RISE);
          y = Math.pow(1 - x, 3.4) * DEPTH;
        }

        surge = smooth(0, SINK * 0.92, d) * (1 - smooth(SINK + 70, SINK + RISE * 0.92, d));
        dip = smooth(30, 190, d) * (1 - smooth(330, 720, d));
        s.k = s.from + (s.target - s.from) * smooth(120, 520, d);
        s.k2 = s.from + (s.target - s.from) * smooth(340, 760, d);

        if (d >= SINK + RISE) {
          s.animating = false;
          s.k = s.target;
          s.k2 = s.target;
          y = 0;
          surge = 0;
          dip = 0;

          // Process queued state if any
          if (s.queued !== null && s.queued !== s.target) {
            const nextTarget = s.queued;
            s.queued = null;
            s.target = nextTarget;
            s.from = s.k;
            s.start = now;
            s.swapped = false;
            s.animating = true;
          } else {
            s.queued = null;
          }
        }
      }

      // Write CSS variables directly to hero element ref (scoped)
      if (hero) {
        hero.style.setProperty('--sink', (y * s.heroHeight).toFixed(1) + 'px');
        hero.style.setProperty('--k', s.k.toFixed(3));
        hero.style.setProperty('--k2', s.k2.toFixed(3));
        hero.style.setProperty('--dip', dip.toFixed(3));
      }

      // WebGL Draw call
      if (shader && s.isVisible) {
        shader.render(now / 1000, surge, s.k, s.glowX, s.glowY);
      }

      // Periodically update debug telemetry for preview page
      debugTick++;
      if (debugTick % 3 === 0) {
        setDebugState({
          d: Math.round(currentD),
          y: parseFloat(y.toFixed(4)),
          surge: parseFloat(surge.toFixed(4)),
          dip: parseFloat(dip.toFixed(4)),
          k: parseFloat(s.k.toFixed(3)),
          k2: parseFloat(s.k2.toFixed(3)),
          isNight: s.night,
          animating: s.animating,
          isIntro: s.isIntro,
          fps: s.fps,
        });
      }

      rAFRef.current = requestAnimationFrame(frame);
    };

    rAFRef.current = requestAnimationFrame(frame);

    return () => {
      if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      ro.disconnect();
      io.disconnect();
      if (shaderRef.current) {
        shaderRef.current.destroy();
        shaderRef.current = null;
      }
    };
  }, [heroRef, canvasRef, onSwap]);

  return {
    isNight,
    setTime,
    toggleTime: () => setTime(!isNight),
    debugState,
  };
}
