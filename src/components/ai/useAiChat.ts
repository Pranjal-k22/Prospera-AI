'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { AiContext, detectContextFromRoute, generateGroundedAiReply } from '@/lib/ai-context';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  isError?: boolean;
}

const STORAGE_KEY = 'prospera_ai_chat_session_v1';

export function useAiChat() {
  const pathname = usePathname();

  // Launcher state
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  // Context & Messages
  const [context, setContext] = useState<AiContext>(() => detectContextFromRoute(pathname));
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // ignore
      }
    }
    return [
      {
        id: 'welcome-1',
        role: 'assistant',
        content: `Welcome to **Prospera AI**. I am your private luxury real-estate advisor. How may I assist your search today?`,
        timestamp: Date.now(),
      },
    ];
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Save messages to sessionStorage on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch {
        // ignore
      }
    }
  }, [messages]);

  // Route awareness: update context on pathname change if no specific listing is locked
  const prevPathRef = useRef(pathname);
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      const detected = detectContextFromRoute(pathname);
      const timer = setTimeout(() => {
        setContext((prev) => {
          if (detected.listingId || detected.leadId) {
            return detected;
          }
          return { ...prev, route: pathname };
        });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Stop active streaming or generation
  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setIsTyping(false);
    setMessages((prev) =>
      prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m))
    );
  }, []);

  // Send a message
  const sendMessage = useCallback(
    async (text: string, contextOverride?: AiContext) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      // Stop any prior in-flight request
      stopStreaming();

      const effectiveContext = contextOverride || context;
      const userMsgId = 'msg-' + Date.now();
      const userMessage: ChatMessage = {
        id: userMsgId,
        role: 'user',
        content: trimmed,
        timestamp: Date.now(),
      };

      // Ensure panel is open when message is sent
      setIsExpanded(false);
      setIsPanelOpen(true);
      setHasUnread(false);

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        // 400ms thinking pause
        await new Promise((r) => setTimeout(r, 400));
        if (controller.signal.aborted) return;

        // Fetch grounded AI response
        const fullResponse = await generateGroundedAiReply(trimmed, effectiveContext, controller.signal);
        if (controller.signal.aborted) return;

        setIsTyping(false);
        setIsStreaming(true);

        const aiMsgId = 'ai-' + Date.now();
        const placeholderAiMsg: ChatMessage = {
          id: aiMsgId,
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
          isStreaming: true,
        };

        setMessages((prev) => [...prev, placeholderAiMsg]);

        // Word-by-word streaming simulation (~25ms per word)
        const words = fullResponse.split(' ');
        let accumulated = '';

        for (let i = 0; i < words.length; i++) {
          if (controller.signal.aborted) break;
          accumulated += (i === 0 ? '' : ' ') + words[i];

          setMessages((prev) =>
            prev.map((m) => (m.id === aiMsgId ? { ...m, content: accumulated } : m))
          );

          await new Promise((r) => setTimeout(r, 25));
        }

        // Finalize streaming
        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsgId ? { ...m, isStreaming: false } : m))
        );
        setIsStreaming(false);

        // If panel was closed while streaming, mark unread
        if (!isPanelOpen) {
          setHasUnread(true);
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          // Normal abort, ignore
          return;
        }
        setIsTyping(false);
        setIsStreaming(false);
        const errorMsg: ChatMessage = {
          id: 'err-' + Date.now(),
          role: 'assistant',
          content: 'I encountered an unexpected issue while retrieving market data. Please try again.',
          timestamp: Date.now(),
          isError: true,
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    },
    [context, isStreaming, isPanelOpen, stopStreaming]
  );

  // Regenerate last AI message
  const regenerateLastMessage = useCallback(() => {
    if (messages.length < 2 || isStreaming) return;

    // Find the last user query
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUserMsg) return;

    // Remove trailing assistant message
    setMessages((prev) => {
      const copy = [...prev];
      if (copy[copy.length - 1].role === 'assistant') {
        copy.pop();
      }
      return copy;
    });

    sendMessage(lastUserMsg.content);
  }, [messages, isStreaming, sendMessage]);

  // Open chat panel with specific context and optional pre-populated prompt
  const openWithContext = useCallback(
    (newContext: AiContext, initialPrompt?: string) => {
      setContext(newContext);
      setIsExpanded(false);
      setIsPanelOpen(true);
      setHasUnread(false);

      if (initialPrompt) {
        sendMessage(initialPrompt, newContext);
      }
    },
    [sendMessage]
  );

  // Clear specific context back to route default
  const clearContext = useCallback(() => {
    setContext(detectContextFromRoute(pathname));
  }, [pathname]);

  const openLauncher = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const closeLauncher = useCallback(() => {
    setIsExpanded(false);
    setIsPanelOpen(false);
  }, []);

  return {
    isExpanded,
    setIsExpanded,
    isPanelOpen,
    setIsPanelOpen,
    hasUnread,
    setHasUnread,
    isTyping,
    isStreaming,
    context,
    setContext,
    clearContext,
    messages,
    sendMessage,
    stopStreaming,
    regenerateLastMessage,
    openWithContext,
    openLauncher,
    closeLauncher,
  };
}
