import type { CSSProperties } from 'react';
import { colors } from '../../theme/tokens/colors';
import { buttonBorderRadius, buttonSize } from '../../theme/tokens/button';
import { fontFamily } from '../../theme/tokens/typography';
import type { ButtonProps } from './Button';

type Variant = NonNullable<ButtonProps['variant']>;
type Color = NonNullable<ButtonProps['color']>;
type Size = NonNullable<ButtonProps['size']>;
type Radius = NonNullable<ButtonProps['radius']>;
type ButtonState = 'idle' | 'hover' | 'focus';

/* ─── Color Preset ─────────────────────────────────────────────
 * Each preset defines semantic color slots.
 * Variants derive their styles from these slots — no per-variant
 * duplication needed when adding a new preset.
 * ────────────────────────────────────────────────────────────── */
interface ColorPreset {
  main: string; // primary surface / accent
  light: string; // lighter shade (hover)
  emphasis: string; // focus outline
  contrast: string; // text on filled surface
  muted: string; // disabled text / border
  mutedBg: string; // disabled background
}

// TODO: Fill each preset with the correct color tokens
const colorPresets: Record<Color, ColorPreset> = {
  ink: {
    main: colors.neutral[500], // e.g. colors.neutral[500]
    light: colors.neutral[400], // e.g. colors.neutral[500]
    emphasis: colors.neutral[500], // e.g. colors.neutral[300]
    contrast: colors.white, // e.g. colors.white
    muted: colors.white, // e.g. colors.neutral[200]
    mutedBg: colors.neutral[200], // e.g. colors.neutral[100]
  },
  sea: {
    main: colors.blue[500], // e.g. colors.blue[400]
    light: colors.blue[400], // e.g. colors.blue[500]
    emphasis: colors.blue[500], // e.g. colors.blue[300]
    contrast: colors.white, // e.g. colors.white
    muted: colors.white, // e.g. colors.blue[200]
    mutedBg: colors.blue[100], // e.g. colors.blue[100]
  },
  brick: {
    main: colors.red[500], // e.g. colors.red[400]
    light: colors.red[400], // e.g. colors.red[500]
    emphasis: colors.red[500], // e.g. colors.red[300]
    contrast: colors.white, // e.g. colors.white
    muted: colors.white, // e.g. colors.red[200]
    mutedBg: colors.red[200], // e.g. colors.red[100]
  },
  ochre: {
    main: colors.orange[700], // e.g. colors.orange[400]
    light: colors.orange[600], // e.g. colors.orange[500]
    emphasis: colors.orange[700], // e.g. colors.orange[300]
    contrast: colors.white, // e.g. colors.neutral[500] (dark text)
    muted: colors.white, // e.g. colors.orange[200]
    mutedBg: colors.orange[200], // e.g. colors.orange[100]
  },
  pine: {
    main: colors.green[500], // e.g. colors.green[400]
    light: colors.green[400], // e.g. colors.green[500]
    emphasis: colors.green[500], // e.g. colors.green[300]
    contrast: colors.white, // e.g. colors.white
    muted: colors.white, // e.g. colors.green[200]
    mutedBg: colors.green[100], // e.g. colors.green[100]
  },
  grape: {
    main: colors.purple[500], // e.g. colors.purple[400]
    light: colors.purple[400], // e.g. colors.purple[500]
    emphasis: colors.purple[500], // e.g. colors.purple[300]
    contrast: colors.white, // e.g. colors.white
    muted: colors.white, // e.g. colors.purple[200]
    mutedBg: colors.purple[100], // e.g. colors.purple[100]
  },
};

/* ─── Variant Recipes ──────────────────────────────────────────
 * Each variant defines how it maps preset slots → CSS per state.
 * This is the ONLY place variant-specific logic lives.
 * ────────────────────────────────────────────────────────────── */
interface ResolvedStyle {
  background: string;
  text: string;
  border: string;
  outline?: string;
  boxShadow?: string;
  textDecoration?: string;
}

type VariantRecipe = Record<
  ButtonState | 'disabled',
  (p: ColorPreset) => ResolvedStyle
>;

