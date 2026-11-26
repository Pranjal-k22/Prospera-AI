'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Send, Sun, Moon, ArrowUpRight } from 'lucide-react';
import { BRAND_NAME, getStorageItem, setStorageItem } from '@/lib/brand';
import { useToast } from '@/components/ui/Toast';

export function LandingFooter() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isDark, setIsDark] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const theme = getStorageItem('theme');
      setIsDark(theme === 'dark');
    }, 0);
    return () => clearTimeout(timer);
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

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Invalid email', 'Please provide a valid email address.');
      return;
    }
    setEmail('');
    toast.success('Subscribed!', 'You will receive our curated Indian luxury portfolio briefings.');
  };

  return (
    <footer id="contact" className="relative border-t border-black/8 dark:border-white/10 pt-20 pb-16 px-5 sm:px-10 max-w-[1380px] mx-auto z-10 text-[#1d1a1c] dark:text-[#f4f5f8]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-black/8 dark:border-white/8">
        {/* Brand & Newsletter (2 columns) */}
        <div className="lg:col-span-2 space-y-5">
          <Link href="/" className="font-[var(--font-urbanist)] font-light text-[28px] tracking-wide inline-block">
            {BRAND_NAME}
          </Link>
          <p className="font-[var(--font-urbanist)] text-[14.5px] text-[#5c5156] dark:text-[#a6adb9] leading-relaxed max-w-sm">
            India&apos;s premiere AI-assisted real estate deal desk. Curating architecturally significant penthouses, heritage estates, and coastal sanctuaries across Mumbai, Bengaluru, Hyderabad, and Pune.
          </p>

          <form onSubmit={handleSubscribe} className="pt-2 max-w-md flex items-center gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your private email..."
              className="flex-1 px-4 py-3 rounded-[12px] bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm outline-none focus:border-[#e8a33b]"
            />
            <button
              type="submit"
              aria-label="Subscribe to newsletter"
              className="px-5 py-3 rounded-[12px] bg-[#1d1a1c] dark:bg-white text-white dark:text-[#1d1a1c] font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Join</span>
              <Send size={14} />
            </button>
          </form>
        </div>

        {/* Column 2: Portals */}
        <div className="space-y-4 font-[var(--font-urbanist)]">
          <h4 className="text-[12px] uppercase tracking-wider font-bold text-[#8a7f83]">Portals</h4>
          <ul className="space-y-2.5 text-[14px] text-[#5c5156] dark:text-[#a6adb9]">
            <li>
              <Link href="/buyer" className="hover:text-[#e8a33b] transition-colors flex items-center gap-1">
                <span>Buyer Concierge</span>
                <ArrowUpRight size={13} />
              </Link>
            </li>
            <li>
              <Link href="/broker" className="hover:text-[#e8a33b] transition-colors flex items-center gap-1">
                <span>Broker Deal Room</span>
                <ArrowUpRight size={13} />
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-[#e8a33b] transition-colors">
                Sign In
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-[#e8a33b] transition-colors">
                Create Account
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Micro-Markets */}
        <div className="space-y-4 font-[var(--font-urbanist)]">
          <h4 className="text-[12px] uppercase tracking-wider font-bold text-[#8a7f83]">Micro-Markets</h4>
          <ul className="space-y-2.5 text-[14px] text-[#5c5156] dark:text-[#a6adb9]">
            <li>Worli Sea Face, Mumbai</li>
            <li>Pali Hill, Bandra West</li>
            <li>Jubilee Hills, Hyderabad</li>
            <li>Koramangala 3rd Block, Bengaluru</li>
            <li>Koregaon Park, Pune</li>
          </ul>
        </div>

        {/* Column 4: Compliance & Contact */}
        <div className="space-y-4 font-[var(--font-urbanist)]">
          <h4 className="text-[12px] uppercase tracking-wider font-bold text-[#8a7f83]">Intelligence</h4>
          <ul className="space-y-2.5 text-[14px] text-[#5c5156] dark:text-[#a6adb9]">
            <li>MahaRERA Verified Registry</li>
            <li>Algorithmic Valuation Index</li>
            <li>Private Deed Escrow</li>
            <li>advisory@{BRAND_NAME.toLowerCase()}ai.com</li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[#8a7f83] font-[var(--font-urbanist)]">
        <p>© {new Date().getFullYear()} {BRAND_NAME} Real Estate Intelligence Technologies. All rights reserved.</p>

        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark/light theme"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 transition-colors cursor-pointer"
          >
            {isDark ? <Sun size={14} className="text-[#f7c325]" /> : <Moon size={14} className="text-[#6366f1]" />}
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
