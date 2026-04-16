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

type BadgeMode = NonNullable<BadgeProps['mode']>;

function resolveContent(
  mode: BadgeMode,
  value: number,
  maxValue: number,
  showZero: boolean,
  label: string | undefined,
): { visible: boolean; content: React.ReactNode } {
  if (mode === 'dot') return { visible: true, content: null };
  if (mode === 'numeric') {
    if (value === 0 && !showZero) return { visible: false, content: null };
    return {
      visible: true,
      content: value > maxValue ? `${maxValue}+` : `${value}`,
    };
  }
  if (!label) return { visible: false, content: null };
  return { visible: true, content: label };
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

  const { visible, content } = resolveContent(
    mode,
    value,
    maxValue,
    showZero,
    label,
  );
  const hasAnchor = Boolean(children);

  const badgeElement = visible ? (
    <span
      {...rest}
      data-component="badge"
      data-variant={variant}
      data-mode={mode}
      data-color={color}
      data-size={size}
      data-anchor={hasAnchor ? anchor : undefined}
      data-pulse={pulse ? 'true' : undefined}
      aria-hidden={mode === 'dot' ? true : undefined}
      role={mode === 'label' ? 'status' : undefined}
      style={{
        ...getBadgeStyles(variant, color, size, mode),
        ...(pulse && getBadgePulseStyle()),
        ...(hasAnchor && getBadgeAnchorStyle(anchor, offset)),
        ...style,
      }}
      className={className}
    >
      {content}
    </span>
  ) : null;

  if (!hasAnchor) return badgeElement;

  return (
    <span data-component="badge-wrapper" style={getBadgeWrapperStyle()}>
      {children}
      {badgeElement}
    </span>
  );
};
