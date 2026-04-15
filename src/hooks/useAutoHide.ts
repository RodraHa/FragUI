import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseAutoHideOptions {
  duration: number | undefined;
  enabled: boolean;
  onHide: () => void;
}

export interface UseAutoHideResult {
  pause: () => void;
  resume: () => void;
  paused: boolean;
}

/**
 * Timer hook that supports pause / resume semantics.
 * When `enabled` is true and `duration` is a positive number, it fires
 * `onHide` after the (remaining) duration elapses. While `paused`, the
 * timer halts and the remaining time is preserved.
 */
export function useAutoHide({
  duration,
  enabled,
  onHide,
}: UseAutoHideOptions): UseAutoHideResult {
  const [paused, setPaused] = useState(false);
  const remainingRef = useRef<number>(duration ?? 0);
  const onHideRef = useRef(onHide);

  useEffect(() => {
    onHideRef.current = onHide;
  }, [onHide]);

  useEffect(() => {
    remainingRef.current = duration ?? 0;
  }, [duration]);

  useEffect(() => {
    if (!enabled || !duration || paused) return;

    const startedAt = Date.now();
    const timeoutMs = remainingRef.current;
    const id = setTimeout(() => {
      remainingRef.current = 0;
      onHideRef.current();
    }, timeoutMs);

    return () => {
      const elapsed = Date.now() - startedAt;
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
      clearTimeout(id);
    };
  }, [enabled, duration, paused]);

  const pause = useCallback(() => setPaused(true), []);
  const resume = useCallback(() => setPaused(false), []);

  return { pause, resume, paused };
}
