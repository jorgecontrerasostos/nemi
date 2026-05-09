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
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t border-gray-200 bg-white">
      {isSupported && (
        <button
          type="button"
          onClick={onToggleVoice}
          disabled={isSpeaking}
          aria-label={isListening ? "Stop recording" : "Start voice input"}
          className={`px-3 py-3 rounded-xl text-sm min-w-[44px] min-h-[44px] transition-colors disabled:opacity-40 ${
            isListening
              ? "bg-red-100 text-red-600 animate-pulse"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          🎤
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
        className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 min-h-[44px]"
      />
      {!isListening && (
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          aria-label="Send message"
          className="px-5 py-3 bg-indigo-600 text-white rounded-xl text-sm font-medium disabled:opacity-40 min-w-[44px] min-h-[44px] active:bg-indigo-700 transition-colors"
        >
          ↑
        </button>
      )}
    </form>
  );
}
