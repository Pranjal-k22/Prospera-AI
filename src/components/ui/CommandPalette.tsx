'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Search, UserCheck, Building2, ArrowRight, CornerDownLeft, X, Sparkles } from 'lucide-react';
import { fadeInScale } from '@/lib/motion';
import { MOCK_LEADS, MOCK_PROPERTIES } from '@/lib/mock';

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  // Listen for Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredLeads = query.trim()
    ? MOCK_LEADS.filter(
        (l) =>
          l.name.toLowerCase().includes(query.toLowerCase()) ||
          l.company.toLowerCase().includes(query.toLowerCase()) ||
          l.location.toLowerCase().includes(query.toLowerCase())
      )
    : MOCK_LEADS.slice(0, 4);

  const filteredProps = query.trim()
    ? MOCK_PROPERTIES.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.location.toLowerCase().includes(query.toLowerCase()) ||
          p.city.toLowerCase().includes(query.toLowerCase())
      )
    : MOCK_PROPERTIES.slice(0, 3);

  const handleSelectLead = (id: string) => {
    setIsOpen(false);
    router.push(`/broker/leads/${id}`);
  };

  const handleSelectProperty = (id: string) => {
    setIsOpen(false);
    router.push(`/buyer?property=${id}`);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/45 backdrop-blur-md"
            />

            <motion.div
              variants={fadeInScale}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-2xl glass-panel bg-white/90 dark:bg-[#070B14]/92 backdrop-blur-3xl border border-[var(--glass-border)] rounded-3xl shadow-2xl overflow-hidden z-10"
            >
              {/* Search Bar */}
              <div className="flex items-center px-5 py-4 border-b border-[var(--glass-border)]">
                <Search className="w-5 h-5 text-[var(--accent)] mr-3 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a lead name, company, city, or property..."
                  autoFocus
                  className="w-full bg-transparent text-sm sm:text-base text-[var(--text)] outline-none placeholder:text-[var(--text-3)]"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="p-1 text-[var(--text-3)] hover:text-[var(--text)]">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <kbd className="hidden sm:inline-block ml-3 font-mono text-[10px] uppercase px-2 py-1 rounded bg-black/5 dark:bg-white/10 text-[var(--text-3)]">
                  ESC
                </kbd>
              </div>

              {/* Results List */}
              <div className="max-h-96 overflow-y-auto p-4 space-y-4">
                {/* Leads Category */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[var(--text-3)] px-2 mb-2">
                    <UserCheck className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>High-Priority Deal Desk Leads</span>
                  </div>
                  <div className="space-y-1">
                    {filteredLeads.map((lead) => (
                      <button
                        key={lead.id}
                        onClick={() => handleSelectLead(lead.id)}
                        className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-black/5 dark:hover:bg-white/10 text-left transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={lead.avatar} alt={lead.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                          <div className="truncate">
                            <p className="text-sm font-semibold text-[var(--text)] leading-tight group-hover:text-[var(--accent)] transition-colors">
                              {lead.name}
                            </p>
                            <p className="text-xs text-[var(--text-2)] truncate">
                              {lead.company} • {lead.budget} • {lead.location}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono text-xs font-semibold px-2 py-0.5 rounded-full ${
                              lead.score >= 85
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                : 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                            }`}
                          >
                            {lead.score} FIT
                          </span>
                          <ArrowRight className="w-4 h-4 text-[var(--text-3)] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Properties Category */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[var(--text-3)] px-2 mb-2">
                    <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Luxury Portfolio Inventory</span>
                  </div>
                  <div className="space-y-1">
                    {filteredProps.map((prop) => (
                      <button
                        key={prop.id}
                        onClick={() => handleSelectProperty(prop.id)}
                        className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-black/5 dark:hover:bg-white/10 text-left transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={prop.image} alt={prop.title} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                          <div className="truncate">
                            <p className="text-sm font-semibold text-[var(--text)] leading-tight group-hover:text-[var(--accent)] transition-colors">
                              {prop.title}
                            </p>
                            <p className="text-xs text-[var(--text-2)] truncate">
                              {prop.price} • {prop.location} • {prop.bhk} BHK
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[var(--text-3)] font-mono">{prop.status}</span>
                          <CornerDownLeft className="w-4 h-4 text-[var(--text-3)] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Shortcuts */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--glass-border)] bg-black/5 dark:bg-white/5 text-[11px] text-[var(--text-3)] font-mono">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                  Prospera AI Quick Actions
                </span>
                <div className="flex items-center gap-3">
                  <span>Navigation: <kbd className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">↓</kbd></span>
                  <span>Select: <kbd className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">↵</kbd></span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

