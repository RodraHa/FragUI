import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';
import { Button } from '../button/Button';
import { fontFamily } from '../../theme/tokens/typography';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Indicador pequeno para mostrar un conteo, estado o notificacion. ' +
          'Soporta modos numerico, dot y label, multiples variantes visuales, ' +
          'y puede anclarse a cualquier elemento hijo.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          fontFamily: fontFamily.satoshi,
        }}
      >
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'subtle'],
      description: 'Define el estilo visual del badge.',
      table: {
        category: 'Apariencia',
        defaultValue: { summary: 'solid' },
      },
    },
    mode: {
      control: 'select',
      options: ['numeric', 'dot', 'label'],
      description:
        'Define el tipo de contenido mostrado por el badge: numerico, indicador visual o etiqueta.',
      table: {
        category: 'Apariencia',
        defaultValue: { summary: 'label' },
      },
    },
    color: {
      control: 'select',
      options: ['ink', 'sea', 'brick', 'ochre', 'pine', 'grape'],
      description: 'Esquema de color basado en tokens del sistema de diseno.',
      table: {
        category: 'Apariencia',
        defaultValue: { summary: 'ink' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description:
        'Controla dimensiones generales del badge, incluyendo padding y tipografia.',
      table: {
        category: 'Apariencia',
        defaultValue: { summary: 'md' },
      },
    },
    value: {
      control: 'number',
      description:
        'Valor numerico representado por el badge. Solo tiene efecto en mode="numeric".',
      table: {
        category: 'Contenido',
        defaultValue: { summary: '0' },
      },
    },
    maxValue: {
      control: 'number',
      description:
        'Limite superior antes de mostrar el valor en formato compacto (ej. 99+).',
      table: {
        category: 'Contenido',
        defaultValue: { summary: '99' },
      },
    },
    showZero: {
      control: 'boolean',
      description: 'Determina si el badge se muestra cuando el valor es 0.',
      table: {
        category: 'Contenido',
        defaultValue: { summary: 'false' },
      },
    },
    label: {
      control: 'text',
      description: 'Contenido textual del badge en modo label.',
      table: {
        category: 'Contenido',
        defaultValue: { summary: 'null' },
      },
    },
    pulse: {
      control: 'boolean',
      description:
        'Activa una animacion de enfasis para llamar la atencion del usuario. Respeta prefers-reduced-motion.',
      table: {
        category: 'Interaccion',
        defaultValue: { summary: 'false' },
      },
    },
    anchor: {
      control: 'select',
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left'],
      description:
        'Define la posicion del badge respecto al elemento ancla. Solo tiene efecto con children.',
      table: {
        category: 'Posicion',
        defaultValue: { summary: 'top-right' },
      },
    },
    offset: {
      control: 'object',
      description:
        'Ajuste fino de la posicion del badge en pixeles [X, Y]. Solo tiene efecto con children.',
      table: {
        category: 'Posicion',
        defaultValue: { summary: '[0, 0]' },
      },
    },
  },
  args: {
    label: 'DEFAULT',
    variant: 'solid',
    mode: 'label',
    color: 'ink',
    size: 'md',
    offset: [0, 0],
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Variantes ───────────────────────────────────────────────

export const Solid: Story = {
  args: {
    variant: 'solid',
    label: 'DEFAULT',
  },
};

export const Subtle: Story = {
  args: {
    variant: 'subtle',
    label: 'DEFAULT',
  },
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Las dos variantes del badge: `solid` con fondo lleno y `subtle` con fondo atenuado.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      {(['solid', 'subtle'] as const).map((v) => (
        <div
          key={v}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{v}</span>
          {(['ink', 'sea', 'brick', 'ochre', 'pine', 'grape'] as const).map(
            (c) => (
              <Badge {...args} key={`${v}-${c}`} variant={v} color={c}>
                {undefined}
              </Badge>
            ),
          )}
        </div>
      ))}
    </div>
  ),
  args: { label: 'DEFAULT' },
};

// ─── Modos ──────────────────────────────────────────────────

export const Modes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Los tres modos del badge: `numeric` muestra un conteo, `label` muestra texto, y `dot` muestra un indicador visual.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Numeric</span>
        <Badge {...args} mode="numeric" value={99}>
          {undefined}
        </Badge>
        <Badge {...args} mode="numeric" value={99} variant="subtle">
          {undefined}
        </Badge>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Label</span>
        <Badge {...args} mode="label" label="DEFAULT">
          {undefined}
        </Badge>
        <Badge {...args} mode="label" label="DEFAULT" variant="subtle">
          {undefined}
        </Badge>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Dot</span>
        <Badge {...args} mode="dot">
          {undefined}
        </Badge>
        <Badge {...args} mode="dot" variant="subtle">
          {undefined}
        </Badge>
      </div>
    </div>
  ),
};

// ─── Colores ────────────────────────────────────────────────

