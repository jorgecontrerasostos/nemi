import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ChatBubble from "./ChatBubble.tsx";

describe("ChatBubble", () => {
  it("renders message content", () => {
    render(<ChatBubble role="user" content="Hello world" />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("aligns user messages to the right", () => {
    const { container } = render(<ChatBubble role="user" content="Hi" />);
    expect(container.firstChild).toHaveClass("justify-end");
  });

  it("aligns assistant messages to the left", () => {
    const { container } = render(<ChatBubble role="assistant" content="Hello" />);
    expect(container.firstChild).toHaveClass("justify-start");
  });
});
