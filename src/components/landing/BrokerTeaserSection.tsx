'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Flame, TrendingUp, Users, ShieldCheck } from 'lucide-react';
import { LiquidGlass } from '@/components/ui/LiquidGlass';
import { Button } from '@/components/ui/button';
import { BRAND_NAME } from '@/lib/brand';

export function BrokerTeaserSection() {
  const kpis = [
    { label: 'Active Deal Pipeline', value: '₹148.5 Cr', change: '+18.4% this month', icon: TrendingUp },
    { label: 'Hot Inbound Inquiries', value: '24 Deals', change: 'AI Pre-Qualified 90+', icon: Flame },
    { label: 'Avg Close Velocity', value: '18 Days', change: '4x market speed', icon: Users },
  ];

  return (
    <section className="relative py-20 px-5 sm:px-10 max-w-[1380px] mx-auto z-10">
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <LiquidGlass
          variant="elevated"
          className="p-8 sm:p-12 lg:p-16 rounded-[28px] overflow-hidden relative"
        >
          {/* Subtle Ambient Glow */}
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#e8a33b]/10 blur-[80px] pointer-events-none"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            {/* Left Column: Heading & Copy */}
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e8a33b]/15 text-[#e8a33b] text-[12px] font-[var(--font-urbanist)] font-bold tracking-wider uppercase">
                <ShieldCheck size={14} />
                <span>Broker Enterprise Desk</span>
              </span>

              <h2 className="font-[var(--font-gilda)] text-[34px] sm:text-[46px] leading-[1.1] text-[#1d1a1c] dark:text-white font-normal">
                Empower Your Advisory Desk With Real-Time AI Triage
              </h2>

              <p className="font-[var(--font-urbanist)] text-[16px] text-[#5c5156] dark:text-[#a6adb9] leading-relaxed">
                Stop chasing cold spreadsheet rows. {BRAND_NAME} Deal Desk automates inbound lead scoring, computes time-decay urgency, synthesizes pre-call briefs, and drafts WhatsApp/Email rebuttals with one click.
              </p>

              <div className="pt-2">
                <Link href="/broker">
                  <Button
                    variant="primary"
                    size="lg"
                    iconRight={<ArrowUpRight size={18} />}
                    className="px-8 py-4 text-[15px] font-semibold tracking-wide shadow-[0_8px_24px_rgba(232,163,59,0.3)]"
                  >
                    Open Broker Deal Room
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: Mini Dashboard Teaser (KPI cards with counters) */}
            <div className="space-y-4">
              <div className="p-3 bg-black/4 dark:bg-white/5 rounded-[18px] border border-black/5 dark:border-white/5">
                <div className="flex items-center justify-between px-3 py-2 border-b border-black/5 dark:border-white/5 mb-3">
                  <span className="text-[12px] uppercase tracking-wider font-semibold text-[#8a7f83]">
                    Live Deal Telemetry
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] text-[#22c55e] font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                    Broker Sync Active
                  </span>
                </div>

                <div className="space-y-3">
                  {kpis.map((kpi) => {
                    const IconComp = kpi.icon;
                    return (
                      <div
                        key={kpi.label}
                        className="p-4 rounded-[14px] bg-white/80 dark:bg-[#151a26]/90 border border-white/80 dark:border-white/10 shadow-xs flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-full bg-[#fbe7da] dark:bg-white/10 flex items-center justify-center text-[#e8a33b]">
                            <IconComp size={18} />
                          </div>
                          <div>
                            <span className="text-[12px] font-[var(--font-urbanist)] text-[#8a7f83] block">
                              {kpi.label}
                            </span>
                            <span className="font-[var(--font-urbanist)] font-bold text-[20px] text-[#1d1a1c] dark:text-white block leading-tight">
                              {kpi.value}
                            </span>
                          </div>
                        </div>
                        <span className="text-[12px] font-medium text-[#e8a33b] bg-[#e8a33b]/10 px-2.5 py-1 rounded-full">
                          {kpi.change}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </LiquidGlass>
      </motion.div>
    </section>
  );
}
