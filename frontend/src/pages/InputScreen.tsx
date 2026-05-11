// frontend/src/pages/InputScreen.tsx
import { useState, useRef } from "react";
import { fetchScope, type ScopeResult } from "../services/scope_api.ts";

type Mode = "topic" | "notes" | "photo";
type MediaType = "image/jpeg" | "image/png" | "image/webp";

interface Props {
  onScope: (result: ScopeResult) => void;
  onBack: () => void;
}

export default function InputScreen({ onScope, onBack }: Props) {
  const [mode, setMode] = useState<Mode>("topic");
  const [topicText, setTopicText] = useState("");
  const [notesText, setNotesText] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMediaType, setImageMediaType] = useState<MediaType>("image/jpeg");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSubmit =
    (mode === "topic" && topicText.trim().length > 0) ||
    (mode === "notes" && notesText.trim().length > 0) ||
    (mode === "photo" && imageBase64 !== null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageMediaType(file.type as MediaType);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setImageBase64(result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!canSubmit || isLoading) return;
    setIsLoading(true);
    try {
      const payload =
        mode === "topic"
          ? { topic: topicText }
          : mode === "notes"
          ? { text: notesText }
          : { image_base64: imageBase64!, image_media_type: imageMediaType };
      const result = await fetchScope(payload);
      onScope(result);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs: { id: Mode; label: string; icon: string }[] = [
    { id: "topic", label: "Topic", icon: "edit" },
    { id: "notes", label: "Notes", icon: "content_paste" },
    { id: "photo", label: "Photo", icon: "photo_camera" },
  ];

  const ctaLabel =
    isLoading
      ? "Analyzing…"
      : mode === "topic"
      ? "Continue"
      : "Analyze";

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
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Step 1 of 3</p>
          <h1 className="text-xl font-bold text-on-surface mb-1">What are you studying today?</h1>
          <p className="text-sm text-on-surface-variant">Type a topic, paste your notes, or snap a photo.</p>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-1.5 bg-surface-container rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-lg text-xs font-medium transition-all min-h-[44px] ${
                mode === tab.id
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-on-surface-variant"
              }`}
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Input area */}
        <div className="flex-1">
          {mode === "topic" && (
            <div className={`flex items-center gap-2 px-4 py-3.5 rounded-2xl border-2 bg-surface-container-lowest transition-colors ${topicText ? "border-primary" : "border-outline-variant"}`}>
              <span className="material-symbols-outlined text-primary text-lg">edit</span>
              <input
                type="text"
                value={topicText}
                onChange={(e) => setTopicText(e.target.value)}
                placeholder="e.g. Photosynthesis, the French Revolution…"
                className="flex-1 bg-transparent text-sm text-on-surface outline-none placeholder:text-outline-variant font-sans"
              />
              {topicText && (
                <button onClick={() => setTopicText("")}>
                  <span className="material-symbols-outlined text-outline-variant text-lg">close</span>
                </button>
              )}
            </div>
          )}

          {mode === "notes" && (
            <div className={`relative rounded-2xl border-2 bg-surface-container-lowest transition-colors ${notesText ? "border-primary" : "border-outline-variant"}`}>
              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Paste your notes here…"
                rows={8}
                className="w-full bg-transparent text-sm text-on-surface outline-none placeholder:text-outline-variant font-sans p-4 resize-none"
              />
              {notesText && (
                <span className="absolute bottom-3 right-3 text-xs text-outline-variant">
                  {notesText.split(/\s+/).filter(Boolean).length} words
                </span>
              )}
            </div>
          )}

          {mode === "photo" && (
            <>
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`w-full flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-12 transition-colors ${imageBase64 ? "border-primary bg-surface-container-low" : "border-outline-variant bg-surface-container-lowest"}`}
              >
                <span className="material-symbols-outlined text-4xl text-outline-variant">add_a_photo</span>
                <span className="text-sm font-semibold text-on-surface-variant">
                  {imageBase64 ? "Photo selected — tap to change" : "Take a photo or upload"}
                </span>
                <span className="text-xs text-outline-variant">JPG, PNG or HEIC · max 10 MB</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />
            </>
          )}
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isLoading}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm text-on-primary bg-primary disabled:bg-surface-container disabled:text-outline-variant transition-colors min-h-[50px]"
          >
            {ctaLabel}
            {!isLoading && <span className="material-symbols-outlined text-lg">{mode === "topic" ? "arrow_forward" : "auto_awesome"}</span>}
          </button>
          <p className="text-center text-xs text-outline-variant">
            {mode === "topic"
              ? "Nemi will help narrow the focus"
              : mode === "notes"
              ? "Nemi will extract your topic automatically"
              : "Nemi reads your notes and finds the topic"}
          </p>
        </div>
      </div>
    </div>
  );
}