import type { Message } from "../services/companion_api.ts";
import NemiAvatar from "./NemiAvatar.tsx";

interface Props {
  role: Message["role"];
  content: string;
}

export default function ChatBubble({ role, content }: Props) {
  const isUser = role === "user";
  return (
    <div className={`flex items-end gap-2 mb-3 animate-bubble-in ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <NemiAvatar size="sm" />}
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-primary text-on-primary rounded-br-sm"
            : "bg-surface-container-lowest border border-outline-variant text-on-surface rounded-bl-sm"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
