import { createContext, useContext } from 'react';
import type { ValidateOn } from '../types/form';

/* ─── FormContext ────────────────────────────────────────────────
 * Internal context provided by `Form` so that `FieldGroup`, `Field`,
 * `InputText`, and `Select` can read/write form state automatically.
 *
 * This interface is NOT part of the public API. External consumers
 * interact with `FormApi` (via `onSubmit`, `useForm(id)`, or `ref`).
 *
 * See spec §2.6 and §10 for the full context hierarchy.
 * ────────────────────────────────────────────────────────────── */

export interface FormContextValue {
  /** Current field values. */
  values: Record<string, unknown>;
  /** Current errors per field. `null` = no error. */
  errors: Record<string, string | null>;
  /** Fields that have been interacted with (blur or submit attempt). */
  touched: Record<string, boolean>;
  /** Whether the form is currently submitting. */
  isSubmitting: boolean;
  /** Global disabled state — cascades to all descendants (§2.4). */
  disabled: boolean;
  /** Global validation timing — overridable per-field via Field.validateOn (§2.5). */
  validateOn: ValidateOn;

  // ── Methods for controls to report changes ────────────────────

  /** Update a field value. Called by InputText/Select on change. */
  setValue: (name: string, value: unknown) => void;
  /** Mark a field as touched. Called by InputText/Select on blur. */
  setTouched: (name: string) => void;
  /**
   * Register a ref for focus-on-error after failed submit (§7 contract).
   * Called by InputText/Select on mount.
   */
  registerRef: (name: string, ref: React.RefObject<HTMLElement | null>) => void;
  /** Unregister a ref on unmount. */
  unregisterRef: (name: string) => void;
}

export const FormContext = createContext<FormContextValue | null>(null);

/**
 * Consume `FormContext`. Returns `null` when no `Form` ancestor exists,
 * allowing standalone usage of all form components without a `Form` wrapper.
 */
export function useFormContext(): FormContextValue | null {
  return useContext(FormContext);
}
