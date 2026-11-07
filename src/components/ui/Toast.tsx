'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X, ShieldAlert } from 'lucide-react';
import { defaultSpring } from '@/lib/motion';

export interface ToastItem {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message?: string;
  duration?: number;
}

export interface ToastMethods {
  success: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
}

interface ToastContextType {
  toast: ToastMethods;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((type: ToastItem['type'], title: string, message?: string, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toastMethods: ToastMethods = {
    success: (title: string, message?: string) => addToast('success', title, message),
    warning: (title: string, message?: string) => addToast('warning', title, message),
    info: (title: string, message?: string) => addToast('info', title, message),
    error: (title: string, message?: string) => addToast('error', title, message),
  };

  return (
    <ToastContext.Provider value={{ toast: toastMethods }}>
      {children}
      {/* Toast Render Portal */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((t) => {
            const iconMap = {
              success: <CheckCircle2 className="w-5 h-5 text-[#30C48D] shrink-0" />,
              warning: <AlertTriangle className="w-5 h-5 text-[#FFB020] shrink-0" />,
              info: <Info className="w-5 h-5 text-[#0A84FF] shrink-0" />,
              error: <ShieldAlert className="w-5 h-5 text-[#FF453A] shrink-0" />,
            };

            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 40, scale: 0.94 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 30, scale: 0.94 }}
                transition={defaultSpring}
                className="glass-card pointer-events-auto p-4 rounded-2xl border border-[var(--glass-border)] bg-white/80 dark:bg-[#070B14]/85 backdrop-blur-2xl shadow-xl overflow-hidden relative"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{iconMap[t.type]}</div>
                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className="text-sm font-semibold text-[var(--text)] leading-tight">{t.title}</h4>
                    {t.message && <p className="text-xs text-[var(--text-2)] mt-1 leading-relaxed">{t.message}</p>}
                  </div>
                  <button
                    onClick={() => removeToast(t.id)}
                    className="text-[var(--text-3)] hover:text-[var(--text)] p-1 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Shrinking progress bar */}
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: (t.duration || 4000) / 1000, ease: 'linear' }}
                  className="absolute bottom-0 left-0 h-[2.5px] bg-[var(--accent)] opacity-60"
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return {
    toast: context.toast,
    ...context.toast,
  };
};
