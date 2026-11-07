'use client';
import { useEffect, useState } from 'react';

export function AdminLoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const intervalTime = 40;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const percent = Math.min(100, Math.floor((currentStep / steps) * 100));
      const jitter = Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0;
      setProgress(prev => Math.min(100, Math.max(prev, percent + jitter)));

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(onComplete, 300);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 text-slate-900">
      <div className="w-full max-w-md p-8 bg-white border border-slate-200 rounded-2xl shadow-lg flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-xl shadow-md shadow-indigo-100 mb-5">
          P
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Prospera AI Deal Room</h2>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-6">
          Initializing Intelligence Pipeline
        </p>

        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-3">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-150 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="w-full flex justify-between text-xs text-slate-500 font-medium">
          <span>Loading verified inventory...</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
}
