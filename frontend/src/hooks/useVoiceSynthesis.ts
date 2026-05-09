import { useState, useRef, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

export interface VoiceSynthesisHook {
  speak: (text: string) => Promise<void>;
  isSpeaking: boolean;
  stop: () => void;
}

export default function useVoiceSynthesis(): VoiceSynthesisHook {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    async (text: string): Promise<void> => {
      stop();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch(`${API_BASE}/tts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
          signal: controller.signal,
        });
        if (!response.ok) { stop(); return; }

        const blob = await response.blob();

        // If stop() was called during the async phase, bail before creating resources.
        if (controller.signal.aborted) return;

        const url = URL.createObjectURL(blob);
        urlRef.current = url;

        const audio = new Audio(url);
        audioRef.current = audio;
        setIsSpeaking(true);

        await new Promise<void>((resolve) => {
          audio.onended = () => { stop(); resolve(); };
          audio.onerror = () => { stop(); resolve(); };
          audio.play().catch(() => { stop(); resolve(); });
        });
      } catch {
        // Covers AbortError (stop() called mid-fetch) and network errors.
        stop();
      }
    },
    [stop]
  );

  return { speak, isSpeaking, stop };
}
