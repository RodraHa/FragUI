import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { FormApi, ValidateOn, ValidationRule } from '../../types/form';
import { FormContext } from '../../contexts/FormContext';
import type { FormContextValue } from '../../contexts/FormContext';
import { registerForm, unregisterForm } from '../../hooks/useForm';
import { validateField, validateAllFields } from './validation';
import { getFormStyle } from './Form.styles';

/* ─── Props ─────────────────────────────────────────────────────── */

export interface FormProps {
  /**
   * Unique identifier. Required when using `useForm(id)` to access
   * `FormApi` from outside the JSX tree. If omitted, `FormApi` is
   * only accessible via `ref` or as the second argument of `onSubmit`.
   */
  id?: string;
  /**
   * Initial values for all fields. Also used as reference for
   * `reset()` and `isDirty` calculation.
   * @default {}
   */
  initialValues?: Record<string, unknown>;
  /**
   * Validation rules per field (§2.8).
   * @default {}
   */
  validationRules?: Record<string, ValidationRule[]>;
  /**
   * Global validation timing. Overridable per-field via `Field.validateOn` (§2.5).
   * @default "submit"
   */
  validateOn?: ValidateOn;
  /**
   * Disables the entire form tree via context (§2.4).
   * @default false
   */
  disabled?: boolean;
  /**
   * Submit handler. Receives current values and `FormApi`.
   * If it returns a Promise, `Form` waits for it.
   */
  onSubmit: (
    values: Record<string, unknown>,
    api: FormApi,
  ) => void | Promise<void>;
  /**
   * Called after `onSubmit` resolves successfully.
   * @default null
   */
  onSuccess?: ((values: Record<string, unknown>) => void) | null;
  /**
   * Called if `onSubmit` throws or its Promise rejects.
   * If not defined, the error bubbles normally.
   * @default null
   */
  onError?: ((error: Error, values: Record<string, unknown>) => void) | null;
  /**
   * Reset to `initialValues` after a successful submit.
   * @default false
   */
  resetOnSuccess?: boolean;
  /** Form contents: FieldGroup, Field, controls, buttons. */
  children: React.ReactNode;
}

/* ─── Component ─────────────────────────────────────────────────── */

/**
 * Form — state, validation, and submission container.
 *
 * Provides `FormContext` so that `FieldGroup`, `Field`, `InputText`,
 * and `Select` automatically read/write form state.
 *
 * Accessibility contract (§7):
 * - Preserves native `<form>` behaviour (Enter submits).
 * - Focuses the first invalid field after a failed submit.
 * - Exposes `FormApi` via `ref` (imperative handle).
 */
