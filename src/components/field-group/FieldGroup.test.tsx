import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { FieldGroup } from './FieldGroup';
import { Field } from '../field/Field';
import { InputText } from '../input-text/InputText';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function renderGroup(
  props: Partial<React.ComponentProps<typeof FieldGroup>> = {},
  children?: React.ReactNode,
) {
  return render(
    <FieldGroup {...props}>
      {children ?? (
        <Field name="test">
          <InputText />
        </Field>
      )}
    </FieldGroup>,
  );
}

// ---------------------------------------------------------------------------
// 1. Rendering
// ---------------------------------------------------------------------------
describe('FieldGroup', () => {
  describe('Rendering', () => {
    it('renders as a <fieldset> element', () => {
      const { container } = renderGroup();
      expect(container.firstElementChild?.tagName).toBe('FIELDSET');
    });

    it('renders with data-component="field-group"', () => {
      const { container } = renderGroup();
      expect(container.firstElementChild).toHaveAttribute(
        'data-component',
        'field-group',
      );
    });

    it('renders children inside the group', () => {
      const { container } = renderGroup();
      expect(container.querySelector('input')).toBeInTheDocument();
    });

    it('renders a <legend> when title is provided', () => {
      const { container } = renderGroup({ title: 'Personal Info' });
      expect(container.querySelector('legend')).toBeInTheDocument();
    });

    it('does not render a <legend> when title is null', () => {
      const { container } = renderGroup({ title: null });
      expect(container.querySelector('legend')).not.toBeInTheDocument();
    });

    it('renders the title text inside the legend', () => {
      renderGroup({ title: 'Personal Info' });
      expect(screen.getByText('Personal Info')).toBeInTheDocument();
    });

    it('renders description text when provided', () => {
      renderGroup({ title: 'Info', description: 'Fill in the details below' });
      expect(screen.getByText('Fill in the details below')).toBeInTheDocument();
    });

    it('does not render description when not provided', () => {
      const { container } = renderGroup({ title: 'Info' });
      expect(
        container.querySelector('[data-field-group-description]'),
      ).not.toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // 2. Layout — columns and gap
  // -------------------------------------------------------------------------
  describe('Layout', () => {
    it('defaults to 1 column — data-columns="1"', () => {
      const { container } = renderGroup();
      expect(container.firstElementChild).toHaveAttribute('data-columns', '1');
    });

    it.each([1, 2, 3, 4] as const)(
      'applies data-columns="%s" to the fieldset',
      (columns) => {
        const { container } = renderGroup({ columns });
        expect(container.firstElementChild).toHaveAttribute(
          'data-columns',
          String(columns),
        );
      },
    );

    it('defaults to gap="md" — data-gap="md"', () => {
      const { container } = renderGroup();
      expect(container.firstElementChild).toHaveAttribute('data-gap', 'md');
    });

    it.each(['sm', 'md', 'lg'] as const)(
      'applies data-gap="%s" to the fieldset',
      (gap) => {
        const { container } = renderGroup({ gap });
        expect(container.firstElementChild).toHaveAttribute('data-gap', gap);
      },
    );

    it('content div uses CSS grid', () => {
      const { container } = renderGroup({ columns: 2 });
      const grid = container.querySelector('[role="group"]');
      expect(grid).toHaveStyle({ display: 'grid' });
    });

    it('content grid applies correct column count', () => {
      const { container } = renderGroup({ columns: 3 });
      const grid = container.querySelector('[role="group"]');
      expect(grid).toHaveStyle({
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      });
    });
  });

  // -------------------------------------------------------------------------
  // 3. Collapsible — uncontrolled
  // -------------------------------------------------------------------------
  describe('Collapsible (uncontrolled)', () => {
    it('is not collapsible by default — no trigger button in legend', () => {
      renderGroup({ title: 'Section' });
      // The text should be in a span, not a button
      expect(
        screen.queryByRole('button', { name: /section/i }),
      ).not.toBeInTheDocument();
    });

    it('renders a trigger <button> in the legend when collapsible', () => {
      renderGroup({ title: 'Section', collapsible: true });
      expect(
        screen.getByRole('button', { name: /section/i }),
      ).toBeInTheDocument();
    });

    it('content is visible by default (defaultCollapsed=false)', () => {
      const { container } = renderGroup({ title: 'S', collapsible: true });
      const content = container.querySelector('[role="group"]');
      expect(content).not.toHaveAttribute('hidden');
    });

    it('content is hidden when defaultCollapsed=true', () => {
      const { container } = renderGroup({
        title: 'S',
        collapsible: true,
        defaultCollapsed: true,
      });
      const content = container.querySelector('[role="group"]');
      expect(content).toHaveAttribute('hidden');
    });

    it('data-collapsed="true" is set when collapsed', () => {
      const { container } = renderGroup({
        title: 'S',
        collapsible: true,
        defaultCollapsed: true,
      });
      expect(container.firstElementChild).toHaveAttribute(
        'data-collapsed',
        'true',
      );
    });

    it('toggles content visibility on trigger click', async () => {
      const user = userEvent.setup();
      const { container } = renderGroup({
        title: 'Section',
        collapsible: true,
      });
      const trigger = screen.getByRole('button', { name: /section/i });
      const content = container.querySelector('[role="group"]');

      expect(content).not.toHaveAttribute('hidden');
      await user.click(trigger);
      expect(content).toHaveAttribute('hidden');
      await user.click(trigger);
      expect(content).not.toHaveAttribute('hidden');
    });

    it('trigger has aria-expanded=true when expanded', () => {
      renderGroup({ title: 'S', collapsible: true, defaultCollapsed: false });
      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('trigger has aria-expanded=false when collapsed', () => {
      renderGroup({
        title: 'S',
        collapsible: true,
        defaultCollapsed: true,
      });
      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('trigger aria-controls points to content div id', () => {
      const { container } = renderGroup({
        title: 'S',
        collapsible: true,
      });
      const trigger = screen.getByRole('button');
      const content = container.querySelector('[role="group"]');
      expect(trigger.getAttribute('aria-controls')).toBe(content?.id);
    });

    it('fires onCollapsedChange with new state on toggle', async () => {
      const user = userEvent.setup();
      const onCollapsedChange = vi.fn();
      renderGroup({
        title: 'Section',
        collapsible: true,
        onCollapsedChange,
      });
      await user.click(screen.getByRole('button', { name: /section/i }));
      expect(onCollapsedChange).toHaveBeenCalledWith(true);
      await user.click(screen.getByRole('button', { name: /section/i }));
      expect(onCollapsedChange).toHaveBeenCalledWith(false);
    });
  });

  // -------------------------------------------------------------------------
  // 4. Collapsible — controlled
  // -------------------------------------------------------------------------
  describe('Collapsible (controlled)', () => {
    it('respects controlled collapsed=true', () => {
      const { container } = renderGroup({
        title: 'S',
        collapsible: true,
        collapsed: true,
        onCollapsedChange: vi.fn(),
      });
      expect(container.querySelector('[role="group"]')).toHaveAttribute(
        'hidden',
      );
    });

    it('respects controlled collapsed=false', () => {
      const { container } = renderGroup({
        title: 'S',
        collapsible: true,
        collapsed: false,
        onCollapsedChange: vi.fn(),
      });
      expect(container.querySelector('[role="group"]')).not.toHaveAttribute(
        'hidden',
      );
    });

    it('fires onCollapsedChange when trigger is clicked in controlled mode', async () => {
      const user = userEvent.setup();
      const onCollapsedChange = vi.fn();
      renderGroup({
        title: 'Section',
        collapsible: true,
        collapsed: false,
        onCollapsedChange,
      });
      await user.click(screen.getByRole('button', { name: /section/i }));
      expect(onCollapsedChange).toHaveBeenCalledWith(true);
    });
  });

  // -------------------------------------------------------------------------
  // 5. Disabled propagation
  // -------------------------------------------------------------------------
  describe('disabled', () => {
    it('is not disabled by default — no data-disabled attribute', () => {
      const { container } = renderGroup();
      expect(container.firstElementChild).not.toHaveAttribute('data-disabled');
    });

    it('sets data-disabled="true" on the fieldset when disabled', () => {
      const { container } = renderGroup({ disabled: true });
      expect(container.firstElementChild).toHaveAttribute(
        'data-disabled',
        'true',
      );
    });

    it('propagates disabled to Field → InputText via FieldGroupContext', () => {
      const { container } = render(
        <FieldGroup disabled>
          <Field name="email">
            <InputText />
          </Field>
        </FieldGroup>,
      );
      expect(container.querySelector('input')).toBeDisabled();
    });

    it('ancestor FieldGroup disabled cannot be overridden by Field disabled=false', () => {
      const { container } = render(
        <FieldGroup disabled>
          <Field name="email" disabled={false}>
            <InputText />
          </Field>
        </FieldGroup>,
      );
      expect(container.querySelector('input')).toBeDisabled();
    });

    it('collapsible trigger button is disabled when FieldGroup is disabled', () => {
      renderGroup({ title: 'S', collapsible: true, disabled: true });
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  // -------------------------------------------------------------------------
  // 6. ID prop
  // -------------------------------------------------------------------------
  describe('id', () => {
    it('uses the provided id on the fieldset', () => {
      const { container } = renderGroup({ id: 'my-group' });
      expect(container.firstElementChild).toHaveAttribute('id', 'my-group');
    });

    it('auto-generates a stable id when not provided', () => {
      const { container } = renderGroup();
      expect(container.firstElementChild?.id).not.toBe('');
    });
  });

  // -------------------------------------------------------------------------
  // 7. data-collapsible attribute
  // -------------------------------------------------------------------------
  describe('data-collapsible', () => {
    it('sets data-collapsible="true" when collapsible', () => {
      const { container } = renderGroup({ title: 'S', collapsible: true });
      expect(container.firstElementChild).toHaveAttribute(
        'data-collapsible',
        'true',
      );
    });

    it('does not set data-collapsible when not collapsible', () => {
      const { container } = renderGroup();
      expect(container.firstElementChild).not.toHaveAttribute(
        'data-collapsible',
      );
    });
  });

  // -------------------------------------------------------------------------
  // 8. Nested FieldGroups
  // -------------------------------------------------------------------------
  describe('Nested FieldGroups', () => {
    it('renders nested FieldGroups without errors', () => {
      expect(() =>
        render(
          <FieldGroup title="Outer">
            <FieldGroup title="Inner">
              <Field name="x">
                <InputText />
              </Field>
            </FieldGroup>
          </FieldGroup>,
        ),
      ).not.toThrow();
    });

    it('outer disabled propagates through nested FieldGroup to InputText', () => {
      const { container } = render(
        <FieldGroup disabled>
          <FieldGroup>
            <Field name="x">
              <InputText />
            </Field>
          </FieldGroup>
        </FieldGroup>,
      );
      expect(container.querySelector('input')).toBeDisabled();
    });
  });
});
