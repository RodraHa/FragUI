import type { CSSProperties } from 'react';
import { colors } from '../../theme/tokens/colors';
import { selectTriggerSize, selectPanelSize } from '../../theme/tokens/select';
import { fontFamily } from '../../theme/tokens/typography';
import type { Size, FormStatus } from '../../types';

/* ─── Status → border / focus-ring colors ──────────────────────
 * Identical mapping to InputText so both controls share the same
 * visual language for validation states.
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

/* ─── Trigger (closed-state button) ────────────────────────────
 * Mirrors InputText's getContainerStyle 1:1 for perfect alignment
 * in mixed form layouts. Same height, padding, border, focus ring.
 *
 * Width behaviour (identical to InputText):
 *   – width prop    → explicit CSS width (overrides fullWidth)
 *   – fullWidth     → 100 % of parent (default for form inputs)
 *   – !fullWidth    → inline-flex + auto width with a sensible min
 * ────────────────────────────────────────────────────────────── */

/** Minimum width per size so the trigger never collapses when not fullWidth */
const autoMinWidth: Record<Size, string> = {
  sm: '8rem',
  md: '12rem',
  lg: '16rem',
};

export function getTriggerStyle(
  size: Size,
  status: FormStatus,
  disabled: boolean,
  isFocused: boolean,
  isOpen: boolean,
  fullWidth: boolean = true,
  width?: string | number,
): CSSProperties {
  const tokens = selectTriggerSize[size];
  const borderColor = disabled
    ? colors.neutral[200]
    : isFocused || isOpen
      ? statusFocusRing[status]
      : statusBorder[status];

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
    backgroundColor: disabled ? colors.neutral[100] : colors.white,
    outline:
      isFocused || isOpen ? `2px solid ${statusFocusRing[status]}` : 'none',
    outlineOffset: isFocused || isOpen ? '2px' : '0',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition:
      'border-color 0.15s ease, outline 0.15s ease, background-color 0.15s ease, opacity 0.15s ease',
    position: 'relative',
    width: resolvedWidth,
    ...(resolvedWidth === undefined ? { minWidth: autoMinWidth[size] } : {}),
    // Reset native button appearance
    textAlign: 'left',
    lineHeight: 'normal',
    margin: 0,
  };
}

/* ─── Trigger inner text ────────────────────────────────────────
 * The selected label or placeholder text inside the trigger.
 * ────────────────────────────────────────────────────────────── */
export function getTriggerTextStyle(isPlaceholder: boolean): CSSProperties {
  return {
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: isPlaceholder ? colors.neutral[400] : 'inherit',
  };
}

/* ─── Chevron indicator ─────────────────────────────────────────
 * Rotates 180° when the panel is open.
 * ────────────────────────────────────────────────────────────── */
export function getChevronStyle(isOpen: boolean): CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: colors.neutral[400],
    transition: 'transform 0.2s ease',
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    fontSize: 'inherit',
    lineHeight: 1,
    pointerEvents: 'none',
  };
}

/* ─── Clear button ──────────────────────────────────────────────
 * Same visual treatment as InputText's clear button.
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

/* ─── Dropdown panel ────────────────────────────────────────────
 * Positioned by Floating UI. Contains options, search, empty msg.
 * ────────────────────────────────────────────────────────────── */
export function getPanelStyle(
  size: Size,
  fullWidth: boolean = true,
  width?: string | number,
): CSSProperties {
  const tokens = selectPanelSize[size];
  const resolvedWidth: string | number | undefined =
    width !== undefined ? width : fullWidth ? undefined : undefined;
  return {
    boxSizing: 'border-box',
    maxHeight: tokens.maxHeight,
    overflowY: 'auto',
    backgroundColor: colors.white,
    border: `1px solid ${colors.neutral[200]}`,
    borderRadius: 0,
    boxShadow: '0 4px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
    padding: '0',
    zIndex: 1000,
    fontFamily: fontFamily.satoshi,
    ...(resolvedWidth !== undefined ? { width: resolvedWidth } : {}),
  };
}

