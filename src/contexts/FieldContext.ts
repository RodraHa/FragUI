import { createContext, useContext } from 'react';
import type { Size, FormStatus } from '../types';

/* ─── FieldContext ───────────────────────────────────────────────
 * Provided by `Field` so that child controls (`InputText`, `Select`)
 * can read label-linking IDs, size, status, disabled, and required
 * without explicit prop drilling (§2.6).
 *
 * Precedence rule: direct props on controls win over context,
 * EXCEPT `disabled` which uses OR-merging so that a disabled ancestor
 * can never be overridden by a child (§2.4).
 * ────────────────────────────────────────────────────────────── */

export interface FieldContextValue {
  /** Field name — passed to the native `name` attribute on the control. */
  name: string;
  /**
   * Disabled state. Merged with OR so ancestor always wins (§2.4).
   * Controls must apply: `(fieldCtx?.disabled ?? false) || ownDisabled`.
   */
  disabled: boolean;
  /**
   * Whether the field is required. Controls use this to:
   * - Set the native `required` attribute (§3 accessibility contract).
   * - Set `aria-required="true"`.
   */
  required: boolean;
  /** Size token to propagate to the child control. */
  size: Size;
  /** Visual status — controls apply this for border/focus-ring color. */
  status: FormStatus;
  /**
   * Stable `id` for the control element (`<input>`, trigger div, etc.).
   * Generated once with `useId()` inside `Field`; does not change
   * across re-renders. Controls apply it as `id` so the `<label>`'s
   * `htmlFor` links correctly.
   */
  inputId: string;
  /**
   * Stable `id` for the helper / error text element.
   * Controls apply it via `aria-describedby` so screen readers announce
   * the sub-text when the control receives focus.
   */
  describedById: string;
}

export const FieldContext = createContext<FieldContextValue | null>(null);

/**
 * Consume `FieldContext`. Returns `null` when no `Field` ancestor exists,
 * allowing standalone usage of `InputText` / `Select` without a wrapper.
 */
export function useFieldContext(): FieldContextValue | null {
  return useContext(FieldContext);
}
