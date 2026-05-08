import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import useIdleDetection from "./useIdleDetection.ts";
import { SESSION_STATES } from "../utils/session.ts";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("useIdleDetection", () => {
  it("does not call onIdle when not in explaining state", () => {
    const onIdle = vi.fn();
    renderHook(() =>
      useIdleDetection({ sessionState: SESSION_STATES.SCOPING, onIdle, idleThresholdMs: 1000, checkIntervalMs: 500 })
    );
    act(() => vi.advanceTimersByTime(5000));
    expect(onIdle).not.toHaveBeenCalled();
  });

  it("calls onIdle after threshold elapses in explaining state", () => {
    const onIdle = vi.fn();
    renderHook(() =>
      useIdleDetection({ sessionState: SESSION_STATES.EXPLAINING, onIdle, idleThresholdMs: 3000, checkIntervalMs: 1000 })
    );
    act(() => vi.advanceTimersByTime(5000));
    expect(onIdle).toHaveBeenCalledTimes(1);
  });

  it("recordActivity resets the idle clock", () => {
    const onIdle = vi.fn();
    const { result } = renderHook(() =>
      useIdleDetection({ sessionState: SESSION_STATES.EXPLAINING, onIdle, idleThresholdMs: 3000, checkIntervalMs: 1000 })
    );
    act(() => vi.advanceTimersByTime(2000));
    act(() => result.current.recordActivity());
    act(() => vi.advanceTimersByTime(2000));
    expect(onIdle).not.toHaveBeenCalled();
  });
});
