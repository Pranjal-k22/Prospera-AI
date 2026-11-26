'use client';

import React, { useState, useEffect, useRef, useId, useCallback } from 'react';
import { cn } from '@/lib/utils';

export type GenerateButtonTone = 'amber' | 'emerald' | 'blue' | 'cyan' | 'rose';
export type GenerateButtonVariant = 'solid' | 'frosted';
export type GenerateButtonSize = 'sm' | 'md' | 'lg';
export type GenerateButtonStatus = 'idle' | 'generating' | 'success' | 'error';

export const TONE_HUES: Record<GenerateButtonTone, number> = {
  amber: 37,
  emerald: 150,
  blue: 210,
  cyan: 172,
  rose: 350,
};

export interface GenerateButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /**
   * Semantic color tone (maps to hue):
   * - amber: 37 (default, general AI actions)
   * - emerald: 150 (valuation, approval, success)
   * - blue: 210 (summaries, reports, info)
   * - cyan: 172 (telemetry, broker cockpit)
   * - rose: 350 (risk analysis)
   */
  tone?: GenerateButtonTone;
  /**
   * Surface variant:
   * - solid: premium opaque pill (ink in light, slate in dark)
   * - frosted: translucent glass with backdrop-filter (for hero/photo backgrounds)
   */
  variant?: GenerateButtonVariant;
  /**
   * Button size scale: sm (36px), md (44px, default), lg (52px).
   * All sizes maintain >= 44px touch target.
   */
  size?: GenerateButtonSize;
  /**
   * Controlled execution status driven by real async state.
   */
  status?: GenerateButtonStatus;
  /**
   * Backwards-compatible alias for status === 'generating'.
   */
  isGenerating?: boolean;
  /**
   * Primary idle label. Default: "Generate"
   */
  label?: string;
  /**
   * Backwards-compatible alias for label.
   */
  text?: string;
  /**
   * Label shown while generating. Default: "Generating"
   */
  generatingLabel?: string;
  /**
   * Backwards-compatible alias for generatingLabel.
   */
  generatingText?: string;
  /**
   * Label shown on success. Default: "Done"
   */
  successLabel?: string;
  /**
   * Backwards-compatible alias for successLabel.
   */
  successText?: string;
  /**
   * Label shown on error. Default: "Try again"
   */
  errorLabel?: string;
  /**
   * Advanced manual hue override in degrees (0-360).
   */
  hue?: number;
  /**
   * Whether to stretch full width of container.
   */
  fullWidth?: boolean;
  /**
   * Custom leading icon (replaces default sparkles).
   */
  icon?: React.ReactNode;
  /**
   * Callback fired when a success/error state settles and resets back to idle.
   */
  onSettled?: () => void;
}

