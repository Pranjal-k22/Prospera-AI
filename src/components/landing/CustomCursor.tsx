'use client';

import React, { useEffect, useState, useRef } from 'react';

/**
 * Custom Cursor Component
 * Active on desktop pointer devices with fine control only.
 * Respects prefers-reduced-motion and preserves text carets on form fields.
 */
export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    // Check if device supports fine hover and user does not prefer reduced motion
    const hasFineHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasFineHover || prefersReducedMotion) {
      return;
    }

    const timer = setTimeout(() => {
      setEnabled(true);
    }, 0);
    document.documentElement.classList.add('custom-cursor-enabled');

    let mouseX = -100;
    let mouseY = -100;
    let rafId: number | null = null;

    const render = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    const onPointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (hidden) setHidden(false);

      // Check if target is a form input where native caret is required
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        setHidden(true);
        return;
      } else {
        setHidden(false);
      }

      // Check if target or ancestor is clickable
      const isClickable = Boolean(
        target?.closest('a, button, [role="button"], input, select, .clickable, [data-clickable="true"]')
      );
      setHovered(isClickable);
    };

    const onPointerDown = () => setPressed(true);
    const onPointerUp = () => setPressed(false);
    const onMouseLeave = () => setHidden(true);
    const onMouseEnter = () => setHidden(false);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    document.documentElement.addEventListener('mouseenter', onMouseEnter);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      document.documentElement.classList.remove('custom-cursor-enabled');
      clearTimeout(timer);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      document.documentElement.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [hidden]);

  if (!enabled) return null;

  let sizeClass = 'w-[26px] h-[26px] bg-[#483e44]/55 dark:bg-white/45 border-0';
  if (pressed) {
    sizeClass = 'w-[44px] h-[44px] bg-transparent border-[5px] border-[#483e44]/65 dark:border-white/65';
  } else if (hovered) {
    sizeClass = 'w-[38px] h-[38px] bg-[#483e44]/35 dark:bg-white/30 border border-white/40 dark:border-white/30 backdrop-blur-[2px]';
  }

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={`pointer-events-none fixed top-0 left-0 z-[99999] rounded-full transition-[width,height,border,background-color] duration-250 ease-[var(--out,cubic-bezier(0.16,1,0.3,1))] ${
        hidden ? 'opacity-0' : 'opacity-100'
      } ${sizeClass}`}
      style={{
        willChange: 'transform',
      }}
    />
  );
}
