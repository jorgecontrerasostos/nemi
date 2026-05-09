import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useVoiceSynthesis from "./useVoiceSynthesis.ts";

type MockAudio = {
  play: ReturnType<typeof vi.fn>;
  pause: ReturnType<typeof vi.fn>;
  onended: ((this: HTMLAudioElement, ev: Event) => void) | null;
  onerror: ((this: HTMLAudioElement, ev: Event) => void) | null;
};

let mockAudio: MockAudio;

beforeEach(() => {
  mockAudio = {
    play: vi.fn().mockResolvedValue(undefined),
    pause: vi.fn(),
    onended: null,
    onerror: null,
  };

  function MockAudio() { return mockAudio; }
  globalThis.Audio = MockAudio as unknown as typeof Audio;
  URL.createObjectURL = vi.fn(() => "blob:fake-url");
  URL.revokeObjectURL = vi.fn();

  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    blob: () => Promise.resolve(new Blob(["audio"], { type: "audio/mpeg" })),
  });
});

describe("useVoiceSynthesis", () => {
  it("isSpeaking starts false", () => {
    const { result } = renderHook(() => useVoiceSynthesis());
    expect(result.current.isSpeaking).toBe(false);
  });

  it("speak sets isSpeaking to true during playback", async () => {
    const { result } = renderHook(() => useVoiceSynthesis());

    // audio.play() never triggers onended — simulates ongoing playback
    mockAudio.play = vi.fn().mockImplementation(() => Promise.resolve());

    act(() => {
      void result.current.speak("Hola");
    });

    // Flush: fetch → blob → URL.createObjectURL → new Audio → setIsSpeaking(true)
    await act(async () => {
      await Promise.resolve(); // fetch
      await Promise.resolve(); // blob
      await Promise.resolve(); // remaining microtasks
    });

    expect(result.current.isSpeaking).toBe(true);
  });

  it("isSpeaking returns false after playback ends", async () => {
    const { result } = renderHook(() => useVoiceSynthesis());

    mockAudio.play = vi.fn().mockImplementation(async () => {
      // Simulate audio ending immediately
      mockAudio.onended?.call({} as HTMLAudioElement, new Event("ended"));
    });

    await act(async () => {
      await result.current.speak("Hello");
    });

    expect(result.current.isSpeaking).toBe(false);
  });

  it("resolves silently when fetch fails", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() => useVoiceSynthesis());

    await act(async () => {
      await result.current.speak("Hello");
    });

    expect(result.current.isSpeaking).toBe(false);
  });

  it("resolves silently when response is not ok", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false });
    const { result } = renderHook(() => useVoiceSynthesis());

    await act(async () => {
      await result.current.speak("Hello");
    });

    expect(result.current.isSpeaking).toBe(false);
  });

  it("stop pauses audio and sets isSpeaking to false", async () => {
    const { result } = renderHook(() => useVoiceSynthesis());

    act(() => { void result.current.speak("Hello"); });
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    act(() => result.current.stop());

    expect(mockAudio.pause).toHaveBeenCalled();
    expect(result.current.isSpeaking).toBe(false);
  });
});
