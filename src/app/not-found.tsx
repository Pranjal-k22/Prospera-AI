'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Compass, ArrowRight, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassPill } from '@/components/ui/GlassPill';
import { fadeInUp } from '@/lib/motion';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 sm:px-6">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg text-center"
      >
        <GlassCard className="p-8 sm:p-12 rounded-3xl" hoverLift={false} strong>
          <div className="flex justify-center mb-4">
            <GlassPill variant="accent">
              <Compass className="w-3.5 h-3.5" />
              <span>Location Unregistered</span>
            </GlassPill>
          </div>

          <h1 className="font-serif text-6xl sm:text-7xl font-bold text-[var(--accent)] tracking-tight">
            404
          </h1>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text)] mt-2">
            Sanctuary Not Found
          </h2>

          <p className="text-sm text-[var(--text-2)] mt-3 leading-relaxed">
            The deal room, listing, or intelligence dossier you requested has either closed, relocated, or requires higher cryptographic clearance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Link href="/admin">
              <button className="button-primary px-6 py-2.5 text-xs uppercase tracking-wider">
                Enter Deal Room
              </button>
            </Link>
            <Link href="/">
              <button className="button-secondary px-6 py-2.5 text-xs uppercase tracking-wider">
                Back to Home
              </button>
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

