import { useEffect, useRef, useState, useCallback } from "react";
import useSession from "./hooks/useSession.ts";
import useTimer from "./hooks/useTimer.ts";
import useIdleDetection from "./hooks/useIdleDetection.ts";
import useCompanion from "./hooks/useCompanion.ts";
import useVoiceInput from "./hooks/useVoiceInput.ts";
import useVoiceSynthesis from "./hooks/useVoiceSynthesis.ts";
import { useTranslation } from "./i18n/index.ts";
import { SESSION_STATES, isFeedbackTrigger } from "./utils/session.ts";
import ChatBubble from "./components/ChatBubble.tsx";
import ChatInput from "./components/ChatInput.tsx";
import SessionTimer from "./components/SessionTimer.tsx";
import SessionSummary from "./components/SessionSummary.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import type { Message } from "./services/companion_api.ts";
import type { SessionState } from "./utils/session.ts";

const TIMER_ACTIVE_STATES = new Set<SessionState>([
  SESSION_STATES.SCOPING,
  SESSION_STATES.EXPLAINING,
  SESSION_STATES.IDLE_MID_SESSION,
  SESSION_STATES.FEEDBACK,
]);

export default function App() {
  const [view, setView] = useState<"landing" | "chat">("landing");
  const [voiceMode, setVoiceMode] = useState(false);
  const voiceModeRef = useRef(false);
  useEffect(() => { voiceModeRef.current = voiceMode; }, [voiceMode]);
  const hasStarted = useRef(false);

  const {
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
  } = useSession();

  const t = useTranslation(language);
  const { formatted, reset: resetTimer } = useTimer(TIMER_ACTIVE_STATES.has(state));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sessionKey, setSessionKey] = useState(0);

  const { speak, isSpeaking, stop: stopSpeaking } = useVoiceSynthesis();

  const handleIdle = useCallback(() => toIdleMidSession(), [toIdleMidSession]);

  const handleError = useCallback(
    (msg: string) => addMessage("assistant", msg),
    [addMessage]
  );

  // startListening is captured via ref to break the circular dependency:
  // handleReply calls startListening, but useVoiceInput is declared after useCompanion.
  const startListeningRef = useRef<() => void>(() => {});

  const handleReply = useCallback(
    (reply: string) => {
      addMessage("assistant", reply);
      if (voiceMode) {
        speak(reply).then(() => {
          if (voiceModeRef.current) startListeningRef.current();
        });
      }
    },
    [addMessage, voiceMode, speak]
  );

  const { send, isLoading } = useCompanion({ language, onReply: handleReply, onError: handleError });

  // Store latest send in a ref so the greeting effect doesn't re-fire on language change.
  const sendRef = useRef(send);
  useEffect(() => { sendRef.current = send; }, [send]);

  const { recordActivity } = useIdleDetection({ sessionState: state, onIdle: handleIdle });

  const submitMessage = useCallback(
    (text: string) => {
      addMessage("user", text);
      recordActivity();
      const nextMessages: Message[] = [...messages, { role: "user", content: text }];
      if (isFeedbackTrigger(text) && state === SESSION_STATES.EXPLAINING) {
        toFeedback();
      } else if (state === SESSION_STATES.SCOPING || state === SESSION_STATES.IDLE_MID_SESSION) {
        toExplaining();
      }
      void send(nextMessages);
    },
    [addMessage, recordActivity, messages, state, toFeedback, toExplaining, send]
  );

  const handleTranscript = useCallback(
    (text: string) => { submitMessage(text); },
    [submitMessage]
  );

  const { isListening, interimTranscript, startListening, stopListening, isSupported } =
    useVoiceInput({
      lang: language === "es" ? "es-ES" : "en-US",
      silenceMs: 3000,
      onTranscript: handleTranscript,
    });

  // Keep the ref in sync so handleReply can call startListening without a circular dep.
  useEffect(() => { startListeningRef.current = startListening; }, [startListening]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Guard prevents a spurious API call on mount while the user is still on the landing page.
  // hasStarted flips to true the moment the user clicks any "Start" CTA.
  useEffect(() => {
    if (!hasStarted.current) return;
    void sendRef.current([]);
    toScoping();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionKey]);

  const handleStart = () => {
    hasStarted.current = true;
    resetSession();
    resetTimer();
    setView("chat");
    setSessionKey((k) => k + 1);
  };

  const handleSend = useCallback(
    (text: string) => { submitMessage(text); },
    [submitMessage]
  );

  const handleToggleVoice = useCallback(() => {
    if (isListening) {
      stopListening();
      setVoiceMode(false);
    } else {
      stopSpeaking();
      setVoiceMode(true);
      startListening();
    }
  }, [isListening, stopListening, stopSpeaking, startListening]);

  const handleNewSession = () => {
    stopListening();
    stopSpeaking();
    setVoiceMode(false);
    resetSession();
    resetTimer();
    setSessionKey((k) => k + 1);
  };

  if (view === "landing") {
    return <LandingPage onStart={handleStart} />;
  }

  if (state === SESSION_STATES.COMPLETED) {
    const lastAssistantMsg =
      [...messages].reverse().find((m) => m.role === "assistant")?.content ?? "";
    return (
      <div className="flex flex-col h-screen max-w-2xl mx-auto">
        <SessionSummary feedbackText={lastAssistantMsg} onNewSession={handleNewSession} t={t} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-2xl mx-auto">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <h1 className="font-semibold text-gray-800 text-base">{t.appName}</h1>
        <div className="flex items-center gap-3">
          <SessionTimer formatted={formatted} />
          <button
            onClick={() => setLanguage(language === "en" ? "es" : "en")}
            className="text-xs text-gray-400 min-h-[44px] px-2"
          >
            {t.langToggle}
          </button>
          {state !== SESSION_STATES.IDLE_BEFORE_START && (
            <button
              onClick={() => { stopListening(); stopSpeaking(); setVoiceMode(false); toCompleted(); }}
              className="text-sm text-red-500 min-h-[44px] px-2"
            >
              {t.endSession}
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.map((msg, i) => (
          <ChatBubble key={i} role={msg.role} content={msg.content} />
        ))}
        {isLoading && <ChatBubble role="assistant" content={t.thinking} />}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSend={handleSend}
        disabled={isLoading}
        placeholder={t.inputPlaceholder}
        isListening={isListening}
        interimTranscript={interimTranscript}
        isSupported={isSupported}
        onToggleVoice={handleToggleVoice}
        isSpeaking={isSpeaking}
      />
    </div>
  );
}
