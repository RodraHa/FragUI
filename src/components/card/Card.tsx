import React, { useRef, useState } from 'react';
import { useKeyframes } from '../../hooks';
import {
  getActionsStyle,
  getBodyStyle,
  getDescriptionStyle,
  getEyebrowStyle,
  getFocusRingStyle,
  getMediaStyle,
  getRootStyle,
  getSkeletonBlockStyle,
  getSkeletonOverlayStyle,
  getTitleStyle,
  skeletonKeyframes,
  type CardVariant,
  type InteractiveVisualState,
} from './Card.styles';

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  variant?: CardVariant;
  interactive?: boolean;
  disabled?: boolean;
  loading?: boolean;
  as?: React.ElementType;
  href?: string;
  children?: React.ReactNode;
}

type ActivationEvent =
  | React.MouseEvent<HTMLElement>
  | React.KeyboardEvent<HTMLElement>;

function resolveElement(
  as: React.ElementType | undefined,
  interactive: boolean,
): React.ElementType {
  if (interactive) {
    if (as === 'a') return 'a';
    return 'button';
  }
  return as ?? 'article';
}

export const Card: React.FC<CardProps> & {
  Media: typeof CardMedia;
  Body: typeof CardBody;
  Eyebrow: typeof CardEyebrow;
  Title: typeof CardTitle;
  Description: typeof CardDescription;
  Actions: typeof CardActions;
} = ({
  variant = 'elevated',
  interactive = false,
  disabled = false,
  loading = false,
  as,
  children,
  onClick,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onFocus,
  onBlur,
  style,
  className,
  ...rest
}) => {
  useKeyframes('fragui-card-skeleton-keyframes', skeletonKeyframes, loading);

  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPointerFocusRef = useRef(false);
  const rootRef = useRef<HTMLElement | null>(null);

  const isInert = disabled || loading;
  const Element = resolveElement(as, interactive);

  const visualState: InteractiveVisualState =
    interactive && !isInert
      ? isPressed
        ? 'pressed'
        : isHovered
          ? 'hover'
          : 'idle'
      : 'idle';

  const showFocusRing = interactive && !isInert && isFocused;

  const triggerClick = (e: ActivationEvent) => {
    if (isInert || !interactive) return;
    // If the event originated from an interactive descendant (button, link,
    // form control, …) do not fire the Card's onClick. This keeps the
    // "clickable card with inner controls" pattern sane.
    const target = e.target as HTMLElement;
    if (target !== e.currentTarget) {
      const interactiveSelector =
        'button, a, input, textarea, select, [role="button"], [role="link"]';
      if (target.closest(interactiveSelector) !== e.currentTarget) {
        return;
      }
    }
    onClick?.(e as unknown as React.MouseEvent<HTMLElement>);
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    triggerClick(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(e);
    if (!interactive || isInert) return;
    if (e.key === 'Enter' || e.key === ' ') {
      if (Element === 'button' || Element === 'a') {
        // Native button/a handles Enter; Space on <a> needs manual handling.
        if (Element === 'a' && e.key === ' ') {
          e.preventDefault();
          setIsPressed(true);
          triggerClick(e);
        }
      } else {
        e.preventDefault();
        setIsPressed(true);
        triggerClick(e);
      }
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setIsPressed(false);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (!isInert && interactive) setIsHovered(true);
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    setIsHovered(false);
    setIsPressed(false);
    onMouseLeave?.(e);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    if (!isInert && interactive) setIsPressed(true);
    isPointerFocusRef.current = true;
    onMouseDown?.(e);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLElement>) => {
    setIsPressed(false);
    onMouseUp?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
    if (!isPointerFocusRef.current) setIsFocused(true);
    isPointerFocusRef.current = false;
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    setIsFocused(false);
    setIsPressed(false);
    onBlur?.(e);
  };

  const computedStyle = {
    ...getRootStyle(variant, interactive, isInert, visualState),
    ...(showFocusRing ? getFocusRingStyle() : {}),
    ...style,
  };

  const interactiveProps = interactive
    ? Element === 'button'
      ? { type: 'button' as const, disabled: isInert }
      : { role: undefined as undefined }
    : {};

  return (
    <Element
      ref={rootRef as React.Ref<HTMLElement>}
      data-component="card"
      data-variant={variant}
      data-state={visualState}
      {...(interactive ? { 'data-interactive': 'true' } : {})}
      {...(loading ? { 'data-loading': 'true' } : {})}
      {...(disabled ? { 'data-disabled': 'true' } : {})}
      aria-disabled={isInert && interactive ? true : undefined}
      aria-busy={loading || undefined}
      tabIndex={interactive && !isInert ? 0 : undefined}
      style={computedStyle}
      className={className}
      onClick={interactive ? handleClick : onClick}
      onKeyDown={interactive ? handleKeyDown : onKeyDown}
      onKeyUp={interactive ? handleKeyUp : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...interactiveProps}
      {...rest}
    >
      {children}
      {loading && (
        <div
          data-card-skeleton="true"
          data-testid="card-skeleton-overlay"
          aria-hidden="true"
          style={getSkeletonOverlayStyle()}
        >
          <div style={getSkeletonBlockStyle('40%', '0.875rem')} />
          <div style={getSkeletonBlockStyle('70%', '1.25rem')} />
          <div style={getSkeletonBlockStyle('90%', '0.875rem', 0.8)} />
          <div style={getSkeletonBlockStyle('80%', '0.875rem', 0.8)} />
          <div
            style={{
              ...getSkeletonBlockStyle('35%', '2rem', 0.9),
              marginTop: 'auto',
            }}
          />
        </div>
      )}
    </Element>
  );
};

/* ─── Compound components ──────────────────────────────────── */

export interface CardMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const CardMedia: React.FC<CardMediaProps> = ({
  children,
  style,
  className,
  ...rest
}) => (
  <div
    data-card-slot="media"
    style={{ ...getMediaStyle(), ...style }}
    className={className}
    {...rest}
  >
    {children}
  </div>
);

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const CardBody: React.FC<CardBodyProps> = ({
  children,
  style,
  className,
  ...rest
}) => (
  <div
    data-card-slot="body"
    style={{ ...getBodyStyle(), ...style }}
    className={className}
    {...rest}
  >
    {children}
  </div>
);

export interface CardEyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
}

const CardEyebrow: React.FC<CardEyebrowProps> = ({
  children,
  style,
  className,
  ...rest
}) => (
  <span
    data-card-slot="eyebrow"
    style={{ ...getEyebrowStyle(), ...style }}
    className={className}
    {...rest}
  >
    {children}
  </span>
);

export interface CardTitleProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  children?: React.ReactNode;
}

const CardTitle: React.FC<CardTitleProps> = ({
  as: As = 'div',
  children,
  style,
  className,
  ...rest
}) => (
  <As
    data-card-slot="title"
    style={{ ...getTitleStyle(), ...style }}
    className={className}
    {...rest}
  >
    {children}
  </As>
);

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
  style,
  className,
  ...rest
}) => (
  <p
    data-card-slot="description"
    style={{ ...getDescriptionStyle(), ...style }}
    className={className}
    {...rest}
  >
    {children}
  </p>
);

export interface CardActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const CardActions: React.FC<CardActionsProps> = ({
  children,
  style,
  className,
  ...rest
}) => (
  <div
    data-card-slot="actions"
    style={{ ...getActionsStyle(), ...style }}
    className={className}
    {...rest}
  >
    {children}
  </div>
);

Card.Media = CardMedia;
Card.Body = CardBody;
Card.Eyebrow = CardEyebrow;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Actions = CardActions;

Card.Media.displayName = 'Card.Media';
Card.Body.displayName = 'Card.Body';
Card.Eyebrow.displayName = 'Card.Eyebrow';
Card.Title.displayName = 'Card.Title';
Card.Description.displayName = 'Card.Description';
Card.Actions.displayName = 'Card.Actions';
