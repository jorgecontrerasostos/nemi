import { useState, useCallback } from "react";
import { sendMessage, type Message } from "../services/companion_api.ts";
import type { Language } from "../i18n/index.ts";

interface Options {
  language: Language;
  onReply: (reply: string) => void;
  onError?: (message: string) => void;
}

export interface CompanionHook {
  send: (messages: Message[]) => Promise<void>;
  isLoading: boolean;
}

export default function useCompanion({ language, onReply, onError }: Options): CompanionHook {
  const [isLoading, setIsLoading] = useState(false);

  const send = useCallback(
    async (messages: Message[]) => {
      setIsLoading(true);
      try {
        const reply = await sendMessage(messages, language);
        onReply(reply);
      } catch (err) {
        onError?.((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    },
    [language, onReply, onError]
  );

  return { send, isLoading };
}