export const Colors: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Cada color mapea a una paleta semantica del sistema de diseno. ' +
          'Se muestran ambas variantes por cada color.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {(['ink', 'sea', 'brick', 'ochre', 'pine', 'grape'] as const).map((c) => (
        <div
          key={c}
          style={{ display: 'flex', gap: '12px', alignItems: 'center' }}
        >
          <span style={{ width: '48px', fontSize: '0.75rem', fontWeight: 600 }}>
            {c}
          </span>
          <Badge {...args} color={c} variant="solid">
            {undefined}
          </Badge>
          <Badge {...args} color={c} variant="subtle">
            {undefined}
          </Badge>
        </div>
      ))}
    </div>
  ),
  args: { label: 'DEFAULT' },
};

// ─── Tamanos ────────────────────────────────────────────────

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'El prop `size` controla padding y tipografia. Los tres tamanos se muestran en cada modo.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '32px' }}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <div
          key={s}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{s}</span>
          <Badge {...args} size={s} mode="label" label="DEFAULT">
            {undefined}
          </Badge>
          <Badge {...args} size={s} mode="numeric" value={99}>
            {undefined}
          </Badge>
          <Badge {...args} size={s} mode="dot">
            {undefined}
          </Badge>
        </div>
      ))}
    </div>
  ),
};

// ─── Numerico ───────────────────────────────────────────────

export const NumericOverflow: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Cuando `value` excede `maxValue`, el badge muestra el formato compacto (ej. `99+`). ' +
          'El valor por defecto de `maxValue` es 99.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <Badge {...args} mode="numeric" value={5}>
        {undefined}
      </Badge>
      <Badge {...args} mode="numeric" value={42}>
        {undefined}
      </Badge>
      <Badge {...args} mode="numeric" value={99}>
        {undefined}
      </Badge>
      <Badge {...args} mode="numeric" value={100}>
        {undefined}
      </Badge>
      <Badge {...args} mode="numeric" value={999} maxValue={999}>
        {undefined}
      </Badge>
    </div>
  ),
  args: { color: 'brick' },
};

// ─── Anchor ─────────────────────────────────────────────────

export const Anchor: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'El badge se posiciona respecto al elemento hijo usando `anchor`. ' +
          'Solo tiene efecto cuando `children` esta definido.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '48px', alignItems: 'center' }}>
      {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map(
        (a) => (
          <div
            key={a}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{a}</span>
            <Badge {...args} anchor={a} label="DEFAULT">
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#F2F2F2',
                  border: '1px solid #D9D9D9',
                }}
              />
            </Badge>
          </div>
        ),
      )}
    </div>
  ),
  args: { color: 'ink', size: 'sm' },
};

// ─── Offset ─────────────────────────────────────────────────

export const Offset: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'El prop `offset` ajusta la posicion del badge en pixeles [X, Y] respecto al anchor. ' +
          'Solo tiene efecto cuando `children` esta definido.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '48px', alignItems: 'center' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>[0, 0]</span>
        <Badge {...args} mode="numeric" value={5} offset={[0, 0]} color="brick">
          <div
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#F2F2F2',
              border: '1px solid #D9D9D9',
            }}
          />
        </Badge>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>[-8, 8]</span>
        <Badge
          {...args}
          mode="numeric"
          value={5}
          offset={[-8, 8]}
          color="brick"
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#F2F2F2',
              border: '1px solid #D9D9D9',
            }}
          />
        </Badge>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>[10, -10]</span>
        <Badge
          {...args}
          mode="numeric"
          value={5}
          offset={[10, -10]}
          color="brick"
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#F2F2F2',
              border: '1px solid #D9D9D9',
            }}
          />
        </Badge>
      </div>
    </div>
  ),
  args: { size: 'sm', anchor: 'top-right' },
};

// ─── Pulse ──────────────────────────────────────────────────

export const Pulse: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'La animacion `pulse` llama la atencion del usuario. ' +
          'Respeta `prefers-reduced-motion: reduce` para accesibilidad.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <Badge {...args} pulse label="LIVE" color="brick">
        {undefined}
      </Badge>
      <Badge {...args} pulse mode="dot" color="brick">
        <Button>Notifications</Button>
      </Badge>
      <Badge {...args} pulse mode="numeric" value={3} color="brick">
        <Button>Messages</Button>
      </Badge>
    </div>
  ),
};

// ─── Composicion con Button ─────────────────────────────────

export const WithButton: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'El badge es composable con el componente Button. ' +
          'Se ancla al boton para mostrar conteos, estados o notificaciones.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '38px', alignItems: 'center' }}>
      <Badge {...args} mode="numeric" value={3} color="brick">
        <Button variant="outlined">Inbox</Button>
      </Badge>
      <Badge {...args} mode="dot" color="pine">
        <Button variant="contained" color="sea">
          Online
        </Button>
      </Badge>
      <Badge {...args} mode="label" label="NEW" color="grape">
        <Button variant="text">Features</Button>
      </Badge>
      <Badge {...args} mode="numeric" value={150} maxValue={99} color="brick">
        <Button variant="contained">Notifications</Button>
      </Badge>
    </div>
  ),
};
