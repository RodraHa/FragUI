import { fontSize, fontWeight } from './typography';

/* ─── InputText Size Tokens ─────────────────────────────────────
 * Height and padding are fixed values so the control aligns with
 * Button at the same size. Gap controls spacing between the input
 * and its prefix / suffix / clear button.
 * ────────────────────────────────────────────────────────────── */
export const inputTextSize = {
  sm: {
    height: '2rem',
    padding: '0 0.625rem',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    gap: '0.375rem',
  },
  md: {
    height: '2.5rem',
    padding: '0 0.75rem',
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    gap: '0.5rem',
  },
  lg: {
    height: '3rem',
    padding: '0 1rem',
    fontSize: fontSize.lg,
    fontWeight: fontWeight.regular,
    gap: '0.625rem',
  },
} as const;

export type InputTextSizeKey = keyof typeof inputTextSize;
