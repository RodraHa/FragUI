import React, { useRef, useState } from 'react';
import type { ChangeEvent, FocusEvent } from 'react';
import type { Size, FormStatus } from '../../types';
import { useFieldContext } from '../../contexts';
import {
  getContainerStyle,
  getInputStyle,
  affixStyle,
  clearButtonStyle,
  getCounterStyle,
} from './InputText.styles';

export interface InputTextProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'size' | 'prefix' | 'width'
> {
  /** Nombre del campo. Se hereda desde FieldContext si no se pasa directamente. */
  name?: string;
  /** Tipo nativo del input. @default "text" */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  /** Valor controlado. */
  value?: string;
  /** Valor inicial no controlado. @default "" */
  defaultValue?: string;
  /** Tamaño visual del control. Heredable desde FieldContext. @default "md" */
  size?: Size;
  /**
   * Estado visual del campo. En V1 se pasa directamente; en V2 será
   * provisto por FieldContext con prioridad sobre este prop (§2.6).
   * @default "idle"
   */
  status?: FormStatus;
  /**
   * Si es `true`, el input ocupa el 100 % del contenedor padre.
   * Si es `false`, el input se adapta a su contenido con un ancho mínimo
   * razonable. @default true
   */
  fullWidth?: boolean;
  /**
   * Ancho personalizado (cualquier valor CSS válido). Sobreescribe
   * el comportamiento de `fullWidth` cuando se proporciona.
   * @example "20rem" | "50%" | "300px"
   */
  width?: string | number;
  /** Muestra botón para limpiar el valor. @default false */
  clearable?: boolean;
  /** Muestra contador de caracteres. Requiere maxLength. @default false */
  showCount?: boolean;
  /** Contenido decorativo al inicio del input. */
  prefix?: React.ReactNode;
  /** Contenido decorativo al final del input. */
  suffix?: React.ReactNode;
  /** Valor del atributo nativo autocomplete. @default "off" */
  autoComplete?: string;
  /**
   * Callback de cambio. Recibe el valor como string primero, luego el
   * evento nativo (value-first signature, spec §5).
   */
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  /** Callback de blur. */
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  /** Callback de foco. */
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  /** Callback al limpiar el campo vía el botón de limpieza. */
  onClear?: () => void;
}

/**
 * InputText — control de entrada de texto de una sola línea.
 *
 * No gestiona label, error ni estado visual; delega todo eso a Field (§5).
 * Soporta ref forwarding al <input> nativo para que Form pueda enfocar
 * programáticamente el primer campo inválido tras un submit fallido (§2.7).
 */
