import { fontSize, fontWeight } from './typography';

export const alertTypography = {
  title: {
    fontSize: 'clamp(1rem, 0.8rem + 0.75vw, 1.25rem)',
    fontWeight: fontWeight.black, // 900
    lineHeight: 'normal',
  },
  description: {
    fontSize: 'clamp(0.875rem, 0.75rem + 0.4vw, 1rem)',
    fontWeight: fontWeight.medium, // 500
    lineHeight: 'normal',
  },
} as const;

export const alertSpacing = {
  containerPadding:
    'clamp(0.625rem, 0.35rem + 1vw, 1rem) clamp(0.75rem, 0.4rem + 1.25vw, 1.25rem)',
  gap: 'clamp(0.5rem, 0.3rem + 0.75vw, 0.75rem)',
  stackGap: 'clamp(0.25rem, 0.15rem + 0.5vw, 0.5rem)',
  actionGap: 'clamp(0.5rem, 0.3rem + 0.75vw, 0.75rem)',
  iconSize: 24,
  closeIconSize: 20,
  sidePadding: 'clamp(0.625rem, 0.35rem + 1vw, 1rem)',
  borderWidth: 1,
} as const;

// Re-exported for completeness
export { fontSize, fontWeight };
