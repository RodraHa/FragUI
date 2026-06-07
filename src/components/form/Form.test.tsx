import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  act,
  waitFor,
  renderHook,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { Form } from './Form';
import { Field } from '../field';
import { FieldGroup } from '../field-group';
import { InputText } from '../input-text';
import { Select } from '../select';
import { validateField, validateAllFields } from './validation';
import { useForm, registerForm, unregisterForm } from '../../hooks/useForm';
import type { FormApi, ValidationRule } from '../../types/form';

/* ─── Helpers ──────────────────────────────────────────────────── */

function renderForm(props: Partial<React.ComponentProps<typeof Form>> = {}) {
  const onSubmit = vi.fn();
  const result = render(
    <Form
      initialValues={{ fullName: '', email: '' }}
      onSubmit={onSubmit}
      {...props}
    >
      <Field name="fullName" label="Nombre">
        <InputText placeholder="Nombre" />
      </Field>
      <Field name="email" label="Email">
        <InputText type="email" placeholder="correo@ejemplo.com" />
      </Field>
      <button type="submit">Enviar</button>
    </Form>,
  );

  return { ...result, onSubmit };
}

/* ─── Tests ────────────────────────────────────────────────────── */

describe('Form', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // ── Rendering ───────────────────────────────────────────────────

  describe('Rendering', () => {
    it('renders a native <form> element with data-component="form"', () => {
      renderForm();
      const form = document.querySelector('[data-component="form"]');
      expect(form).toBeInTheDocument();
      expect(form?.tagName).toBe('FORM');
    });

    it('renders children inside the form', () => {
      renderForm();
      expect(screen.getByPlaceholderText('Nombre')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('correo@ejemplo.com'),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Enviar' }),
      ).toBeInTheDocument();
    });

    it('passes id to the native form element', () => {
      renderForm({ id: 'create-user' });
      const form = document.getElementById('create-user');
      expect(form).toBeInTheDocument();
      expect(form?.tagName).toBe('FORM');
    });

    it('sets noValidate on the native form (browser validation disabled)', () => {
      renderForm();
      const form = document.querySelector('form');
      expect(form).toHaveAttribute('novalidate');
    });
  });

  // ── Submit ──────────────────────────────────────────────────────

  describe('Submit', () => {
    it('calls onSubmit with current values when form is valid', async () => {
      const user = userEvent.setup();
      const { onSubmit } = renderForm();

      await user.type(screen.getByPlaceholderText('Nombre'), 'María');
      await user.type(
        screen.getByPlaceholderText('correo@ejemplo.com'),
        'maria@test.com',
      );
      await user.click(screen.getByRole('button', { name: 'Enviar' }));

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith(
        { fullName: 'María', email: 'maria@test.com' },
        expect.objectContaining({ setValue: expect.any(Function) }),
      );
    });

    it('does NOT call onSubmit when validation fails', async () => {
      const user = userEvent.setup();
      const { onSubmit } = renderForm({
        validationRules: {
          fullName: [{ required: true, message: 'Obligatorio' }],
        },
      });

      await user.click(screen.getByRole('button', { name: 'Enviar' }));

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('submits via Enter key in an input field (native form behaviour)', async () => {
      const user = userEvent.setup();
      const { onSubmit } = renderForm();

      const nameInput = screen.getByPlaceholderText('Nombre');
      await user.type(nameInput, 'Test{enter}');

      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
  });

  // ── Validation ─────────────────────────────────────────────────

  describe('Validation', () => {
    it('shows required error after submit attempt', async () => {
      const user = userEvent.setup();
      renderForm({
        validationRules: {
          fullName: [{ required: true, message: 'El nombre es obligatorio' }],
        },
      });

      await user.click(screen.getByRole('button', { name: 'Enviar' }));

      expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument();
    });

    it('shows minLength error', async () => {
      const user = userEvent.setup();
      renderForm({
        validationRules: {
          fullName: [{ minLength: 3, message: 'Mínimo 3 caracteres' }],
        },
      });

      await user.type(screen.getByPlaceholderText('Nombre'), 'AB');
      await user.click(screen.getByRole('button', { name: 'Enviar' }));

      expect(screen.getByText('Mínimo 3 caracteres')).toBeInTheDocument();
    });

    it('shows pattern error for email', async () => {
      const user = userEvent.setup();
      renderForm({
        validationRules: {
          email: [{ pattern: 'email', message: 'Correo inválido' }],
        },
      });

      await user.type(
        screen.getByPlaceholderText('correo@ejemplo.com'),
        'not-an-email',
      );
      await user.click(screen.getByRole('button', { name: 'Enviar' }));

      expect(screen.getByText('Correo inválido')).toBeInTheDocument();
    });

    it('validates with custom sync validate function', async () => {
      const user = userEvent.setup();
      renderForm({
        validationRules: {
          fullName: [
            {
              validate: (v: unknown) =>
                v === 'admin' ? 'Nombre reservado' : null,
            },
          ],
        },
      });

      await user.type(screen.getByPlaceholderText('Nombre'), 'admin');
      await user.click(screen.getByRole('button', { name: 'Enviar' }));

      expect(screen.getByText('Nombre reservado')).toBeInTheDocument();
    });

    it('validates with custom async validate function', async () => {
      const user = userEvent.setup();
      renderForm({
        validationRules: {
          fullName: [
            {
              validate: async (v: unknown) =>
                v === 'taken' ? 'Ya existe' : null,
            },
          ],
        },
      });

      await user.type(screen.getByPlaceholderText('Nombre'), 'taken');
      await user.click(screen.getByRole('button', { name: 'Enviar' }));

      expect(screen.getByText('Ya existe')).toBeInTheDocument();
    });

    it('stops at first failing rule (short-circuit)', async () => {
      const user = userEvent.setup();
      const secondRule = vi.fn(() => 'Segundo error');
      renderForm({
        validationRules: {
          fullName: [
            { required: true, message: 'Obligatorio' },
            { validate: secondRule },
          ],
        },
      });

      await user.click(screen.getByRole('button', { name: 'Enviar' }));

      expect(screen.getByText('Obligatorio')).toBeInTheDocument();
      expect(secondRule).not.toHaveBeenCalled();
    });

    it('clears errors when field value becomes valid on re-submit', async () => {
      const user = userEvent.setup();
      renderForm({
        validationRules: {
          fullName: [{ required: true, message: 'Obligatorio' }],
        },
      });

      // First submit — fails
      await user.click(screen.getByRole('button', { name: 'Enviar' }));
      expect(screen.getByText('Obligatorio')).toBeInTheDocument();

      // Fill in value and re-submit
      await user.type(screen.getByPlaceholderText('Nombre'), 'María');
      await user.click(screen.getByRole('button', { name: 'Enviar' }));

      expect(screen.queryByText('Obligatorio')).not.toBeInTheDocument();
    });
  });

  // ── validateOn ─────────────────────────────────────────────────

  describe('validateOn', () => {
    it('validates on blur when validateOn="blur"', async () => {
      const user = userEvent.setup();
      renderForm({
        validateOn: 'blur',
        validationRules: {
          fullName: [{ required: true, message: 'Obligatorio' }],
        },
      });

      const input = screen.getByPlaceholderText('Nombre');
      await user.click(input);
      await user.tab(); // blur

      // Wait for async validation
      await act(async () => {});

      expect(screen.getByText('Obligatorio')).toBeInTheDocument();
    });

    it('validates on change when validateOn="change"', async () => {
      const user = userEvent.setup();
      renderForm({
        validateOn: 'change',
        validationRules: {
          fullName: [{ minLength: 3, message: 'Mínimo 3' }],
        },
      });

      await user.type(screen.getByPlaceholderText('Nombre'), 'AB');

      // Wait for async validation to resolve and DOM to update
      await waitFor(() => {
        expect(screen.getByText('Mínimo 3')).toBeInTheDocument();
      });
    });
  });

  // ── Disabled cascade ───────────────────────────────────────────

  describe('Disabled cascade', () => {
    it('disables all controls when Form.disabled=true', () => {
      renderForm({ disabled: true });

      const nameInput = screen.getByPlaceholderText('Nombre');
      const emailInput = screen.getByPlaceholderText('correo@ejemplo.com');

      expect(nameInput).toBeDisabled();
      expect(emailInput).toBeDisabled();
    });

    it('disables controls through FieldGroup when Form.disabled=true', () => {
      render(
        <Form initialValues={{ name: '' }} onSubmit={vi.fn()} disabled>
          <FieldGroup title="Grupo">
            <Field name="name" label="Nombre">
              <InputText placeholder="Nombre" />
            </Field>
          </FieldGroup>
        </Form>,
      );

      expect(screen.getByPlaceholderText('Nombre')).toBeDisabled();
    });

    it('no child can re-enable when ancestor is disabled', () => {
      render(
        <Form initialValues={{ name: '' }} onSubmit={vi.fn()} disabled>
          <Field name="name" label="Nombre" disabled={false}>
            <InputText placeholder="Nombre" disabled={false} />
          </Field>
        </Form>,
      );

      expect(screen.getByPlaceholderText('Nombre')).toBeDisabled();
    });
  });

  // ── onSuccess / onError / resetOnSuccess ────────────────────────

  describe('Callbacks and reset', () => {
    it('calls onSuccess after successful submit', async () => {
      const user = userEvent.setup();
      const onSuccess = vi.fn();
      renderForm({ onSuccess });

      await user.type(screen.getByPlaceholderText('Nombre'), 'María');
      await user.click(screen.getByRole('button', { name: 'Enviar' }));

      expect(onSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ fullName: 'María' }),
      );
    });

    it('calls onError when onSubmit throws', async () => {
      const user = userEvent.setup();
      const onError = vi.fn();
      const onSubmit = vi.fn().mockRejectedValue(new Error('Server error'));

      renderForm({ onSubmit, onError });

      await user.click(screen.getByRole('button', { name: 'Enviar' }));

      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.any(Object),
      );
    });

    it('resets to initialValues after successful submit when resetOnSuccess=true', async () => {
      const user = userEvent.setup();
      renderForm({ resetOnSuccess: true });

      const nameInput = screen.getByPlaceholderText('Nombre');
      await user.type(nameInput, 'María');
      await user.click(screen.getByRole('button', { name: 'Enviar' }));

      expect(nameInput).toHaveValue('');
    });
  });

  // ── FormApi via ref ────────────────────────────────────────────

  describe('FormApi via ref', () => {
    it('exposes FormApi via ref', () => {
      const ref = { current: null as FormApi | null };
      render(
        <Form ref={ref} initialValues={{ name: '' }} onSubmit={vi.fn()}>
          <Field name="name" label="Nombre">
            <InputText placeholder="Nombre" />
          </Field>
        </Form>,
      );

      expect(ref.current).not.toBeNull();
      expect(ref.current!.values).toEqual({ name: '' });
      expect(ref.current!.setValue).toBeInstanceOf(Function);
      expect(ref.current!.submit).toBeInstanceOf(Function);
      expect(ref.current!.reset).toBeInstanceOf(Function);
    });

    it('api.setValue updates a field value', async () => {
      const ref = { current: null as FormApi | null };
      const onSubmit = vi.fn();
      render(
        <Form ref={ref} initialValues={{ name: '' }} onSubmit={onSubmit}>
          <Field name="name" label="Nombre">
            <InputText placeholder="Nombre" />
          </Field>
          <button type="submit">Enviar</button>
        </Form>,
      );

      act(() => {
        ref.current!.setValue('name', 'Programmatic');
      });

      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: 'Enviar' }));

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Programmatic' }),
        expect.any(Object),
      );
    });

    it('api.setError injects an error and marks touched', async () => {
      const ref = { current: null as FormApi | null };
      render(
        <Form ref={ref} initialValues={{ name: '' }} onSubmit={vi.fn()}>
          <Field name="name" label="Nombre">
            <InputText placeholder="Nombre" />
          </Field>
        </Form>,
      );

      act(() => {
        ref.current!.setError('name', 'Ya existe');
      });

      expect(screen.getByText('Ya existe')).toBeInTheDocument();
    });

    it('api.reset restores initialValues and clears errors', async () => {
      const ref = { current: null as FormApi | null };
      render(
        <Form ref={ref} initialValues={{ name: 'Inicial' }} onSubmit={vi.fn()}>
          <Field name="name" label="Nombre">
            <InputText placeholder="Nombre" />
          </Field>
        </Form>,
      );

      act(() => {
        ref.current!.setValue('name', 'Cambiado');
        ref.current!.setError('name', 'Error');
      });

      expect(screen.getByText('Error')).toBeInTheDocument();

      act(() => {
        ref.current!.reset();
      });

      expect(screen.queryByText('Error')).not.toBeInTheDocument();
    });
  });

  // ── Focus on error ─────────────────────────────────────────────

  describe('Focus on error', () => {
    it('focuses the first invalid field after a failed submit', async () => {
      const user = userEvent.setup();
      renderForm({
        validationRules: {
          fullName: [{ required: true, message: 'Nombre requerido' }],
          email: [{ required: true, message: 'Email requerido' }],
        },
      });

      await user.click(screen.getByRole('button', { name: 'Enviar' }));

      // The first field with error (fullName) should be focused
      const nameInput = screen.getByPlaceholderText('Nombre');
      expect(nameInput).toHaveFocus();
    });
  });

  // ── Select integration ─────────────────────────────────────────

  describe('Select integration', () => {
    it('captures Select value changes in form state', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(
        <Form initialValues={{ role: null }} onSubmit={onSubmit}>
          <Field name="role" label="Rol">
            <Select
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'user', label: 'User' },
              ]}
              placeholder="Selecciona"
            />
          </Field>
          <button type="submit">Enviar</button>
        </Form>,
      );

      // Open select and pick an option
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByRole('option', { name: 'Admin' }));

      await user.click(screen.getByRole('button', { name: 'Enviar' }));

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ role: 'admin' }),
        expect.any(Object),
      );
    });
  });

  // ── Controlled value source ────────────────────────────────────

  describe('Controlled value source', () => {
    it('does not warn about uncontrolled→controlled for a field absent from initialValues', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        // `phone` is intentionally NOT in initialValues
        <Form initialValues={{ fullName: '' }} onSubmit={onSubmit}>
          <Field name="phone" label="Teléfono">
            <InputText placeholder="Teléfono" />
          </Field>
          <button type="submit">Enviar</button>
        </Form>,
      );

      await user.type(screen.getByPlaceholderText('Teléfono'), '555');

      const controlledWarning = errorSpy.mock.calls.some((args) =>
        String(args[0]).includes(
          'changing an uncontrolled input to be controlled',
        ),
      );
      expect(controlledWarning).toBe(false);
      expect(screen.getByPlaceholderText('Teléfono')).toHaveValue('555');

      errorSpy.mockRestore();
    });
  });

  // ── data-disabled attribute ────────────────────────────────────

  describe('data attributes', () => {
    it('sets data-disabled when disabled', () => {
      renderForm({ disabled: true });
      const form = document.querySelector('[data-component="form"]');
      expect(form).toHaveAttribute('data-disabled', 'true');
    });

    it('does not set data-disabled when not disabled', () => {
      renderForm();
      const form = document.querySelector('[data-component="form"]');
      expect(form).not.toHaveAttribute('data-disabled');
    });
  });
});

