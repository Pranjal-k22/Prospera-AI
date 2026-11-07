'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { defaultSpring } from '@/lib/motion';

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  width?: 'md' | 'lg' | 'xl';
}

export const Sheet: React.FC<SheetProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  width = 'lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const widthStyles = {
    md: 'max-w-md',
    lg: 'max-w-xl',
    xl: 'max-w-2xl',
  }[width];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/45 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'sheet-title' : undefined}
              aria-describedby={description ? 'sheet-description' : undefined}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={defaultSpring}
              className={`w-screen ${widthStyles} glass-panel bg-white/92 dark:bg-[#070B14]/92 backdrop-blur-3xl border-l border-[var(--glass-border)] shadow-2xl flex flex-col h-full`}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[var(--glass-border)]">
                <div>
                  {title && <h3 id="sheet-title" className="text-xl font-serif font-bold text-[var(--text)] tracking-tight">{title}</h3>}
                  {description && <p id="sheet-description" className="text-xs text-[var(--text-2)] mt-0.5">{description}</p>}
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close drawer"
                  className="rounded-full p-2 text-[var(--text-3)] hover:text-[var(--text)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

