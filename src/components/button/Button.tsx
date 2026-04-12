import React, { useId, useRef, useState } from 'react';
import type { Color, Size } from '../../types';
import {
  getButtonStyles,
  getButtonEffectStyle,
  getButtonWrapperStyle,
  iconWrapperStyle,
  spinnerStyle,
  tooltipStyle,
} from './Button.styles';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'contained' | 'outlined' | 'text';
  color?: Color;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  size?: Size;
  radius?: 'none' | 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  effect?: 'none' | 'press' | 'lift' | 'glow';
  tooltip?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'contained',
  color = 'ink',
  size = 'md',
  radius = 'none',
  disabled = false,
  loading = false,
  loadingText,
  fullWidth = false,
  effect = 'press',
  tooltip,
  startIcon,
  endIcon,
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onKeyDown,
  style,
  className,
  ...rest
}) => {
  const tooltipId = useId();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [isPressActive, setIsPressActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPointerFocusRef = useRef(false);

  const isDisabled = disabled || loading;

  const showTooltip = () => {
    if (tooltip) setTooltipVisible(true);
  };

  const hideTooltip = () => {
    setTooltipVisible(false);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsHovered(true);
    showTooltip();
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsHovered(false);
    hideTooltip();
    onMouseLeave?.(e);
  };

  const handlePointerDown = () => {
    // Mark that the upcoming focus event was triggered by pointer, not keyboard.
    isPointerFocusRef.current = true;
  };

  const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
    if (!isPointerFocusRef.current) {
      setIsFocused(true);
    }
    isPointerFocusRef.current = false;
    showTooltip();
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
    setIsFocused(false);
    hideTooltip();
    onBlur?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Escape') {
      hideTooltip();
      onKeyDown?.(e);
      return;
    }
    if (
      (e.key === ' ' || e.key === 'Enter') &&
      !isDisabled &&
      effect !== 'none'
    ) {
      setIsPressActive(true);
    }
    onKeyDown?.(e);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if ((e.key === ' ' || e.key === 'Enter') && effect !== 'none') {
      setIsPressActive(false);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) return;
    onClick?.(e);
  };

  const handleMouseDown = () => {
    if (!isDisabled && effect !== 'none') setIsPressActive(true);
  };

  const handleMouseUp = () => {
    if (effect !== 'none') setIsPressActive(false);
  };

  // Determine current state for styling
  const buttonState = isFocused ? 'focus' : isHovered ? 'hover' : 'idle';

  const computedStyles = getButtonStyles(
    variant,
    color,
    size,
    radius,
    fullWidth,
    isDisabled,
    buttonState,
  );

  const effectStyle = getButtonEffectStyle(
    effect,
    color,
    isHovered,
    isPressActive,
    isDisabled,
  );

  const buttonContent = loading && loadingText ? loadingText : children;

  return (
    <>
      {/* Inject keyframe for spinner animation once */}
      <style>{`
        @keyframes fragui-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <span style={getButtonWrapperStyle(fullWidth)}>
        <button
          {...rest}
          disabled={isDisabled}
          data-variant={variant}
          data-color={color}
          data-size={size}
          data-radius={radius}
          {...(fullWidth ? { 'data-fullwidth': 'true' } : {})}
          {...(loading ? { 'data-loading': 'true' } : {})}
          data-effect={effect}
          aria-describedby={tooltipVisible && tooltip ? tooltipId : undefined}
          style={{ ...computedStyles, ...effectStyle, ...style }}
          className={className}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onPointerDown={handlePointerDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          {!loading && startIcon && (
            <span style={iconWrapperStyle} aria-hidden="true">
              {startIcon}
            </span>
          )}

          <span {...(loading && loadingText ? { 'aria-live': 'polite' } : {})}>
            {buttonContent}
          </span>

          {loading && (
            <span
              data-testid="button-spinner"
              style={spinnerStyle}
              aria-hidden="true"
            />
          )}

          {!loading && endIcon && (
            <span style={iconWrapperStyle} aria-hidden="true">
              {endIcon}
            </span>
          )}
        </button>

        {tooltipVisible && tooltip && (
          <span id={tooltipId} role="tooltip" style={tooltipStyle}>
            {tooltip}
          </span>
        )}
      </span>
    </>
  );
};
