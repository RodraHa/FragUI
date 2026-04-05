import React, { useId, useRef, useState } from 'react';
import {
  getButtonStyles,
  iconWrapperStyle,
  spinnerStyle,
  tooltipStyle,
} from './Button.styles';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'ink' | 'sea' | 'brick' | 'ochre' | 'pine' | 'grape';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  radius?: 'none' | 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  effect?: 'none' | 'ripple' | 'scale';
  tooltip?: string;
}

interface RippleItem {
  id: number;
  x: number;
  y: number;
  size: number;
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
  effect = 'ripple',
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
  const [isScaleActive, setIsScaleActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [ripples, setRipples] = useState<RippleItem[]>([]);
  const rippleCounter = useRef(0);

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

  const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
    setIsFocused(true);
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
      e.stopPropagation();
      onKeyDown?.(e);
      return;
    }
    onKeyDown?.(e);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) return;

    if (effect === 'ripple') {
      const rect = e.currentTarget.getBoundingClientRect();
      const rippleSize = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - rippleSize / 2;
      const y = e.clientY - rect.top - rippleSize / 2;
      const id = rippleCounter.current++;

      setRipples((prev) => [...prev, { id, x, y, size: rippleSize }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    }

    onClick?.(e);
  };

  const handleMouseDown = () => {
    if (!isDisabled && effect === 'scale') setIsScaleActive(true);
  };

  const handleMouseUp = () => {
    if (effect === 'scale') setIsScaleActive(false);
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

  const scaleTransform =
    isScaleActive && effect === 'scale' ? 'scale(0.96)' : undefined;

  const buttonContent = loading && loadingText ? loadingText : children;

  return (
    <>
      {/* Inject keyframe for ripple and spinner animations once */}
      <style>{`
        @keyframes fragui-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fragui-ripple {
          from { transform: scale(0); opacity: 0.35; }
          to { transform: scale(1); opacity: 0; }
        }
      `}</style>
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
        {...(loading && loadingText ? { 'aria-live': 'polite' } : {})}
        style={{ ...computedStyles, transform: scaleTransform, ...style }}
        className={className}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {startIcon && (
          <span style={iconWrapperStyle} aria-hidden="true">
            {startIcon}
          </span>
        )}

        {loading && (
          <span
            data-testid="button-spinner"
            style={spinnerStyle}
            aria-hidden="true"
          />
        )}

        {buttonContent}

        {endIcon && (
          <span style={iconWrapperStyle} aria-hidden="true">
            {endIcon}
          </span>
        )}

        {effect === 'ripple' &&
          ripples.map((r) => (
            <span
              key={r.id}
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: r.x,
                top: r.y,
                width: r.size,
                height: r.size,
                borderRadius: '50%',
                backgroundColor: 'currentColor',
                animation: 'fragui-ripple 0.6s ease-out forwards',
                pointerEvents: 'none',
              }}
            />
          ))}

        {tooltipVisible && tooltip && (
          <span id={tooltipId} role="tooltip" style={tooltipStyle}>
            {tooltip}
          </span>
        )}
      </button>
    </>
  );
};
