import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../../src/components/button/Button';
import {
  BxsHome,
  BxsArchive,
  BxsCart,
  BxsPlusCircle,
} from '../../../src/assets/icons';

const iconMap: Record<string, React.ReactNode> = {
  none: undefined,
  home: <BxsHome />,
  archive: <BxsArchive />,
  cart: <BxsCart />,
  plusCircle: <BxsPlusCircle />,
};

const iconOptions = Object.keys(iconMap);

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Componente interactivo que permite al usuario ejecutar acciones dentro de la interfaz. ' +
          'Soporta múltiples variantes visuales, esquemas de color del sistema de diseño, iconos, ' +
          'estados de carga y efectos de interacción configurables.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
      options: ['contained', 'outlined', 'text'],
      description: 'Define el estilo visual del botón.',
      table: {
        category: 'Apariencia',
        defaultValue: { summary: 'contained' },
      },
    },
    color: {
      control: 'select',
      options: ['ink', 'sea', 'brick', 'ochre', 'pine', 'grape'],
      description:
        'Determina el esquema de color basado en los tokens del sistema de diseño.',
      table: {
        category: 'Apariencia',
        defaultValue: { summary: 'ink' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description:
        'Controla dimensiones internas como padding, tipografía y altura del botón.',
      table: {
        category: 'Apariencia',
        defaultValue: { summary: 'md' },
      },
    },
    radius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description:
        'Define el nivel de redondeo de las esquinas según tokens del sistema.',
      table: {
        category: 'Apariencia',
        defaultValue: { summary: 'none' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description:
        'Hace que el botón se expanda para ocupar el ancho completo del contenedor padre.',
      table: {
        category: 'Apariencia',
        defaultValue: { summary: 'false' },
      },
    },
    startIcon: {
      control: 'select',
      options: iconOptions,
      mapping: iconMap,
      description:
        'Elemento visual opcional renderizado antes del contenido principal del botón. Se utiliza para reforzar la acción o mejorar la identificación visual.',
      table: {
        category: 'Contenido',
        defaultValue: { summary: 'null' },
      },
    },
    endIcon: {
      control: 'select',
      options: iconOptions,
      mapping: iconMap,
      description:
        'Elemento visual opcional renderizado después del contenido principal del botón. Útil para indicar dirección, progreso o acciones secundarias.',
      table: {
        category: 'Contenido',
        defaultValue: { summary: 'null' },
      },
    },
    tooltip: {
      control: 'text',
      description:
        'Contenido descriptivo adicional mostrado al interactuar (hover/focus).',
      table: {
        category: 'Contenido',
        defaultValue: { summary: 'null' },
      },
    },
    disabled: {
      control: 'boolean',
      description:
        'Indica que el botón no es interactivo y no puede recibir eventos de usuario.',
      table: {
        category: 'Estado',
        defaultValue: { summary: 'false' },
      },
    },
    loading: {
      control: 'boolean',
      description:
        'Muestra un estado de carga visual y bloquea la interacción del botón.',
      table: {
        category: 'Estado',
        defaultValue: { summary: 'false' },
      },
    },
    loadingText: {
      control: 'text',
      description:
        'Texto alternativo que reemplaza el contenido durante el estado de carga.',
      table: {
        category: 'Estado',
        defaultValue: { summary: '""' },
      },
    },
    effect: {
      control: 'select',
      options: ['none', 'press', 'lift', 'glow'],
      description: 'Define el feedback visual al interactuar con el botón.',
      table: {
        category: 'Interacción',
        defaultValue: { summary: 'press' },
      },
    },
  },
  args: {
    children: 'BUTTON',
    startIcon: 'none',
    endIcon: 'none',
    effect: 'press',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Variantes ───────────────────────────────────────────────

export const Contained: Story = {
  args: {
    variant: 'contained',
    color: 'ink',
    size: 'md',
    radius: 'none',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    color: 'ink',
    size: 'md',
    radius: 'none',
  },
};

export const Text: Story = {
  args: {
    variant: 'text',
    color: 'ink',
    size: 'md',
    radius: 'none',
  },
};

// ─── Colores ─────────────────────────────────────────────────

export const Colors: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Cada color mapea a una paleta semántica del sistema de diseño. ' +
          'La variante `contained` muestra el color principal como fondo.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      {(['ink', 'sea', 'brick', 'ochre', 'pine', 'grape'] as const).map((c) => (
        <Button {...args} key={c} color={c}>
          {c.toUpperCase()}
        </Button>
      ))}
    </div>
  ),
  args: { variant: 'contained' },
};

