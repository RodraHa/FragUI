import { fontSize, fontWeight } from './typography';

/* ─── FieldGroup Tokens ─────────────────────────────────────────
 * Grid gap values and title / description typography for FieldGroup.
 * The gap scale mirrors the spacing vocabulary used across the
 * system ("sm" | "md" | "lg") and uses clamp() so layouts breathe
 * proportionally on all viewport widths.
 * ────────────────────────────────────────────────────────────── */

/**
 * CSS `gap` value for the internal field grid per the `gap` prop.
 * Applied to `getContentGridStyle()` in FieldGroup.styles.ts.
 */
export const fieldGroupGap = {
  sm: 'clamp(0.5rem,  0.38rem + 0.6vw,  0.75rem)',
  md: 'clamp(0.75rem, 0.6rem  + 0.75vw, 1.25rem)',
  lg: 'clamp(1rem,    0.8rem  + 1vw,    1.75rem)',
} as const;

/**
 * Title (rendered inside `<legend>`) typography.
 * Bold weight to give the section a clear visual header.
 */
export const fieldGroupTitleSize = {
  fontSize: fontSize.md,
  fontWeight: fontWeight.bold,
} as const;

/**
 * Description (rendered below the legend) typography.
 * Regular weight and smaller — it's contextual, not primary.
 */
export const fieldGroupDescriptionSize = {
  fontSize: fontSize.sm,
  fontWeight: fontWeight.regular,
} as const;