export const InputText = React.forwardRef<HTMLInputElement, InputTextProps>(
  (
    {
      type = 'text',
      size: sizeProp,
      status: statusProp,
      disabled: disabledProp = false,
      readOnly = false,
      fullWidth = true,
      width,
      clearable = false,
      showCount = false,
      autoComplete = 'off',
      autoFocus = false,
      defaultValue = '',
      value,
      placeholder,
      name: nameProp,
      maxLength,
      prefix,
      suffix,
      onChange,
      onBlur,
      onFocus,
      onClear,
      style,
      ...rest
    },
    ref,
  ) => {
    // ── FieldContext integration (§2.6) ─────────────────────────────
    // Direct props win over context, except `disabled` which always
    // OR-merges (ancestor wins, §2.4).
    const fieldCtx = useFieldContext();

    const size: Size = sizeProp ?? fieldCtx?.size ?? 'md';
    const status: FormStatus = statusProp ?? fieldCtx?.status ?? 'idle';
    // Ancestor disabled always wins — no child can re-enable (§2.4)
    const disabled = (fieldCtx?.disabled ?? false) || disabledProp;
    const name = nameProp ?? fieldCtx?.name;
    // id from context takes precedence over rest spread; direct id in rest wins over context
    const resolvedId =
      (rest as React.InputHTMLAttributes<HTMLInputElement>).id ??
      fieldCtx?.inputId;
    const resolvedDescribedBy =
      (rest as React.InputHTMLAttributes<HTMLInputElement>)[
        'aria-describedby'
      ] ?? fieldCtx?.describedById;
    const resolvedAriaInvalid =
      (rest as React.InputHTMLAttributes<HTMLInputElement>)['aria-invalid'] ??
      (status === 'error' ? ('true' as const) : undefined);
    const resolvedAriaRequired =
      (rest as React.InputHTMLAttributes<HTMLInputElement>)['aria-required'] ??
      (fieldCtx?.required ? ('true' as const) : undefined);
    // Native required attribute (§3 accessibility contract)
    const resolvedRequired =
      (rest as React.InputHTMLAttributes<HTMLInputElement>).required ??
      fieldCtx?.required;
    const [isFocused, setIsFocused] = useState(false);

    // Internal ref always points to the native input (used for clear).
    // The forwarded ref is also connected via the callback ref below.
    const inputRef = useRef<HTMLInputElement>(null);

    const setRefs = (node: HTMLInputElement | null) => {
      (inputRef as React.MutableRefObject<HTMLInputElement | null>).current =
        node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      }
    };

    // Uncontrolled internal value (only used when value prop is absent)
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const currentValue = isControlled ? value : internalValue;

    // Clear button: only when clearable, has value, not disabled/readOnly
    const showClearButton =
      clearable && !!currentValue && !disabled && !readOnly;

    // Character counter: only when both showCount and maxLength are set
    const showCounter = showCount && maxLength !== undefined;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue, e);
    };

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
      const nativeInput = inputRef.current;
      if (nativeInput) {
        // Set native value and dispatch a synthetic change event so
        // React's event system picks it up and re-renders.
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value',
        )?.set;
        nativeInputValueSetter?.call(nativeInput, '');
        nativeInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (!isControlled) {
        setInternalValue('');
      }
      onChange?.('', e as unknown as ChangeEvent<HTMLInputElement>);
      onClear?.();
    };

    const containerStyle = {
      ...getContainerStyle(
        size,
        status,
        disabled,
        readOnly,
        isFocused,
        fullWidth,
        width,
      ),
      ...style,
    };

    return (
      <div
        data-component="input-text"
        data-size={size}
        data-status={status}
        {...(fullWidth ? { 'data-fullwidth': 'true' } : {})}
        {...(disabled ? { 'data-disabled': 'true' } : {})}
        {...(readOnly ? { 'data-readonly': 'true' } : {})}
        style={containerStyle}
        // Forward pointer events to focus the input when clicking the container
        onClick={() => {
          if (!disabled) {
            inputRef.current?.focus();
          }
        }}
      >
        {prefix && (
          <span aria-hidden="true" style={affixStyle}>
            {prefix}
          </span>
        )}

        <input
          {...rest}
          ref={setRefs}
          type={type}
          id={resolvedId}
          name={name}
          disabled={disabled}
          readOnly={readOnly}
          required={resolvedRequired}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          aria-invalid={resolvedAriaInvalid}
          aria-required={resolvedAriaRequired}
          aria-describedby={resolvedDescribedBy}
          value={isControlled ? value : undefined}
          defaultValue={isControlled ? undefined : defaultValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={getInputStyle()}
        />

        {suffix && (
          <span aria-hidden="true" style={affixStyle}>
            {suffix}
          </span>
        )}

        {showClearButton && (
          <button
            type="button"
            aria-label="Limpiar"
            tabIndex={-1}
            style={clearButtonStyle}
            onClick={handleClear}
          >
            ✕
          </button>
        )}

        {showCounter && (
          <span
            aria-live="polite"
            style={getCounterStyle(
              maxLength !== undefined && currentValue.length > maxLength,
            )}
          >
            {currentValue.length}/{maxLength}
          </span>
        )}
      </div>
    );
  },
);

InputText.displayName = 'InputText';
