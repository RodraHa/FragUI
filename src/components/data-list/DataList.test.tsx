import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import { DataList } from './DataList';
import type { DataItem } from './DataList';

const baseItems: DataItem[] = [
  {
    id: 'dato-1',
    label: 'Título del Dato 1',
    description: 'Descripción del dato 1',
    meta: 'Estado',
  },
  {
    id: 'dato-2',
    label: 'Título del Dato 2',
    description: 'Descripción del dato 2',
    meta: 'Estado',
  },
  {
    id: 'dato-3',
    label: 'Título del Dato 3',
    description: 'Descripción del dato 3',
    meta: 'Estado',
  },
  {
    id: 'dato-4',
    label: 'Título del Dato 4',
    description: 'Descripción del dato 4',
    meta: 'Inactivo',
    disabled: true,
  },
];

describe('DataList', () => {
  // ---------------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------------
  describe('Rendering', () => {
    it('renders a <ul> as the list container', () => {
      const { container } = render(<DataList items={baseItems} />);
      expect(container.firstChild?.nodeName).toBe('UL');
    });

    it('renders one <li> per item', () => {
      render(<DataList items={baseItems} />);
      expect(screen.getAllByRole('listitem')).toHaveLength(baseItems.length);
    });

    it('renders label, description and meta for each item', () => {
      render(<DataList items={baseItems} />);
      expect(screen.getByText('Título del Dato 1')).toBeInTheDocument();
      expect(screen.getByText('Descripción del dato 1')).toBeInTheDocument();
      expect(screen.getAllByText('Estado')).toHaveLength(3);
    });

    it('applies data-variant="default" by default', () => {
      const { container } = render(<DataList items={baseItems} />);
      expect(container.firstChild).toHaveAttribute('data-variant', 'default');
    });
  });

  // ---------------------------------------------------------------------------
  // Variants
  // ---------------------------------------------------------------------------
  describe('variant', () => {
    it.each(['default', 'compact', 'spaced'] as const)(
      'applies variant="%s"',
      (variant) => {
        const { container } = render(
          <DataList items={baseItems} variant={variant} />,
        );
        expect(container.firstChild).toHaveAttribute('data-variant', variant);
      },
    );

    it('hides description in compact variant', () => {
      render(<DataList items={baseItems} variant="compact" />);
      expect(
        screen.queryByText('Descripción del dato 1'),
      ).not.toBeInTheDocument();
    });

    it('keeps description in spaced variant', () => {
      render(<DataList items={baseItems} variant="spaced" />);
      expect(screen.getByText('Descripción del dato 1')).toBeInTheDocument();
    });
  });

  // ---------------------------------------------------------------------------
  // Non-selectable semantics
  // ---------------------------------------------------------------------------
  describe('Non-selectable', () => {
    it('does not set role="listbox" when not selectable', () => {
      render(<DataList items={baseItems} />);
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('does not render checkbox markers when not selectable', () => {
      const { container } = render(<DataList items={baseItems} />);
      // Checkbox has role-less aria-hidden span; check its presence via style-less absence
      const lis = container.querySelectorAll('li');
      lis.forEach((li) => {
        expect(
          li.querySelector('span[aria-hidden="true"]'),
        ).not.toBeInTheDocument();
      });
    });

    it('is not focusable when not selectable', async () => {
      const user = userEvent.setup();
      render(<DataList items={baseItems} />);
      await user.tab();
      expect(document.activeElement).toBe(document.body);
    });
  });

  // ---------------------------------------------------------------------------
  // Selectable semantics
  // ---------------------------------------------------------------------------
  describe('Selectable', () => {
    it('renders as role="listbox" with aria-multiselectable', () => {
      render(<DataList items={baseItems} selectable />);
      const listbox = screen.getByRole('listbox');
      expect(listbox).toHaveAttribute('aria-multiselectable', 'true');
    });

    it('renders each item as role="option"', () => {
      render(<DataList items={baseItems} selectable />);
      expect(screen.getAllByRole('option')).toHaveLength(baseItems.length);
    });

    it('hides the checkbox from assistive tech (aria-hidden)', () => {
      const { container } = render(<DataList items={baseItems} selectable />);
      const firstItem = container.querySelector('li')!;
      const hiddenSpan = firstItem.querySelector('span[aria-hidden="true"]');
      expect(hiddenSpan).toBeInTheDocument();
    });

    it('is focusable via Tab when selectable', async () => {
      const user = userEvent.setup();
      render(<DataList items={baseItems} selectable />);
      await user.tab();
      expect(screen.getByRole('listbox')).toHaveFocus();
    });

    it('marks disabled items with aria-disabled', () => {
      render(<DataList items={baseItems} selectable />);
      const options = screen.getAllByRole('option');
      expect(options[3]).toHaveAttribute('aria-disabled', 'true');
    });
  });

  // ---------------------------------------------------------------------------
  // Selection — uncontrolled
  // ---------------------------------------------------------------------------
  describe('Selection (uncontrolled)', () => {
    it('selects an item on click', async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      render(
        <DataList
          items={baseItems}
          selectable
          onSelectionChange={onSelectionChange}
        />,
      );
      await user.click(
        screen.getByRole('option', { name: /Título del Dato 1/ }),
      );
      expect(onSelectionChange).toHaveBeenCalledWith(['dato-1']);
      expect(
        screen.getByRole('option', { name: /Título del Dato 1/ }),
      ).toHaveAttribute('aria-selected', 'true');
    });

    it('toggles selection on second click', async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      render(
        <DataList
          items={baseItems}
          selectable
          onSelectionChange={onSelectionChange}
        />,
      );
      const option = screen.getByRole('option', {
        name: /Título del Dato 1/,
      });
      await user.click(option);
      await user.click(option);
      expect(onSelectionChange).toHaveBeenLastCalledWith([]);
      expect(option).toHaveAttribute('aria-selected', 'false');
    });

    it('supports multiple selection', async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      render(
        <DataList
          items={baseItems}
          selectable
          onSelectionChange={onSelectionChange}
        />,
      );
      await user.click(screen.getByRole('option', { name: /Dato 1/ }));
      await user.click(screen.getByRole('option', { name: /Dato 2/ }));
      expect(onSelectionChange).toHaveBeenLastCalledWith(['dato-1', 'dato-2']);
    });

    it('respects defaultSelectedKeys', () => {
      render(
        <DataList
          items={baseItems}
          selectable
          defaultSelectedKeys={['dato-2']}
        />,
      );
      expect(screen.getByRole('option', { name: /Dato 2/ })).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });

    it('does not select disabled items on click', async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      render(
        <DataList
          items={baseItems}
          selectable
          onSelectionChange={onSelectionChange}
        />,
      );
      await user.click(screen.getByRole('option', { name: /Dato 4/ }));
      expect(onSelectionChange).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // Selection — controlled
  // ---------------------------------------------------------------------------
  describe('Selection (controlled)', () => {
    it('reflects the externally controlled selection', () => {
      render(
        <DataList
          items={baseItems}
          selectable
          selectedKeys={['dato-3']}
          onSelectionChange={vi.fn()}
        />,
      );
      expect(screen.getByRole('option', { name: /Dato 3/ })).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });

    it('does not mutate internal state without parent update', async () => {
      const user = userEvent.setup();
      render(
        <DataList
          items={baseItems}
          selectable
          selectedKeys={['dato-1']}
          onSelectionChange={vi.fn()}
        />,
      );
      await user.click(screen.getByRole('option', { name: /Dato 2/ }));
      expect(screen.getByRole('option', { name: /Dato 2/ })).toHaveAttribute(
        'aria-selected',
        'false',
      );
      expect(screen.getByRole('option', { name: /Dato 1/ })).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });

    it('updates when parent pushes new value', async () => {
      const user = userEvent.setup();
      function Controlled() {
        const [sel, setSel] = useState<string[]>([]);
        return (
          <DataList
            items={baseItems}
            selectable
            selectedKeys={sel}
            onSelectionChange={setSel}
          />
        );
      }
      render(<Controlled />);
      await user.click(screen.getByRole('option', { name: /Dato 2/ }));
      expect(screen.getByRole('option', { name: /Dato 2/ })).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });
  });

  // ---------------------------------------------------------------------------
  // Keyboard navigation
  // ---------------------------------------------------------------------------
  describe('Keyboard', () => {
    it('moves focus with ArrowDown and sets aria-activedescendant', async () => {
      const user = userEvent.setup();
      render(<DataList items={baseItems} selectable />);
      await user.tab();
      await user.keyboard('{ArrowDown}');
      const listbox = screen.getByRole('listbox');
      const activeId = listbox.getAttribute('aria-activedescendant');
      expect(activeId).toMatch(/-option-dato-2$/);
    });

    it('wraps focus at the end with ArrowDown', async () => {
      const user = userEvent.setup();
      render(
        <DataList items={baseItems} selectable defaultSelectedKeys={[]} />,
      );
      await user.tab();
      // Go down 3 times (dato-1 → dato-2 → dato-3 → back to dato-1 since dato-4 is disabled)
      await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');
      const listbox = screen.getByRole('listbox');
      expect(listbox.getAttribute('aria-activedescendant')).toMatch(
        /-option-dato-1$/,
      );
    });

    it('moves focus to the last enabled item with End', async () => {
      const user = userEvent.setup();
      render(<DataList items={baseItems} selectable />);
      await user.tab();
      await user.keyboard('{End}');
      const listbox = screen.getByRole('listbox');
      expect(listbox.getAttribute('aria-activedescendant')).toMatch(
        /-option-dato-3$/,
      );
    });

    it('moves focus to the first item with Home', async () => {
      const user = userEvent.setup();
      render(<DataList items={baseItems} selectable />);
      await user.tab();
      await user.keyboard('{End}{Home}');
      const listbox = screen.getByRole('listbox');
      expect(listbox.getAttribute('aria-activedescendant')).toMatch(
        /-option-dato-1$/,
      );
    });

    it('toggles the focused item with Space', async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      render(
        <DataList
          items={baseItems}
          selectable
          onSelectionChange={onSelectionChange}
        />,
      );
      await user.tab();
      await user.keyboard(' ');
      expect(onSelectionChange).toHaveBeenCalledWith(['dato-1']);
    });

    it('toggles the focused item with Enter', async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      render(
        <DataList
          items={baseItems}
          selectable
          onSelectionChange={onSelectionChange}
        />,
      );
      await user.tab();
      await user.keyboard('{Enter}');
      expect(onSelectionChange).toHaveBeenCalledWith(['dato-1']);
    });

    it('ignores keyboard when the component is disabled', async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      render(
        <DataList
          items={baseItems}
          selectable
          disabled
          onSelectionChange={onSelectionChange}
        />,
      );
      await user.tab();
      await user.keyboard('{ArrowDown} ');
      expect(onSelectionChange).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // Disabled
  // ---------------------------------------------------------------------------
  describe('disabled', () => {
    it('marks the container as aria-disabled when disabled+selectable', () => {
      render(<DataList items={baseItems} selectable disabled />);
      expect(screen.getByRole('listbox')).toHaveAttribute(
        'aria-disabled',
        'true',
      );
    });

    it('does not fire onSelectionChange when disabled', async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      render(
        <DataList
          items={baseItems}
          selectable
          disabled
          onSelectionChange={onSelectionChange}
        />,
      );
      await user.click(screen.getByRole('option', { name: /Dato 1/ }));
      expect(onSelectionChange).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------
  describe('loading', () => {
    it('renders aria-busy="true"', () => {
      const { container } = render(<DataList items={baseItems} loading />);
      expect(container.firstChild).toHaveAttribute('aria-busy', 'true');
    });

    it('renders 4 skeleton rows by default', () => {
      render(<DataList items={baseItems} loading />);
      expect(screen.getAllByTestId('data-list-skeleton-row')).toHaveLength(4);
    });

    it('does not render items while loading', () => {
      render(<DataList items={baseItems} loading />);
      expect(screen.queryByText('Título del Dato 1')).not.toBeInTheDocument();
    });
  });

  // ---------------------------------------------------------------------------
  // Empty
  // ---------------------------------------------------------------------------
  describe('empty', () => {
    it('renders default empty message when items is empty', () => {
      render(<DataList items={[]} />);
      expect(screen.getByTestId('data-list-empty')).toHaveTextContent(
        'No hay datos',
      );
    });

    it('renders custom emptyState when provided', () => {
      render(
        <DataList
          items={[]}
          emptyState={<span>Sin resultados para esta búsqueda</span>}
        />,
      );
      expect(
        screen.getByText('Sin resultados para esta búsqueda'),
      ).toBeInTheDocument();
    });

    it('prefers loading state over empty state', () => {
      render(<DataList items={[]} loading />);
      expect(screen.queryByTestId('data-list-empty')).not.toBeInTheDocument();
      expect(screen.getAllByTestId('data-list-skeleton-row').length).toBe(4);
    });
  });

  // ---------------------------------------------------------------------------
  // renderItem
  // ---------------------------------------------------------------------------
  describe('renderItem', () => {
    it('uses custom renderItem when provided', () => {
      render(
        <DataList
          items={baseItems}
          renderItem={(item) => (
            <div data-testid={`custom-${item.id}`}>CUSTOM {item.label}</div>
          )}
        />,
      );
      expect(screen.getByTestId('custom-dato-1')).toHaveTextContent(
        'CUSTOM Título del Dato 1',
      );
    });

    it('exposes selection / focus / disabled state to renderItem', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <DataList
          items={baseItems}
          selectable
          renderItem={(item, state) => (
            <span data-testid={`state-${item.id}`}>
              {state.selected ? 'sel' : 'unsel'}/
              {state.disabled ? 'disabled' : 'enabled'}
            </span>
          )}
        />,
      );
      expect(screen.getByTestId('state-dato-1')).toHaveTextContent(
        'unsel/enabled',
      );
      expect(screen.getByTestId('state-dato-4')).toHaveTextContent(
        'unsel/disabled',
      );
      const firstOption = container.querySelector(
        'li[data-item-id="dato-1"]',
      ) as HTMLElement;
      await user.click(firstOption);
      expect(screen.getByTestId('state-dato-1')).toHaveTextContent(
        'sel/enabled',
      );
    });
  });

  // ---------------------------------------------------------------------------
  // Native props
  // ---------------------------------------------------------------------------
  describe('Native props', () => {
    it('forwards className', () => {
      const { container } = render(
        <DataList items={baseItems} className="my-list" />,
      );
      expect(container.firstChild).toHaveClass('my-list');
    });

    it('forwards aria-label when selectable', () => {
      render(
        <DataList
          items={baseItems}
          selectable
          aria-label="Lista de registros"
        />,
      );
      expect(
        screen.getByRole('listbox', { name: 'Lista de registros' }),
      ).toBeInTheDocument();
    });
  });
});
