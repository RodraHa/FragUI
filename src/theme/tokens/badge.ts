import { fontWeight } from './typography';

export const badgeFontSize = {
  sm: 'clamp(0.625rem, 0.55rem + 0.25vw, 0.75rem)',
  md: 'clamp(0.75rem, 0.65rem + 0.3vw, 0.875rem)',
  lg: 'clamp(0.875rem, 0.75rem + 0.35vw, 1rem)',
} as const;

export const badgeSize = {
  sm: {
    padding: 'clamp(0.1875rem, 0.1rem + 0.25vw, 0.25rem)',
    fontSize: badgeFontSize.sm,
    fontWeight: fontWeight.black,
    dotSize: 'clamp(0.5rem, 0.35rem + 0.45vw, 0.75rem)',
  },
  md: {
    padding:
      'clamp(0.1875rem, 0.1rem + 0.25vw, 0.25rem) clamp(0.375rem, 0.2rem + 0.5vw, 0.5rem)',
    fontSize: badgeFontSize.md,
    fontWeight: fontWeight.black,
    dotSize: 'clamp(0.625rem, 0.4rem + 0.65vw, 1rem)',
  },
  lg: {
    padding:
      'clamp(0.1875rem, 0.1rem + 0.25vw, 0.25rem) clamp(0.5rem, 0.25rem + 0.75vw, 0.75rem)',
    fontSize: badgeFontSize.lg,
    fontWeight: fontWeight.black,
    dotSize: 'clamp(0.75rem, 0.5rem + 0.75vw, 1.25rem)',
  },
} as const;

export type BadgeSize = keyof typeof badgeSize;
