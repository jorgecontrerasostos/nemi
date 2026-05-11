// frontend/src/pages/InputScreen.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import InputScreen from "./InputScreen.tsx";
import * as scopeApi from "../services/scope_api.ts";

const mockScopeResult = {
  topic: "Photosynthesis",
  subtopics: [{ title: "Light Reactions", description: "ATP production", icon: "wb_sunny" }],
};

describe("InputScreen", () => {
  it("renders topic mode by default", () => {
    render(<InputScreen onScope={vi.fn()} onBack={vi.fn()} />);
    expect(screen.getByPlaceholderText("e.g. Photosynthesis, the French Revolution…")).toBeInTheDocument();
  });

  it("CTA is disabled when topic input is empty", () => {
    render(<InputScreen onScope={vi.fn()} onBack={vi.fn()} />);
    expect(screen.getByRole("button", { name: /continue/i })).toBeDisabled();
  });

  it("CTA is enabled when topic input has text", () => {
    render(<InputScreen onScope={vi.fn()} onBack={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText("e.g. Photosynthesis, the French Revolution…"), {
      target: { value: "Photosynthesis" },
    });
    expect(screen.getByRole("button", { name: /continue/i })).not.toBeDisabled();
  });

  it("switches to notes mode when Notes tab is clicked", () => {
    render(<InputScreen onScope={vi.fn()} onBack={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /notes/i }));
    expect(screen.getByPlaceholderText(/paste your notes/i)).toBeInTheDocument();
  });

  it("calls onScope with result after submitting topic", async () => {
    const onScope = vi.fn();
    vi.spyOn(scopeApi, "fetchScope").mockResolvedValue(mockScopeResult);

    render(<InputScreen onScope={onScope} onBack={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText("e.g. Photosynthesis, the French Revolution…"), {
      target: { value: "Photosynthesis" },
    });
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => expect(onScope).toHaveBeenCalledWith(mockScopeResult));
  });
});