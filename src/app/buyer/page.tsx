'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Sparkles,
  Building2,
  FileCheck2,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Send,
  Eye,
  Calendar,
  ShieldCheck,
  MapPin,
  Maximize2,
  BedDouble,
  DollarSign,
  TrendingUp,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GenerateButton } from '@/components/ui/generate-button';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { GlassPill } from '@/components/ui/GlassPill';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/Modal';
import { Sheet } from '@/components/ui/Sheet';
import { Timeline } from '@/components/ui/Timeline';
import { useToast } from '@/components/ui/Toast';
import { MOCK_PROPERTIES, MOCK_APPLICATIONS, Property, Application, aiMatchmakerSearch } from '@/lib/mock';
import { fadeInUp, staggerContainer } from '@/lib/motion';

export default function BuyerPortalPage() {
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'explore' | 'matchmaker' | 'applications' | 'list'>('explore');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Restore state from localStorage safely
  useEffect(() => {
    try {
      const savedTab = localStorage.getItem('prospera-buyer-tab');
      if (savedTab && ['explore', 'matchmaker', 'applications', 'list'].includes(savedTab)) {
        setActiveTab(savedTab as any);
      }
      const savedFavs = localStorage.getItem('prospera-favorites');
      if (savedFavs) {
        setFavorites(JSON.parse(savedFavs));
      }
    } catch {
      // safe fallback
    }
  }, []);

  const handleTabChange = (t: string) => {
    setActiveTab(t as any);
    try {
      localStorage.setItem('prospera-buyer-tab', t);
    } catch {
      // safe fallback
    }
  };

  const toggleFavorite = (propId: string, title: string) => {
    const isFav = favorites.includes(propId);
    const updated = isFav ? favorites.filter((id) => id !== propId) : [...favorites, propId];
    setFavorites(updated);
    try {
      localStorage.setItem('prospera-favorites', JSON.stringify(updated));
    } catch {}
    if (!isFav) {
      toast.success('Saved to Portfolio Favorites', title);
    } else {
      toast.info('Removed from Favorites', title);
    }
  };

  // EXPLORE TAB STATES
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);

  // MATCHMAKER TAB STATES
  const [aiPrompt, setAiPrompt] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [matchedResults, setMatchedResults] = useState<Property[]>(MOCK_PROPERTIES.slice(0, 3));

  // APPLICATIONS TAB STATES
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);
  const [urgentEscalateModal, setUrgentEscalateModal] = useState<Application | null>(null);
  const [escalateMessage, setEscalateMessage] = useState('');

  // LIST PROPERTY WIZARD STATES
  const [wizardStep, setWizardStep] = useState(1);
  const [listForm, setListForm] = useState({
    title: '',
    city: 'Mumbai',
    location: 'Worli Sea Face',
    bhk: 4,
    carpetArea: 4200,
    features: ['Sea View', 'Private Elevator'],
  });

  // Filtered properties for Explore Tab
  const filteredProperties = useMemo(() => {
    return MOCK_PROPERTIES.filter((p) => {
      if (selectedCity === 'all') return true;
      return p.city.toLowerCase() === selectedCity.toLowerCase();
    });
  }, [selectedCity]);

  // Execute AI Matchmaker Search
  const handleRunMatchmaker = async (queryText?: string) => {
    const q = queryText || aiPrompt;
    if (!q.trim()) return;

    setIsSynthesizing(true);
    const results = await aiMatchmakerSearch(q);
    setMatchedResults(results);
    setIsSynthesizing(false);
    toast.success('Matches Synthesized', `Curated ${results.length} verified luxury residences matching your criteria.`);
  };

  // Escalate Urgent Application
  const handleConfirmEscalation = () => {
    if (!urgentEscalateModal) return;
    setApplications((prev) =>
      prev.map((app) =>
        app.id === urgentEscalateModal.id
          ? { ...app, urgentAttentionRequired: false, status: 'In Review' }
          : app
      )
    );
    toast.success('Broker & Legal Counsel Escalated', 'Senior underwriting partner notified with priority status.');
    setUrgentEscalateModal(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-7">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GlassPill variant="accent">
              <Compass className="w-3.5 h-3.5" />
              <span>Private Client Portal</span>
            </GlassPill>
            <span className="text-xs font-mono text-[var(--text-3)]">High-Net-Worth Advisory Room</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text)]">
            Prospera Buyer Sanctuary
          </h1>
        </div>

        {/* 4 Portal Tabs Switcher */}
        <div className="overflow-x-auto pb-1 sm:pb-0">
          <SegmentedControl
            value={activeTab}
            onChange={handleTabChange}
            options={[
              { id: 'explore', label: 'Explore Portfolio', icon: <Building2 className="w-4 h-4" /> },
              { id: 'matchmaker', label: 'AI Matchmaker', icon: <Sparkles className="w-4 h-4" /> },
              { id: 'applications', label: 'My Offers & Escrow', count: applications.length, icon: <FileCheck2 className="w-4 h-4" /> },
              { id: 'list', label: 'List Property', icon: <PlusCircle className="w-4 h-4" /> },
            ]}
            layoutId="buyer-portal-tab-thumb"
          />
        </div>
      </div>

      {/* =========================================================================
          TAB 1: EXPLORE PORTFOLIO
          ========================================================================= */}
      {activeTab === 'explore' && (
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
          {/* City Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-3)] mr-2">Metros:</span>
            {['all', 'mumbai', 'pune', 'bengaluru', 'hyderabad', 'delhi ncr'].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full capitalize transition-all ${
                  selectedCity === city
                    ? 'bg-[var(--accent)] text-white shadow-sm'
                    : 'glass-pill text-[var(--text-2)] hover:text-[var(--text)]'
                }`}
              >
                {city === 'all' ? 'All Metros' : city}
              </button>
            ))}
          </div>

          {/* Property Cards Grid */}
          <motion.div
            variants={staggerContainer(0.06, 0.05)}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProperties.map((prop) => (
              <GlassCard key={prop.id} className="rounded-3xl overflow-hidden flex flex-col" hoverLift>
                {/* Photo Preview */}
                <div className="relative h-56 w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={prop.image}
                    alt={prop.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="glass-pill text-[10px] font-mono font-semibold px-2.5 py-1 bg-black/40 text-white backdrop-blur-md rounded-full border border-white/20">
                      {prop.status}
                    </span>
                  </div>

                  {/* Favorite Heart Button */}
                  <button
                    type="button"
                    aria-label={favorites.includes(prop.id) ? 'Remove from portfolio favorites' : 'Save to portfolio favorites'}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(prop.id, prop.title);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xl border transition-all duration-200 z-10 ${
                      favorites.includes(prop.id)
                        ? 'bg-rose-500/25 border-rose-400/50 text-rose-500 shadow-sm scale-105'
                        : 'bg-black/30 border-white/20 text-white/80 hover:text-white hover:bg-black/50'
                    }`}
                  >
                    <Heart className="w-4 h-4" fill={favorites.includes(prop.id) ? 'currentColor' : 'none'} strokeWidth={1.75} />
                  </button>

                  {/* Price Tag */}
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="font-serif text-2xl font-bold drop-shadow-sm leading-tight">{prop.price}</p>
                    <p className="text-[11px] text-white/80 drop-shadow-xs">{prop.location}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[var(--text)] line-clamp-1">{prop.title}</h3>
                    <p className="text-xs text-[var(--text-2)] line-clamp-2 mt-1 leading-relaxed">{prop.tagline}</p>
                  </div>

                  {/* Meta Specs */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-[var(--text-3)] font-mono py-2 border-y border-[var(--glass-border)]">
                    <span className="flex items-center gap-1.5">
                      <BedDouble className="w-3.5 h-3.5 text-[var(--accent)]" />
                      {prop.bhk} BHK Luxury Suite
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-emerald-500" />
                      {prop.carpetAreaSqFt.toLocaleString()} sqft Carpet
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <Button
                      variant="glass"
                      size="sm"
                      className="flex-1"
                      iconLeft={<Eye className="w-3.5 h-3.5" />}
                      onClick={() => setSelectedProperty(prop)}
                    >
                      Inspect Specs
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedProperty(prop);
                        setIsTourModalOpen(true);
                      }}
                    >
                      Book Tour
                    </Button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* =========================================================================
          TAB 2: AI MATCHMAKER
          ========================================================================= */}
      {activeTab === 'matchmaker' && (
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
          {/* Prompt Hero Card */}
          <GlassCard className="p-6 sm:p-8 rounded-3xl" hoverLift={false} strong>
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-[var(--accent)]" />
                <h2 className="font-serif text-2xl font-bold text-[var(--text)]">Natural Language Matchmaker</h2>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-2)] leading-relaxed mb-5">
                Describe your dream luxury home in freeform prose. Our multi-agent engine will cross-reference Vastu compliance, acoustics, historical appreciation comps, and private off-market listings.
              </p>

              {/* Natural Language Input */}
              <div className="relative">
                <textarea
                  rows={3}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Looking for a 4BHK penthouse with sea views in Worli or Bandra under 30 Cr with private elevator and Vastu compliant master bedroom..."
                  className="w-full rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-subtle)] backdrop-blur-xl p-4 text-xs sm:text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] shadow-inner"
                />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-[11px] text-[var(--text-3)] font-mono">Agentic Search • 12 Verified Micro-Markets</span>
                  <GenerateButton
                    hue={210}
                    text="Find matches"
                    generatingText="Finding matches..."
                    isGenerating={isSynthesizing}
                    onClick={() => handleRunMatchmaker()}
                  />
                </div>
              </div>

              {/* Suggestion Pills */}
              <div className="mt-4 pt-3 border-t border-[var(--glass-border)] flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-[var(--text-3)]">Try Prompts:</span>
                <button
                  onClick={() => {
                    const p = 'Arabian Sea view penthouse in Mumbai Worli with rooftop pool under 30 Cr';
                    setAiPrompt(p);
                    handleRunMatchmaker(p);
                  }}
                  className="text-xs bg-[var(--accent-subtle)] text-[var(--accent)] px-3 py-1 rounded-full font-medium hover:brightness-105"
                >
                  Sea view in Worli under 30 Cr
                </button>
                <button
                  onClick={() => {
                    const p = 'Boutique tranquil villa in Koregaon Park Pune with soundproofing and pool';
                    setAiPrompt(p);
                    handleRunMatchmaker(p);
                  }}
                  className="text-xs bg-[var(--accent-subtle)] text-[var(--accent)] px-3 py-1 rounded-full font-medium hover:brightness-105"
                >
                  Tranquil villa in Koregaon Park
                </button>
                <button
                  onClick={() => {
                    const p = 'Central Bengaluru biophilic duplex near Indiranagar with solar';
                    setAiPrompt(p);
                    handleRunMatchmaker(p);
                  }}
                  className="text-xs bg-[var(--accent-subtle)] text-[var(--accent)] px-3 py-1 rounded-full font-medium hover:brightness-105"
                >
                  Biophilic duplex in Indiranagar
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Match Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-[var(--text)]">Recommended AI Matches</h3>
              <GlassPill variant="accent">{matchedResults.length} Qualified Assets</GlassPill>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {matchedResults.map((match) => (
                <GlassCard key={match.id} className="rounded-3xl overflow-hidden p-5 space-y-4" hoverLift>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-serif text-base font-bold text-[var(--text)] leading-tight">{match.title}</h4>
                      <p className="text-xs text-[var(--text-2)] mt-0.5">{match.location}</p>
                    </div>
                    <ScoreRing score={match.matchScore || 92} size="sm" />
                  </div>

                  <div className="relative rounded-2xl overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={match.image} alt={match.title} className="w-full h-40 object-cover" />
                    <button
                      type="button"
                      aria-label={favorites.includes(match.id) ? 'Remove from portfolio favorites' : 'Save to portfolio favorites'}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(match.id, match.title);
                      }}
                      className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-xl border transition-all duration-200 z-10 ${
                        favorites.includes(match.id)
                          ? 'bg-rose-500/25 border-rose-400/50 text-rose-500 shadow-sm scale-105'
                          : 'bg-black/30 border-white/20 text-white/80 hover:text-white hover:bg-black/50'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5" fill={favorites.includes(match.id) ? 'currentColor' : 'none'} strokeWidth={1.75} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <p className="font-serif text-xl font-bold text-[var(--accent)]">{match.price}</p>
                    <p className="text-xs text-[var(--text-2)] leading-relaxed italic">
                      “{match.aiProsCons.investmentVerdict}”
                    </p>
                  </div>

                  <Button
                    variant="glass"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setSelectedProperty(match);
                      setIsTourModalOpen(true);
                    }}
                  >
                    Request Confidential Showing
                  </Button>
                </GlassCard>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* =========================================================================
          TAB 3: MY APPLICATIONS & TIMELINES
          ========================================================================= */}
      {activeTab === 'applications' && (
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[var(--text)]">Active Purchase Mandates & Escrow</h2>
              <p className="text-xs text-[var(--text-2)] mt-0.5">Real-time closing room progress with self-drawing milestone tracking</p>
            </div>
            <GlassPill variant="accent">3 Active Transactions</GlassPill>
          </div>

          <div className="space-y-6">
            {applications.map((app) => (
              <GlassCard key={app.id} className="p-6 sm:p-7 rounded-3xl" hoverLift={false}>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--glass-border)]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[var(--text-3)]">{app.applicationNumber}</span>
                      {app.urgentAttentionRequired && (
                        <span className="bg-[#FF453A]/15 text-[#FF453A] text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-[#FF453A]/30 animate-pulse">
                          Escalation Required
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[var(--text)] mt-1">{app.propertyTitle}</h3>
                    <p className="text-xs text-[var(--text-2)]">{app.propertyLocation}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-left sm:text-right">
                      <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-3)]">Offer Price</span>
                      <p className="font-serif text-2xl font-bold text-[var(--text)]">{app.offerAmount}</p>
                    </div>

                    {app.urgentAttentionRequired && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setUrgentEscalateModal(app)}
                      >
                        Resolve Blocker
                      </Button>
                    )}
                  </div>
                </div>

                {/* Urgent Warning banner if applicable */}
                {app.urgentAttentionRequired && app.urgentReason && (
                  <div className="mt-4 p-3.5 rounded-2xl bg-[#FF453A]/10 border border-[#FF453A]/25 text-xs text-[#FF453A] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{app.urgentReason}</span>
                    </div>
                    <button
                      onClick={() => setUrgentEscalateModal(app)}
                      className="underline font-semibold ml-2 hover:opacity-80"
                    >
                      Urgent Action →
                    </button>
                  </div>
                )}

                {/* Self-drawing Timeline */}
                <div className="mt-6 pt-2">
                  <Timeline steps={app.timeline} />
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      )}

      {/* =========================================================================
          TAB 4: LIST PROPERTY 3-STEP WIZARD
          ========================================================================= */}
      {activeTab === 'list' && (
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="max-w-2xl mx-auto">
          <GlassCard className="p-6 sm:p-8 rounded-3xl" hoverLift={false} strong>
            {/* Wizard Step Indicator */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--glass-border)]">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs font-mono transition-colors ${
                      wizardStep === step
                        ? 'bg-[var(--accent)] text-white shadow-sm'
                        : wizardStep > step
                        ? 'bg-[#30C48D] text-white'
                        : 'bg-black/5 dark:bg-white/10 text-[var(--text-3)]'
                    }`}
                  >
                    {wizardStep > step ? <CheckCircle2 className="w-4 h-4" /> : step}
                  </div>
                  <span className="text-xs font-semibold text-[var(--text)] hidden sm:inline">
                    {step === 1 ? 'Core Specs' : step === 2 ? 'Luxury Amenities' : 'AI Valuation'}
                  </span>
                </div>
              ))}
            </div>

            {/* Step 1: Core Specs */}
            {wizardStep === 1 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-[var(--text)]">Core Architecture & Location</h3>
                <Input
                  label="Residence / Penthouse Title"
                  defaultValue="Skyline Duplex over Bandra Promenade"
                  onChange={(e) => setListForm({ ...listForm, title: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Metro City"
                    defaultValue="Mumbai"
                    onChange={(e) => setListForm({ ...listForm, city: e.target.value })}
                  />
                  <Input
                    label="Pin Code / Micro-market"
                    defaultValue="Worli Sea Face"
                    onChange={(e) => setListForm({ ...listForm, location: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Configuration (BHK)"
                    type="number"
                    defaultValue={4}
                    onChange={(e) => setListForm({ ...listForm, bhk: Number(e.target.value) })}
                  />
                  <Input
                    label="Carpet Area (sqft)"
                    type="number"
                    defaultValue={4800}
                    onChange={(e) => setListForm({ ...listForm, carpetArea: Number(e.target.value) })}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button variant="primary" onClick={() => setWizardStep(2)} iconRight={<ArrowRight className="w-4 h-4" />}>
                    Next: Luxury Amenities
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Bespoke Luxury Amenities */}
            {wizardStep === 2 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-[var(--text)]">Bespoke Finishes & Amenities</h3>
                <p className="text-xs text-[var(--text-2)]">Select architectural features that command valuation premiums in your micro-market.</p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  {[
                    'Direct Private Elevator',
                    'Arabian Sea View',
                    'Rooftop Heated Pool',
                    'Vastu Compliant Master',
                    'Dolby Atmos Screening',
                    '4+ Basement Car Bays',
                    'Schüco Soundproofing',
                    'Burma Teak Flooring',
                  ].map((amenity) => {
                    const isSelected = listForm.features.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setListForm({ ...listForm, features: listForm.features.filter((f) => f !== amenity) });
                          } else {
                            setListForm({ ...listForm, features: [...listForm.features, amenity] });
                          }
                        }}
                        className={`p-3 rounded-2xl border text-xs font-semibold text-left transition-all ${
                          isSelected
                            ? 'bg-[var(--accent)]/15 border-[var(--accent)] text-[var(--accent)]'
                            : 'glass-panel border-[var(--glass-border)] text-[var(--text-2)] hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {amenity}
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center pt-6">
                  <Button variant="ghost" onClick={() => setWizardStep(1)}>Back</Button>
                  <GenerateButton
                    hue={150}
                    text="Generate valuation"
                    generatingText="Evaluating..."
                    onClick={() => setWizardStep(3)}
                  />
                </div>
              </div>
            )}

            {/* Step 3: AI Valuation Estimate Preview */}
            {wizardStep === 3 && (
              <div className="space-y-5 text-center">
                <GlassPill variant="won" className="mx-auto">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Valuation Synthesized</span>
                </GlassPill>

                <div>
                  <h3 className="font-serif text-3xl font-bold text-[var(--text)]">₹26.4 Cr – ₹28.2 Cr</h3>
                  <p className="text-xs text-[var(--text-2)] mt-1">
                    Based on 14 recent transactions in Worli Sea Face with premium for private elevator and sea view.
                  </p>
                </div>

                <div className="glass-panel p-4 rounded-2xl border border-[var(--glass-border)] text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-3)] font-mono">ESTIMATED CARPET RATE:</span>
                    <span className="font-semibold text-[var(--text)]">₹56,250 / sqft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-3)] font-mono">PROJECTED ABSORPTION VELOCITY:</span>
                    <span className="font-semibold text-[#30C48D]">High (Under 35 Days)</span>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="ghost" onClick={() => setWizardStep(2)}>Adjust Specs</Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setWizardStep(1);
                      setActiveTab('explore');
                      toast.success(
                        'Mandate Registered for Private Verification',
                        'Assigned lead broker will contact you for high-resolution 3D lidar scanning.'
                      );
                    }}
                  >
                    Submit Mandate to Desk
                  </Button>
                </div>
              </div>
            )}
          </GlassCard>
        </motion.div>
      )}

      {/* Property Slide-Out Detail Sheet */}
      <Sheet
        isOpen={Boolean(selectedProperty)}
        onClose={() => setSelectedProperty(null)}
        title={selectedProperty?.title}
        description={selectedProperty?.location}
        width="xl"
      >
        {selectedProperty && (
          <div className="space-y-6">
            {/* Image Gallery */}
            <div className="relative h-64 rounded-2xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedProperty.image} alt={selectedProperty.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3">
                <GlassPill variant="accent">{selectedProperty.status}</GlassPill>
              </div>
            </div>

            {/* Pricing & Key Metrics */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--glass-border)]">
              <div>
                <span className="text-xs font-mono text-[var(--text-3)] uppercase">Asking Price</span>
                <p className="font-serif text-3xl font-bold text-[var(--accent)]">{selectedProperty.price}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-[var(--text-3)] uppercase">Carpet Area</span>
                <p className="font-serif text-xl font-semibold text-[var(--text)]">{selectedProperty.carpetAreaSqFt.toLocaleString()} sqft</p>
              </div>
            </div>

            {/* AI Pros and Cons */}
            <div className="space-y-3">
              <h4 className="font-serif text-base font-bold text-[var(--text)]">Prospera AI Investment Assessment</h4>
              <div className="glass-panel p-4 rounded-2xl border border-[var(--glass-border)] space-y-3 text-xs leading-relaxed">
                <div>
                  <span className="font-mono font-bold text-[#30C48D] uppercase">Key Strengths:</span>
                  <ul className="mt-1 space-y-1 list-disc list-inside text-[var(--text-2)]">
                    {selectedProperty.aiProsCons.pros.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-[var(--glass-border)]">
                  <span className="font-mono font-bold text-amber-500 uppercase">Considerations:</span>
                  <ul className="mt-1 space-y-1 list-disc list-inside text-[var(--text-2)]">
                    {selectedProperty.aiProsCons.cons.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Amenities Grid */}
            <div>
              <h4 className="font-serif text-base font-bold text-[var(--text)] mb-3">Key Features</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {selectedProperty.features.map((f, i) => (
                  <div key={i} className="glass-panel p-2.5 rounded-xl border border-[var(--glass-border)] flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                    <span className="truncate">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => setIsTourModalOpen(true)}
            >
              Request Private Confidential Showing
            </Button>
          </div>
        )}
      </Sheet>

      {/* Tour Booking Modal */}
      <Modal
        isOpen={isTourModalOpen}
        onClose={() => setIsTourModalOpen(false)}
        title="Schedule Confidential Walkthrough"
        description={selectedProperty?.title}
      >
        <div className="space-y-4 text-sm text-[var(--text-2)]">
          <p>
            Private showings require 24-hour advance coordination for building security protocol clearance.
          </p>
          <Input label="Preferred Date" type="date" defaultValue="2026-11-08" />
          <Input label="Preferred Time Window" defaultValue="4:00 PM – 5:30 PM (Sunset Panorama)" />
          <Input label="Security Clearance ID (Aadhaar / Passport)" defaultValue="XXXX-XXXX-9912" />

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" onClick={() => setIsTourModalOpen(false)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => {
                setIsTourModalOpen(false);
                setSelectedProperty(null);
                toast.success('Showing Confirmed', 'Private chauffeur and site executive booked.');
              }}
            >
              Confirm Appointment
            </Button>
          </div>
        </div>
      </Modal>

      {/* Urgent Escalate Modal */}
      <Modal
        isOpen={Boolean(urgentEscalateModal)}
        onClose={() => setUrgentEscalateModal(null)}
        title={`Resolve Escrow Blocker: ${urgentEscalateModal?.applicationNumber}`}
        description={urgentEscalateModal?.urgentReason}
      >
        <div className="space-y-4 text-sm text-[var(--text-2)]">
          <p>
            You are initiating an executive override on this escrow milestone. Lead Broker Arjun Verma and senior legal counsel will fast-track the civil certification stamp within 4 business hours.
          </p>
          <textarea
            rows={3}
            value={escalateMessage}
            onChange={(e) => setEscalateMessage(e.target.value)}
            placeholder="Add specific instructions for legal counsel..."
            className="w-full rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-subtle)] p-3 text-xs outline-none focus:border-[var(--accent)]"
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setUrgentEscalateModal(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleConfirmEscalation}>
              Authorize Priority Escalation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

