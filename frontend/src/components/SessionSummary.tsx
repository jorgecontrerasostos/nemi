import type { Translations } from "../i18n/index.ts";

interface FeedbackItem {
  category: "strong" | "shaky" | "missed" | "review";
  text: string;
}

function parseFeedback(raw: string): FeedbackItem[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line): FeedbackItem[] => {
      if (line.startsWith("✅")) return [{ category: "strong", text: line.slice(1).trim() }];
      if (line.startsWith("⚠️")) return [{ category: "shaky", text: line.slice(2).trim() }];
      if (line.startsWith("❌")) return [{ category: "missed", text: line.slice(1).trim() }];
      if (line.startsWith("📌")) return [{ category: "review", text: line.slice(2).trim() }];
      return [];
    });
}

const borderColor: Record<FeedbackItem["category"], string> = {
  strong: "border-l-green-600",
  shaky: "border-l-amber-500",
  missed: "border-l-red-600",
  review: "border-l-primary",
};

const emoji: Record<FeedbackItem["category"], string> = {
  strong: "✅",
  shaky: "⚠️",
  missed: "❌",
  review: "📌",
};

interface Props {
  feedbackText: string;
  topic?: string;
  duration?: string;
  messageCount?: number;
  onNewSession: () => void;
  onStudyGaps?: (gapsContext: string) => void;
  t: Translations;
}

export default function SessionSummary({ feedbackText, topic, duration, messageCount, onNewSession, onStudyGaps, t }: Props) {
  const items = parseFeedback(feedbackText);
  const counts = {
    strong: items.filter((i) => i.category === "strong").length,
    shaky: items.filter((i) => i.category === "shaky").length,
    missed: items.filter((i) => i.category === "missed").length,
  };

  const gapsContext = items
    .filter((i) => i.category === "missed" || i.category === "shaky")
    .map((i) => i.text)
    .join(". ");

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant bg-surface-container-lowest">
        <span className="font-bold text-on-surface text-base">Nemi</span>
        {duration && (
          <span className="text-xs text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">timer</span>
            {duration}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-4 p-5">
        {/* Hero */}
        <div className="bg-primary rounded-2xl p-5 flex flex-col gap-1.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-on-primary opacity-70">{t.sessionComplete}</p>
          <p className="text-lg font-bold text-on-primary">{topic ?? "Study Session"}</p>
          <div className="flex gap-4 mt-1">
            {duration && (
              <span className="flex items-center gap-1 text-xs text-on-primary opacity-75">
                <span className="material-symbols-outlined text-sm">timer</span>
                {duration}
              </span>
            )}
            {messageCount !== undefined && (
              <span className="flex items-center gap-1 text-xs text-on-primary opacity-75">
                <span className="material-symbols-outlined text-sm">forum</span>
                {messageCount} exchanges
              </span>
            )}
          </div>
        </div>

        {/* Score row */}
        {items.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {[
              { emoji: "✅", count: counts.strong, label: "Strong" },
              { emoji: "⚠️", count: counts.shaky, label: "Needs work" },
              { emoji: "❌", count: counts.missed, label: "Gap found" },
            ].map(({ emoji: e, count, label }) => (
              <div key={label} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-3 flex flex-col items-center gap-1">
                <span className="text-xl">{e}</span>
                <span className="text-lg font-bold text-on-surface">{count}</span>
                <span className="text-xs text-on-surface-variant text-center leading-tight">{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Feedback items */}
        {items.length > 0 ? (
          <div className="flex flex-col gap-2">
            {items.map((item, i) => (
              <div
                key={i}
                className={`flex gap-2.5 bg-surface-container-lowest border border-outline-variant border-l-4 ${borderColor[item.category]} rounded-xl p-3 items-start`}
              >
                <span className="text-sm flex-shrink-0 mt-0.5">{emoji[item.category]}</span>
                <span className="text-sm text-on-surface leading-relaxed">{item.text}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 text-sm text-on-surface-variant whitespace-pre-wrap leading-relaxed">
            {feedbackText || "—"}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={onNewSession}
            className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-on-primary rounded-2xl font-semibold text-sm min-h-[50px]"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>
            Study a new topic
          </button>
          {gapsContext && onStudyGaps && (
            <button
              onClick={() => onStudyGaps(gapsContext)}
              className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-outline-variant text-on-surface-variant rounded-2xl font-semibold text-sm min-h-[46px]"
            >
              <span className="material-symbols-outlined text-base">replay</span>
              Study the gaps
            </button>
          )}
        </div>
      </div>
    </div>
  );
}