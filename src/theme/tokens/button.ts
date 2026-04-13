import { fontSize, fontWeight } from './typography';

export const buttonSize = {
  sm: {
    padding:
      'clamp(0.5rem, 0.3rem + 0.6vw, 0.75rem) clamp(1rem, 0.6rem + 1.2vw, 1.5rem)',
    paddingIconOnly: 'clamp(0.5rem, 0.3rem + 0.6vw, 0.75rem)',
    gap: 'clamp(0.375rem, 0.25rem + 0.4vw, 0.625rem)',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.black,
  },
  md: {
    padding:
      'clamp(0.625rem, 0.35rem + 0.85vw, 1rem) clamp(1.25rem, 0.7rem + 1.7vw, 2rem)',
    paddingIconOnly: 'clamp(0.625rem, 0.35rem + 0.85vw, 1rem)',
    gap: 'clamp(0.375rem, 0.25rem + 0.4vw, 0.625rem)',
    fontSize: fontSize.md,
    fontWeight: fontWeight.black,
  },
  lg: {
    padding:
      'clamp(0.75rem, 0.35rem + 1.25vw, 1.5rem) clamp(1.5rem, 0.6rem + 2.75vw, 3rem)',
    paddingIconOnly: 'clamp(0.75rem, 0.35rem + 1.25vw, 1.5rem)',
    gap: 'clamp(0.375rem, 0.25rem + 0.4vw, 0.625rem)',
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
    sm: 'clamp(0.5rem, 0.3rem + 0.6vw, 0.75rem)',
    md: 'clamp(0.625rem, 0.35rem + 0.85vw, 1rem)',
    lg: 'clamp(1rem, 0.6rem + 1.2vw, 1.5rem)',
  },
  md: {
    sm: 'clamp(0.625rem, 0.35rem + 0.85vw, 1rem)',
    md: 'clamp(1rem, 0.6rem + 1.2vw, 1.5rem)',
    lg: 'clamp(1.25rem, 0.65rem + 1.7vw, 2rem)',
  },
  lg: {
    sm: 'clamp(1rem, 0.6rem + 1.2vw, 1.5rem)',
    md: 'clamp(1.25rem, 0.65rem + 1.7vw, 2rem)',
    lg: 'clamp(1.5rem, 0.6rem + 2.75vw, 3rem)',
  },
} as const;

export type ButtonSize = keyof typeof buttonSize;
export type ButtonRadiusScale = 'none' | 'sm' | 'md' | 'lg';
