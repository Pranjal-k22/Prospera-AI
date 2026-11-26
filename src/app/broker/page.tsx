'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Flame,
  AlertTriangle,
  Clock,
  Search,
  ArrowUpRight,
  PhoneCall,
  Calendar,
  Sparkles,
  ChevronRight,
  Building,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GenerateButton } from '@/components/ui/generate-button';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassPill } from '@/components/ui/GlassPill';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { NumberCounter } from '@/components/ui/NumberCounter';
import { Sparkline } from '@/components/ui/Sparkline';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { MOCK_LEADS, Lead } from '@/lib/mock';
import { staggerContainer } from '@/lib/motion';

export default function BrokerDeskPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [filterTab, setFilterTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'value' | 'recent'>('score');
  const [reengageLead, setReengageLead] = useState<Lead | null>(null);
  const [reengageSending, setReengageSending] = useState(false);
  const [draftingLeadId, setDraftingLeadId] = useState<string | null>(null);

  const handleTriggerDraft = (lead: Lead) => {
    setDraftingLeadId(lead.id);
    setTimeout(() => {
      setDraftingLeadId(null);
      setReengageLead(lead);
    }, 750);
  };

  // Compute KPI metrics
  const totalPipelineCr = useMemo(() => {
    return leads.reduce((acc, curr) => acc + curr.budgetValueCr, 0);
  }, [leads]);

  const hotLeadsCount = useMemo(() => {
    return leads.filter((l) => l.score >= 85).length;
  }, [leads]);

  const coolingLeadsCount = useMemo(() => {
    return leads.filter((l) => l.coolingAlert).length;
  }, [leads]);

  // Filtered & Sorted Leads
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        // Tab filters
        if (filterTab === 'hot' && lead.score < 85) return false;
        if (filterTab === 'warm' && (lead.score >= 85 || lead.score < 70)) return false;
        if (filterTab === 'cooling' && !lead.coolingAlert) return false;

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = lead.name.toLowerCase().includes(q);
          const matchCompany = lead.company.toLowerCase().includes(q);
          const matchLocation = lead.location.toLowerCase().includes(q);
          const matchProperty = lead.propertyInterest.toLowerCase().includes(q);
          if (!matchName && !matchCompany && !matchLocation && !matchProperty) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'score') return b.score - a.score;
        if (sortBy === 'value') return b.budgetValueCr - a.budgetValueCr;
        return 0;
      });
  }, [leads, filterTab, searchQuery, sortBy]);

  const handleSendReengage = () => {
    if (!reengageLead) return;
    setReengageSending(true);
    setTimeout(() => {
      setReengageSending(false);
      // Mark coolingAlert resolved
      setLeads((prev) =>
        prev.map((l) => (l.id === reengageLead.id ? { ...l, coolingAlert: false, lastContacted: 'Just now' } : l))
      );
      toast.success(
        'Re-engagement Dispatched',
        `Tailored luxury briefing sent via WhatsApp & Email to ${reengageLead.name}.`
      );
      setReengageLead(null);
    }, 1100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GlassPill variant="accent">
              <Sparkles className="w-3 h-3" />
              <span>Executive Broker Workspace</span>
            </GlassPill>
            <span className="text-xs text-[var(--text-3)] font-mono">Q4 Luxury Closing Sprint</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text)]">
            Indian Luxury Deal Desk
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="glass"
            iconLeft={<Calendar className="w-4 h-4 text-[var(--accent)]" />}
            onClick={() => toast.info('Sync Complete', 'Calendars synced with Mumbai & Bengaluru offices.')}
          >
            Today: 3 Briefings
          </Button>
          <Button
            variant="primary"
            iconRight={<ArrowUpRight className="w-4 h-4" />}
            onClick={() => router.push('/buyer')}
          >
            Explore Inventory
          </Button>
        </div>
      </div>

      {/* 4 Liquid Glass KPI Cards */}
      <motion.div
        variants={staggerContainer(0.06, 0.05)}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
      >
        {/* KPI 1: Active Pipeline Value */}
        <GlassCard className="p-5" hoverLift>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-3)]">Active Pipeline</span>
            <Sparkline data={[140, 155, 175, 168, 192, 212]} color="#0A84FF" />
          </div>
          <div className="font-serif text-3xl font-bold text-[var(--text)]">
            <NumberCounter value={totalPipelineCr} decimals={1} prefix="₹" suffix=" Cr" />
          </div>
          <p className="text-xs text-[var(--text-2)] mt-1.5 flex items-center gap-1">
            <span className="text-[#30C48D] font-semibold">+₹38.4 Cr</span> this month across 12 mandates
          </p>
        </GlassCard>

        {/* KPI 2: AI Deal Velocity */}
        <GlassCard className="p-5" hoverLift>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-3)]">Deal Velocity</span>
            <div className="w-8 h-8 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-[var(--accent)]">
            <NumberCounter value={34} prefix="+" suffix="% Faster" />
          </div>
          <p className="text-xs text-[var(--text-2)] mt-1.5">
            Average time to LOI reduced from 42 to 28 days
          </p>
        </GlassCard>

        {/* KPI 3: Hot Leads Ready for Close */}
        <GlassCard className="p-5" hoverLift>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-3)]">Hot Closes</span>
            <div className="w-8 h-8 rounded-full bg-[#30C48D]/15 text-[#30C48D] flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-[var(--text)]">{hotLeadsCount} Leads</span>
            <span className="text-xs font-mono text-[#30C48D] font-semibold">90+ Score</span>
          </div>
          <p className="text-xs text-[var(--text-2)] mt-1.5">
            Worli, Jubilee Hills & Koregaon Park mandates
          </p>
        </GlassCard>

        {/* KPI 4: Deals Requiring Attention */}
        <GlassCard className="p-5" hoverLift>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-3)]">Action Required</span>
            <div className="w-8 h-8 rounded-full bg-[#FF453A]/15 text-[#FF453A] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-[#FF453A]">{coolingLeadsCount} Deals</span>
            <span className="text-xs font-mono text-[#FF453A] font-semibold">Cooling Off</span>
          </div>
          <p className="text-xs text-[var(--text-2)] mt-1.5">
            No touchpoint logged in &gt;3 days
          </p>
        </GlassCard>
      </motion.div>

      {/* Main Grid: Left Column Leads Table / Right Column Today's Briefings & Cooling Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Span 2): Filter Controls + Leads List */}
        <div className="lg:col-span-2 space-y-5">
          {/* Filter Bar */}
          <div className="glass-panel p-3.5 rounded-2xl border border-[var(--glass-border)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Filter Tabs */}
            <div className="overflow-x-auto pb-1 sm:pb-0">
              <SegmentedControl
                value={filterTab}
                onChange={setFilterTab}
                size="sm"
                options={[
                  { id: 'all', label: 'All Deals', count: leads.length },
                  { id: 'hot', label: 'Hot Deals', count: hotLeadsCount },
                  { id: 'warm', label: 'Warm', count: leads.filter((l) => l.priority === 'warm').length },
                  { id: 'cooling', label: 'Cooling', count: coolingLeadsCount },
                ]}
                layoutId="broker-filter-thumb"
              />
            </div>

            {/* Sort & Search */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-48">
                <Search className="w-3.5 h-3.5 text-[var(--text-3)] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[var(--glass-subtle)] border border-[var(--glass-border)] text-xs text-[var(--text)] pl-8 pr-3 py-1.5 rounded-full outline-none focus:border-[var(--accent)]"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'score' | 'value')}
                aria-label="Sort leads by"
                className="bg-[var(--glass-subtle)] border border-[var(--glass-border)] text-xs text-[var(--text-2)] px-3 py-1.5 rounded-full outline-none cursor-pointer focus:border-[var(--accent)]"
              >
                <option value="score">Sort by Score</option>
                <option value="value">Sort by Budget</option>
              </select>
            </div>
          </div>

          {/* Leads List */}
          <motion.div
            variants={staggerContainer(0.04, 0.05)}
            initial="hidden"
            animate="visible"
            className="space-y-3.5"
          >
            {filteredLeads.map((lead) => (
              <GlassCard
                key={lead.id}
                className="p-4 sm:p-5 rounded-2xl transition-all group"
                hoverLift
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Avatar & Lead Details */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={lead.avatar}
                        alt={lead.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/60 dark:border-white/20 shadow-xs shrink-0"
                      />
                      {lead.coolingAlert && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#FF453A] border-2 border-white dark:border-[#070B14] shadow-xs animate-pulse" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/broker/leads/${lead.id}`}
                          className="font-semibold text-base text-[var(--text)] hover:text-[var(--accent)] transition-colors truncate"
                        >
                          {lead.name}
                        </Link>
                        {lead.priority === 'hot' ? (
                          <GlassPill variant="hot">Hot</GlassPill>
                        ) : lead.priority === 'warm' ? (
                          <GlassPill variant="warm">Warm</GlassPill>
                        ) : (
                          <GlassPill variant="cold">Cold</GlassPill>
                        )}
                        {lead.coolingAlert && (
                          <span className="hidden sm:inline-flex text-[10px] font-mono font-semibold text-[#FF453A] bg-[#FF453A]/10 px-2 py-0.5 rounded-full border border-[#FF453A]/20">
                            No touch in {lead.coolingDays}d
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[var(--text-2)] truncate mt-0.5">
                        {lead.title}, {lead.company} • {lead.location}
                      </p>

                      <div className="flex items-center gap-2 mt-1.5 text-xs text-[var(--text-3)]">
                        <Building className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                        <span className="truncate text-[var(--text-2)] font-medium">
                          {lead.propertyInterest}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Score, Budget & Action */}
                  <div className="flex items-center justify-between sm:justify-end gap-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-black/5 dark:border-white/5">
                    {/* Budget & Stage */}
                    <div className="text-left sm:text-right">
                      <p className="font-serif text-lg font-bold text-[var(--text)] leading-none">
                        {lead.budget}
                      </p>
                      <span className="text-[11px] font-mono text-[var(--text-3)] mt-0.5 inline-block">
                        {lead.stage}
                      </span>
                    </div>

                    {/* Score Ring */}
                    <div className="shrink-0">
                      <ScoreRing score={lead.score} size="sm" />
                    </div>

                    {/* Open Lead Hub CTA */}
                    <div className="shrink-0">
                      <Link href={`/broker/leads/${lead.id}`}>
                        <Button variant="glass" size="sm" iconRight={<ChevronRight className="w-3.5 h-3.5" />}>
                          Deal Hub
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Follow-up Footnote */}
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[var(--glass-border)] text-[11px] text-[var(--text-3)]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-[var(--accent)]" />
                    <span>Next: {lead.nextFollowUp}</span>
                  </span>
                  <span>Contacted: {lead.lastContacted}</span>
                </div>
              </GlassCard>
            ))}

            {filteredLeads.length === 0 && (
              <div className="glass-panel p-8 text-center rounded-2xl border border-[var(--glass-border)]">
                <p className="text-sm font-semibold text-[var(--text)]">No leads match your criteria</p>
                <p className="text-xs text-[var(--text-3)] mt-1">Try resetting search filters or keywords.</p>
                <Button variant="glass" size="sm" className="mt-3" onClick={() => { setFilterTab('all'); setSearchQuery(''); }}>
                  Reset Filters
                </Button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column (Span 1): Today's Schedule & Cooling Lead Emergency Action */}
        <div className="space-y-6">
          {/* Today's Calls & Scheduled Briefings */}
          <GlassCard className="p-5 rounded-2xl" hoverLift={false}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[var(--accent)]" />
                <h3 className="font-serif text-lg font-bold text-[var(--text)]">Today’s Briefings</h3>
              </div>
              <GlassPill variant="accent">3 Calls</GlassPill>
            </div>

            <div className="space-y-3.5">
              <div className="glass-panel p-3 rounded-xl border border-[var(--glass-border)] bg-white/40 dark:bg-white/5">
                <div className="flex items-center justify-between text-xs font-semibold text-[var(--text)]">
                  <span>Rajesh Jhunjhunwala</span>
                  <span className="font-mono text-[var(--accent)]">4:30 PM</span>
                </div>
                <p className="text-[11px] text-[var(--text-2)] mt-0.5">Strategy call: North-east Vastu & 4th car park spot</p>
                <div className="mt-2 flex justify-end">
                  <Link href="/broker/leads/lead-1">
                    <Button size="xs" variant="primary">Launch Call Prep</Button>
                  </Link>
                </div>
              </div>

              <div className="glass-panel p-3 rounded-xl border border-[var(--glass-border)] bg-white/40 dark:bg-white/5">
                <div className="flex items-center justify-between text-xs font-semibold text-[var(--text)]">
                  <span>Vikram Singhania</span>
                  <span className="font-mono text-[var(--accent)]">6:00 PM</span>
                </div>
                <p className="text-[11px] text-[var(--text-2)] mt-0.5">Term sheet review: Cyril Amarchand legal NOC</p>
                <div className="mt-2 flex justify-end">
                  <Link href="/broker/leads/lead-3">
                    <Button size="xs" variant="glass">View Notes</Button>
                  </Link>
                </div>
              </div>

              <div className="glass-panel p-3 rounded-xl border border-[var(--glass-border)] bg-white/40 dark:bg-white/5">
                <div className="flex items-center justify-between text-xs font-semibold text-[var(--text)]">
                  <span>Ayesha Merchant</span>
                  <span className="font-mono text-[var(--accent)]">7:00 PM</span>
                </div>
                <p className="text-[11px] text-[var(--text-2)] mt-0.5">Colaba Heritage Promenade solarium NOC</p>
                <div className="mt-2 flex justify-end">
                  <Link href="/broker/leads/lead-8">
                    <Button size="xs" variant="glass">View Notes</Button>
                  </Link>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Cooling Leads AI Re-engagement Deck */}
          <GlassCard className="p-5 rounded-2xl border-l-4 border-l-[#FF453A]" hoverLift={false}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-[#FF453A]" />
              <h3 className="font-serif text-lg font-bold text-[var(--text)]">Cooling Leads Alarm</h3>
            </div>
            <p className="text-xs text-[var(--text-2)] leading-relaxed mb-4">
              AI detected 4 high-value mandates without buyer touchpoints in over 72 hours. Re-engage immediately to preserve deal momentum.
            </p>

            <div className="space-y-2.5">
              {leads
                .filter((l) => l.coolingAlert)
                .slice(0, 3)
                .map((coolLead) => (
                  <div
                    key={coolLead.id}
                    className="p-3 rounded-xl border border-[var(--glass-border)] bg-white/50 dark:bg-white/5 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[var(--text)] truncate">{coolLead.name}</p>
                      <p className="text-[10px] text-[#FF453A] font-mono">No touch in {coolLead.coolingDays} days</p>
                    </div>

                    <GenerateButton
                      tone="amber"
                      size="sm"
                      label="Draft re-engagement"
                      generatingLabel="Drafting..."
                      successLabel="Drafted"
                      status={draftingLeadId === coolLead.id ? 'generating' : 'idle'}
                      onClick={() => handleTriggerDraft(coolLead)}
                    />
                  </div>
                ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* AI Re-engagement Modal */}
      <Modal
        isOpen={Boolean(reengageLead)}
        onClose={() => setReengageLead(null)}
        title={`AI Re-engagement: ${reengageLead?.name}`}
        description="Prospera AI has generated a tailored re-activation hook based on recent sub-market movements."
      >
        {reengageLead && (
          <div className="space-y-4 text-sm">
            <div className="glass-panel p-4 rounded-2xl border border-[var(--glass-border)] bg-black/5 dark:bg-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs text-[var(--text-3)] font-mono">
                <span>TARGET: {reengageLead.name}</span>
                <span>BUDGET: {reengageLead.budget}</span>
              </div>
              <p className="text-xs text-[var(--text)] leading-relaxed italic">
                “Hi {reengageLead.name.split(' ')[0]}, I was reviewing our discussion on {reengageLead.propertyInterest}. We just secured architectural verification regarding your specific specifications. Given the upcoming Q4 fiscal cycle, developer is willing to hold current pricing until Friday. Would 15 minutes tomorrow suit for a quick walkthrough?”
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setReengageLead(null)}>Cancel</Button>
              <Button
                variant="primary"
                loading={reengageSending}
                onClick={handleSendReengage}
              >
                Send message
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