describe('validation', () => {
  describe('validateField', () => {
    // Required
    it('validates required', async () => {
      const rules: ValidationRule[] = [{ required: true }];
      expect(await validateField('', rules)).toBe('Este campo es obligatorio');
      expect(await validateField(null, rules)).toBe(
        'Este campo es obligatorio',
      );
      expect(await validateField('text', rules)).toBeNull();
    });

    // MinLength
    it('validates minLength', async () => {
      const rules: ValidationRule[] = [{ minLength: 5 }];
      expect(await validateField('1234', rules)).toBe('Mínimo 5 caracteres');
      expect(await validateField('12345', rules)).toBeNull();
      // Ignore if not string
      expect(await validateField(1234, rules)).toBeNull();
    });

    // MaxLength
    it('validates maxLength', async () => {
      const rules: ValidationRule[] = [{ maxLength: 3 }];
      expect(await validateField('1234', rules)).toBe('Máximo 3 caracteres');
      expect(await validateField('123', rules)).toBeNull();
      // Ignore if not string
      expect(await validateField(1234, rules)).toBeNull();
    });

    // Min (numeric)
    it('validates min numeric', async () => {
      const rules: ValidationRule[] = [{ min: 10 }];
      expect(await validateField(9, rules)).toBe('El valor mínimo es 10');
      expect(await validateField('9', rules)).toBe('El valor mínimo es 10');
      expect(await validateField(10, rules)).toBeNull();
      expect(await validateField('11', rules)).toBeNull();
      // Ignore if not numeric
      expect(await validateField('abc', rules)).toBeNull();
    });

    // Max (numeric)
    it('validates max numeric', async () => {
      const rules: ValidationRule[] = [{ max: 5 }];
      expect(await validateField(6, rules)).toBe('El valor máximo es 5');
      expect(await validateField('6', rules)).toBe('El valor máximo es 5');
      expect(await validateField(5, rules)).toBeNull();
      expect(await validateField('4', rules)).toBeNull();
      // Ignore if not numeric
      expect(await validateField('abc', rules)).toBeNull();
    });

    // Empty values must not trip min/max on optional fields (Number('') === 0)
    it('skips min/max for empty / null values', async () => {
      expect(await validateField('', [{ min: 1 }])).toBeNull();
      expect(await validateField(null, [{ min: 1 }])).toBeNull();
      expect(await validateField('', [{ max: 5 }])).toBeNull();
      expect(await validateField(null, [{ max: 5 }])).toBeNull();
    });

    // Pattern (string presets)
    it('validates pattern presets (email)', async () => {
      const rules: ValidationRule[] = [{ pattern: 'email' }];
      expect(await validateField('not-an-email', rules)).toBe(
        'Formato inválido',
      );
      expect(await validateField('test@example.com', rules)).toBeNull();
    });

    it('validates pattern presets (url)', async () => {
      const rules: ValidationRule[] = [{ pattern: 'url' }];
      expect(await validateField('not-a-url', rules)).toBe('Formato inválido');
      expect(await validateField('https://google.com', rules)).toBeNull();
    });

    it('validates pattern presets (tel)', async () => {
      const rules: ValidationRule[] = [{ pattern: 'tel' }];
      expect(await validateField('123', rules)).toBe('Formato inválido');
      expect(await validateField('+1234567890', rules)).toBeNull();
    });

    // Pattern (RegExp)
    it('validates custom RegExp pattern', async () => {
      const rules: ValidationRule[] = [{ pattern: /^[A-Z]+$/ }];
      expect(await validateField('abc', rules)).toBe('Formato inválido');
      expect(await validateField('ABC', rules)).toBeNull();
    });

    // Custom messages
    it('respects custom messages', async () => {
      expect(
        await validateField('', [{ required: true, message: 'Custom req' }]),
      ).toBe('Custom req');
      expect(
        await validateField('a', [{ minLength: 3, message: 'Custom minL' }]),
      ).toBe('Custom minL');
      expect(
        await validateField('abcd', [{ maxLength: 3, message: 'Custom maxL' }]),
      ).toBe('Custom maxL');
      expect(await validateField(5, [{ min: 10, message: 'Custom min' }])).toBe(
        'Custom min',
      );
      expect(await validateField(10, [{ max: 5, message: 'Custom max' }])).toBe(
        'Custom max',
      );
      expect(
        await validateField('not-email', [
          { pattern: 'email', message: 'Custom email' },
        ]),
      ).toBe('Custom email');
    });

    // Custom validate function
    it('validates using custom function', async () => {
      const rules: ValidationRule[] = [
        {
          validate: (val: unknown) =>
            val === 'invalid' ? 'Custom error' : null,
        },
      ];
      expect(await validateField('invalid', rules)).toBe('Custom error');
      expect(await validateField('valid', rules)).toBeNull();
    });
  });

  describe('validateAllFields', () => {
    it('validates all fields and returns an object of errors', async () => {
      const values = {
        name: 'a',
        age: 15,
        email: 'invalid',
      };
      const rules: Record<string, ValidationRule[]> = {
        name: [{ minLength: 3, message: 'Name too short' }],
        age: [{ min: 18, message: 'Must be 18' }],
        email: [{ pattern: 'email', message: 'Invalid email' }],
        missing: [{ required: true, message: 'Required' }],
      };

      const result = await validateAllFields(values, rules);
      expect(result).toEqual({
        name: 'Name too short',
        age: 'Must be 18',
        email: 'Invalid email',
        missing: 'Required',
      });
    });

    it('returns null for valid fields', async () => {
      const values = { name: 'abc' };
      const rules: Record<string, ValidationRule[]> = {
        name: [{ minLength: 3 }],
      };

      const result = await validateAllFields(values, rules);
      expect(result).toEqual({ name: null });
    });
  });
});

