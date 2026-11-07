'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Briefcase, Compass, LayoutDashboard, Search, Sparkles, Building2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { defaultSpring } from '@/lib/motion';

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: '/broker', label: 'Broker Desk', icon: <Briefcase className="w-4 h-4" /> },
    { href: '/buyer', label: 'Buyer Portal', icon: <Compass className="w-4 h-4" /> },
    { href: '/dev/ui', label: 'Design System', icon: <Sparkles className="w-4 h-4" /> },
  ];

  const triggerCommandPalette = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));
  };

  return (
    <header className="sticky top-4 z-40 w-full px-4 sm:px-6 pointer-events-none mb-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Brand Liquid Glass Pill */}
        <Link
          href="/"
          className="glass-pill flex items-center gap-2.5 px-4 py-2 rounded-full border border-[var(--glass-border)] bg-white/70 dark:bg-[#070B14]/80 backdrop-blur-2xl shadow-sm hover:shadow-md transition-all group"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[var(--accent)] to-indigo-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-base font-bold tracking-tight text-[var(--text)] leading-none">
              Prospera<span className="text-[var(--accent)]">.AI</span>
            </span>
            <span className="font-mono text-[8px] uppercase tracking-wider text-[var(--text-3)] leading-none mt-0.5">
              Luxury Deal Desk
            </span>
          </div>
        </Link>

        {/* Center Liquid Glass Navigation Pill (Reference style: Apple VisionOS / User Photos) */}
        <nav className="glass-panel hidden md:flex items-center gap-1.5 p-1 rounded-full border border-[var(--glass-border)] bg-white/60 dark:bg-[#070B14]/75 backdrop-blur-2xl shadow-md">
          {navLinks.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href) && item.href !== '/broker' && pathname === item.href);
            const isBrokerActive = item.href === '/broker' && (pathname === '/broker' || pathname.startsWith('/broker/leads'));
            const active = isActive || isBrokerActive;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold select-none transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                  active ? 'text-[var(--text)]' : 'text-[var(--text-2)] hover:text-[var(--text)]'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="main-nav-pill"
                    transition={defaultSpring}
                    className="absolute inset-0 rounded-full bg-white/95 dark:bg-white/18 shadow-[0_4px_14px_rgba(15,25,50,0.1),inset_0_1px_1px_rgba(255,255,255,0.95)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)] border border-white/80 dark:border-white/25 z-[-1]"
                  />
                )}
                <span className={active ? 'text-[var(--accent)]' : ''}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2">
          {/* Quick Search Pill */}
          <button
            onClick={triggerCommandPalette}
            className="glass-pill flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--glass-border)] bg-white/60 dark:bg-[#070B14]/70 backdrop-blur-xl text-xs text-[var(--text-2)] hover:text-[var(--text)] hover:shadow-sm transition-all"
          >
            <Search className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden sm:inline-block font-mono text-[9px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[var(--text-3)] border border-black/5 dark:border-white/10">
              ⌘K
            </kbd>
          </button>

          {/* Sun / Moon Theme Toggle */}
          <ThemeToggle />

          {/* User Profile Avatar Pill */}
          <Link
            href="/broker"
            className="glass-pill hidden sm:flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-[var(--glass-border)] bg-white/60 dark:bg-[#070B14]/70 backdrop-blur-xl hover:shadow-sm transition-all"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Avatar"
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-xs font-medium text-[var(--text)]">Arjun V.</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

