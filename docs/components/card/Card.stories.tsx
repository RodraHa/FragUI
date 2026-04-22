import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '../../../src/components/card/Card';
import { Button } from '../../../src/components/button/Button';
import { Badge } from '../../../src/components/badge/Badge';
import { fontFamily } from '../../../src/theme/tokens/typography';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Contenedor flexible para agrupar contenido relacionado (información, ' +
          'media, acciones) en dashboards, listas o layouts. Soporta tres ' +
          'variantes visuales (elevated, outlined, ghost), modo interactivo ' +
          '(clickeable con teclado), estados de carga con skeleton y ' +
          'composición mediante compound components (Card.Media, Card.Body, ' +
          'Card.Eyebrow, Card.Title, Card.Description, Card.Actions).',
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          gap: '24px',
          flexWrap: 'wrap',
          padding: '16px',
          fontFamily: fontFamily.satoshi,
        }}
      >
        <div style={{ width: '320px' }}>
          <Story />
        </div>
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['elevated', 'outlined', 'ghost'],
      description: 'Estilo visual de la card.',
      table: { category: 'Apariencia', defaultValue: { summary: 'elevated' } },
    },
    interactive: {
      control: 'boolean',
      description:
        'Convierte la card en un elemento focusable y clickeable como un todo.',
      table: {
        category: 'Comportamiento',
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Estado deshabilitado: opacity 0.4, sin interacción.',
      table: {
        category: 'Comportamiento',
        defaultValue: { summary: 'false' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'Muestra un overlay skeleton y bloquea la interacción.',
      table: {
        category: 'Comportamiento',
        defaultValue: { summary: 'false' },
      },
    },
    as: {
      control: 'text',
      description:
        'Elemento HTML base. Si interactive=true se fuerza a <button> o <a>.',
      table: { category: 'Semántica', defaultValue: { summary: 'article' } },
    },
    onClick: { table: { disable: true } },
    children: { table: { disable: true } },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Elevated (default) ────────────────────────────────────────

export const Elevated: Story = {
  args: {
    variant: 'elevated',
  },
  render: (args) => (
    <Card {...args}>
      <Card.Body>
        <Card.Eyebrow>Componente</Card.Eyebrow>
        <Card.Title as="h3">Card Navigation</Card.Title>
        <Card.Description>
          Permite la navegación entre componentes a través de Cards.
        </Card.Description>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <Badge variant="subtle" color="pine" label="INFO 1" size="sm" />
          <Badge variant="subtle" color="sea" label="INFO 2" size="sm" />
        </div>
        <Card.Actions>
          <Button variant="contained" size="sm">
            Botón 1
          </Button>
          <Button variant="outlined" size="sm">
            Botón 2
          </Button>
        </Card.Actions>
      </Card.Body>
    </Card>
  ),
};

// ─── Outlined (con media placeholder) ──────────────────────────

export const Outlined: Story = {
  args: {
    variant: 'outlined',
  },
  render: (args) => (
    <Card {...args}>
      <Card.Media>
        <span
          style={{
            color: '#424242',
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Espacio para imagen
        </span>
      </Card.Media>
      <Card.Body>
        <Card.Eyebrow>Componente media</Card.Eyebrow>
        <Card.Title as="h3">Card con Media</Card.Title>
        <Card.Description>
          Permite la navegación entre componentes a través de Cards con espacio
          para gráficos.
        </Card.Description>
        <div>
          <Badge variant="subtle" color="ochre" label="INFO 1" size="sm" />
        </div>
      </Card.Body>
    </Card>
  ),
};

// ─── Ghost ─────────────────────────────────────────────────────

export const Ghost: Story = {
  args: {
    variant: 'ghost',
  },
  render: (args) => (
    <Card {...args}>
      <Card.Body>
        <Badge variant="solid" color="ink" label="Ghost" size="sm" />
        <div style={{ height: 16 }} />
        <Card.Title as="h3">Card para métricas</Card.Title>
        <Card.Description>
          Permite la navegación entre componentes a través de Cards con efecto
          transparente.
        </Card.Description>
      </Card.Body>
    </Card>
  ),
};

// ─── Interactive ───────────────────────────────────────────────

export const Interactive: Story = {
  name: 'Clickeable (interactive)',
  args: {
    variant: 'elevated',
    interactive: true,
    'aria-label': 'Abrir detalle de acción',
    onClick: () => {
      // eslint-disable-next-line no-console
      console.log('Card clicked');
    },
  },
  render: (args) => (
    <Card {...args}>
      <Card.Body>
        <Card.Eyebrow>Acción</Card.Eyebrow>
        <Card.Title as="h3">Click para acción</Card.Title>
        <Card.Description>
          Card interactiva con hover (lift) y pressed. Variante de elevated.
        </Card.Description>
      </Card.Body>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Cuando `interactive=true`, la card se renderiza como `<button>` y responde a click, Enter y Space. El efecto hover aplica `translate(-2, -2)` + sombra 8,8,0,0; pressed aplica `translate(2, 2)` + sombra 2,2,0,0.',
      },
    },
  },
};

// ─── Loading ───────────────────────────────────────────────────

export const Loading: Story = {
  args: {
    variant: 'elevated',
    loading: true,
  },
  render: (args) => (
    <Card {...args}>
      <Card.Body>
        <Card.Eyebrow>Estado</Card.Eyebrow>
        <Card.Title as="h3">Cargando datos…</Card.Title>
        <Card.Description>
          Skeleton overlay que indica que el contenido se está cargando.
        </Card.Description>
      </Card.Body>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'El skeleton overlay respeta `@media (prefers-reduced-motion: reduce)` y bloquea cualquier `onClick` mientras dura la carga. `aria-busy="true"` se expone al lector de pantalla.',
      },
    },
  },
};

// ─── Disabled ──────────────────────────────────────────────────

export const Disabled: Story = {
  args: {
    variant: 'elevated',
    interactive: true,
    disabled: true,
  },
  render: (args) => (
    <Card {...args}>
      <Card.Body>
        <Badge variant="solid" color="ink" label="Disabled" size="sm" />
        <div style={{ height: 16 }} />
        <Card.Eyebrow>Componente</Card.Eyebrow>
        <Card.Title as="h3">Card Navigation</Card.Title>
        <Card.Description>
          Permite la navegación entre componentes a través de Cards.
        </Card.Description>
      </Card.Body>
    </Card>
  ),
  // Disabled state applies opacity: 0.4 to the entire card by design, which
  // lowers effective contrast below AA. This is an intentional visual cue, so
  // we exempt color-contrast for this specific story.
  parameters: {
    a11y: {
      options: {
        rules: {
          'color-contrast': { enabled: false },
        },
      },
    },
  },
};

// ─── CompoundComposition ───────────────────────────────────────

export const CompoundComposition: Story = {
  name: 'Composición con slots',
  render: () => (
    <Card variant="elevated">
      <Card.Media>
        <span
          style={{
            color: '#424242',
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Media slot
        </span>
      </Card.Media>
      <Card.Body>
        <Card.Eyebrow>Categoría</Card.Eyebrow>
        <Card.Title as="h3">Título del Card</Card.Title>
        <Card.Description>
          Descripción del contenido. Los slots se pueden combinar libremente:
          `Media`, `Body`, `Eyebrow`, `Title`, `Description` y `Actions`.
        </Card.Description>
        <Card.Actions>
          <Button variant="contained" size="sm">
            Acción
          </Button>
          <Button variant="outlined" size="sm">
            Secundario
          </Button>
        </Card.Actions>
      </Card.Body>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Los compound components (`Card.Media`, `Card.Body`, `Card.Eyebrow`, `Card.Title`, `Card.Description`, `Card.Actions`) son opcionales y reordenables. `Card.Title` acepta `as` para elegir el nivel de heading semántico según el contexto.',
      },
    },
  },
};
