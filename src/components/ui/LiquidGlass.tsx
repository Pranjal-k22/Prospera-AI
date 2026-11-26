'use client';

import React, { useRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { defaultSpring } from '@/lib/motion';

export interface LiquidGlassProps extends HTMLMotionProps<'div'> {
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'bright' | 'tinted' | 'pill';
  hoverLift?: boolean;
  interactive?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

/**
 * Shared LiquidGlass Component
 * Implements the signature two-layer liquid glass recipe:
 * 1. Progressive blur & specular gradient stroke
 * 2. Inner glow & drop shadow
 * 3. Textured inner reflection layer
 * Calibrated for maximum text readability over high-luminance clouds and hero photos.
 */
export const LiquidGlass = React.forwardRef<HTMLDivElement, LiquidGlassProps>(
  (
    {
      children,
      className = '',
      variant = 'default',
      hoverLift = false,
      interactive = false,
      onPointerMove,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLDivElement | null>(null);

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (internalRef.current) {
        const rect = internalRef.current.getBoundingClientRect();
        internalRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        internalRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      }
      if (onPointerMove) onPointerMove(e);
    };

    const variantStyles = {
      default:
        'bg-white/75 dark:bg-[#121622]/80 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-[0_16px_40px_rgba(80,45,35,0.12),inset_0_1px_1px_rgba(255,255,255,0.7)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.12)]',
      elevated:
        'bg-white/85 dark:bg-[#141926]/90 backdrop-blur-2xl border border-white/80 dark:border-white/15 shadow-[0_24px_60px_rgba(70,35,25,0.16),0_4px_16px_rgba(70,35,25,0.06),inset_0_1.5px_2px_rgba(255,255,255,0.9)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)]',
      bright:
        'bg-white/92 dark:bg-[#161c2b]/95 backdrop-blur-2xl border border-white dark:border-white/20 shadow-[0_20px_50px_rgba(90,40,30,0.15),inset_0_2px_2px_rgba(255,255,255,1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)]',
      tinted:
        'bg-[#fbe7da]/70 dark:bg-[#181d2a]/75 backdrop-blur-lg border border-white/40 dark:border-white/10 shadow-[0_12px_32px_rgba(70,40,30,0.08)]',
      pill:
        'bg-white/80 dark:bg-[#141824]/85 backdrop-blur-xl rounded-full border border-white/60 dark:border-white/15 shadow-[0_8px_24px_rgba(70,40,30,0.1),inset_0_1px_1px_rgba(255,255,255,0.7)]'
    }[variant];

    return (
      <motion.div
        ref={(node) => {
          internalRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        onPointerMove={handlePointerMove}
        whileHover={hoverLift ? { y: -4, transition: defaultSpring } : undefined}
        whileTap={interactive ? { scale: 0.985 } : undefined}
        className={cn(
          'relative isolate overflow-hidden transition-all duration-300',
          variantStyles,
          className
        )}
        {...props}
      >
        {/* Specular Inner Glare Sheen */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 via-white/10 to-transparent dark:from-white/10 dark:to-transparent opacity-80"
        />
        {/* Child Content */}
        <div className="relative z-10">{children}</div>
      </motion.div>
    );
  }
);

LiquidGlass.displayName = 'LiquidGlass';
