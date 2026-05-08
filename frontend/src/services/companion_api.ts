import type { Language } from "../i18n/index.ts";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

export async function sendMessage(
  messages: Message[],
  language: Language = "en"
): Promise<string> {
  const response = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, language }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json() as { message: string };
  return data.message;
}
