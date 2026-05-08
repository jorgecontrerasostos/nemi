import { useRef, useEffect, useCallback } from "react";
import { SESSION_STATES, type SessionState } from "../utils/session.ts";

const DEFAULT_IDLE_THRESHOLD_MS = 5 * 60 * 1000;
const DEFAULT_CHECK_INTERVAL_MS = 30 * 1000;

interface Options {
  sessionState: SessionState;
  onIdle: () => void;
  idleThresholdMs?: number;
  checkIntervalMs?: number;
}

export interface IdleDetectionHook {
  recordActivity: () => void;
}

export default function useIdleDetection({
  sessionState,
  onIdle,
  idleThresholdMs = DEFAULT_IDLE_THRESHOLD_MS,
  checkIntervalMs = DEFAULT_CHECK_INTERVAL_MS,
}: Options): IdleDetectionHook {
  const lastActivityRef = useRef(Date.now());

  const recordActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (sessionState !== SESSION_STATES.EXPLAINING) return;

    const check = setInterval(() => {
      if (Date.now() - lastActivityRef.current > idleThresholdMs) {
        clearInterval(check);
        onIdle();
      }
    }, checkIntervalMs);

    return () => clearInterval(check);
  }, [sessionState, onIdle, idleThresholdMs, checkIntervalMs]);

  return { recordActivity };
}
