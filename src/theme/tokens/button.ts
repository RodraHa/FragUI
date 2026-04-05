import { fontSize, fontWeight } from './typography';

export const buttonSize = {
  sm: {
    padding: '0.75rem 1.5rem',
    gap: '0.625rem',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.black,
  },
  md: {
    padding: '1rem 2rem',
    gap: '0.625rem',
    fontSize: fontSize.md,
    fontWeight: fontWeight.black,
  },
  lg: {
    padding: '1.5rem 3rem',
    gap: '0.625rem',
    fontSize: fontSize.lg,
    fontWeight: fontWeight.black,
  },
} as const;

/**
 * Border radius tokens indexed by [buttonSize][radiusScale].
 *
 * Radius scale:
 *   sm → subtle rounding
 *   md → intermediate rounding
 *   lg → pill-style rounding
 */
export const buttonBorderRadius = {
  sm: {
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
  },
  md: {
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
  },
  lg: {
    sm: '1.5rem',
    md: '2rem',
    lg: '3rem',
  },
} as const;

export type ButtonSize = keyof typeof buttonSize;
export type ButtonRadiusScale = 'none' | 'sm' | 'md' | 'lg';
