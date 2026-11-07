'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ScoreRingProps {
  score: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showSubtext?: boolean;
  className?: string;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 'md',
  label = 'AI FIT',
  showSubtext = true,
  className = '',
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(Math.max(0, Math.min(100, score)));
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  // Dimension config
  const config = {
    sm: { dimension: 44, strokeWidth: 3.5, radius: 18, fontSize: 'text-sm', labelSize: 'text-[8px]' },
    md: { dimension: 74, strokeWidth: 5.5, radius: 31, fontSize: 'text-2xl', labelSize: 'text-[9px]' },
    lg: { dimension: 110, strokeWidth: 7, radius: 46, fontSize: 'text-4xl', labelSize: 'text-[11px]' },
  }[size];

  const circumference = 2 * Math.PI * config.radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  // Color selection
  const getColor = (val: number) => {
    if (val >= 85) return 'text-[#30C48D] stroke-[#30C48D]';
    if (val >= 70) return 'text-[#0A84FF] stroke-[#0A84FF]';
    if (val >= 50) return 'text-[#FFB020] stroke-[#FFB020]';
    return 'text-[#FF453A] stroke-[#FF453A]';
  };

  const colorClass = getColor(score);

  return (
    <div className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}>
      <div className="relative flex items-center justify-center" style={{ width: config.dimension, height: config.dimension }}>
        <svg
          width={config.dimension}
          height={config.dimension}
          viewBox={`0 0 ${config.dimension} ${config.dimension}`}
          className="transform -rotate-90 origin-center"
        >
          {/* Subtle Track Ring */}
          <circle
            cx={config.dimension / 2}
            cy={config.dimension / 2}
            r={config.radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            className="text-black/5 dark:text-white/10"
          />

          {/* Active Animated Score Path */}
          <motion.circle
            cx={config.dimension / 2}
            cy={config.dimension / 2}
            r={config.radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            strokeLinecap="round"
            className={`${colorClass} drop-shadow-[0_0_8px_rgba(10,132,255,0.35)]`}
          />
        </svg>

        {/* Center Number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-serif font-bold tracking-tight text-[var(--text)] ${config.fontSize} leading-none`}>
            {animatedScore}
          </span>
          {showSubtext && size !== 'sm' && (
            <span className={`font-mono uppercase font-semibold text-[var(--text-3)] ${config.labelSize} tracking-wider mt-0.5`}>
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

