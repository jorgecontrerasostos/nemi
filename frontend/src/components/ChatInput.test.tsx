import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ChatInput from "./ChatInput.tsx";

describe("ChatInput", () => {
  it("calls onSend with trimmed text on submit", async () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} disabled={false} placeholder="Type..." />);
    await userEvent.type(screen.getByPlaceholderText("Type..."), "  Hello  ");
    fireEvent.submit(screen.getByRole("button").closest("form")!);
    expect(onSend).toHaveBeenCalledWith("Hello");
  });

  it("does not call onSend when input is empty", () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} disabled={false} placeholder="Type..." />);
    fireEvent.submit(screen.getByRole("button").closest("form")!);
    expect(onSend).not.toHaveBeenCalled();
  });

  it("clears input after send", async () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} disabled={false} placeholder="Type..." />);
    const textarea = screen.getByPlaceholderText("Type...");
    await userEvent.type(textarea, "Hello");
    fireEvent.submit(screen.getByRole("button").closest("form")!);
    expect((textarea as HTMLTextAreaElement).value).toBe("");
  });

  it("disables textarea and button when disabled prop is true", () => {
    render(<ChatInput onSend={vi.fn()} disabled={true} placeholder="Type..." />);
    expect(screen.getByPlaceholderText("Type...")).toBeDisabled();
    expect(screen.getByRole("button", { name: /Send message/i })).toBeDisabled();
  });

  it("shows feedback hint text", () => {
    render(<ChatInput onSend={vi.fn()} disabled={false} placeholder="Type here" />);
    expect(screen.getByText(/say/i)).toBeInTheDocument();
    expect(screen.getByText(/feedback/i)).toBeInTheDocument();
    expect(screen.getByText(/anytime/i)).toBeInTheDocument();
  });

  describe("voice mode", () => {
    it("shows mic button when isSupported is true", () => {
      render(
        <ChatInput
          onSend={vi.fn()}
          disabled={false}
          placeholder="Type..."
          isSupported={true}
          onToggleVoice={vi.fn()}
        />
      );
      expect(
        screen.getByRole("button", { name: /Start voice input/i })
      ).toBeInTheDocument();
    });

    it("does not show mic button when isSupported is false", () => {
      render(<ChatInput onSend={vi.fn()} disabled={false} placeholder="Type..." />);
      expect(
        screen.queryByRole("button", { name: /voice/i })
      ).not.toBeInTheDocument();
    });

    it("calls onToggleVoice when mic button is clicked", async () => {
      const onToggleVoice = vi.fn();
      render(
        <ChatInput
          onSend={vi.fn()}
          disabled={false}
          placeholder="Type..."
          isSupported={true}
          onToggleVoice={onToggleVoice}
        />
      );
      await userEvent.click(
        screen.getByRole("button", { name: /Start voice input/i })
      );
      expect(onToggleVoice).toHaveBeenCalledOnce();
    });

    it("shows interim transcript in textarea while listening", () => {
      render(
        <ChatInput
          onSend={vi.fn()}
          disabled={false}
          placeholder="Type..."
          isSupported={true}
          isListening={true}
          interimTranscript="gradient des..."
          onToggleVoice={vi.fn()}
        />
      );
      expect(
        screen.getByDisplayValue("gradient des...")
      ).toBeInTheDocument();
    });

    it("hides send button while listening", () => {
      render(
        <ChatInput
          onSend={vi.fn()}
          disabled={false}
          placeholder="Type..."
          isSupported={true}
          isListening={true}
          onToggleVoice={vi.fn()}
        />
      );
      expect(screen.queryByRole("button", { name: /Send message/i })).not.toBeInTheDocument();
    });

    it("disables mic button while TTS is speaking", () => {
      render(
        <ChatInput
          onSend={vi.fn()}
          disabled={false}
          placeholder="Type..."
          isSupported={true}
          isSpeaking={true}
          onToggleVoice={vi.fn()}
        />
      );
      expect(
        screen.getByRole("button", { name: /Start voice input/i })
      ).toBeDisabled();
    });

    it("disables textarea while listening", () => {
      render(
        <ChatInput
          onSend={vi.fn()}
          disabled={false}
          placeholder="Type..."
          isSupported={true}
          isListening={true}
          onToggleVoice={vi.fn()}
        />
      );
      expect(screen.getByRole("textbox")).toBeDisabled();
    });
  });
});
