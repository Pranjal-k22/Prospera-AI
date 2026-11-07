'use client';

import React, { useRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { defaultSpring } from '@/lib/motion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children?: React.ReactNode;
  className?: string;
  hoverLift?: boolean;
  spotlight?: boolean;
  strong?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className = '', hoverLift = false, spotlight = true, strong = false, onPointerMove, ...props }, ref) => {
    const cardRef = useRef<HTMLDivElement | null>(null);

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (spotlight && cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cardRef.current.style.setProperty('--mx', `${x}px`);
        cardRef.current.style.setProperty('--my', `${y}px`);
      }
      if (onPointerMove) {
        onPointerMove(e);
      }
    };

    return (
      <motion.div
        ref={(node) => {
          cardRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        onPointerMove={handlePointerMove}
        whileHover={hoverLift ? { y: -3, transition: defaultSpring } : undefined}
        className={`glass-card ${strong ? 'glass-strong' : ''} ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

