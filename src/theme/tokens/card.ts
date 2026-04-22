import { fontWeight } from './typography';

export const cardTypography = {
  eyebrow: {
    fontSize: 'clamp(0.75rem, 0.65rem + 0.3vw, 0.875rem)',
    fontWeight: fontWeight.bold,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    lineHeight: 1.4,
  },
  title: {
    fontSize: 'clamp(1rem, 0.8rem + 0.75vw, 1.25rem)',
    fontWeight: fontWeight.black,
    letterSpacing: '-0.01em',
    lineHeight: 1.3,
  },
  description: {
    fontSize: 'clamp(0.875rem, 0.75rem + 0.4vw, 1rem)',
    fontWeight: fontWeight.regular,
    lineHeight: 1.6,
  },
} as const;

export const cardSpacing = {
  borderWidth: 2,
  bodyPadding: 'clamp(0.875rem, 0.5rem + 1vw, 1.5rem)',
  mediaHeight: 'clamp(7rem, 5rem + 4vw, 10rem)',
  slotGap: 'clamp(0.25rem, 0.15rem + 0.3vw, 0.5rem)',
  titleMarginBottom: 'clamp(0.375rem, 0.25rem + 0.4vw, 0.5rem)',
  descriptionMarginBottom: 'clamp(0.625rem, 0.4rem + 0.7vw, 1rem)',
  actionsGap: 'clamp(0.5rem, 0.3rem + 0.6vw, 0.75rem)',
  shadowOffset: 6,
  shadowHoverOffset: 8,
  shadowPressedOffset: 2,
  hoverTranslate: 2,
  pressedTranslate: 2,
  disabledOpacity: 0.4,
  focusRingWidth: 3,
  focusRingOffset: 2,
} as const;
