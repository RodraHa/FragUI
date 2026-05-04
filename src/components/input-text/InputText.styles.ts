import type { CSSProperties } from 'react';
import { colors } from '../../theme/tokens/colors';
import { inputTextSize } from '../../theme/tokens/inputText';
import { fontFamily } from '../../theme/tokens/typography';
import type { Size, FormStatus } from '../../types';

/* ─── Status → border / focus-ring colors ──────────────────────
 * Mapped directly to palette tokens (no preset indirection needed
 * — InputText uses a fixed color set regardless of theme color).
 * ────────────────────────────────────────────────────────────── */
const statusBorder: Record<FormStatus, string> = {
  idle: colors.neutral[200],
  success: colors.green[500],
  warning: colors.orange[500],
  error: colors.red[500],
};

const statusFocusRing: Record<FormStatus, string> = {
  idle: colors.neutral[500],
  success: colors.green[500],
  warning: colors.orange[500],
  error: colors.red[500],
};

/* ─── Container (wrapper div) ───────────────────────────────────
 * Owns the border, background, border-radius, and focus ring.
 * The native <input> inside has no border of its own.
 *
 * Width behaviour:
 *   – width prop    → explicit CSS width (overrides fullWidth)
 *   – fullWidth     → 100 % of parent (default for form inputs)
 *   – !fullWidth    → inline-flex + auto width with a sensible min
 * ────────────────────────────────────────────────────────────── */

/** Minimum width per size so the input never collapses when not fullWidth */
const autoMinWidth: Record<Size, string> = {
  sm: '8rem',
  md: '12rem',
  lg: '16rem',
};

export function getContainerStyle(
  size: Size,
  status: FormStatus,
  disabled: boolean,
  readOnly: boolean,
  isFocused: boolean,
  fullWidth: boolean = true,
  width?: string | number,
): CSSProperties {
  const tokens = inputTextSize[size];
  const borderColor = disabled
    ? colors.neutral[200]
    : isFocused
      ? statusFocusRing[status]
      : statusBorder[status];

  // Resolve width: explicit > fullWidth > auto
  const resolvedWidth: string | number | undefined =
    width !== undefined ? width : fullWidth ? '100%' : undefined;

  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.gap,
    padding: tokens.padding,
    minHeight: tokens.height,
    height: tokens.height,
    fontSize: tokens.fontSize,
    fontWeight: tokens.fontWeight,
    fontFamily: fontFamily.satoshi,
    boxSizing: 'border-box',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor,
    borderRadius: 0,
    backgroundColor: disabled
      ? colors.neutral[100]
      : readOnly
        ? colors.neutral[100]
        : colors.white,
    outline: isFocused ? `2px solid ${statusFocusRing[status]}` : 'none',
    outlineOffset: isFocused ? '2px' : '0',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'text',
    transition:
      'border-color 0.15s ease, outline 0.15s ease, background-color 0.15s ease, opacity 0.15s ease',
    position: 'relative',
    width: resolvedWidth,
    ...(resolvedWidth === undefined ? { minWidth: autoMinWidth[size] } : {}),
  };
}

/* ─── Native <input> ────────────────────────────────────────────
 * Resets all visual styling — the container owns appearance.
 * flex: 1 so it expands to fill remaining space next to affixes.
 * ────────────────────────────────────────────────────────────── */
export const getInputStyle = (): CSSProperties => ({
  flex: 1,
  minWidth: 0,
  border: 'none',
  outline: 'none',
  background: 'transparent',
  color: 'inherit',
  fontSize: 'inherit',
  fontWeight: 'inherit',
  fontFamily: 'inherit',
  lineHeight: 'normal',
  padding: 0,
  margin: 0,
  cursor: 'inherit',
});

/* ─── Prefix / Suffix wrapper ───────────────────────────────────
 * Decorative content that flanks the input. Always aria-hidden.
 * ────────────────────────────────────────────────────────────── */
export const affixStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  flexShrink: 0,
  color: colors.neutral[400],
};

/* ─── Clear button ──────────────────────────────────────────────
 * Appears inside the container to the right of the input.
 * ────────────────────────────────────────────────────────────── */
export const clearButtonStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  border: 'none',
  background: 'none',
  padding: 0,
  cursor: 'pointer',
  color: colors.neutral[400],
  lineHeight: 1,
  fontSize: 'inherit',
  fontFamily: 'inherit',
};

/* ─── Character counter ─────────────────────────────────────────
 * Rendered below the container (outside it). Turns red when the
 * limit is exceeded.
 * ────────────────────────────────────────────────────────────── */
export function getCounterStyle(isOverLimit: boolean): CSSProperties {
  return {
    display: 'block',
    marginTop: 'clamp(0.125rem, 0.08rem + 0.2vw, 0.25rem)',
    fontSize: 'clamp(0.6875rem, 0.6rem + 0.25vw, 0.8125rem)',
    fontFamily: fontFamily.satoshi,
    color: isOverLimit ? colors.red[500] : colors.neutral[400],
    textAlign: 'right',
    userSelect: 'none',
  };
}