export const Form = React.forwardRef<FormApi, FormProps>(
  (
    {
      id,
      initialValues = {},
      validationRules = {},
      validateOn = 'submit',
      disabled = false,
      onSubmit,
      onSuccess = null,
      onError = null,
      resetOnSuccess = false,
      children,
    },
    ref,
  ) => {
    // ── State ─────────────────────────────────────────────────────
    const [values, setValues] = useState<Record<string, unknown>>(() => ({
      ...initialValues,
    }));
    const [errors, setErrors] = useState<Record<string, string | null>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ── Refs for stable callbacks ─────────────────────────────────
    const initialValuesRef = useRef(initialValues);
    const validationRulesRef = useRef(validationRules);
    const validateOnRef = useRef(validateOn);
    const onSubmitRef = useRef(onSubmit);
    const onSuccessRef = useRef(onSuccess);
    const onErrorRef = useRef(onError);
    const resetOnSuccessRef = useRef(resetOnSuccess);
    const valuesRef = useRef(values);
    const errorsRef = useRef(errors);
    const touchedRef = useRef(touched);
    const isSubmittingRef = useRef(isSubmitting);

    // Keep refs in sync with latest props / state
    initialValuesRef.current = initialValues;
    validationRulesRef.current = validationRules;
    validateOnRef.current = validateOn;
    onSubmitRef.current = onSubmit;
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
    resetOnSuccessRef.current = resetOnSuccess;
    valuesRef.current = values;
    errorsRef.current = errors;
    touchedRef.current = touched;
    isSubmittingRef.current = isSubmitting;

    // ── Field ref registry (for focus-on-error) ──────────────────
    const fieldRefsMap = useRef(
      new Map<string, React.RefObject<HTMLElement | null>>(),
    );

    const registerRef = useCallback(
      (name: string, fieldRef: React.RefObject<HTMLElement | null>) => {
        fieldRefsMap.current.set(name, fieldRef);
      },
      [],
    );

    const unregisterRef = useCallback((name: string) => {
      fieldRefsMap.current.delete(name);
    }, []);

    // ── Derived state ─────────────────────────────────────────────
    const isDirty = useMemo(() => {
      const init = initialValuesRef.current;
      return Object.keys({ ...init, ...values }).some(
        (key) => values[key] !== init[key],
      );
    }, [values]);

    const isValid = useMemo(() => {
      return Object.values(errors).every((e) => e == null);
    }, [errors]);

    // ── Stable methods ────────────────────────────────────────────

    const reset = useCallback(() => {
      const init = initialValuesRef.current;
      setValues({ ...init });
      setErrors({});
      setTouched({});
    }, []);

    const handleSetValue = useCallback((name: string, value: unknown) => {
      setValues((prev) => ({ ...prev, [name]: value }));

      // Validate on change if configured (§2.5)
      if (validateOnRef.current === 'change') {
        const rules = validationRulesRef.current[name];
        if (rules) {
          void validateField(value, rules).then((error) => {
            setErrors((prev) => ({ ...prev, [name]: error }));
          });
        }
      }
    }, []);

    const handleSetTouched = useCallback((name: string) => {
      setTouched((prev) => ({ ...prev, [name]: true }));

      // Validate on blur if configured (§2.5)
      if (validateOnRef.current === 'blur') {
        const rules = validationRulesRef.current[name];
        if (rules) {
          const currentValue = valuesRef.current[name];
          void validateField(currentValue, rules).then((error) => {
            setErrors((prev) => ({ ...prev, [name]: error }));
          });
        }
      }
    }, []);

    const handleSetError = useCallback((name: string, msg: string) => {
      setErrors((prev) => ({ ...prev, [name]: msg }));
      setTouched((prev) => ({ ...prev, [name]: true }));
    }, []);

    const handleClearError = useCallback((name: string) => {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }, []);

    // ── Focus first invalid field ─────────────────────────────────
    const focusFirstInvalid = useCallback(
      (currentErrors: Record<string, string | null>) => {
        // fieldRefsMap preserves insertion order (Map guarantee).
        // Controls register in render order, which matches DOM order.
        for (const [name] of fieldRefsMap.current) {
          if (currentErrors[name] != null) {
            const fieldRef = fieldRefsMap.current.get(name);
            fieldRef?.current?.focus();
            return;
          }
        }
      },
      [],
    );

    // ── Submit logic ──────────────────────────────────────────────
    const handleSubmitInternal = useCallback(async () => {
      // 1. Mark all fields as touched
      const allTouched: Record<string, boolean> = {};
      const allFieldNames = new Set([
        ...Object.keys(valuesRef.current),
        ...Object.keys(validationRulesRef.current),
      ]);
      for (const name of allFieldNames) {
        allTouched[name] = true;
      }
      setTouched(allTouched);

      // 2. Validate all fields
      const allErrors = await validateAllFields(
        valuesRef.current,
        validationRulesRef.current,
      );
      setErrors(allErrors);

      // 3. If errors → focus first invalid, abort
      const hasErrors = Object.values(allErrors).some((e) => e != null);
      if (hasErrors) {
        focusFirstInvalid(allErrors);
        return;
      }

      // 4. Call onSubmit
      setIsSubmitting(true);
      try {
        await onSubmitRef.current(valuesRef.current, getApi());
        onSuccessRef.current?.(valuesRef.current);
        if (resetOnSuccessRef.current) {
          reset();
        }
      } catch (error) {
        if (onErrorRef.current) {
          onErrorRef.current(error as Error, valuesRef.current);
        } else {
          throw error;
        }
      } finally {
        setIsSubmitting(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusFirstInvalid, reset]);

    // ── Build FormApi snapshot ─────────────────────────────────────
    function getApi(): FormApi {
      return {
        values: valuesRef.current,
        errors: errorsRef.current,
        touched: touchedRef.current,
        isDirty: Object.keys({
          ...initialValuesRef.current,
          ...valuesRef.current,
        }).some((k) => valuesRef.current[k] !== initialValuesRef.current[k]),
        isValid: Object.values(errorsRef.current).every((e) => e == null),
        isSubmitting: isSubmittingRef.current,
        setValue: handleSetValue,
        setError: handleSetError,
        clearError: handleClearError,
        reset,
        submit: handleSubmitInternal,
      };
    }

    // ── Imperative handle (ref) ───────────────────────────────────
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useImperativeHandle(ref, () => getApi(), [
      values,
      errors,
      touched,
      isSubmitting,
      handleSetValue,
      handleSetError,
      handleClearError,
      reset,
      handleSubmitInternal,
    ]);

    // ── Global registry for useForm(id) ───────────────────────────
    const apiSnapshot = useMemo<FormApi>(
      () => ({
        values,
        errors,
        touched,
        isDirty,
        isValid,
        isSubmitting,
        setValue: handleSetValue,
        setError: handleSetError,
        clearError: handleClearError,
        reset,
        submit: handleSubmitInternal,
      }),
      [
        values,
        errors,
        touched,
        isDirty,
        isValid,
        isSubmitting,
        handleSetValue,
        handleSetError,
        handleClearError,
        reset,
        handleSubmitInternal,
      ],
    );

    useEffect(() => {
      if (id) {
        registerForm(id, apiSnapshot);
        return () => {
          unregisterForm(id);
        };
      }
    }, [id, apiSnapshot]);

    // ── Native form submit handler ────────────────────────────────
    const handleFormSubmit = useCallback(
      (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        void handleSubmitInternal();
      },
      [handleSubmitInternal],
    );

    // ── Context value ─────────────────────────────────────────────
    const contextValue = useMemo<FormContextValue>(
      () => ({
        values,
        errors,
        touched,
        isSubmitting,
        disabled,
        validateOn,
        setValue: handleSetValue,
        setTouched: handleSetTouched,
        registerRef,
        unregisterRef,
      }),
      [
        values,
        errors,
        touched,
        isSubmitting,
        disabled,
        validateOn,
        handleSetValue,
        handleSetTouched,
        registerRef,
        unregisterRef,
      ],
    );

    // ── Render ────────────────────────────────────────────────────
    return (
      <form
        id={id}
        data-component="form"
        {...(disabled ? { 'data-disabled': 'true' } : {})}
        noValidate
        onSubmit={handleFormSubmit}
        style={getFormStyle()}
      >
        <FormContext.Provider value={contextValue}>
          {children}
        </FormContext.Provider>
      </form>
    );
  },
);

Form.displayName = 'Form';
