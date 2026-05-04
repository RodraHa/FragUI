import { fontSize, fontWeight } from './typography';

/* ─── InputText Size Tokens ─────────────────────────────────────
 * Fluid sizing via clamp() so the control scales proportionally
 * across viewports. Height, padding and gap grow gently to stay
 * visually balanced with Button and other form controls.
 * ────────────────────────────────────────────────────────────── */
export const inputTextSize = {
  sm: {
    height: 'clamp(1.75rem, 1.6rem + 0.75vw, 2.25rem)',
    padding: '0 clamp(0.5rem, 0.38rem + 0.6vw, 0.75rem)',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    gap: 'clamp(0.25rem, 0.18rem + 0.35vw, 0.5rem)',
  },
  md: {
    height: 'clamp(2.125rem, 1.95rem + 0.875vw, 2.75rem)',
    padding: '0 clamp(0.625rem, 0.5rem + 0.625vw, 1rem)',
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    gap: 'clamp(0.375rem, 0.28rem + 0.4vw, 0.625rem)',
  },
  lg: {
    height: 'clamp(2.5rem, 2.3rem + 1vw, 3.25rem)',
    padding: '0 clamp(0.75rem, 0.6rem + 0.75vw, 1.25rem)',
    fontSize: fontSize.lg,
    fontWeight: fontWeight.regular,
    gap: 'clamp(0.375rem, 0.28rem + 0.4vw, 0.625rem)',
  },
} as const;

export type InputTextSizeKey = keyof typeof inputTextSize;
