import { fontSize, fontWeight } from './typography';

/* ─── Field Tokens ──────────────────────────────────────────────
 * Typography and spacing for the three sub-elements rendered by
 * `Field`: the label above the control, and the helper/error text
 * below. Scaled per `size` prop to stay proportional with the
 * InputText / Select control at each tier.
 *
 * Fluid font sizes use clamp() matching the pattern in inputText.ts
 * and select.ts so all form elements scale together.
 * ────────────────────────────────────────────────────────────── */

/** Label typography per size. Slightly smaller than the control text
 *  to create visual hierarchy; medium weight for scan-ability. */
export const fieldLabelSize = {
  sm: { fontSize: fontSize.sm, fontWeight: fontWeight.medium },
  md: { fontSize: fontSize.sm, fontWeight: fontWeight.medium },
  lg: { fontSize: fontSize.md, fontWeight: fontWeight.medium },
} as const;

/** Helper / error text typography per size.
 *  Intentionally smaller than label — it's secondary information. */
export const fieldHelperSize = {
  sm: { fontSize: 'clamp(0.6875rem, 0.6rem + 0.25vw, 0.8125rem)' },
  md: { fontSize: 'clamp(0.75rem,   0.55rem + 0.5vw,  0.9375rem)' },
  lg: { fontSize: 'clamp(0.8125rem, 0.6rem  + 0.6vw,  1.0625rem)' },
} as const;

/** Vertical spacing between the label/control/sub-text per size. */
export const fieldSpacing = {
  sm: { labelGap: '0.25rem', helperGap: '0.25rem' },
  md: { labelGap: '0.375rem', helperGap: '0.375rem' },
  lg: { labelGap: '0.5rem', helperGap: '0.5rem' },
} as const;
