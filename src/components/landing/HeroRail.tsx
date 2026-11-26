'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { LANDING_IMAGES, isImageConfigured } from '@/lib/landing-images';

interface HeroRailProps {
  activeSlide: number; // 0: Mumbai, 1: Bengaluru, 2: Hyderabad
  onSelectSlide: (index: number) => void;
  isWiping: boolean;
  scrollY: number;
}

// Order top to bottom: Hyderabad (index 2), Bengaluru (index 1), Mumbai (index 0)
const RAIL_ITEMS = [
  { slideIndex: 2, name: 'Hyderabad' },
  { slideIndex: 1, name: 'Bengaluru' },
  { slideIndex: 0, name: 'Mumbai' },
];

export function HeroRail({
  activeSlide,
  onSelectSlide,
  isWiping,
  scrollY,
}: HeroRailProps) {
  // Caption & connector show after 650ms when wiping
  const [delayedShow, setDelayedShow] = useState(true);

  useEffect(() => {
    if (isWiping) {
      const timer = setTimeout(() => {
        setDelayedShow(true);
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [isWiping]);

  const showCaption = !isWiping || delayedShow;

  const activeSlideData = LANDING_IMAGES.slides[activeSlide];

  // Scroll choreography for rail: translateY(+0.2 x scrollY), fades out by half a viewport
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
  const railTranslateY = scrollY * 0.2;
  const railOpacity = Math.max(0, 1 - scrollY / (0.5 * vh));

  // Find index in RAIL_ITEMS for the active slide (0, 1, or 2 from top)
  const activeRailIndex = RAIL_ITEMS.findIndex((item) => item.slideIndex === activeSlide);

  return (
    <div
      aria-label="City highlights navigation"
      className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300 select-none overflow-hidden"
      style={{
        opacity: railOpacity,
        transform: `translate3d(0, ${railTranslateY}px, 0)`,
      }}
    >
      {/* Container aligned around x = 85.5% of viewport, starting at 74px + 8.5% hero height */}
      <div
        className="absolute right-[5vw] sm:right-[7.5vw] lg:right-[14.5vw] top-[calc(74px+8.5vh)] flex flex-col items-center gap-[max(8px,0.9vw)] pointer-events-auto"
      >
        {/* Render 3 Round Thumbnails: Hyderabad (top), Bengaluru (middle), Mumbai (bottom) */}
        {RAIL_ITEMS.map((item) => {
          const isActive = item.slideIndex === activeSlide;
          const slideConfig = LANDING_IMAGES.slides[item.slideIndex];
          const hasThumb = isImageConfigured(slideConfig.thumbnailUrl);

          return (
            <div key={item.name} className="relative flex items-center justify-center">
              {/* Outer Halo ring for active thumbnail: 9px outside */}
              {isActive && (
                <motion.div
                  layoutId="active-thumbnail-halo"
                  className="absolute inset-[-9px] rounded-full border border-white/55 pointer-events-none"
                  transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
                />
              )}

              {/* The Round Thumbnail Button */}
              <button
                type="button"
                onClick={() => onSelectSlide(item.slideIndex)}
                aria-label={`View ${item.name} homes`}
                aria-pressed={isActive}
                className={`group relative rounded-full border-[3px] border-white/92 shadow-[0_10px_26px_rgba(60,30,30,0.28)] overflow-hidden transition-all duration-[900ms] ease-[var(--ease,cubic-bezier(0.65,0,0.35,1))] hover:scale-107 focus-visible:ring-2 focus-visible:ring-white outline-none cursor-pointer ${
                  isActive
                    ? 'w-[clamp(96px,11.3vw,190px)] h-[clamp(96px,11.3vw,190px)] z-10'
                    : 'w-[clamp(46px,5.4vw,92px)] h-[clamp(46px,5.4vw,92px)] opacity-85 z-0'
                }`}
              >
                {hasThumb ? (
                  <>
                    <Image
                      src={slideConfig.thumbnailUrl}
                      alt={item.name}
                      fill
                      sizes="190px"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-[0.5px] flex items-center justify-center p-1.5 text-center">
                      <span className="text-white text-[10.5px] sm:text-[12.5px] font-[var(--font-urbanist)] font-semibold tracking-wider uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
                        {item.name}
                      </span>
                    </div>
                  </>
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center p-2 text-center"
                    style={{ background: slideConfig.fallbackGradient }}
                  >
                    <span className="text-white text-[11px] sm:text-[13px] font-[var(--font-urbanist)] font-medium tracking-wider uppercase drop-shadow-md">
                      {item.name}
                    </span>
                  </div>
                )}

                {/* Subtle sheen overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/20 pointer-events-none" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Concentric Outlined Rings centred on the active thumbnail */}
      {/* Position calculation relative to activeRailIndex */}
      <div
        className="absolute right-[5vw] sm:right-[7.5vw] lg:right-[14.5vw] top-[calc(74px+8.5vh)] pointer-events-none"
      >
        <motion.div
          animate={{
            y:
              activeRailIndex === 0
                ? 'calc(clamp(96px, 11.3vw, 190px) * 0.5)'
                : activeRailIndex === 1
                ? 'calc(clamp(46px, 5.4vw, 92px) + max(8px, 0.9vw) + clamp(96px, 11.3vw, 190px) * 0.5)'
                : 'calc(clamp(46px, 5.4vw, 92px) * 2 + max(8px, 0.9vw) * 2 + clamp(96px, 11.3vw, 190px) * 0.5)',
          }}
          transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
          className="relative -translate-y-1/2 flex items-center justify-center"
        >
          {/* Inner ring: radius = half active size + 5vw */}
          <div
            className="absolute rounded-full border-[1.6px] border-white/50 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: 'calc(clamp(96px, 11.3vw, 190px) + 10vw)',
              height: 'calc(clamp(96px, 11.3vw, 190px) + 10vw)',
              left: 'calc(clamp(96px, 11.3vw, 190px) * 0.5)',
              top: 0,
            }}
          />
          {/* Outer ring: radius = half active size + 10.8vw */}
          <div
            className="absolute rounded-full border-[1.6px] border-white/50 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: 'calc(clamp(96px, 11.3vw, 190px) + 21.6vw)',
              height: 'calc(clamp(96px, 11.3vw, 190px) + 21.6vw)',
              left: 'calc(clamp(96px, 11.3vw, 190px) * 0.5)',
              top: 0,
            }}
          />

          {/* Connector Line: 3px white rounded bar, 4.7vw long (min 40px), 0.8vw left of active thumbnail */}
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: showCaption ? 1 : 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="hidden sm:block absolute right-[calc(clamp(96px,11.3vw,190px)*0.5+max(12px,0.8vw))] top-0 -translate-y-1/2 h-[3px] bg-white rounded-full origin-right"
            style={{
              width: 'max(40px, 4.7vw)',
            }}
          />

          {/* Caption Block: anchored by right edge just left of connector (min 16px away), vertically aligned */}
          <div
            className="hidden sm:flex absolute right-[calc(clamp(96px,11.3vw,190px)*0.5+max(12px,0.8vw)+max(40px,4.7vw)+16px)] top-0 -translate-y-1/2 items-start gap-4 text-right text-white max-w-[280px]"
          >
            {/* Caption Text (Urbanist 300 heading, description, reveals left-to-right with clip-path) */}
            <motion.div
              initial={{ clipPath: 'inset(0 0 0 100%)', opacity: 0 }}
              animate={
                showCaption
                  ? { clipPath: 'inset(0 0 0 0%)', opacity: 1 }
                  : { clipPath: 'inset(0 0 0 100%)', opacity: 0 }
              }
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-end"
            >
              <h2
                className="font-[var(--font-urbanist)] font-light text-[clamp(24px,2.75vw,40px)] leading-[1.05] tracking-wide text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] whitespace-nowrap"
              >
                {activeSlideData.captionHeading}
              </h2>
              <p
                className="mt-2 font-[var(--font-urbanist)] text-[clamp(12px,1vw,14.5px)] text-white/88 leading-relaxed max-w-[250px] drop-shadow-sm font-normal"
              >
                {activeSlideData.captionDescription}
              </p>
            </motion.div>

            {/* 3px white vertical bar, 6.5vw tall (min 84px), grows from top (scaleY 0 -> 1) */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: showCaption ? 1 : 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-[3px] bg-white rounded-full origin-top shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
              style={{
                height: 'max(84px, 6.5vw)',
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
