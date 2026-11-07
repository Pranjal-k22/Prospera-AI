'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface GenerateButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 
   * Highlight hue in degrees (0-360). Default: 210 (Sapphire Blue).
   */
  hue?: number;
  /**
   * Controlled async state: true while an AI generative process is running.
   */
  isGenerating?: boolean;
  /**
   * Idle label. Default: "Generate"
   */
  text?: string;
  /**
   * Generating label. Default: "Generating..."
   */
  generatingText?: string;
  /**
   * Optional brief completion label shown on completion. Default: "Confirmed"
   */
  successText?: string;
  /**
   * Button size scale: sm (32px), md (40px), lg (48px). Default: "md"
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Whether to stretch full width of container.
   */
  fullWidth?: boolean;
  /**
   * Custom icon element (replaces default sparkles).
   */
  icon?: React.ReactNode;
}

export const GenerateButton = React.forwardRef<HTMLButtonElement, GenerateButtonProps>(
  (
    {
      hue = 210,
      isGenerating = false,
      text = 'Generate',
      generatingText = 'Generating...',
      successText = 'Completed',
      size = 'md',
      fullWidth = false,
      icon,
      className,
      disabled,
      style,
      onClick,
      ...props
    },
    ref
  ) => {
    const [showSuccess, setShowSuccess] = useState(false);
    const prevGenerating = useRef(isGenerating);

    // Watch for generation completion transition to show brief confirmation
    useEffect(() => {
      if (prevGenerating.current && !isGenerating) {
        setShowSuccess(true);
        const timer = setTimeout(() => setShowSuccess(false), 1200);
        return () => clearTimeout(timer);
      }
      prevGenerating.current = isGenerating;
    }, [isGenerating]);

    // Compute min width for the text wrapper so it never abruptly shifts size
    const maxLen = Math.max(text.length, generatingText.length, successText.length);
    const minWidthEm = Math.max(5.8, maxLen * 0.62 + 0.3);

    const sizeClass = {
      sm: 'gen-btn-sm',
      md: 'gen-btn-md',
      lg: 'gen-btn-lg',
    }[size];

    const currentLabel = showSuccess ? successText : isGenerating ? generatingText : text;

    return (
      <div className={cn('gen-btn-container', fullWidth && 'w-full')}>
        <button
          ref={ref}
          type="button"
          aria-label={currentLabel}
          aria-busy={isGenerating}
          aria-live="polite"
          data-generating={isGenerating}
          disabled={disabled || isGenerating}
          style={
            {
              '--highlight-color-hue': `${hue}deg`,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            'gen-btn',
            sizeClass,
            fullWidth && 'w-full',
            className
          )}
          onClick={onClick}
          {...props}
        >
          {/* Leading Sparkle SVG or Success Checkmark */}
          {showSuccess ? (
            <Check className="mr-1.5 h-4 w-4 text-[#30C48D] animate-in zoom-in-75 duration-200" strokeWidth={2.5} />
          ) : icon ? (
            <span className="mr-2 inline-flex items-center text-white/90">{icon}</span>
          ) : (
            <svg
              className="gen-btn-svg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
              />
            </svg>
          )}

          {/* Letter container hidden from screen readers (announced via button aria-label) */}
          <div
            className="gen-txt-wrapper"
            style={{ minWidth: `${minWidthEm}em` }}
            aria-hidden="true"
          >
            {showSuccess ? (
              <span className="text-white font-semibold text-xs tracking-wide">
                {successText}
              </span>
            ) : (
              <>
                <div className="gen-txt-1">
                  {text.split('').map((letter, i) => (
                    <span
                      key={`t1-${i}`}
                      className="gen-btn-letter"
                      style={{ animationDelay: `${i * 0.06}s` }}
                    >
                      {letter === ' ' ? '\u00A0' : letter}
                    </span>
                  ))}
                </div>
                <div className="gen-txt-2">
                  {generatingText.split('').map((letter, i) => (
                    <span
                      key={`t2-${i}`}
                      className="gen-btn-letter"
                      style={{ animationDelay: `${i * 0.06}s` }}
                    >
                      {letter === ' ' ? '\u00A0' : letter}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </button>
      </div>
    );
  }
);

GenerateButton.displayName = 'GenerateButton';
export default GenerateButton;
