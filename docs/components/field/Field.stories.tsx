import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field } from '../../../src/components/field/Field';
import { InputText } from '../../../src/components/input-text/InputText';
import { Select } from '../../../src/components/select/Select';

const meta = {
  title: 'Components/Field',
  component: Field,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Wrapper universal para controles de formulario. Gestiona la presentación del campo ' +
          '(etiqueta, ayuda, error) y conecta con `FormContext` (próximamente) para leer ' +
          'errores y estado de validación de forma automática. Provee un `FieldContext` que ' +
          'los controles hijos (`InputText`, `Select`) consumen para heredar `size`, `status`, ' +
          '`disabled`, `name` y atributos ARIA de accesibilidad.',
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
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Clave del campo. En el futuro conectará con FormContext.',
      table: { category: 'Core', defaultValue: { summary: 'requerido' } },
    },
    label: {
      control: 'text',
      description: 'Etiqueta visible del campo.',
      table: { category: 'Contenido', defaultValue: { summary: 'null' } },
    },
    helperText: {
      control: 'text',
      description: 'Texto de ayuda persistente, visible bajo el control.',
      table: { category: 'Contenido', defaultValue: { summary: 'null' } },
    },
    errorText: {
      control: 'text',
      description: 'Error explícito. Sobreescribe helperText visualmente y para lectores de pantalla.',
      table: { category: 'Contenido', defaultValue: { summary: 'null' } },
    },
    status: {
      control: 'select',
      options: ['idle', 'success', 'warning', 'error'],
      description: 'Estado visual del campo. Se propaga al control hijo.',
      table: { category: 'Apariencia', defaultValue: { summary: 'idle' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tamaño visual. Se propaga al control hijo.',
      table: { category: 'Apariencia', defaultValue: { summary: 'md' } },
    },
    required: {
      control: 'boolean',
      description: 'Muestra indicador (*) y propaga aria-required al control.',
      table: { category: 'Estado', defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Deshabilita el campo y propaga disabled al control hijo.',
      table: { category: 'Estado', defaultValue: { summary: 'false' } },
    },
    validateOn: {
      control: 'select',
      options: ['change', 'blur', 'submit', null],
      description: 'Override local del timing de validación (para el futuro Form sprint).',
      table: { category: 'Validación', defaultValue: { summary: 'null' } },
    },
  },
  args: {
    name: 'demoField',
    children: <InputText placeholder="Escribe aquí..." />,
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Default ──────────────────────────────────────────────────

export const Default: Story = {
  args: {
    label: 'Nombre completo',
    helperText: 'Ingresa tu nombre tal como aparece en tu identificación.',
  },
};

// ── Requerido ────────────────────────────────────────────────

export const Required: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Muestra un asterisco rojo y propaga `aria-required="true"` al input.',
      },
    },
  },
  args: {
    label: 'Correo electrónico',
    required: true,
    children: <InputText type="email" placeholder="ejemplo@correo.com" />,
  },
};

// ── Con Error ────────────────────────────────────────────────

export const WithError: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Cuando hay un `errorText`, se renderiza con `role="alert"` y el `status` cambia automáticamente a `"error"`, propagando los estilos rojos al control hijo. El error reemplaza al helper text en la vista y en la descripción accesible.',
      },
    },
  },
  args: {
    label: 'Contraseña',
    required: true,
    helperText: 'Mínimo 8 caracteres.',
    errorText: 'La contraseña es demasiado corta.',
    children: <InputText type="password" value="123" />,
  },
};

// ── Estados visuales ─────────────────────────────────────────

export const Statuses: Story = {
  parameters: {
    docs: {
      description: {
        story: 'El Field propaga el estado visual al control interno. `"idle"` y `"error"` son los más comunes. `"success"` y `"warning"` son manuales para validación enriquecida.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {(['idle', 'success', 'warning', 'error'] as const).map((s) => (
        <Field
          {...args}
          key={s}
          name={`status-${s}`}
          label={`Estado: ${s}`}
          status={s}
          helperText={s === 'error' ? undefined : `Este es un mensaje de ${s}`}
          errorText={s === 'error' ? 'Hubo un problema con la validación' : undefined}
        >
          <InputText defaultValue="Valor ingresado" />
        </Field>
      ))}
    </div>
  ),
};

// ── Tamaños ──────────────────────────────────────────────────

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'El tamaño se propaga automáticamente desde el `Field` al control interno, asegurando que los estilos y proporciones (etiquetas, espaciado) escalen correctamente.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <Field
          {...args}
          key={s}
          name={`size-${s}`}
          label={`Tamaño: ${s}`}
          size={s}
          helperText="Texto de ayuda proporcional al tamaño"
        >
          <InputText placeholder="Placeholder" />
        </Field>
      ))}
    </div>
  ),
};

// ── Integración con Select ───────────────────────────────────

export const WithSelect: Story = {
  parameters: {
    docs: {
      description: {
        story: 'El `Field` es agnóstico al control. Aquí vemos cómo envuelve y pasa estado a un componente `Select` complejo.',
      },
    },
  },
  args: {
    label: 'Rol del sistema',
    required: true,
    children: (
      <Select
        options={[
          { value: 'admin', label: 'Administrador' },
          { value: 'editor', label: 'Editor' },
          { value: 'viewer', label: 'Visualizador' },
        ]}
        placeholder="Selecciona un rol"
      />
    ),
  },
};

// ── Deshabilitado ────────────────────────────────────────────

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Deshabilitar el `Field` atenúa la etiqueta y desactiva completamente el control hijo.',
      },
    },
  },
  args: {
    label: 'Campo inactivo',
    disabled: true,
    helperText: 'No puedes editar esto ahora.',
    children: <InputText defaultValue="Valor bloqueado" />,
  },
};
