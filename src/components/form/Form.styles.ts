import type { CSSProperties } from 'react';

/* ─── Form styles ───────────────────────────────────────────────
 * Minimal styles for the native `<form>` wrapper.
 * Form is a behavioral container — visual layout is delegated to
 * `FieldGroup` and its grid system.
 * ────────────────────────────────────────────────────────────── */

export function getFormStyle(): CSSProperties {
  return {
    margin: 0,
    padding: 0,
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    boxSizing: 'border-box',
    // Fill the parent and allow shrinking when nested in a flex/grid layout,
    // so the form never forces horizontal overflow on small screens.
    width: '100%',
    minWidth: 0,
  };
}
