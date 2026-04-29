import { inputTextSize } from './inputText';

/* ─── Select Size Tokens ───────────────────────────────────────
 * The trigger (closed state) reuses InputText sizing 1:1 so that
 * Select and InputText align perfectly in mixed form layouts.
 *
 * Panel-specific tokens live here because they don't belong in
 * the InputText token file.
 * ────────────────────────────────────────────────────────────── */

/** Trigger dimensions — delegates entirely to InputText tokens */
export const selectTriggerSize = inputTextSize;

/** Panel (dropdown) tokens per size */
export const selectPanelSize = {
  sm: {
    maxHeight: '12rem',
    optionPadding:
      'clamp(0.25rem, 0.18rem + 0.35vw, 0.5rem) clamp(0.5rem, 0.38rem + 0.6vw, 0.75rem)',
    groupHeaderPadding:
      'clamp(0.375rem, 0.28rem + 0.35vw, 0.5rem) clamp(0.5rem, 0.38rem + 0.6vw, 0.75rem)',
    searchPadding:
      'clamp(0.375rem, 0.28rem + 0.35vw, 0.5rem) clamp(0.5rem, 0.38rem + 0.6vw, 0.75rem)',
  },
  md: {
    maxHeight: '16rem',
    optionPadding:
      'clamp(0.375rem, 0.28rem + 0.4vw, 0.625rem) clamp(0.625rem, 0.5rem + 0.625vw, 1rem)',
    groupHeaderPadding:
      'clamp(0.5rem, 0.38rem + 0.4vw, 0.625rem) clamp(0.625rem, 0.5rem + 0.625vw, 1rem)',
    searchPadding:
      'clamp(0.5rem, 0.38rem + 0.4vw, 0.625rem) clamp(0.625rem, 0.5rem + 0.625vw, 1rem)',
  },
  lg: {
    maxHeight: '20rem',
    optionPadding:
      'clamp(0.5rem, 0.38rem + 0.5vw, 0.75rem) clamp(0.75rem, 0.6rem + 0.75vw, 1.25rem)',
    groupHeaderPadding:
      'clamp(0.625rem, 0.5rem + 0.5vw, 0.75rem) clamp(0.75rem, 0.6rem + 0.75vw, 1.25rem)',
    searchPadding:
      'clamp(0.625rem, 0.5rem + 0.5vw, 0.75rem) clamp(0.75rem, 0.6rem + 0.75vw, 1.25rem)',
  },
} as const;

export type SelectSizeKey = keyof typeof selectTriggerSize;
