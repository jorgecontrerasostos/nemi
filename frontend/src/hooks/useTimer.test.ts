import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import useTimer from "./useTimer.ts";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("useTimer", () => {
  it("starts at 0 seconds", () => {
    const { result } = renderHook(() => useTimer(false));
    expect(result.current.seconds).toBe(0);
  });

  it("increments every second when running", () => {
    const { result } = renderHook(() => useTimer(true));
    act(() => vi.advanceTimersByTime(3000));
    expect(result.current.seconds).toBe(3);
  });

  it("does not increment when not running", () => {
    const { result } = renderHook(() => useTimer(false));
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.seconds).toBe(0);
  });

  it("formats as MM:SS", () => {
    const { result } = renderHook(() => useTimer(true));
    act(() => vi.advanceTimersByTime(65000));
    expect(result.current.formatted).toBe("01:05");
  });

  it("reset returns seconds to 0", () => {
    const { result } = renderHook(() => useTimer(true));
    act(() => vi.advanceTimersByTime(10000));
    act(() => result.current.reset());
    expect(result.current.seconds).toBe(0);
  });
});
