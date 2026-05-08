import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import SubtopicPicker from "./SubtopicPicker.tsx";

describe("SubtopicPicker", () => {
  it("renders all subtopics as buttons", () => {
    render(<SubtopicPicker subtopics={["Gradient Descent", "Backprop"]} onSelect={vi.fn()} />);
    expect(screen.getByText("Gradient Descent")).toBeInTheDocument();
    expect(screen.getByText("Backprop")).toBeInTheDocument();
  });

  it("calls onSelect with the clicked subtopic", async () => {
    const onSelect = vi.fn();
    render(<SubtopicPicker subtopics={["Gradient Descent", "Backprop"]} onSelect={onSelect} />);
    await userEvent.click(screen.getByText("Gradient Descent"));
    expect(onSelect).toHaveBeenCalledWith("Gradient Descent");
  });
});
