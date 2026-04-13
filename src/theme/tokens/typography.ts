export const fontFamily = {
  satoshi: "'Satoshi Variable', sans-serif",
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  bold: 700,
  black: 900,
} as const;

export const fontSize = {
  sm: 'clamp(0.75rem, 0.5rem + 0.75vw, 1rem)',
  md: 'clamp(0.875rem, 0.55rem + 1vw, 1.25rem)',
  lg: 'clamp(1rem, 0.6rem + 1.25vw, 1.5rem)',
} as const;

export const lineHeight = {
  normal: 'normal',
} as const;