/* ─── Search input (inside panel) ───────────────────────────────
 * Sticky at the top of the panel so it stays visible while
 * scrolling through options.
 * ────────────────────────────────────────────────────────────── */
export function getSearchInputStyle(size: Size): CSSProperties {
  const tokens = selectPanelSize[size];
  const triggerTokens = selectTriggerSize[size];
  return {
    display: 'block',
    width: '100%',
    boxSizing: 'border-box',
    padding: tokens.searchPadding,
    border: 'none',
    borderBottom: `1px solid ${colors.neutral[200]}`,
    outline: 'none',
    background: colors.white,
    color: colors.neutral[500],
    fontSize: triggerTokens.fontSize,
    fontWeight: triggerTokens.fontWeight,
    fontFamily: fontFamily.satoshi,
    lineHeight: 'normal',
    position: 'sticky',
    top: 0,
    zIndex: 1,
  };
}

/* ─── Option ────────────────────────────────────────────────────
 * Individual option row inside the dropdown panel.
 * ────────────────────────────────────────────────────────────── */
export function getOptionStyle(
  size: Size,
  isActive: boolean,
  isSelected: boolean,
  disabled: boolean,
): CSSProperties {
  const tokens = selectPanelSize[size];
  const triggerTokens = selectTriggerSize[size];

  let backgroundColor = 'transparent';
  if (disabled) {
    backgroundColor = 'transparent';
  } else if (isActive) {
    backgroundColor = colors.neutral[100];
  }

  return {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.optionPadding.split(' ')[0],
    padding: tokens.optionPadding,
    fontSize: triggerTokens.fontSize,
    fontWeight: isSelected ? 500 : triggerTokens.fontWeight,
    fontFamily: fontFamily.satoshi,
    lineHeight: 'normal',
    cursor: disabled ? 'not-allowed' : 'pointer',
    color: disabled ? colors.neutral[300] : colors.neutral[500],
    backgroundColor,
    border: 'none',
    outline: 'none',
    width: '100%',
    textAlign: 'left',
    boxSizing: 'border-box',
    transition: 'background-color 0.1s ease',
    opacity: disabled ? 0.5 : 1,
  };
}

/* ─── Group header ──────────────────────────────────────────────
 * Non-interactive label for grouped options.
 * ────────────────────────────────────────────────────────────── */
export function getGroupHeaderStyle(size: Size): CSSProperties {
  const tokens = selectPanelSize[size];
  return {
    display: 'block',
    padding: tokens.groupHeaderPadding,
    fontSize: 'clamp(0.6875rem, 0.6rem + 0.25vw, 0.8125rem)',
    fontWeight: 700,
    fontFamily: fontFamily.satoshi,
    color: colors.neutral[400],
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    lineHeight: 'normal',
    userSelect: 'none',
  };
}

/* ─── Empty message ─────────────────────────────────────────────
 * Shown when there are no options or search returns no results.
 * ────────────────────────────────────────────────────────────── */
export function getEmptyStyle(size: Size): CSSProperties {
  const tokens = selectPanelSize[size];
  const triggerTokens = selectTriggerSize[size];
  return {
    display: 'block',
    padding: tokens.optionPadding,
    fontSize: triggerTokens.fontSize,
    fontFamily: fontFamily.satoshi,
    color: colors.neutral[300],
    textAlign: 'center',
    lineHeight: 'normal',
    userSelect: 'none',
  };
}

/* ─── Loading spinner ───────────────────────────────────────────
 * Simple text-based loading indicator inside the panel.
 * ────────────────────────────────────────────────────────────── */
export function getLoadingStyle(size: Size): CSSProperties {
  const tokens = selectPanelSize[size];
  const triggerTokens = selectTriggerSize[size];
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.optionPadding,
    fontSize: triggerTokens.fontSize,
    fontFamily: fontFamily.satoshi,
    color: colors.neutral[400],
    lineHeight: 'normal',
    userSelect: 'none',
  };
}
