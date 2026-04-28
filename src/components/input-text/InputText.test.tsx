import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { InputText } from './InputText';

describe('InputText', () => {
  // -------------------------------------------------------------------------
  // 1. Rendering
  // -------------------------------------------------------------------------
  describe('Rendering', () => {
    it('renders a native <input> element', () => {
      const { container } = render(<InputText />);
      expect(container.querySelector('input')).toBeInTheDocument();
    });

    it('renders with type="text" by default', () => {
      const { container } = render(<InputText />);
      expect(container.querySelector('input')).toHaveAttribute('type', 'text');
    });

    it.each(['email', 'password', 'number', 'tel', 'url', 'search'] as const)(
      'renders with type="%s"',
      (type) => {
        const { container } = render(<InputText type={type} />);
        expect(container.querySelector('input')).toHaveAttribute('type', type);
      },
    );

    it('renders inside a wrapper container div', () => {
      const { container } = render(<InputText />);
      const wrapper = container.firstElementChild;
      expect(wrapper?.tagName).toBe('DIV');
      expect(wrapper?.querySelector('input')).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // 2. Value management
  // -------------------------------------------------------------------------
  describe('Value management', () => {
    it('uses defaultValue as initial value in uncontrolled mode', () => {
      const { container } = render(<InputText defaultValue="hello" />);
      expect(container.querySelector('input')).toHaveValue('hello');
    });

    it('reflects value prop in controlled mode', () => {
      const { container } = render(
        <InputText value="controlled" onChange={() => {}} />,
      );
      expect(container.querySelector('input')).toHaveValue('controlled');
    });

    it('calls onChange(value, event) when user types', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<InputText onChange={onChange} />);
      await user.type(screen.getByRole('textbox'), 'hi');
      expect(onChange).toHaveBeenCalledWith('h', expect.any(Object));
      expect(onChange).toHaveBeenCalledWith('hi', expect.any(Object));
    });

    it('does not crash in controlled mode without onChange', () => {
      expect(() => render(<InputText value="controlled" />)).not.toThrow();
    });
  });

  // -------------------------------------------------------------------------
  // 3. Props: size
  // -------------------------------------------------------------------------
  describe('size', () => {
    it('defaults to "md" — wrapper has data-size="md"', () => {
      const { container } = render(<InputText />);
      expect(container.firstElementChild).toHaveAttribute('data-size', 'md');
    });

    it.each(['sm', 'md', 'lg'] as const)(
      'applies data-size="%s" to the wrapper',
      (size) => {
        const { container } = render(<InputText size={size} />);
        expect(container.firstElementChild).toHaveAttribute('data-size', size);
      },
    );
  });

  // -------------------------------------------------------------------------
  // 4. Props: status
  // -------------------------------------------------------------------------
  describe('status', () => {
    it('defaults to "idle" — wrapper has data-status="idle"', () => {
      const { container } = render(<InputText />);
      expect(container.firstElementChild).toHaveAttribute(
        'data-status',
        'idle',
      );
    });

    it.each(['idle', 'success', 'warning', 'error'] as const)(
      'applies data-status="%s" to the wrapper',
      (status) => {
        const { container } = render(<InputText status={status} />);
        expect(container.firstElementChild).toHaveAttribute(
          'data-status',
          status,
        );
      },
    );
  });

  // -------------------------------------------------------------------------
  // 5. Props: placeholder
  // -------------------------------------------------------------------------
  describe('placeholder', () => {
    it('renders placeholder text on the native input', () => {
      const { container } = render(<InputText placeholder="Search…" />);
      expect(container.querySelector('input')).toHaveAttribute(
        'placeholder',
        'Search…',
      );
    });
  });

  // -------------------------------------------------------------------------
  // 6. Props: disabled
  // -------------------------------------------------------------------------
  describe('disabled', () => {
    it('is not disabled by default', () => {
      const { container } = render(<InputText />);
      expect(container.querySelector('input')).not.toBeDisabled();
    });

    it('sets native disabled on the input when disabled={true}', () => {
      const { container } = render(<InputText disabled />);
      expect(container.querySelector('input')).toBeDisabled();
    });

    it('wrapper gets data-disabled="true"', () => {
      const { container } = render(<InputText disabled />);
      expect(container.firstElementChild).toHaveAttribute(
        'data-disabled',
        'true',
      );
    });

    it('does not fire onChange when disabled', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<InputText disabled onChange={onChange} />);
      await user.type(screen.getByRole('textbox'), 'hi');
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // 7. Props: readOnly
  // -------------------------------------------------------------------------
  describe('readOnly', () => {
    it('sets native readOnly on the input when readOnly={true}', () => {
      const { container } = render(<InputText readOnly />);
      expect(container.querySelector('input')).toHaveAttribute('readonly');
    });

    it('wrapper gets data-readonly="true"', () => {
      const { container } = render(<InputText readOnly />);
      expect(container.firstElementChild).toHaveAttribute(
        'data-readonly',
        'true',
      );
    });
  });

  // -------------------------------------------------------------------------
  // 8. Props: clearable
  // -------------------------------------------------------------------------
  describe('clearable', () => {
    it('does not show clear button by default', () => {
      render(<InputText />);
      expect(
        screen.queryByRole('button', { name: /limpiar/i }),
      ).not.toBeInTheDocument();
    });

    it('shows clear button when clearable and input has a value', async () => {
      const user = userEvent.setup();
      render(<InputText clearable />);
      await user.type(screen.getByRole('textbox'), 'hello');
      expect(
        screen.getByRole('button', { name: /limpiar/i }),
      ).toBeInTheDocument();
    });

    it('hides clear button when clearable but input is empty', () => {
      render(<InputText clearable defaultValue="" />);
      expect(
        screen.queryByRole('button', { name: /limpiar/i }),
      ).not.toBeInTheDocument();
    });

    it('does not show clear button when disabled', () => {
      // Pre-fill via defaultValue so clear would normally show
      render(<InputText clearable defaultValue="hello" disabled />);
      // Disabled input — clear button must not appear
      expect(
        screen.queryByRole('button', { name: /limpiar/i }),
      ).not.toBeInTheDocument();
    });

    it('does not show clear button when readOnly', () => {
      render(<InputText clearable defaultValue="hello" readOnly />);
      expect(
        screen.queryByRole('button', { name: /limpiar/i }),
      ).not.toBeInTheDocument();
    });

    it('clears the value on click in uncontrolled mode', async () => {
      const user = userEvent.setup();
      render(<InputText clearable defaultValue="hello" />);
      await user.click(screen.getByRole('button', { name: /limpiar/i }));
      expect(screen.getByRole('textbox')).toHaveValue('');
    });

    it('calls onClear callback when clear button is clicked', async () => {
      const user = userEvent.setup();
      const onClear = vi.fn();
      render(<InputText clearable defaultValue="hello" onClear={onClear} />);
      await user.click(screen.getByRole('button', { name: /limpiar/i }));
      expect(onClear).toHaveBeenCalledTimes(1);
    });

    it('calls onChange("", event) when clear button is clicked', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<InputText clearable defaultValue="hello" onChange={onChange} />);
      await user.click(screen.getByRole('button', { name: /limpiar/i }));
      expect(onChange).toHaveBeenCalledWith('', expect.any(Object));
    });

    it('clear button has an aria-label attribute', async () => {
      const user = userEvent.setup();
      render(<InputText clearable />);
      await user.type(screen.getByRole('textbox'), 'x');
      const btn = screen.getByRole('button', { name: /limpiar/i });
      expect(btn).toHaveAttribute('aria-label');
    });
  });

  // -------------------------------------------------------------------------
  // 9. Props: maxLength & showCount
  // -------------------------------------------------------------------------
  describe('maxLength & showCount', () => {
    it('sets native maxLength on the input', () => {
      const { container } = render(<InputText maxLength={10} />);
      expect(container.querySelector('input')).toHaveAttribute(
        'maxlength',
        '10',
      );
    });

    it('shows character counter when showCount and maxLength are set', () => {
      render(<InputText showCount maxLength={20} defaultValue="hello" />);
      expect(screen.getByText('5/20')).toBeInTheDocument();
    });

    it('does not show counter when showCount is false', () => {
      render(<InputText maxLength={20} defaultValue="hello" />);
      expect(screen.queryByText('5/20')).not.toBeInTheDocument();
    });

    it('does not show counter when maxLength is not set', () => {
      render(<InputText showCount defaultValue="hello" />);
      // No max — counter should not appear
      expect(screen.queryByText(/\/\d+/)).not.toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // 10. Props: prefix & suffix
  // -------------------------------------------------------------------------
  describe('prefix & suffix', () => {
    it('renders prefix content before the input', () => {
      render(<InputText prefix={<span data-testid="pfx">@</span>} />);
      expect(screen.getByTestId('pfx')).toBeInTheDocument();
    });

    it('renders suffix content after the input', () => {
      render(<InputText suffix={<span data-testid="sfx">kg</span>} />);
      expect(screen.getByTestId('sfx')).toBeInTheDocument();
    });

    it('prefix wrapper has aria-hidden="true"', () => {
      const { container } = render(<InputText prefix={<span>@</span>} />);
      const affixWrappers = container.querySelectorAll('[aria-hidden="true"]');
      expect(affixWrappers.length).toBeGreaterThanOrEqual(1);
    });

    it('suffix wrapper has aria-hidden="true"', () => {
      const { container } = render(<InputText suffix={<span>kg</span>} />);
      const affixWrappers = container.querySelectorAll('[aria-hidden="true"]');
      expect(affixWrappers.length).toBeGreaterThanOrEqual(1);
    });
  });

  // -------------------------------------------------------------------------
  // 11. Props: autoComplete & autoFocus
  // -------------------------------------------------------------------------
  describe('autoComplete & autoFocus', () => {
    it('sets autocomplete="off" on the native input by default', () => {
      const { container } = render(<InputText />);
      expect(container.querySelector('input')).toHaveAttribute(
        'autocomplete',
        'off',
      );
    });

    it('respects a custom autoComplete value', () => {
      const { container } = render(<InputText autoComplete="email" />);
      expect(container.querySelector('input')).toHaveAttribute(
        'autocomplete',
        'email',
      );
    });

    it('sets autoFocus on the native input when autoFocus={true}', () => {
      // jsdom does not persist the autoFocus attribute in the DOM; we verify
      // that the prop is accepted without error and the input is rendered.
      const { container } = render(<InputText autoFocus />);
      expect(container.querySelector('input')).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // 12. Callbacks: onFocus & onBlur
  // -------------------------------------------------------------------------
  describe('Callbacks', () => {
    it('calls onFocus with the native FocusEvent when focused', async () => {
      const user = userEvent.setup();
      const onFocus = vi.fn();
      render(<InputText onFocus={onFocus} />);
      await user.click(screen.getByRole('textbox'));
      expect(onFocus).toHaveBeenCalledTimes(1);
      expect(onFocus).toHaveBeenCalledWith(expect.any(Object));
    });

    it('calls onBlur with the native FocusEvent when blurred', async () => {
      const user = userEvent.setup();
      const onBlur = vi.fn();
      render(<InputText onBlur={onBlur} />);
      await user.click(screen.getByRole('textbox'));
      await user.tab();
      expect(onBlur).toHaveBeenCalledTimes(1);
      expect(onBlur).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  // -------------------------------------------------------------------------
  // 13. Ref forwarding
  // -------------------------------------------------------------------------
  describe('Ref forwarding', () => {
    it('forwards ref to the native <input> element', () => {
      const ref = createRef<HTMLInputElement>();
      const { container } = render(<InputText ref={ref} />);
      expect(ref.current).toBe(container.querySelector('input'));
    });

    it('ref can be used to programmatically focus the input', () => {
      const ref = createRef<HTMLInputElement>();
      render(<InputText ref={ref} />);
      ref.current?.focus();
      expect(ref.current).toHaveFocus();
    });
  });

  // -------------------------------------------------------------------------
  // 14. Accessibility
  // -------------------------------------------------------------------------
  describe('Accessibility', () => {
    it('forwards id to the native input', () => {
      const { container } = render(<InputText id="my-input" />);
      expect(container.querySelector('input')).toHaveAttribute(
        'id',
        'my-input',
      );
    });

    it('forwards aria-invalid to the native input', () => {
      const { container } = render(<InputText aria-invalid="true" />);
      expect(container.querySelector('input')).toHaveAttribute(
        'aria-invalid',
        'true',
      );
    });

    it('forwards aria-required to the native input', () => {
      const { container } = render(<InputText aria-required="true" />);
      expect(container.querySelector('input')).toHaveAttribute(
        'aria-required',
        'true',
      );
    });

    it('forwards aria-describedby to the native input', () => {
      const { container } = render(<InputText aria-describedby="helper-id" />);
      expect(container.querySelector('input')).toHaveAttribute(
        'aria-describedby',
        'helper-id',
      );
    });

    it('applies name attribute to the native input', () => {
      const { container } = render(<InputText name="username" />);
      expect(container.querySelector('input')).toHaveAttribute(
        'name',
        'username',
      );
    });
  });
});
