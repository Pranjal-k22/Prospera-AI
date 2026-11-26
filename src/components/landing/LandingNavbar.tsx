'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Globe, Menu, User, Sun, Moon, LogIn, LayoutDashboard, Compass } from 'lucide-react';
import { BRAND_NAME, getStorageItem, setStorageItem } from '@/lib/brand';
export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => 
    typeof window !== 'undefined' ? (getStorageItem('theme') === 'dark' || (!getStorageItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) : false
  );

  useEffect(() => {
    // Detect theme
    const timer = setTimeout(() => {
      const theme = getStorageItem('theme');
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(theme === 'dark' || (!theme && systemDark));
    }, 0);

    // Scroll threshold handler (30% of viewport height)
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > window.innerHeight * 0.3);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      setStorageItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      setStorageItem('theme', 'light');
    }
  };

  const navLinks = [
    { label: 'Homes', href: '#recommended-homes' },
    { label: 'Cities', href: '#cities' },
    { label: 'For Brokers', href: '/broker' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-[74px] transition-all duration-500 ease-[var(--out,cubic-bezier(0.16,1,0.3,1))] ${
        isScrolled
          ? 'bg-white/75 dark:bg-[#0c101a]/80 backdrop-blur-xl border-b border-[#1d1a1c]/8 dark:border-white/10 shadow-[0_10px_30px_rgba(40,20,15,0.06)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)] text-[#1d1a1c] dark:text-[#f4f5f8]'
          : 'bg-transparent border-b border-white/28 text-white/92'
      }`}
      style={{
        paddingLeft: 'clamp(20px, 9.5vw, 170px)',
        paddingRight: 'clamp(20px, 9.5vw, 170px)',
      }}
    >
      <div className="flex items-center justify-between h-full w-full">
        {/* Left: Brand Logo & Buyers Pill */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="font-[var(--font-urbanist)] font-light text-[26px] tracking-wide hover:opacity-85 transition-opacity"
          >
            {BRAND_NAME}
          </Link>

          {/* 1x42px divider at 45% opacity */}
          <div
            className={`w-[1px] h-[42px] transition-colors duration-500 ${
              isScrolled ? 'bg-[#1d1a1c]/25 dark:bg-white/25' : 'bg-white/45'
            }`}
          />

          <Link
            href="/buyer"
            className="flex items-center gap-1.5 text-[14px] font-[var(--font-urbanist)] font-medium tracking-wide hover:opacity-80 transition-opacity"
          >
            <span>Buyers</span>
            <ChevronDown size={14} className="opacity-75" />
          </Link>
        </div>

        {/* Centre: Nav links (hidden on mobile <= 1000px) */}
        <nav className="hidden lg:flex items-center flex-nowrap whitespace-nowrap shrink-0 gap-6 xl:gap-[44px]">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="group relative text-[14.5px] font-[var(--font-urbanist)] font-normal tracking-wide transition-colors py-1"
            >
              <span>{link.label}</span>
              {/* Underline wipes in from left and out to right on hover */}
              <span
                aria-hidden="true"
                className={`absolute bottom-0 left-0 w-full h-[1.5px] transition-transform duration-300 ease-[var(--out)] scale-x-0 group-hover:scale-x-100 origin-left ${
                  isScrolled ? 'bg-[#1d1a1c] dark:bg-white' : 'bg-white'
                }`}
              />
            </Link>
          ))}
        </nav>

        {/* Right: List Property, Language & Glass Pill Menu */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/buyer"
            className="hidden md:inline-block text-[14px] font-[var(--font-urbanist)] font-medium hover:opacity-80 transition-opacity"
          >
            List your property
          </Link>

          <button
            type="button"
            aria-label="Language selection"
            className="p-1 hover:opacity-80 transition-opacity"
            onClick={() => alert('English (India) selected')}
          >
            <Globe size={18} strokeWidth={1.5} />
          </button>

          {/* User pill menu button (1.5px border, 9px radius) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
              aria-label="Toggle user navigation menu"
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-[9px] border-[1.5px] transition-all duration-300 hover:shadow-md ${
                isScrolled
                  ? 'border-[#1d1a1c]/20 dark:border-white/20 bg-white/40 dark:bg-white/5'
                  : 'border-white/50 bg-white/10'
              }`}
            >
              <Menu size={16} strokeWidth={1.75} />
              <div className="w-[22px] h-[22px] rounded-full bg-white/25 flex items-center justify-center overflow-hidden">
                <User size={13} strokeWidth={1.75} />
              </div>
            </button>

            {/* Glass Dropdown Menu */}
            <AnimatePresence>
              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                    aria-hidden="true"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 top-[calc(100%+10px)] z-50 w-64 p-2 rounded-[18px] bg-white/95 dark:bg-[#121622]/95 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-[0_20px_50px_rgba(60,30,25,0.22)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-[#1d1a1c] dark:text-[#f4f5f8]"
                  >
                    <div className="px-3 py-2 border-b border-black/5 dark:border-white/5">
                      <p className="text-[11px] uppercase tracking-wider text-[#8a7f83] dark:text-[#727a88] font-medium">
                        Portal Navigation
                      </p>
                    </div>

                    <div className="py-1 space-y-0.5">
                      <Link
                        href="/login"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[13.5px] font-[var(--font-urbanist)] font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                      >
                        <LogIn size={16} className="text-[#e8a33b]" />
                        <span>Sign In</span>
                      </Link>

                      <Link
                        href="/broker"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[13.5px] font-[var(--font-urbanist)] font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                      >
                        <LayoutDashboard size={16} className="text-[#3b82f6]" />
                        <span>Broker Desk</span>
                      </Link>

                      <Link
                        href="/buyer"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[13.5px] font-[var(--font-urbanist)] font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                      >
                        <Compass size={16} className="text-[#10b981]" />
                        <span>Buyer Portal</span>
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-black/5 dark:border-white/5">
                      <button
                        type="button"
                        onClick={toggleTheme}
                        className="flex items-center justify-between w-full px-3 py-2.5 rounded-[12px] text-[13.5px] font-[var(--font-urbanist)] font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          {isDark ? <Sun size={16} className="text-[#f7c325]" /> : <Moon size={16} className="text-[#6366f1]" />}
                          <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[#8a7f83]">
                          {isDark ? 'Dark' : 'Light'}
                        </span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
