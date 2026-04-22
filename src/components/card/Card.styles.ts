import type { CSSProperties } from 'react';
import { colors } from '../../theme/tokens/colors';
import { fontFamily } from '../../theme/tokens/typography';
import { cardSpacing, cardTypography } from '../../theme/tokens/card';

export type CardVariant = 'elevated' | 'outlined' | 'ghost';
export type InteractiveVisualState = 'idle' | 'hover' | 'pressed';

export function getRootStyle(
  variant: CardVariant,
  interactive: boolean,
  disabled: boolean,
  state: InteractiveVisualState,
): CSSProperties {
  const base: CSSProperties = {
    display: 'block',
    position: 'relative',
    fontFamily: fontFamily.satoshi,
    color: colors.neutral[500],
    boxSizing: 'border-box',
    textAlign: 'left',
    width: '100%',
    opacity: disabled ? cardSpacing.disabledOpacity : 1,
    transition:
      'transform 0.12s ease, box-shadow 0.12s ease, opacity 0.15s ease',
    border: 'none',
    backgroundColor: variant === 'ghost' ? 'transparent' : colors.white,
  };

  if (variant === 'elevated' || variant === 'outlined') {
    base.border = `${cardSpacing.borderWidth}px solid ${colors.neutral[500]}`;
  }

  if (variant === 'elevated') {
    base.boxShadow = `${cardSpacing.shadowOffset}px ${cardSpacing.shadowOffset}px 0 0 ${colors.neutral[500]}`;
  }

  if (interactive && !disabled) {
    base.cursor = 'pointer';
    base.userSelect = 'none';

    if (variant === 'elevated') {
      if (state === 'hover') {
        base.transform = `translate(-${cardSpacing.hoverTranslate}px, -${cardSpacing.hoverTranslate}px)`;
        base.boxShadow = `${cardSpacing.shadowHoverOffset}px ${cardSpacing.shadowHoverOffset}px 0 0 ${colors.neutral[500]}`;
      } else if (state === 'pressed') {
        base.transform = `translate(${cardSpacing.pressedTranslate}px, ${cardSpacing.pressedTranslate}px)`;
        base.boxShadow = `${cardSpacing.shadowPressedOffset}px ${cardSpacing.shadowPressedOffset}px 0 0 ${colors.neutral[500]}`;
      }
    } else if (variant === 'outlined') {
      if (state === 'hover') {
        base.backgroundColor = colors.neutral[100];
      } else if (state === 'pressed') {
        base.backgroundColor = colors.neutral[200];
      }
    } else if (variant === 'ghost') {
      if (state === 'hover' || state === 'pressed') {
        base.backgroundColor = colors.neutral[100];
      }
    }
  }

  if (disabled) {
    base.cursor = 'not-allowed';
  }

  return base;
}

export function getFocusRingStyle(): CSSProperties {
  return {
    outline: `${cardSpacing.focusRingWidth}px solid ${colors.blue[400]}`,
    outlineOffset: `${cardSpacing.focusRingOffset}px`,
  };
}

export function getMediaStyle(): CSSProperties {
  return {
    height: cardSpacing.mediaHeight,
    backgroundColor: colors.neutral[100],
    borderBottom: `1px solid ${colors.neutral[200]}`,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
}

export function getBodyStyle(): CSSProperties {
  return {
    padding: cardSpacing.bodyPadding,
    display: 'flex',
    flexDirection: 'column',
  };
}

export function getEyebrowStyle(): CSSProperties {
  return {
    fontSize: cardTypography.eyebrow.fontSize,
    fontWeight: cardTypography.eyebrow.fontWeight,
    letterSpacing: cardTypography.eyebrow.letterSpacing,
    textTransform: cardTypography.eyebrow.textTransform,
    lineHeight: cardTypography.eyebrow.lineHeight,
    // WCAG 2.1 AA: use neutral[400] (#424242, 10.5:1) instead of neutral[300].
    color: colors.neutral[400],
    marginBottom: cardSpacing.slotGap,
  };
}

export function getTitleStyle(): CSSProperties {
  return {
    fontSize: cardTypography.title.fontSize,
    fontWeight: cardTypography.title.fontWeight,
    letterSpacing: cardTypography.title.letterSpacing,
    lineHeight: cardTypography.title.lineHeight,
    color: colors.neutral[500],
    margin: 0,
    marginBottom: cardSpacing.titleMarginBottom,
  };
}

export function getDescriptionStyle(): CSSProperties {
  return {
    fontSize: cardTypography.description.fontSize,
    fontWeight: cardTypography.description.fontWeight,
    lineHeight: cardTypography.description.lineHeight,
    color: colors.neutral[400],
    marginBottom: cardSpacing.descriptionMarginBottom,
  };
}

export function getActionsStyle(): CSSProperties {
  return {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: cardSpacing.actionsGap,
    marginTop: 'auto',
  };
}

/* ─── Loading / Skeleton ───────────────────────────────────────
 * Brutalist block skeleton overlay. Respects prefers-reduced-motion
 * (animation is disabled globally via the keyframes sheet).
 * ────────────────────────────────────────────────────────────── */

export const skeletonKeyframes = `
  @keyframes fragui-card-skeleton {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.55; }
  }
  @media (prefers-reduced-motion: reduce) {
    [data-card-skeleton="true"] {
      animation: none !important;
    }
  }
`;

export function getSkeletonOverlayStyle(): CSSProperties {
  return {
    position: 'absolute',
    inset: 0,
    backgroundColor: colors.white,
    display: 'flex',
    flexDirection: 'column',
    gap: cardSpacing.slotGap,
    padding: cardSpacing.bodyPadding,
    zIndex: 1,
  };
}

export function getSkeletonBlockStyle(
  width: string,
  height: string,
  opacity = 1,
): CSSProperties {
  return {
    width,
    height,
    backgroundColor: colors.neutral[200],
    opacity,
    animation: 'fragui-card-skeleton 1.2s ease-in-out infinite',
  };
}
