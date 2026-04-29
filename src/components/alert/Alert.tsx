import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAutoHide, useKeyframes } from '../../hooks';
import { statusToColor } from '../../theme/presets';
import type { AlertStatus } from '../../theme/presets';
import { alertSpacing } from '../../theme/tokens/alert';
import {
  BxsCheckSquare,
  BxsInfoSquare,
  BxsXSquare,
  CloseBold,
  WarningFilled,
} from '../../assets/icons';
import {
  alertBannerHeaderStyle,
  alertDescriptionStyle,
  alertKeyframes,
  alertTitleStyle,
  alertActionSlotStyle,
  alertFocusStyles,
  getAlertActionButtonConfig,
  getAlertAnimationStyle,
  getAlertBodyStyle,
  getAlertCloseButtonStyle,
  getAlertCloseSlotStyle,
  getAlertContainerStyle,
  getAlertIconSlotStyle,
} from './Alert.styles';
import { Button } from '../button/Button';

export type { AlertStatus };
export type AlertVariant = 'filled' | 'outlined' | 'stripe' | 'banner';
export type AlertAnimation = 'none' | 'fade' | 'slide';

export interface AlertAction {
  label: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: AlertStatus;
  variant?: AlertVariant;
  icon?: React.ReactNode;
  showIcon?: boolean;
  title?: string;
  description?: string;
  action?: AlertAction;
  dismissible?: boolean;
  autoHideDuration?: number;
  onClose?: () => void;
  autoFocus?: boolean;
  animation?: AlertAnimation;
  elevated?: boolean;
}

const defaultIconByStatus: Record<AlertStatus, React.ReactNode> = {
  success: <BxsCheckSquare size={alertSpacing.iconSize} />,
  info: <BxsInfoSquare size={alertSpacing.iconSize} />,
  warning: <WarningFilled size={alertSpacing.iconSize} />,
  error: <BxsXSquare size={alertSpacing.iconSize} />,
};

export const Alert: React.FC<AlertProps> = ({
  status = 'info',
  variant = 'filled',
  icon,
  showIcon = false,
  title,
  description,
  action,
  dismissible = false,
  autoHideDuration,
  onClose,
  autoFocus = false,
  animation = 'none',
  elevated = false,
  style,
  className,
  ...rest
}) => {
  useKeyframes('fragui-alert-keyframes', alertKeyframes, animation !== 'none');
  useKeyframes('fragui-alert-focus', alertFocusStyles, true);

  const [open, setOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleClose = useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [onClose]);

  // autoHideDuration is not compatible with error / warning
  const autoHideEnabled = open && status !== 'error' && status !== 'warning';

  const { pause, resume } = useAutoHide({
    duration: autoHideDuration,
    enabled: autoHideEnabled,
    onHide: handleClose,
  });

  useEffect(() => {
    if (open && autoFocus) {
      containerRef.current?.focus();
    }
  }, [open, autoFocus]);

  // Native listeners: ensures `dispatchEvent('mouseenter')` in tests — and
  // real pointer interactions — reliably toggle the pause state regardless
  // of React's synthetic event plumbing.
  useEffect(() => {
    if (!open) return;
    const node = containerRef.current;
    if (!node) return;

    const onEnter = () => pause();
    const onLeave = () => resume();
    const onFocusIn = () => pause();
    const onFocusOut = (e: FocusEvent) => {
      const next = e.relatedTarget as Node | null;
      if (!next || !node.contains(next)) resume();
    };

    node.addEventListener('mouseenter', onEnter);
    node.addEventListener('mouseleave', onLeave);
    node.addEventListener('focusin', onFocusIn);
    node.addEventListener('focusout', onFocusOut);
    return () => {
      node.removeEventListener('mouseenter', onEnter);
      node.removeEventListener('mouseleave', onLeave);
      node.removeEventListener('focusin', onFocusIn);
      node.removeEventListener('focusout', onFocusOut);
    };
  }, [open, pause, resume]);

  if (!open) return null;

  const color = statusToColor[status];
  const role: 'alert' | 'status' =
    status === 'error' || status === 'warning' ? 'alert' : 'status';

  const resolvedIcon = showIcon ? (icon ?? defaultIconByStatus[status]) : null;

  const containerStyle: React.CSSProperties = {
    ...getAlertContainerStyle(variant, color, elevated),
    ...getAlertAnimationStyle(animation),
    ...style,
  };

  const isBanner = variant === 'banner';

  const iconNode = resolvedIcon && (
    <span
      data-component="alert-icon"
      aria-hidden="true"
      style={getAlertIconSlotStyle(variant, color)}
    >
      {resolvedIcon}
    </span>
  );

  const titleNode = title && <strong style={alertTitleStyle}>{title}</strong>;

  const actionNode =
    action &&
    (() => {
      const cfg = getAlertActionButtonConfig(variant, color);
      return (
        <div data-component="alert-action" style={alertActionSlotStyle}>
          <Button
            variant={cfg.variant}
            color={cfg.color}
            size="sm"
            style={cfg.style}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        </div>
      );
    })();

  const closeNode = dismissible && (
    <span style={getAlertCloseSlotStyle(variant, color)}>
      <button
        type="button"
        aria-label="Cerrar alerta"
        onClick={handleClose}
        style={getAlertCloseButtonStyle(variant, color)}
      >
        <CloseBold size={alertSpacing.closeIconSize} aria-hidden="true" />
      </button>
    </span>
  );

  return (
    <div
      {...rest}
      ref={containerRef}
      role={role}
      data-component="alert"
      data-status={status}
      data-variant={variant}
      data-animation={animation}
      tabIndex={autoFocus ? -1 : undefined}
      className={className}
      style={containerStyle}
    >
      {!isBanner && iconNode}
      <div style={getAlertBodyStyle(variant)}>
        {isBanner ? (
          <div style={alertBannerHeaderStyle}>
            {iconNode}
            {titleNode}
          </div>
        ) : (
          titleNode
        )}
        {description && <p style={alertDescriptionStyle}>{description}</p>}
        {actionNode}
      </div>
      {closeNode}
    </div>
  );
};
