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

/* ─── Content grid ──────────────────────────────────────────────────
 * `minmax(0, 1fr)` (instead of plain `1fr`) lets each column shrink
 * below its content's intrinsic size, so a wide field or a long value
 * never forces the track — and therefore the page — to overflow.
 *
 * The desktop column count comes from this inline style; narrow-viewport
 * collapsing is layered on top via `fieldGroupResponsiveCss` (injected
 * once into <head>), keyed off the `data-fg-grid` attribute.
 * ────────────────────────────────────────────────────────────────── */
export function getContentGridStyle(
  columns: 1 | 2 | 3 | 4,
  gap: 'sm' | 'md' | 'lg',
): CSSProperties {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gap: fieldGroupGap[gap],
    alignItems: 'start',
  };
}

/* ─── Responsive column collapsing ──────────────────────────────────
 * Inline styles can't express media queries, so the multi-column grids
 * collapse via a single stylesheet injected into <head> (deduped by id).
 * `!important` is required to win over the inline `grid-template-columns`.
 *
 *   ≤ 900px : 3 & 4-column groups → 2 columns
 *   ≤ 600px : every multi-column group → 1 column
 *
 * Only expanded groups carry `data-fg-grid` (see FieldGroup.tsx), so a
 * collapsed group — which has no inline `display:grid` — is never matched.
 * ────────────────────────────────────────────────────────────────── */
export const fieldGroupResponsiveCss = `
@media (max-width: 900px) {
  [data-fg-grid="3"],
  [data-fg-grid="4"] {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
}
@media (max-width: 600px) {
  [data-fg-grid="2"],
  [data-fg-grid="3"],
  [data-fg-grid="4"] {
    grid-template-columns: 1fr !important;
  }
}
`;
