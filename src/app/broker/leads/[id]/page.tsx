'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Phone,
  Mail,
  Building,
  CheckCircle2,
  Circle,
  Sparkles,
  Send,
  MessageSquare,
  FileText,
  Calendar,
  Check,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Clock,
  Layers,
  Flame,
  Copy,
  Trophy,
  Archive,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GenerateButton } from '@/components/ui/generate-button';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { GlassPill } from '@/components/ui/GlassPill';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { MOCK_LEADS, Lead, ObjectionItem } from '@/lib/mock';
import { fadeInUp, defaultSpring } from '@/lib/motion';

export default function LeadHubPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const leadId = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [activeTab, setActiveTab] = useState<'prep' | 'debrief' | 'copilot'>('prep');

  // Debrief State
  const [debriefContent, setDebriefContent] = useState('');
  const [debriefSentiment, setDebriefSentiment] = useState<'positive' | 'neutral' | 'guarded'>('positive');
  const [isSavingDebrief, setIsSavingDebrief] = useState(false);

  // Copilot Chat State
  const [copilotInput, setCopilotInput] = useState('');
  const [copilotHistory, setCopilotHistory] = useState<{ id: string; sender: 'user' | 'assistant'; text: string; timestamp: string }[]>([]);
  const [isCopilotTyping, setIsCopilotTyping] = useState(false);

  // Sticky Action Modal
  const [actionModal, setActionModal] = useState<string | null>(null);
  const [copiedOpenerIdx, setCopiedOpenerIdx] = useState<number | null>(null);
  const [prevStage, setPrevStage] = useState<Lead['stage'] | null>(null);

  const handleCopyOpener = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedOpenerIdx(idx);
    toast.success('Opener Copied to Clipboard', 'Ready to paste into WhatsApp or phone brief.');
    setTimeout(() => setCopiedOpenerIdx(null), 2000);
  };

  const handleMarkWon = () => {
    if (!lead) return;
    setPrevStage(lead.stage);
    setLead({ ...lead, stage: 'Closed Won', score: 99 });
    toast.success('Deal Closed Won!', `Congratulations! ${lead.name}'s mandate marked Won.`);
  };

  const handleUndoStage = () => {
    if (!lead || !prevStage) return;
    setLead({ ...lead, stage: prevStage, score: 94 });
    setPrevStage(null);
    toast.info('Status Reverted', `Mandate status restored to ${prevStage}.`);
  };

  useEffect(() => {
    const found = MOCK_LEADS.find((l) => l.id === leadId) || MOCK_LEADS[0];
    setLead({ ...found });
    setCopilotHistory(found.copilotMessages || []);
  }, [leadId]);

  if (!lead) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-base font-serif text-[var(--text)]">Loading deal room...</p>
      </div>
    );
  }

  // Toggle Objection checklist item
  const handleToggleObjection = (objId: string) => {
    if (!lead) return;
    const updatedObjections = lead.objections.map((obj) => {
      if (obj.id === objId) {
        return { ...obj, resolved: !obj.resolved };
      }
      return obj;
    });

    const resolvedCount = updatedObjections.filter((o) => o.resolved).length;
    const totalCount = updatedObjections.length || 1;
    const newScore = Math.min(99, Math.round(70 + (resolvedCount / totalCount) * 28));

    setLead({
      ...lead,
      objections: updatedObjections,
      score: newScore,
    });

    const toggled = updatedObjections.find((o) => o.id === objId);
    if (toggled?.resolved) {
      toast.success('Objection Cleared', `AI Fit Score recalculated: ${newScore}/100.`);
    } else {
      toast.info('Objection Marked Open', `AI Fit Score adjusted to ${newScore}/100.`);
    }
  };

  // Save Debrief Notes
  const handleSaveDebrief = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debriefContent.trim() || !lead) return;

    setIsSavingDebrief(true);
    setTimeout(() => {
      const delta = debriefSentiment === 'positive' ? 5 : debriefSentiment === 'neutral' ? 1 : -3;
      const newScore = Math.max(30, Math.min(99, lead.score + delta));

      const newDebriefItem = {
        id: `deb-${Date.now()}`,
        date: 'Just now',
        author: 'Arjun Verma (Lead Broker)',
        sentiment: debriefSentiment,
        content: debriefContent,
        scoreDelta: delta,
      };

      setLead({
        ...lead,
        score: newScore,
        debriefNotes: [newDebriefItem, ...lead.debriefNotes],
        lastContacted: 'Just now',
      });

      setIsSavingDebrief(false);
      setDebriefContent('');
      toast.success(
        'Debrief Logged',
        `Deal score updated to ${newScore}/100 (${delta >= 0 ? `+${delta}` : delta} pts).`
      );
    }, 800);
  };

  // Send Copilot Message
  const handleSendCopilot = (textToSend?: string) => {
    const text = textToSend || copilotInput;
    if (!text.trim() || !lead) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user' as const,
      text,
      timestamp: 'Just now',
    };

    setCopilotHistory((prev) => [...prev, userMsg]);
    setCopilotInput('');
    setIsCopilotTyping(true);

    // Simulated Copilot intelligence
    setTimeout(() => {
      let aiReply = `Understood. For ${lead.name}, based on previous discussions and market trends in ${lead.location}, our leverage point is to emphasize exclusivity and rapid closing advantages.`;
      
      const lower = text.toLowerCase();
      if (lower.includes('whatsapp') || lower.includes('message')) {
        aiReply = `“Dear ${lead.name.split(' ')[0]}, following up on the ${lead.propertyInterest} specifications: our legal advisors have validated all compliance terms for your review. When can we coordinate a 10-minute briefing?”`;
      } else if (lower.includes('parking') || lower.includes('concession')) {
        aiReply = `Recommendation: Offer complimentary tandem parking bay B-14 conditional upon signed LOI within 48 hours. This satisfies his requirement while protecting overall unit pricing.`;
      } else if (lower.includes('compare') || lower.includes('pricing')) {
        aiReply = `Current benchmark in ${lead.location} is trading at ₹92,000/sqft carpet. This penthouse is offered at ₹84,500/sqft, representing a ₹4.6 Cr built-in equity advantage upon possession.`;
      }

      setCopilotHistory((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: aiReply,
          timestamp: 'Just now',
        },
      ]);
      setIsCopilotTyping(false);
    }, 850);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-6 pb-48 sm:pb-32">
      {/* Back Link */}
      <div>
        <Link
          href="/broker"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-2)] hover:text-[var(--text)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Broker Deal Desk</span>
        </Link>
      </div>

      {/* Lead Executive Dossier Header */}
      <GlassCard className="p-6 sm:p-7 rounded-3xl" hoverLift={false} strong>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Avatar & Core Metadata */}
          <div className="flex items-start gap-4 sm:gap-5 min-w-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lead.avatar}
              alt={lead.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-white/70 dark:border-white/20 shadow-md shrink-0"
            />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
                  {lead.name}
                </h1>
                {lead.priority === 'hot' ? (
                  <GlassPill variant="hot">Hot Mandate</GlassPill>
                ) : (
                  <GlassPill variant="warm">Warm Mandate</GlassPill>
                )}
                <span className="font-mono text-xs text-[var(--text-3)] bg-black/5 dark:bg-white/10 px-2.5 py-0.5 rounded-full">
                  {lead.stage}
                </span>
                {lead.stage !== 'Closed Won' ? (
                  <button
                    onClick={handleMarkWon}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#30C48D] bg-[#30C48D]/15 hover:bg-[#30C48D]/25 px-2.5 py-0.5 rounded-full border border-[#30C48D]/30 transition-all cursor-pointer"
                  >
                    <Trophy className="w-3 h-3" />
                    <span>Mark Deal Won</span>
                  </button>
                ) : (
                  <button
                    onClick={handleUndoStage}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--text-3)] bg-black/5 dark:bg-white/10 hover:bg-black/10 px-2 py-0.5 rounded-full transition-all cursor-pointer"
                  >
                    <span>Undo</span>
                  </button>
                )}
              </div>

              <p className="text-sm text-[var(--text-2)] mt-1">
                {lead.title} at <span className="font-semibold text-[var(--text)]">{lead.company}</span>
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-[var(--text-3)]">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" />
                  {lead.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  {lead.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-500" />
                  {lead.email}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Deal Size & Animated Score Ring */}
          <div className="flex items-center gap-6 self-start md:self-auto border-t md:border-t-0 pt-4 md:pt-0 border-black/5 dark:border-white/5">
            <div className="text-left md:text-right">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-3)]">Deal Value</span>
              <p className="font-serif text-3xl sm:text-4xl font-bold text-[var(--text)] leading-tight">
                {lead.budget}
              </p>
              <span className="text-[11px] font-mono text-[#30C48D] font-semibold mt-0.5 block">
                Source of Funds Verified
              </span>
            </div>

            <div className="shrink-0">
              <ScoreRing score={lead.score} size="lg" label="CLOSING PROBABILITY" />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Main Two-Column Hub Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (5 Cols): Property Target & Interactive Objections Checklist */}
        <div className="lg:col-span-5 space-y-6">
          {/* Property Target */}
          <GlassCard className="p-5 rounded-2xl" hoverLift={false}>
            <div className="flex items-center gap-2 mb-3">
              <Building className="w-4 h-4 text-[var(--accent)]" />
              <h3 className="font-serif text-lg font-bold text-[var(--text)]">Target Property</h3>
            </div>

            <div className="glass-panel p-3.5 rounded-xl border border-[var(--glass-border)] bg-white/40 dark:bg-white/5 space-y-2">
              <p className="text-sm font-semibold text-[var(--text)] leading-tight">{lead.propertyInterest}</p>
              <p className="text-xs text-[var(--text-2)]">{lead.location}</p>
              <div className="flex items-center justify-between pt-2 border-t border-[var(--glass-border)] text-xs">
                <span className="text-[var(--text-3)] font-mono">Benchmark: {lead.budget}</span>
                <Link href={`/buyer`} className="text-[var(--accent)] font-semibold hover:underline">
                  View Full Specs →
                </Link>
              </div>
            </div>
          </GlassCard>

          {/* Interactive Objections Checklist */}
          <GlassCard className="p-5 sm:p-6 rounded-2xl" hoverLift={false}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[var(--accent)]" />
                <h3 className="font-serif text-lg font-bold text-[var(--text)]">Objection Resolution Matrix</h3>
              </div>
              <GlassPill variant="accent">
                {lead.objections.filter((o) => o.resolved).length}/{lead.objections.length} Cleared
              </GlassPill>
            </div>

            <p className="text-xs text-[var(--text-2)] leading-relaxed mb-4">
              Clearing objections directly increases closing velocity. Tap checkboxes to mark resolved.
            </p>

            <div className="space-y-3">
              {lead.objections.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleObjection(item.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                    item.resolved
                      ? 'bg-emerald-500/10 border-emerald-500/30 dark:bg-emerald-500/10'
                      : 'bg-white/50 dark:bg-white/5 border-[var(--glass-border)] hover:bg-white/80 dark:hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {item.resolved ? (
                        <CheckCircle2 className="w-5 h-5 text-[#30C48D]" />
                      ) : (
                        <Circle className="w-5 h-5 text-[var(--text-3)] hover:text-[var(--accent)]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs sm:text-sm font-semibold leading-snug ${
                          item.resolved ? 'line-through text-[var(--text-3)]' : 'text-[var(--text)]'
                        }`}
                      >
                        {item.text}
                      </p>
                      <p className="text-[11px] text-[var(--text-2)] mt-1.5 leading-relaxed bg-black/5 dark:bg-white/5 p-2 rounded-lg">
                        <span className="font-mono uppercase font-bold text-[var(--accent)]">AI Resolution Hint: </span>
                        {item.aiResolutionHint}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right Column (7 Cols): 3 Liquid Glass Tabs (Call Prep, Debrief, Copilot) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Tab Selector */}
          <div className="flex justify-start">
            <SegmentedControl
              value={activeTab}
              onChange={(t) => setActiveTab(t as any)}
              options={[
                { id: 'prep', label: 'Call Prep Dossier', icon: <Sparkles className="w-4 h-4" /> },
                { id: 'debrief', label: 'Post-Call Debrief', icon: <FileText className="w-4 h-4" /> },
                { id: 'copilot', label: 'Deal Copilot', icon: <MessageSquare className="w-4 h-4" /> },
              ]}
              layoutId="lead-hub-tab-thumb"
            />
          </div>

          {/* TAB 1: CALL PREP */}
          {activeTab === 'prep' && (
            <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-5">
              {/* Buyer Persona */}
              <GlassCard className="p-5 sm:p-6 rounded-2xl" hoverLift={false}>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-3)] mb-2">
                  Psychographic Buyer Persona
                </h4>
                <p className="text-sm text-[var(--text)] leading-relaxed">
                  {lead.callPrep.buyerPersona}
                </p>
              </GlassCard>

              {/* Top Motivators */}
              <GlassCard className="p-5 sm:p-6 rounded-2xl" hoverLift={false}>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-3)] mb-3">
                  Key Value Drivers & Top Motivators
                </h4>
                <div className="space-y-2.5">
                  {lead.callPrep.topMotivators.map((mot, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--text)]">
                      <span className="w-5 h-5 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{mot}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Suggested Openers */}
              <GlassCard className="p-5 sm:p-6 rounded-2xl border-l-4 border-l-[var(--accent)]" hoverLift={false}>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-3)] mb-2">
                  High-Impact Conversation Openers
                </h4>
                <div className="space-y-3">
                  {lead.callPrep.suggestedOpeners.map((op, i) => (
                    <div
                      key={i}
                      className="glass-panel p-3.5 rounded-xl border border-[var(--glass-border)] bg-black/5 dark:bg-white/5 flex items-start justify-between gap-3 group"
                    >
                      <p className="text-xs sm:text-sm text-[var(--text)] italic leading-relaxed flex-1">
                        {op}
                      </p>
                      <button
                        onClick={() => handleCopyOpener(op, i)}
                        aria-label="Copy opener to clipboard"
                        className="shrink-0 p-1.5 rounded-lg border border-[var(--glass-border)] bg-white/60 dark:bg-white/10 hover:bg-white text-[var(--text-2)] hover:text-[var(--text)] transition-all"
                      >
                        {copiedOpenerIdx === i ? (
                          <Check className="w-3.5 h-3.5 text-[#30C48D]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* TAB 2: DEBRIEF */}
          {activeTab === 'debrief' && (
            <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-5">
              {/* Post-Call Logger Card */}
              <GlassCard className="p-5 sm:p-6 rounded-2xl" hoverLift={false}>
                <h4 className="font-serif text-lg font-bold text-[var(--text)] mb-1">
                  Log Meeting / Call Debrief
                </h4>
                <p className="text-xs text-[var(--text-2)] mb-4">
                  AI will analyze sentiment and adjust the deal probability score in real-time.
                </p>

                <form onSubmit={handleSaveDebrief} className="space-y-4">
                  {/* Sentiment Selector */}
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-3)] mb-2 block">
                      Meeting Sentiment
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setDebriefSentiment('positive')}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          debriefSentiment === 'positive'
                            ? 'bg-[#30C48D]/20 border-[#30C48D] text-[#30C48D]'
                            : 'border-[var(--glass-border)] text-[var(--text-2)] hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        Positive (+5 Pts)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDebriefSentiment('neutral')}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          debriefSentiment === 'neutral'
                            ? 'bg-[#0A84FF]/20 border-[#0A84FF] text-[#0A84FF]'
                            : 'border-[var(--glass-border)] text-[var(--text-2)] hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        Neutral (+1 Pt)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDebriefSentiment('guarded')}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          debriefSentiment === 'guarded'
                            ? 'bg-[#FF453A]/20 border-[#FF453A] text-[#FF453A]'
                            : 'border-[var(--glass-border)] text-[var(--text-2)] hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        Guarded (-3 Pts)
                      </button>
                    </div>
                  </div>

                  {/* Notes Textarea */}
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-3)] mb-2 block">
                      Key Takeaways & Agreements
                    </span>
                    <textarea
                      rows={4}
                      value={debriefContent}
                      onChange={(e) => setDebriefContent(e.target.value)}
                      placeholder="e.g. Client confirmed willingness to sign LOI if 4th parking slot is confirmed. Spouse approved the Italian marble finishes..."
                      className="w-full rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-subtle)] backdrop-blur-xl p-3.5 text-xs sm:text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
                      required
                    />
                  </div>

                  <div className="flex justify-end">
                    <GenerateButton
                      type="submit"
                      hue={150}
                      text="Save debrief"
                      generatingText="Saving debrief..."
                      isGenerating={isSavingDebrief}
                    />
                  </div>
                </form>
              </GlassCard>

              {/* Historical Debrief Entries */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-3)] px-1">
                  Historical Debrief Records ({lead.debriefNotes.length})
                </h4>
                {lead.debriefNotes.map((note) => (
                  <GlassCard key={note.id} className="p-4 rounded-xl" hoverLift={false}>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold text-[var(--text)]">{note.author}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[var(--text-3)]">{note.date}</span>
                        <span
                          className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            note.sentiment === 'positive'
                              ? 'bg-[#30C48D]/15 text-[#30C48D]'
                              : 'bg-amber-500/15 text-amber-500'
                          }`}
                        >
                          {note.sentiment.toUpperCase()} ({note.scoreDelta > 0 ? `+${note.scoreDelta}` : note.scoreDelta})
                        </span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--text-2)] leading-relaxed">
                      {note.content}
                    </p>
                  </GlassCard>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: COPILOT CHAT */}
          {activeTab === 'copilot' && (
            <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-4">
              <GlassCard className="p-5 rounded-2xl flex flex-col h-[520px]" hoverLift={false}>
                {/* Chat Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[var(--glass-border)]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[var(--accent)] text-white flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[var(--text)]">Deal Desk Copilot</h4>
                      <p className="text-[10px] text-[var(--text-3)] font-mono">Context: {lead.name} • {lead.budget}</p>
                    </div>
                  </div>
                  <GlassPill variant="accent">Online</GlassPill>
                </div>

                {/* Messages Scroll Area */}
                <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
                  {copilotHistory.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-[var(--accent)] text-white shadow-sm'
                            : 'glass-panel bg-white/70 dark:bg-white/10 border border-[var(--glass-border)] text-[var(--text)]'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {isCopilotTyping && (
                    <div className="flex justify-start">
                      <div className="glass-panel p-3 rounded-2xl border border-[var(--glass-border)] text-xs text-[var(--text-3)] flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 animate-spin text-[var(--accent)]" />
                        <span>Copilot analyzing deal strategy...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Prompt Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-2 border-t border-[var(--glass-border)]">
                  <button
                    onClick={() => handleSendCopilot('Draft a formal WhatsApp check-in for Rajesh')}
                    className="text-[11px] font-medium text-[var(--accent)] bg-[var(--accent-subtle)] px-2.5 py-1 rounded-full whitespace-nowrap hover:brightness-105"
                  >
                    Draft WhatsApp
                  </button>
                  <button
                    onClick={() => handleSendCopilot('What is our leverage on the 4th car parking slot?')}
                    className="text-[11px] font-medium text-[var(--accent)] bg-[var(--accent-subtle)] px-2.5 py-1 rounded-full whitespace-nowrap hover:brightness-105"
                  >
                    Parking Concession
                  </button>
                  <button
                    onClick={() => handleSendCopilot('Compare pricing with Worli Sea Face historical comps')}
                    className="text-[11px] font-medium text-[var(--accent)] bg-[var(--accent-subtle)] px-2.5 py-1 rounded-full whitespace-nowrap hover:brightness-105"
                  >
                    Compare Pricing
                  </button>
                </div>

                {/* Input Bar */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={copilotInput}
                    onChange={(e) => setCopilotInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendCopilot()}
                    placeholder="Ask Copilot anything regarding this mandate..."
                    className="flex-1 bg-[var(--glass-subtle)] border border-[var(--glass-border)] text-xs sm:text-sm text-[var(--text)] px-4 py-2.5 rounded-full outline-none focus:border-[var(--accent)]"
                  />
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleSendCopilot()}
                    disabled={!copilotInput.trim() || isCopilotTyping}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Liquid Glass Action Bar */}
      <div className="fixed bottom-20 md:bottom-4 inset-x-0 z-30 max-w-4xl mx-auto px-4 pointer-events-none">
        <GlassPanel
          className="pointer-events-auto p-3 sm:p-3.5 rounded-full border border-[var(--glass-border)] bg-white/85 dark:bg-[#070B14]/85 backdrop-blur-3xl shadow-2xl flex items-center justify-between gap-3"
          strong
        >
          <div className="hidden sm:flex items-center gap-2 pl-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#30C48D] animate-ping" />
            <span className="text-xs font-semibold text-[var(--text)]">Mandate Active: {lead.name}</span>
          </div>

          <div className="flex items-center justify-end w-full sm:w-auto gap-2">
            <Button
              size="sm"
              variant="glass"
              iconLeft={<Phone className="w-3.5 h-3.5 text-emerald-500" />}
              onClick={() => setActionModal('call')}
            >
              Log Call
            </Button>
            <Button
              size="sm"
              variant="glass"
              iconLeft={<Calendar className="w-3.5 h-3.5 text-[var(--accent)]" />}
              onClick={() => setActionModal('visit')}
            >
              Schedule Visit
            </Button>
            <GenerateButton
              hue={210}
              text="Generate term sheet"
              generatingText="Generating..."
              onClick={() => setActionModal('termSheet')}
            />
          </div>
        </GlassPanel>
      </div>

      {/* Quick Action Modals */}
      <Modal
        isOpen={Boolean(actionModal)}
        onClose={() => setActionModal(null)}
        title={
          actionModal === 'call'
            ? `Log Strategy Call: ${lead.name}`
            : actionModal === 'visit'
            ? `Schedule Private Walkthrough`
            : `Issue Draft Term Sheet`
        }
        description="Prospera AI Deal Desk Action System"
      >
        <div className="space-y-4 text-sm text-[var(--text-2)]">
          <p>
            {actionModal === 'call'
              ? `Initiating direct VoIP recording session with ${lead.name} (${lead.phone}). Notes will be synchronized to the debrief matrix.`
              : actionModal === 'visit'
              ? `Confirming private security clearance and site concierge for ${lead.propertyInterest}.`
              : `Synthesizing letter of intent (LOI) with ${lead.budget} purchase figure and 4-bay parking covenant.`}
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setActionModal(null)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => {
                const actionName = actionModal;
                setActionModal(null);
                toast.success('Action Executed', `${actionName?.toUpperCase()} protocol confirmed for ${lead.name}.`);
              }}
            >
              Confirm Execution
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

