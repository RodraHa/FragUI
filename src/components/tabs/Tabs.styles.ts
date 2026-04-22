import type { CSSProperties } from 'react';
import { colors } from '../../theme/tokens/colors';
import { fontFamily } from '../../theme/tokens/typography';
import { tabsSpacing, tabsTypography } from '../../theme/tokens/tabs';

export type Orientation = 'horizontal' | 'vertical';
export type TabVisualState = 'idle' | 'hover' | 'active' | 'disabled';

export function getContainerStyle(
  orientation: Orientation,
  disabled: boolean,
): CSSProperties {
  return {
    display: 'flex',
    flexDirection: orientation === 'horizontal' ? 'column' : 'row',
    border: `${tabsSpacing.borderWidth}px solid ${colors.neutral[500]}`,
    backgroundColor: colors.white,
    fontFamily: fontFamily.satoshi,
    boxSizing: 'border-box',
    opacity: disabled ? tabsSpacing.disabledOpacity : 1,
  };
}

export function getTablistStyle(orientation: Orientation): CSSProperties {
  const isHorizontal = orientation === 'horizontal';
  return {
    display: 'flex',
    flexDirection: isHorizontal ? 'row' : 'column',
    [isHorizontal ? 'borderBottom' : 'borderRight']:
      `${tabsSpacing.separatorWidth}px solid ${colors.neutral[200]}`,
    flexShrink: 0,
  };
}

export function getTabStyle(
  state: TabVisualState,
  orientation: Orientation,
): CSSProperties {
  const color =
    state === 'disabled'
      ? colors.neutral[200]
      : state === 'idle'
        ? colors.neutral[300]
        : colors.neutral[500];

  const background = state === 'hover' ? colors.neutral[100] : 'transparent';

  const fontWeight =
    state === 'active'
      ? tabsTypography.label.fontWeightActive
      : tabsTypography.label.fontWeightIdle;

  return {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${tabsSpacing.tabPaddingY} ${tabsSpacing.tabPaddingX}`,
    fontFamily: fontFamily.satoshi,
    fontSize: tabsTypography.label.fontSize,
    fontWeight,
    letterSpacing: tabsTypography.label.letterSpacing,
    color,
    backgroundColor: background,
    border: 'none',
    outline: 'none',
    cursor: state === 'disabled' ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    transition: 'color 0.15s ease, background-color 0.15s ease',
    textAlign: orientation === 'vertical' ? 'left' : 'center',
    boxSizing: 'border-box',
  };
}

export function getFocusRingStyle(): CSSProperties {
  return {
    outline: `2px solid ${colors.blue[400]}`,
    outlineOffset: '-2px',
  };
}

export function getIndicatorStyle(orientation: Orientation): CSSProperties {
  const isHorizontal = orientation === 'horizontal';
  return {
    position: 'absolute',
    backgroundColor: colors.neutral[500],
    ...(isHorizontal
      ? {
          left: 0,
          right: 0,
          bottom: -tabsSpacing.separatorWidth,
          height: tabsSpacing.indicatorSize,
        }
      : {
          top: 0,
          bottom: 0,
          right: -tabsSpacing.separatorWidth,
          width: tabsSpacing.indicatorSize,
        }),
  };
}

export function getPanelStyle(): CSSProperties {
  return {
    padding: tabsSpacing.panelPadding,
    color: colors.neutral[400],
    fontFamily: fontFamily.satoshi,
    fontSize: tabsTypography.label.fontSize,
    lineHeight: 1.5,
    flex: 1,
    minWidth: 0,
  };
}
