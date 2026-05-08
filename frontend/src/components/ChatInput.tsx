import { useState, useRef } from "react";

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
  placeholder: string;
}

export default function ChatInput({ onSend, disabled, placeholder }: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) handleSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t border-gray-200 bg-white">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        rows={1}
        className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 min-h-[44px]"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="px-5 py-3 bg-indigo-600 text-white rounded-xl text-sm font-medium disabled:opacity-40 min-w-[44px] min-h-[44px] active:bg-indigo-700 transition-colors"
      >
        ↑
      </button>
    </form>
  );
}
