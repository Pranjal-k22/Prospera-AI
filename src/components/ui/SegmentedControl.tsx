'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { defaultSpring } from '@/lib/motion';

export interface SegmentedOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface SegmentedControlProps {
  options: SegmentedOption[];
  value: string;
  onChange: (id: string) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  layoutId?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  size = 'md',
  className = '',
  layoutId = 'segmented-indicator',
}) => {
  const sizeStyles = {
    sm: 'p-1 text-xs gap-1',
    md: 'p-1.5 text-sm gap-1.5',
    lg: 'p-2 text-base gap-2',
  }[size];

  const itemPadding = {
    sm: 'px-3 py-1',
    md: 'px-4 py-1.5',
    lg: 'px-5 py-2',
  }[size];

  return (
    <div
      role="tablist"
      className={`glass-panel inline-flex items-center rounded-full p-1 border border-[var(--glass-border)] bg-[var(--glass-subtle)] backdrop-blur-xl shadow-inner ${sizeStyles} ${className}`}
    >
      {options.map((option) => {
        const isSelected = option.id === value;

        return (
          <button
            key={option.id}
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(option.id)}
            className={`relative flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 select-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] z-10 ${itemPadding} ${
              isSelected
                ? 'text-[var(--text)] font-semibold'
                : 'text-[var(--text-2)] hover:text-[var(--text)]'
            }`}
          >
            {/* Sliding Pill Thumb (Liquid Glass Capsule) */}
            {isSelected && (
              <motion.div
                layoutId={layoutId}
                transition={defaultSpring}
                className="absolute inset-0 rounded-full bg-white/95 dark:bg-white/18 shadow-[0_4px_14px_rgba(15,25,50,0.1),inset_0_1px_1px_rgba(255,255,255,0.95)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)] border border-white/80 dark:border-white/25 z-[-1]"
              />
            )}

            {option.icon && (
              <span className={`inline-flex transition-transform duration-200 ${isSelected ? 'scale-105 text-[var(--accent)]' : ''}`}>
                {option.icon}
              </span>
            )}
            <span>{option.label}</span>

            {option.count !== undefined && (
              <span
                className={`text-[11px] font-mono px-1.5 py-0.5 rounded-full ${
                  isSelected
                    ? 'bg-black/10 dark:bg-white/20 text-[var(--text)] font-semibold'
                    : 'bg-black/5 dark:bg-white/10 text-[var(--text-3)]'
                }`}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