const variantRecipes: Record<Variant, VariantRecipe> = {
  contained: {
    idle: (p) => ({
      background: p.main,
      text: p.contrast,
      border: p.main,
    }),
    hover: (p) => ({
      background: p.light,
      text: p.contrast,
      border: p.light,
    }),
    focus: (p) => ({
      background: p.main,
      text: p.contrast,
      border: p.main,
      outline: `2px solid ${p.emphasis}`,
    }),
    disabled: (p) => ({
      background: p.mutedBg,
      text: p.muted,
      border: p.mutedBg,
    }),
  },
  outlined: {
    idle: (p) => ({
      background: 'transparent',
      text: p.main,
      border: p.main,
    }),
    hover: (p) => ({
      background: 'transparent',
      text: p.light,
      border: p.light,
    }),
    focus: (p) => ({
      background: 'transparent',
      text: p.main,
      border: p.main,
      outline: `2px solid ${p.emphasis}`,
    }),
    disabled: (p) => ({
      background: 'transparent',
      text: p.mutedBg,
      border: p.mutedBg,
    }),
  },
  text: {
    idle: (p) => ({
      background: 'transparent',
      text: p.main,
      border: 'transparent',
    }),
    hover: (p) => ({
      background: 'transparent',
      text: p.light,
      border: 'transparent',
      textDecoration: 'underline',
    }),
    focus: (p) => ({
      background: 'transparent',
      text: p.main,
      border: 'transparent',
      outline: `2px solid ${p.emphasis}`,
    }),
    disabled: (p) => ({
      background: 'transparent',
      text: p.mutedBg,
      border: 'transparent',
    }),
  },
};

/* ─── Resolved style helpers ───────────────────────────────── */

function resolveRadius(size: Size, radius: Radius): string {
  if (radius === 'none') return '0';
  return buttonBorderRadius[size][radius];
}

export function getButtonBaseStyle(
  size: Size,
  radius: Radius,
  fullWidth: boolean,
  isDisabled: boolean,
): CSSProperties {
  const tokens = buttonSize[size];
  return {
    display: fullWidth ? 'flex' : 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: tokens.gap,
    padding: tokens.padding,
    fontSize: tokens.fontSize,
    fontWeight: tokens.fontWeight,
    fontStyle: 'normal',
    lineHeight: 'normal',
    fontFamily: fontFamily.satoshi,
    borderRadius: resolveRadius(size, radius),
    width: fullWidth ? '100%' : undefined,
    boxSizing: 'border-box',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.6 : 1,
    transition:
      'background-color 0.15s ease, transform 0.1s ease, opacity 0.15s ease',
    position: 'relative',
    overflow: 'hidden',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  };
}

export function getVariantStyle(
  variant: Variant,
  color: Color,
  state: ButtonState,
  isDisabled: boolean,
): CSSProperties {
  const preset = colorPresets[color];
  const recipe = variantRecipes[variant];
  const resolved = isDisabled ? recipe.disabled(preset) : recipe[state](preset);

  const css: CSSProperties = {
    backgroundColor: resolved.background,
    color: resolved.text,
    border: `2px solid ${resolved.border}`,
    outline: 'none',
  };

  if (resolved.outline) {
    css.outline = resolved.outline;
    css.outlineOffset = '5px';
  }

  if (resolved.boxShadow) {
    css.boxShadow = resolved.boxShadow;
  }

  if (resolved.textDecoration) {
    css.textDecoration = resolved.textDecoration;
  }

  return css;
}

export function getButtonStyles(
  variant: Variant,
  color: Color,
  size: Size,
  radius: Radius,
  fullWidth: boolean,
  isDisabled: boolean,
  state: ButtonState = 'idle',
): CSSProperties {
  return {
    ...getButtonBaseStyle(size, radius, fullWidth, isDisabled),
    ...getVariantStyle(variant, color, state, isDisabled),
  };
}

export const spinnerStyle: CSSProperties = {
  width: '1em',
  height: '1em',
  borderRadius: '50%',
  border: '2px solid currentColor',
  borderTopColor: 'transparent',
  display: 'inline-block',
  animation: 'fragui-spin 0.6s linear infinite',
  flexShrink: 0,
};

export const iconWrapperStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  flexShrink: 0,
};

export function getButtonWrapperStyle(fullWidth: boolean): CSSProperties {
  return {
    position: 'relative',
    display: fullWidth ? 'block' : 'inline-flex',
    width: fullWidth ? '100%' : undefined,
  };
}

export const tooltipStyle: CSSProperties = {
  position: 'absolute',
  bottom: 'calc(100% + 8px)',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: colors.neutral[500],
  color: colors.white,
  fontSize: '0.75rem',
  fontWeight: 700,
  fontFamily: fontFamily.satoshi,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  padding: '0.375rem 0.75rem',
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
  zIndex: 9999,
};
