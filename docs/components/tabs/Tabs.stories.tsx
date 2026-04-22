import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Tabs } from '../../../src/components/tabs/Tabs';
import type { TabItem } from '../../../src/components/tabs/Tabs';
import { fontFamily } from '../../../src/theme/tokens/typography';

const defaultTabs: TabItem[] = [
  {
    id: 'general',
    label: 'GENERAL',
    content:
      'Panel de General — Resumen general con información relevante en formato horizontal.',
  },
  {
    id: 'active',
    label: 'ACTIVE',
    content:
      'Panel de Active — Contenido mostrado cuando Active está seleccionada.',
  },
  {
    id: 'disable',
    label: 'DISABLE',
    content:
      'Panel de Disable — No debería renderizarse si la tab está deshabilitada.',
    disabled: true,
  },
];

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Permite navegar entre múltiples vistas de contenido organizadas en pestañas. ' +
          'Soporta modo controlado/no controlado, orientación horizontal o vertical, ' +
          'activación automática o manual, roving tabindex y accesibilidad WCAG 2.1 AA.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          minWidth: '420px',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: fontFamily.satoshi,
        }}
      >
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    tabs: {
      control: false,
      description:
        'Lista de pestañas. Cada ítem incluye `id`, `label`, `content` y opcionalmente `disabled`.',
      table: { category: 'Datos' },
    },
    value: {
      control: 'text',
      description: 'ID de la tab activa en modo controlado.',
      table: { category: 'Estado' },
    },
    defaultValue: {
      control: 'text',
      description: 'ID de la tab activa inicial en modo no controlado.',
      table: { category: 'Estado' },
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Dirección del tablist y de la navegación por flechas.',
      table: {
        category: 'Apariencia',
        defaultValue: { summary: 'horizontal' },
      },
    },
    activation: {
      control: 'radio',
      options: ['automatic', 'manual'],
      description:
        'Determina si la tab se activa al moverse el foco (automatic) o requiere Enter/Space (manual).',
      table: {
        category: 'Comportamiento',
        defaultValue: { summary: 'automatic' },
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
    onChange: { table: { disable: true } },
  },
  args: {
    tabs: defaultTabs,
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Estados base ─────────────────────────────────────────────

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    tabs: [
      {
        id: 'general',
        label: 'GENERAL',
        content:
          'Panel de General — Resumen general con información relevante en formato vertical.',
      },
      { id: 'active', label: 'ACTIVE', content: 'Panel de Active.' },
      {
        id: 'disable',
        label: 'DISABLE',
        content: 'Panel de Disable.',
        disabled: true,
      },
    ],
  },
};

export const Disabled: Story = {
  name: 'Componente deshabilitado',
  args: {
    disabled: true,
    tabs: [
      { id: 'general', label: 'GENERAL', content: 'Contenido deshabilitado.' },
      { id: 'active', label: 'ACTIVE', content: 'Contenido deshabilitado.' },
      { id: 'disable', label: 'DISABLE', content: 'Contenido deshabilitado.' },
    ],
  },
};

// ─── Activación ───────────────────────────────────────────────

export const ManualActivation: Story = {
  name: 'Activación manual',
  args: {
    activation: 'manual',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Con `activation="manual"`, las flechas solo mueven el foco; hace falta Enter o Space para activar la tab enfocada.',
      },
    },
  },
};

// ─── Modo controlado ──────────────────────────────────────────

export const Controlled: Story = {
  name: 'Controlado desde el padre',
  render: (args) => {
    const ControlledTabs = () => {
      const [value, setValue] = useState('general');
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              fontSize: 12,
              color: '#999',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Tab activa desde el padre:{' '}
            <strong style={{ color: '#050505' }}>{value}</strong>
          </div>
          <Tabs {...args} value={value} onChange={setValue} />
        </div>
      );
    };
    return <ControlledTabs />;
  },
};

// ─── Muchas tabs ──────────────────────────────────────────────

export const MultipleTabs: Story = {
  name: 'Múltiples pestañas',
  args: {
    tabs: [
      { id: 'overview', label: 'OVERVIEW', content: 'Resumen general.' },
      { id: 'metrics', label: 'METRICS', content: 'Métricas y KPIs.' },
      { id: 'activity', label: 'ACTIVITY', content: 'Historial de actividad.' },
      {
        id: 'settings',
        label: 'SETTINGS',
        content: 'Configuración del componente.',
      },
      {
        id: 'archive',
        label: 'ARCHIVE',
        content: 'Elementos archivados.',
        disabled: true,
      },
    ],
  },
};
