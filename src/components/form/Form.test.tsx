import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { Form } from './Form';
import { Field } from '../field';
import { FieldGroup } from '../field-group';
import { InputText } from '../input-text';
import { Select } from '../select';
import type { FormApi } from '../../types/form';

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

  describe('Disabled cascade (§2.4)', () => {
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

  describe('Focus on error (§7 contract)', () => {
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
