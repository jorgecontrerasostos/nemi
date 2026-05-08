import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import SessionSummary from "./SessionSummary.tsx";
import type { Translations } from "../i18n/index.ts";

const t: Translations = {
  appName: "Nemi",
  endSession: "End Session",
  newSession: "Start New Session",
  inputPlaceholder: "Type...",
  sendButton: "Send",
  sessionComplete: "Session Complete",
  thinking: "Thinking…",
  errorMessage: "Error",
  langToggle: "ES",
};

describe("SessionSummary", () => {
  it("renders the session complete heading", () => {
    render(<SessionSummary feedbackText="✅ Good" onNewSession={vi.fn()} t={t} />);
    expect(screen.getByText("Session Complete")).toBeInTheDocument();
  });

  it("renders feedback text", () => {
    render(<SessionSummary feedbackText="✅ Good job" onNewSession={vi.fn()} t={t} />);
    expect(screen.getByText("✅ Good job")).toBeInTheDocument();
  });

  it("calls onNewSession when button is clicked", async () => {
    const onNewSession = vi.fn();
    render(<SessionSummary feedbackText="" onNewSession={onNewSession} t={t} />);
    await userEvent.click(screen.getByText("Start New Session"));
    expect(onNewSession).toHaveBeenCalledTimes(1);
  });
});
