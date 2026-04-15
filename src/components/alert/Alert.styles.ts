import type { CSSProperties } from 'react';
import { fontFamily } from '../../theme/tokens/typography';
import { alertSpacing, alertTypography } from '../../theme/tokens/alert';
import { colorPresets } from '../../theme/presets';
import type { Color } from '../../types';
import type { AlertVariant } from './Alert';

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* ─── Variant Recipe ───────────────────────────────────────────
 * Each variant maps a color preset to the resolved surface.
 * ────────────────────────────────────────────────────────────── */
interface ResolvedSurface {
  background: string;
  text: string;
  border: string;
  divider: string;
  backgroundImage?: string;
  iconSlotBackground?: string;
  iconSlotText?: string;
  bodyBackgroundImage?: string;
}

type VariantRecipe = (color: Color) => ResolvedSurface;

const variantRecipes: Record<AlertVariant, VariantRecipe> = {
  filled: (color) => {
    const p = colorPresets[color];
    return {
      background: p.main,
      text: p.contrast,
      border: p.main,
      divider: p.contrast,
    };
  },
  outlined: (color) => {
    const p = colorPresets[color];
    return {
      background: '#FFFFFF',
      text: p.main,
      border: p.main,
      divider: p.main,
    };
  },
  stripe: (color) => {
    const p = colorPresets[color];
    return {
      background: '#FFFFFF',
      text: p.main,
      border: p.main,
      divider: p.main,
      backgroundImage: `repeating-linear-gradient(45deg, ${hexToRgba(p.main, 0.18)} 0 1px, transparent 1px 10px)`,
    };
  },
  banner: (color) => {
    const p = colorPresets[color];
    return {
      background: p.main,
      text: p.contrast,
      border: p.main,
      divider: p.contrast,
    };
  },
};

/* ─── Container style ──────────────────────────────────────── */

export function getAlertContainerStyle(
  variant: AlertVariant,
  color: Color,
): CSSProperties {
  const resolved = variantRecipes[variant](color);

  const base: CSSProperties = {
    display: 'flex',
    alignItems: 'stretch',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: fontFamily.satoshi,
    color: resolved.text,
    backgroundColor: resolved.background,
    border: `${alertSpacing.borderWidth}px solid ${resolved.border}`,
    outline: 'none',
    position: 'relative',
    overflow: 'hidden',
    ['--fragui-alert-focus' as string]: resolved.text,
  };

  if (resolved.backgroundImage) {
    base.backgroundImage = resolved.backgroundImage;
  }

  if (variant === 'banner') {
    base.flexDirection = 'column';
    base.alignItems = 'center';
    base.textAlign = 'center';
    base.padding = alertSpacing.containerPadding;
  }

  return base;
}

/* ─── Icon slot ────────────────────────────────────────────── */

export function getAlertIconSlotStyle(
  variant: AlertVariant,
  color: Color,
): CSSProperties {
  const resolved = variantRecipes[variant](color);
  if (variant === 'banner') {
    return {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: resolved.text,
      flexShrink: 0,
    };
  }
  return {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: alertSpacing.sidePadding,
    borderRight: `${alertSpacing.borderWidth}px solid ${resolved.divider}`,
    backgroundColor: resolved.iconSlotBackground,
    color: resolved.iconSlotText ?? resolved.text,
    flexShrink: 0,
  };
}

/* ─── Body (title + description + action) ──────────────────── */

export function getAlertBodyStyle(
  variant: AlertVariant,
  color: Color,
): CSSProperties {
  const resolved = variantRecipes[variant](color);
  if (variant === 'banner') {
    return {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: alertSpacing.stackGap,
      width: '100%',
    };
  }
  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: alertSpacing.stackGap,
    padding: alertSpacing.containerPadding,
    flex: 1,
    minWidth: 0,
    backgroundImage: resolved.bodyBackgroundImage,
  };
}

/* ─── Banner header (icon + title inline) ──────────────────── */