// ─── Tamaños ─────────────────────────────────────────────────

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'El prop `size` controla padding, tipografía y altura. Los tres tamaños mantienen proporciones consistentes.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <Button {...args} key={s} size={s}>
          {s.toUpperCase()}
        </Button>
      ))}
    </div>
  ),
  args: { variant: 'contained', color: 'ink' },
};

// ─── Radios de borde ─────────────────────────────────────────

export const BorderRadius: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Los valores de `radius` se resuelven a partir de los tokens del sistema según el `size` activo, ' +
          'garantizando proporciones armónicas en cualquier combinación.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      {(['none', 'sm', 'md', 'lg'] as const).map((r) => (
        <Button {...args} key={r} radius={r}>
          {r.toUpperCase()}
        </Button>
      ))}
    </div>
  ),
  args: { variant: 'contained', color: 'ink' },
};

// ─── Iconos ──────────────────────────────────────────────────

export const WithStartIcon: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Un icono al inicio refuerza visualmente la acción del botón. ' +
          'Durante el estado de carga, los iconos se ocultan y se reemplazan por el spinner.',
      },
    },
  },
  args: {
    startIcon: 'home',
    children: 'HOME',
  },
};

export const WithEndIcon: Story = {
  args: {
    endIcon: 'cart',
    children: 'ADD TO CART',
  },
};

export const IconOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Cuando no se pasa `children`, el botón detecta automáticamente el modo icon-only ' +
          'y ajusta su padding para mantener proporciones cuadradas. ' +
          'Se recomienda usar `tooltip` para accesibilidad.',
      },
    },
  },
  args: {
    startIcon: 'plusCircle',
    children: '',
    tooltip: 'Agregar nuevo',
    radius: 'none',
    'aria-label': 'Agregar nuevo',
  },
};

// ─── Estados ─────────────────────────────────────────────────

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'El estado deshabilitado reduce la opacidad, cambia el cursor a `not-allowed` y ' +
          'bloquea todos los eventos de interacción. Aplica colores `muted` del preset activo.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '12px' }}>
      {(['contained', 'outlined', 'text'] as const).map((v) => (
        <Button {...args} key={v} variant={v}>
          DISABLED
        </Button>
      ))}
    </div>
  ),
  args: { disabled: true, color: 'ink' },
};

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'El estado de carga muestra un spinner animado, oculta los iconos y bloquea la interacción. ' +
          'Opcionalmente, `loadingText` reemplaza el label del botón.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {(['contained', 'outlined', 'text'] as const).map((v) => (
        <div
          key={v}
          style={{ display: 'flex', gap: '12px', alignItems: 'center' }}
        >
          <Button {...args} variant={v} loading>
            SAVE
          </Button>
          <Button {...args} variant={v} loading loadingText="SAVING...">
            SAVE
          </Button>
        </div>
      ))}
    </div>
  ),
  args: { color: 'sea' },
};

// ─── Efectos de interacción ──────────────────────────────────

export const Effects: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Los efectos proporcionan feedback visual al usuario durante la interacción. ' +
          '`press` escala el botón al presionar, `lift` lo eleva en hover y comprime al hacer click, ' +
          'y `glow` añade un halo luminoso basado en el color activo.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: '12px' }}>
      {(['none', 'press', 'lift', 'glow'] as const).map((e) => (
        <Button {...args} key={e} effect={e}>
          {e.toUpperCase()}
        </Button>
      ))}
    </div>
  ),
  args: { variant: 'contained', color: 'grape' },
};

// ─── Full width ──────────────────────────────────────────────

export const FullWidth: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Con `fullWidth`, el botón ocupa el 100% del ancho de su contenedor. ' +
          'Útil en layouts de formularios o acciones principales en mobile.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    fullWidth: true,
    children: 'CONFIRM',
    variant: 'contained',
    color: 'sea',
  },
};

// ─── Tooltip ─────────────────────────────────────────────────

export const WithTooltip: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'El tooltip aparece encima del botón al hacer hover o focus, y se oculta con Escape. ' +
          'Se vincula al botón mediante `aria-describedby` para lectores de pantalla.',
      },
    },
  },
  args: {
    tooltip: 'Acción principal',
    children: 'HOVER ME',
    variant: 'outlined',
    color: 'ink',
  },
};
