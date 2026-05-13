import { useState, useRef } from "react";

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
  placeholder: string;
  isListening?: boolean;
  interimTranscript?: string;
  isSupported?: boolean;
  onToggleVoice?: () => void;
  isSpeaking?: boolean;
}

export default function ChatInput({
  onSend,
  disabled,
  placeholder,
  isListening = false,
  interimTranscript = "",
  isSupported = false,
  onToggleVoice,
  isSpeaking = false,
}: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled || isListening) return;
    onSend(trimmed);
    setValue("");
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) handleSubmit(e);
  };

  return (
    <div className="border-t border-outline-variant bg-surface-container-lowest">
      <p className="text-center text-xs text-outline-variant pt-2 px-4">
        Say <span className="text-primary font-semibold">"feedback"</span> anytime to get your review
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2 px-4 py-3">
        {isSupported && (
          <button
            type="button"
            onClick={onToggleVoice}
            disabled={isSpeaking}
            aria-label={isListening ? "Stop recording" : "Start voice input"}
            className={`px-3 py-3 rounded-xl text-sm min-w-[44px] min-h-[44px] transition-colors disabled:opacity-40 ${
              isListening
                ? "bg-red-100 text-red-600 animate-pulse"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <span className="material-symbols-outlined text-lg">mic</span>
          </button>
        )}
        <textarea
          ref={textareaRef}
          value={isListening ? interimTranscript : value}
          onChange={(e) => { if (!isListening) setValue(e.target.value); }}
          onKeyDown={handleKeyDown}
          disabled={disabled || isListening}
          placeholder={isListening ? "Listening..." : placeholder}
          rows={1}
          className="flex-1 resize-none rounded-2xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary disabled:opacity-50 min-h-[44px] font-sans"
        />
        {!isListening && (
          <button
            type="submit"
            disabled={disabled || !value.trim()}
            aria-label="Send message"
            className="px-4 py-3 bg-primary text-on-primary rounded-2xl text-sm font-medium disabled:opacity-40 min-w-[44px] min-h-[44px] transition-colors"
          >
            <span className="material-symbols-outlined text-lg">arrow_upward</span>
          </button>
        )}
      </form>
    </div>
  );
}