export const alertBannerHeaderStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: alertSpacing.gap,
};

/* ─── Typography ───────────────────────────────────────────── */

export const alertTitleStyle: CSSProperties = {
  margin: 0,
  fontFamily: fontFamily.satoshi,
  fontSize: alertTypography.title.fontSize,
  fontWeight: alertTypography.title.fontWeight,
  fontStyle: 'normal',
  lineHeight: alertTypography.title.lineHeight,
};

export const alertDescriptionStyle: CSSProperties = {
  margin: 0,
  fontFamily: fontFamily.satoshi,
  fontSize: alertTypography.description.fontSize,
  fontWeight: alertTypography.description.fontWeight,
  fontStyle: 'normal',
  lineHeight: alertTypography.description.lineHeight,
};

export const alertActionSlotStyle: CSSProperties = {
  display: 'inline-flex',
  marginTop: alertSpacing.actionGap,
};

/* ─── Action button (centralized visual recipe) ─────────────── */

export interface AlertActionButtonConfig {
  variant: 'contained' | 'outlined';
  color: Color;
  style: CSSProperties;
}

export function getAlertActionButtonConfig(
  variant: AlertVariant,
  color: Color,
): AlertActionButtonConfig {
  // Solid-surface variants (filled / banner): outlined white-on-transparent
  // to read correctly against the colored background.
  if (variant === 'filled' || variant === 'banner') {
    return {
      variant: 'outlined',
      color,
      style: {
        color: '#FFFFFF',
        borderColor: '#FFFFFF',
        background: 'transparent',
      },
    };
  }
  // Light-surface variants (outlined / stripe): contained using the status color.
  return {
    variant: 'contained',
    color,
    style: {},
  };
}

/* ─── Close button ─────────────────────────────────────────── */

export function getAlertCloseSlotStyle(
  variant: AlertVariant,
  color: Color,
): CSSProperties {
  const resolved = variantRecipes[variant](color);
  if (variant === 'banner') {
    return {
      position: 'absolute',
      top: '0.75rem',
      right: '0.75rem',
    };
  }
  return {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: alertSpacing.sidePadding,
    borderLeft: `${alertSpacing.borderWidth}px solid ${resolved.divider}`,
    color: resolved.text,
    flexShrink: 0,
  };
}

export function getAlertCloseButtonStyle(
  variant: AlertVariant,
  color: Color,
): CSSProperties {
  const resolved = variantRecipes[variant](color);
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: 'none',
    padding: 2,
    margin: 0,
    cursor: 'pointer',
    color: resolved.text,
    lineHeight: 0,
    borderRadius: 4,
    outline: 'none',
  };
}

/* ─── Focus ring (scoped to interactive descendants) ───────── */

export const alertFocusStyles = `
  [data-component="alert"] button:focus-visible,
  [data-component="alert"] a:focus-visible,
  [data-component="alert"] [tabindex="0"]:focus-visible {
    outline: 2px solid var(--fragui-alert-focus, currentColor) !important;
    outline-offset: 2px !important;
    box-shadow: none !important;
  }
  [data-component="alert"] button:focus:not(:focus-visible),
  [data-component="alert"] a:focus:not(:focus-visible) {
    outline: none !important;
  }
`;

/* ─── Animations ───────────────────────────────────────────── */

export const alertKeyframes = `
  @keyframes fragui-alert-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes fragui-alert-slide-in {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @media (prefers-reduced-motion: reduce) {
    [data-component="alert"] {
      animation: none !important;
    }
  }
`;

export function getAlertAnimationStyle(
  animation: 'none' | 'fade' | 'slide',
): CSSProperties {
  switch (animation) {
    case 'fade':
      return { animation: 'fragui-alert-fade-in 200ms ease-out' };
    case 'slide':
      return { animation: 'fragui-alert-slide-in 220ms ease-out' };
    default:
      return {};
  }
}
