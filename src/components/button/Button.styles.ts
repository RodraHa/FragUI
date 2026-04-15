import type { CSSProperties } from 'react';
import { colors } from '../../theme/tokens/colors';
import { buttonBorderRadius, buttonSize } from '../../theme/tokens/button';
import { fontFamily } from '../../theme/tokens/typography';
import type { Color, Size } from '../../types';
import { colorPresets } from '../../theme/presets';
import type { ColorPreset } from '../../theme/presets';
import type { ButtonProps } from './Button';

type Variant = NonNullable<ButtonProps['variant']>;
type Radius = NonNullable<ButtonProps['radius']>;
type ButtonState = 'idle' | 'hover' | 'focus';

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
  isIconOnly: boolean = false,
): CSSProperties {
  const tokens = buttonSize[size];
  return {
    display: fullWidth ? 'flex' : 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: tokens.gap,
    padding: isIconOnly ? tokens.paddingIconOnly : tokens.padding,
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
      'background-color 0.15s ease, transform 0.1s ease, opacity 0.15s ease, box-shadow 0.15s ease',
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
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: resolved.border,
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
  isIconOnly: boolean = false,
): CSSProperties {
  return {
    ...getButtonBaseStyle(size, radius, fullWidth, isDisabled, isIconOnly),
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

type Effect = NonNullable<ButtonProps['effect']>;

export function getButtonEffectStyle(
  effect: Effect,
  color: Color,
  isHovered: boolean,
  isPressActive: boolean,
  isDisabled: boolean,
): CSSProperties {
  if (isDisabled || effect === 'none') return {};

  switch (effect) {
    case 'press':
      return isPressActive ? { transform: 'scale(0.96)' } : {};
    case 'lift': {
      if (isPressActive && isHovered) return { transform: 'translateY(1px)' };
      if (isPressActive) return { transform: 'scale(0.96)' };
      if (isHovered) return { transform: 'translateY(-2px)' };
      return {};
    }
    case 'glow': {
      const { emphasis } = colorPresets[color];
      return {
        ...(isPressActive ? { transform: 'scale(0.96)' } : {}),
        ...(isHovered && !isPressActive
          ? { boxShadow: `0 0 0 4px ${emphasis}33` }
          : {}),
      };
    }
    default:
      return {};
  }
}

export const tooltipStyle: CSSProperties = {
  position: 'absolute',
  bottom: 'calc(100% + 14px)',
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
