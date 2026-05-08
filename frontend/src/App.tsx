import { useEffect, useRef, useState, useCallback } from "react";
import useSession from "./hooks/useSession.ts";
import useTimer from "./hooks/useTimer.ts";
import useIdleDetection from "./hooks/useIdleDetection.ts";
import useCompanion from "./hooks/useCompanion.ts";
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

  const handleReply = useCallback(
    (reply: string) => addMessage("assistant", reply),
    [addMessage]
  );

  const handleError = useCallback(
    (msg: string) => addMessage("assistant", msg),
    [addMessage]
  );

  const { send, isLoading } = useCompanion({ language, onReply: handleReply, onError: handleError });

  const sendRef = useRef(send);
  useEffect(() => { sendRef.current = send; }, [send]);

  const handleIdle = useCallback(() => toIdleMidSession(), [toIdleMidSession]);
  const { recordActivity } = useIdleDetection({ sessionState: state, onIdle: handleIdle });

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

  const handleSend = async (text: string) => {
    addMessage("user", text);
    recordActivity();

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];

    if (isFeedbackTrigger(text) && state === SESSION_STATES.EXPLAINING) {
      toFeedback();
    } else if (state === SESSION_STATES.SCOPING || state === SESSION_STATES.IDLE_MID_SESSION) {
      toExplaining();
    }

    await send(nextMessages);
  };

  const handleNewSession = () => {
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
              onClick={() => toCompleted()}
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

      <ChatInput onSend={handleSend} disabled={isLoading} placeholder={t.inputPlaceholder} />
    </div>
  );
}
