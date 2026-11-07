'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@/components/Icon';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
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
      setError(data.error || 'Signup failed');
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-[#0a0d12] relative text-[#e7eaf0]">
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-xs font-semibold text-[#8c94a0] hover:text-[#f3bd65] transition-colors"
      >
        <Icon name="arrow" size={14} className="rotate-180" />
        Back to Home
      </Link>
      
      <div className="panel w-full max-w-md p-8 bg-[#11151c]/80 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <span className="grid place-items-center w-9 h-9 border border-[#e8a33b]/40 bg-[#e8a33b]/10 text-[#f3bd65] font-serif italic text-lg shadow-[0_0_15px_rgba(232,163,59,0.2)]">
              P
            </span>
            <span className="text-2xl font-serif italic tracking-wide text-white">Prospera AI</span>
          </div>
          <p className="text-[#8c94a0] text-sm font-light">Create your luxury deal room account</p>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#8c94a0]">Full Name</label>
            <input 
              type="text" 
              className="field w-full bg-white/5 border-white/10 text-white placeholder-[#59616d]" 
              placeholder="e.g. Siddharth Roy"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#8c94a0]">Email Address</label>
            <input 
              type="email" 
              className="field w-full bg-white/5 border-white/10 text-white placeholder-[#59616d]" 
              placeholder="name@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#8c94a0]">Password</label>
            <input 
              type="password" 
              className="field w-full bg-white/5 border-white/10 text-white placeholder-[#59616d]" 
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#8c94a0]">Account Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`choice cursor-pointer transition-all ${role === 'customer' ? 'choice-active' : ''}`}
              >
                Client / Buyer
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`choice cursor-pointer transition-all ${role === 'admin' ? 'choice-active' : ''}`}
              >
                Broker / Admin
              </button>
            </div>
          </div>

          {error && (
            <p className="text-[#ff6b6b] text-xs bg-red-500/10 p-2.5 rounded-lg border border-red-500/20 font-medium">
              {error}
            </p>
          )}

          <button 
            type="submit" 
            className="button-primary w-full mt-2 py-3 text-sm tracking-wider uppercase font-semibold" 
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#69717e]">
          Already have an account?{' '}
          <Link href="/login" className="text-[#f3bd65] font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
