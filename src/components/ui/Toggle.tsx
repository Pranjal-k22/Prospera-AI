'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { snappySpring } from '@/lib/motion';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  className = '',
}) => {
  return (
    <label
      className={`inline-flex items-center gap-3 select-none cursor-pointer ${
        disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
      } ${className}`}
    >
      <div
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!disabled) onChange(!checked);
          }
        }}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-7 w-12 shrink-0 rounded-full border border-black/10 dark:border-white/15 p-0.5 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
          checked ? 'bg-[var(--accent)] shadow-[0_2px_10px_var(--accent-glow)]' : 'bg-black/10 dark:bg-white/10'
        }`}
      >
        <motion.div
          animate={{
            x: checked ? 20 : 0,
          }}
          whileTap={{
            scaleX: 1.25,
            transition: { duration: 0.1 },
          }}
          transition={snappySpring}
          className="h-5.5 w-5.5 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,1)]"
        />
      </div>

      {label && <span className="text-sm font-medium text-[var(--text)]">{label}</span>}
    </label>
  );
};

