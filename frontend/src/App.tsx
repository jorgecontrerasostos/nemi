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
import InputScreen from "./pages/InputScreen.tsx";
import SubtopicPicker from "./pages/SubtopicPicker.tsx";
import type { Message } from "./services/companion_api.ts";
import type { ScopeResult } from "./services/scope_api.ts";
import type { SessionState } from "./utils/session.ts";

const TIMER_ACTIVE_STATES = new Set<SessionState>([
  SESSION_STATES.SCOPING,
  SESSION_STATES.EXPLAINING,
  SESSION_STATES.IDLE_MID_SESSION,
  SESSION_STATES.FEEDBACK,
]);

type View = "landing" | "input" | "subtopic" | "chat";

export default function App() {
  const [view, setView] = useState<View>("landing");
  const [scopeResult, setScopeResult] = useState<ScopeResult | null>(null);
  const [focusTopic, setFocusTopic] = useState("");
  const [voiceMode, setVoiceMode] = useState(false);
  const voiceModeRef = useRef(false);
  useEffect(() => { voiceModeRef.current = voiceMode; }, [voiceMode]);
  const hasStarted = useRef(false);

  const {
    state, messages, language, setLanguage, addMessage,
    toScoping, toExplaining, toFeedback, toCompleted, toIdleMidSession, resetSession,
  } = useSession();

  const t = useTranslation(language);
  const { formatted, reset: resetTimer } = useTimer(TIMER_ACTIVE_STATES.has(state));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sessionKey, setSessionKey] = useState(0);

  const { speak, isSpeaking, stop: stopSpeaking } = useVoiceSynthesis();
  const handleIdle = useCallback(() => toIdleMidSession(), [toIdleMidSession]);
  const handleError = useCallback((msg: string) => addMessage("assistant", msg), [addMessage]);
  const startListeningRef = useRef<() => void>(() => {});

  const handleReply = useCallback(
    (reply: string) => {
      addMessage("assistant", reply);
      if (voiceMode) {
        speak(reply).then(() => { if (voiceModeRef.current) startListeningRef.current(); });
      }
    },
    [addMessage, voiceMode, speak]
  );

  const { send, isLoading } = useCompanion({
    language,
    topic: focusTopic || undefined,
    onReply: handleReply,
    onError: handleError,
  });

  const sendRef = useRef(send);
  useEffect(() => { sendRef.current = send; }, [send]);

  const { recordActivity } = useIdleDetection({ sessionState: state, onIdle: handleIdle });

  const submitMessage = useCallback(
    (text: string) => {
      addMessage("user", text);
      recordActivity();
      const nextMessages: Message[] = [...messages, { role: "user", content: text }];
      if (isFeedbackTrigger(text) && state === SESSION_STATES.EXPLAINING) toFeedback();
      else if (state === SESSION_STATES.SCOPING || state === SESSION_STATES.IDLE_MID_SESSION) toExplaining();
      void send(nextMessages);
    },
    [addMessage, recordActivity, messages, state, toFeedback, toExplaining, send]
  );

  const { isListening, interimTranscript, startListening, stopListening, isSupported } = useVoiceInput({
    lang: language === "es" ? "es-ES" : "en-US",
    silenceMs: 3000,
    onTranscript: useCallback((text: string) => submitMessage(text), [submitMessage]),
  });

  useEffect(() => { startListeningRef.current = startListening; }, [startListening]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Guard prevents a spurious API call on mount. hasStarted flips to true when the user
  // clicks "Start Session" for the first time.
  useEffect(() => {
    if (!hasStarted.current) return;
    void sendRef.current([]);
    toScoping();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionKey]);

  const startSession = useCallback((topic: string) => {
    hasStarted.current = true;
    setFocusTopic(topic);
    resetSession();
    resetTimer();
    setView("chat");
    setSessionKey((k) => k + 1);
  }, [resetSession, resetTimer]);

  const handleNewSession = () => {
    stopListening();
    stopSpeaking();
    setVoiceMode(false);
    setScopeResult(null);
    setFocusTopic("");
    resetSession();
    resetTimer();
    setView("landing");
  };

  const handleToggleVoice = useCallback(() => {
    if (isListening) { stopListening(); setVoiceMode(false); }
    else { stopSpeaking(); setVoiceMode(true); startListening(); }
  }, [isListening, stopListening, stopSpeaking, startListening]);

  if (view === "landing") {
    return <LandingPage onStart={() => setView("input")} />;
  }

  if (view === "input") {
    return (
      <InputScreen
        onScope={(result) => { setScopeResult(result); setView("subtopic"); }}
        onBack={() => setView("landing")}
      />
    );
  }

  if (view === "subtopic" && scopeResult) {
    return (
      <SubtopicPicker
        topic={scopeResult.topic}
        subtopics={scopeResult.subtopics}
        onStart={startSession}
        onBack={() => setView("input")}
      />
    );
  }

  if (state === SESSION_STATES.COMPLETED) {
    const lastAssistantMsg = [...messages].reverse().find((m) => m.role === "assistant")?.content ?? "";
    return (
      <div className="flex flex-col h-screen max-w-2xl mx-auto">
        <SessionSummary
          feedbackText={lastAssistantMsg}
          topic={focusTopic}
          duration={formatted}
          messageCount={messages.length}
          onNewSession={handleNewSession}
          onStudyGaps={(gapsContext) => startSession(gapsContext)}
          t={t}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-surface max-w-2xl mx-auto">
      <header className="flex flex-col border-b border-outline-variant bg-surface-container-lowest">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="font-bold text-on-surface text-base">{t.appName}</h1>
          <div className="flex items-center gap-3">
            <SessionTimer formatted={formatted} />
            <button
              onClick={() => setLanguage(language === "en" ? "es" : "en")}
              className="text-xs text-on-surface-variant min-h-[44px] px-2"
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
        </div>
        {focusTopic && (
          <div className="px-4 pb-2">
            <div className="inline-flex items-center gap-1.5 bg-primary-fixed text-on-primary-fixed text-xs font-semibold px-3 py-1 rounded-full">
              <span className="material-symbols-outlined text-sm">book</span>
              {focusTopic}
            </div>
          </div>
        )}
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 bg-surface">
        {messages.map((msg, i) => (
          <ChatBubble key={i} role={msg.role} content={msg.content} />
        ))}
        {isLoading && <ChatBubble role="assistant" content={t.thinking} />}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSend={useCallback((text: string) => submitMessage(text), [submitMessage])}
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