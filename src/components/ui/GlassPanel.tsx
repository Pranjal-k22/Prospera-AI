'use client';

import React, { useRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface GlassPanelProps extends HTMLMotionProps<'div'> {
  children?: React.ReactNode;
  className?: string;
  strong?: boolean;
  spotlight?: boolean;
}

export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ children, className = '', strong = false, spotlight = true, onPointerMove, ...props }, ref) => {
    const panelRef = useRef<HTMLDivElement | null>(null);

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (spotlight && panelRef.current) {
        const rect = panelRef.current.getBoundingClientRect();
        panelRef.current.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        panelRef.current.style.setProperty('--my', `${e.clientY - rect.top}px`);
      }
      if (onPointerMove) onPointerMove(e);
    };

    return (
      <motion.div
        ref={(node) => {
          panelRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        onPointerMove={handlePointerMove}
        className={`glass-panel ${strong ? 'glass-strong' : ''} ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassPanel.displayName = 'GlassPanel';

