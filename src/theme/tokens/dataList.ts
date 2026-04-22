import { fontWeight } from './typography';

export const dataListTypography = {
  labelDefault: {
    fontSize: 'clamp(0.875rem, 0.75rem + 0.4vw, 1rem)',
    fontWeight: fontWeight.bold,
    lineHeight: 1.5,
  },
  labelCompact: {
    fontSize: 'clamp(0.8125rem, 0.7rem + 0.3vw, 0.875rem)',
    fontWeight: fontWeight.bold,
    lineHeight: 1.5,
  },
  description: {
    fontSize: 'clamp(0.8125rem, 0.7rem + 0.3vw, 0.875rem)',
    fontWeight: fontWeight.regular,
    lineHeight: 1.5,
  },
  meta: {
    fontSize: 'clamp(0.8125rem, 0.7rem + 0.3vw, 0.875rem)',
    fontWeight: fontWeight.medium,
    lineHeight: 1.5,
  },
  empty: {
    fontSize: 'clamp(0.875rem, 0.75rem + 0.4vw, 1rem)',
    fontWeight: fontWeight.medium,
    lineHeight: 1.5,
  },
} as const;

export const dataListSpacing = {
  borderWidth: 2,
  separatorDefault: 1,
  separatorSpaced: 2,
  paddingDefaultY: 'clamp(0.625rem, 0.4rem + 0.75vw, 1rem)',
  paddingDefaultX: 'clamp(0.875rem, 0.5rem + 1vw, 1.5rem)',
  paddingCompactY: 'clamp(0.375rem, 0.25rem + 0.45vw, 0.5rem)',
  paddingCompactX: 'clamp(0.875rem, 0.5rem + 1vw, 1.5rem)',
  paddingSpacedY: 'clamp(0.875rem, 0.5rem + 1vw, 1.5rem)',
  paddingSpacedX: 'clamp(0.875rem, 0.5rem + 1vw, 1.5rem)',
  checkboxSize: 20,
  checkboxGap: 'clamp(0.625rem, 0.4rem + 0.75vw, 1rem)',
  contentGap: 'clamp(0.125rem, 0.05rem + 0.3vw, 0.25rem)',
  metaMarginLeft: 'clamp(0.625rem, 0.4rem + 0.75vw, 1rem)',
  emptyPadding: 'clamp(1.5rem, 0.75rem + 2.5vw, 2.5rem)',
  disabledOpacity: 0.4,
  focusRingWidth: 2,
  focusRingOffset: 2,
} as const;
