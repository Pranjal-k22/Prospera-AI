'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  Minus,
  Send,
  Square,
  Copy,
  Check,
  RotateCcw,
  WifiOff,
  User,
  Home,
  AlertCircle,
} from 'lucide-react';
import { LiquidGlass } from '@/components/ui/LiquidGlass';
import { Button } from '@/components/ui/button';
import { GenerateButton } from '@/components/ui/generate-button';
import { BRAND_NAME } from '@/lib/brand';
import { AiContext, LISTING_PROMPT_CHIPS } from '@/lib/ai-context';
import { ChatMessage } from './useAiChat';

export interface AiChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  messages: ChatMessage[];
  context: AiContext;
  onClearContext: () => void;
  onSendMessage: (text: string) => void;
  onStopStreaming: () => void;
  onRegenerate: () => void;
  isStreaming: boolean;
  isTyping: boolean;
}

export function AiChatPanel({
  isOpen,
  onClose,
  onMinimize,
  messages,
  context,
  onClearContext,
  onSendMessage,
  onStopStreaming,
  onRegenerate,
  isStreaming,
  isTyping,
}: AiChatPanelProps) {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDraftingOffer, setIsDraftingOffer] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isStreaming, isOpen]);

  // Focus textarea when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Auto-grow textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= 500) {
      setInputText(val);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'Escape') {
      onMinimize();
    }
  };

  const handleSend = () => {
    if (!inputText.trim() || isStreaming || isOffline) return;
    onSendMessage(inputText.trim());
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Dedicated AI Generation Actions using <GenerateButton>
  const handleDraftOffer = async () => {
    setIsDraftingOffer(true);
    await onSendMessage(
      context.title
        ? `Draft a formal luxury purchase offer for ${context.title} (${context.priceFormatted ?? 'market price'}) including standard escrow conditions.`
        : 'Draft a formal luxury purchase offer structure.'
    );
    setIsDraftingOffer(false);
  };

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    await onSendMessage(
      context.title
        ? `Generate an executive market summary and investment thesis for ${context.title}.`
        : 'Generate a portfolio executive summary.'
    );
    setIsGeneratingSummary(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: 'spring', duration: 0.45, bounce: 0.15 }}
        style={{ transformOrigin: 'bottom right' }}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[120] w-[calc(100vw-32px)] sm:w-[400px] h-[82vh] sm:h-[580px] max-h-[700px] flex flex-col select-none"
      >
        <LiquidGlass
          variant="elevated"
          className="w-full h-full rounded-2xl sm:rounded-3xl border border-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden bg-[#0c111c]/95 backdrop-blur-2xl text-white"
        >
          {/* 1. HEADER */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 shrink-0 bg-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#e8a33b]/20 text-[#e8a33b] flex items-center justify-center shadow-xs border border-[#e8a33b]/30">
                <Sparkles size={16} />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="font-[var(--font-urbanist)] font-bold text-base tracking-tight text-white">
                  {BRAND_NAME} AI
                </h3>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#e8a33b]/20 text-[#e8a33b] border border-[#e8a33b]/30">
                  Beta
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onMinimize}
                aria-label="Minimize AI chat"
                className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Minus size={16} />
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close AI chat"
                className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* 2. CONTEXT CHIP BAR */}
          {(context.title || context.leadName) && (
            <div className="px-4 py-2 border-b border-white/8 bg-white/3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-white/80 truncate">
                {context.title ? (
                  <>
                    <Home size={12} className="text-[#e8a33b] shrink-0" />
                    <span className="font-semibold truncate text-white">{context.title}</span>
                    {context.locality && <span className="opacity-60 truncate text-white/70">&bull; {context.locality}</span>}
                  </>
                ) : (
                  <>
                    <User size={12} className="text-[#e8a33b] shrink-0" />
                    <span className="font-semibold truncate text-white">Lead: {context.leadName}</span>
                    {context.leadCompany && <span className="opacity-60 truncate text-white/70">({context.leadCompany})</span>}
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={onClearContext}
                title="Clear current context"
                className="p-0.5 rounded-full hover:bg-white/10 transition-colors text-white/60"
              >
                <X size={12} />
              </button>
            </div>
          )}

          {/* Offline Banner */}
          {isOffline && (
            <div className="px-3 py-1.5 bg-amber-500/20 border-b border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
              <WifiOff size={13} />
              <span>Offline: Assistant responses will resume once reconnected.</span>
            </div>
          )}

          {/* 3. MESSAGE LIST */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 text-[13.5px] leading-relaxed">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`group relative flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`relative p-3.5 rounded-2xl max-w-[88%] select-text transition-all ${
                    msg.role === 'user'
                      ? 'bg-[#e8a33b]/22 border border-[#e8a33b]/40 text-[#fef9f0] rounded-br-xs font-medium'
                      : 'bg-white/8 border border-white/12 text-[#f3f5f9] rounded-bl-xs shadow-sm'
                  }`}
                >
                  {/* Message Markdown Parsing (Headers, bold, bullet points) */}
                  <div className="space-y-2 prose-sm">
                    {msg.content.split('\n\n').map((paragraph, pIdx) => {
                      if (paragraph.startsWith('### ')) {
                        return (
                          <h4 key={pIdx} className="font-bold text-sm text-[#e8a33b] mt-1 mb-1">
                            {paragraph.replace('### ', '')}
                          </h4>
                        );
                      }
                      if (paragraph.includes('\n• ') || paragraph.startsWith('• ')) {
                        const items = paragraph.split('\n');
                        return (
                          <ul key={pIdx} className="space-y-1 list-none pl-1">
                            {items.map((it, itIdx) => (
                              <li key={itIdx} className="text-[13px] leading-snug">
                                {it.startsWith('• ') ? (
                                  <span className="flex items-start gap-1.5">
                                    <span className="text-[#e8a33b] font-bold">&bull;</span>
                                    <span>{it.replace('• ', '')}</span>
                                  </span>
                                ) : (
                                  it
                                )}
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      return (
                        <p key={pIdx} className="text-[13px] leading-relaxed">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>

                  {/* Actions for Assistant Messages */}
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mt-2 pt-1 border-t border-black/5 dark:border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="p-1 rounded text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors"
                        title="Copy response"
                      >
                        {copiedId === msg.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      </button>
                      <span className="text-[10px] text-black/40 dark:text-white/40">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Error Banner on message */}
                {msg.isError && (
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-red-400">
                    <AlertCircle size={12} />
                    <span>Failed to retrieve answer.</span>
                    <button
                      type="button"
                      onClick={onRegenerate}
                      className="underline hover:text-red-300 font-semibold cursor-pointer"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-black/4 dark:bg-white/6 border border-black/8 dark:border-white/10 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e8a33b] animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#e8a33b] animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#e8a33b] animate-bounce [animation-delay:300ms]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 4. CONTEXT PROMPT CHIPS (Listing AI Integration) */}
          {context.title && (
            <div className="px-3 py-2 border-t border-black/6 dark:border-white/6 bg-black/2 dark:bg-white/2">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {LISTING_PROMPT_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => onSendMessage(`Give me a detailed ${chip} for ${context.title}.`)}
                    className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium border border-black/10 dark:border-white/12 bg-white/60 dark:bg-white/5 hover:border-[#e8a33b]/60 hover:text-[#e8a33b] transition-all cursor-pointer whitespace-nowrap"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 5. DEDICATED AI ACTIONS (GenerateButton amber per spec) */}
          {context.title && (
            <div className="px-3.5 py-2 border-t border-black/6 dark:border-white/6 bg-black/2 dark:bg-white/2 flex items-center gap-2">
              <GenerateButton
                tone="amber"
                status={isDraftingOffer ? 'generating' : 'idle'}
                label="Draft offer"
                generatingLabel="Drafting..."
                successLabel="Offer Drafted"
                onClick={handleDraftOffer}
                size="sm"
                className="flex-1"
              />
              <GenerateButton
                tone="amber"
                status={isGeneratingSummary ? 'generating' : 'idle'}
                label="Generate summary"
                generatingLabel="Summarizing..."
                successLabel="Summary Ready"
                onClick={handleGenerateSummary}
                size="sm"
                className="flex-1"
              />
            </div>
          )}

          {/* 6. INPUT BAR */}
          <div className="p-3 border-t border-white/10 bg-black/30 flex flex-col gap-1.5">
            <div className="flex items-end gap-2 bg-white/8 border border-white/15 rounded-xl p-1.5 focus-within:border-[#e8a33b]/70 focus-within:ring-2 focus-within:ring-[#e8a33b]/20 transition-all">
              <label htmlFor="ai-chat-input" className="sr-only">
                Ask {BRAND_NAME} AI a question
              </label>
              <textarea
                id="ai-chat-input"
                ref={textareaRef}
                rows={1}
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask about homes, prices, visits..."
                disabled={isOffline}
                className="flex-1 bg-transparent border-0 outline-none resize-none px-2 py-1 text-[13px] leading-snug text-white placeholder:text-white/45 max-h-[120px]"
              />

              {isStreaming ? (
                <button
                  type="button"
                  onClick={onStopStreaming}
                  aria-label="Stop generating response"
                  className="p-2 rounded-lg bg-red-500/15 text-red-500 hover:bg-red-500/25 transition-colors cursor-pointer"
                  title="Stop generating"
                >
                  <Square size={14} className="fill-current" />
                </button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleSend}
                  disabled={!inputText.trim() || isOffline}
                  aria-label="Send message"
                  className="p-2 rounded-lg h-8 w-8 flex items-center justify-center cursor-pointer shrink-0"
                >
                  <Send size={13} />
                </Button>
              )}
            </div>

            {/* Footer row: Character counter & Regenerate shortcut */}
            <div className="flex items-center justify-between px-1 text-[10.5px] text-black/45 dark:text-white/45">
              <span className="truncate">
                AI-generated. Verify details with broker.
              </span>
              <div className="flex items-center gap-2">
                {messages.length > 1 && !isStreaming && (
                  <button
                    type="button"
                    onClick={onRegenerate}
                    className="flex items-center gap-1 hover:text-[#e8a33b] transition-colors"
                  >
                    <RotateCcw size={10} />
                    <span>Regenerate</span>
                  </button>
                )}
                {inputText.length > 400 && (
                  <span className={inputText.length >= 500 ? 'text-red-400 font-bold' : ''}>
                    {inputText.length}/500
                  </span>
                )}
              </div>
            </div>
          </div>
        </LiquidGlass>
      </motion.div>
    </AnimatePresence>
  );
}
