import React from 'react';
import type { Color, Size } from '../../types';
import { useKeyframes } from '../../hooks';
import {
  getBadgeStyles,
  getBadgeWrapperStyle,
  getBadgeAnchorStyle,
  getBadgePulseStyle,
  pulseKeyframes,
} from './Badge.styles';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'solid' | 'subtle';
  mode?: 'numeric' | 'dot' | 'label';
  value?: number;
  maxValue?: number;
  showZero?: boolean;
  label?: string;
  size?: Size;
  color?: Color;
  pulse?: boolean;
  anchor?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  offset?: [number, number];
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'solid',
  mode = 'label',
  value = 0,
  maxValue = 99,
  showZero = false,
  label,
  size = 'md',
  color = 'ink',
  pulse = false,
  anchor = 'top-right',
  offset = [0, 0],
  children,
  style,
  className,
  ...rest
}) => {
  useKeyframes('fragui-badge-keyframes', pulseKeyframes, pulse);

  // ─── Resolve content & visibility ────────────────────────────
  let content: React.ReactNode = null;
  let isVisible = true;

  switch (mode) {
    case 'numeric': {
      if (value === 0 && !showZero) {
        isVisible = false;
      } else {
        content = value > maxValue ? `${maxValue}+` : `${value}`;
      }
      break;
    }
    case 'dot': {
      content = null;
      break;
    }
    case 'label':
    default: {
      if (!label) {
        isVisible = false;
      } else {
        content = label;
      }
      break;
    }
  }

  // ─── ARIA attributes ─────────────────────────────────────────
  const ariaProps: Record<string, string> = {};

  if (mode === 'dot') {
    ariaProps['aria-hidden'] = 'true';
  } else if (mode === 'label') {
    ariaProps['role'] = 'status';
  }

  // ─── Styles ──────────────────────────────────────────────────
  const badgeStyles = getBadgeStyles(variant, color, size, mode);
  const pulseStyle = pulse ? getBadgePulseStyle() : {};
  const anchorStyle = children ? getBadgeAnchorStyle(anchor, offset) : {};

  const combinedStyle: React.CSSProperties = {
    ...badgeStyles,
    ...pulseStyle,
    ...anchorStyle,
    ...style,
  };

  // ─── Badge element ───────────────────────────────────────────
  const badgeElement = isVisible ? (
    <span
      {...rest}
      data-component="badge"
      data-variant={variant}
      data-mode={mode}
      data-color={color}
      data-size={size}
      {...(children ? { 'data-anchor': anchor } : {})}
      {...(pulse ? { 'data-pulse': 'true' } : {})}
      {...ariaProps}
      style={combinedStyle}
      className={className}
    >
      {content}
    </span>
  ) : null;

  // ─── Render ──────────────────────────────────────────────────
  if (!children) {
    return badgeElement;
  }

  return (
    <span data-component="badge-wrapper" style={getBadgeWrapperStyle()}>
      {children}
      {badgeElement}
    </span>
  );
};
