import type { Translations } from "../i18n/index.ts";

interface Props {
  feedbackText: string;
  onNewSession: () => void;
  t: Translations;
}

export default function SessionSummary({ feedbackText, onNewSession, t }: Props) {
  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 gap-6 bg-gray-50">
      <h2 className="text-xl font-semibold text-gray-800">{t.sessionComplete}</h2>
      <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-5 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap shadow-sm">
        {feedbackText || "—"}
      </div>
      <button
        onClick={onNewSession}
        className="w-full py-4 bg-indigo-600 text-white rounded-xl font-medium text-sm min-h-[44px] active:bg-indigo-700 transition-colors"
      >
        {t.newSession}
      </button>
    </div>
  );
}
