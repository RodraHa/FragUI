import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  // ---------------------------------------------------------------------------
  // Semántica y renderizado básico
  // ---------------------------------------------------------------------------
  describe('Rendering', () => {
    it('renders a native <button> element', () => {
      render(<Button>Click me</Button>);
      const btn = screen.getByRole('button', { name: /click me/i });
      expect(btn.tagName).toBe('BUTTON');
    });

    it('renders children text', () => {
      render(<Button>Click me</Button>);
      expect(
        screen.getByRole('button', { name: /click me/i }),
      ).toBeInTheDocument();
    });
  });

  // ---------------------------------------------------------------------------
  // Props: variant
  // ---------------------------------------------------------------------------
  describe('variant', () => {
    it('defaults to "contained"', () => {
      const { container } = render(<Button>OK</Button>);
      const btn = container.querySelector('button')!;
      expect(btn).toHaveAttribute('data-variant', 'contained');
    });

    it.each(['contained', 'outlined', 'text'] as const)(
      'applies variant="%s"',
      (variant) => {
        const { container } = render(<Button variant={variant}>OK</Button>);
        const btn = container.querySelector('button')!;
        expect(btn).toHaveAttribute('data-variant', variant);
      },
    );
  });

  // ---------------------------------------------------------------------------
  // Props: color
  // ---------------------------------------------------------------------------
  describe('color', () => {
    it('defaults to "ink"', () => {
      const { container } = render(<Button>OK</Button>);
      const btn = container.querySelector('button')!;
      expect(btn).toHaveAttribute('data-color', 'ink');
    });

    it.each(['ink', 'sea', 'brick', 'ochre', 'pine', 'grape'] as const)(
      'applies color="%s"',
      (color) => {
        const { container } = render(<Button color={color}>OK</Button>);
        const btn = container.querySelector('button')!;
        expect(btn).toHaveAttribute('data-color', color);
      },
    );
  });

  // ---------------------------------------------------------------------------
  // Props: size
  // ---------------------------------------------------------------------------
  describe('size', () => {
    it('defaults to "md"', () => {
      const { container } = render(<Button>OK</Button>);
      const btn = container.querySelector('button')!;
      expect(btn).toHaveAttribute('data-size', 'md');
    });

    it.each(['sm', 'md', 'lg'] as const)('applies size="%s"', (size) => {
      const { container } = render(<Button size={size}>OK</Button>);
      const btn = container.querySelector('button')!;
      expect(btn).toHaveAttribute('data-size', size);
    });
  });

  // ---------------------------------------------------------------------------
  // Props: radius
  // ---------------------------------------------------------------------------
  describe('radius', () => {
    it('defaults to "none"', () => {
      const { container } = render(<Button>OK</Button>);
      const btn = container.querySelector('button')!;
      expect(btn).toHaveAttribute('data-radius', 'none');
    });

    it.each(['none', 'sm', 'md', 'lg'] as const)(
      'applies radius="%s"',
      (radius) => {
        const { container } = render(<Button radius={radius}>OK</Button>);
        const btn = container.querySelector('button')!;
        expect(btn).toHaveAttribute('data-radius', radius);
      },
    );
  });

  // ---------------------------------------------------------------------------
  // Props: startIcon / endIcon
  // ---------------------------------------------------------------------------
  describe('icons', () => {
    it('renders startIcon before children', () => {
      render(
        <Button startIcon={<span data-testid="start">★</span>}>Label</Button>,
      );
      const btn = screen.getByRole('button');
      const start = within(btn).getByTestId('start');
      expect(start).toBeInTheDocument();
      // startIcon should appear before the text node
      expect(btn.firstChild).toContainElement(start);
    });

    it('renders endIcon after children', () => {
      render(<Button endIcon={<span data-testid="end">→</span>}>Label</Button>);
      const btn = screen.getByRole('button');
      const end = within(btn).getByTestId('end');
      expect(end).toBeInTheDocument();
      expect(btn.lastChild).toContainElement(end);
    });

    it('renders both startIcon and endIcon simultaneously', () => {
      render(
        <Button
          startIcon={<span data-testid="start">★</span>}
          endIcon={<span data-testid="end">→</span>}
        >
          Label
        </Button>,
      );
      const btn = screen.getByRole('button');
      expect(within(btn).getByTestId('start')).toBeInTheDocument();
      expect(within(btn).getByTestId('end')).toBeInTheDocument();
    });

    it('icon wrappers have aria-hidden="true"', () => {
      const { container } = render(
        <Button startIcon={<span>★</span>} endIcon={<span>→</span>}>
          Label
        </Button>,
      );
      const btn = container.querySelector('button')!;
      const hiddenWrappers = btn.querySelectorAll('[aria-hidden="true"]');
      expect(hiddenWrappers.length).toBe(2);
    });
  });

  // ---------------------------------------------------------------------------
  // Icon-only buttons
  // ---------------------------------------------------------------------------
  describe('icon-only', () => {
    it('uses square padding (symmetric) when only startIcon is provided', () => {
      const { container } = render(
        <Button startIcon={<span>★</span>} aria-label="Star" />,
      );
      const btn = container.querySelector('button')!;
      // md default: paddingIconOnly = '1rem', vs normal '1rem 2rem'
      expect(btn).toHaveStyle({ padding: '1rem' });
    });

    it('uses square padding when only endIcon is provided', () => {
      const { container } = render(
        <Button endIcon={<span>→</span>} aria-label="Next" />,
      );
      const btn = container.querySelector('button')!;
      expect(btn).toHaveStyle({ padding: '1rem' });
    });

    it('does not render an empty text span when icon-only', () => {
      const { container } = render(
        <Button startIcon={<span>★</span>} aria-label="Star" />,
      );
      const btn = container.querySelector('button')!;
      // Only the icon wrapper should be a child — no phantom text span
      expect(btn.children.length).toBe(1);
    });

    it('uses normal asymmetric padding when icon and children are both present', () => {
      const { container } = render(
        <Button startIcon={<span>★</span>}>Label</Button>,
      );
      const btn = container.querySelector('button')!;
      expect(btn).toHaveStyle({ padding: '1rem 2rem' });
    });

    it('is accessible via aria-label', () => {
      render(<Button startIcon={<span>★</span>} aria-label="Favourite" />);
      expect(
        screen.getByRole('button', { name: 'Favourite' }),
      ).toBeInTheDocument();
    });
  });

  // ---------------------------------------------------------------------------
  // Props: fullWidth
  // ---------------------------------------------------------------------------
  describe('fullWidth', () => {
    it('does not apply full width by default', () => {
      const { container } = render(<Button>OK</Button>);
      const btn = container.querySelector('button')!;
      expect(btn).not.toHaveAttribute('data-fullwidth');
    });

    it('expands to full width when fullWidth is true', () => {
      const { container } = render(<Button fullWidth>OK</Button>);
      const btn = container.querySelector('button')!;
      expect(btn).toHaveAttribute('data-fullwidth', 'true');
    });
  });

  // ---------------------------------------------------------------------------
  // Props: effect
  // ---------------------------------------------------------------------------
  describe('effect', () => {
    it('defaults to "press"', () => {
      const { container } = render(<Button>OK</Button>);
      const btn = container.querySelector('button')!;
      expect(btn).toHaveAttribute('data-effect', 'press');
    });

    it.each(['none', 'press', 'lift', 'glow'] as const)(
      'applies effect="%s"',
      (effect) => {
        const { container } = render(<Button effect={effect}>OK</Button>);
        const btn = container.querySelector('button')!;
        expect(btn).toHaveAttribute('data-effect', effect);
      },
    );
  });

  // ---------------------------------------------------------------------------
  // Props: tooltip
  // ---------------------------------------------------------------------------
  describe('tooltip', () => {
    it('does not render a tooltip by default', () => {
      render(<Button>OK</Button>);
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('shows tooltip on hover', async () => {
      const user = userEvent.setup();
      render(<Button tooltip="Helpful tip">OK</Button>);
      await user.hover(screen.getByRole('button'));
      expect(screen.getByRole('tooltip')).toHaveTextContent('Helpful tip');
    });

    it('shows tooltip on focus', async () => {
      const user = userEvent.setup();
      render(<Button tooltip="Helpful tip">OK</Button>);
      await user.tab();
      expect(screen.getByRole('tooltip')).toHaveTextContent('Helpful tip');
    });

    it('hides tooltip when Escape is pressed', async () => {
      const user = userEvent.setup();
      render(<Button tooltip="Helpful tip">OK</Button>);
      await user.tab();
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('does not trigger onClick when Escape closes tooltip', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Button tooltip="Tip" onClick={onClick}>
          OK
        </Button>,
      );
      await user.tab();
      await user.keyboard('{Escape}');
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // Estado: disabled
  // ---------------------------------------------------------------------------
  describe('disabled', () => {
    it('is not disabled by default', () => {
      render(<Button>OK</Button>);
      expect(screen.getByRole('button')).not.toBeDisabled();
    });

    it('is disabled when disabled prop is true', () => {
      render(<Button disabled>OK</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('does not fire onClick when disabled', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Button disabled onClick={onClick}>
          OK
        </Button>,
      );
      await user.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('should not receive focus via Tab when disabled', async () => {
      const user = userEvent.setup();
      render(<Button disabled>OK</Button>);
      await user.tab();
      expect(screen.getByRole('button')).not.toHaveFocus();
    });
  });

  // ---------------------------------------------------------------------------
  // Estado: loading
  // ---------------------------------------------------------------------------
  describe('loading', () => {
    it('is not loading by default', () => {
      render(<Button>OK</Button>);
      const btn = screen.getByRole('button');
      expect(btn).not.toHaveAttribute('data-loading');
    });

    it('shows a spinner element when loading', () => {
      const { container } = render(<Button loading>OK</Button>);
      expect(
        container.querySelector('[data-testid="button-spinner"]'),
      ).toBeInTheDocument();
    });

    it('disables the button when loading', () => {
      render(<Button loading>OK</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('does not fire onClick when loading', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Button loading onClick={onClick}>
          OK
        </Button>,
      );
      await user.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('shows loadingText instead of children when loading', () => {
      render(
        <Button loading loadingText="Saving...">
          Save
        </Button>,
      );
      const btn = screen.getByRole('button');
      expect(btn).toHaveTextContent('Saving...');
      expect(btn).not.toHaveTextContent('Save');
    });

    it('applies aria-live="polite" when loading changes content', () => {
      render(
        <Button loading loadingText="Saving...">
          Save
        </Button>,
      );
      const btn = screen.getByRole('button');
      expect(btn.querySelector('[aria-live="polite"]')).toBeInTheDocument();
    });

    it('hides startIcon and endIcon when loading', () => {
      render(
        <Button
          loading
          startIcon={<span data-testid="start">★</span>}
          endIcon={<span data-testid="end">→</span>}
        >
          Save
        </Button>,
      );
      expect(screen.queryByTestId('start')).not.toBeInTheDocument();
      expect(screen.queryByTestId('end')).not.toBeInTheDocument();
    });

    it('renders spinner after loadingText', () => {
      const { container } = render(
        <Button loading loadingText="Saving...">
          Save
        </Button>,
      );
      const btn = container.querySelector('button')!;
      const spinner = btn.querySelector('[data-testid="button-spinner"]')!;
      // The text node should come before the spinner in the DOM
      const children = Array.from(btn.childNodes);
      const textIndex = children.findIndex(
        (n) => n.textContent === 'Saving...',
      );
      const spinnerIndex = children.indexOf(spinner);
      expect(spinnerIndex).toBeGreaterThan(textIndex);
    });
  });

  // ---------------------------------------------------------------------------
  // Interacción: onClick
  // ---------------------------------------------------------------------------
  describe('onClick', () => {
    it('calls onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click</Button>);
      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  // ---------------------------------------------------------------------------
  // Interacción de teclado
  // ---------------------------------------------------------------------------
  describe('Keyboard interaction', () => {
    it('receives focus via Tab', async () => {
      const user = userEvent.setup();
      render(<Button>OK</Button>);
      await user.tab();
      expect(screen.getByRole('button')).toHaveFocus();
    });

    it('fires onClick on Enter key', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Button onClick={onClick}>OK</Button>);
      await user.tab();
      await user.keyboard('{Enter}');
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('fires onClick on Space key (keyup)', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Button onClick={onClick}>OK</Button>);
      await user.tab();
      await user.keyboard(' ');
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  // ---------------------------------------------------------------------------
  // Accesibilidad: ARIA
  // ---------------------------------------------------------------------------
  describe('ARIA attributes', () => {
    it('associates tooltip via aria-describedby when tooltip provides helpful info', async () => {
      const user = userEvent.setup();
      render(<Button tooltip="Saves the current document">Save</Button>);
      await user.hover(screen.getByRole('button'));
      const btn = screen.getByRole('button');
      const tooltipEl = screen.getByRole('tooltip');
      expect(btn).toHaveAttribute('aria-describedby', tooltipEl.id);
    });
  });

  // ---------------------------------------------------------------------------
  // Propagación de props nativas de <button>
  // ---------------------------------------------------------------------------
  describe('Native button props', () => {
    it('forwards type attribute', () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('forwards id attribute', () => {
      render(<Button id="my-btn">OK</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('id', 'my-btn');
    });

    it('forwards className', () => {
      render(<Button className="custom">OK</Button>);
      expect(screen.getByRole('button')).toHaveClass('custom');
    });
  });
});
