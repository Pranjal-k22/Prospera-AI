'use client';

import React, { useState } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, iconLeft, iconRight, className = '', id, value, defaultValue, onChange, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const [isFocused, setIsFocused] = useState(false);
    const [internalVal, setInternalVal] = useState(value || defaultValue || '');

    const hasValue = Boolean(value !== undefined ? value : internalVal);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalVal(e.target.value);
      if (onChange) onChange(e);
    };

    return (
      <div className="w-full">
        <div
          className={`relative flex items-center rounded-2xl border transition-all duration-200 ${
            error
              ? 'border-[#FF453A] ring-2 ring-[#FF453A]/20 bg-[#FF453A]/5'
              : isFocused
              ? 'border-[var(--accent)] ring-3 ring-[var(--accent)]/20 bg-white/70 dark:bg-white/10 shadow-[0_4px_16px_var(--accent-glow)]'
              : 'border-[var(--glass-border)] bg-[var(--glass-subtle)] hover:bg-white/50 dark:hover:bg-white/8'
          } backdrop-blur-xl shadow-xs`}
        >
          {iconLeft && (
            <div className="pl-4 text-[var(--text-3)] transition-colors">
              {iconLeft}
            </div>
          )}

          <div className="relative flex-1">
            <input
              ref={ref}
              id={inputId}
              value={value}
              defaultValue={defaultValue}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`w-full bg-transparent px-4 text-sm text-[var(--text)] outline-none placeholder-transparent ${
                label ? 'pt-5 pb-2 h-13' : 'py-3 h-11'
              } ${className}`}
              placeholder={label || props.placeholder || ''}
              {...props}
            />

            {label && (
              <label
                htmlFor={inputId}
                className={`pointer-events-none absolute left-4 transition-all duration-200 select-none ${
                  isFocused || hasValue
                    ? 'top-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)]'
                    : 'top-3.5 text-sm text-[var(--text-3)]'
                }`}
              >
                {label}
              </label>
            )}
          </div>

          {iconRight && (
            <div className="pr-4 text-[var(--text-3)]">
              {iconRight}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1.5 ml-2 text-xs text-[#FF453A] font-medium flex items-center gap-1">
            <span>•</span> {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
