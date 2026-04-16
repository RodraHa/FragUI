import type { CSSProperties } from 'react';
import { fontFamily } from '../../theme/tokens/typography';
import { badgeSize } from '../../theme/tokens/badge';
import { colorPresets } from '../../theme/presets';
import type { Color, Size } from '../../types';
import type { BadgeProps } from './Badge';

type Variant = NonNullable<BadgeProps['variant']>;
type Mode = NonNullable<BadgeProps['mode']>;
type Anchor = NonNullable<BadgeProps['anchor']>;

/* ─── Combined Badge Style ─────────────────────────────────── */

export function getBadgeStyles(
  variant: Variant,
  color: Color,
  size: Size,
  mode: Mode,
): CSSProperties {
  const tokens = badgeSize[size];
  const preset = colorPresets[color];
  const isSolid = variant === 'solid';
  const isDot = mode === 'dot';

  return {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: isDot ? 0 : tokens.padding,
    fontSize: isDot ? 0 : tokens.fontSize,
    fontWeight: tokens.fontWeight,
    lineHeight: isDot ? 0 : 'normal',
    fontFamily: fontFamily.satoshi,
    boxSizing: 'border-box',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    textTransform: 'uppercase',
    backgroundColor: isSolid ? preset.main : preset.mutedBg,
    color: isSolid ? preset.contrast : preset.main,
    ...(isDot && {
      width: tokens.dotSize,
      height: tokens.dotSize,
    }),
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

const anchorPositionMap: Record<
  Anchor,
  { side: CSSProperties; tx: string; ty: string }
> = {
  'top-right': { side: { top: 0, right: 0 }, tx: '50%', ty: '-50%' },
  'top-left': { side: { top: 0, left: 0 }, tx: '-50%', ty: '-50%' },
  'bottom-right': { side: { bottom: 0, right: 0 }, tx: '50%', ty: '50%' },
  'bottom-left': { side: { bottom: 0, left: 0 }, tx: '-50%', ty: '50%' },
};

export function getBadgeAnchorStyle(
  anchor: Anchor,
  offset: [number, number],
): CSSProperties {
  const { side, tx, ty } = anchorPositionMap[anchor];
  const [offsetX, offsetY] = offset;
  const transform =
    offsetX || offsetY
      ? `translate(${tx}, ${ty}) translate(${offsetX}px, ${offsetY}px)`
      : `translate(${tx}, ${ty})`;

  return {
    position: 'absolute',
    ...side,
    transform,
    zIndex: 1,
  };
}

/* ─── Pulse ────────────────────────────────────────────────── */

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
