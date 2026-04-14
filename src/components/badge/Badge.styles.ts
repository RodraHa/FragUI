import type { CSSProperties } from 'react';
import { fontFamily } from '../../theme/tokens/typography';
import { badgeSize } from '../../theme/tokens/badge';
import { colorPresets } from '../../theme/presets';
import type { Color, Size } from '../../types';
import type { BadgeProps } from './Badge';

type Variant = NonNullable<BadgeProps['variant']>;
type Anchor = NonNullable<BadgeProps['anchor']>;

/* ─── Variant Recipes ──────────────────────────────────────── */

interface ResolvedStyle {
  background: string;
  text: string;
}

const variantRecipes: Record<Variant, (color: Color) => ResolvedStyle> = {
  solid: (color) => {
    const preset = colorPresets[color];
    return {
      background: preset.main,
      text: preset.contrast,
    };
  },
  subtle: (color) => {
    const preset = colorPresets[color];
    return {
      background: preset.mutedBg,
      text: preset.main,
    };
  },
};

/* ─── Base Badge Style ─────────────────────────────────────── */

export function getBadgeBaseStyle(size: Size): CSSProperties {
  const tokens = badgeSize[size];
  return {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 'clamp(0.375rem, 0.25rem + 0.4vw, 0.625rem)',
    padding: tokens.padding,
    fontSize: tokens.fontSize,
    fontWeight: tokens.fontWeight,
    fontStyle: 'normal',
    lineHeight: 'normal',
    fontFamily: fontFamily.satoshi,
    boxSizing: 'border-box',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    textTransform: 'uppercase',
  };
}

/* ─── Variant Style ────────────────────────────────────────── */

export function getBadgeVariantStyle(
  variant: Variant,
  color: Color,
): CSSProperties {
  const resolved = variantRecipes[variant](color);
  return {
    backgroundColor: resolved.background,
    color: resolved.text,
  };
}

/* ─── Dot Style ────────────────────────────────────────────── */

export function getBadgeDotStyle(size: Size): CSSProperties {
  const tokens = badgeSize[size];
  return {
    width: tokens.dotSize,
    height: tokens.dotSize,
    padding: 0,
    fontSize: 0,
    lineHeight: 0,
  };
}

/* ─── Combined Badge Style ─────────────────────────────────── */

export function getBadgeStyles(
  variant: Variant,
  color: Color,
  size: Size,
  mode: 'numeric' | 'dot' | 'label',
): CSSProperties {
  const base = getBadgeBaseStyle(size);
  const variantStyle = getBadgeVariantStyle(variant, color);
  const dotOverrides = mode === 'dot' ? getBadgeDotStyle(size) : {};

  return {
    ...base,
    ...variantStyle,
    ...dotOverrides,
  };
}

/* ─── Wrapper Style (anchored badge) ───────────────────────── */

export function getBadgeWrapperStyle(): CSSProperties {
  return {
    position: 'relative',
    display: 'inline-flex',
  };
}

/* ─── Anchor Position Style ────────────────────────────────── */

const anchorPositionMap: Record<Anchor, CSSProperties> = {
  'top-right': { top: 0, right: 0, transform: 'translate(50%, -50%)' },
  'top-left': { top: 0, left: 0, transform: 'translate(-50%, -50%)' },
  'bottom-right': { bottom: 0, right: 0, transform: 'translate(50%, 50%)' },
  'bottom-left': { bottom: 0, left: 0, transform: 'translate(-50%, 50%)' },
};

export function getBadgeAnchorStyle(
  anchor: Anchor,
  offset: [number, number],
): CSSProperties {
  const pos = anchorPositionMap[anchor];
  const [offsetX, offsetY] = offset;

  const baseTransform = pos.transform as string;
  const offsetTransform =
    offsetX !== 0 || offsetY !== 0
      ? ` translate(${offsetX}px, ${offsetY}px)`
      : '';

  return {
    position: 'absolute',
    ...pos,
    transform: baseTransform + offsetTransform,
    zIndex: 1,
  };
}

/* ─── Pulse Keyframe ───────────────────────────────────────── */

export const pulseKeyframes = `
  @keyframes fragui-badge-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @media (prefers-reduced-motion: reduce) {
    [data-pulse="true"] {
      animation: none !important;
    }
  }
`;

export function getBadgePulseStyle(): CSSProperties {
  return {
    animation: 'fragui-badge-pulse 1.5s ease-in-out infinite',
  };
}
