import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from '../../../src/components/select/Select';

const fruitOptions = [
  { value: 'apple', label: 'Manzana' },
  { value: 'banana', label: 'Plátano' },
  { value: 'cherry', label: 'Cereza' },
  { value: 'grape', label: 'Uva' },
  { value: 'mango', label: 'Mango' },
  { value: 'orange', label: 'Naranja' },
  { value: 'peach', label: 'Durazno' },
  { value: 'pear', label: 'Pera' },
];

const roleOptions = [
  { value: 'admin', label: 'Administrador' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Visualizador' },
];

const groupedOptions = [
  { value: 'apple', label: 'Manzana', group: 'Frutas' },
  { value: 'banana', label: 'Plátano', group: 'Frutas' },
  { value: 'cherry', label: 'Cereza', group: 'Frutas' },
  { value: 'carrot', label: 'Zanahoria', group: 'Verduras' },
  { value: 'broccoli', label: 'Brócoli', group: 'Verduras' },
  { value: 'spinach', label: 'Espinaca', group: 'Verduras' },
];

const withDisabledOptions = [
  { value: 'admin', label: 'Administrador' },
  { value: 'editor', label: 'Editor', disabled: true },
  { value: 'viewer', label: 'Visualizador' },
  { value: 'guest', label: 'Invitado', disabled: true },
];

const meta = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Control de selección única con opciones estáticas. No gestiona label, ' +
          'error ni estado visual — esa responsabilidad pertenece al componente ' +
          '`Field` (próximamente). Soporta búsqueda local, limpieza de valor, ' +
          'opciones agrupadas, estado de carga y ref forwarding al trigger ' +
          'nativo (spec §2.7).',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', minHeight: '320px' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description:
        'Tamaño visual del control. Alineado con InputText y Button (spec §2.2).',
      table: { category: 'Apariencia', defaultValue: { summary: 'md' } },
    },
    status: {
      control: 'select',
      options: ['idle', 'success', 'warning', 'error'],
      description:
        'Estado visual del campo. En V2 será provisto por FieldContext.',
      table: { category: 'Apariencia', defaultValue: { summary: 'idle' } },
    },
    placeholder: {
      control: 'text',
      description: 'Texto visible cuando no hay selección.',
      table: { category: 'Contenido', defaultValue: { summary: '"Seleccionar..."' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Deshabilita el control completamente.',
      table: { category: 'Estado', defaultValue: { summary: 'false' } },
    },
    clearable: {
      control: 'boolean',
      description: 'Muestra botón para limpiar la selección.',
      table: { category: 'Estado', defaultValue: { summary: 'false' } },
    },
    searchable: {
      control: 'boolean',
      description: 'Habilita búsqueda local sobre las opciones.',
      table: { category: 'Estado', defaultValue: { summary: 'false' } },
    },
    loading: {
      control: 'boolean',
      description: 'Muestra indicador de carga y aria-busy.',
      table: { category: 'Estado', defaultValue: { summary: 'false' } },
    },
    emptyText: {
      control: 'text',
      description: 'Mensaje cuando no hay opciones o sin resultados.',
      table: { category: 'Contenido', defaultValue: { summary: '"Sin resultados"' } },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Si es true, ocupa el 100% del contenedor padre.',
      table: { category: 'Layout', defaultValue: { summary: 'true' } },
    },
    width: {
      control: 'text',
      description: 'Ancho personalizado (ej: "300px", "50%"). Sobreescribe fullWidth.',
      table: { category: 'Layout' },
    },
  },
  args: {
    options: fruitOptions,
    placeholder: 'Selecciona una fruta',
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Default ──────────────────────────────────────────────────

export const Default: Story = {
  args: {
    options: roleOptions,
    placeholder: 'Selecciona un rol',
  },
};

// ── Tamaños ──────────────────────────────────────────────────

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Los tres tamaños son idénticos a InputText, garantizando ' +
          'alineación perfecta en layouts mixtos (spec §2.2).',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <Select
          {...args}
          key={s}
          size={s}
          placeholder={`Tamaño ${s}`}
          options={roleOptions}
        />
      ))}
    </div>
  ),
};

// ── Estados visuales ─────────────────────────────────────────

export const Statuses: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Estado visual del campo. En producción, `error` lo provee `Field` ' +
          'automáticamente desde `FormContext` (spec §2.1).',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {(['idle', 'success', 'warning', 'error'] as const).map((s) => (
        <Select
          {...args}
          key={s}
          status={s}
          placeholder={s}
          defaultValue={s !== 'idle' ? 'apple' : undefined}
          options={fruitOptions}
        />
      ))}
    </div>
  ),
};

// ── Clearable ────────────────────────────────────────────────

export const Clearable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'El botón de limpieza aparece solo cuando hay un valor seleccionado ' +
          'y el control no está deshabilitado.',
      },
    },
  },
  args: {
    clearable: true,
    defaultValue: 'banana',
    options: fruitOptions,
  },
};

// ── Searchable ───────────────────────────────────────────────

export const Searchable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Búsqueda local sobre las opciones. Filtra por coincidencia parcial ' +
          'en el label. Muestra emptyText si no hay resultados.',
      },
    },
  },
  args: {
    searchable: true,
    options: fruitOptions,
    placeholder: 'Busca una fruta...',
  },
};

// ── Searchable + Clearable ───────────────────────────────────

export const SearchableWithClearable: Story = {
  args: {
    searchable: true,
    clearable: true,
    defaultValue: 'mango',
    options: fruitOptions,
  },
};

// ── Loading ──────────────────────────────────────────────────

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Estado de carga: muestra un spinner en el panel y expone ' +
          'aria-busy="true" en el trigger.',
      },
    },
  },
  args: {
    loading: true,
    options: [],
    placeholder: 'Cargando roles...',
  },
};

// ── Grouped ──────────────────────────────────────────────────

export const GroupedOptions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Opciones agrupadas por la propiedad `group`. Las opciones sin grupo ' +
          'se renderizan primero, sin header.',
      },
    },
  },
  args: {
    options: groupedOptions,
    placeholder: 'Selecciona un alimento',
    searchable: true,
  },
};

// ── Disabled options ─────────────────────────────────────────

export const DisabledOptions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Opciones individuales deshabilitadas. No son seleccionables por ' +
          'click ni teclado.',
      },
    },
  },
  args: {
    options: withDisabledOptions,
    placeholder: 'Selecciona un rol',
  },
};

// ── Disabled ─────────────────────────────────────────────────

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Control completamente deshabilitado. Reduce opacidad, cambia fondo y cursor.',
      },
    },
  },
  args: {
    disabled: true,
    defaultValue: 'admin',
    options: roleOptions,
    placeholder: 'Deshabilitado',
  },
};

// ── Empty ────────────────────────────────────────────────────

export const EmptyOptions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Sin opciones disponibles. El panel muestra emptyText para consistencia.',
      },
    },
  },
  args: {
    options: [],
    emptyText: 'No hay opciones disponibles',
  },
};

// ── Layout: Full Width ───────────────────────────────────────

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    options: roleOptions,
    placeholder: 'Ocupo todo el ancho disponible',
  },
};

// ── Layout: Custom Width ─────────────────────────────────────

export const CustomWidth: Story = {
  args: {
    width: '300px',
    options: roleOptions,
    placeholder: 'Ancho fijo de 300px',
  },
};
