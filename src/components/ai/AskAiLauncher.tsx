'use client';

import React, { useState, useEffect, useRef, useId, useMemo } from 'react';
import { motion, AnimatePresence, type Transition } from 'framer-motion';
import { Sparkles, Send, X, ArrowUpRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { getSuggestionsForContext, AiContext } from '@/lib/ai-context';
import { useAiChat } from './useAiChat';
import { AiChatPanel } from './AiChatPanel';

export function AskAiLauncher() {
  const pathname = usePathname();
  const rawId = useId();
  const filterId = `gooey-filter-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const [query, setQuery] = useState('');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSafariOrIos, setIsSafariOrIos] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  );

  const inputRef = useRef<HTMLInputElement | null>(null);
  const launcherRef = useRef<HTMLButtonElement | null>(null);

  const {
    isExpanded,
    setIsExpanded,
    isPanelOpen,
    setIsPanelOpen,
    hasUnread,
    isTyping,
    isStreaming,
    context,
    clearContext,
    messages,
    sendMessage,
    stopStreaming,
    regenerateLastMessage,
    openWithContext,
    closeLauncher,
  } = useAiChat();

  // Hide launcher on /login, /signup, or /dev/* (except /dev/ui where it is previewed)
  const isHiddenRoute = useMemo(() => {
    if (pathname === '/login' || pathname === '/signup') return true;
    if (pathname.startsWith('/dev') && pathname !== '/dev/ui') return true;
    return false;
  }, [pathname]);

  // Client-side detection for Safari / iOS and prefers-reduced-motion
  useEffect(() => {
    // 1. Detect reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motionHandler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionHandler);

    // 2. Detect Safari / iOS
    const ua = navigator.userAgent.toLowerCase();
    const isSafari =
      ua.includes('safari') && !ua.includes('chrome') && !ua.includes('chromium') && !ua.includes('android');
    const isIOS = /ipad|iphone|ipod/.test(ua);
    if (isSafari || isIOS) {
      setTimeout(() => setIsSafariOrIos(true), 0);
    }

    // 3. Monitor Command Palette trigger (Cmd+K / Ctrl+K)
    const handlePaletteKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handlePaletteKey);

    return () => {
      motionQuery.removeEventListener('change', motionHandler);
      window.removeEventListener('keydown', handlePaletteKey);
    };
  }, []);

  // Global Keyboard Shortcuts (Ctrl/Cmd + J to open, Escape to collapse)
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'j' || e.key === 'J')) {
        e.preventDefault();
        if (isPanelOpen) {
          setIsPanelOpen(false);
          setIsExpanded(false);
        } else if (isExpanded) {
          setIsExpanded(false);
        } else {
          setIsExpanded(true);
          setTimeout(() => inputRef.current?.focus(), 80);
        }
      }

      if (e.key === 'Escape') {
        if (isPanelOpen) {
          setIsPanelOpen(false);
        } else if (isExpanded) {
          setIsExpanded(false);
          launcherRef.current?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [isExpanded, isPanelOpen, setIsExpanded, setIsPanelOpen]);

  // Listen to custom window 'open-ai-chat' event (e.g. from listing detail modal button)
  useEffect(() => {
    const handleCustomOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{
        context?: AiContext;
        initialPrompt?: string;
      }>;
      if (customEvent.detail?.context) {
        openWithContext(customEvent.detail.context, customEvent.detail.initialPrompt);
      } else {
        setIsPanelOpen(true);
      }
    };

    window.addEventListener('open-ai-chat', handleCustomOpen);
    return () => window.removeEventListener('open-ai-chat', handleCustomOpen);
  }, [openWithContext, setIsPanelOpen]);

  // Context-aware suggestions filtered by user typing
  const allSuggestions = useMemo(() => getSuggestionsForContext(context), [context]);
  const filteredSuggestions = useMemo(() => {
    if (!query.trim()) return allSuggestions.slice(0, 4);
    const q = query.toLowerCase();
    return allSuggestions.filter((s) => s.text.toLowerCase().includes(q));
  }, [allSuggestions, query]);

  // Handlers
  const handleOpenExpand = () => {
    setIsExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 60);
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    setQuery('');
  };

  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim()) return;
    sendMessage(promptText.trim());
    setQuery('');
    setIsExpanded(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredSuggestions.length > 0 && query.trim() === '') {
        handleSendPrompt(filteredSuggestions[0].text);
      } else if (query.trim()) {
        handleSendPrompt(query.trim());
      }
    }
  };

  // Skip rendering if route is hidden or palette is open
  if (isHiddenRoute || isCommandPaletteOpen) {
    return null;
  }

  // Animation spring constants from reference
  const useGooey = !isSafariOrIos && !prefersReducedMotion;
  const morphTransition: Transition = prefersReducedMotion
    ? { duration: 0.15 }
    : { type: 'spring', duration: 0.75, bounce: 0.15 };

  return (
    <>
      {/* SVG GOOEY FILTER (Hidden element, scoped id) */}
      {useGooey && (
        <svg
          className="absolute w-0 h-0 pointer-events-none -z-50 overflow-hidden"
          aria-hidden="true"
        >
          <defs>
            <filter id={filterId}>
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -15"
                result="gooey"
              />
              <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
            </filter>
          </defs>
        </svg>
      )}

      {/* CHAT PANEL (Rendered when panel is open) */}
      <AiChatPanel
        isOpen={isPanelOpen}
        onClose={closeLauncher}
        onMinimize={() => setIsPanelOpen(false)}
        messages={messages}
        context={context}
        onClearContext={clearContext}
        onSendMessage={(text) => sendMessage(text)}
        onStopStreaming={stopStreaming}
        onRegenerate={regenerateLastMessage}
        isStreaming={isStreaming}
        isTyping={isTyping}
      />

      {/* LAUNCHER PILL & MORPH CONTAINER */}
      {!isPanelOpen && (
        <div
          className="fixed z-[100] flex flex-col items-end select-none"
          style={{
            bottom: 'max(24px, env(safe-area-inset-bottom, 24px))',
            right: 'max(24px, env(safe-area-inset-right, 24px))',
          }}
        >
          {/* ============================================================== */}
          {/* LAYER 1: BACKGROUND-ONLY GOOEY FILTER LAYER                     */}
          {/* No text or inputs here to prevent distorted fonts or caret     */}
          {/* ============================================================== */}
          <div
            className="absolute bottom-0 right-0 pointer-events-none"
            style={{
              filter: useGooey ? `url(#${filterId})` : undefined,
            }}
          >
            {/* Background Suggestion Blobs (Rising Upward) */}
            <AnimatePresence>
              {isExpanded &&
                filteredSuggestions.map((_, idx) => (
                  <motion.div
                    key={`bg-blob-${idx}`}
                    initial={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { y: 0, scale: 0.3, filter: 'blur(8px)' }
                    }
                    animate={
                      prefersReducedMotion
                        ? { opacity: 1 }
                        : {
                            y: -(idx + 1) * 48 - 6,
                            scale: 1,
                            filter: 'blur(0px)',
                          }
                    }
                    exit={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { y: 0, scale: 0.5, filter: 'blur(6px)', opacity: 0 }
                    }
                    transition={{
                      type: 'spring',
                      duration: 0.75,
                      bounce: 0.35,
                      delay: prefersReducedMotion ? 0 : idx * 0.1,
                    }}
                    className="absolute right-0 w-[280px] h-[38px] rounded-full bg-[#141c28] dark:bg-[#1a2333] shadow-md"
                  />
                ))}
            </AnimatePresence>

            {/* Background Main Pill Blob */}
            <motion.div
              layout
              transition={morphTransition}
              className="h-[44px] rounded-full bg-[#141c28] dark:bg-[#1a2333] shadow-xl"
              style={{
                width: isExpanded ? 330 : 106,
              }}
            />

            {/* Background Send Bubble Blob */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 8, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ type: 'spring', duration: 0.85, bounce: 0.15, delay: 0.08 }}
                  className="absolute right-[-48px] bottom-0 w-[44px] h-[44px] rounded-full bg-[#141c28] dark:bg-[#1a2333] shadow-lg"
                />
              )}
            </AnimatePresence>
          </div>

          {/* ============================================================== */}
          {/* LAYER 2: FOREGROUND UNFILTERED INTERACTIVE LAYER               */}
          {/* Clean, sharp text, full accessibility, crisp input & buttons   */}
          {/* ============================================================== */}
          <div className="relative flex flex-col items-end">
            {/* Suggestion Pills (Rising Upward) */}
            <AnimatePresence>
              {isExpanded && (
                <ul
                  role="list"
                  aria-label="Suggested questions"
                  className="absolute right-0 flex flex-col items-end gap-2 list-none p-0 m-0 z-10"
                  style={{
                    bottom: '52px',
                  }}
                >
                  {filteredSuggestions.map((suggestion, idx) => (
                    <motion.li
                      key={suggestion.id}
                      initial={
                        prefersReducedMotion
                          ? { opacity: 0, y: 0 }
                          : { opacity: 0, y: 15, scale: 0.9 }
                      }
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      transition={{
                        duration: 0.35,
                        delay: prefersReducedMotion ? 0 : idx * 0.08,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleSendPrompt(suggestion.text)}
                        className="group flex items-center justify-between w-[280px] h-[38px] px-4 rounded-full text-left text-xs font-medium text-white hover:text-amber-200 bg-[#141c28] border border-white/15 hover:border-[#e8a33b]/60 shadow-md outline-none focus-visible:ring-2 focus-visible:ring-[#e8a33b] transition-all cursor-pointer"
                      >
                        <span className="truncate pr-2">{suggestion.text}</span>
                        <ArrowUpRight
                          size={13}
                          className="text-[#e8a33b] opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0"
                        />
                      </button>
                    </motion.li>
                  ))}
                </ul>
              )}
            </AnimatePresence>

            {/* Collapsed Pill vs Expanded Input Pill */}
            {!isExpanded ? (
              <motion.button
                ref={launcherRef}
                type="button"
                onClick={handleOpenExpand}
                aria-label="Open AI assistant"
                aria-expanded={false}
                aria-haspopup="dialog"
                whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                className="relative flex items-center justify-center gap-2 h-[44px] w-[106px] rounded-full text-white font-[var(--font-urbanist)] font-semibold text-xs tracking-wide outline-none focus-visible:ring-2 focus-visible:ring-[#e8a33b] cursor-pointer shadow-lg bg-[#141c28] border border-white/20 hover:border-white/40 transition-colors"
              >
                <Sparkles size={14} className="text-[#e8a33b]" />
                <span>Ask AI</span>

                {/* Amber Unread Notification Badge */}
                {hasUnread && (
                  <span
                    aria-label="Unread AI message"
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#e8a33b] border-2 border-[#141c28] shadow-sm animate-pulse"
                  />
                )}
              </motion.button>
            ) : (
              <div className="relative flex items-center h-[44px] w-[330px]">
                <label htmlFor="gooey-ai-launcher-input" className="sr-only">
                  Ask about homes, prices, visits
                </label>
                <div className="flex items-center gap-2 w-full h-full px-3.5 rounded-full border border-white/20 bg-[#141c28] shadow-2xl">
                  <Sparkles size={14} className="text-[#e8a33b] shrink-0" />
                  <input
                    id="gooey-ai-launcher-input"
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    placeholder="Ask about homes, prices, visits..."
                    className="flex-1 bg-transparent border-0 outline-none text-xs text-white placeholder:text-white/60"
                  />

                  {query.trim() ? (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      aria-label="Clear query"
                      className="p-1 rounded-full text-white/50 hover:text-white transition-colors cursor-pointer"
                    >
                      <X size={13} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCollapse}
                      aria-label="Close launcher"
                      className="p-1 rounded-full text-white/50 hover:text-white transition-colors cursor-pointer"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* External Bubble Send Button */}
                <button
                  type="button"
                  onClick={() => handleSendPrompt(query.trim() || filteredSuggestions[0]?.text || '')}
                  aria-label="Send message"
                  className="absolute right-[-48px] bottom-0 flex items-center justify-center w-[44px] h-[44px] rounded-full text-white hover:text-[#e8a33b] bg-[#141c28] border border-white/20 outline-none focus-visible:ring-2 focus-visible:ring-[#e8a33b] transition-colors cursor-pointer shadow-xl"
                >
                  <Send size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
