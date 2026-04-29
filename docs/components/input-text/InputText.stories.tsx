import type { Meta, StoryObj } from '@storybook/react-vite';
import { InputText } from '../../../src/components/input-text/InputText';

const meta = {
  title: 'Components/InputText',
  component: InputText,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Control de entrada de texto de una sola línea. No gestiona label, ' +
          'error ni estado visual — esa responsabilidad pertenece al componente ' +
          '`Field` (próximamente). Soporta modos controlado y no controlado, ' +
          'limpieza de valor, contador de caracteres, afijos decorativos y ' +
          'ref forwarding al elemento `<input>` nativo (spec §2.7).',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '360px', width: '100%' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    // ── Apariencia ───────────────────────────────────────────
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description:
        'Tamaño visual del control. Controla altura, padding y tipografía. ' +
        'Alineado con los tamaños de Button para compatibilidad en layouts mixtos (spec §2.2).',
      table: {
        category: 'Apariencia',
        defaultValue: { summary: 'md' },
      },
    },
    status: {
      control: 'select',
      options: ['idle', 'success', 'warning', 'error'],
      description:
        'Estado visual del campo. En V1 se pasa directamente; en V2 será ' +
        'provisto por FieldContext. Afecta el color del borde y el focus ring.',
      table: {
        category: 'Apariencia',
        defaultValue: { summary: 'idle' },
      },
    },
    // ── Contenido ────────────────────────────────────────────
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: 'Tipo nativo del input. Afecta el teclado en móvil y la validación del navegador.',
      table: {
        category: 'Contenido',
        defaultValue: { summary: 'text' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Texto visible cuando el campo está vacío.',
      table: {
        category: 'Contenido',
        defaultValue: { summary: '""' },
      },
    },
    prefix: {
      control: false,
      description:
        'Contenido decorativo al inicio del input. Se renderiza con aria-hidden="true".',
      table: {
        category: 'Contenido',
        defaultValue: { summary: 'null' },
      },
    },
    suffix: {
      control: false,
      description:
        'Contenido decorativo al final del input. Se renderiza con aria-hidden="true".',
      table: {
        category: 'Contenido',
        defaultValue: { summary: 'null' },
      },
    },
    // ── Estado ───────────────────────────────────────────────
    disabled: {
      control: 'boolean',
      description:
        'Deshabilita el control. En un árbol Field→Form, se hereda en cascada ' +
        'desde el ancestro (spec §2.4) y no puede ser re-habilitado por el control hijo.',
      table: {
        category: 'Estado',
        defaultValue: { summary: 'false' },
      },
    },
    readOnly: {
      control: 'boolean',
      description: 'Solo lectura. El valor se muestra pero no puede modificarse.',
      table: {
        category: 'Estado',
        defaultValue: { summary: 'false' },
      },
    },
    clearable: {
      control: 'boolean',
      description:
        'Muestra un botón para limpiar el valor. Se oculta cuando el campo ' +
        'está vacío, deshabilitado o en modo readOnly.',
      table: {
        category: 'Estado',
        defaultValue: { summary: 'false' },
      },
    },
    // ── Interacción ──────────────────────────────────────────
    maxLength: {
      control: 'number',
      description: 'Límite máximo de caracteres. Activa el contador si se combina con showCount.',
      table: {
        category: 'Interacción',
        defaultValue: { summary: 'undefined' },
      },
    },
    showCount: {
      control: 'boolean',
      description: 'Muestra un contador de caracteres "{actual}/{máximo}". Requiere maxLength.',
      table: {
        category: 'Interacción',
        defaultValue: { summary: 'false' },
      },
    },
    autoComplete: {
      control: 'text',
      description: 'Valor del atributo nativo autocomplete.',
      table: {
        category: 'Interacción',
        defaultValue: { summary: 'off' },
      },
    },
  },
  args: {
    placeholder: 'Escribe aquí…',
  },
} satisfies Meta<typeof InputText>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Default ──────────────────────────────────────────────────

export const Default: Story = {
  args: {
    placeholder: 'Campo de texto',
  },
};

// ── Tipos ────────────────────────────────────────────────────

export const Types: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Todos los tipos nativos soportados. El tipo afecta la validación del ' +
          'navegador, el teclado en dispositivos móviles y el comportamiento de ' +
          'autocompletado del sistema operativo.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {(
        [
          'text',
          'email',
          'password',
          'number',
          'tel',
          'url',
          'search',
        ] as const
      ).map((t) => (
        <InputText
          {...args}
          key={t}
          type={t}
          placeholder={t}
          aria-label={t}
        />
      ))}
    </div>
  ),
};

