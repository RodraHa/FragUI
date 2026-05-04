import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Field } from './Field';
import { InputText } from '../input-text/InputText';
import { Select } from '../select/Select';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function renderField(props: Partial<React.ComponentProps<typeof Field>> = {}) {
  return render(
    <Field name="test" {...props}>
      {props.children ?? <InputText />}
    </Field>,
  );
}

// ---------------------------------------------------------------------------
// 1. Rendering
// ---------------------------------------------------------------------------
describe('Field', () => {
  describe('Rendering', () => {
    it('renders a wrapper div with data-component="field"', () => {
      const { container } = renderField();
      expect(container.firstElementChild).toHaveAttribute(
        'data-component',
        'field',
      );
    });

    it('renders children inside the wrapper', () => {
      const { container } = renderField();
      expect(container.querySelector('input')).toBeInTheDocument();
    });

    it('renders a label when label prop is provided', () => {
      renderField({ label: 'Full Name' });
      expect(screen.getByText('Full Name')).toBeInTheDocument();
    });

    it('does not render a label element when label is null', () => {
      const { container } = renderField({ label: null });
      expect(container.querySelector('label')).not.toBeInTheDocument();
    });

    it('renders helperText below the control', () => {
      renderField({ helperText: 'This is a hint' });
      expect(screen.getByText('This is a hint')).toBeInTheDocument();
    });

    it('renders errorText below the control', () => {
      renderField({ errorText: 'This field is required' });
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('renders errorText when both errorText and helperText are set (error wins)', () => {
      renderField({
        errorText: 'Error message',
        helperText: 'Helper message',
      });
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.queryByText('Helper message')).not.toBeInTheDocument();
    });

    it('does not render any sub-text when neither errorText nor helperText is set', () => {
      const { container } = renderField();
      expect(
        container.querySelector('[data-field-subtext]'),
      ).not.toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // 2. Status
  // -------------------------------------------------------------------------
  describe('status', () => {
    it('defaults to "idle" — wrapper has data-status="idle"', () => {
      const { container } = renderField();
      expect(container.firstElementChild).toHaveAttribute(
        'data-status',
        'idle',
      );
    });

    it.each(['idle', 'success', 'warning', 'error'] as const)(
      'applies data-status="%s" to the wrapper',
      (status) => {
        const { container } = renderField({ status });
        expect(container.firstElementChild).toHaveAttribute(
          'data-status',
          status,
        );
      },
    );

    it('forces data-status="error" when errorText is provided (even if status is idle)', () => {
      const { container } = renderField({
        errorText: 'Something went wrong',
        status: 'idle',
      });
      expect(container.firstElementChild).toHaveAttribute(
        'data-status',
        'error',
      );
    });

    it('error sub-text has role="alert"', () => {
      renderField({ errorText: 'Error!' });
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('helper sub-text does not have role="alert"', () => {
      renderField({ helperText: 'Just a hint' });
      const subText = screen.getByText('Just a hint');
      expect(subText).not.toHaveAttribute('role', 'alert');
    });
  });

  // -------------------------------------------------------------------------
  // 3. Size
  // -------------------------------------------------------------------------
  describe('size', () => {
    it('defaults to "md" — wrapper has data-size="md"', () => {
      const { container } = renderField();
      expect(container.firstElementChild).toHaveAttribute('data-size', 'md');
    });

    it.each(['sm', 'md', 'lg'] as const)(
      'applies data-size="%s" to the wrapper',
      (size) => {
        const { container } = renderField({ size });
        expect(container.firstElementChild).toHaveAttribute('data-size', size);
      },
    );
  });

  // -------------------------------------------------------------------------
  // 4. Required
  // -------------------------------------------------------------------------
  describe('required', () => {
    it('is not required by default — no data-required attribute', () => {
      const { container } = renderField();
      expect(container.firstElementChild).not.toHaveAttribute('data-required');
    });

    it('sets data-required="true" on the wrapper when required', () => {
      const { container } = renderField({ required: true });
      expect(container.firstElementChild).toHaveAttribute(
        'data-required',
        'true',
      );
    });

    it('renders the required indicator (*) in the label when required', () => {
      renderField({ label: 'Email', required: true });
      // The * is in an aria-hidden span next to the label text
      const label = screen.getByText('Email').closest('label');
      expect(label?.textContent).toContain('*');
    });

    it('does not render the required indicator when not required', () => {
      renderField({ label: 'Email', required: false });
      const label = screen.getByText('Email').closest('label');
      expect(label?.textContent).not.toContain('*');
    });

    it('required indicator has aria-hidden="true"', () => {
      renderField({ label: 'Name', required: true });
      const indicator = screen
        .getByText('Name')
        .closest('label')
        ?.querySelector('[aria-hidden="true"]');
      expect(indicator).toBeInTheDocument();
      expect(indicator?.textContent).toBe('*');
    });
  });

  // -------------------------------------------------------------------------
  // 5. Disabled
  // -------------------------------------------------------------------------
  describe('disabled', () => {
    it('is not disabled by default — no data-disabled attribute', () => {
      const { container } = renderField();
      expect(container.firstElementChild).not.toHaveAttribute('data-disabled');
    });

    it('sets data-disabled="true" on the wrapper when disabled', () => {
      const { container } = renderField({ disabled: true });
      expect(container.firstElementChild).toHaveAttribute(
        'data-disabled',
        'true',
      );
    });

    it('propagates disabled to InputText via FieldContext', () => {
      const { container } = renderField({ disabled: true });
      expect(container.querySelector('input')).toBeDisabled();
    });

    it('propagates disabled to Select via FieldContext', () => {
      const { container } = render(
        <Field name="role" disabled>
          <Select options={[{ value: 'a', label: 'A' }]} />
        </Field>,
      );
      expect(
        container.querySelector('[data-component="select"]'),
      ).toHaveAttribute('data-disabled', 'true');
    });
  });

  // -------------------------------------------------------------------------
  // 6. Accessibility — label + ID linking
  // -------------------------------------------------------------------------
  describe('Accessibility: label linking', () => {
    it('label htmlFor matches the input id', () => {
      const { container } = renderField({ label: 'Name' });
      const label = container.querySelector('label')!;
      const input = container.querySelector('input')!;
      expect(label.htmlFor).toBe(input.id);
    });

    it('generates a non-empty inputId for the native control', () => {
      const { container } = renderField();
      expect(container.querySelector('input')?.id).not.toBe('');
    });

    it('generates a non-empty describedById on the sub-text element', () => {
      const { container } = renderField({ helperText: 'Hint' });
      const subText = container.querySelector('[data-field-subtext]')!;
      expect(subText.id).not.toBe('');
    });
  });

  // -------------------------------------------------------------------------
  // 7. Accessibility — aria-describedby
  // -------------------------------------------------------------------------
  describe('Accessibility: aria-describedby', () => {
    it('input has aria-describedby pointing to sub-text id', () => {
      const { container } = renderField({ helperText: 'Hint' });
      const input = container.querySelector('input')!;
      const subText = container.querySelector('[data-field-subtext]')!;
      expect(input.getAttribute('aria-describedby')).toBe(subText.id);
    });

    it('input has aria-describedby pointing to error text id when errorText is set', () => {
      const { container } = renderField({ errorText: 'Error!' });
      const input = container.querySelector('input')!;
      const subText = container.querySelector('[data-field-subtext]')!;
      expect(input.getAttribute('aria-describedby')).toBe(subText.id);
    });
  });

  // -------------------------------------------------------------------------
  // 8. Accessibility — aria-invalid / aria-required
  // -------------------------------------------------------------------------
  describe('Accessibility: aria-invalid & aria-required', () => {
    it('input has aria-invalid="true" when status is "error"', () => {
      const { container } = renderField({ status: 'error' });
      expect(container.querySelector('input')).toHaveAttribute(
        'aria-invalid',
        'true',
      );
    });

    it('input does not have aria-invalid when status is "idle"', () => {
      const { container } = renderField({ status: 'idle' });
      expect(container.querySelector('input')).not.toHaveAttribute(
        'aria-invalid',
        'true',
      );
    });

    it('input has aria-invalid="true" when errorText forces error status', () => {
      const { container } = renderField({ errorText: 'Required!' });
      expect(container.querySelector('input')).toHaveAttribute(
        'aria-invalid',
        'true',
      );
    });

    it('input has aria-required="true" when required=true', () => {
      const { container } = renderField({ required: true });
      expect(container.querySelector('input')).toHaveAttribute(
        'aria-required',
        'true',
      );
    });

    it('input does not have aria-required when required=false', () => {
      const { container } = renderField({ required: false });
      expect(container.querySelector('input')).not.toHaveAttribute(
        'aria-required',
        'true',
      );
    });
  });

  // -------------------------------------------------------------------------
  // 9. FieldContext — size / status / name propagation
  // -------------------------------------------------------------------------
  describe('FieldContext propagation', () => {
    it('InputText inherits size="sm" from Field without explicit prop', () => {
      const { container } = renderField({ size: 'sm' });
      expect(
        container.querySelector('[data-component="input-text"]'),
      ).toHaveAttribute('data-size', 'sm');
    });

    it('InputText inherits size="lg" from Field without explicit prop', () => {
      const { container } = renderField({ size: 'lg' });
      expect(
        container.querySelector('[data-component="input-text"]'),
      ).toHaveAttribute('data-size', 'lg');
    });

    it('InputText direct size prop overrides FieldContext size', () => {
      const { container } = render(
        <Field name="x" size="lg">
          <InputText size="sm" />
        </Field>,
      );
      expect(
        container.querySelector('[data-component="input-text"]'),
      ).toHaveAttribute('data-size', 'sm');
    });

    it('InputText inherits status="error" from Field', () => {
      const { container } = renderField({ status: 'error' });
      expect(
        container.querySelector('[data-component="input-text"]'),
      ).toHaveAttribute('data-status', 'error');
    });

    it('InputText inherits name from Field via FieldContext', () => {
      const { container } = render(
        <Field name="username" label="User">
          <InputText />
        </Field>,
      );
      expect(container.querySelector('input')).toHaveAttribute(
        'name',
        'username',
      );
    });

    it('InputText direct name prop overrides FieldContext name', () => {
      const { container } = render(
        <Field name="fieldName">
          <InputText name="overridden" />
        </Field>,
      );
      expect(container.querySelector('input')).toHaveAttribute(
        'name',
        'overridden',
      );
    });
  });

  // -------------------------------------------------------------------------
  // 10. Disabled — ancestor always wins (§2.4)
  // -------------------------------------------------------------------------
  describe('disabled inheritance from Field (§2.4)', () => {
    it('Field disabled=true disables InputText even when InputText does not pass disabled', () => {
      const { container } = renderField({ disabled: true });
      expect(container.querySelector('input')).toBeDisabled();
    });

    it('Field disabled=false + InputText disabled=true — control is still disabled', () => {
      const { container } = render(
        <Field name="x">
          <InputText disabled />
        </Field>,
      );
      expect(container.querySelector('input')).toBeDisabled();
    });
  });

  // -------------------------------------------------------------------------
  // 11. validateOn prop (accepted without crash, Form sprint integration later)
  // -------------------------------------------------------------------------
  describe('validateOn', () => {
    it.each(['change', 'blur', 'submit', null] as const)(
      'accepts validateOn="%s" without crashing',
      (validateOn) => {
        expect(() => renderField({ validateOn })).not.toThrow();
      },
    );
  });

  // -------------------------------------------------------------------------
  // 12. Stable IDs across re-renders
  // -------------------------------------------------------------------------
  describe('Stable IDs', () => {
    it('inputId does not change across re-renders', () => {
      const { container, rerender } = render(
        <Field name="email" label="Email">
          <InputText />
        </Field>,
      );
      const idBefore = container.querySelector('input')?.id;
      rerender(
        <Field name="email" label="Email" helperText="Hint">
          <InputText />
        </Field>,
      );
      const idAfter = container.querySelector('input')?.id;
      expect(idBefore).toBe(idAfter);
    });
  });
});
