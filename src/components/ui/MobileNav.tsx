'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Briefcase, Compass, Sparkles } from 'lucide-react';
import { defaultSpring } from '@/lib/motion';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: <Home className="w-5 h-5" strokeWidth={1.75} /> },
    { href: '/broker', label: 'Broker', icon: <Briefcase className="w-5 h-5" strokeWidth={1.75} /> },
    { href: '/buyer', label: 'Buyer', icon: <Compass className="w-5 h-5" strokeWidth={1.75} /> },
    { href: '/dev/ui', label: 'Design', icon: <Sparkles className="w-5 h-5" strokeWidth={1.75} /> },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-4 inset-x-4 z-40 max-w-sm mx-auto pointer-events-none select-none"
    >
      <div className="relative pointer-events-auto flex flex-col items-center">
        {/* Soft living ambient underglow (reproducing the emerald aura in reference photo) */}
        <div className="absolute -bottom-3 inset-x-6 h-12 bg-gradient-to-r from-emerald-500/30 via-teal-400/40 to-cyan-500/30 blur-2xl rounded-full pointer-events-none -z-10 opacity-70 dark:opacity-85" />

        {/* Floating Top Mini-Pill Badge (reference: "📷 Capture" pill) */}
        <div className="-mb-2.5 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-tight text-[var(--text-2)] bg-white/80 dark:bg-black/60 backdrop-blur-xl border border-white/70 dark:border-white/15 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI Live Desk</span>
          </div>
        </div>

        {/* Liquid Glass Capsule Island */}
        <div className="w-full p-1.5 rounded-[28px] border border-white/70 dark:border-white/15 bg-white/75 dark:bg-[#070B14]/80 backdrop-blur-3xl shadow-[0_16px_40px_rgba(15,25,50,0.14),inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_1px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.22),inset_0_-1px_1px_rgba(0,0,0,0.4)] flex items-center justify-around">
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center justify-center min-w-[68px] min-h-[48px] px-3.5 py-1.5 rounded-[22px] text-[10px] font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                  isActive
                    ? 'text-[var(--text)]'
                    : 'text-[var(--text-3)] hover:text-[var(--text)]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-active-pill"
                    transition={defaultSpring}
                    className="absolute inset-0 rounded-[20px] bg-white/95 dark:bg-white/16 border border-white dark:border-white/25 shadow-[0_4px_16px_rgba(15,25,50,0.12),inset_0_1px_1px_rgba(255,255,255,0.95)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.28)] -z-10"
                  />
                )}
                <span className={isActive ? 'text-[var(--accent)]' : ''}>{item.icon}</span>
                <span className="mt-0.5 tracking-tight font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default MobileNav;
