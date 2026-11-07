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
  CheckCircle,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GenerateButton } from '@/components/ui/generate-button';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassPanel } from '@/components/ui/GlassPanel';
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
  const [genDemoActive, setGenDemoActive] = useState(false);
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
        {/* SECTION 0: INTERACTIVE AI GENERATE BUTTONS */}
        <GlassCard className="p-6 sm:p-8 border-2 border-[var(--accent)]/30" hoverLift={false} strong>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-[var(--text)]">AI Interactive Generate Buttons</h2>
                <p className="text-xs text-[var(--text-2)]">State-driven letter animations, specular rim lighting, and custom hue triggers</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-[var(--text-3)] font-mono">Simulate Generating:</span>
              <Toggle
                checked={genDemoActive}
                onChange={setGenDemoActive}
                label={genDemoActive ? 'Active' : 'Idle'}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Sapphire Blue (Hue 210) */}
            <div className="glass-panel p-4 rounded-2xl border border-[var(--glass-border)] flex flex-col items-center text-center space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
                Sapphire (Hue 210)
              </span>
              <GenerateButton
                hue={210}
                text="Find matches"
                generatingText="Finding matches..."
                isGenerating={genDemoActive}
                onClick={() => toast.success('AI Synthesizer Triggered', 'Analyzing 12 Indian luxury micro-markets.')}
              />
              <span className="text-[11px] text-[var(--text-3)]">Used for AI Matchmaking & Copilot</span>
            </div>

            {/* 2. Emerald / Wealth (Hue 150) */}
            <div className="glass-panel p-4 rounded-2xl border border-[var(--glass-border)] flex flex-col items-center text-center space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#30C48D] font-semibold">
                Emerald (Hue 150)
              </span>
              <GenerateButton
                hue={150}
                text="Generate valuation"
                generatingText="Evaluating..."
                isGenerating={genDemoActive}
                onClick={() => toast.success('AI Valuation Synthesized', 'Calculated carpet area pricing model.')}
              />
              <span className="text-[11px] text-[var(--text-3)]">Used for Valuation & Score Recalculation</span>
            </div>

            {/* 3. Royal Amethyst (Hue 280) */}
            <div className="glass-panel p-4 rounded-2xl border border-[var(--glass-border)] flex flex-col items-center text-center space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold">
                Amethyst (Hue 280)
              </span>
              <GenerateButton
                hue={280}
                text="Generate term sheet"
                generatingText="Generating..."
                isGenerating={genDemoActive}
                onClick={() => toast.info('Legal LOI Draft Initiated', 'Attaching customized Vastu covenants.')}
              />
              <span className="text-[11px] text-[var(--text-3)]">Used for Legal Contracts & Term Sheets</span>
            </div>

            {/* 4. Imperial Amber (Hue 35) */}
            <div className="glass-panel p-4 rounded-2xl border border-[var(--glass-border)] flex flex-col items-center text-center space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                Amber (Hue 35)
              </span>
              <GenerateButton
                hue={35}
                text="Draft message"
                generatingText="Drafting..."
                isGenerating={genDemoActive}
                onClick={() => toast.warning('Urgent Touchpoint Generated', 'Dispatched strategic WhatsApp briefing.')}
              />
              <span className="text-[11px] text-[var(--text-3)]">Used for Cooling Lead Re-engagement</span>
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

