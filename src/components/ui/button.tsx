'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useSpring, type HTMLMotionProps } from 'framer-motion';
import { Loader2, Check } from 'lucide-react';
import { snappySpring } from '@/lib/motion';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'glass' | 'ghost' | 'danger' | 'success' | 'default' | 'outline' | 'secondary' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'default' | 'xs' | 'icon' | 'icon-sm' | 'icon-lg';
  magnetic?: boolean;
  loading?: boolean;
  success?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'glass',
      size = 'md',
      magnetic = false,
      loading = false,
      success = false,
      iconLeft,
      iconRight,
      children,
      className = '',
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const [ripples, setRipples] = useState<Ripple[]>([]);
    const [isHovered, setIsHovered] = useState(false);

    // Magnetic physics spring
    const magneticX = useSpring(0, { stiffness: 350, damping: 25 });
    const magneticY = useSpring(0, { stiffness: 350, damping: 25 });

    const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!magnetic || disabled || loading) return;
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = (e.clientX - centerX) * 0.22;
        const dy = (e.clientY - centerY) * 0.22;
        magneticX.set(Math.max(-6, Math.min(6, dx)));
        magneticY.set(Math.max(-6, Math.min(6, dy)));
      }
    };

    const handlePointerLeave = () => {
      setIsHovered(false);
      magneticX.set(0);
      magneticY.set(0);
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;

      // Create subtle ripple
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const rippleSize = Math.max(rect.width, rect.height) * 1.6;
        const x = e.clientX - rect.left - rippleSize / 2;
        const y = e.clientY - rect.top - rippleSize / 2;
        const newRipple: Ripple = { id: Date.now(), x, y, size: rippleSize };
        setRipples((prev) => [...prev.slice(-3), newRipple]);
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, 400);
      }

      if (onClick) onClick(e);
    };

    // Variant style normalization
    const normalizedVariant =
      variant === 'default'
        ? 'primary'
        : variant === 'outline' || variant === 'secondary'
        ? 'glass'
        : variant === 'destructive'
        ? 'danger'
        : variant;

    const normalizedSize = size === 'default' ? 'md' : size === 'xs' ? 'sm' : size;

    const baseStyles =
      'relative inline-flex items-center justify-center font-medium select-none overflow-hidden outline-none cursor-pointer border transition-colors focus-visible:ring-3 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2';

    const sizeStyles = {
      sm: 'h-8 px-3.5 text-xs rounded-full gap-1.5',
      md: 'h-10 px-5 text-sm rounded-full gap-2',
      lg: 'h-12 px-7 text-base rounded-full gap-2.5 shadow-md',
      icon: 'h-10 w-10 p-0 rounded-full',
      'icon-sm': 'h-8 w-8 p-0 rounded-full',
      'icon-lg': 'h-12 w-12 p-0 rounded-full',
    }[normalizedSize] || 'h-10 px-5 text-sm rounded-full gap-2';

    const variantStyles = {
      primary:
        'bg-[var(--accent)] text-white border-transparent shadow-[0_4px_16px_var(--accent-glow)] hover:shadow-[0_6px_22px_var(--accent-glow)] hover:brightness-105 active:brightness-95',
      glass:
        'glass-pill text-[var(--text)] border-[var(--glass-border)] hover:bg-white/80 dark:hover:bg-white/15 hover:shadow-[0_6px_20px_rgba(15,25,50,0.12)]',
      ghost:
        'bg-transparent text-[var(--text-2)] hover:text-[var(--text)] border-transparent hover:bg-black/5 dark:hover:bg-white/5',
      danger:
        'bg-[#FF453A] text-white border-transparent shadow-[0_4px_16px_rgba(255,69,58,0.3)] hover:shadow-[0_6px_22px_rgba(255,69,58,0.4)] hover:brightness-105',
      success:
        'bg-[#30C48D] text-white border-transparent shadow-[0_4px_16px_rgba(48,196,141,0.3)] hover:shadow-[0_6px_22px_rgba(48,196,141,0.4)] hover:brightness-105',
      link: 'bg-transparent text-[var(--accent)] underline-offset-4 hover:underline border-transparent shadow-none',
    }[normalizedVariant] || 'glass-pill text-[var(--text)]';

    const disabledStyles = disabled
      ? 'opacity-40 pointer-events-none cursor-not-allowed shadow-none'
      : '';

    return (
      <motion.button
        ref={(node) => {
          buttonRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }}
        style={{
          x: magneticX,
          y: magneticY,
        }}
        whileHover={!disabled && !loading ? { y: -1 } : undefined}
        whileTap={!disabled && !loading ? { scale: 0.97 } : undefined}
        transition={snappySpring}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
        onClick={handleClick}
        disabled={disabled || loading}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${disabledStyles} ${className} group`}
        {...props}
      >
        {/* Shine Sweep Layer across button on hover */}
        <span
          className={`absolute inset-0 -translate-x-full pointer-events-none bg-gradient-to-r from-transparent via-white/35 dark:via-white/20 to-transparent transition-transform duration-700 ease-in-out ${
            isHovered && !loading && !disabled ? 'translate-x-full' : ''
          }`}
          aria-hidden="true"
        />

        {/* Dynamic Click Ripple Elements */}
        {ripples.map((r) => (
          <span
            key={r.id}
            className="absolute rounded-full pointer-events-none bg-white/40 dark:bg-white/25 animate-[ripple_400ms_ease-out_forwards]"
            style={{
              top: r.y,
              left: r.x,
              width: r.size,
              height: r.size,
            }}
          />
        ))}

        {/* Content with Loading / Success Morph */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.span
              key="btn-loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="inline-flex items-center gap-2"
            >
              <Loader2 className="w-4 h-4 animate-spin text-inherit" />
              <span>Processing...</span>
            </motion.span>
          ) : success ? (
            <motion.span
              key="btn-success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="inline-flex items-center gap-1.5 font-semibold text-emerald-400 dark:text-emerald-300"
            >
              <Check className="w-4 h-4" />
              <span>Confirmed</span>
            </motion.span>
          ) : (
            <motion.span
              key="btn-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-2"
            >
              {iconLeft && (
                <span className="transition-transform duration-200 group-hover:-rotate-6 inline-flex">
                  {iconLeft}
                </span>
              )}
              <span>{children}</span>
              {iconRight && (
                <span className="transition-transform duration-200 group-hover:translate-x-1 inline-flex">
                  {iconRight}
                </span>
              )}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
