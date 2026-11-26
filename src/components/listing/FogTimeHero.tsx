'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sun, Moon, Sparkles, X, ChevronRight } from 'lucide-react';
import { PropertyCardImageConfig, isImageConfigured } from '@/lib/landing-images';
import { useFogClock } from './useFogClock';

export interface FogTimeHeroProps {
  property: PropertyCardImageConfig;
  defaultTime?: 'morning' | 'night';
  onTimeChange?: (time: 'morning' | 'night') => void;
  onClose?: () => void;
  isModal?: boolean;
  className?: string;
  onScheduleClick?: () => void;
  fastIntro?: boolean;
}

export function FogTimeHero({
  property,
  defaultTime,
  onTimeChange,
  onClose,
  isModal = true,
  className = '',
  onScheduleClick,
  fastIntro = false,
}: FogTimeHeroProps) {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Restore session time preference if present
  const [initialNight] = useState<boolean>(() => {
    if (defaultTime) return defaultTime === 'night';
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('prospera-fog-time');
        if (saved === 'night') return true;
      } catch {
        // ignore
      }
    }
    return false;
  });

  const fogConfig = property.fogView;
  const hasConfiguredSky = isImageConfigured(fogConfig?.skyMorning);
  const hasConfiguredNight = isImageConfigured(fogConfig?.skyNight) || isImageConfigured(fogConfig?.cutoutNight);

  // Simple Mode fallback check
  const isSimpleMode = !hasConfiguredSky;
  // If no night assets at all, we hide the toggle but keep the intro fog-rise
  const showToggle = hasConfiguredNight || true; // In simple mode with filter-based night

  const glowPos = fogConfig?.glow || { x: 0.72, y: 0.74 };
  const focalDesktop = fogConfig?.focal?.desktop || '50% 62%';

  const { isNight, setTime } = useFogClock(heroRef, canvasRef, {
    initialNight,
    playIntro: true,
    fastIntro,
    glowPos,
    onSwap: (toNight) => {
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('prospera-fog-time', toNight ? 'night' : 'morning');
        } catch {
          // ignore
        }
      }
      if (onTimeChange) onTimeChange(toNight ? 'night' : 'morning');
    },
  });

  // Handle keyboard navigation for the toggle (Left / Right arrow keys)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setTime(false);
    } else if (e.key === 'ArrowRight') {
      setTime(true);
    }
  };

  // Keyboard Escape listener to close
  useEffect(() => {
    if (!onClose) return;
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [onClose]);

  // Primary image sources
  const morningPhoto = isImageConfigured(fogConfig?.groundMorning)
    ? (fogConfig?.groundMorning as string)
    : property.cardPhotoUrl || property.detailMainPhotoUrl;

  const nightPhoto = isImageConfigured(fogConfig?.groundNight)
    ? (fogConfig?.groundNight as string)
    : morningPhoto;

  return (
    <section
      ref={heroRef}
      aria-label={`${property.name} Cinematic Experience`}
      className={`fog-hero relative w-full h-[100svh] min-h-[520px] overflow-hidden isolate select-none ${className}`}
      style={{
        containerType: 'size',
        background: '#0b1426',
      }}
    >
      {/* Scoped CSS variables & responsive rules */}
      <style jsx global>{`
        .fog-hero {
          --u: min(calc(100cqw / 1600), calc(100cqh / 900));
          --ink: color-mix(in srgb, #14202f calc((1 - var(--k, 0)) * 100%), #ffffff);
          --nav: color-mix(in srgb, #1b2736 calc((1 - var(--k, 0)) * 100%), #eef1f6);
          --soft: color-mix(in srgb, #1b2736 calc((1 - var(--k, 0)) * 100%), #dfe5ee);
          --in-color: color-mix(
            in srgb,
            #14202f calc((1 - var(--k2, 0)) * 42%),
            color-mix(in srgb, #ffffff calc(var(--k2, 0) * 100%), #7c8794)
          );
        }
        @media (max-width: 820px) {
          .fog-hero {
            --u: 1px;
          }
        }
      `}</style>

      {/* Screen reader announcement region */}
      <div className="sr-only" aria-live="polite">
        {isNight ? 'Switched to night view' : 'Switched to morning view'}
      </div>

      {/* LAYER 1: .sky (Blurred still sky with crossfade) */}
      <div className="sky absolute inset-0 pointer-events-none overflow-hidden">
        {/* Morning Sky */}
        <div
          className="absolute inset-0"
          style={{
            filter: 'blur(calc(7 * var(--u, 1px)))',
            transform: 'scale(1.05)',
          }}
        >
          {isSimpleMode ? (
            <Image
              src={morningPhoto}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: focalDesktop }}
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: 'radial-gradient(circle at 60% 40%, #fed8a6 0%, #e0a370 30%, #7b9bb6 65%, #3d5870 100%)',
              }}
            />
          )}
        </div>

        {/* Night Sky on top (opacity follows --k) */}
        <div
          className="absolute inset-0"
          style={{
            filter: 'blur(calc(7 * var(--u, 1px)))',
            transform: 'scale(1.05)',
            opacity: 'var(--k, 0)',
          }}
        >
          {hasConfiguredNight ? (
            <Image
              src={nightPhoto}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: focalDesktop }}
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: 'radial-gradient(circle at 70% 30%, #1e3a5f 0%, #0d1e34 40%, #060d18 80%, #03070d 100%)',
              }}
            />
          )}
        </div>
      </div>

      {/* LAYER 2: .home (Moving building & ground layer, Y-axis translation via --sink) */}
      <div
        className="home absolute inset-0 pointer-events-none will-change-transform"
        style={{
          transform: 'translate3d(0, var(--sink, 0px), 0)',
        }}
      >
        {/* Morning Building Set */}
        <div
          className={`absolute inset-0 transition-opacity duration-150 ${
            !isNight ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          {/* Ground masked layer */}
          <div
            className="ground absolute inset-0"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent 54%, #000000 64%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 54%, #000000 64%)',
            }}
          >
            <Image
              src={morningPhoto}
              alt={property.name}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: focalDesktop }}
            />
          </div>

          {/* Full architectural exterior cutout */}
          <div className="absolute inset-0">
            <Image
              src={morningPhoto}
              alt={property.name}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: focalDesktop }}
            />
          </div>
        </div>

        {/* Night Building Set */}
        <div
          className={`absolute inset-0 transition-opacity duration-150 ${
            isNight ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          {/* Ground masked layer (night ambient) */}
          <div
            className="ground absolute inset-0"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent 54%, #000000 64%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 54%, #000000 64%)',
              filter: isSimpleMode ? 'brightness(0.68) saturate(1.2) hue-rotate(-12deg)' : undefined,
            }}
          >
            <Image
              src={nightPhoto}
              alt={property.name}
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: focalDesktop }}
            />
          </div>

          {/* Full architectural cutout with night ambient lighting */}
          <div
            className="absolute inset-0"
            style={{
              filter: isSimpleMode ? 'brightness(0.72) contrast(1.1) hue-rotate(-8deg)' : undefined,
            }}
          >
            <Image
              src={nightPhoto}
              alt={property.name}
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: focalDesktop }}
            />
          </div>
        </div>
      </div>

      {/* LAYER 3: .tilt (Depth haze backdrop blur, hidden on mobile <= 820px) */}
      <div
        className="tilt hidden md:block absolute inset-0 pointer-events-none"
        style={{
          backdropFilter: 'blur(calc(9 * var(--u, 1px)))',
          maskImage: 'linear-gradient(to bottom, transparent 70%, #000000 92%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 70%, #000000 92%)',
        }}
      />

      {/* LAYER 4: #fog WebGL2 Live Shader Canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
      />

      {/* LAYER 5: .ui Foreground Content Stack */}
      <div className="ui relative z-[2] flex flex-col items-center justify-between w-full h-full pointer-events-none px-4 pt-6 pb-8 sm:px-8">
        {/* Top Bar: Breadcrumb + Close pill */}
        <div className="w-full flex items-center justify-between pointer-events-auto">
          {/* Breadcrumb glass pill */}
          <div
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border text-xs sm:text-sm font-medium transition-colors"
            style={{
              color: 'var(--nav)',
              borderColor: 'color-mix(in srgb, var(--nav) 25%, transparent)',
              background: 'color-mix(in srgb, var(--nav) 8%, transparent)',
            }}
          >
            <Link href="/" className="hover:opacity-80 transition-opacity">
              Home
            </Link>
            <span className="opacity-40">/</span>
            <Link href="/buyer" className="hover:opacity-80 transition-opacity">
              {property.city}
            </Link>
            <span className="opacity-40">/</span>
            <span className="font-semibold truncate max-w-[140px] sm:max-w-[260px]">{property.name}</span>
          </div>

          {/* AI visualization badge */}
          {fogConfig?.aiGenerated && (
            <div
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md border text-[11px] font-medium transition-colors"
              style={{
                color: 'var(--nav)',
                borderColor: 'color-mix(in srgb, var(--nav) 20%, transparent)',
                background: 'color-mix(in srgb, var(--nav) 6%, transparent)',
              }}
              title="Time-of-day view is an AI visualization. Lighting is illustrative."
            >
              <Sparkles size={11} className="text-amber-400" />
              <span>Time-of-day view is a visualization</span>
            </div>
          )}

          {/* Close "x" pill (in modal) or Site Nav link (on direct page) */}
          {isModal && onClose ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close property detail"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border text-xs font-semibold uppercase tracking-wider cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                color: 'var(--nav)',
                borderColor: 'color-mix(in srgb, var(--nav) 30%, transparent)',
                background: 'color-mix(in srgb, var(--nav) 10%, transparent)',
              }}
            >
              <span>Close</span>
              <X size={13} strokeWidth={2.5} />
            </button>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border text-xs font-semibold tracking-wider hover:opacity-80 transition-opacity"
              style={{
                color: 'var(--nav)',
                borderColor: 'color-mix(in srgb, var(--nav) 30%, transparent)',
                background: 'color-mix(in srgb, var(--nav) 10%, transparent)',
              }}
            >
              <span>All Homes</span>
              <ChevronRight size={13} />
            </Link>
          )}
        </div>

        {/* Centered Headline & Primary Action */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mt-[4vh] pointer-events-auto px-2">
          <h1
            className="font-[var(--font-urbanist)] font-medium text-center tracking-[-0.022em] leading-[1.08]"
            style={{
              fontSize: 'clamp(34px, calc(64 * var(--u, 1px)), 76px)',
              color: 'var(--ink)',
            }}
          >
            <span
              className="l1 block"
              style={{
                opacity: 'calc(1 - var(--dip, 0) * 0.8)',
                transition: 'opacity 0.05s linear',
              }}
            >
              {property.name}
            </span>
            <span className="l2 block text-[0.45em] sm:text-[0.42em] font-normal tracking-wide mt-1">
              <span
                style={{
                  color: 'var(--in-color)',
                  fontStyle: 'italic',
                  marginRight: '0.3em',
                }}
              >
                in
              </span>
              <span>{property.locality}, {property.city}</span>
            </span>
          </h1>

          {/* Price Pill & Primary Action */}
          <div
            className="flex items-center gap-3 mt-4"
            style={{
              opacity: 'calc(1 - var(--dip, 0) * 0.62)',
            }}
          >
            <span
              className="px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-semibold backdrop-blur-md"
              style={{
                color: 'var(--ink)',
                borderColor: 'color-mix(in srgb, var(--ink) 25%, transparent)',
                background: 'color-mix(in srgb, var(--ink) 10%, transparent)',
              }}
            >
              {property.priceFormatted}
            </span>

            <button
              type="button"
              onClick={onScheduleClick}
              className="px-5 py-2 rounded-full font-semibold text-xs sm:text-sm shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              style={{
                background: 'color-mix(in srgb, #0d1117 calc((1 - var(--k, 0)) * 100%), #ffffff)',
                color: 'color-mix(in srgb, #ffffff calc((1 - var(--k, 0)) * 100%), #0d1117)',
              }}
            >
              Schedule a private visit
            </button>
          </div>
        </div>

        {/* Bottom Dock: Morning / Night Toggle & Caption */}
        <div className="flex flex-col items-center gap-3 mt-auto pointer-events-auto pb-4 w-full max-w-lg px-2">
          {showToggle && (
            <div
              role="group"
              aria-label="Time of day view selector"
              onKeyDown={handleKeyDown}
              className="relative grid grid-cols-2 p-1 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all w-full"
              style={{
                maxWidth: 'clamp(280px, calc(524 * var(--u, 1px)), 480px)',
                minHeight: 'calc(80 * var(--u, 1px))',
                background: 'rgba(120, 132, 140, 0.34)',
                borderColor: 'rgba(255, 255, 255, 0.22)',
              }}
            >
              {/* Morning Option Button */}
              <button
                type="button"
                aria-pressed={!isNight}
                onClick={() => setTime(false)}
                className="relative z-10 flex flex-col items-center justify-center py-2.5 px-4 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-white transition-all cursor-pointer"
              >
                {/* Crossfading ::before face */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-150"
                  style={{
                    background: 'linear-gradient(160deg, #f7f8dc, #e2ee9f 90%)',
                    boxShadow: 'inset 0 0 calc(18 * var(--u, 1px)) rgba(255, 255, 255, 0.65)',
                    opacity: 'calc(1 - var(--k, 0))',
                  }}
                />
                <div className="relative z-10 flex items-center gap-1.5">
                  <Sun size={15} style={{ color: 'color-mix(in srgb, #1c2316 calc((1 - var(--k, 0)) * 100%), #ffffff)' }} />
                  <span
                    className="font-medium text-sm sm:text-base tracking-wide"
                    style={{
                      color: 'color-mix(in srgb, #1c2316 calc((1 - var(--k, 0)) * 100%), #ffffff)',
                    }}
                  >
                    Morning
                  </span>
                </div>
                <span
                  className="relative z-10 text-[11px] opacity-75 font-normal tracking-wide"
                  style={{
                    color: 'color-mix(in srgb, #1c2316 calc((1 - var(--k, 0)) * 100%), #ffffff)',
                  }}
                >
                  Sunrise Ambience
                </span>
              </button>

              {/* Night Option Button */}
              <button
                type="button"
                aria-pressed={isNight}
                onClick={() => setTime(true)}
                className="relative z-10 flex flex-col items-center justify-center py-2.5 px-4 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-white transition-all cursor-pointer"
              >
                {/* Crossfading ::before face */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-150"
                  style={{
                    background: 'linear-gradient(160deg, #3d5a80, #1f3148 90%)',
                    boxShadow: 'inset 0 0 calc(18 * var(--u, 1px)) rgba(135, 185, 255, 0.45)',
                    opacity: 'var(--k, 0)',
                  }}
                />
                <div className="relative z-10 flex items-center gap-1.5">
                  <Moon size={14} style={{ color: 'color-mix(in srgb, #ffffff calc(var(--k, 0) * 100%), #1c2316)' }} />
                  <span
                    className="font-medium text-sm sm:text-base tracking-wide"
                    style={{
                      color: 'color-mix(in srgb, #ffffff calc(var(--k, 0) * 100%), #1c2316)',
                    }}
                  >
                    Night
                  </span>
                </div>
                <span
                  className="relative z-10 text-[11px] opacity-75 font-normal tracking-wide"
                  style={{
                    color: 'color-mix(in srgb, #ffffff calc(var(--k, 0) * 100%), #1c2316)',
                  }}
                >
                  Evening Ambience
                </span>
              </button>
            </div>
          )}

          {/* Listing Summary Caption */}
          <p
            className="text-xs sm:text-sm font-normal tracking-wide text-center max-w-lg line-clamp-1"
            style={{
              color: 'var(--soft)',
            }}
          >
            {property.aboutText}
          </p>
        </div>
      </div>

      {/* BOTTOM SEAM FADE: Over the last 14% of the hero, blend fog into details background */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[14%] pointer-events-none z-[3]"
        style={{
          background: 'linear-gradient(to bottom, transparent, #0a0d12)',
        }}
      />
    </section>
  );
}
