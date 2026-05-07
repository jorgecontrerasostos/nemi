export const SESSION_STATES = {
  IDLE_BEFORE_START: "idle_before_start",
  SCOPING: "scoping",
  EXPLAINING: "explaining",
  IDLE_MID_SESSION: "idle_mid_session",
  FEEDBACK: "feedback",
  COMPLETED: "completed",
} as const;

export type SessionState = (typeof SESSION_STATES)[keyof typeof SESSION_STATES];

export function isFeedbackTrigger(text: string): boolean {
  return /\bfeedback\b/i.test(text);
}

export function formatSeconds(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
