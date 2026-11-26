'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Send,
  Zap,
  SlidersHorizontal,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  GenerateButton,
  GenerateButtonTone,
  GenerateButtonVariant,
  GenerateButtonSize,
  GenerateButtonStatus,
  TONE_HUES,
} from '@/components/ui/generate-button';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassPill } from '@/components/ui/GlassPill';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { NumberCounter } from '@/components/ui/NumberCounter';
import { Sparkline } from '@/components/ui/Sparkline';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Toggle } from '@/components/ui/Toggle';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/Modal';
import { Sheet } from '@/components/ui/Sheet';
import { Timeline } from '@/components/ui/Timeline';
import { useToast } from '@/components/ui/Toast';
import { fadeInUp, staggerContainer } from '@/lib/motion';

export default function DesignSystemShowcase() {
  const { toast } = useToast();

  // Component testbed states
  const [btnLoading, setBtnLoading] = useState(false);
  const [btnSuccess, setBtnSuccess] = useState(false);

  // GenerateButton Showcase States
  const [showcaseStatus, setShowcaseStatus] = useState<GenerateButtonStatus>('idle');
  const [showcaseTone, setShowcaseTone] = useState<GenerateButtonTone>('amber');
  const [showcaseVariant, setShowcaseVariant] = useState<GenerateButtonVariant>('solid');
  const [showcaseSize, setShowcaseSize] = useState<GenerateButtonSize>('md');
  const [isSimulatingReducedMotion, setIsSimulatingReducedMotion] = useState(false);

  const handleRunShowcaseGeneration = () => {
    setShowcaseStatus('generating');
    setTimeout(() => {
      setShowcaseStatus('success');
      toast.success('AI Pipeline Executed', 'Synthesized real-time market telemetry and comp model.');
    }, 1400);
  };
  const [segmentedVal, setSegmentedVal] = useState('deals');
  const [toggleVal, setToggleVal] = useState(true);
  const [testScore, setTestScore] = useState(88);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSimulateAction = () => {
    setBtnLoading(true);
    setTimeout(() => {
      setBtnLoading(false);
      setBtnSuccess(true);
      toast.success('Action Completed', 'The simulated transaction payload was verified.');
      setTimeout(() => setBtnSuccess(false), 2000);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Header */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="mb-10 text-center max-w-3xl mx-auto"
      >
        <GlassPill variant="accent" className="mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Liquid Glass Design Specification</span>
        </GlassPill>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[var(--text)] mb-3">
          Prospera UI Component Gallery
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-2)] leading-relaxed">
          Apple VisionOS inspired frosted crystal glass primitives, spring kinetics, cursor-follow specular lighting, and typography hierarchy.
        </p>
      </motion.div>

      {/* Grid of Primitive Sections */}
      <motion.div
        variants={staggerContainer(0.08, 0.1)}
        initial="hidden"
        animate="visible"
        className="space-y-10"
      >
        {/* SECTION -1: GLOBAL GOOEY AI CHAT LAUNCHER & PANEL */}
        <GlassCard className="p-6 sm:p-8 border-2 border-[#e8a33b]/40 bg-gradient-to-br from-[#e8a33b]/10 to-transparent" hoverLift={false} strong>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#e8a33b] text-[#121620] flex items-center justify-center font-bold shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-[var(--text)]">Global Gooey AI Chat Launcher &amp; Panel</h2>
                <p className="text-xs text-[var(--text-2)]">
                  Morphed SVG gooey spring mechanics, context-aware prompt rising pills, and full LiquidGlass streaming copilot
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-md bg-white/10 border border-white/15 font-mono text-amber-300">
                Ctrl / ⌘ + J
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel p-4 rounded-xl border border-[var(--glass-border)] space-y-2">
              <span className="text-xs font-semibold text-[#e8a33b] block">Listing Context</span>
              <p className="text-xs text-[var(--text-2)]">Pre-loads &ldquo;The Waterfront Penthouse&rdquo; into the AI panel with prompt chips.</p>
              <Button
                variant="glass"
                size="sm"
                className="w-full text-xs"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('open-ai-chat', {
                      detail: {
                        context: {
                          route: '/homes/prop-1',
                          listingId: 'prop-1',
                          title: 'The Waterfront Penthouse',
                          locality: 'Worli Sea Face',
                          city: 'Mumbai',
                          priceFormatted: '₹28.5 Cr',
                        },
                        initialPrompt: 'Summarize this home and evaluate if the price is fair.',
                      },
                    })
                  );
                }}
              >
                Launch with Listing
              </Button>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-[var(--glass-border)] space-y-2">
              <span className="text-xs font-semibold text-emerald-400 block">Lead Hub Context</span>
              <p className="text-xs text-[var(--text-2)]">Pre-loads &ldquo;Ananya Patel&rdquo; for broker objection handling and WhatsApp openers.</p>
              <Button
                variant="glass"
                size="sm"
                className="w-full text-xs"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('open-ai-chat', {
                      detail: {
                        context: {
                          route: '/broker/leads/lead-1',
                          leadId: 'lead-1',
                          leadName: 'Ananya Patel',
                          leadCompany: 'Nexus Health',
                          leadStage: 'Site Visit',
                        },
                        initialPrompt: 'Draft a WhatsApp opener and summarize key objections.',
                      },
                    })
                  );
                }}
              >
                Launch with Lead
              </Button>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-[var(--glass-border)] space-y-2">
              <span className="text-xs font-semibold text-cyan-400 block">General Marketplace</span>
              <p className="text-xs text-[var(--text-2)]">Opens general real-estate advisor with rising prompt suggestions.</p>
              <Button
                variant="primary"
                size="sm"
                className="w-full text-xs"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('open-ai-chat'));
                }}
              >
                Open General Chat
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* SECTION 0: RE-THEMED AI GENERATE BUTTON SHOWCASE */}
        <GlassCard className="p-6 sm:p-8 border-2 border-[var(--accent)]/30 space-y-8" hoverLift={false} strong>
          {/* Header & Interactive Sandbox Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[var(--glass-border)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-bold text-[var(--text)]">Re-Themed AI Generate Button</h2>
                <p className="text-xs text-[var(--text-2)]">
                  Pill with inner bevel, halo ring, rising highlight gradient, and CSS Grid zero-layout-jump stack.
                </p>
              </div>
            </div>

            {/* Interactive Sandbox Controller */}
            <div className="flex flex-wrap items-center gap-3 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--glass-border)]">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-[var(--text-3)] uppercase">Tone:</span>
                {(['amber', 'emerald', 'blue', 'cyan', 'rose'] as GenerateButtonTone[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setShowcaseTone(t)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono capitalize transition-colors ${
                      showcaseTone === t
                        ? 'bg-[var(--accent)] text-black font-bold'
                        : 'bg-white/10 text-[var(--text-2)] hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="h-4 w-[1px] bg-[var(--glass-border)] hidden sm:block" />

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-[var(--text-3)] uppercase">Size:</span>
                {(['sm', 'md', 'lg'] as GenerateButtonSize[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setShowcaseSize(s)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono uppercase transition-colors ${
                      showcaseSize === s
                        ? 'bg-[var(--accent)] text-black font-bold'
                        : 'bg-white/10 text-[var(--text-2)] hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="h-4 w-[1px] bg-[var(--glass-border)] hidden sm:block" />

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-[var(--text-3)] uppercase">Variant:</span>
                {(['solid', 'frosted'] as GenerateButtonVariant[]).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setShowcaseVariant(v)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono capitalize transition-colors ${
                      showcaseVariant === v
                        ? 'bg-[var(--accent)] text-black font-bold'
                        : 'bg-white/10 text-[var(--text-2)] hover:text-white'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>

              <div className="h-4 w-[1px] bg-[var(--glass-border)] hidden sm:block" />

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-[var(--text-3)] uppercase">Status:</span>
                {(['idle', 'generating', 'success', 'error'] as GenerateButtonStatus[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setShowcaseStatus(s)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono capitalize transition-colors ${
                      showcaseStatus === s
                        ? 'bg-[#3b82f6] text-white font-bold'
                        : 'bg-white/10 text-[var(--text-2)] hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="h-4 w-[1px] bg-[var(--glass-border)] hidden sm:block" />

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-[var(--text-3)] uppercase">Reduced Motion:</span>
                <button
                  type="button"
                  onClick={() => setIsSimulatingReducedMotion((prev) => !prev)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    isSimulatingReducedMotion
                      ? 'bg-amber-500 text-black font-bold'
                      : 'bg-white/10 text-[var(--text-2)] hover:text-white'
                  }`}
                >
                  {isSimulatingReducedMotion ? 'Active' : 'Off'}
                </button>
              </div>
            </div>
          </div>

          {/* 1. INTERACTIVE LIVE TESTBED */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-black/5 via-white/5 to-black/5 border border-[var(--glass-border)] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent)] font-semibold block mb-1">
                Interactive Test Sandbox (Click to Run Async Pipeline)
              </span>
              <p className="text-xs text-[var(--text-2)]">
                Active config: tone={showcaseTone} (hue {TONE_HUES[showcaseTone]}), variant={showcaseVariant}, status={showcaseStatus}.
              </p>
            </div>
            <GenerateButton
              tone={showcaseTone}
              variant={showcaseVariant}
              size={showcaseSize}
              status={showcaseStatus}
              label="Synthesize deal room"
              generatingLabel="Synthesizing..."
              successLabel="Synthesis Complete"
              onClick={handleRunShowcaseGeneration}
              onSettled={() => setShowcaseStatus('idle')}
            />
          </div>

          {/* 2. TONE MATRIX: All 5 Tones in Solid and Frosted */}
          <div>
            <h3 className="text-sm font-mono uppercase tracking-wider text-[var(--accent)] font-semibold mb-4">
              1. Tone Matrix (5 Semantics × 2 Surface Variants)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Amber */}
              <div className="glass-panel p-4 rounded-2xl border border-[var(--glass-border)] flex flex-col items-center text-center space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                  Amber (Hue 37)
                </span>
                <GenerateButton
                  tone="amber"
                  label="Find matches"
                  generatingLabel="Matching..."
                  onClick={() => toast.info('Amber Triggered', 'General AI & Copilot matchmaking.')}
                />
                <span className="text-[11px] text-[var(--text-3)]">General AI, Search & Copilot</span>
              </div>

              {/* Emerald */}
              <div className="glass-panel p-4 rounded-2xl border border-[var(--glass-border)] flex flex-col items-center text-center space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-[#30C48D] font-semibold">
                  Emerald (Hue 150)
                </span>
                <GenerateButton
                  tone="emerald"
                  label="Generate valuation"
                  generatingLabel="Valuing..."
                  onClick={() => toast.success('Emerald Triggered', 'Valuation & Deal Approvals.')}
                />
                <span className="text-[11px] text-[var(--text-3)]">Valuations & Deal Approvals</span>
              </div>

              {/* Blue */}
              <div className="glass-panel p-4 rounded-2xl border border-[var(--glass-border)] flex flex-col items-center text-center space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
                  Blue (Hue 210)
                </span>
                <GenerateButton
                  tone="blue"
                  label="Generate term sheet"
                  generatingLabel="Drafting..."
                  onClick={() => toast.info('Blue Triggered', 'Reports & Legal Term Sheets.')}
                />
                <span className="text-[11px] text-[var(--text-3)]">Summaries, Reports & LOI</span>
              </div>

              {/* Cyan */}
              <div className="glass-panel p-4 rounded-2xl border border-[var(--glass-border)] flex flex-col items-center text-center space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  Cyan (Hue 172)
                </span>
                <GenerateButton
                  tone="cyan"
                  label="Re-score lead"
                  generatingLabel="Scoring..."
                  onClick={() => toast.success('Cyan Triggered', 'Broker Cockpit Telemetry.')}
                />
                <span className="text-[11px] text-[var(--text-3)]">Broker Cockpit & Re-scoring</span>
              </div>

              {/* Rose */}
              <div className="glass-panel p-4 rounded-2xl border border-[var(--glass-border)] flex flex-col items-center text-center space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-semibold">
                  Rose (Hue 350)
                </span>
                <GenerateButton
                  tone="rose"
                  label="Risk analysis"
                  generatingLabel="Analyzing..."
                  onClick={() => toast.warning('Rose Triggered', 'Risk analysis & Covenants.')}
                />
                <span className="text-[11px] text-[var(--text-3)]">Mandate Risk & Exception Analysis</span>
              </div>
            </div>
          </div>

          {/* 3. KINETIC STATES ROW (Forced debug classes + Live states) */}
          <div>
            <h3 className="text-sm font-mono uppercase tracking-wider text-[var(--accent)] font-semibold mb-4">
              2. Kinetic States Row (Idle, Hover, Active, Focus, Generating, Success, Error, Disabled)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              <div className="flex flex-col items-center gap-2 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--glass-border)] text-center">
                <span className="text-[11px] font-mono text-[var(--text-3)]">1. Idle</span>
                <GenerateButton size="sm" tone="amber" label="Generate" />
              </div>
              <div className="flex flex-col items-center gap-2 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--glass-border)] text-center">
                <span className="text-[11px] font-mono text-[var(--text-3)]">2. Hover (Debug)</span>
                <GenerateButton size="sm" tone="amber" label="Generate" className="gen-hover-debug" />
              </div>
              <div className="flex flex-col items-center gap-2 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--glass-border)] text-center">
                <span className="text-[11px] font-mono text-[var(--text-3)]">3. Active (Debug)</span>
                <GenerateButton size="sm" tone="amber" label="Generate" className="gen-active-debug" />
              </div>
              <div className="flex flex-col items-center gap-2 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--glass-border)] text-center">
                <span className="text-[11px] font-mono text-[var(--text-3)]">4. Focus (Debug)</span>
                <GenerateButton size="sm" tone="amber" label="Generate" className="gen-focus-debug" />
              </div>
              <div className="flex flex-col items-center gap-2 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--glass-border)] text-center">
                <span className="text-[11px] font-mono text-[var(--text-3)]">5. Generating</span>
                <GenerateButton size="sm" tone="amber" status="generating" label="Generate" generatingLabel="Generating..." />
              </div>
              <div className="flex flex-col items-center gap-2 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--glass-border)] text-center">
                <span className="text-[11px] font-mono text-[var(--text-3)]">6. Success</span>
                <GenerateButton size="sm" tone="amber" status="success" successLabel="Done" />
              </div>
              <div className="flex flex-col items-center gap-2 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--glass-border)] text-center">
                <span className="text-[11px] font-mono text-[var(--text-3)]">7. Error</span>
                <GenerateButton size="sm" tone="amber" status="error" errorLabel="Try again" />
              </div>
              <div className="flex flex-col items-center gap-2 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--glass-border)] text-center">
                <span className="text-[11px] font-mono text-[var(--text-3)]">8. Disabled</span>
                <GenerateButton size="sm" tone="amber" disabled label="Disabled" />
              </div>
            </div>
          </div>

          {/* 4. SIZING SCALE & ZERO-JUMP LAYOUT STACK */}
          <div>
            <h3 className="text-sm font-mono uppercase tracking-wider text-[var(--accent)] font-semibold mb-4">
              3. Sizing Scale & CSS Grid Stack (Zero Layout Jump)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--glass-border)] flex flex-col items-center justify-center gap-2">
                <span className="text-xs font-mono text-[var(--text-3)]">Small (36px height, &gt;=44px touch)</span>
                <GenerateButton size="sm" tone="blue" label="Draft contract" />
              </div>
              <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--glass-border)] flex flex-col items-center justify-center gap-2">
                <span className="text-xs font-mono text-[var(--text-3)]">Medium (44px height, Default)</span>
                <GenerateButton size="md" tone="amber" label="Find luxury matches" />
              </div>
              <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--glass-border)] flex flex-col items-center justify-center gap-2">
                <span className="text-xs font-mono text-[var(--text-3)]">Large (52px height, Hero Primary)</span>
                <GenerateButton size="lg" tone="emerald" label="Generate AI valuation" />
              </div>
            </div>

            {/* Long Label Stress Test & Full Width */}
            <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--glass-border)] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs font-mono text-[var(--text-3)]">
                  Long Label Stress Test (Stack sizes container to max width without jitter):
                </span>
                <GenerateButton
                  tone="blue"
                  label="Generate cross-border portfolio term sheet"
                  generatingLabel="Drafting legal LOI covenants..."
                  successLabel="Portfolio LOI Ready"
                  status={showcaseStatus}
                />
              </div>
              <div className="pt-2">
                <span className="text-xs font-mono text-[var(--text-3)] block mb-2">
                  Full Width Container (fullWidth):
                </span>
                <GenerateButton
                  fullWidth
                  tone="amber"
                  label="Match verified luxury buyers across all Indian micro-markets"
                />
              </div>
            </div>
          </div>

          {/* 5. LIVE WCAG CONTRAST RATIO & ACCESSIBILITY READOUT */}
          <div>
            <h3 className="text-sm font-mono uppercase tracking-wider text-[var(--accent)] font-semibold mb-4">
              4. Accessibility & Live WCAG Contrast Readout Table
            </h3>
            <div className="overflow-x-auto rounded-xl border border-[var(--glass-border)]">
              <table className="w-full text-xs text-left">
                <thead className="bg-black/10 dark:bg-white/5 text-[var(--text-3)] font-mono uppercase text-[10.5px]">
                  <tr>
                    <th className="p-3">Theme</th>
                    <th className="p-3">Button Body</th>
                    <th className="p-3">Label Text</th>
                    <th className="p-3">Contrast Ratio</th>
                    <th className="p-3">WCAG Level</th>
                    <th className="p-3">Aria Announcements</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--glass-border)]">
                  <tr>
                    <td className="p-3 font-semibold text-[var(--text)]">Light Theme (Warm Dusk)</td>
                    <td className="p-3 font-mono">#1d1a1c (Warm Ink)</td>
                    <td className="p-3 font-mono">#f4f5f8 (Frost White)</td>
                    <td className="p-3 font-mono font-bold text-emerald-500">14.8 : 1</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                        AAA Pass (&gt; 7:1)
                      </span>
                    </td>
                    <td className="p-3 text-[var(--text-2)]">aria-live=&quot;polite&quot;, aria-busy, aria-label</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[var(--text)]">Dark Theme (Deep Slate)</td>
                    <td className="p-3 font-mono">#101720 (Slate Obsidian)</td>
                    <td className="p-3 font-mono">#f4f5f8 (Frost White)</td>
                    <td className="p-3 font-mono font-bold text-emerald-500">14.5 : 1</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                        AAA Pass (&gt; 7:1)
                      </span>
                    </td>
                    <td className="p-3 text-[var(--text-2)]">aria-live=&quot;polite&quot;, aria-busy, aria-label</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[var(--text)]">Idle Rest Dimming (86%)</td>
                    <td className="p-3 font-mono">#1d1a1c / #101720</td>
                    <td className="p-3 font-mono">rgba(244,245,248,0.86)</td>
                    <td className="p-3 font-mono font-bold text-emerald-500">11.6 : 1</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                        AAA Pass (&gt; 7:1)
                      </span>
                    </td>
                    <td className="p-3 text-[var(--text-2)]">Letters aria-hidden, announced via button label</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[var(--text)]">Focus Indicator</td>
                    <td className="p-3 font-mono">Outline Offset 2px</td>
                    <td className="p-3 font-mono">#e8a33b (Amber Glow)</td>
                    <td className="p-3 font-mono font-bold text-emerald-500">Dual Ring</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                        High Visibility Focus
                      </span>
                    </td>
                    <td className="p-3 text-[var(--text-2)]">Halo ::before lights up simultaneously</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[var(--text)]">Reduced Motion</td>
                    <td className="p-3 font-mono">prefers-reduced-motion</td>
                    <td className="p-3 font-mono">Static Text + Sweep</td>
                    <td className="p-3 font-mono font-bold text-blue-400">0ms Jitter</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">
                        Compliant
                      </span>
                    </td>
                    <td className="p-3 text-[var(--text-2)]">Wave, shake, flicker disabled; slow pulse sweep active</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </GlassCard>

        {/* SECTION 1: BUTTONS & INTERACTION KINETICS */}
        <GlassCard className="p-6 sm:p-8" hoverLift={false}>
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-[var(--accent)]" />
            <h2 className="text-xl font-serif font-bold text-[var(--text)]">Buttons & Kinetic Micro-Interactions</h2>
          </div>

          <div className="space-y-6">
            {/* Variants */}
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-3)] mb-3">Variants</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" iconRight={<ArrowRight className="w-4 h-4" />}>
                  Primary CTA
                </Button>
                <Button variant="glass" iconLeft={<ShieldCheck className="w-4 h-4" />}>
                  Glass Pill
                </Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="danger">Escalate Risk</Button>
                <Button variant="success">Finalize Deal</Button>
                <Button disabled>Disabled State</Button>
              </div>
            </div>

            {/* Sizes & Magnetic Effect */}
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-3)] mb-3">
                Sizes & Magnetic Effect (Hover within 20px)
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small (32px)</Button>
                <Button size="md">Medium Standard (40px)</Button>
                <Button size="lg" magnetic variant="primary" iconRight={<ArrowRight className="w-4 h-4" />}>
                  Large Magnetic CTA (48px)
                </Button>
              </div>
            </div>

            {/* Loading to Checkmark State Morph */}
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-3)] mb-3">
                Loading & Checkmark Morph Animation
              </p>
              <div className="flex items-center gap-4">
                <Button
                  variant="primary"
                  loading={btnLoading}
                  success={btnSuccess}
                  onClick={handleSimulateAction}
                  iconRight={<Send className="w-4 h-4" />}
                >
                  Simulate Verification Call
                </Button>
                <span className="text-xs text-[var(--text-3)]">
                  Click to test the loader-to-draw-path checkmark transition with toast feedback.
                </span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* SECTION 2: SCORE RINGS & DATA VIZ */}
        <GlassCard className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-[#30C48D]" />
            <h2 className="text-xl font-serif font-bold text-[var(--text)]">AI Score Rings, Counters & Sparklines</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Score Rings */}
            <div className="glass-panel p-5 rounded-2xl border border-[var(--glass-border)] flex flex-col items-center text-center">
              <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-3)] mb-4">Score Ring Sizes</p>
              <div className="flex items-center justify-around w-full gap-4">
                <ScoreRing score={testScore} size="sm" />
                <ScoreRing score={testScore} size="md" />
                <ScoreRing score={testScore} size="lg" />
              </div>
              <div className="w-full mt-4 flex items-center gap-3">
                <span className="text-xs text-[var(--text-3)]">Adjust Score:</span>
                <input
                  type="range"
                  min="20"
                  max="99"
                  value={testScore}
                  onChange={(e) => setTestScore(Number(e.target.value))}
                  className="flex-1 accent-[var(--accent)]"
                />
                <span className="font-mono text-xs font-bold">{testScore}</span>
              </div>
            </div>

            {/* Rolling Counters */}
            <div className="glass-panel p-5 rounded-2xl border border-[var(--glass-border)] flex flex-col justify-center">
              <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-3)] mb-2">Rolling Number Counter</p>
              <div className="font-serif text-3xl sm:text-4xl font-bold text-[var(--text)]">
                <NumberCounter value={142.8} decimals={1} prefix="₹" suffix=" Cr" />
              </div>
              <p className="text-xs text-[var(--text-2)] mt-1">Live active pipeline value in circulation</p>

              <div className="font-serif text-2xl font-bold text-[#30C48D] mt-4">
                <NumberCounter value={34} prefix="+" suffix="% YoY" />
              </div>
              <p className="text-xs text-[var(--text-2)]">Deal velocity enhancement</p>
            </div>

            {/* Sparklines */}
            <div className="glass-panel p-5 rounded-2xl border border-[var(--glass-border)] flex flex-col justify-center">
              <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-3)] mb-3">Micro Trendlines (Sparklines)</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold">Worli Sea Face Index</p>
                    <p className="text-[11px] text-[var(--text-3)]">+18.4% 90-day</p>
                  </div>
                  <Sparkline data={[10, 14, 13, 20, 24, 22, 35, 41]} color="#0A84FF" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold">Jubilee Hills Absorption</p>
                    <p className="text-[11px] text-[var(--text-3)]">+24.1% 90-day</p>
                  </div>
                  <Sparkline data={[18, 22, 21, 29, 28, 38, 44, 49]} color="#30C48D" />
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* SECTION 3: CONTROLS, TOGGLES & INPUTS */}
        <GlassCard className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <SlidersHorizontal className="w-5 h-5 text-[var(--accent)]" />
            <h2 className="text-xl font-serif font-bold text-[var(--text)]">Controls, Segmented Pills & Glass Inputs</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Segmented Control & Toggle */}
            <div className="space-y-6">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-3)] mb-3">
                  Segmented Control (Sliding Spring Pill Thumb)
                </p>
                <SegmentedControl
                  value={segmentedVal}
                  onChange={setSegmentedVal}
                  options={[
                    { id: 'deals', label: 'All Deals', count: 12 },
                    { id: 'hot', label: 'Hot Priority', count: 5 },
                    { id: 'warm', label: 'Warm Leads', count: 4 },
                    { id: 'closed', label: 'Closed' },
                  ]}
                />
              </div>

              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-3)] mb-3">
                  iOS Stretchy Knob Toggle
                </p>
                <div className="space-y-3">
                  <Toggle
                    checked={toggleVal}
                    onChange={setToggleVal}
                    label={`AI Real-Time Objection Assist: ${toggleVal ? 'Enabled' : 'Disabled'}`}
                  />
                  <Toggle
                    checked={false}
                    disabled
                    onChange={() => {}}
                    label="Automated Escrow Lock (Disabled state)"
                  />
                </div>
              </div>
            </div>

            {/* Floating Label Glass Inputs */}
            <div className="space-y-4">
              <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-3)]">
                Floating Label Liquid Glass Inputs
              </p>
              <Input label="Client Representative Name" defaultValue="Vikram Singhania" />
              <Input label="Target Budget (in Crores)" defaultValue="₹14.5 Cr" />
              <Input label="Email Address with Error" defaultValue="invalid-email" error="Please provide a valid corporate domain email" />
            </div>
          </div>
        </GlassCard>

        {/* SECTION 4: OVERLAYS, TIMELINE & MODALS */}
        <GlassCard className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Layers className="w-5 h-5 text-indigo-500" />
            <h2 className="text-xl font-serif font-bold text-[var(--text)]">Modals, Sheets, Timeline & Toasts</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Modal & Toast Dispatchers */}
            <div className="space-y-4">
              <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-3)]">
                Overlays & Feedback Systems
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="glass" onClick={() => setIsModalOpen(true)}>
                  Open Liquid Glass Modal
                </Button>
                <Button variant="glass" onClick={() => setIsSheetOpen(true)}>
                  Open Slide-Out Sheet
                </Button>
              </div>

              <div className="pt-3">
                <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-3)] mb-2">
                  Toast Notification Dispatchers
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="success" onClick={() => toast.success('Term Sheet Signed', 'Client verified with DigiLocker')}>
                    Success Toast
                  </Button>
                  <Button size="sm" variant="glass" onClick={() => toast.warning('Setback Review Pending', 'BMC sanction required')}>
                    Warning Toast
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => toast.error('Escrow Expired', 'Payment token window elapsed')}>
                    Error Toast
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => toast.info('New Matching Unit', 'Worli Penthouse price revised')}>
                    Info Toast
                  </Button>
                </div>
              </div>
            </div>

            {/* Self-drawing Timeline */}
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-3)] mb-4">
                Self-Drawing Node Timeline
              </p>
              <Timeline
                steps={[
                  { step: 'Letter of Intent Logged', description: 'Initial token transfer recorded in client vault', date: 'Yesterday', completed: true },
                  { step: 'AI Title & Revenue Clearance', description: 'Zero encumbrance verified over 30 years', date: 'Today, 10:00 AM', completed: true },
                  { step: 'Escrow Authorization Pending', description: 'Awaiting signature from primary managing trustee', date: 'In Progress', completed: false, current: true },
                  { step: 'Sub-Registrar Biometric Slot', description: 'Scheduled appointment for registry book sign-off', date: 'Nov 14', completed: false },
                ]}
              />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Test Modal Component */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Liquid Glass Modal Dialogue"
        description="Floating glass crystal sheet with backdrop blur and specular border highlight."
      >
        <div className="space-y-4 text-sm text-[var(--text-2)]">
          <p>
            Notice the frosted background blurring all content underneath, specular highlights on the rim, and spring-scaled entrance.
          </p>
          <div className="glass-panel p-4 rounded-2xl border border-[var(--glass-border)]">
            <span className="font-mono text-xs text-[var(--accent)] font-semibold">TOKEN HASH:</span>
            <p className="font-mono text-xs text-[var(--text)] mt-1">PR-VILLAS-0x892B1C89F3A9</p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Dismiss</Button>
            <Button variant="primary" onClick={() => { setIsModalOpen(false); toast.success('Modal Action Confirmed'); }}>
              Confirm Authorization
            </Button>
          </div>
        </div>
      </Modal>

      {/* Test Sheet Component */}
      <Sheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title="Executive Detail Sheet"
        description="Slide-out drawer with liquid glass surface."
      >
        <div className="space-y-4 text-sm text-[var(--text-2)]">
          <p>
            Slide-out sheets are ideal for dense lead dossiers, post-call debrief logs, or full architectural specification sheets.
          </p>
          <div className="glass-card p-4 rounded-2xl border border-[var(--glass-border)]">
            <h4 className="font-semibold text-[var(--text)]">Sub-Market Intelligence</h4>
            <p className="text-xs text-[var(--text-3)] mt-1">Worli Sea Face micro-inventory absorption rate is running at historic peaks.</p>
          </div>
          <Button variant="primary" className="w-full" onClick={() => setIsSheetOpen(false)}>
            Close Drawer
          </Button>
        </div>
      </Sheet>
    </div>
  );
}

