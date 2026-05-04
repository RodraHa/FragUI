import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { Select } from './Select';

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

const withDisabled = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Bravo', disabled: true },
  { value: 'c', label: 'Charlie' },
];

const grouped = [
  { value: 'apple', label: 'Apple', group: 'Fruits' },
  { value: 'banana', label: 'Banana', group: 'Fruits' },
  { value: 'carrot', label: 'Carrot', group: 'Vegetables' },
  { value: 'plain', label: 'Plain' },
];

describe('Select', () => {
  // -----------------------------------------------------------------------
  // 1. Rendering
  // -----------------------------------------------------------------------
  describe('Rendering', () => {
    it('renders a trigger with role combobox', () => {
      render(<Select options={fruits} />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders as a <button> element', () => {
      render(<Select options={fruits} />);
      expect(screen.getByRole('combobox').tagName).toBe('BUTTON');
    });

    it('renders default placeholder "Seleccionar..."', () => {
      render(<Select options={fruits} />);
      expect(screen.getByRole('combobox')).toHaveTextContent('Seleccionar...');
    });

    it('does not render the panel when closed', () => {
      render(<Select options={fruits} />);
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('has type="button" to prevent form submission', () => {
      render(<Select options={fruits} />);
      expect(screen.getByRole('combobox')).toHaveAttribute('type', 'button');
    });
  });

  // -----------------------------------------------------------------------
  // 2. Value management
  // -----------------------------------------------------------------------
  describe('Value management', () => {
    it('uses defaultValue as initial selection in uncontrolled mode', () => {
      render(<Select options={fruits} defaultValue="banana" />);
      expect(screen.getByRole('combobox')).toHaveTextContent('Banana');
    });

    it('reflects value prop in controlled mode', () => {
      render(<Select options={fruits} value="cherry" onChange={() => {}} />);
      expect(screen.getByRole('combobox')).toHaveTextContent('Cherry');
    });

    it('calls onChange(value) when an option is selected', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Select options={fruits} onChange={onChange} />);
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByRole('option', { name: 'Banana' }));
      expect(onChange).toHaveBeenCalledWith('banana');
    });

    it('updates display in uncontrolled mode after selection', async () => {
      const user = userEvent.setup();
      render(<Select options={fruits} />);
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByRole('option', { name: 'Cherry' }));
      expect(screen.getByRole('combobox')).toHaveTextContent('Cherry');
    });

    it('does not crash in controlled mode without onChange', () => {
      expect(() =>
        render(<Select options={fruits} value="apple" />),
      ).not.toThrow();
    });
  });

  // -----------------------------------------------------------------------
  // 3. Size
  // -----------------------------------------------------------------------
  describe('size', () => {
    it('defaults to "md" — trigger has data-size="md"', () => {
      render(<Select options={fruits} />);
      expect(screen.getByRole('combobox')).toHaveAttribute('data-size', 'md');
    });

    it.each(['sm', 'md', 'lg'] as const)(
      'applies data-size="%s" to the trigger',
      (size) => {
        render(<Select options={fruits} size={size} />);
        expect(screen.getByRole('combobox')).toHaveAttribute('data-size', size);
      },
    );
  });

  // -----------------------------------------------------------------------
  // 4. Status
  // -----------------------------------------------------------------------
  describe('status', () => {
    it('defaults to "idle" — trigger has data-status="idle"', () => {
      render(<Select options={fruits} />);
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'data-status',
        'idle',
      );
    });

    it.each(['idle', 'success', 'warning', 'error'] as const)(
      'applies data-status="%s" to the trigger',
      (status) => {
        render(<Select options={fruits} status={status} />);
        expect(screen.getByRole('combobox')).toHaveAttribute(
          'data-status',
          status,
        );
      },
    );
  });

  // -----------------------------------------------------------------------
  // 5. Layout: fullWidth
  // -----------------------------------------------------------------------
  describe('fullWidth', () => {
    it('defaults to fullWidth — trigger has data-fullwidth="true"', () => {
      render(<Select options={fruits} />);
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'data-fullwidth',
        'true',
      );
    });

    it('applies width: 100% by default', () => {
      render(<Select options={fruits} />);
      expect(screen.getByRole('combobox')).toHaveStyle({ width: '100%' });
    });

    it('does not set data-fullwidth when fullWidth={false}', () => {
      render(<Select options={fruits} fullWidth={false} />);
      expect(screen.getByRole('combobox')).not.toHaveAttribute(
        'data-fullwidth',
      );
    });

    it('does not set width: 100% when fullWidth={false}', () => {
      render(<Select options={fruits} fullWidth={false} />);
      expect(screen.getByRole('combobox')).not.toHaveStyle({ width: '100%' });
    });
  });

  // -----------------------------------------------------------------------
  // 6. Layout: width
  // -----------------------------------------------------------------------
  describe('width', () => {
    it('applies a custom string width to the trigger', () => {
      render(<Select options={fruits} width="20rem" />);
      expect(screen.getByRole('combobox')).toHaveStyle({ width: '20rem' });
    });

    it('applies a custom numeric width (px) to the trigger', () => {
      render(<Select options={fruits} width={300} />);
      expect(screen.getByRole('combobox')).toHaveStyle({ width: '300px' });
    });

    it('overrides fullWidth when width is provided', () => {
      render(<Select options={fruits} fullWidth width="50%" />);
      expect(screen.getByRole('combobox')).toHaveStyle({ width: '50%' });
    });
  });

  // -----------------------------------------------------------------------
  // 7. Placeholder
  // -----------------------------------------------------------------------
  describe('placeholder', () => {
    it('renders custom placeholder text on the trigger', () => {
      render(<Select options={fruits} placeholder="Pick a fruit" />);
      expect(screen.getByRole('combobox')).toHaveTextContent('Pick a fruit');
    });

    it('shows placeholder when no value is selected', () => {
      render(<Select options={fruits} />);
      expect(screen.getByRole('combobox')).toHaveTextContent('Seleccionar...');
    });
  });

  // -----------------------------------------------------------------------
  // 8. Disabled
  // -----------------------------------------------------------------------
  describe('disabled', () => {
    it('is not disabled by default', () => {
      render(<Select options={fruits} />);
      expect(screen.getByRole('combobox')).not.toBeDisabled();
    });

    it('sets native disabled on the trigger when disabled={true}', () => {
      render(<Select options={fruits} disabled />);
      expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('trigger gets data-disabled="true"', () => {
      render(<Select options={fruits} disabled />);
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'data-disabled',
        'true',
      );
    });

    it('does not open panel when clicked while disabled', async () => {
      const user = userEvent.setup();
      render(<Select options={fruits} disabled />);
      await user.click(screen.getByRole('combobox'));
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  // -----------------------------------------------------------------------
  // 9. Opening/closing
  // -----------------------------------------------------------------------
  describe('Opening/closing', () => {
    it('opens panel on click', async () => {
      const user = userEvent.setup();
      render(<Select options={fruits} />);
      await user.click(screen.getByRole('combobox'));
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('closes panel on second click', async () => {
      const user = userEvent.setup();
      render(<Select options={fruits} />);
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByRole('combobox'));
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('closes panel on Escape key', async () => {
      const user = userEvent.setup();
      render(<Select options={fruits} />);
      await user.click(screen.getByRole('combobox'));
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('calls onOpenChange when opening and closing', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(<Select options={fruits} onOpenChange={onOpenChange} />);
      await user.click(screen.getByRole('combobox'));
      expect(onOpenChange).toHaveBeenCalledWith(true);
      await user.click(screen.getByRole('combobox'));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  // -----------------------------------------------------------------------
  // 10. Option selection
  // -----------------------------------------------------------------------
  describe('Option selection', () => {
    it('renders all options inside the panel', async () => {
      const user = userEvent.setup();
      render(<Select options={fruits} />);
      await user.click(screen.getByRole('combobox'));
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(3);
    });

    it('closes panel after selecting an option', async () => {
      const user = userEvent.setup();
      render(<Select options={fruits} />);
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByRole('option', { name: 'Apple' }));
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('shows selected label in the trigger after selection', async () => {
      const user = userEvent.setup();
      render(<Select options={fruits} />);
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByRole('option', { name: 'Apple' }));
      expect(screen.getByRole('combobox')).toHaveTextContent('Apple');
    });

    it('marks the selected option with aria-selected="true"', async () => {
      const user = userEvent.setup();
      render(<Select options={fruits} defaultValue="banana" />);
      await user.click(screen.getByRole('combobox'));
      expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
      expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute(
        'aria-selected',
        'false',
      );
    });
  });

  // -----------------------------------------------------------------------
  // 11. Disabled options
  // -----------------------------------------------------------------------
  describe('Disabled options', () => {
    it('renders disabled option with aria-disabled', async () => {
      const user = userEvent.setup();
      render(<Select options={withDisabled} />);
      await user.click(screen.getByRole('combobox'));
      expect(screen.getByRole('option', { name: 'Bravo' })).toHaveAttribute(
        'aria-disabled',
        'true',
      );
    });

    it('does not select a disabled option on click', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Select options={withDisabled} onChange={onChange} />);
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByRole('option', { name: 'Bravo' }));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // 12. Clearable
  // -----------------------------------------------------------------------
  describe('clearable', () => {
    it('does not show clear button by default', () => {
      render(<Select options={fruits} defaultValue="apple" />);
      expect(
        screen.queryByRole('button', { name: /limpiar/i }),
      ).not.toBeInTheDocument();
    });

    it('shows clear button when clearable and has value', () => {
      render(<Select options={fruits} clearable defaultValue="apple" />);
      expect(
        screen.getByRole('button', { name: /limpiar/i }),
      ).toBeInTheDocument();
    });

    it('hides clear button when no value is selected', () => {
      render(<Select options={fruits} clearable />);
      expect(
        screen.queryByRole('button', { name: /limpiar/i }),
      ).not.toBeInTheDocument();
    });

    it('does not show clear button when disabled', () => {
      render(
        <Select options={fruits} clearable defaultValue="apple" disabled />,
      );
      expect(
        screen.queryByRole('button', { name: /limpiar/i }),
      ).not.toBeInTheDocument();
    });

    it('clears the selection on click in uncontrolled mode', async () => {
      const user = userEvent.setup();
      render(<Select options={fruits} clearable defaultValue="apple" />);
      await user.click(screen.getByRole('button', { name: /limpiar/i }));
      expect(screen.getByRole('combobox')).toHaveTextContent('Seleccionar...');
    });

    it('calls onChange(null) when clear button is clicked', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <Select
          options={fruits}
          clearable
          defaultValue="apple"
          onChange={onChange}
        />,
      );
      await user.click(screen.getByRole('button', { name: /limpiar/i }));
      expect(onChange).toHaveBeenCalledWith(null);
    });
  });

  // -----------------------------------------------------------------------
  // 13. Searchable
  // -----------------------------------------------------------------------
  describe('searchable', () => {
    it('shows search input when panel is open and searchable', async () => {
      const user = userEvent.setup();
      render(<Select options={fruits} searchable />);
      await user.click(screen.getByRole('combobox'));
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });

    it('does not show search input when not searchable', async () => {
      const user = userEvent.setup();
      render(<Select options={fruits} />);
      await user.click(screen.getByRole('combobox'));
      expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
    });

    it('filters options as user types in search', async () => {
      const user = userEvent.setup();
      render(<Select options={fruits} searchable />);
      await user.click(screen.getByRole('combobox'));
      await user.type(screen.getByRole('searchbox'), 'ban');
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(1);
      expect(options[0]).toHaveTextContent('Banana');
    });

    it('shows emptyText when search returns no results', async () => {
      const user = userEvent.setup();
      render(<Select options={fruits} searchable emptyText="No matches" />);
      await user.click(screen.getByRole('combobox'));
      await user.type(screen.getByRole('searchbox'), 'zzz');
      expect(screen.getByText('No matches')).toBeInTheDocument();
    });
  });

  // -----------------------------------------------------------------------
  // 14. Loading
  // -----------------------------------------------------------------------
  describe('loading', () => {
    it('shows loading indicator when loading={true} and panel is open', async () => {
      const user = userEvent.setup();
      render(<Select options={[]} loading />);
      await user.click(screen.getByRole('combobox'));
      expect(screen.getByText('Cargando…')).toBeInTheDocument();
    });

    it('sets aria-busy="true" on the trigger when loading', () => {
      render(<Select options={[]} loading />);
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-busy', 'true');
    });

    it('does not set aria-busy when not loading', () => {
      render(<Select options={fruits} />);
      expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-busy');
    });
  });

  // -----------------------------------------------------------------------
  // 15. Grouped options
  // -----------------------------------------------------------------------
  describe('Grouped options', () => {
    it('renders group headers', async () => {
      const user = userEvent.setup();
      render(<Select options={grouped} />);
      await user.click(screen.getByRole('combobox'));
      expect(screen.getByText('Fruits')).toBeInTheDocument();
      expect(screen.getByText('Vegetables')).toBeInTheDocument();
    });

    it('renders ungrouped options without a header', async () => {
      const user = userEvent.setup();
      render(<Select options={grouped} />);
      await user.click(screen.getByRole('combobox'));
      expect(screen.getByRole('option', { name: 'Plain' })).toBeInTheDocument();
    });

    it('renders all options regardless of grouping', async () => {
      const user = userEvent.setup();
      render(<Select options={grouped} />);
      await user.click(screen.getByRole('combobox'));
      expect(screen.getAllByRole('option')).toHaveLength(4);
    });
  });

  // -----------------------------------------------------------------------
  // 16. Keyboard navigation
  // -----------------------------------------------------------------------
  describe('Keyboard navigation', () => {
    it('opens panel on Enter', async () => {
      const user = userEvent.setup();
      render(<Select options={fruits} />);
      screen.getByRole('combobox').focus();
      await user.keyboard('{Enter}');
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('opens panel on Space', async () => {
      const user = userEvent.setup();
      render(<Select options={fruits} />);
      screen.getByRole('combobox').focus();
      await user.keyboard(' ');
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('opens panel on ArrowDown when closed', async () => {
      const user = userEvent.setup();
      render(<Select options={fruits} />);
      screen.getByRole('combobox').focus();
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('moves active option down with ArrowDown', async () => {
      const user = userEvent.setup();
      render(<Select options={fruits} />);
      screen.getByRole('combobox').focus();
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      // Active descendant should point to the first (then second) option
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-activedescendant');
    });

    it('moves active option up with ArrowUp', async () => {
      const user = userEvent.setup();
      render(<Select options={fruits} />);
      screen.getByRole('combobox').focus();
      await user.keyboard('{ArrowDown}'); // opens + first active
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowUp}');
      const trigger = screen.getByRole('combobox');
      expect(trigger).toHaveAttribute('aria-activedescendant');
    });

    it('jumps to first enabled option on Home', async () => {
      const user = userEvent.setup();
      render(<Select options={fruits} />);
      screen.getByRole('combobox').focus();
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Home}');
      const trigger = screen.getByRole('combobox');
      const activeId = trigger.getAttribute('aria-activedescendant');
      expect(activeId).toBeTruthy();
    });

    it('jumps to last enabled option on End', async () => {
      const user = userEvent.setup();
      render(<Select options={fruits} />);
      screen.getByRole('combobox').focus();
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{End}');
      const trigger = screen.getByRole('combobox');
      const activeId = trigger.getAttribute('aria-activedescendant');
      expect(activeId).toBeTruthy();
    });

    it('selects active option on Enter when panel is open', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Select options={fruits} onChange={onChange} />);
      screen.getByRole('combobox').focus();
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');
      expect(onChange).toHaveBeenCalledWith('apple');
    });

    it('closes panel on Escape and returns focus to trigger', async () => {
      const user = userEvent.setup();
      render(<Select options={fruits} />);
      await user.click(screen.getByRole('combobox'));
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(screen.getByRole('combobox')).toHaveFocus();
    });

    it('closes panel on Tab', async () => {
      const user = userEvent.setup();
      render(<Select options={fruits} />);
      screen.getByRole('combobox').focus();
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      await user.tab();
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('skips disabled options with ArrowDown', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Select options={withDisabled} onChange={onChange} />);
      screen.getByRole('combobox').focus();
      await user.keyboard('{ArrowDown}'); // opens, active = Alpha(0)
      await user.keyboard('{ArrowDown}'); // active -> Alpha(0)
      await user.keyboard('{ArrowDown}'); // skip Bravo(1), active -> Charlie(2)
      await user.keyboard('{Enter}');
      expect(onChange).toHaveBeenCalledWith('c');
    });
  });

  // -----------------------------------------------------------------------
  // 17. Ref forwarding
  // -----------------------------------------------------------------------
  describe('Ref forwarding', () => {
    it('forwards ref to the trigger element', () => {
      const ref = createRef<HTMLButtonElement>();
      render(<Select ref={ref} options={fruits} />);
      expect(ref.current).toBe(screen.getByRole('combobox'));
    });

    it('ref can be used to programmatically focus the trigger', () => {
      const ref = createRef<HTMLButtonElement>();
      render(<Select ref={ref} options={fruits} />);
      ref.current?.focus();
      expect(ref.current).toHaveFocus();
    });
  });

  // -----------------------------------------------------------------------
  // 18. Accessibility
  // -----------------------------------------------------------------------
  describe('Accessibility', () => {
    it('forwards id to the trigger', () => {
      render(<Select options={fruits} id="my-select" />);
      expect(screen.getByRole('combobox')).toHaveAttribute('id', 'my-select');
    });

    it('forwards aria-invalid to the trigger', () => {
      render(<Select options={fruits} aria-invalid="true" />);
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-invalid',
        'true',
      );
    });

    it('forwards aria-required to the trigger', () => {
      render(<Select options={fruits} aria-required="true" />);
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-required',
        'true',
      );
    });

    it('forwards aria-describedby to the trigger', () => {
      render(<Select options={fruits} aria-describedby="helper-id" />);
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-describedby',
        'helper-id',
      );
    });

    it('applies name attribute to the trigger', () => {
      render(<Select options={fruits} name="role" />);
      expect(screen.getByRole('combobox')).toHaveAttribute('name', 'role');
    });

    it('sets aria-expanded="false" when closed', () => {
      render(<Select options={fruits} />);
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    });

    it('sets aria-expanded="true" when open', async () => {
      const user = userEvent.setup();
      render(<Select options={fruits} />);
      await user.click(screen.getByRole('combobox'));
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-expanded',
        'true',
      );
    });

    it('sets aria-controls pointing to the listbox when open', async () => {
      const user = userEvent.setup();
      render(<Select options={fruits} />);
      await user.click(screen.getByRole('combobox'));
      const listbox = screen.getByRole('listbox');
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-controls',
        listbox.id,
      );
    });

    it('sets aria-haspopup="listbox"', () => {
      render(<Select options={fruits} />);
      expect(screen.getByRole('combobox')).toHaveAttribute(
        'aria-haspopup',
        'listbox',
      );
    });

    it('emptyText is announced via role="status"', async () => {
      const user = userEvent.setup();
      render(<Select options={[]} emptyText="Nothing here" />);
      await user.click(screen.getByRole('combobox'));
      const statusEl = screen.getByText('Nothing here');
      expect(statusEl).toHaveAttribute('role', 'status');
    });

    it('clear button has aria-label', () => {
      render(<Select options={fruits} clearable defaultValue="apple" />);
      const btn = screen.getByRole('button', { name: /limpiar/i });
      expect(btn).toHaveAttribute('aria-label');
    });
  });

  // -----------------------------------------------------------------------
  // 19. Callbacks: onFocus & onBlur
  // -----------------------------------------------------------------------
  describe('Callbacks', () => {
    it('calls onFocus when trigger receives focus', async () => {
      const user = userEvent.setup();
      const onFocus = vi.fn();
      render(<Select options={fruits} onFocus={onFocus} />);
      await user.click(screen.getByRole('combobox'));
      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur when trigger loses focus', async () => {
      const user = userEvent.setup();
      const onBlur = vi.fn();
      render(
        <div>
          <Select options={fruits} onBlur={onBlur} />
          <button>other</button>
        </div>,
      );
      await user.click(screen.getByRole('combobox'));
      await user.click(screen.getByText('other'));
      expect(onBlur).toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // 20. Empty options
  // -----------------------------------------------------------------------
  describe('Empty options', () => {
    it('shows emptyText when options is empty (non-searchable)', async () => {
      const user = userEvent.setup();
      render(<Select options={[]} />);
      await user.click(screen.getByRole('combobox'));
      expect(screen.getByText('Sin resultados')).toBeInTheDocument();
    });

    it('shows custom emptyText', async () => {
      const user = userEvent.setup();
      render(<Select options={[]} emptyText="Nada aquí" />);
      await user.click(screen.getByRole('combobox'));
      expect(screen.getByText('Nada aquí')).toBeInTheDocument();
    });
  });
});
