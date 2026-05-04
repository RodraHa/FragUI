import type { Meta, StoryObj } from '@storybook/react-vite';
import { FieldGroup } from '../../../src/components/field-group/FieldGroup';
import { Field } from '../../../src/components/field/Field';
import { InputText } from '../../../src/components/input-text/InputText';
import { Select } from '../../../src/components/select/Select';
import { useState } from 'react';

const meta = {
  title: 'Components/FieldGroup',
  component: FieldGroup,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Agrupa componentes `Field` bajo una sección con título opcional y controla el layout interno ' +
          '(grid CSS). Provee semántica HTML nativa (`<fieldset>` y `<legend>`) cuando tiene título, ' +
          'soporta colapso/expansión, y propaga el estado `disabled` a todos sus descendientes.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'text',
      description: 'Identificador del grupo (auto-generado si se omite).',
      table: { category: 'Core' },
    },
    title: {
      control: 'text',
      description: 'Título visible de la sección. Renderizado como `<legend>`.',
      table: { category: 'Contenido' },
    },
    description: {
      control: 'text',
      description: 'Texto de contexto o instrucciones de la sección.',
      table: { category: 'Contenido' },
    },
    columns: {
      control: 'select',
      options: [1, 2, 3, 4],
      description: 'Número de columnas del grid interno.',
      table: { category: 'Layout', defaultValue: { summary: '1' } },
    },
    gap: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Espaciado entre los campos internos.',
      table: { category: 'Layout', defaultValue: { summary: 'md' } },
    },
    collapsible: {
      control: 'boolean',
      description: 'Permite colapsar/expandir el grupo.',
      table: { category: 'Interacción', defaultValue: { summary: 'false' } },
    },
    collapsed: {
      control: 'boolean',
      description: 'Estado colapsado (modo controlado).',
      table: { category: 'Interacción' },
    },
    defaultCollapsed: {
      control: 'boolean',
      description: 'Estado colapsado inicial (modo no controlado).',
      table: { category: 'Interacción', defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Deshabilita todos los `Field` descendientes (regla de herencia en cascada: ancestro gana).',
      table: { category: 'Estado', defaultValue: { summary: 'false' } },
    },
  },
  args: {
    title: 'Información Personal',
    description: 'Ingresa los datos básicos para tu perfil de usuario.',
    children: (
      <>
        <Field name="firstName" label="Nombre">
          <InputText placeholder="Ej. Juan" />
        </Field>
        <Field name="lastName" label="Apellido">
          <InputText placeholder="Ej. Pérez" />
        </Field>
      </>
    ),
  },
} satisfies Meta<typeof FieldGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Default ──────────────────────────────────────────────────

export const Default: Story = {
  args: {
    columns: 2,
  },
};

// ── Sin Título ni Descripción ─────────────────────────────────

export const NoHeader: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Si no se provee `title` ni `description`, actúa puramente como un wrapper de layout invisible (grid container).',
      },
    },
  },
  args: {
    title: null,
    description: null,
    columns: 3,
    children: (
      <>
        <Field name="city" label="Ciudad">
          <InputText />
        </Field>
        <Field name="state" label="Estado">
          <InputText />
        </Field>
        <Field name="zip" label="Código Postal">
          <InputText />
        </Field>
      </>
    ),
  },
};

// ── Grid Layouts ─────────────────────────────────────────────

export const GridLayouts: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Soporta hasta 4 columnas con espaciados (gaps) ajustables (`sm`, `md`, `lg`).',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <FieldGroup title="1 Columna (Default)" description="columns={1}">
        <Field name="f1" label="Campo ancho"><InputText fullWidth /></Field>
        <Field name="f2" label="Otro campo"><InputText fullWidth /></Field>
      </FieldGroup>

      <FieldGroup title="3 Columnas (gap='lg')" description="columns={3} gap='lg'" columns={3} gap="lg">
        <Field name="f3" label="Columna A"><InputText /></Field>
        <Field name="f4" label="Columna B"><InputText /></Field>
        <Field name="f5" label="Columna C"><InputText /></Field>
      </FieldGroup>
    </div>
  ),
};

// ── Colapsable (No controlado) ───────────────────────────────

export const Collapsible: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Con `collapsible={true}`, el título se convierte en un botón interactivo. Se puede iniciar colapsado usando `defaultCollapsed={true}`.',
      },
    },
  },
  args: {
    title: 'Ajustes Avanzados',
    description: 'Configuraciones opcionales del sistema.',
    collapsible: true,
    defaultCollapsed: true,
    columns: 2,
    children: (
      <>
        <Field name="theme" label="Tema">
          <Select options={[{ value: 'light', label: 'Claro' }, { value: 'dark', label: 'Oscuro' }]} defaultValue="light" />
        </Field>
        <Field name="notifications" label="Notificaciones">
          <Select options={[{ value: 'all', label: 'Todas' }, { value: 'none', label: 'Ninguna' }]} defaultValue="all" />
        </Field>
      </>
    ),
  },
};

// ── Deshabilitado (Cascada) ──────────────────────────────────

export const DisabledCascade: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Por regla de herencia en cascada, si un `FieldGroup` está deshabilitado, todos los campos internos quedan deshabilitados de forma inmutable.',
      },
    },
  },
  args: {
    title: 'Sección Bloqueada',
    description: 'No tienes permisos para editar esta sección.',
    disabled: true,
    columns: 2,
    children: (
      <>
        {/* Even though we try to enable this field, the ancestor wins */}
        <Field name="docName" label="Nombre del documento" disabled={false}>
          <InputText defaultValue="Contrato_Final.pdf" />
        </Field>
        <Field name="docType" label="Tipo">
          <Select options={[{ value: 'pdf', label: 'PDF' }]} defaultValue="pdf" />
        </Field>
      </>
    ),
  },
};

// ── Grupos Anidados ──────────────────────────────────────────

export const NestedGroups: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Los grupos pueden anidarse. Los contextos (como el estado `disabled`) fluyen correctamente a través de múltiples niveles.',
      },
    },
  },
  render: (args) => {
    const [disabled, setDisabled] = useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'sans-serif' }}>
            <input type="checkbox" checked={disabled} onChange={(e) => setDisabled(e.target.checked)} />
            Deshabilitar grupo padre
          </label>
        </div>
        
        <FieldGroup title="Grupo Principal" description="Contiene campos y sub-grupos." disabled={disabled}>
          <Field name="mainField" label="Campo del nivel superior">
            <InputText />
          </Field>

          <div style={{ marginTop: '24px' }}>
            <FieldGroup title="Sub-grupo (Avanzado)" description="Ajustes específicos" columns={2} collapsible defaultCollapsed>
              <Field name="subField1" label="Opción 1"><InputText /></Field>
              <Field name="subField2" label="Opción 2"><InputText /></Field>
            </FieldGroup>
          </div>
        </FieldGroup>
      </div>
    );
  }
};
