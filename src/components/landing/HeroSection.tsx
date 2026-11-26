'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { LANDING_IMAGES, isImageConfigured } from '@/lib/landing-images';
import { HeroClouds } from './HeroClouds';
import { HeroRail } from './HeroRail';

interface HeroSectionProps {
  scrollY: number;
}

// Ease in-out cubic: t < 0.5 ? 4 * t^3 : 1 - Math.pow(-2 * t + 2, 3) / 2
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function HeroSection({ scrollY }: HeroSectionProps) {
  const [activeSlide, setActiveSlide] = useState(0); // 0: Mumbai, 1: Bengaluru, 2: Hyderabad
  const [outgoingSlide, setOutgoingSlide] = useState<number | null>(null);
  const [wipeProgress, setWipeProgress] = useState(1); // 1 = fully settled, 0 = start of wipe
  const [isWiping, setIsWiping] = useState(false);
  const [introStarted, setIntroStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Parallax pointer tracking
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });
  const [kenBurnsZoom, setKenBurnsZoom] = useState(0);
  const kenBurnsStartRef = useRef<number>(0);

  // Wipe animation frame ref
  const wipeRafRef = useRef<number | null>(null);

  // Trigger intro on load after 250ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroStarted(true);
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  // Track pointer for +/-0.6% horiz and +/-0.5% vert parallax
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const { innerWidth, innerHeight } = window;
    const nx = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
    const ny = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1
    setPointerOffset({ x: nx * 0.6, y: ny * 0.5 });
  }, []);

  // Start the 1.25s right-to-left soft misty wipe
  const startWipe = useCallback(
    (targetIndex: number) => {
      if (targetIndex === activeSlide || isWiping) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        setActiveSlide(targetIndex);
        return;
      }

      setOutgoingSlide(activeSlide);
      setActiveSlide(targetIndex);
      setIsWiping(true);
      setWipeProgress(0);
      kenBurnsStartRef.current = Date.now();

      const startTime = performance.now();
      const duration = 1250; // 1.25 seconds

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const rawProgress = Math.min(1, elapsed / duration);
        const eased = easeInOutCubic(rawProgress);

        setWipeProgress(eased);

        if (rawProgress < 1) {
          wipeRafRef.current = requestAnimationFrame(animate);
        } else {
          setWipeProgress(1);
          setIsWiping(false);
          setOutgoingSlide(null);
        }
      };

      if (wipeRafRef.current) cancelAnimationFrame(wipeRafRef.current);
      wipeRafRef.current = requestAnimationFrame(animate);
    },
    [activeSlide, isWiping]
  );

  // Auto-advance 1 -> 2 -> 3 -> 1 every 5.2s
  useEffect(() => {
    if (isPaused || isWiping) return;

    const interval = setInterval(() => {
      if (document.visibilityState === 'hidden') return;
      const nextIndex = (activeSlide + 1) % 3;
      startWipe(nextIndex);
    }, 5200);

    return () => clearInterval(interval);
  }, [activeSlide, isPaused, isWiping, startWipe]);

  // Ken Burns subtle scale increment (+0.0035/s up to 12s)
  useEffect(() => {
    kenBurnsStartRef.current = Date.now();
    let animId: number;
    const updateKenBurns = () => {
      const elapsedSec = (Date.now() - kenBurnsStartRef.current) / 1000;
      const capped = Math.min(12, elapsedSec);
      setKenBurnsZoom(capped * 0.0035);
      animId = requestAnimationFrame(updateKenBurns);
    };
    animId = requestAnimationFrame(updateKenBurns);
    return () => cancelAnimationFrame(animId);
  }, [activeSlide]);

  // Scroll choreography: Slide stack translateY(+0.42 x scrollY)
  const slideStackTranslateY = scrollY * 0.42;

  // Title specifications per slide:
  // Slide 0: Mumbai -> WELCOME HOME (8.25vw, left 2.6vw, top 74px + 3.2vh)
  // Slide 1: Bengaluru -> FIND PLACE TO LIVE (8.25vw, left 2.6vw, top 74px + 3.2vh)
  // Slide 2: Hyderabad -> EXPLORE / INDIA (9.6vw, left 7vw, top 74px + 5vh)
  const slidesContent = [
    {
      words: ['WELCOME', 'HOME'],
      lines: [['WELCOME', 'HOME']],
      fontSize: '8.25vw',
      left: '2.6vw',
      top: 'calc(74px + 3.2vh)',
      lineHeight: '0.9',
      photoPos: 'center 62%',
    },
    {
      words: ['FIND', 'PLACE', 'TO', 'LIVE'],
      lines: [['FIND', 'PLACE', 'TO', 'LIVE']],
      fontSize: '8.25vw',
      left: '2.6vw',
      top: 'calc(74px + 3.2vh)',
      lineHeight: '0.9',
      photoPos: 'center 55%',
    },
    {
      words: ['EXPLORE', 'INDIA'],
      lines: [['EXPLORE'], ['INDIA']],
      fontSize: '9.6vw',
      left: '7vw',
      top: 'calc(74px + 5vh)',
      lineHeight: '0.95',
      photoPos: 'center 40%',
    },
  ];

  // Calculate mask stops for right-to-left wipe:
  // progress p: fully opaque up to p*135 - 35% from right edge; 60% at midpoint; transparent at p*135%
  const stop1 = Math.max(0, wipeProgress * 135 - 35);
  const stop2 = Math.min(135, wipeProgress * 135);
  const stopMid = (stop1 + stop2) / 2;

  const incomingMaskStyle = isWiping
    ? {
        WebkitMaskImage: `linear-gradient(to left, black 0%, black ${stop1}%, rgba(0,0,0,0.6) ${stopMid}%, transparent ${stop2}%, transparent 100%)`,
        maskImage: `linear-gradient(to left, black 0%, black ${stop1}%, rgba(0,0,0,0.6) ${stopMid}%, transparent ${stop2}%, transparent 100%)`,
      }
    : undefined;

  // Incoming photo scale: settles from 1.12 to 1.04 while sliding from +2% to 0
  const incomingScale = isWiping ? 1.12 - (1.12 - 1.04) * wipeProgress : 1.04 + kenBurnsZoom;
  const incomingSlideX = isWiping ? (1 - wipeProgress) * 2 : 0;

  // Outgoing photo scale: pushes from 1.04 to 1.09 and drifts -2%
  const outgoingScale = isWiping ? 1.04 + (1.09 - 1.04) * wipeProgress : 1.04;
  const outgoingSlideX = isWiping ? -2 * wipeProgress : 0;

  // Mist band: vertical band 34% width riding wipe edge, opacity = sin(pi * p) * 0.95
  const mistBandX = 100 - (wipeProgress * 135 - 17.5);
  const mistOpacity = Math.sin(Math.PI * wipeProgress) * 0.95;

  // Helper renderer for a slide layer
  const renderSlideLayer = (
    slideIdx: number,
    scale: number,
    offsetX: number,
    offsetY: number,
    isSecondary: boolean
  ) => {
    const slideData = LANDING_IMAGES.slides[slideIdx];
    const slideLayout = slidesContent[slideIdx];
    const hasPhoto = isImageConfigured(slideData.photoUrl);

    return (
      <div className="relative w-full h-full overflow-hidden">
        {/* PHOTO LAYER: inset -3%, base scale 1.04 */}
        <div
          className="absolute inset-[-3%] transition-transform duration-75 ease-out"
          style={{
            transform: `translate3d(${offsetX}%, ${offsetY}%, 0) scale(${scale})`,
            backgroundPosition: slideLayout.photoPos,
          }}
        >
          {hasPhoto ? (
            <Image
              src={slideData.photoUrl}
              alt={slideData.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: slideData.fallbackGradient,
              }}
            />
          )}
        </div>

        {/* TOP TINT for legibility behind the navbar:
            linear-gradient(180deg, rgba(84,64,74,.42) 0%, rgba(84,64,74,.08) 26%, transparent 46%) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background:
              'linear-gradient(180deg, rgba(84,64,74,0.42) 0%, rgba(84,64,74,0.08) 26%, transparent 46%)',
          }}
        />

        {/* GIANT TITLE INSIDE THE SLIDE (reveals with the wipe):
            Urbanist 700, uppercase, line-height .9, nowrap,
            gradient clipped to text (rgba(255,255,255,.97) at 0%, .86 at 36%, .16 at 100%) */}
        <div
          className="absolute z-[2] pointer-events-none"
          style={{
            left: slideLayout.left,
            top: slideLayout.top,
          }}
        >
          {isSecondary ? (
            <div
              aria-hidden="true"
              className="flex flex-col whitespace-nowrap"
              style={{
                fontFamily: 'var(--font-urbanist), sans-serif',
                fontSize: slideLayout.fontSize,
                fontWeight: 700,
                lineHeight: slideLayout.lineHeight,
                letterSpacing: '-0.02em',
              }}
            >
              {slideLayout.lines.map((lineWords, lineIdx) => (
                <div key={lineIdx} className="flex gap-[0.25em]">
                  {lineWords.map((word) => (
                    <span key={word} className="title-frosted-metal inline-block">
                      {word}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <h1
              className="flex flex-col whitespace-nowrap"
              style={{
                fontFamily: 'var(--font-urbanist), sans-serif',
                fontSize: slideLayout.fontSize,
                fontWeight: 700,
                lineHeight: slideLayout.lineHeight,
                letterSpacing: '-0.02em',
              }}
            >
              {slideLayout.lines.map((lineWords, lineIdx) => (
                <div key={lineIdx} className="flex gap-[0.25em]">
                  {lineWords.map((word, wordIdx) => (
                    <span
                      key={word}
                      className="title-frosted-metal inline-block overflow-hidden"
                    >
                      {/* Intro animation: rises from below mask (translateY 105% -> 0, 1.15s --out, staggered 90ms) */}
                      <span
                        className="inline-block transition-transform duration-[1150ms] ease-[var(--out,cubic-bezier(0.16,1,0.3,1))]"
                        style={{
                          transform: introStarted ? 'translateY(0%)' : 'translateY(105%)',
                          transitionDelay: `${wordIdx * 90}ms`,
                        }}
                      >
                        {word}
                      </span>
                    </span>
                  ))}
                </div>
              ))}
            </h1>
          )}
        </div>
      </div>
    );
  };

  return (
    <section
      aria-label="Hero Showcase"
      onPointerMove={handlePointerMove}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full h-screen min-h-[680px] overflow-hidden select-none bg-[#f7d9c6] dark:bg-[#0a0e17]"
    >
      {/* 1. SLIDE STACK (TranslateY +0.42 x scrollY) */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: `translate3d(0, ${slideStackTranslateY}px, 0)`,
        }}
      >
        {/* OUTGOING SLIDE (rendered underneath while wiping) */}
        {isWiping && outgoingSlide !== null && (
          <div className="absolute inset-0 z-[1] overflow-hidden">
            {renderSlideLayer(
              outgoingSlide,
              outgoingScale,
              outgoingSlideX + pointerOffset.x,
              pointerOffset.y,
              true // aria-hidden
            )}
          </div>
        )}

        {/* INCOMING / ACTIVE SLIDE */}
        <div
          className={`absolute inset-0 ${isWiping ? 'z-[2]' : 'z-[1]'} overflow-hidden`}
          style={incomingMaskStyle}
        >
          {renderSlideLayer(
            activeSlide,
            incomingScale,
            incomingSlideX + pointerOffset.x,
            pointerOffset.y,
            false // Active slide carries main h1
          )}
        </div>

        {/* MIST BAND (rides wipe edge, vertical band 34% viewport width) */}
        {isWiping && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 z-[3] w-[34vw] -translate-x-1/2 blur-[10px]"
            style={{
              left: `${mistBandX}%`,
              opacity: mistOpacity,
              background:
                'radial-gradient(ellipse at center, rgba(255,236,226,0.75) 0%, rgba(255,236,226,0.3) 45%, transparent 75%)',
            }}
          />
        )}
      </div>

      {/* 2. VOLUMETRIC DRIFTING CLOUDS & BOTTOM FADE */}
      <HeroClouds scrollY={scrollY} />

      {/* 3. RIGHT RAIL (Thumbnails, Concentric Rings & Captions) */}
      <HeroRail
        activeSlide={activeSlide}
        onSelectSlide={startWipe}
        isWiping={isWiping}
        scrollY={scrollY}
      />

      <style jsx>{`
        .title-frosted-metal {
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.97) 0%,
            rgba(255, 255, 255, 0.86) 36%,
            rgba(255, 255, 255, 0.16) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.35));
        }

        @media (max-width: 640px) {
          h1,
          .title-frosted-metal {
            font-size: 13.5vw !important;
            max-width: 80vw !important;
            white-space: normal !important;
            line-height: 0.98 !important;
          }
        }
      `}</style>
    </section>
  );
}
