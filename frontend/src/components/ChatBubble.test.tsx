import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ChatBubble from "./ChatBubble.tsx";

describe("ChatBubble", () => {
  it("renders assistant message with avatar", () => {
    render(<ChatBubble role="assistant" content="Hello!" />);
    expect(screen.getByText("Hello!")).toBeInTheDocument();
    expect(screen.getByText("N")).toBeInTheDocument();
  });

  it("renders user message without avatar", () => {
    render(<ChatBubble role="user" content="Hi there" />);
    expect(screen.getByText("Hi there")).toBeInTheDocument();
    expect(screen.queryByText("N")).not.toBeInTheDocument();
  });

  it("user bubble aligns right", () => {
    const { container } = render(<ChatBubble role="user" content="Test" />);
    expect(container.firstChild).toHaveClass("justify-end");
  });

  it("assistant bubble aligns left", () => {
    const { container } = render(<ChatBubble role="assistant" content="Test" />);
    expect(container.firstChild).toHaveClass("justify-start");
  });
});
