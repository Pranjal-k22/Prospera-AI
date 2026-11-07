'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { defaultSpring } from '@/lib/motion';

export interface TimelineStep {
  step: string;
  description: string;
  date?: string;
  completed: boolean;
  current?: boolean;
  isRisk?: boolean;
}

interface TimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ steps, className = '' }) => {
  return (
    <div className={`relative pl-6 space-y-8 ${className}`}>
      {/* Self-drawing vertical connecting line */}
      <div className="absolute top-3 bottom-3 left-2.5 w-[2px] bg-black/10 dark:bg-white/15 rounded-full" />
      <motion.div
        initial={{ height: '0%' }}
        animate={{
          height: `${Math.min(
            100,
            ((steps.filter((s) => s.completed).length) / Math.max(1, steps.length - 1)) * 100
          )}%`,
        }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-3 left-2.5 w-[2px] bg-[var(--accent)] rounded-full origin-top shadow-[0_0_8px_var(--accent-glow)]"
      />

      {steps.map((item, index) => {
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...defaultSpring, delay: index * 0.08 }}
            className="relative flex items-start gap-4 group"
          >
            {/* Node Icon Indicator */}
            <div className="absolute -left-6 mt-0.5 flex items-center justify-center">
              {item.completed ? (
                <div className="w-5 h-5 rounded-full bg-[#30C48D] text-white flex items-center justify-center shadow-[0_0_10px_rgba(48,196,141,0.5)]">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              ) : item.current ? (
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-6 h-6 rounded-full bg-[var(--accent)]/30 animate-ping" />
                  <div className="w-5 h-5 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-[0_0_12px_var(--accent-glow)]">
                    <Clock className="w-3 h-3 stroke-[2.5]" />
                  </div>
                </div>
              ) : item.isRisk ? (
                <div className="w-5 h-5 rounded-full bg-[#FF453A] text-white flex items-center justify-center shadow-[0_0_10px_rgba(255,69,58,0.5)]">
                  <AlertCircle className="w-3 h-3 stroke-[3]" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-black/20 dark:border-white/25 bg-[var(--bg)]" />
              )}
            </div>

            {/* Content Card */}
            <div className="flex-1 glass-card p-3.5 rounded-2xl border border-[var(--glass-border)] bg-white/50 dark:bg-white/5 backdrop-blur-md">
              <div className="flex items-center justify-between gap-2">
                <h4
                  className={`text-sm font-semibold leading-tight ${
                    item.current ? 'text-[var(--accent)]' : 'text-[var(--text)]'
                  }`}
                >
                  {item.step}
                </h4>
                {item.date && (
                  <span className="font-mono text-[10px] text-[var(--text-3)] bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-full">
                    {item.date}
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-2)] mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

