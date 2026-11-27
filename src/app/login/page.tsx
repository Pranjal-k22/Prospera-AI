'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { PullCord } from '@/components/ui/PullCord';
import { BRAND_NAME, BRAND_FULL_NAME, getStorageItem } from '@/lib/brand';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLight, setIsLight] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return getStorageItem('theme') === 'light';
    }
    return false;
  });
  const router = useRouter();

  const handleToggleLight = useCallback((light: boolean) => {
    setIsLight(light);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        if (data.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/customer');
        }
        router.refresh();
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setLoading(false);
      setError('An unexpected network error occurred');
    }
  };

  return (
    <div
      className={`relative min-h-screen w-full flex flex-col items-center justify-start overflow-x-hidden transition-colors duration-500 font-sans ${
        isLight ? 'text-[#1d1a1c]' : 'text-[#e7eaf0]'
      }`}
    >
      {/* Physical Pull Cord Lamp & Animated Room Lighting Wave */}
      <PullCord
        initialLight={isLight}
        onToggleLight={handleToggleLight}
        className="fixed inset-0 pointer-events-none z-0"
      />

      {/* Top Bar: Back to Home navigation */}
      <header className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4 sm:p-8 max-w-7xl mx-auto w-full">
        <Link
          href="/"
          className={`flex items-center gap-1.5 sm:gap-2 text-xs font-semibold tracking-wide transition-colors ${
            isLight ? 'text-[#6e635f] hover:text-[#9e5c09]' : 'text-[#8c94a0] hover:text-[#f3bd65]'
          }`}
        >
          <Icon name="arrow" size={13} className="rotate-180" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Luxury Deal Room Auth Card */}
      <main className="relative z-20 w-full max-w-md px-4 pt-[240px] sm:pt-[290px] pb-16 flex flex-col items-center">
        <div
          className={`panel w-full p-8 sm:p-9 rounded-2xl border transition-all duration-500 backdrop-blur-xl ${
            isLight
              ? 'bg-white/80 border-[#1d1a1c]/10 shadow-[0_24px_60px_-12px_rgba(200,140,90,0.22),0_0_0_1px_rgba(255,255,255,0.7)_inset]'
              : 'bg-[#11151c]/80 border-white/10 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.06)_inset]'
          }`}
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2.5 mb-2">
              <span
                className={`grid place-items-center w-9 h-9 border font-serif italic text-lg transition-all duration-300 ${
                  isLight
                    ? 'border-[#c97d1e]/40 bg-[#c97d1e]/15 text-[#9e5c09] shadow-[0_0_15px_rgba(201,125,30,0.2)]'
                    : 'border-[#e8a33b]/40 bg-[#e8a33b]/10 text-[#f3bd65] shadow-[0_0_15px_rgba(232,163,59,0.2)]'
                }`}
              >
                {BRAND_NAME.charAt(0)}
              </span>
              <span
                className={`text-2xl font-serif italic tracking-wide transition-colors ${
                  isLight ? 'text-[#1d1a1c]' : 'text-white'
                }`}
              >
                {BRAND_FULL_NAME}
              </span>
            </div>
            <p
              className={`text-sm font-light transition-colors ${
                isLight ? 'text-[#6e635f]' : 'text-[#8c94a0]'
              }`}
            >
              Sign in to your luxury deal room account
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label
                className={`mb-1.5 block text-xs font-semibold transition-colors ${
                  isLight ? 'text-[#5c534f]' : 'text-[#8c94a0]'
                }`}
              >
                Email Address
              </label>
              <input
                type="email"
                className={`field w-full transition-colors ${
                  isLight
                    ? 'bg-black/[0.04] border-black/15 text-[#1d1a1c] placeholder-[#8f827a] focus:border-[#c97d1e]'
                    : 'bg-white/5 border-white/10 text-white placeholder-[#59616d] focus:border-[#e8a33b]'
                }`}
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                className={`mb-1.5 block text-xs font-semibold transition-colors ${
                  isLight ? 'text-[#5c534f]' : 'text-[#8c94a0]'
                }`}
              >
                Password
              </label>
              <input
                type="password"
                className={`field w-full transition-colors ${
                  isLight
                    ? 'bg-black/[0.04] border-black/15 text-[#1d1a1c] placeholder-[#8f827a] focus:border-[#c97d1e]'
                    : 'bg-white/5 border-white/10 text-white placeholder-[#59616d] focus:border-[#e8a33b]'
                }`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-[#ff6b6b] text-xs bg-red-500/10 p-2.5 rounded-lg border border-red-500/20 font-medium">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="button-primary w-full mt-2 py-3 text-sm tracking-wider uppercase font-semibold cursor-pointer active:scale-[0.99] transition-transform"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p
            className={`mt-6 text-center text-xs transition-colors ${
              isLight ? 'text-[#7d716c]' : 'text-[#69717e]'
            }`}
          >
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className={`font-medium hover:underline transition-colors ${
                isLight ? 'text-[#9e5c09]' : 'text-[#f3bd65]'
              }`}
            >
              Create an account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
