import { createContext, useContext } from 'react';

/* ─── FieldGroupContext ─────────────────────────────────────────
 * Lightweight context for FieldGroup → Field `disabled` propagation.
 *
 * Only carries `disabled` for now. In the Form sprint this will be
 * extended (or replaced) by FormContext, which propagates `disabled`
 * all the way from Form → FieldGroup → Field → control.
 *
 * The cascade rule: if any ancestor in the chain sets
 * `disabled: true`, every descendant is disabled. No child can
 * re-enable itself. Field reads this context and OR-merges it with
 * its own `disabled` prop before writing to FieldContext.
 * ────────────────────────────────────────────────────────────── */

export interface FieldGroupContextValue {
  /**
   * Whether the entire group is disabled. Merged with OR at every level
   * so the ancestor always wins.
   */
  disabled: boolean;
}

export const FieldGroupContext = createContext<FieldGroupContextValue | null>(
  null,
);

/**
 * Consume `FieldGroupContext`. Returns `null` when no `FieldGroup`
 * ancestor exists (standalone `Field` usage).
 */
export function useFieldGroupContext(): FieldGroupContextValue | null {
  return useContext(FieldGroupContext);
}
