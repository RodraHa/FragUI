/* ─── Form system types ─────────────────────────────────────────
 * Public types consumed by `Form`, `Field`, and external consumers
 * via `useForm(id)` or `ref`.
 *
 * See the ValidationRule and FormApi types defined below.
 * ────────────────────────────────────────────────────────────── */

/** When validation runs for a field. */
export type ValidateOn = 'change' | 'blur' | 'submit';

/**
 * A single validation rule.
 *
 * Rules are evaluated in order; the first failure stops the chain.
 * All rules have an optional `message`; if omitted the system provides a
 * sensible default in Spanish.
 */
export type ValidationRule =
  | { required: true; message?: string }
  | { minLength: number; message?: string }
  | { maxLength: number; message?: string }
  | { min: number; message?: string }
  | { max: number; message?: string }
  | { pattern: 'email' | 'url' | 'tel' | RegExp; message?: string }
  | { validate: (value: unknown) => string | null | Promise<string | null> };

/**
 * Public API surface of `Form`.
 *
 * Exposed as:
 * - Second argument of `onSubmit(values, api)`.
 * - Return value of `useForm(id)`.
 * - Imperative handle via `ref` on `<Form>`.
 */
export interface FormApi {
  /** Current values of all fields. */
  values: Record<string, unknown>;
  /** Current errors per field. `null` means no error. */
  errors: Record<string, string | null>;
  /** Fields that lost focus at least once or attempted submit. */
  touched: Record<string, boolean>;
  /** `true` if any value differs from `initialValues`. */
  isDirty: boolean;
  /** `true` if no active errors exist in `errors`. */
  isValid: boolean;
  /** `true` while the `onSubmit` Promise is pending. */
  isSubmitting: boolean;
  /** Update a field value programmatically. Does not mark as touched. */
  setValue: (name: string, value: unknown) => void;
  /** Inject an external error (e.g. from backend). Marks the field as touched. */
  setError: (name: string, msg: string) => void;
  /** Clear the error for a specific field. */
  clearError: (name: string) => void;
  /** Restore values to `initialValues`, clear errors and touched. */
  reset: () => void;
  /** Run full validation and call `onSubmit` programmatically. */
  submit: () => Promise<void>;
}
