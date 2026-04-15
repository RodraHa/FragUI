import { render, screen, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Alert } from './Alert';

describe('Alert', () => {
  // ---------------------------------------------------------------------------
  // Renderizado basico
  // ---------------------------------------------------------------------------
  describe('Rendering', () => {
    it('renders a container element for the alert', () => {
      const { container } = render(<Alert title="Hello" />);
      expect(
        container.querySelector('[data-component="alert"]'),
      ).toBeInTheDocument();
    });

    it('renders the title when provided', () => {
      render(<Alert title="Heads up" />);
      expect(screen.getByText('Heads up')).toBeInTheDocument();
    });

    it('renders the description when provided', () => {
      render(<Alert description="Something happened." />);
      expect(screen.getByText('Something happened.')).toBeInTheDocument();
    });

    it('renders both title and description simultaneously', () => {
      render(<Alert title="Title" description="Description" />);
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });
  });

  // ---------------------------------------------------------------------------
  // Props: status
  // ---------------------------------------------------------------------------
  describe('status', () => {
    it('defaults to "info"', () => {
      const { container } = render(<Alert title="Info" />);
      const alert = container.querySelector('[data-component="alert"]')!;
      expect(alert).toHaveAttribute('data-status', 'info');
    });

    it.each(['success', 'info', 'warning', 'error'] as const)(
      'applies status="%s"',
      (status) => {
        const { container } = render(<Alert status={status} title="x" />);
        const alert = container.querySelector('[data-component="alert"]')!;
        expect(alert).toHaveAttribute('data-status', status);
      },
    );
  });

  // ---------------------------------------------------------------------------
  // Props: variant
  // ---------------------------------------------------------------------------
  describe('variant', () => {
    it('defaults to "filled"', () => {
      const { container } = render(<Alert title="x" />);
      const alert = container.querySelector('[data-component="alert"]')!;
      expect(alert).toHaveAttribute('data-variant', 'filled');
    });

    it.each(['filled', 'outlined', 'stripe', 'banner'] as const)(
      'applies variant="%s"',
      (variant) => {
        const { container } = render(<Alert variant={variant} title="x" />);
        const alert = container.querySelector('[data-component="alert"]')!;
        expect(alert).toHaveAttribute('data-variant', variant);
      },
    );
  });

  // ---------------------------------------------------------------------------
  // Props: icon / showIcon
  // ---------------------------------------------------------------------------
  describe('icon', () => {
    it('does not render an icon by default (showIcon=false)', () => {
      const { container } = render(<Alert title="x" />);
      expect(
        container.querySelector('[data-component="alert-icon"]'),
      ).not.toBeInTheDocument();
    });

    it('renders the default status icon when showIcon is true', () => {
      const { container } = render(
        <Alert showIcon status="success" title="x" />,
      );
      expect(
        container.querySelector('[data-component="alert-icon"]'),
      ).toBeInTheDocument();
    });

    it('renders a custom icon when provided and showIcon is true', () => {
      render(
        <Alert
          showIcon
          icon={<span data-testid="custom-icon">!</span>}
          title="x"
        />,
      );
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('custom icon takes precedence over the default status icon', () => {
      const { container } = render(
        <Alert
          showIcon
          status="error"
          icon={<span data-testid="custom-icon">X</span>}
          title="x"
        />,
      );
      const iconSlot = container.querySelector(
        '[data-component="alert-icon"]',
      )!;
      expect(
        within(iconSlot as HTMLElement).getByTestId('custom-icon'),
      ).toBeInTheDocument();
    });

    it('ignores custom icon when showIcon is false', () => {
      render(
        <Alert
          showIcon={false}
          icon={<span data-testid="custom-icon">!</span>}
          title="x"
        />,
      );
      expect(screen.queryByTestId('custom-icon')).not.toBeInTheDocument();
    });

    it('icon wrapper has aria-hidden="true"', () => {
      const { container } = render(<Alert showIcon status="info" title="x" />);
      const iconSlot = container.querySelector(
        '[data-component="alert-icon"]',
      )!;
      expect(iconSlot).toHaveAttribute('aria-hidden', 'true');
    });
  });

  // ---------------------------------------------------------------------------
  // Props: action
  // ---------------------------------------------------------------------------
  describe('action', () => {
    it('does not render an action by default', () => {
      const { container } = render(<Alert title="x" />);
      expect(
        container.querySelector('[data-component="alert-action"]'),
      ).not.toBeInTheDocument();
    });

    it('renders the action button with its label when provided', () => {
      render(<Alert title="x" action={{ label: 'Retry' }} />);
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });

    it('action is focusable via Tab', async () => {
      const user = userEvent.setup();
      render(<Alert title="x" action={{ label: 'Retry' }} />);
      await user.tab();
      expect(screen.getByRole('button', { name: 'Retry' })).toHaveFocus();
    });

    it('calls action.onClick when the action button is clicked', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Alert title="x" action={{ label: 'Retry', onClick }} />);
      await user.click(screen.getByRole('button', { name: 'Retry' }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  // ---------------------------------------------------------------------------
  // Props: dismissible / onClose
  // ---------------------------------------------------------------------------
  describe('dismissible', () => {
    it('does not render a close button by default', () => {
      render(<Alert title="x" />);
      expect(
        screen.queryByRole('button', { name: /cerrar alerta/i }),
      ).not.toBeInTheDocument();
    });

    it('renders a close button when dismissible is true', () => {
      render(<Alert dismissible title="x" />);
      expect(
        screen.getByRole('button', { name: /cerrar alerta/i }),
      ).toBeInTheDocument();
    });

    it('close button has an accessible label', () => {
      render(<Alert dismissible title="x" />);
      const closeBtn = screen.getByRole('button', { name: /cerrar alerta/i });
      expect(closeBtn).toHaveAttribute('aria-label');
    });

    it('calls onClose when the close button is clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(<Alert dismissible title="x" onClose={onClose} />);
      await user.click(screen.getByRole('button', { name: /cerrar alerta/i }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('close button is activable with Enter', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(<Alert dismissible title="x" onClose={onClose} />);
      const closeBtn = screen.getByRole('button', { name: /cerrar alerta/i });
      act(() => closeBtn.focus());
      await user.keyboard('{Enter}');
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('close button is activable with Space', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(<Alert dismissible title="x" onClose={onClose} />);
      const closeBtn = screen.getByRole('button', { name: /cerrar alerta/i });
      act(() => closeBtn.focus());
      await user.keyboard(' ');
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('removes the alert from the DOM after being closed', async () => {
      const user = userEvent.setup();
      const { container } = render(<Alert dismissible title="x" />);
      await user.click(screen.getByRole('button', { name: /cerrar alerta/i }));
      expect(
        container.querySelector('[data-component="alert"]'),
      ).not.toBeInTheDocument();
    });
  });

  // ---------------------------------------------------------------------------
  // Orden de foco: contenido -> accion -> cerrar
  // ---------------------------------------------------------------------------
  describe('focus order', () => {
    it('moves focus in order: action, then close button', async () => {
      const user = userEvent.setup();
      render(<Alert title="x" dismissible action={{ label: 'Retry' }} />);
      await user.tab();
      expect(screen.getByRole('button', { name: 'Retry' })).toHaveFocus();
      await user.tab();
      expect(
        screen.getByRole('button', { name: /cerrar alerta/i }),
      ).toHaveFocus();
    });
  });

  // ---------------------------------------------------------------------------
  // Props: autoHideDuration
  // ---------------------------------------------------------------------------
  describe('autoHideDuration', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('does not auto-hide by default', () => {
      const onClose = vi.fn();
      render(<Alert title="x" onClose={onClose} />);
      act(() => {
        vi.advanceTimersByTime(10_000);
      });
      expect(onClose).not.toHaveBeenCalled();
    });

    it('calls onClose after autoHideDuration elapses', () => {
      const onClose = vi.fn();
      render(
        <Alert
          status="success"
          title="x"
          autoHideDuration={3000}
          onClose={onClose}
        />,
      );
      act(() => {
        vi.advanceTimersByTime(2999);
      });
      expect(onClose).not.toHaveBeenCalled();
      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('removes the alert from the DOM after auto-hide', () => {
      const { container } = render(
        <Alert status="info" title="x" autoHideDuration={1000} />,
      );
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(
        container.querySelector('[data-component="alert"]'),
      ).not.toBeInTheDocument();
    });

    it('ignores autoHideDuration when status="error"', () => {
      const onClose = vi.fn();
      const { container } = render(
        <Alert
          status="error"
          title="x"
          autoHideDuration={1000}
          onClose={onClose}
        />,
      );
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(onClose).not.toHaveBeenCalled();
      expect(
        container.querySelector('[data-component="alert"]'),
      ).toBeInTheDocument();
    });

    it('ignores autoHideDuration when status="warning"', () => {
      const onClose = vi.fn();
      const { container } = render(
        <Alert
          status="warning"
          title="x"
          autoHideDuration={1000}
          onClose={onClose}
        />,
      );
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(onClose).not.toHaveBeenCalled();
      expect(
        container.querySelector('[data-component="alert"]'),
      ).toBeInTheDocument();
    });
  });

  // ---------------------------------------------------------------------------
  // Pausa del temporizador con hover / focus
  // ---------------------------------------------------------------------------
  describe('autoHideDuration — pause on hover/focus', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('pauses the timer while the pointer is over the alert', () => {
      const onClose = vi.fn();
      const { container } = render(
        <Alert
          status="info"
          title="x"
          autoHideDuration={1000}
          onClose={onClose}
        />,
      );
      const alert = container.querySelector(
        '[data-component="alert"]',
      ) as HTMLElement;

      act(() => {
        vi.advanceTimersByTime(500);
      });
      act(() => {
        alert.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      });
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(onClose).not.toHaveBeenCalled();
    });

    it('resumes the timer after mouseleave', () => {
      const onClose = vi.fn();
      const { container } = render(
        <Alert
          status="info"
          title="x"
          autoHideDuration={1000}
          onClose={onClose}
        />,
      );
      const alert = container.querySelector(
        '[data-component="alert"]',
      ) as HTMLElement;

      act(() => {
        alert.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      });
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      act(() => {
        alert.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
      });
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('pauses the timer while keyboard focus is inside the alert', () => {
      const onClose = vi.fn();
      render(
        <Alert
          status="info"
          title="x"
          autoHideDuration={1000}
          dismissible
          onClose={onClose}
        />,
      );
      const closeBtn = screen.getByRole('button', { name: /cerrar alerta/i });
      act(() => {
        closeBtn.focus();
      });
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // Props: autoFocus
  // ---------------------------------------------------------------------------
  describe('autoFocus', () => {
    it('does not auto-focus the alert by default', () => {
      const { container } = render(<Alert title="x" />);
      const alert = container.querySelector('[data-component="alert"]')!;
      expect(alert).not.toHaveFocus();
    });

    it('moves focus to the alert container when autoFocus is true', () => {
      const { container } = render(<Alert autoFocus title="x" />);
      const alert = container.querySelector('[data-component="alert"]')!;
      expect(alert).toHaveFocus();
    });

    it('the alert container is focusable (tabIndex) when autoFocus is true', () => {
      const { container } = render(<Alert autoFocus title="x" />);
      const alert = container.querySelector('[data-component="alert"]')!;
      expect(alert).toHaveAttribute('tabindex');
    });
  });

  // ---------------------------------------------------------------------------
  // Props: animation
  // ---------------------------------------------------------------------------
  describe('animation', () => {
    it('defaults to "none"', () => {
      const { container } = render(<Alert title="x" />);
      const alert = container.querySelector('[data-component="alert"]')!;
      expect(alert).toHaveAttribute('data-animation', 'none');
    });

    it.each(['none', 'fade', 'slide'] as const)(
      'applies animation="%s"',
      (animation) => {
        const { container } = render(<Alert animation={animation} title="x" />);
        const alert = container.querySelector('[data-component="alert"]')!;
        expect(alert).toHaveAttribute('data-animation', animation);
      },
    );
  });

  // ---------------------------------------------------------------------------
  // Accesibilidad: ARIA
  // ---------------------------------------------------------------------------
  describe('Accessibility — ARIA roles', () => {
    it('uses role="alert" when status="error"', () => {
      render(<Alert status="error" title="x" />);
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('uses role="alert" when status="warning"', () => {
      render(<Alert status="warning" title="x" />);
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });

    it('uses role="status" when status="success"', () => {
      render(<Alert status="success" title="x" />);
      const alert = screen.getByRole('status');
      expect(alert).toBeInTheDocument();
    });

    it('uses role="status" when status="info"', () => {
      render(<Alert status="info" title="x" />);
      const alert = screen.getByRole('status');
      expect(alert).toBeInTheDocument();
    });

    it('applies aria-live="polite" for non-assertive statuses', () => {
      const { container } = render(<Alert status="info" title="x" />);
      const alert = container.querySelector('[data-component="alert"]')!;
      // role="status" has implicit aria-live="polite"; explicit is also accepted.
      const ariaLive = alert.getAttribute('aria-live');
      expect(ariaLive === null || ariaLive === 'polite').toBe(true);
    });

    it('role lives on the alert container, not on the icon or close button', () => {
      const { container } = render(
        <Alert status="error" dismissible showIcon title="x" />,
      );
      const icon = container.querySelector('[data-component="alert-icon"]');
      const closeBtn = screen.getByRole('button', { name: /cerrar alerta/i });
      expect(icon).not.toHaveAttribute('role', 'alert');
      expect(closeBtn).not.toHaveAttribute('role', 'alert');
    });
  });

  // ---------------------------------------------------------------------------
  // Propagacion de props nativas de <div>
  // ---------------------------------------------------------------------------
  describe('Native div props', () => {
    it('forwards id attribute', () => {
      const { container } = render(<Alert id="my-alert" title="x" />);
      const alert = container.querySelector('[data-component="alert"]')!;
      expect(alert).toHaveAttribute('id', 'my-alert');
    });

    it('forwards className', () => {
      const { container } = render(<Alert className="custom" title="x" />);
      const alert = container.querySelector('[data-component="alert"]')!;
      expect(alert).toHaveClass('custom');
    });
  });
});
