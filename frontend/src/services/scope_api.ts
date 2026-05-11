const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

export interface Subtopic {
  title: string;
  description: string;
  icon: string;
}

export interface ScopeResult {
  topic: string;
  subtopics: Subtopic[];
}

type MediaType = "image/jpeg" | "image/png" | "image/webp";

export async function fetchScope(payload: {
  topic?: string;
  text?: string;
  image_base64?: string;
  image_media_type?: MediaType;
}): Promise<ScopeResult> {
  const response = await fetch(`${API_BASE}/scope`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Scope request failed");
  return response.json() as Promise<ScopeResult>;
}