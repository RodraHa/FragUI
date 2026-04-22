import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import { Tabs } from './Tabs';
import type { TabItem } from './Tabs';

const basicTabs: TabItem[] = [
  { id: 'general', label: 'General', content: 'General panel' },
  { id: 'details', label: 'Details', content: 'Details panel' },
  { id: 'history', label: 'History', content: 'History panel' },
];

function renderTabs(props: Partial<React.ComponentProps<typeof Tabs>> = {}) {
  return render(<Tabs tabs={basicTabs} {...props} />);
}

describe('Tabs', () => {
  // ---------------------------------------------------------------------------
  // Semántica y renderizado básico
  // ---------------------------------------------------------------------------
  describe('Rendering', () => {
    it('renders a tablist with a tab per item', () => {
      renderTabs();
      const tablist = screen.getByRole('tablist');
      expect(tablist).toBeInTheDocument();
      expect(within(tablist).getAllByRole('tab')).toHaveLength(3);
    });

    it('renders one tabpanel per tab and associates it via ARIA', () => {
      renderTabs();
      const tabs = screen.getAllByRole('tab');
      tabs.forEach((tab) => {
        const controlsId = tab.getAttribute('aria-controls');
        expect(controlsId).toBeTruthy();
        const panel = document.getElementById(controlsId!);
        expect(panel).toBeInTheDocument();
        expect(panel).toHaveAttribute('aria-labelledby', tab.id);
      });
    });

    it('renders only the active panel content', () => {
      renderTabs();
      expect(screen.getByText('General panel')).toBeInTheDocument();
      expect(screen.queryByText('Details panel')).not.toBeInTheDocument();
      expect(screen.queryByText('History panel')).not.toBeInTheDocument();
    });

    it('uses native <button> elements for tabs', () => {
      renderTabs();
      screen.getAllByRole('tab').forEach((tab) => {
        expect(tab.tagName).toBe('BUTTON');
      });
    });
  });

  // ---------------------------------------------------------------------------
  // Props: value / defaultValue / controlled
  // ---------------------------------------------------------------------------
  describe('value / defaultValue', () => {
    it('activates the first tab by default', () => {
      renderTabs();
      expect(screen.getByRole('tab', { name: 'General' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });

    it('honors defaultValue in uncontrolled mode', () => {
      renderTabs({ defaultValue: 'details' });
      expect(screen.getByRole('tab', { name: 'Details' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });

    it('falls back to the first enabled tab when defaultValue is invalid', () => {
      renderTabs({ defaultValue: 'does-not-exist' });
      expect(screen.getByRole('tab', { name: 'General' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });

    it('honors value in controlled mode', () => {
      renderTabs({ value: 'history' });
      expect(screen.getByRole('tab', { name: 'History' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });

    it('does not change internal state when controlled and parent does not update', async () => {
      const user = userEvent.setup();
      renderTabs({ value: 'general', onChange: vi.fn() });
      await user.click(screen.getByRole('tab', { name: 'Details' }));
      expect(screen.getByRole('tab', { name: 'General' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });

    it('updates when the controlling parent sets a new value', async () => {
      const user = userEvent.setup();

      function Controlled() {
        const [value, setValue] = useState('general');
        return <Tabs tabs={basicTabs} value={value} onChange={setValue} />;
      }

      render(<Controlled />);
      await user.click(screen.getByRole('tab', { name: 'Details' }));
      expect(screen.getByRole('tab', { name: 'Details' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });
  });

  // ---------------------------------------------------------------------------
  // Props: onChange
  // ---------------------------------------------------------------------------
  describe('onChange', () => {
    it('calls onChange with the new id when clicking a tab', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderTabs({ onChange });
      await user.click(screen.getByRole('tab', { name: 'Details' }));
      expect(onChange).toHaveBeenCalledWith('details');
    });

    it('does not call onChange when clicking the already-active tab', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderTabs({ onChange });
      await user.click(screen.getByRole('tab', { name: 'General' }));
      expect(onChange).not.toHaveBeenCalled();
    });

    it('does not call onChange when clicking a disabled tab', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const tabs: TabItem[] = [
        basicTabs[0],
        { ...basicTabs[1], disabled: true },
        basicTabs[2],
      ];
      render(<Tabs tabs={tabs} onChange={onChange} />);
      await user.click(screen.getByRole('tab', { name: 'Details' }));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // Props: orientation
  // ---------------------------------------------------------------------------
  describe('orientation', () => {
    it('defaults to horizontal', () => {
      renderTabs();
      expect(screen.getByRole('tablist')).toHaveAttribute(
        'aria-orientation',
        'horizontal',
      );
    });

    it('applies vertical orientation when requested', () => {
      renderTabs({ orientation: 'vertical' });
      expect(screen.getByRole('tablist')).toHaveAttribute(
        'aria-orientation',
        'vertical',
      );
    });
  });

  // ---------------------------------------------------------------------------
  // Roving tabindex
  // ---------------------------------------------------------------------------
  describe('Roving tabindex', () => {
    it('gives tabIndex=0 only to the active tab', () => {
      renderTabs({ defaultValue: 'details' });
      expect(screen.getByRole('tab', { name: 'General' })).toHaveAttribute(
        'tabindex',
        '-1',
      );
      expect(screen.getByRole('tab', { name: 'Details' })).toHaveAttribute(
        'tabindex',
        '0',
      );
      expect(screen.getByRole('tab', { name: 'History' })).toHaveAttribute(
        'tabindex',
        '-1',
      );
    });

    it('focuses the active tab when the tablist receives Tab focus', async () => {
      const user = userEvent.setup();
      renderTabs({ defaultValue: 'details' });
      await user.tab();
      expect(screen.getByRole('tab', { name: 'Details' })).toHaveFocus();
    });
  });

  // ---------------------------------------------------------------------------
  // Keyboard interaction (horizontal)
  // ---------------------------------------------------------------------------
  describe('Keyboard — horizontal', () => {
    it('moves focus with ArrowRight', async () => {
      const user = userEvent.setup();
      renderTabs();
      await user.tab();
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: 'Details' })).toHaveFocus();
    });

    it('moves focus with ArrowLeft (wrapping)', async () => {
      const user = userEvent.setup();
      renderTabs();
      await user.tab();
      await user.keyboard('{ArrowLeft}');
      expect(screen.getByRole('tab', { name: 'History' })).toHaveFocus();
    });

    it('wraps at the end with ArrowRight', async () => {
      const user = userEvent.setup();
      renderTabs({ defaultValue: 'history' });
      await user.tab();
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: 'General' })).toHaveFocus();
    });

    it('does not move focus with ArrowDown in horizontal orientation', async () => {
      const user = userEvent.setup();
      renderTabs();
      await user.tab();
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('tab', { name: 'General' })).toHaveFocus();
    });

    it('Home moves focus to the first enabled tab', async () => {
      const user = userEvent.setup();
      renderTabs({ defaultValue: 'history' });
      await user.tab();
      await user.keyboard('{Home}');
      expect(screen.getByRole('tab', { name: 'General' })).toHaveFocus();
    });

    it('End moves focus to the last enabled tab', async () => {
      const user = userEvent.setup();
      renderTabs();
      await user.tab();
      await user.keyboard('{End}');
      expect(screen.getByRole('tab', { name: 'History' })).toHaveFocus();
    });
  });

  // ---------------------------------------------------------------------------
  // Keyboard interaction (vertical)
  // ---------------------------------------------------------------------------
  describe('Keyboard — vertical', () => {
    it('moves focus with ArrowDown in vertical orientation', async () => {
      const user = userEvent.setup();
      renderTabs({ orientation: 'vertical' });
      await user.tab();
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('tab', { name: 'Details' })).toHaveFocus();
    });

    it('moves focus with ArrowUp (wrapping) in vertical orientation', async () => {
      const user = userEvent.setup();
      renderTabs({ orientation: 'vertical' });
      await user.tab();
      await user.keyboard('{ArrowUp}');
      expect(screen.getByRole('tab', { name: 'History' })).toHaveFocus();
    });

    it('ignores ArrowRight in vertical orientation', async () => {
      const user = userEvent.setup();
      renderTabs({ orientation: 'vertical' });
      await user.tab();
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: 'General' })).toHaveFocus();
    });
  });

  // ---------------------------------------------------------------------------
  // Activation
  // ---------------------------------------------------------------------------
  describe('activation', () => {
    it('defaults to automatic: arrow keys activate the focused tab', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderTabs({ onChange });
      await user.tab();
      await user.keyboard('{ArrowRight}');
      expect(onChange).toHaveBeenCalledWith('details');
      expect(screen.getByRole('tab', { name: 'Details' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });

    it('manual: arrow keys move focus without activating', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderTabs({ onChange, activation: 'manual' });
      await user.tab();
      await user.keyboard('{ArrowRight}');
      expect(onChange).not.toHaveBeenCalled();
      expect(screen.getByRole('tab', { name: 'General' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });

    it('manual: Enter activates the focused tab', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderTabs({ onChange, activation: 'manual' });
      await user.tab();
      await user.keyboard('{ArrowRight}{Enter}');
      expect(onChange).toHaveBeenCalledWith('details');
    });

    it('manual: Space activates the focused tab', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderTabs({ onChange, activation: 'manual' });
      await user.tab();
      await user.keyboard('{ArrowRight}{ }');
      expect(onChange).toHaveBeenCalledWith('details');
    });
  });

  // ---------------------------------------------------------------------------
  // Disabled item / component
  // ---------------------------------------------------------------------------
  describe('disabled', () => {
    const tabsWithDisabled: TabItem[] = [
      basicTabs[0],
      { ...basicTabs[1], disabled: true },
      basicTabs[2],
    ];

    it('skips disabled tabs with arrow navigation', async () => {
      const user = userEvent.setup();
      render(<Tabs tabs={tabsWithDisabled} />);
      await user.tab();
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: 'History' })).toHaveFocus();
    });

    it('marks disabled tabs with aria-disabled', () => {
      render(<Tabs tabs={tabsWithDisabled} />);
      expect(screen.getByRole('tab', { name: 'Details' })).toHaveAttribute(
        'aria-disabled',
        'true',
      );
    });

    it('does not call onChange when clicking disabled tab', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Tabs tabs={tabsWithDisabled} onChange={onChange} />);
      await user.click(screen.getByRole('tab', { name: 'Details' }));
      expect(onChange).not.toHaveBeenCalled();
    });

    it('falls back to first enabled tab when defaultValue points to a disabled tab', () => {
      render(<Tabs tabs={tabsWithDisabled} defaultValue="details" />);
      expect(screen.getByRole('tab', { name: 'General' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });

    it('disables all tabs when the component is disabled', () => {
      renderTabs({ disabled: true });
      screen.getAllByRole('tab').forEach((tab) => {
        expect(tab).toBeDisabled();
        expect(tab).toHaveAttribute('aria-disabled', 'true');
      });
    });

    it('sets aria-disabled on the tablist when the component is disabled', () => {
      renderTabs({ disabled: true });
      expect(screen.getByRole('tablist')).toHaveAttribute(
        'aria-disabled',
        'true',
      );
    });
  });

  // ---------------------------------------------------------------------------
  // Indicator (visual)
  // ---------------------------------------------------------------------------
  describe('Active indicator', () => {
    it('renders the indicator only on the active tab', () => {
      renderTabs({ defaultValue: 'details' });
      expect(
        screen.queryByTestId('tabs-indicator-general'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('tabs-indicator-details')).toBeInTheDocument();
      expect(
        screen.queryByTestId('tabs-indicator-history'),
      ).not.toBeInTheDocument();
    });

    it('does not render the indicator on disabled tabs even if they were active', () => {
      renderTabs({ disabled: true });
      expect(
        screen.queryByTestId('tabs-indicator-general'),
      ).not.toBeInTheDocument();
    });
  });

  // ---------------------------------------------------------------------------
  // Native props forwarding
  // ---------------------------------------------------------------------------
  describe('Native props', () => {
    it('forwards className to the root container', () => {
      const { container } = renderTabs({ className: 'my-tabs' });
      expect(container.firstChild).toHaveClass('my-tabs');
    });

    it('forwards id to the root container', () => {
      renderTabs({ id: 'root-tabs' });
      expect(document.getElementById('root-tabs')).toBeInTheDocument();
    });
  });
});
