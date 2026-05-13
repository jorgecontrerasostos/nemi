import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SessionSummary from "./SessionSummary.tsx";
import en from "../i18n/en.ts";

const feedbackText = `✅ Correctly explained chlorophyll absorbing light.
⚠️ Confused the enzyme name for water splitting.
❌ Missed ATP synthase and the proton gradient.
📌 Review chemiosmosis and the Z-scheme.`;

describe("SessionSummary", () => {
  it("renders topic in hero card", () => {
    render(<SessionSummary feedbackText={feedbackText} topic="Light Reactions" duration="12:34" messageCount={18} onNewSession={vi.fn()} onStudyGaps={vi.fn()} t={en} />);
    expect(screen.getByText("Light Reactions")).toBeInTheDocument();
  });

  it("renders parsed feedback items", () => {
    render(<SessionSummary feedbackText={feedbackText} topic="Test" duration="05:00" messageCount={10} onNewSession={vi.fn()} onStudyGaps={vi.fn()} t={en} />);
    expect(screen.getByText(/correctly explained/i)).toBeInTheDocument();
    expect(screen.getByText(/confused the enzyme/i)).toBeInTheDocument();
    expect(screen.getByText(/missed ATP synthase/i)).toBeInTheDocument();
    expect(screen.getByText(/review chemiosmosis/i)).toBeInTheDocument();
  });

  it("calls onNewSession when primary button clicked", () => {
    const onNewSession = vi.fn();
    render(<SessionSummary feedbackText="" topic="Test" duration="00:00" messageCount={0} onNewSession={onNewSession} onStudyGaps={vi.fn()} t={en} />);
    fireEvent.click(screen.getByRole("button", { name: /study a new topic/i }));
    expect(onNewSession).toHaveBeenCalled();
  });

  it("calls onStudyGaps with gap context when secondary button clicked", () => {
    const onStudyGaps = vi.fn();
    render(<SessionSummary feedbackText={feedbackText} topic="Test" duration="00:00" messageCount={0} onNewSession={vi.fn()} onStudyGaps={onStudyGaps} t={en} />);
    fireEvent.click(screen.getByRole("button", { name: /study the gaps/i }));
    expect(onStudyGaps).toHaveBeenCalledWith(expect.stringContaining("Confused the enzyme name"));
  });
});