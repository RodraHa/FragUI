import type { CSSProperties } from 'react';
import { colors } from '../../theme/tokens/colors';
import { fontFamily } from '../../theme/tokens/typography';
import {
  dataListSpacing,
  dataListTypography,
} from '../../theme/tokens/dataList';

export type DataListVariant = 'default' | 'compact' | 'spaced';

export function getContainerStyle(disabled: boolean): CSSProperties {
  return {
    display: 'block',
    border: `${dataListSpacing.borderWidth}px solid ${colors.neutral[500]}`,
    backgroundColor: colors.white,
    fontFamily: fontFamily.satoshi,
    margin: 0,
    padding: 0,
    listStyle: 'none',
    boxSizing: 'border-box',
    opacity: disabled ? dataListSpacing.disabledOpacity : 1,
    outline: 'none',
  };
}

export function getFocusRingStyle(): CSSProperties {
  return {
    outline: `${dataListSpacing.focusRingWidth}px solid ${colors.blue[400]}`,
    outlineOffset: `${dataListSpacing.focusRingOffset}px`,
  };
}

interface ItemStyleArgs {
  variant: DataListVariant;
  isLast: boolean;
  selectable: boolean;
  selected: boolean;
  hovered: boolean;
  focused: boolean;
  disabled: boolean;
}

export function getItemStyle({
  variant,
  isLast,
  selectable,
  selected,
  hovered,
  focused,
  disabled,
}: ItemStyleArgs): CSSProperties {
  const paddingY =
    variant === 'compact'
      ? dataListSpacing.paddingCompactY
      : variant === 'spaced'
        ? dataListSpacing.paddingSpacedY
        : dataListSpacing.paddingDefaultY;
  const paddingX =
    variant === 'compact'
      ? dataListSpacing.paddingCompactX
      : variant === 'spaced'
        ? dataListSpacing.paddingSpacedX
        : dataListSpacing.paddingDefaultX;

  const separatorWidth =
    variant === 'spaced'
      ? dataListSpacing.separatorSpaced
      : dataListSpacing.separatorDefault;

  let background: string = 'transparent';
  if (!disabled && selectable) {
    if (selected && hovered) background = '#C5CBE6';
    else if (selected) background = colors.blue[100];
    else if (hovered) background = colors.neutral[100];
  }

  const style: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: `${paddingY} ${paddingX}`,
    borderBottom: isLast
      ? 'none'
      : `${separatorWidth}px solid ${colors.neutral[200]}`,
    backgroundColor: background,
    cursor: selectable && !disabled ? 'pointer' : 'default',
    transition: 'background-color 0.12s ease',
    opacity: disabled ? dataListSpacing.disabledOpacity : 1,
    userSelect: selectable ? 'none' : 'auto',
    boxSizing: 'border-box',
    position: 'relative',
  };

  if (focused && selectable && !disabled) {
    style.outline = `${dataListSpacing.focusRingWidth}px solid ${colors.blue[400]}`;
    style.outlineOffset = `-${dataListSpacing.focusRingWidth}px`;
  }

  return style;
}

export function getCheckboxStyle(checked: boolean): CSSProperties {
  return {
    width: dataListSpacing.checkboxSize,
    height: dataListSpacing.checkboxSize,
    border: `2px solid ${colors.neutral[500]}`,
    backgroundColor: checked ? colors.neutral[500] : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginRight: dataListSpacing.checkboxGap,
    boxSizing: 'border-box',
    transition: 'background-color 0.1s ease',
  };
}

export function getCheckmarkStyle(): CSSProperties {
  return {
    color: colors.white,
    fontSize: '0.75rem',
    fontWeight: 700,
    lineHeight: 1,
  };
}

export function getItemContentStyle(): CSSProperties {
  return {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: dataListSpacing.contentGap,
  };
}

export function getLabelStyle(variant: DataListVariant): CSSProperties {
  const t =
    variant === 'compact'
      ? dataListTypography.labelCompact
      : dataListTypography.labelDefault;
  return {
    fontSize: t.fontSize,
    fontWeight: t.fontWeight,
    lineHeight: t.lineHeight,
    color: colors.neutral[500],
  };
}

export function getDescriptionStyle(): CSSProperties {
  return {
    fontSize: dataListTypography.description.fontSize,
    fontWeight: dataListTypography.description.fontWeight,
    lineHeight: dataListTypography.description.lineHeight,
    // WCAG 2.1 AA: Figma uses neutral[300] (#999) which fails at 2.84:1.
    // Using neutral[400] (#424242) for 10.5:1.
    color: colors.neutral[400],
  };
}

export function getMetaStyle(): CSSProperties {
  return {
    fontSize: dataListTypography.meta.fontSize,
    fontWeight: dataListTypography.meta.fontWeight,
    lineHeight: dataListTypography.meta.lineHeight,
    // WCAG 2.1 AA: same reasoning as description — shift from neutral[300]
    // to neutral[400] so axe's color-contrast check passes.
    color: colors.neutral[400],
    marginLeft: dataListSpacing.metaMarginLeft,
    flexShrink: 0,
  };
}

export function getEmptyStyle(): CSSProperties {
  return {
    padding: dataListSpacing.emptyPadding,
    textAlign: 'center',
    color: colors.neutral[400],
    fontSize: dataListTypography.empty.fontSize,
    fontWeight: dataListTypography.empty.fontWeight,
    lineHeight: dataListTypography.empty.lineHeight,
    fontFamily: fontFamily.satoshi,
  };
}

/* ─── Skeleton overlay (reuses Card's pattern) ─────────────── */

export const skeletonKeyframes = `
  @keyframes fragui-data-list-skeleton {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.55; }
  }
  @media (prefers-reduced-motion: reduce) {
    [data-datalist-skeleton="true"] {
      animation: none !important;
    }
  }
`;

export function getSkeletonRowStyle(
  variant: DataListVariant,
  isLast: boolean,
): CSSProperties {
  return {
    ...getItemStyle({
      variant,
      isLast,
      selectable: false,
      selected: false,
      hovered: false,
      focused: false,
      disabled: false,
    }),
    cursor: 'default',
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
    animation: 'fragui-data-list-skeleton 1.2s ease-in-out infinite',
  };
}
