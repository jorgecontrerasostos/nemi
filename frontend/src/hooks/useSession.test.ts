import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import useSession from "./useSession.ts";
import { SESSION_STATES } from "../utils/session.ts";

describe("useSession", () => {
  it("initializes with idle_before_start and empty messages", () => {
    const { result } = renderHook(() => useSession());
    expect(result.current.state).toBe(SESSION_STATES.IDLE_BEFORE_START);
    expect(result.current.messages).toEqual([]);
    expect(result.current.language).toBe("en");
  });

  it("addMessage appends to messages", () => {
    const { result } = renderHook(() => useSession());
    act(() => result.current.addMessage("user", "Hello"));
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0]).toEqual({ role: "user", content: "Hello" });
  });

  it("toExplaining transitions state", () => {
    const { result } = renderHook(() => useSession());
    act(() => result.current.toExplaining());
    expect(result.current.state).toBe(SESSION_STATES.EXPLAINING);
  });

  it("resetSession clears messages and returns to idle_before_start", () => {
    const { result } = renderHook(() => useSession());
    act(() => {
      result.current.addMessage("user", "Hello");
      result.current.toExplaining();
    });
    act(() => result.current.resetSession());
    expect(result.current.state).toBe(SESSION_STATES.IDLE_BEFORE_START);
    expect(result.current.messages).toEqual([]);
  });
});
