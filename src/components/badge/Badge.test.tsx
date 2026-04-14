import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  // ---------------------------------------------------------------------------
  // Renderizado básico
  // ---------------------------------------------------------------------------
  describe('Rendering', () => {
    it('renders a <span> element as the badge', () => {
      render(<Badge label="New" />);
      const badge = screen.getByText('New');
      expect(badge.tagName).toBe('SPAN');
    });

    it('renders standalone (without children)', () => {
      const { container } = render(<Badge label="Info" />);
      const badge = container.querySelector('[data-component="badge"]');
      expect(badge).toBeInTheDocument();
    });

    it('renders anchored to a child element', () => {
      const { container } = render(
        <Badge label="3">
          <button>Notifications</button>
        </Badge>,
      );
      const wrapper = container.querySelector(
        '[data-component="badge-wrapper"]',
      );
      expect(wrapper).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /notifications/i }),
      ).toBeInTheDocument();
      expect(
        container.querySelector('[data-component="badge"]'),
      ).toBeInTheDocument();
    });
  });

  // ---------------------------------------------------------------------------
  // Props: variant
  // ---------------------------------------------------------------------------
  describe('variant', () => {
    it('defaults to "solid"', () => {
      const { container } = render(<Badge label="New" />);
      const badge = container.querySelector('[data-component="badge"]')!;
      expect(badge).toHaveAttribute('data-variant', 'solid');
    });

    it.each(['solid', 'subtle'] as const)('applies variant="%s"', (variant) => {
      const { container } = render(<Badge variant={variant} label="New" />);
      const badge = container.querySelector('[data-component="badge"]')!;
      expect(badge).toHaveAttribute('data-variant', variant);
    });
  });

  // ---------------------------------------------------------------------------
  // Props: mode
  // ---------------------------------------------------------------------------
  describe('mode', () => {
    it('defaults to "label"', () => {
      const { container } = render(<Badge label="New" />);
      const badge = container.querySelector('[data-component="badge"]')!;
      expect(badge).toHaveAttribute('data-mode', 'label');
    });

    it('applies mode="numeric"', () => {
      const { container } = render(<Badge mode="numeric" value={5} />);
      const badge = container.querySelector('[data-component="badge"]')!;
      expect(badge).toHaveAttribute('data-mode', 'numeric');
    });

    it('applies mode="dot"', () => {
      const { container } = render(<Badge mode="dot" />);
      const badge = container.querySelector('[data-component="badge"]')!;
      expect(badge).toHaveAttribute('data-mode', 'dot');
    });

    it('applies mode="label"', () => {
      const { container } = render(<Badge mode="label" label="Test" />);
      const badge = container.querySelector('[data-component="badge"]')!;
      expect(badge).toHaveAttribute('data-mode', 'label');
    });
  });

  // ---------------------------------------------------------------------------
  // Props: color
  // ---------------------------------------------------------------------------
  describe('color', () => {
    it('defaults to "ink"', () => {
      const { container } = render(<Badge label="New" />);
      const badge = container.querySelector('[data-component="badge"]')!;
      expect(badge).toHaveAttribute('data-color', 'ink');
    });

    it.each(['ink', 'sea', 'brick', 'ochre', 'pine', 'grape'] as const)(
      'applies color="%s"',
      (color) => {
        const { container } = render(<Badge color={color} label="New" />);
        const badge = container.querySelector('[data-component="badge"]')!;
        expect(badge).toHaveAttribute('data-color', color);
      },
    );
  });

  // ---------------------------------------------------------------------------
  // Props: size
  // ---------------------------------------------------------------------------
  describe('size', () => {
    it('defaults to "md"', () => {
      const { container } = render(<Badge label="New" />);
      const badge = container.querySelector('[data-component="badge"]')!;
      expect(badge).toHaveAttribute('data-size', 'md');
    });

    it.each(['sm', 'md', 'lg'] as const)('applies size="%s"', (size) => {
      const { container } = render(<Badge size={size} label="New" />);
      const badge = container.querySelector('[data-component="badge"]')!;
      expect(badge).toHaveAttribute('data-size', size);
    });
  });

  // ---------------------------------------------------------------------------
  // Mode: numeric
  // ---------------------------------------------------------------------------
  describe('mode="numeric"', () => {
    it('displays the numeric value', () => {
      render(<Badge mode="numeric" value={5} />);
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('defaults value to 0', () => {
      const { container } = render(<Badge mode="numeric" showZero />);
      expect(
        container.querySelector('[data-component="badge"]'),
      ).toHaveTextContent('0');
    });

    it('displays maxValue+ when value exceeds maxValue', () => {
      render(<Badge mode="numeric" value={150} maxValue={99} />);
      expect(screen.getByText('99+')).toBeInTheDocument();
    });

    it('defaults maxValue to 99', () => {
      render(<Badge mode="numeric" value={100} />);
      expect(screen.getByText('99+')).toBeInTheDocument();
    });

    it('displays exact value when equal to maxValue', () => {
      render(<Badge mode="numeric" value={99} maxValue={99} />);
      expect(screen.getByText('99')).toBeInTheDocument();
    });

    it('hides the badge when value is 0 and showZero is false (default)', () => {
      const { container } = render(<Badge mode="numeric" value={0} />);
      expect(
        container.querySelector('[data-component="badge"]'),
      ).not.toBeInTheDocument();
    });

    it('shows the badge when value is 0 and showZero is true', () => {
      const { container } = render(<Badge mode="numeric" value={0} showZero />);
      expect(
        container.querySelector('[data-component="badge"]'),
      ).toBeInTheDocument();
      expect(
        container.querySelector('[data-component="badge"]'),
      ).toHaveTextContent('0');
    });

    it('accepts a custom maxValue', () => {
      render(<Badge mode="numeric" value={10} maxValue={9} />);
      expect(screen.getByText('9+')).toBeInTheDocument();
    });
  });

  // ---------------------------------------------------------------------------
  // Mode: dot
  // ---------------------------------------------------------------------------
  describe('mode="dot"', () => {
    it('renders a dot with no text content', () => {
      const { container } = render(<Badge mode="dot" />);
      const badge = container.querySelector('[data-component="badge"]')!;
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('');
    });

    it('ignores value, maxValue, showZero props', () => {
      const { container } = render(
        <Badge mode="dot" value={42} maxValue={10} showZero />,
      );
      const badge = container.querySelector('[data-component="badge"]')!;
      expect(badge).toHaveTextContent('');
    });

    it('ignores label prop', () => {
      const { container } = render(<Badge mode="dot" label="Ignored" />);
      const badge = container.querySelector('[data-component="badge"]')!;
      expect(badge).toHaveTextContent('');
    });
  });

  // ---------------------------------------------------------------------------
  // Mode: label
  // ---------------------------------------------------------------------------
  describe('mode="label"', () => {
    it('renders the label text', () => {
      render(<Badge mode="label" label="New" />);
      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('renders nothing visible when label is not provided', () => {
      const { container } = render(<Badge mode="label" />);
      const badge = container.querySelector('[data-component="badge"]');
      expect(badge).not.toBeInTheDocument();
    });

    it('ignores value, maxValue, showZero props', () => {
      render(
        <Badge mode="label" label="Status" value={42} maxValue={10} showZero />,
      );
      const badge = screen.getByText('Status');
      expect(badge).toHaveTextContent('Status');
    });
  });

  // ---------------------------------------------------------------------------
  // Props incompatibles / dependencias
  // ---------------------------------------------------------------------------
  describe('prop dependencies', () => {
    it('ignores anchor and offset when children is not provided', () => {
      const { container } = render(
        <Badge label="New" anchor="bottom-left" offset={[5, 5]} />,
      );
      const wrapper = container.querySelector(
        '[data-component="badge-wrapper"]',
      );
      expect(wrapper).not.toBeInTheDocument();
    });

    it('applies anchor when children is provided', () => {
      const { container } = render(
        <Badge label="3" anchor="bottom-left">
          <button>Mail</button>
        </Badge>,
      );
      const badge = container.querySelector('[data-component="badge"]')!;
      expect(badge).toHaveAttribute('data-anchor', 'bottom-left');
    });

    it('defaults anchor to "top-right" when children is provided', () => {
      const { container } = render(
        <Badge label="3">
          <button>Mail</button>
        </Badge>,
      );
      const badge = container.querySelector('[data-component="badge"]')!;
      expect(badge).toHaveAttribute('data-anchor', 'top-right');
    });
  });

  // ---------------------------------------------------------------------------
  // Props: pulse
  // ---------------------------------------------------------------------------
  describe('pulse', () => {
    it('does not apply pulse by default', () => {
      const { container } = render(<Badge label="New" />);
      const badge = container.querySelector('[data-component="badge"]')!;
      expect(badge).not.toHaveAttribute('data-pulse');
    });

    it('applies pulse animation when pulse is true', () => {
      const { container } = render(<Badge label="New" pulse />);
      const badge = container.querySelector('[data-component="badge"]')!;
      expect(badge).toHaveAttribute('data-pulse', 'true');
    });
  });

  // ---------------------------------------------------------------------------
  // Accesibilidad
  // ---------------------------------------------------------------------------
  describe('Accessibility', () => {
    it('has aria-hidden="true" in mode="dot"', () => {
      const { container } = render(<Badge mode="dot" />);
      const badge = container.querySelector('[data-component="badge"]')!;
      expect(badge).toHaveAttribute('aria-hidden', 'true');
    });

    it('has role="status" in mode="label" for semantic states', () => {
      const { container } = render(<Badge mode="label" label="Active" />);
      const badge = container.querySelector('[data-component="badge"]')!;
      expect(badge).toHaveAttribute('role', 'status');
    });

    it('does not have aria-hidden in mode="label"', () => {
      const { container } = render(<Badge mode="label" label="New" />);
      const badge = container.querySelector('[data-component="badge"]')!;
      expect(badge).not.toHaveAttribute('aria-hidden');
    });

    it('does not have aria-hidden in mode="numeric"', () => {
      const { container } = render(<Badge mode="numeric" value={5} />);
      const badge = container.querySelector('[data-component="badge"]')!;
      expect(badge).not.toHaveAttribute('aria-hidden');
    });

    it('is not focusable by itself', () => {
      const { container } = render(<Badge label="New" />);
      const badge = container.querySelector('[data-component="badge"]')!;
      expect(badge).not.toHaveAttribute('tabindex');
    });

    it('focus goes to the anchor child, not the badge', async () => {
      render(
        <Badge label="3">
          <button>Inbox</button>
        </Badge>,
      );
      const button = screen.getByRole('button', { name: /inbox/i });
      button.focus();
      expect(button).toHaveFocus();
    });
  });

  // ---------------------------------------------------------------------------
  // Propagación de props nativas de <span>
  // ---------------------------------------------------------------------------
  describe('Native span props', () => {
    it('forwards id attribute', () => {
      const { container } = render(<Badge id="my-badge" label="New" />);
      const badge = container.querySelector('[data-component="badge"]')!;
      expect(badge).toHaveAttribute('id', 'my-badge');
    });

    it('forwards className', () => {
      const { container } = render(<Badge className="custom" label="New" />);
      const badge = container.querySelector('[data-component="badge"]')!;
      expect(badge).toHaveClass('custom');
    });
  });
});