export const GenerateButton = React.forwardRef<HTMLButtonElement, GenerateButtonProps>(
  (
    {
      tone = 'amber',
      variant = 'solid',
      size = 'md',
      status,
      isGenerating,
      label,
      text,
      generatingLabel,
      generatingText,
      successLabel,
      successText,
      errorLabel = 'Try again',
      hue: customHue,
      fullWidth = false,
      icon,
      className,
      disabled = false,
      style,
      onClick,
      onSettled,
      'aria-label': ariaLabelProp,
      ...props
    },
    ref
  ) => {
    // Resolve labels with backwards compatibility
    const currentIdleLabel = label ?? text ?? 'Generate';
    const currentGeneratingLabel = generatingLabel ?? generatingText ?? 'Generating';
    const currentSuccessLabel = successLabel ?? successText ?? 'Done';
    const currentErrorLabel = errorLabel;

    // Resolve hue from tone or manual override
    const activeHue = customHue ?? TONE_HUES[tone] ?? 37;

    // Controlled vs derived status
    const effectivePropStatus: GenerateButtonStatus =
      status ?? (isGenerating ? 'generating' : 'idle');

    // Local transient status for smooth auto-reset on completion
    const [localStatus, setLocalStatus] = useState<GenerateButtonStatus>(effectivePropStatus);
    const prevPropStatus = useRef<GenerateButtonStatus>(effectivePropStatus);
    const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Watch status transitions
    useEffect(() => {
      const prev = prevPropStatus.current;
      const next = effectivePropStatus;
      prevPropStatus.current = next;

      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }

      if (next === 'generating') {
        setLocalStatus('generating');
      } else if (next === 'success') {
        setLocalStatus('success');
        resetTimerRef.current = setTimeout(() => {
          setLocalStatus('idle');
          onSettled?.();
        }, 1400);
      } else if (next === 'error') {
        setLocalStatus('error');
        resetTimerRef.current = setTimeout(() => {
          setLocalStatus('idle');
          onSettled?.();
        }, 2500);
      } else if (prev === 'generating' && next === 'idle') {
        // Transition from generating -> idle without explicit success: show brief success confirmation
        setLocalStatus('success');
        resetTimerRef.current = setTimeout(() => {
          setLocalStatus('idle');
          onSettled?.();
        }, 1200);
      } else {
        setLocalStatus(next);
      }

      return () => {
        if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      };
    }, [effectivePropStatus, onSettled]);

    const activeStatus = localStatus;
    const isBusy = activeStatus === 'generating';
    const isSuccess = activeStatus === 'success';
    const isError = activeStatus === 'error';

    // Accessible announcements ID
    const liveRegionId = useId();

    // Determine current voiceover string
    const currentVoiceLabel = isSuccess
      ? currentSuccessLabel
      : isError
      ? currentErrorLabel
      : isBusy
      ? currentGeneratingLabel
      : currentIdleLabel;

    const accessibleLabel = ariaLabelProp ?? currentVoiceLabel;

    // Handle click with double-submit guard
    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled || isBusy) {
          e.preventDefault();
          return;
        }
        if (isError) {
          // Clicking on error state immediately resets to idle
          if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
          setLocalStatus('idle');
          onSettled?.();
        }
        onClick?.(e);
      },
      [disabled, isBusy, isError, onClick, onSettled]
    );

    // Helper to render letter spans with inline variable index (--i)
    const renderLetters = (str: string) => {
      return str.split('').map((char, i) => (
        <span
          key={i}
          className="gen-letter"
          style={{ '--i': i } as React.CSSProperties}
          aria-hidden="true"
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ));
    };

    const sizeClass = {
      sm: 'gen-btn-sm',
      md: 'gen-btn-md',
      lg: 'gen-btn-lg',
    }[size];

    return (
      <div className={cn('gen-btn-container', fullWidth && 'w-full')}>
        <button
          ref={ref}
          type="button"
          disabled={disabled || isBusy}
          aria-label={accessibleLabel}
          aria-busy={isBusy}
          aria-describedby={liveRegionId}
          data-status={activeStatus}
          data-tone={tone}
          data-variant={variant}
          data-size={size}
          data-disabled={disabled ? 'true' : undefined}
          onClick={handleClick}
          style={
            {
              '--gen-hue': `${activeHue}`,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            'gen-btn',
            sizeClass,
            variant === 'frosted' && 'gen-frosted',
            fullWidth && 'w-full',
            className
          )}
          {...props}
        >
          {/* Accessible Touch Target Expander for Small buttons (>= 44px) */}
          {size === 'sm' && <span className="gen-touch-expand" aria-hidden="true" />}

          {/* Leading Icon: Morphing Sparkles -> Success Checkmark -> Error Alert */}
          <span className="gen-icon-wrap" aria-hidden="true">
            {isSuccess ? (
              <svg
                className="w-4 h-4 text-[#75c994]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path className="gen-check-path" d="M20 6 9 17l-5-5" />
              </svg>
            ) : isError ? (
              <svg
                className="w-4 h-4 text-[#ff6b6b]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            ) : icon ? (
              icon
            ) : (
              <svg
                className="gen-sparkle-svg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
                <path d="M5 3v4" />
                <path d="M19 17v4" />
                <path d="M3 5h4" />
                <path d="M17 19h4" />
              </svg>
            )}
          </span>

          {/* CSS Grid Stack: All label states share grid-area: 1 / 1.
              Container width is sized to the LONGEST label so the button never clips or jumps width! */}
          <div className="gen-grid-stack">
            {/* 1. Idle Slot */}
            <span
              className="gen-label-slot"
              data-active={activeStatus === 'idle'}
              aria-hidden="true"
            >
              {renderLetters(currentIdleLabel)}
            </span>

            {/* 2. Generating Slot */}
            <span
              className="gen-label-slot"
              data-active={activeStatus === 'generating'}
              aria-hidden="true"
            >
              {renderLetters(currentGeneratingLabel)}
            </span>

            {/* 3. Success Slot */}
            <span
              className="gen-label-slot text-[#75c994]"
              data-active={activeStatus === 'success'}
              aria-hidden="true"
            >
              {renderLetters(currentSuccessLabel)}
            </span>

            {/* 4. Error Slot */}
            <span
              className="gen-label-slot text-[#ff6b6b]"
              data-active={activeStatus === 'error'}
              aria-hidden="true"
            >
              {renderLetters(currentErrorLabel)}
            </span>
          </div>

          {/* Reduced-Motion Fallback Sweep line inside pill */}
          <span className="gen-motion-sweep" aria-hidden="true" />
        </button>

        {/* Visually hidden aria-live polite region for screen readers */}
        <span id={liveRegionId} className="sr-only" aria-live="polite">
          {isBusy
            ? 'Generating'
            : isSuccess
            ? 'Done'
            : isError
            ? 'Failed, try again'
            : ''}
        </span>
      </div>
    );
  }
);

GenerateButton.displayName = 'GenerateButton';
export default GenerateButton;
