import { fontWeight } from './typography';

export const tabsTypography = {
  label: {
    fontSize: 'clamp(0.875rem, 0.7rem + 0.5vw, 1rem)',
    fontWeightIdle: fontWeight.regular,
    fontWeightActive: fontWeight.black,
    letterSpacing: '0.02em',
  },
} as const;

export const tabsSpacing = {
  tabPaddingY: 'clamp(0.5rem, 0.3rem + 0.6vw, 0.75rem)',
  tabPaddingX: 'clamp(0.875rem, 0.5rem + 1vw, 1.5rem)',
  panelPadding: 'clamp(0.875rem, 0.5rem + 1vw, 1.5rem)',
  borderWidth: 2,
  separatorWidth: 2,
  indicatorSize: 3,
  disabledOpacity: 0.45,
} as const;
