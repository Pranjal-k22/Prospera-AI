'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface GlassPillProps extends HTMLMotionProps<'div'> {
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'accent' | 'hot' | 'warm' | 'won' | 'risk' | 'cold';
  interactive?: boolean;
}

export const GlassPill = React.forwardRef<HTMLDivElement, GlassPillProps>(
  ({ children, className = '', variant = 'default', interactive = false, ...props }, ref) => {
    const variantStyles = {
      default: 'text-[var(--text)] border-[var(--glass-border)]',
      accent: 'text-[var(--accent)] border-[var(--accent)]/40 bg-[var(--accent-subtle)]',
      hot: 'text-[#FF453A] border-[#FF453A]/30 bg-[#FF453A]/10',
      warm: 'text-[#FFB020] border-[#FFB020]/30 bg-[#FFB020]/10',
      won: 'text-[#30C48D] border-[#30C48D]/30 bg-[#30C48D]/10',
      risk: 'text-[#FF453A] border-[#FF453A]/35 bg-[#FF453A]/15 font-medium',
      cold: 'text-[var(--text-3)] border-[var(--glass-border)] bg-black/5 dark:bg-white/5',
    }[variant];

    return (
      <motion.div
        ref={ref}
        whileHover={interactive ? { scale: 1.03, y: -1 } : undefined}
        whileTap={interactive ? { scale: 0.97 } : undefined}
        className={`glass-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border shadow-xs transition-colors duration-200 ${variantStyles} ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassPill.displayName = 'GlassPill';

