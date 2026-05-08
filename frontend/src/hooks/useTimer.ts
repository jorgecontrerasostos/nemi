import { useState, useEffect, useCallback } from "react";
import { formatSeconds } from "../utils/session.ts";

export interface TimerHook {
  seconds: number;
  formatted: string;
  reset: () => void;
}

export default function useTimer(isRunning: boolean): TimerHook {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const reset = useCallback(() => setSeconds(0), []);

  return { seconds, formatted: formatSeconds(seconds), reset };
}
