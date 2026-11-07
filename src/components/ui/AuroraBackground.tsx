'use client';

import React from 'react';

/**
 * Aurora Background: 4 large blurred gradient blobs drifting slowly
 * behind the content, plus a faint 3% noise texture overlay to eliminate banding.
 */
export const AuroraBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Drifting Aurora Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Blob 1: Sky Blue */}
        <div
          className="absolute -top-[20%] -left-[10%] w-[65vw] h-[65vw] max-w-[850px] max-h-[850px] rounded-full filter blur-[110px] opacity-70 animate-[aurora-drift-1_45s_infinite_ease-in-out]"
          style={{ background: 'var(--blob-1)' }}
        />
        {/* Blob 2: Lilac */}
        <div
          className="absolute -top-[15%] right-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full filter blur-[120px] opacity-60 animate-[aurora-drift-2_52s_infinite_ease-in-out]"
          style={{ background: 'var(--blob-2)' }}
        />
        {/* Blob 3: Mint */}
        <div
          className="absolute bottom-[-15%] -left-[5%] w-[65vw] h-[65vw] max-w-[850px] max-h-[850px] rounded-full filter blur-[110px] opacity-55 animate-[aurora-drift-3_48s_infinite_ease-in-out]"
          style={{ background: 'var(--blob-3)' }}
        />
        {/* Blob 4: Peach / Warm Amber */}
        <div
          className="absolute -bottom-[20%] right-[-10%] w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full filter blur-[130px] opacity-60 animate-[aurora-drift-4_58s_infinite_ease-in-out]"
          style={{ background: 'var(--blob-4)' }}
        />

        {/* 3% SVG Noise Texture to eliminate color banding */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Main Content Layer */}
      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>
    </div>
  );
};

