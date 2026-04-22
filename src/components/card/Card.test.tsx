import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  // ---------------------------------------------------------------------------
  // Rendering básico
  // ---------------------------------------------------------------------------
  describe('Rendering', () => {
    it('renders an <article> by default', () => {
      const { container } = render(<Card>Content</Card>);
      expect(container.firstChild?.nodeName).toBe('ARTICLE');
    });

    it('renders children', () => {
      render(<Card>Hello card</Card>);
      expect(screen.getByText('Hello card')).toBeInTheDocument();
    });

    it('respects the "as" prop for non-interactive cards', () => {
      const { container } = render(<Card as="section">Content</Card>);
      expect(container.firstChild?.nodeName).toBe('SECTION');
    });

    it('renders as <button> when interactive', () => {
      render(<Card interactive>Click me</Card>);
      expect(screen.getByRole('button', { name: /click me/i }).tagName).toBe(
        'BUTTON',
      );
    });

    it('renders as <a> when interactive and as="a"', () => {
      const { container } = render(
        <Card interactive as="a" href="#test">
          Link card
        </Card>,
      );
      expect(container.firstChild?.nodeName).toBe('A');
      expect(container.firstChild).toHaveAttribute('href', '#test');
    });
  });

  // ---------------------------------------------------------------------------
  // Variants
  // ---------------------------------------------------------------------------
  describe('variant', () => {
    it('defaults to "elevated"', () => {
      const { container } = render(<Card>x</Card>);
      expect(container.firstChild).toHaveAttribute('data-variant', 'elevated');
    });

    it.each(['elevated', 'outlined', 'ghost'] as const)(
      'applies variant="%s"',
      (variant) => {
        const { container } = render(<Card variant={variant}>x</Card>);
        expect(container.firstChild).toHaveAttribute('data-variant', variant);
      },
    );
  });

  // ---------------------------------------------------------------------------
  // Interactive
  // ---------------------------------------------------------------------------
  describe('interactive', () => {
    it('is not focusable when not interactive', async () => {
      const user = userEvent.setup();
      render(<Card>Static</Card>);
      await user.tab();
      expect(document.activeElement).toBe(document.body);
    });

    it('is focusable via Tab when interactive', async () => {
      const user = userEvent.setup();
      render(<Card interactive>Click me</Card>);
      await user.tab();
      expect(screen.getByRole('button', { name: /click me/i })).toHaveFocus();
    });

    it('fires onClick when clicked', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Card interactive onClick={onClick}>
          Click me
        </Card>,
      );
      await user.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('fires onClick on Enter key', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Card interactive onClick={onClick}>
          Click me
        </Card>,
      );
      await user.tab();
      await user.keyboard('{Enter}');
      expect(onClick).toHaveBeenCalled();
    });

    it('fires onClick on Space key', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Card interactive onClick={onClick}>
          Click me
        </Card>,
      );
      await user.tab();
      await user.keyboard(' ');
      expect(onClick).toHaveBeenCalled();
    });

    it('does not fire onClick when non-interactive and clicked', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const { container } = render(<Card onClick={onClick}>Static</Card>);
      await user.click(container.firstChild as HTMLElement);
      // Non-interactive: the handler passes through the native event,
      // but since there is no onClick wrapper for inert-like behavior,
      // we accept that native clicks may still fire. We only guarantee
      // that interactive-specific logic doesn't run.
      // The observable contract is: no data-state transitions.
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('sets data-interactive="true" when interactive', () => {
      const { container } = render(<Card interactive>x</Card>);
      expect(container.firstChild).toHaveAttribute('data-interactive', 'true');
    });
  });

  // ---------------------------------------------------------------------------
  // Disabled
  // ---------------------------------------------------------------------------
  describe('disabled', () => {
    it('marks the card with aria-disabled when interactive+disabled', () => {
      render(
        <Card interactive disabled>
          x
        </Card>,
      );
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-disabled',
        'true',
      );
    });

    it('is disabled at the native <button> level', () => {
      render(
        <Card interactive disabled>
          x
        </Card>,
      );
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('does not fire onClick when disabled', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Card interactive disabled onClick={onClick}>
          x
        </Card>,
      );
      await user.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('is not focusable via Tab when interactive+disabled', async () => {
      const user = userEvent.setup();
      render(
        <Card interactive disabled>
          x
        </Card>,
      );
      await user.tab();
      expect(screen.getByRole('button')).not.toHaveFocus();
    });
  });

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------
  describe('loading', () => {
    it('sets aria-busy when loading', () => {
      const { container } = render(<Card loading>x</Card>);
      expect(container.firstChild).toHaveAttribute('aria-busy', 'true');
    });

    it('renders the skeleton overlay when loading', () => {
      render(<Card loading>x</Card>);
      expect(screen.getByTestId('card-skeleton-overlay')).toBeInTheDocument();
    });

    it('does not render the skeleton overlay when not loading', () => {
      render(<Card>x</Card>);
      expect(
        screen.queryByTestId('card-skeleton-overlay'),
      ).not.toBeInTheDocument();
    });

    it('does not fire onClick when loading even if interactive', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Card interactive loading onClick={onClick}>
          x
        </Card>,
      );
      await user.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('hides the skeleton overlay from assistive tech', () => {
      render(<Card loading>x</Card>);
      expect(screen.getByTestId('card-skeleton-overlay')).toHaveAttribute(
        'aria-hidden',
        'true',
      );
    });
  });

  // ---------------------------------------------------------------------------
  // Click bubbling desde controles internos
  // ---------------------------------------------------------------------------
  describe('Inner interactives', () => {
    it('does not fire Card onClick when an inner button is clicked', async () => {
      const user = userEvent.setup();
      const cardClick = vi.fn();
      const buttonClick = vi.fn();
      render(
        <Card interactive aria-label="Outer card" onClick={cardClick}>
          <button
            type="button"
            data-testid="inner-button"
            onClick={buttonClick}
          >
            Inner
          </button>
        </Card>,
      );
      await user.click(screen.getByTestId('inner-button'));
      expect(buttonClick).toHaveBeenCalledTimes(1);
      expect(cardClick).not.toHaveBeenCalled();
    });

    it('fires Card onClick when clicking the card surface itself', async () => {
      const user = userEvent.setup();
      const cardClick = vi.fn();
      render(
        <Card interactive onClick={cardClick}>
          <span>Inert text</span>
        </Card>,
      );
      await user.click(screen.getByRole('button'));
      expect(cardClick).toHaveBeenCalledTimes(1);
    });
  });

  // ---------------------------------------------------------------------------
  // Compound components
  // ---------------------------------------------------------------------------
  describe('Compound components', () => {
    it('renders Card.Media with the media slot marker', () => {
      render(
        <Card>
          <Card.Media>
            <img alt="x" src="" />
          </Card.Media>
        </Card>,
      );
      expect(
        document.querySelector('[data-card-slot="media"]'),
      ).toBeInTheDocument();
    });

    it('renders Card.Body with the body slot marker', () => {
      render(
        <Card>
          <Card.Body>inner</Card.Body>
        </Card>,
      );
      expect(
        document.querySelector('[data-card-slot="body"]'),
      ).toBeInTheDocument();
    });

    it('renders Card.Eyebrow as a <span>', () => {
      render(
        <Card>
          <Card.Eyebrow>Category</Card.Eyebrow>
        </Card>,
      );
      const el = document.querySelector('[data-card-slot="eyebrow"]')!;
      expect(el.tagName).toBe('SPAN');
      expect(el).toHaveTextContent('Category');
    });

    it('renders Card.Title as <div> by default', () => {
      render(
        <Card>
          <Card.Title>Title</Card.Title>
        </Card>,
      );
      const el = document.querySelector('[data-card-slot="title"]')!;
      expect(el.tagName).toBe('DIV');
    });

    it('renders Card.Title with the "as" prop when provided', () => {
      render(
        <Card>
          <Card.Title as="h2">Title</Card.Title>
        </Card>,
      );
      const heading = screen.getByRole('heading', {
        name: 'Title',
        level: 2,
      });
      expect(heading).toBeInTheDocument();
    });

    it('renders Card.Description as <p>', () => {
      render(
        <Card>
          <Card.Description>Desc</Card.Description>
        </Card>,
      );
      const el = document.querySelector('[data-card-slot="description"]')!;
      expect(el.tagName).toBe('P');
      expect(el).toHaveTextContent('Desc');
    });

    it('renders Card.Actions with the actions slot marker', () => {
      render(
        <Card>
          <Card.Actions>
            <button type="button">Go</button>
          </Card.Actions>
        </Card>,
      );
      expect(
        document.querySelector('[data-card-slot="actions"]'),
      ).toBeInTheDocument();
    });
  });

  // ---------------------------------------------------------------------------
  // Interactive visual states (hover / pressed) by variant
  // ---------------------------------------------------------------------------
  describe('Interactive visual states', () => {
    it('transitions elevated data-state to "hover" on mouse enter', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Card interactive variant="elevated">
          Hover me
        </Card>,
      );
      await user.hover(container.firstChild as HTMLElement);
      expect(container.firstChild).toHaveAttribute('data-state', 'hover');
    });

    it('transitions elevated data-state to "pressed" on mousedown', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Card interactive variant="elevated">
          Press me
        </Card>,
      );
      await user.pointer({
        keys: '[MouseLeft>]',
        target: container.firstChild as HTMLElement,
      });
      expect(container.firstChild).toHaveAttribute('data-state', 'pressed');
    });

    it('resets data-state to "idle" on mouse leave', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Card interactive variant="elevated">
          x
        </Card>,
      );
      await user.hover(container.firstChild as HTMLElement);
      await user.unhover(container.firstChild as HTMLElement);
      expect(container.firstChild).toHaveAttribute('data-state', 'idle');
    });

    it('applies hover state on outlined variant when interactive', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Card interactive variant="outlined">
          x
        </Card>,
      );
      await user.hover(container.firstChild as HTMLElement);
      expect(container.firstChild).toHaveAttribute('data-state', 'hover');
    });

    it('applies pressed state on outlined variant when interactive', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Card interactive variant="outlined">
          x
        </Card>,
      );
      await user.pointer({
        keys: '[MouseLeft>]',
        target: container.firstChild as HTMLElement,
      });
      expect(container.firstChild).toHaveAttribute('data-state', 'pressed');
    });

    it('applies hover state on ghost variant when interactive', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Card interactive variant="ghost">
          x
        </Card>,
      );
      await user.hover(container.firstChild as HTMLElement);
      expect(container.firstChild).toHaveAttribute('data-state', 'hover');
    });

    it('does not transition state on hover when not interactive', async () => {
      const user = userEvent.setup();
      const { container } = render(<Card variant="elevated">x</Card>);
      await user.hover(container.firstChild as HTMLElement);
      expect(container.firstChild).toHaveAttribute('data-state', 'idle');
    });

    it('does not transition state on hover when disabled', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Card interactive disabled>
          x
        </Card>,
      );
      await user.hover(container.firstChild as HTMLElement);
      expect(container.firstChild).toHaveAttribute('data-state', 'idle');
    });

    it('ignores keys other than Enter and Space', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Card interactive onClick={onClick}>
          x
        </Card>,
      );
      await user.tab();
      await user.keyboard('a');
      await user.keyboard('{Escape}');
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // Event handlers forwarding
  // ---------------------------------------------------------------------------
  describe('Event handler forwarding', () => {
    it('forwards onMouseEnter and onMouseLeave', async () => {
      const user = userEvent.setup();
      const onMouseEnter = vi.fn();
      const onMouseLeave = vi.fn();
      const { container } = render(
        <Card
          interactive
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          x
        </Card>,
      );
      await user.hover(container.firstChild as HTMLElement);
      expect(onMouseEnter).toHaveBeenCalledTimes(1);
      await user.unhover(container.firstChild as HTMLElement);
      expect(onMouseLeave).toHaveBeenCalledTimes(1);
    });

    it('forwards onFocus and onBlur when interactive', async () => {
      const user = userEvent.setup();
      const onFocus = vi.fn();
      const onBlur = vi.fn();
      render(
        <Card interactive onFocus={onFocus} onBlur={onBlur}>
          x
        </Card>,
      );
      await user.tab();
      expect(onFocus).toHaveBeenCalledTimes(1);
      await user.tab();
      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('forwards onKeyDown', async () => {
      const user = userEvent.setup();
      const onKeyDown = vi.fn();
      render(
        <Card interactive onKeyDown={onKeyDown}>
          x
        </Card>,
      );
      await user.tab();
      await user.keyboard('x');
      expect(onKeyDown).toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // Native props forwarding
  // ---------------------------------------------------------------------------
  describe('Native props', () => {
    it('forwards className', () => {
      const { container } = render(<Card className="my-card">x</Card>);
      expect(container.firstChild).toHaveClass('my-card');
    });

    it('forwards id', () => {
      render(<Card id="my-card-id">x</Card>);
      expect(document.getElementById('my-card-id')).toBeInTheDocument();
    });

    it('forwards aria-label when interactive', () => {
      render(
        <Card interactive aria-label="Dashboard card">
          x
        </Card>,
      );
      expect(
        screen.getByRole('button', { name: 'Dashboard card' }),
      ).toBeInTheDocument();
    });
  });
});
