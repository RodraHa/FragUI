import { useEffect } from 'react';

export function useKeyframes(
  id: string,
  css: string,
  enabled: boolean = true,
): void {
  useEffect(() => {
    if (!enabled) return;
    if (typeof document === 'undefined') return;
    if (document.getElementById(id)) return;

    const styleEl = document.createElement('style');
    styleEl.id = id;
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
  }, [id, css, enabled]);
}
