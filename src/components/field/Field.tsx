import React, { useId } from 'react';
import type { Size, FormStatus } from '../../types';
import { FieldContext } from '../../contexts/FieldContext';
import { useFieldGroupContext } from '../../contexts/FieldGroupContext';
import {
  getFieldWrapperStyle,
  getLabelStyle,
  requiredIndicatorStyle,
  getSubTextStyle,
} from './Field.styles';

// TODO (Form sprint): import { useFormContext } from '../../contexts/FormContext';

export interface FieldProps {
  /**
   * Key of the field in the form. Drives `inputId`, `describedById`, and
   * (in the Form sprint) connects to `FormContext` for errors / validation.
   */
  name: string;
  /** Visible label rendered above the control. */
  label?: string | null;
  /** Persistent help text shown below the control. */
  helperText?: string | null;
  /**
   * Explicit error message. In the Form sprint this will be auto-populated
   * from `FormContext.errors[name]` when the field is touched; this prop
   * overrides that automatic value.
   */
  errorText?: string | null;
  /**
   * Visual status of the field.
   * - `"idle"` — default, no validation executed.
   * - `"error"` — in the Form sprint, derived from `errors[name]`.
   * - `"success"` / `"warning"` — manual only (§2.1).
   *
   * @default "idle"
   */
  status?: FormStatus;
  /**
   * Size propagated to the child control via FieldContext.
   * @default "md"
   */
  size?: Size;
  /**
   * Marks the field as required. Shows a visual indicator (*) and propagates
   * `aria-required` to the control via FieldContext. Also sets the native
   * `required` attribute on controls that read it from context.
   * @default false
   */
  required?: boolean;
  /**
   * Disables the field and its child control. Inheritable from FieldGroup
   * (and in the Form sprint, from Form). Ancestor always wins — no child
   * prop can re-enable a field once a parent sets disabled (§2.4).
   * @default false
   */
  disabled?: boolean;
  /**
   * Override of the validation timing. `null` means "inherit from Form".
   * TODO (Form sprint): consumed by FormContext validation logic.
   * @default null
   */
  validateOn?: 'change' | 'blur' | 'submit' | null;
  /**
   * The child control — `InputText`, `Select`, or any element that
   * consumes `FieldContext`.
   */
  children: React.ReactNode;
}

/**
 * Field — universal wrapper for form controls.
 *
 * Manages the label, helper text, and error text for a single control.
 * Provides `FieldContext` to its children so that `InputText`, `Select`,
 * and other controls automatically receive `name`, `inputId`,
 * `describedById`, `size`, `status`, `disabled`, and `required`.
 *
 * Accessibility contract (§3):
 * - Generates a stable `inputId` linking the `<label>` and the control.
 * - Generates a stable `describedById` for `aria-describedby`.
 * - Error text takes priority over helper text for screen readers.
 * - `role="alert"` is set on the sub-text element only when an error
 *   appears dynamically (not on initial render).
 */
export const Field: React.FC<FieldProps> = ({
  name,
  label = null,
  helperText = null,
  errorText = null,
  status = 'idle',
  size = 'md',
  required = false,
  disabled = false,
  validateOn = null,
  children,
}) => {
  // TODO (Form sprint): const formCtx = useFormContext();
  // TODO (Form sprint): auto-derive errorText from formCtx?.errors[name] when touched
  // TODO (Form sprint): auto-derive status === 'error' when formCtx has errors[name] + touched[name]
  // TODO (Form sprint): merge disabled with formCtx?.disabled

  // ── Disabled: OR-merge with FieldGroupContext (§2.4: ancestor wins) ──
  const groupCtx = useFieldGroupContext();
  const effectiveDisabled = groupCtx?.disabled || disabled;

  // ── Stable IDs (React 18+: useId generates hydration-safe IDs) ───────
  const uid = useId();
  const inputId = `field-${name}-input-${uid}`;
  const describedById = `field-${name}-desc-${uid}`;

  // ── Effective status: errorText (even manual) → 'error' display ───────
  const hasError = !!errorText || status === 'error';
  const effectiveStatus: FormStatus = hasError ? 'error' : status;

  // ── Sub-text: error takes priority over helper (§3 accessibility) ─────
  const subText = errorText ?? helperText;
  const showSubText = !!subText;

  // ── Context value provided to children ────────────────────────────────
  const contextValue = {
    name,
    disabled: effectiveDisabled,
    required,
    size,
    status: effectiveStatus,
    inputId,
    describedById,
  };

  return (
    <div
      data-component="field"
      data-size={size}
      data-status={effectiveStatus}
      {...(effectiveDisabled ? { 'data-disabled': 'true' } : {})}
      {...(required ? { 'data-required': 'true' } : {})}
      {...(validateOn ? { 'data-validate-on': validateOn } : {})}
      style={getFieldWrapperStyle()}
    >
      {/* Label */}
      {label != null && (
        <label htmlFor={inputId} style={getLabelStyle(size, effectiveDisabled)}>
          {label}
          {required && (
            <span aria-hidden="true" style={requiredIndicatorStyle}>
              *
            </span>
          )}
        </label>
      )}

      {/* Control — wrapped in context so children consume Field values */}
      <FieldContext.Provider value={contextValue}>
        {children}
      </FieldContext.Provider>

      {/* Helper / Error sub-text */}
      {showSubText && (
        <span
          id={describedById}
          /**
           * `role="alert"` is assigned when showing an error so that
           * errors appearing dynamically (after user interaction) are
           * immediately announced by screen readers (§ open Q1).
           * For helper text we omit the role to avoid interrupting flow.
           */
          role={hasError ? 'alert' : undefined}
          data-field-subtext={hasError ? 'error' : 'helper'}
          style={getSubTextStyle(size, effectiveStatus, hasError)}
        >
          {subText}
        </span>
      )}
    </div>
  );
};

Field.displayName = 'Field';
