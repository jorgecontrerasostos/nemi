import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import useVoiceInput from "./useVoiceInput.ts";

describe("useVoiceInput — no SpeechRecognition", () => {
  it("isSupported is false when SpeechRecognition is not in window", () => {
    const { result } = renderHook(() =>
      useVoiceInput({ lang: "en-US", onTranscript: vi.fn() })
    );
    expect(result.current.isSupported).toBe(false);
  });

  it("startListening is a no-op when not supported", () => {
    const { result } = renderHook(() =>
      useVoiceInput({ lang: "en-US", onTranscript: vi.fn() })
    );
    act(() => result.current.startListening());
    expect(result.current.isListening).toBe(false);
  });
});

describe("useVoiceInput — with mocked SpeechRecognition", () => {
  type MockRecognition = {
    start: ReturnType<typeof vi.fn>;
    stop: ReturnType<typeof vi.fn>;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: (() => void) | null;
    continuous: boolean;
    interimResults: boolean;
    lang: string;
  };

  let mockRecognition: MockRecognition;

  beforeEach(() => {
    mockRecognition = {
      start: vi.fn(),
      stop: vi.fn(),
      onresult: null,
      onerror: null,
      continuous: false,
      interimResults: false,
      lang: "",
    };
    function MockSpeechRecognition() {
      return mockRecognition;
    }
    Object.defineProperty(window, "SpeechRecognition", {
      value: MockSpeechRecognition,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "SpeechRecognition", {
      value: undefined,
      writable: true,
      configurable: true,
    });
    vi.useRealTimers();
  });

  it("isSupported is true when SpeechRecognition is available", () => {
    const { result } = renderHook(() =>
      useVoiceInput({ lang: "en-US", onTranscript: vi.fn() })
    );
    expect(result.current.isSupported).toBe(true);
  });

  it("startListening sets isListening to true and starts recognition", () => {
    const { result } = renderHook(() =>
      useVoiceInput({ lang: "en-US", onTranscript: vi.fn() })
    );
    act(() => result.current.startListening());
    expect(result.current.isListening).toBe(true);
    expect(mockRecognition.start).toHaveBeenCalledOnce();
  });

  it("stopListening sets isListening to false", () => {
    const { result } = renderHook(() =>
      useVoiceInput({ lang: "en-US", onTranscript: vi.fn() })
    );
    act(() => result.current.startListening());
    act(() => result.current.stopListening());
    expect(result.current.isListening).toBe(false);
    expect(mockRecognition.stop).toHaveBeenCalledOnce();
  });

  it("calls onTranscript after silence timeout", () => {
    vi.useFakeTimers();
    const onTranscript = vi.fn();
    const { result } = renderHook(() =>
      useVoiceInput({ lang: "en-US", silenceMs: 1000, onTranscript })
    );

    act(() => result.current.startListening());

    act(() => {
      mockRecognition.onresult?.({
        resultIndex: 0,
        results: Object.assign(
          [Object.assign([{ transcript: "Hello world" }], { isFinal: true })],
          { length: 1 }
        ),
      } as unknown as SpeechRecognitionEvent);
    });

    act(() => vi.advanceTimersByTime(1000));

    expect(onTranscript).toHaveBeenCalledWith("Hello world");
  });

  it("updates interimTranscript while speaking", () => {
    const { result } = renderHook(() =>
      useVoiceInput({ lang: "en-US", onTranscript: vi.fn() })
    );
    act(() => result.current.startListening());

    act(() => {
      mockRecognition.onresult?.({
        resultIndex: 0,
        results: Object.assign(
          [Object.assign([{ transcript: "gradient des" }], { isFinal: false })],
          { length: 1 }
        ),
      } as unknown as SpeechRecognitionEvent);
    });

    expect(result.current.interimTranscript).toBe("gradient des");
  });

  it("stops listening on recognition error", () => {
    const { result } = renderHook(() =>
      useVoiceInput({ lang: "en-US", onTranscript: vi.fn() })
    );
    act(() => result.current.startListening());
    expect(result.current.isListening).toBe(true);

    act(() => {
      mockRecognition.onerror?.();
    });

    expect(result.current.isListening).toBe(false);
    expect(mockRecognition.stop).toHaveBeenCalledOnce();
  });
});
