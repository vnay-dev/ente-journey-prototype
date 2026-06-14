import { useEffect, useRef, useState, type UIEvent } from "react";

type Options = {
  /** Minimum scroll distance (px) before triggering. */
  threshold?: number;
  /** Optional delay after threshold is met (ms). */
  delayMs?: number;
};

export function useScrollTriggeredOnce(options: Options = {}) {
  const { threshold = 72, delayMs = 400 } = options;
  const [triggered, setTriggered] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function onScroll(event: UIEvent<HTMLElement>) {
    if (triggered) {
      return;
    }

    const scrollTop = event.currentTarget.scrollTop;
    if (scrollTop < threshold) {
      return;
    }

    if (timeoutRef.current !== null) {
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      setTriggered(true);
      timeoutRef.current = null;
    }, delayMs);
  }

  function reset() {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setTriggered(false);
  }

  return { triggered, onScroll, reset };
}
