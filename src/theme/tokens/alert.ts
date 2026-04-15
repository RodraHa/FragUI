import { fontSize, fontWeight } from './typography';

export const alertTypography = {
  title: {
    fontSize: '1.25rem',
    fontWeight: fontWeight.black, // 900
    lineHeight: 'normal',
  },
  description: {
    fontSize: '1rem',
    fontWeight: fontWeight.medium, // 500
    lineHeight: 'normal',
  },
} as const;

export const alertSpacing = {
  containerPadding: '1rem 1.25rem',
  gap: '0.75rem',
  stackGap: '0.5rem',
  actionGap: '0.75rem',
  iconSize: 24,
  closeIconSize: 20,
  sidePadding: '1rem',
  borderWidth: 1,
} as const;

// Re-exported for completeness
export { fontSize, fontWeight };
