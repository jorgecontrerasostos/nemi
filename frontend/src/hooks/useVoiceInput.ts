import { useState, useRef, useCallback } from "react";

declare global {
  interface Window {
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface Options {
  lang: "es-ES" | "en-US";
  silenceMs?: number;
  onTranscript: (text: string) => void;
}

export interface VoiceInputHook {
  isListening: boolean;
  interimTranscript: string;
  startListening: () => void;
  stopListening: () => void;
  isSupported: boolean;
}

export default function useVoiceInput({
  lang,
  silenceMs = 3000,
  onTranscript,
}: Options): VoiceInputHook {
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finalTranscriptRef = useRef("");

  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const stopListening = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
    setInterimTranscript("");
    finalTranscriptRef.current = "";
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) return;

    const SpeechRecognitionImpl =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionImpl();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    finalTranscriptRef.current = "";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let final = finalTranscriptRef.current;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      finalTranscriptRef.current = final;
      setInterimTranscript(interim || final);

      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        const text = (finalTranscriptRef.current || interim).trim();
        if (text) {
          stopListening();
          onTranscript(text);
        }
      }, silenceMs);
    };

    recognition.onerror = () => stopListening();

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  }, [isSupported, lang, silenceMs, onTranscript, stopListening]);

  return { isListening, interimTranscript, startListening, stopListening, isSupported };
}
