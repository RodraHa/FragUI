import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DataList } from '../../../src/components/data-list/DataList';
import type { DataItem } from '../../../src/components/data-list/DataList';
import { Badge } from '../../../src/components/badge/Badge';
import { fontFamily } from '../../../src/theme/tokens/typography';

const baseItems: DataItem[] = [
  {
    id: 'dato-1',
    label: 'Título del Dato 1',
    description:
      'Descripción larga de la Data List que incluye más información relevante del dato 1',
    meta: <Badge variant="subtle" color="pine" label="Estado" size="sm" />,
  },
  {
    id: 'dato-2',
    label: 'Título del Dato 2',
    description:
      'Descripción larga de la Data List que incluye más información relevante del dato 2',
    meta: <Badge variant="subtle" color="pine" label="Estado" size="sm" />,
  },
  {
    id: 'dato-3',
    label: 'Título del Dato 3',
    description:
      'Descripción larga de la Data List que incluye más información relevante del dato 3',
    meta: <Badge variant="subtle" color="pine" label="Estado" size="sm" />,
  },
  {
    id: 'dato-4',
    label: 'Título del Dato 4',
    description:
      'Descripción larga de la Data List que incluye más información relevante del dato 4',
    meta: <Badge variant="subtle" color="ink" label="Inactivo" size="sm" />,
    disabled: true,
  },
];

const simpleItems: DataItem[] = baseItems.map((i) => ({
  ...i,
  meta: 'Estado',
}));

const meta = {
  title: 'Components/DataList',
  component: DataList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Muestra colecciones de datos estructurados en formato lista. ' +
          'Soporta tres densidades visuales (default, compact, spaced), ' +
          'selección múltiple opcional con checkboxes inline, estados de ' +
          'carga con skeleton, estado vacío configurable, navegación por ' +
          'teclado con aria-activedescendant y render personalizado vía ' +
          '`renderItem`.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          minWidth: '480px',
          maxWidth: '640px',
          fontFamily: fontFamily.satoshi,
        }}
      >
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: false,
      description:
        'Lista de datos a renderizar. Cada ítem: { id, label, description?, meta?, disabled? }.',
      table: { category: 'Datos' },
    },
    variant: {
      control: 'select',
      options: ['default', 'compact', 'spaced'],
      description: 'Densidad visual de las filas.',
      table: { category: 'Apariencia', defaultValue: { summary: 'default' } },
    },
    selectable: {
      control: 'boolean',
      description:
        'Habilita checkbox inline y convierte el contenedor en listbox.',
      table: {
        category: 'Comportamiento',
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Desactiva todo el componente.',
      table: {
        category: 'Comportamiento',
        defaultValue: { summary: 'false' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'Muestra 4 filas skeleton.',
      table: {
        category: 'Comportamiento',
        defaultValue: { summary: 'false' },
      },
    },
    selectedKeys: { table: { disable: true } },
    defaultSelectedKeys: { table: { disable: true } },
    onSelectionChange: { table: { disable: true } },
    renderItem: { table: { disable: true } },
    emptyState: { table: { disable: true } },
  },
  args: {
    items: simpleItems,
  },
} satisfies Meta<typeof DataList>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Default ───────────────────────────────────────────────────

export const Default: Story = {
  args: {
    variant: 'default',
  },
};

// ─── Compact ───────────────────────────────────────────────────

export const Compact: Story = {
  args: {
    variant: 'compact',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Densidad `compact`: padding reducido (8px vertical), oculta la descripción y usa label 14px.',
      },
    },
  },
};

// ─── Spaced ────────────────────────────────────────────────────

export const Spaced: Story = {
  args: {
    variant: 'spaced',
    items: baseItems,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Densidad `spaced`: padding 24px en los cuatro lados, separador más grueso (2px). Ideal para contenido con más jerarquía.',
      },
    },
  },
};

// ─── Selectable ────────────────────────────────────────────────

export const Selectable: Story = {
  args: {
    selectable: true,
    variant: 'default',
    'aria-label': 'Lista de datos seleccionables',
  },
  render: (args) => {
    const SelectableList = () => {
      const [keys, setKeys] = useState<string[]>([]);
      return (
        <DataList {...args} selectedKeys={keys} onSelectionChange={setKeys} />
      );
    };
    return <SelectableList />;
  },
  parameters: {
    docs: {
      description: {
        story:
          'Con `selectable=true` el contenedor se convierte en `role="listbox"` con `aria-multiselectable` y cada ítem en `role="option"`. Se navega con ↑ / ↓ / Home / End y se togla selección con Space o Enter.',
      },
    },
  },
};

// ─── WithPreselection ──────────────────────────────────────────

export const WithPreselection: Story = {
  name: 'Con selección inicial',
  args: {
    selectable: true,
    defaultSelectedKeys: ['dato-1'],
    'aria-label': 'Lista con selección inicial',
  },
};

// ─── Loading ───────────────────────────────────────────────────

export const Loading: Story = {
  args: {
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Durante la carga se renderizan 4 filas skeleton con shimmer que respeta `prefers-reduced-motion`. El contenedor expone `aria-busy="true"`.',
      },
    },
  },
};

// ─── Empty ─────────────────────────────────────────────────────

export const Empty: Story = {
  args: {
    items: [],
    emptyState: 'Sin resultados para esta búsqueda',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Cuando `items` está vacío y no hay `loading`, se renderiza el `emptyState`. Si no lo pasas, se muestra un mensaje por defecto ("No hay datos").',
      },
    },
  },
};
