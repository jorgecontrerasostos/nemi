// frontend/src/pages/SubtopicPicker.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SubtopicPicker from "./SubtopicPicker.tsx";
import type { Subtopic } from "../services/scope_api.ts";

const subtopics: Subtopic[] = [
  { title: "Light Reactions", description: "ATP production", icon: "wb_sunny" },
  { title: "Calvin Cycle", description: "CO2 fixation", icon: "cycle" },
  { title: "Chloroplast", description: "Cell structure", icon: "biotech" },
  { title: "Efficiency", description: "Rate factors", icon: "speed" },
];

describe("SubtopicPicker", () => {
  it("renders all subtopic cards", () => {
    render(<SubtopicPicker topic="Photosynthesis" subtopics={subtopics} onStart={vi.fn()} onBack={vi.fn()} />);
    expect(screen.getByText("Light Reactions")).toBeInTheDocument();
    expect(screen.getByText("Calvin Cycle")).toBeInTheDocument();
  });

  it("CTA is disabled when nothing is selected", () => {
    render(<SubtopicPicker topic="Photosynthesis" subtopics={subtopics} onStart={vi.fn()} onBack={vi.fn()} />);
    expect(screen.getByRole("button", { name: /start session/i })).toBeDisabled();
  });

  it("CTA is enabled after selecting a card", () => {
    render(<SubtopicPicker topic="Photosynthesis" subtopics={subtopics} onStart={vi.fn()} onBack={vi.fn()} />);
    fireEvent.click(screen.getByText("Light Reactions"));
    expect(screen.getByRole("button", { name: /start session/i })).not.toBeDisabled();
  });

  it("calls onStart with subtopic title when CTA is clicked", () => {
    const onStart = vi.fn();
    render(<SubtopicPicker topic="Photosynthesis" subtopics={subtopics} onStart={onStart} onBack={vi.fn()} />);
    fireEvent.click(screen.getByText("Light Reactions"));
    fireEvent.click(screen.getByRole("button", { name: /start session/i }));
    expect(onStart).toHaveBeenCalledWith("Light Reactions");
  });

  it("calls onStart with full topic when escape hatch is clicked", () => {
    const onStart = vi.fn();
    render(<SubtopicPicker topic="Photosynthesis" subtopics={subtopics} onStart={onStart} onBack={vi.fn()} />);
    fireEvent.click(screen.getByText(/study the full topic/i));
    expect(onStart).toHaveBeenCalledWith("Photosynthesis");
  });

  it("enables CTA when custom input has text", () => {
    render(<SubtopicPicker topic="Photosynthesis" subtopics={subtopics} onStart={vi.fn()} onBack={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText(/type a specific subtopic/i), {
      target: { value: "Photorespiration" },
    });
    expect(screen.getByRole("button", { name: /start session/i })).not.toBeDisabled();
  });
});