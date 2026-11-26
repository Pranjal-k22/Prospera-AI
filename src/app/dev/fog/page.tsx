'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Sun, Moon, Sparkles } from 'lucide-react';
import { useFogClock } from '@/components/listing/useFogClock';

export default function FogDevPreviewPage() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [playIntroKey, setPlayIntroKey] = useState(1);

  const { isNight, setTime, toggleTime, debugState } = useFogClock(
    heroRef,
    canvasRef,
    {
      initialNight: false,
      playIntro: true,
    }
  );

  const handleToggle = (toNight: boolean) => {
    setTime(toNight);
  };

  const handleReplayIntro = () => {
    setPlayIntroKey((k) => k + 1);
  };

  return (
    <div className="w-full min-w-full flex-1 min-h-screen bg-[#070b12] text-white">
      {/* Top Dev Navigation */}
      <div className="fixed top-3 left-4 z-50 flex items-center gap-3 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs">
        <Link href="/" className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors">
          <ArrowLeft size={14} />
          <span>Back to Landing</span>
        </Link>
        <div className="w-[1px] h-3 bg-white/20" />
        <span className="text-amber-400 font-mono font-medium">/dev/fog</span>
        <span className="text-white/40">WebGL2 Shader &amp; Clock Preview</span>
      </div>

      {/* Real-time Telemetry Debug Overlay */}
      <div className="fixed top-14 left-4 z-50 p-4 rounded-xl bg-black/80 backdrop-blur-lg border border-white/20 font-mono text-xs w-[310px] shadow-2xl space-y-2.5">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <strong className="text-white text-[13px]">Fog Clock Engine</strong>
          </div>
          <span className="text-emerald-400 font-bold">{debugState.fps} FPS</span>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11.5px]">
          <div>
            <span className="text-white/50">State: </span>
            <span className="text-amber-300 font-semibold">
              {debugState.isIntro
                ? 'INTRO FOG'
                : debugState.animating
                ? 'TRANSITIONING'
                : debugState.isNight
                ? 'NIGHT'
                : 'MORNING'}
            </span>
          </div>
          <div>
            <span className="text-white/50">Elapsed d: </span>
            <span className="text-cyan-300">{debugState.d} ms</span>
          </div>
          <div>
            <span className="text-white/50">Sink y: </span>
            <span className="text-yellow-300">{debugState.y}</span>
          </div>
          <div>
            <span className="text-white/50">Surge S: </span>
            <span className="text-purple-300">{debugState.surge}</span>
          </div>
          <div>
            <span className="text-white/50">UI dip: </span>
            <span className="text-pink-300">{debugState.dip}</span>
          </div>
          <div>
            <span className="text-white/50">Interpolation K: </span>
            <span className="text-emerald-300">{debugState.k}</span>
          </div>
          <div>
            <span className="text-white/50">K2 (Local): </span>
            <span className="text-teal-300">{debugState.k2}</span>
          </div>
          <div>
            <span className="text-white/50">Active View: </span>
            <span className="text-white font-bold">{isNight ? 'Night' : 'Morning'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={toggleTime}
            className="flex-1 py-1 px-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 transition-colors text-center"
          >
            {isNight ? 'Switch Morning' : 'Switch Night'}
          </button>
          <button
            type="button"
            onClick={handleReplayIntro}
            title="Replay intro animation"
            className="p-1 px-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 transition-colors"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* THE CINEMATIC FOG HERO CONTAINER */}
      <section
        key={playIntroKey}
        ref={heroRef}
        aria-label="Listing Cinematic Hero"
        className="fog-hero relative w-full h-[100svh] min-h-[560px] overflow-hidden isolate select-none"
        style={{
          containerType: 'size',
          background: '#0b1426',
        }}
      >
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

        {/* LAYER 1: .sky (Blurred still sky with crossfade) */}
        <div className="sky absolute inset-0 pointer-events-none overflow-hidden">
          {/* Morning Sky gradient */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              background: 'radial-gradient(circle at 60% 40%, #fed8a6 0%, #e0a370 30%, #7b9bb6 65%, #3d5870 100%)',
              filter: 'blur(calc(7 * var(--u, 1px)))',
              transform: 'scale(1.05)',
            }}
          />
          {/* Night Sky gradient on top, opacity = var(--k) */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 70% 30%, #1e3a5f 0%, #0d1e34 40%, #060d18 80%, #03070d 100%)',
              filter: 'blur(calc(7 * var(--u, 1px)))',
              transform: 'scale(1.05)',
              opacity: 'var(--k, 0)',
            }}
          />
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
            {/* Ground & shrubs layer with mask */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80")',
                maskImage: 'linear-gradient(to bottom, transparent 54%, #000000 64%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 54%, #000000 64%)',
                filter: 'brightness(1.05) saturate(1.1)',
              }}
            />
            {/* Building facade overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80")',
                filter: 'brightness(1.02) contrast(1.04)',
              }}
            />
          </div>

          {/* Night Building Set */}
          <div
            className={`absolute inset-0 transition-opacity duration-150 ${
              isNight ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Ground & shrubs layer with mask (night ambient) */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80")',
                maskImage: 'linear-gradient(to bottom, transparent 54%, #000000 64%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 54%, #000000 64%)',
                filter: 'brightness(0.65) saturate(1.25) hue-rotate(-15deg)',
              }}
            />
            {/* Building facade with nighttime glow */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80")',
                filter: 'brightness(0.7) contrast(1.15) hue-rotate(-10deg)',
              }}
            />
          </div>
        </div>

        {/* LAYER 3: .tilt (Depth haze backdrop blur, hidden on mobile) */}
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
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border text-xs sm:text-sm font-medium transition-colors"
              style={{
                color: 'var(--nav)',
                borderColor: 'color-mix(in srgb, var(--nav) 25%, transparent)',
                background: 'color-mix(in srgb, var(--nav) 8%, transparent)',
              }}
            >
              <span>Home</span>
              <span className="opacity-40">/</span>
              <span>Mumbai</span>
              <span className="opacity-40">/</span>
              <span className="font-semibold">The Waterfront Penthouse</span>
            </div>

            {/* AI visualization badge */}
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

            {/* Close "x" pill */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border text-xs font-semibold uppercase tracking-wider cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                color: 'var(--nav)',
                borderColor: 'color-mix(in srgb, var(--nav) 30%, transparent)',
                background: 'color-mix(in srgb, var(--nav) 10%, transparent)',
              }}
            >
              <span>Close</span>
              <span className="text-sm leading-none">&times;</span>
            </div>
          </div>

          {/* Centered Headline & Action */}
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto mt-[4vh] pointer-events-auto">
            <h1
              className="font-[var(--font-urbanist)] font-medium text-center tracking-[-0.022em] leading-[1.08]"
              style={{
                fontSize: 'clamp(36px, calc(64 * var(--u, 1px)), 78px)',
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
                The Waterfront Penthouse
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
                <span>Worli Sea Face, Mumbai</span>
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
                ₹28.5 Cr
              </span>

              <button
                type="button"
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
          <div className="flex flex-col items-center gap-3 mt-auto pointer-events-auto pb-4">
            {/* The Glass Morning/Night Toggle */}
            <div
              role="group"
              aria-label="Time of day view selector"
              className="relative grid grid-cols-2 p-1 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all"
              style={{
                width: 'clamp(280px, calc(524 * var(--u, 1px)), 480px)',
                minHeight: 'calc(80 * var(--u, 1px))',
                background: 'rgba(120, 132, 140, 0.34)',
                borderColor: 'rgba(255, 255, 255, 0.22)',
              }}
            >
              {/* Morning Option Button */}
              <button
                type="button"
                aria-pressed={!isNight}
                onClick={() => handleToggle(false)}
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
                  Arabian Sea Sunrise
                </span>
              </button>

              {/* Night Option Button */}
              <button
                type="button"
                aria-pressed={isNight}
                onClick={() => handleToggle(true)}
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
                  City Lights Ambience
                </span>
              </button>
            </div>

            {/* Listing Summary Caption */}
            <p
              className="text-xs sm:text-sm font-normal tracking-wide text-center max-w-lg"
              style={{
                color: 'var(--soft)',
              }}
            >
              Direct high-speed elevator, rooftop heated jacuzzi deck &amp; triple-glazed acoustic facade.
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

      {/* SAMPLE DETAILS SECTION BELOW (to test seam and contrast) */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-16 space-y-8">
        <div className="border-b border-white/10 pb-4">
          <h2 className="text-2xl font-serif">Property Details &amp; Specifications</h2>
          <p className="text-white/60 text-sm mt-1">
            Testing the seamless gradient transition from the hero WebGL fog into the dark page background.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="font-semibold text-lg text-amber-400">RERA &amp; Title Verification</h3>
            <p className="text-sm text-white/70 leading-relaxed">
              RERA registration and title documents available on request. Details to be confirmed with the broker.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="font-semibold text-lg text-cyan-400">Pricing &amp; EMI Breakdown</h3>
            <p className="text-sm text-white/70 leading-relaxed">
              Price: ₹28.5 Cr &bull; Estimated EMI: ₹14.8 L/month &bull; 5 BHK Penthouse
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