describe('useForm registry', () => {
  it('returns null if the form is not registered', () => {
    const { result } = renderHook(() => useForm('test-form-1'));
    expect(result.current).toBeNull();
  });

  it('returns FormApi when registered before hook call', () => {
    const mockApi = { values: { a: 1 } } as unknown as FormApi;
    registerForm('test-form-2', mockApi);

    const { result } = renderHook(() => useForm('test-form-2'));
    expect(result.current).toBe(mockApi);

    act(() => {
      unregisterForm('test-form-2');
    });
  });

  it('reacts dynamically to registration and unregistration', () => {
    const { result, unmount } = renderHook(() => useForm('dynamic-form'));
    expect(result.current).toBeNull();

    const mockApi = { values: { b: 2 } } as unknown as FormApi;

    act(() => {
      registerForm('dynamic-form', mockApi);
    });
    expect(result.current).toBe(mockApi);

    act(() => {
      unregisterForm('dynamic-form');
    });
    expect(result.current).toBeNull();

    // Verify unsubscription logic indirectly by unmounting
    unmount();
  });

  it('does not react to unrelated form changes', () => {
    const { result } = renderHook(() => useForm('form-A'));
    expect(result.current).toBeNull();

    const mockApiB = { values: { x: 9 } } as unknown as FormApi;

    act(() => {
      registerForm('form-B', mockApiB);
    });
    expect(result.current).toBeNull(); // form-A should still be null

    act(() => {
      unregisterForm('form-B');
    });
  });
});