// ── Tamaños ──────────────────────────────────────────────────

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Los tres tamaños mantienen proporciones consistentes con Button, ' +
          'permitiendo alineación vertical en layouts mixtos (spec §2.2).',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <InputText {...args} key={s} size={s} placeholder={s} aria-label={s} />
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
          'automáticamente desde `FormContext`. `success` y `warning` son ' +
          'estados manuales para feedback enriquecido (spec §2.1).',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {(['idle', 'success', 'warning', 'error'] as const).map((s) => (
        <InputText
          {...args}
          key={s}
          status={s}
          placeholder={s}
          aria-label={s}
          defaultValue={s !== 'idle' ? 'Valor de ejemplo' : undefined}
        />
      ))}
    </div>
  ),
};

// ── Con prefijo ──────────────────────────────────────────────

export const WithPrefix: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'El prefijo es decorativo y lleva aria-hidden="true". Útil para ' +
          'íconos o símbolos que refuerzan el tipo de dato esperado.',
      },
    },
  },
  args: {
    prefix: <span style={{ fontSize: '1em' }}>@</span>,
    placeholder: 'usuario',
    type: 'text',
    autoComplete: 'username',
  },
};

// ── Con sufijo ───────────────────────────────────────────────

export const WithSuffix: Story = {
  parameters: {
    docs: {
      description: {
        story: 'El sufijo es decorativo y lleva aria-hidden="true".',
      },
    },
  },
  args: {
    suffix: (
      <span style={{ fontSize: '0.85em' }}>kg</span>
    ),
    placeholder: 'Peso',
    type: 'number',
  },
};

// ── Con prefijo y sufijo ─────────────────────────────────────

export const WithPrefixAndSuffix: Story = {
  args: {
    prefix: <span style={{ fontSize: '0.9em' }}>$</span>,
    suffix: <span style={{ fontSize: '0.85em' }}>MXN</span>,
    placeholder: '0.00',
    type: 'number',
  },
};

// ── Clearable ────────────────────────────────────────────────

export const Clearable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'El botón de limpieza aparece solo cuando el campo tiene valor y ' +
          'no está deshabilitado ni en readOnly. Tiene aria-label para ' +
          'lectores de pantalla (spec §5).',
      },
    },
  },
  args: {
    clearable: true,
    defaultValue: 'Texto que puedes limpiar',
  },
};

// ── Con contador ─────────────────────────────────────────────

export const WithCount: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'showCount junto con maxLength activa un contador de caracteres ' +
          'debajo del campo. El contador se vuelve rojo al superar el límite.',
      },
    },
  },
  args: {
    showCount: true,
    maxLength: 50,
    placeholder: 'Máximo 50 caracteres',
  },
};

// ── Clearable + contador ─────────────────────────────────────

export const ClearableWithCount: Story = {
  args: {
    clearable: true,
    showCount: true,
    maxLength: 30,
    defaultValue: 'Texto de prueba',
  },
};

// ── Deshabilitado ────────────────────────────────────────────

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'El estado deshabilitado reduce la opacidad, cambia el fondo y el cursor. ' +
          'En un árbol Form→Field, este estado se hereda en cascada y no puede ' +
          'ser sobreescrito por el control hijo (spec §2.4).',
      },
    },
  },
  args: {
    disabled: true,
    defaultValue: 'Campo deshabilitado',
    placeholder: 'Deshabilitado',
  },
};

// ── Solo lectura ─────────────────────────────────────────────

export const ReadOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'ReadOnly permite ver el valor pero no modificarlo. ' +
          'A diferencia de disabled, el campo sigue siendo enfocable.',
      },
    },
  },
  args: {
    readOnly: true,
    defaultValue: 'Este valor no se puede editar',
  },
};

// ── Contraseña ───────────────────────────────────────────────

export const Password: Story = {
  parameters: {
    docs: {
      description: {
        story: 'type="password" oculta el valor. El navegador puede ofrecer ' +
          'su propio ícono de visibilidad según el sistema operativo.',
      },
    },
  },
  args: {
    type: 'password',
    placeholder: 'Contraseña',
    autoComplete: 'current-password',
  },
};
