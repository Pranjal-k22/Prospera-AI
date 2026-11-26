'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sliders, Sparkles, KeyRound } from 'lucide-react';
import { LiquidGlass } from '@/components/ui/LiquidGlass';
import { BRAND_NAME } from '@/lib/brand';

export function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      title: 'Define Your Vision',
      description: 'Specify preferred Indian micro-markets, capital allocation, architectural styles, and family lifestyle demands.',
      icon: Sliders,
      badge: 'Intelligent Intake',
    },
    {
      step: '02',
      title: 'AI Matches Verified Homes',
      description: `${BRAND_NAME} AI audits hundreds of off-market listings, evaluating verified deed histories, price trajectory, and natural light.`,
      icon: Sparkles,
      badge: 'Synthesized Matches',
    },
    {
      step: '03',
      title: 'Private Broker Visit',
      description: 'Tour curated residences accompanied by certified regional advisory partners with transparent negotiations and term sheets.',
      icon: KeyRound,
      badge: 'Seamless Close',
    },
  ];

  return (
    <section id="how-it-works" className="relative py-24 px-5 sm:px-10 max-w-[1380px] mx-auto z-10">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="text-[12px] uppercase tracking-[0.2em] font-[var(--font-urbanist)] font-bold text-[#e8a33b]">
          A Transparent Acquisition Path
        </span>
        <h2 className="font-[var(--font-gilda)] text-[34px] sm:text-[44px] text-[#1d1a1c] dark:text-white font-normal">
          How {BRAND_NAME} Works
        </h2>
        <p className="font-[var(--font-urbanist)] text-[15.5px] text-[#5c5156] dark:text-[#a6adb9]">
          Replacing fragmented broker calls and opaque listings with deterministic intelligence and bespoke concierge tours.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <LiquidGlass
                variant="default"
                hoverLift
                className="p-8 rounded-[22px] h-full flex flex-col justify-between"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="font-[var(--font-urbanist)] font-bold text-[32px] text-[#1d1a1c]/20 dark:text-white/20">
                      {item.step}
                    </span>
                    <div className="w-12 h-12 rounded-[14px] bg-[#fbe7da] dark:bg-white/10 flex items-center justify-center text-[#e8a33b] shadow-xs">
                      <IconComp size={22} strokeWidth={1.75} />
                    </div>
                  </div>

                  <span className="inline-block px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 text-[11px] uppercase tracking-wider font-semibold text-[#8a7f83]">
                    {item.badge}
                  </span>

                  <h3 className="font-[var(--font-urbanist)] font-semibold text-[21px] text-[#1d1a1c] dark:text-white">
                    {item.title}
                  </h3>

                  <p className="font-[var(--font-urbanist)] text-[14.5px] text-[#5c5156] dark:text-[#a6adb9] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </LiquidGlass>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
