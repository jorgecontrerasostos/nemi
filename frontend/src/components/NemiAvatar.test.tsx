import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import NemiAvatar from "./NemiAvatar.tsx";

describe("NemiAvatar", () => {
  it("renders the axolotl image", () => {
    render(<NemiAvatar />);
    const img = screen.getByRole("img", { name: /nemi/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/nemi-avatar.png");
  });

  it("falls back to N circle on image error", () => {
    render(<NemiAvatar />);
    const img = screen.getByRole("img");
    fireEvent.error(img);
    expect(screen.getByText("N")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("applies sm size classes", () => {
    const { container } = render(<NemiAvatar size="sm" />);
    expect(container.firstChild).toHaveClass("w-7", "h-7");
  });

  it("applies md size classes", () => {
    const { container } = render(<NemiAvatar size="md" />);
    expect(container.firstChild).toHaveClass("w-10", "h-10");
  });

  it("applies lg size classes", () => {
    const { container } = render(<NemiAvatar size="lg" />);
    expect(container.firstChild).toHaveClass("w-20", "h-20");
  });

  it("accepts mood prop without error", () => {
    expect(() => render(<NemiAvatar mood="thinking" />)).not.toThrow();
  });
});
