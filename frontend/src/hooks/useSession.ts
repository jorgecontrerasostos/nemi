import { useState, useCallback } from "react";
import { SESSION_STATES, type SessionState } from "../utils/session.ts";
import type { Message } from "../services/companion_api.ts";
import type { Language } from "../i18n/index.ts";

export interface SessionHook {
  state: SessionState;
  messages: Message[];
  language: Language;
  setLanguage: (lang: Language) => void;
  addMessage: (role: Message["role"], content: string) => void;
  toScoping: () => void;
  toExplaining: () => void;
  toFeedback: () => void;
  toCompleted: () => void;
  toIdleMidSession: () => void;
  resetSession: () => void;
}

export default function useSession(): SessionHook {
  const [state, setState] = useState<SessionState>(SESSION_STATES.IDLE_BEFORE_START);
  const [messages, setMessages] = useState<Message[]>([]);
  const [language, setLanguage] = useState<Language>("en");

  const addMessage = useCallback((role: Message["role"], content: string) => {
    setMessages((prev) => [...prev, { role, content }]);
  }, []);

  const toScoping = useCallback(() => setState(SESSION_STATES.SCOPING), []);
  const toExplaining = useCallback(() => setState(SESSION_STATES.EXPLAINING), []);
  const toFeedback = useCallback(() => setState(SESSION_STATES.FEEDBACK), []);
  const toCompleted = useCallback(() => setState(SESSION_STATES.COMPLETED), []);
  const toIdleMidSession = useCallback(() => setState(SESSION_STATES.IDLE_MID_SESSION), []);

  const resetSession = useCallback(() => {
    setState(SESSION_STATES.IDLE_BEFORE_START);
    setMessages([]);
  }, []);

  return {
    state,
    messages,
    language,
    setLanguage,
    addMessage,
    toScoping,
    toExplaining,
    toFeedback,
    toCompleted,
    toIdleMidSession,
    resetSession,
  };
}
