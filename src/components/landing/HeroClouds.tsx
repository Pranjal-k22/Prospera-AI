'use client';

import React from 'react';
import Image from 'next/image';
import { isImageConfigured, LANDING_IMAGES } from '@/lib/landing-images';

interface HeroCloudsProps {
  scrollY: number;
}

export function HeroClouds({ scrollY }: HeroCloudsProps) {
  const hasCloudAsset = isImageConfigured(LANDING_IMAGES.cloudAssetUrl);

  // Top cloud layer opacity based on scroll: opacity = scrollY / (0.45 * innerHeight)
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
  const topCloudOpacity = Math.min(1, Math.max(0, scrollY / (0.45 * vh)));
  const topCloudTranslateY = -scrollY * 0.25;

  // Bottom cloud bank translateY and scale from scroll choreography:
  // translateY(-0.38 x scrollY), scale(1 + 0.35 x scrollY / vh)
  const bottomTranslateY = -0.38 * scrollY;
  const bottomScale = 1 + (0.35 * scrollY) / vh;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[7] overflow-hidden select-none"
    >
      {/* 1. TOP CLOUD LAYER: flipped vertically, -30% to 50% height, fades in on scroll */}
      <div
        className="absolute inset-x-[-4%] top-[-30%] h-[80%] transition-opacity duration-300"
        style={{
          opacity: topCloudOpacity * 0.85,
          transform: `translate3d(0, ${topCloudTranslateY}px, 0) scaleY(-1)`,
          maskImage: 'linear-gradient(to bottom, black 20%, transparent 85%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 85%)',
        }}
      >
        {hasCloudAsset ? (
          <Image
            src={LANDING_IMAGES.cloudAssetUrl}
            alt=""
            fill
            unoptimized
            className="object-cover mix-blend-screen opacity-70"
          />
        ) : (
          <div className="w-full h-full relative">
            <div className="absolute top-1/4 left-1/4 w-[60vw] h-[35vh] rounded-[100%] bg-gradient-to-r from-white/35 via-white/50 to-white/20 blur-[60px] opacity-60" />
            <div className="absolute top-1/3 right-1/4 w-[50vw] h-[30vh] rounded-[100%] bg-gradient-to-l from-[#ffe8dc]/30 via-white/45 to-transparent blur-[50px] opacity-55" />
          </div>
        )}
      </div>

      {/* 2. BOTTOM CLOUD BANK: left/right -4%, bottom -6%, height 78% of hero */}
      <div
        className="absolute inset-x-[-4%] bottom-[-6%] h-[78%] origin-bottom"
        style={{
          transform: `translate3d(0, ${bottomTranslateY}px, 0) scale(${bottomScale})`,
        }}
      >
        {/* Mask fading top from transparent 0% to opaque 38% */}
        <div
          className="w-full h-full relative"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 38%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 38%)',
          }}
        >
          {/* Back copy: mirrored horizontally, 85% opacity, drifts +/-3% sideways & 4% vertically over 34s */}
          <div
            className="cloud-drift-back absolute inset-0 opacity-85 origin-center"
            style={{
              transform: 'scaleX(-1)',
            }}
          >
            {hasCloudAsset ? (
              <Image
                src={LANDING_IMAGES.cloudAssetUrl}
                alt=""
                fill
                unoptimized
                className="object-cover mix-blend-screen"
              />
            ) : (
              <div className="w-full h-full relative">
                <div className="absolute bottom-[10%] left-[5%] w-[65vw] h-[45vh] rounded-[100%] bg-radial from-white/60 via-white/40 to-transparent blur-[55px]" />
                <div className="absolute bottom-[2%] right-[8%] w-[60vw] h-[40vh] rounded-[100%] bg-radial from-[#fdf0e7]/70 via-white/50 to-transparent blur-[65px]" />
              </div>
            )}
          </div>

          {/* Front copy: drifts sideways -2.5% to +2.5% over 26s, alternating */}
          <div className="cloud-drift-front absolute inset-0 origin-center">
            {hasCloudAsset ? (
              <Image
                src={LANDING_IMAGES.cloudAssetUrl}
                alt=""
                fill
                unoptimized
                className="object-cover mix-blend-screen"
              />
            ) : (
              <div className="w-full h-full relative">
                <div className="absolute bottom-0 left-[15%] w-[75vw] h-[50vh] rounded-[100%] bg-radial from-white/80 via-white/55 to-transparent blur-[50px]" />
                <div className="absolute bottom-[-5%] right-[2%] w-[55vw] h-[42vh] rounded-[100%] bg-radial from-[#fae1d2]/75 via-white/65 to-transparent blur-[60px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[45vw] h-[35vh] rounded-[100%] bg-radial from-white/70 via-white/40 to-transparent blur-[45px]" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM FADE OVERLAY on the lowest 46% of the hero:
          rgba(247,217,198,0) -> .45 at 45% -> .92 at 82% -> solid #f7d9c6.
          In dark mode: transparent -> .45 at 45% -> .92 at 82% -> solid #0a0e17. */}
      <div
        className="hero-bottom-fade absolute inset-x-0 bottom-0 h-[46%] pointer-events-none z-[8]"
      />

      <style jsx>{`
        .hero-bottom-fade {
          background: linear-gradient(
            180deg,
            rgba(247, 217, 198, 0) 0%,
            rgba(247, 217, 198, 0.45) 45%,
            rgba(247, 217, 198, 0.92) 82%,
            #f7d9c6 100%
          );
        }
        :global([data-theme='dark']) .hero-bottom-fade {
          background: linear-gradient(
            180deg,
            rgba(10, 14, 23, 0) 0%,
            rgba(10, 14, 23, 0.45) 45%,
            rgba(10, 14, 23, 0.92) 82%,
            #0a0e17 100%
          );
        }

        @keyframes cloudDriftFront {
          0% {
            transform: translate3d(-2.5%, 0, 0);
          }
          50% {
            transform: translate3d(2.5%, 0, 0);
          }
          100% {
            transform: translate3d(-2.5%, 0, 0);
          }
        }

        @keyframes cloudDriftBack {
          0% {
            transform: scaleX(-1) translate3d(-3%, -2%, 0);
          }
          50% {
            transform: scaleX(-1) translate3d(3%, 2%, 0);
          }
          100% {
            transform: scaleX(-1) translate3d(-3%, -2%, 0);
          }
        }

        .cloud-drift-front {
          animation: cloudDriftFront 26s ease-in-out infinite;
        }

        .cloud-drift-back {
          animation: cloudDriftBack 34s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .cloud-drift-front,
          .cloud-drift-back {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
