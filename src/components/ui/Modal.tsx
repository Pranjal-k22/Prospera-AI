'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { fadeInScale } from '@/lib/motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }[maxWidth];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Frosted Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md"
          />

          {/* Liquid Glass Dialog Body */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            aria-describedby={description ? 'modal-description' : undefined}
            variants={fadeInScale}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`relative w-full ${maxWidthStyles} glass-panel bg-white/85 dark:bg-[#070B14]/90 backdrop-blur-3xl border border-[var(--glass-border)] rounded-3xl p-6 shadow-2xl z-10 overflow-hidden`}
          >
            {/* Top Bar with Title and Close Button */}
            {(title || description) && (
              <div className="flex items-start justify-between mb-5">
                <div>
                  {title && <h3 id="modal-title" className="text-xl font-serif font-bold text-[var(--text)] tracking-tight">{title}</h3>}
                  {description && <p id="modal-description" className="text-xs text-[var(--text-2)] mt-1">{description}</p>}
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="rounded-full p-1.5 text-[var(--text-3)] hover:text-[var(--text)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {!title && (
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="absolute top-4 right-4 rounded-full p-1.5 text-[var(--text-3)] hover:text-[var(--text)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

