// frontend/src/pages/SubtopicPicker.tsx
import { useState } from "react";
import type { Subtopic } from "../services/scope_api.ts";

interface Props {
  topic: string;
  subtopics: Subtopic[];
  onStart: (focusTopic: string) => void;
  onBack: () => void;
}

export default function SubtopicPicker({ topic, subtopics, onStart, onBack }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState("");

  const activeFocus = customInput.trim() || selected;

  const handleCardClick = (title: string) => {
    setSelected(selected === title ? null : title);
    setCustomInput("");
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomInput(e.target.value);
    setSelected(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 border-b border-outline-variant bg-surface-container-lowest">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-on-surface-variant min-h-[44px] px-2">
          <span className="material-symbols-outlined text-lg">arrow_back_ios</span>
          Back
        </button>
        <span className="font-bold text-on-surface text-base">Nemi</span>
        <div className="w-16" />
      </header>

      <div className="flex-1 flex flex-col px-5 py-6 gap-5 max-w-lg mx-auto w-full">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Step 2 of 3</p>
          <h1 className="text-xl font-bold text-on-surface mb-1">Which part of {topic} should we focus on?</h1>
          <p className="text-sm text-on-surface-variant">Pick the area you want to explain. One at a time.</p>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {subtopics.map((sub) => (
            <button
              key={sub.title}
              onClick={() => handleCardClick(sub.title)}
              className={`flex flex-col items-start gap-2 p-3.5 rounded-2xl border-2 text-left transition-all ${
                selected === sub.title
                  ? "border-primary bg-[#e6f4f5]"
                  : "border-outline-variant bg-surface-container-lowest"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selected === sub.title ? "bg-primary-fixed" : "bg-surface-container-low"}`}>
                <span className={`material-symbols-outlined text-lg ${selected === sub.title ? "text-on-primary-fixed" : "text-on-surface-variant"}`}>
                  {sub.icon}
                </span>
              </div>
              <span className={`text-sm font-semibold leading-snug ${selected === sub.title ? "text-primary" : "text-on-surface"}`}>
                {sub.title}
              </span>
              <span className="text-xs text-on-surface-variant leading-snug">{sub.description}</span>
            </button>
          ))}
        </div>

        {/* Custom input */}
        <div className="rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container-lowest p-3.5 flex flex-col gap-2">
          <span className="text-xs font-semibold text-on-surface-variant">Something else?</span>
          <div className="flex items-center gap-2 bg-surface-container-low rounded-xl px-3 py-2">
            <span className="material-symbols-outlined text-base text-outline-variant">edit</span>
            <input
              type="text"
              value={customInput}
              onChange={handleCustomChange}
              placeholder="Type a specific subtopic…"
              className="flex-1 bg-transparent text-sm text-on-surface outline-none placeholder:text-outline-variant font-sans"
            />
          </div>
        </div>

        {/* Escape hatch */}
        <button
          onClick={() => onStart(topic)}
          className="text-sm text-on-surface-variant underline underline-offset-4 decoration-outline-variant text-center flex items-center justify-center gap-1 min-h-[44px]"
        >
          Study the full topic instead
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>

        {/* CTA */}
        <button
          onClick={() => activeFocus && onStart(activeFocus)}
          disabled={!activeFocus}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm text-on-primary bg-primary disabled:bg-surface-container disabled:text-outline-variant transition-colors min-h-[50px]"
        >
          Start Session
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}