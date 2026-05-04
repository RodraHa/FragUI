import React, { useId, useState } from 'react';
import { FieldGroupContext, useFieldGroupContext } from '../../contexts';
import {
  getFieldsetStyle,
  legendResetStyle,
  getCollapseTriggerStyle,
  getChevronStyle,
  getTitleStyle,
  getDescriptionStyle,
  getHeaderStyle,
  getContentGridStyle,
} from './FieldGroup.styles';

// TODO (Form sprint): import { useFormContext } from '../../contexts/FormContext';

export interface FieldGroupProps {
  /**
   * Identifier for the group. Required when `collapsible` is true (used in
   * `aria-controls`). A stable ID is auto-generated when not provided.
   */
  id?: string;
  /** Visible section title. Rendered inside `<legend>`. */
  title?: string | null;
  /** Descriptive text / instructions for the section. */
  description?: string | null;
  /**
   * Number of columns in the internal CSS grid.
   * @default 1
   */
  columns?: 1 | 2 | 3 | 4;
  /**
   * Spacing between child fields.
   * @default "md"
   */
  gap?: 'sm' | 'md' | 'lg';
  /**
   * Enables collapse / expand behaviour for the group.
   * @default false
   */
  collapsible?: boolean;
  /**
   * Controlled collapsed state. Only applied when `collapsible` is `true`.
   * When defined together with `onCollapsedChange`, the component is fully
   * controlled.
   */
  collapsed?: boolean;
  /**
   * Initial collapsed state for uncontrolled usage.
   * Only applied when `collapsible` is `true`.
   * @default false
   */
  defaultCollapsed?: boolean;
  /**
   * Disables all descendant `Field` components via `FieldGroupContext`.
   * Inheritable from `Form` in the Form sprint (§2.4: ancestor always wins).
   * @default false
   */
  disabled?: boolean;
  /** Fired when the collapsed state changes. */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** `Field` components or nested `FieldGroup` components. */
  children: React.ReactNode;
}

/**
 * FieldGroup — layout and grouping wrapper for `Field` components.
 *
 * Uses semantic `<fieldset>` + `<legend>` for native accessibility
 * (screen readers announce the group name when entering the fieldset).
 * Propagates `disabled` to all descendant `Field` components via
 * `FieldGroupContext`.
 *
 * Collapsible behaviour:
 * - Controlled: pass `collapsed` + `onCollapsedChange`.
 * - Uncontrolled: pass `defaultCollapsed` (defaults to false = expanded).
 *
 * Accessibility contract (§4):
 * - Collapse trigger is always a real `<button>`.
 * - `aria-expanded` and `aria-controls` are set on the trigger.
 * - Collapsed content uses the `hidden` attribute to remove it from the
 *   tab order and prevent screen reader access.
 */
export const FieldGroup: React.FC<FieldGroupProps> = ({
  id,
  title = null,
  description = null,
  columns = 1,
  gap = 'md',
  collapsible = false,
  collapsed,
  defaultCollapsed = false,
  disabled = false,
  onCollapsedChange,
  children,
}) => {
  // TODO (Form sprint): const formCtx = useFormContext();
  // TODO (Form sprint): const effectiveDisabled = formCtx?.disabled || parentGroupCtx?.disabled || disabled;

  // OR-merge with parent FieldGroupContext so nested FieldGroups also
  // inherit the ancestor's disabled state (§2.4: ancestor always wins).
  const parentGroupCtx = useFieldGroupContext();
  const effectiveDisabled = (parentGroupCtx?.disabled ?? false) || disabled;

  // ── Stable IDs ─────────────────────────────────────────────────────────
  const uid = useId();
  const groupId = id ?? `field-group-${uid}`;
  const contentId = `${groupId}-content`;

  // ── Controlled vs. uncontrolled collapsed state ────────────────────────
  const isControlled = collapsed !== undefined;
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const isCollapsed =
    collapsible && (isControlled ? collapsed! : internalCollapsed);

  const handleToggle = () => {
    if (effectiveDisabled) return;
    const next = !isCollapsed;
    if (!isControlled) {
      setInternalCollapsed(next);
    }
    onCollapsedChange?.(next);
  };

  // ── Header content presence ────────────────────────────────────────────
  const hasHeader = title != null || description != null;

  return (
    <fieldset
      id={groupId}
      data-component="field-group"
      data-columns={columns}
      data-gap={gap}
      {...(effectiveDisabled ? { 'data-disabled': 'true' } : {})}
      {...(collapsible ? { 'data-collapsible': 'true' } : {})}
      {...(isCollapsed ? { 'data-collapsed': 'true' } : {})}
      style={getFieldsetStyle()}
    >
      {/* Legend — rendered when title is present.
          The legend MUST be the first child of fieldset for correct
          browser rendering and screen reader association. */}
      {title != null && (
        <legend style={legendResetStyle}>
          {collapsible ? (
            /* Collapsible trigger — must be a real <button> (§4 contract) */
            <button
              type="button"
              aria-expanded={!isCollapsed}
              aria-controls={contentId}
              disabled={effectiveDisabled}
              style={getCollapseTriggerStyle(effectiveDisabled)}
              onClick={handleToggle}
            >
              {title}
              <span aria-hidden="true" style={getChevronStyle(isCollapsed)}>
                ▾
              </span>
            </button>
          ) : (
            <span style={getTitleStyle(effectiveDisabled)}>{title}</span>
          )}
        </legend>
      )}

      {/* Description — rendered outside legend so it isn't part of the
          accessible name (legend = name, description = hint) */}
      {description != null && hasHeader && (
        <span
          data-field-group-description
          style={getDescriptionStyle(effectiveDisabled)}
        >
          {description}
        </span>
      )}

      {/* Spacer between header block and grid when both exist */}
      {hasHeader && <div style={getHeaderStyle(true)} aria-hidden="true" />}

      {/* Content grid — hidden attribute removes from tab order when
          collapsed, satisfying the accessibility contract (§4). */}
      <div
        id={contentId}
        role="group"
        aria-labelledby={title != null ? undefined : undefined}
        hidden={isCollapsed || undefined}
        style={isCollapsed ? undefined : getContentGridStyle(columns, gap)}
      >
        <FieldGroupContext.Provider value={{ disabled: effectiveDisabled }}>
          {children}
        </FieldGroupContext.Provider>
      </div>
    </fieldset>
  );
};

FieldGroup.displayName = 'FieldGroup';
