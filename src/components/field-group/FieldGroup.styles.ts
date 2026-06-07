import type { CSSProperties } from 'react';
import { colors } from '../../theme/tokens/colors';
import { fontFamily } from '../../theme/tokens/typography';
import {
  fieldGroupGap,
  fieldGroupTitleSize,
  fieldGroupDescriptionSize,
} from '../../theme/tokens/fieldGroup';

/* ─── Fieldset reset ────────────────────────────────────────────────
 * Native <fieldset> has user-agent styles (border, padding, margin,
 * min-inline-size). We reset all of them so FieldGroup is a blank
 * canvas — the design comes entirely from our tokens.
 * ────────────────────────────────────────────────────────────────── */
export const fieldsetResetStyle: CSSProperties = {
  border: 'none',
  padding: 0,
  margin: 0,
  minInlineSize: 0,
  boxSizing: 'border-box',
};

/* ─── Fieldset wrapper (outer) ─────────────────────────────────────
 * Full-width by default; display:block so it stacks normally.
 * ────────────────────────────────────────────────────────────────── */
export function getFieldsetStyle(): CSSProperties {
  return {
    ...fieldsetResetStyle,
    display: 'block',
    width: '100%',
  };
}

/* ─── Legend reset ──────────────────────────────────────────────────
 * Native <legend> has implicit padding and inline-size quirks that
 * break grid layouts. We reset and control it fully.
 * ────────────────────────────────────────────────────────────────── */
export const legendResetStyle: CSSProperties = {
  padding: 0,
  display: 'block',
  width: '100%',
  float: 'left', // prevents the legend-gap artefact in most browsers
};

/* ─── Collapsible trigger button ───────────────────────────────────
 * Must be a real <button> for keyboard accessibility (contract).
 * Inherits legend text styles and adds interaction affordances.
 * ────────────────────────────────────────────────────────────────── */
export function getCollapseTriggerStyle(disabled: boolean): CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    background: 'none',
    border: 'none',
    padding: 0,
    margin: 0,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: fontFamily.satoshi,
    fontSize: fieldGroupTitleSize.fontSize,
    fontWeight: fieldGroupTitleSize.fontWeight,
    color: disabled ? colors.neutral[300] : colors.neutral[500],
    textAlign: 'left',
    opacity: disabled ? 0.6 : 1,
    transition: 'color 0.15s ease, opacity 0.15s ease',
  };
}

/* ─── Chevron icon (collapse indicator) ────────────────────────────
 * Rotates 90 ° when collapsed. Always aria-hidden.
 * ────────────────────────────────────────────────────────────────── */
export function getChevronStyle(collapsed: boolean): CSSProperties {
  return {
    display: 'inline-block',
    transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
    transition: 'transform 0.2s ease',
    lineHeight: 1,
    fontSize: '0.75em',
  };
}

/* ─── Title (non-collapsible) ───────────────────────────────────── */
export function getTitleStyle(disabled: boolean): CSSProperties {
  return {
    display: 'block',
    width: '100%',
    fontFamily: fontFamily.satoshi,
    fontSize: fieldGroupTitleSize.fontSize,
    fontWeight: fieldGroupTitleSize.fontWeight,
    color: disabled ? colors.neutral[300] : colors.neutral[500],
    lineHeight: 'normal',
    transition: 'color 0.15s ease',
  };
}

/* ─── Description ───────────────────────────────────────────────── */
export function getDescriptionStyle(disabled: boolean): CSSProperties {
  return {
    display: 'block',
    marginTop: '0.25rem',
    fontFamily: fontFamily.satoshi,
    fontSize: fieldGroupDescriptionSize.fontSize,
    fontWeight: fieldGroupDescriptionSize.fontWeight,
    color: disabled ? colors.neutral[200] : colors.neutral[400],
    lineHeight: 'normal',
    transition: 'color 0.15s ease',
  };
}

/* ─── Header wrapper (title + description) ──────────────────────── */
export function getHeaderStyle(hasContent: boolean): CSSProperties {
  return {
    display: hasContent ? 'block' : 'none',
    marginBottom: hasContent ? '0.75rem' : 0,
    clear: 'both',
  };
}

/* ─── Content grid ──────────────────────────────────────────────── */
export function getContentGridStyle(
  columns: 1 | 2 | 3 | 4,
  gap: 'sm' | 'md' | 'lg',
): CSSProperties {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: fieldGroupGap[gap],
    alignItems: 'start',
  };
}
