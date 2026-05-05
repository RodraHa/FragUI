import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { Form } from '../../../src/components/form/Form';
import { Field } from '../../../src/components/field/Field';
import { FieldGroup } from '../../../src/components/field-group/FieldGroup';
import { InputText } from '../../../src/components/input-text/InputText';
import { Select } from '../../../src/components/select/Select';
import { Button } from '../../../src/components/button/Button';
import type { FormApi } from '../../../src/types/form';

/* ─── Shared options ────────────────────────────────────────────── */

const roleOptions = [
  { value: 'admin', label: 'Administrador' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Visualizador' },
];

/* ─── Meta ──────────────────────────────────────────────────────── */

const meta = {
  title: 'Components/Form',
  component: Form,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Contenedor de estado, validación y envío. Provee `FormContext` al subárbol para que ' +
          '`FieldGroup`, `Field`, `InputText` y `Select` lean y escriban estado automáticamente. ' +
          '\n\n' +
          '**Flujo de un cambio de valor:** el usuario escribe → `InputText.onChange` sube el valor ' +
          'a `FormContext` → `Form` ejecuta `validationRules[name]` si `validateOn` es `"change"` → ' +
          '`Field` lee `errors[name]` y actualiza `status` y `errorText`.\n\n' +
          '**Flujo de un submit:** el usuario hace clic o presiona Enter → `Form` valida todo → ' +
          'marca todos los campos como `touched` → si hay errores, enfoca el primero inválido → ' +
          'si no, llama a `onSubmit(values, formApi)` → mientras espera, `isSubmitting` es `true`.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: '560px' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'text',
      description:
        'ID del formulario. Requerido para acceder a `FormApi` desde fuera del árbol JSX con `useForm(id)`.',
      table: { category: 'Core', defaultValue: { summary: 'undefined' } },
    },
    initialValues: {
      control: false,
      description:
        'Valores iniciales de todos los campos. Referencia para `reset()` e `isDirty`.',
      table: { category: 'Core', defaultValue: { summary: '{}' } },
    },
    validationRules: {
      control: false,
      description: 'Reglas de validación por campo. Ver tipo `ValidationRule` (§2.8).',
      table: { category: 'Validación', defaultValue: { summary: '{}' } },
    },
    validateOn: {
      control: 'select',
      options: ['change', 'blur', 'submit'],
      description:
        'Momento global de validación. Sobreescribible por campo en `Field.validateOn` (§2.5).',
      table: { category: 'Validación', defaultValue: { summary: '"submit"' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Deshabilita todo el árbol del formulario vía contexto (§2.4).',
      table: { category: 'Estado', defaultValue: { summary: 'false' } },
    },
    resetOnSuccess: {
      control: 'boolean',
      description: 'Resetea a `initialValues` tras un submit exitoso.',
      table: { category: 'Comportamiento', defaultValue: { summary: 'false' } },
    },
    onSubmit: {
      description:
        'Handler de envío. Recibe `(values, formApi)`. Si retorna una Promise, ' +
        '`Form` la espera: resolve → `onSuccess`; reject → `onError`.',
      table: { category: 'Callbacks' },
    },
    onSuccess: {
      description: 'Callback tras submit exitoso.',
      table: { category: 'Callbacks', defaultValue: { summary: 'null' } },
    },
    onError: {
      description: 'Callback si `onSubmit` falla. Si no se define, el error burbujea.',
      table: { category: 'Callbacks', defaultValue: { summary: 'null' } },
    },
    children: {
      control: false,
      description: 'Estructura interna: `FieldGroup`, `Field`, controles, botón de submit.',
      table: { category: 'Core' },
    },
  },
  args: {
    initialValues: { fullName: '', email: '' },
    onSubmit: async (values: Record<string, any>) => {
      await new Promise((r) => setTimeout(r, 800));
      alert(`Submit:\n${JSON.stringify(values, null, 2)}`);
    },
  },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ─── Default ───────────────────────────────────────────────────── */

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Formulario básico sin reglas de validación. El submit muestra los valores ' +
          'capturados. Observa cómo los campos se deshabilitan automáticamente mientras ' +
          '`isSubmitting` es `true` — conecta un `Button[loading]` a esa prop para ' +
          'prevenir doble-submit.',
      },
    },
  },
  render: (args) => (
    <Form {...args}>
      <Field name="fullName" label="Nombre completo">
        <InputText placeholder="Ej. María García" />
      </Field>
      <Field name="email" label="Correo electrónico">
        <InputText type="email" placeholder="correo@ejemplo.com" />
      </Field>
      <div style={{ alignSelf: 'flex-start' }}>
        <Button type="submit" size="sm">
          Enviar
        </Button>
      </div>
    </Form>
  ),
};

/* ─── Validación en submit ──────────────────────────────────────── */

export const ValidationOnSubmit: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`validateOn="submit"` (valor por defecto). Los errores solo aparecen tras ' +
          'hacer clic en Enviar o presionar Enter. El primer campo inválido recibe el ' +
          'foco automáticamente.',
      },
    },
  },
  args: {
    initialValues: { fullName: '', email: '', role: null },
    validationRules: {
      fullName: [
        { required: true, message: 'El nombre es obligatorio' },
        { minLength: 2, message: 'Mínimo 2 caracteres' },
      ],
      email: [
        { required: true, message: 'El correo es obligatorio' },
        { pattern: 'email', message: 'Ingresa un correo válido' },
      ],
      role: [{ required: true, message: 'Selecciona un rol' }],
    },
    validateOn: 'submit',
  },
  render: (args) => (
    <Form {...args}>
      <FieldGroup title="Datos personales" columns={2}>
        <Field name="fullName" label="Nombre completo" required>
          <InputText placeholder="Ej. María García" />
        </Field>
        <Field name="email" label="Correo electrónico" required>
          <InputText type="email" placeholder="correo@ejemplo.com" />
        </Field>
      </FieldGroup>
      <FieldGroup title="Permisos">
        <Field name="role" label="Rol del usuario" required>
          <Select options={roleOptions} placeholder="Selecciona un rol" />
        </Field>
      </FieldGroup>
      <div style={{ alignSelf: 'flex-start' }}>
        <Button type="submit" size="sm">
          Crear usuario
        </Button>
      </div>
    </Form>
  ),
};

/* ─── Validación en blur ────────────────────────────────────────── */

export const ValidationOnBlur: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`validateOn="blur"`. El error aparece en cuanto el campo pierde el foco. ' +
          'Ideal para formularios largos donde el usuario necesita feedback inmediato ' +
          'sin esperar al submit.',
      },
    },
  },
  args: {
    initialValues: { email: '' },
    validationRules: {
      email: [
        { required: true, message: 'El correo es obligatorio' },
        { pattern: 'email', message: 'Formato de correo inválido' },
      ],
    },
    validateOn: 'blur',
  },
  render: (args) => (
    <Form {...args}>
      <Field name="email" label="Correo electrónico" required>
        <InputText
          type="email"
          placeholder="Escribe y presiona Tab para ver el error"
        />
      </Field>
      <div style={{ alignSelf: 'flex-start' }}>
        <Button type="submit" size="sm">
          Continuar
        </Button>
      </div>
    </Form>
  ),
};

/* ─── Validación en change ──────────────────────────────────────── */

export const ValidationOnChange: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`validateOn="change"`. El error aparece mientras el usuario escribe. ' +
          'Útil para campos con reglas simples como longitud mínima, donde el feedback ' +
          'en tiempo real mejora la experiencia.',
      },
    },
  },
  args: {
    initialValues: { username: '' },
    validationRules: {
      username: [
        { required: true, message: 'El nombre de usuario es obligatorio' },
        { minLength: 3, message: 'Mínimo 3 caracteres' },
        { maxLength: 20, message: 'Máximo 20 caracteres' },
        {
          pattern: /^[a-z0-9_]+$/,
          message: 'Solo letras minúsculas, números y guión bajo',
        },
      ],
    },
    validateOn: 'change',
  },
  render: (args) => (
    <Form {...args}>
      <Field name="username" label="Nombre de usuario" required>
        <InputText
          placeholder="ej. maria_garcia"
          showCount
          maxLength={20}
        />
      </Field>
      <div style={{ alignSelf: 'flex-start' }}>
        <Button type="submit" size="sm">
          Registrar
        </Button>
      </div>
    </Form>
  ),
};

/* ─── Formulario deshabilitado ──────────────────────────────────── */

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`disabled={true}` en `Form` propaga el estado a todo el árbol vía ' +
          '`FormContext`. Ningún prop local en `FieldGroup`, `Field` o los controles ' +
          'puede re-habilitarlos — el ancestro siempre gana (§2.4). Útil mientras ' +
          '`isSubmitting` es verdadero.',
      },
    },
  },
  args: {
    initialValues: { fullName: 'María García', role: 'admin' },
    disabled: true,
  },
  render: (args) => (
    <Form {...args}>
      <FieldGroup title="Datos del usuario">
        <Field name="fullName" label="Nombre completo">
          <InputText />
        </Field>
        <Field name="role" label="Rol">
          <Select options={roleOptions} />
        </Field>
      </FieldGroup>
      <div style={{ alignSelf: 'flex-start' }}>
        <Button type="submit" size="sm" disabled>
          Procesando…
        </Button>
      </div>
    </Form>
  ),
};

/* ─── FormApi via ref ───────────────────────────────────────────── */

export const FormApiViaRef: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`Form` expone `FormApi` vía `ref`. Puedes usar `ref.current.setValue`, ' +
          '`ref.current.setError`, `ref.current.reset` y `ref.current.submit` para ' +
          'controlar el formulario programáticamente desde fuera del árbol JSX.',
      },
    },
  },
  args: {
    initialValues: { fullName: '', email: '' },
    validationRules: {
      fullName: [{ required: true, message: 'Nombre obligatorio' }],
      email: [
        { required: true, message: 'Correo obligatorio' },
        { pattern: 'email', message: 'Formato inválido' },
      ],
    },
  },
  render: (args) => {
    const ref = useRef<FormApi>(null);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Form ref={ref} {...args}>
          <Field name="fullName" label="Nombre completo" required>
            <InputText placeholder="Nombre" />
          </Field>
          <Field name="email" label="Correo electrónico" required>
            <InputText type="email" placeholder="correo@ejemplo.com" />
          </Field>
          <div style={{ alignSelf: 'flex-start' }}>
            <Button type="submit" size="sm">
              Submit nativo
            </Button>
          </div>
        </Form>

        {/* Controles externos vía FormApi */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            paddingTop: '16px',
            borderTop: '1px solid #e5e5e5',
          }}
        >
          <Button
            variant="outlined"
            size="sm"
            onClick={() =>
              ref.current?.setValue('fullName', 'María García')
            }
          >
            setValue('fullName')
          </Button>
          <Button
            variant="outlined"
            size="sm"
            onClick={() =>
              ref.current?.setError('email', 'Este correo ya está en uso')
            }
          >
            setError('email')
          </Button>
          <Button
            variant="outlined"
            size="sm"
            onClick={() => ref.current?.clearError('email')}
          >
            clearError('email')
          </Button>
          <Button variant="outlined" size="sm" onClick={() => ref.current?.reset()}>
            reset()
          </Button>
          <Button variant="outlined" size="sm" onClick={() => ref.current?.submit()}>
            submit() programático
          </Button>
        </div>
      </div>
    );
  },
};

/* ─── Submit asíncrono con feedback de estado ───────────────────── */

export const AsyncSubmitWithFeedback: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Simula un envío asíncrono que tarda 1.5 segundos. Mientras espera, ' +
          '`isSubmitting` es `true`. Observa en la consola los valores enviados. ' +
          'El formulario también muestra un resumen del estado actual.',
      },
    },
  },
  args: {
    initialValues: { fullName: '', email: '' },
    validationRules: {
      fullName: [{ required: true, message: 'El nombre es obligatorio' }],
      email: [
        { required: true, message: 'El correo es obligatorio' },
        { pattern: 'email', message: 'Correo inválido' },
      ],
    },
  },
  render: (args) => {
    const [status, setStatus] = useState<
      'idle' | 'loading' | 'success' | 'error'
    >('idle');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Form
          {...args}
          onSubmit={async (values) => {
            setStatus('loading');
            await new Promise((r) => setTimeout(r, 1500));
            console.log('Form values:', values);
            setStatus('success');
          }}
          onError={() => setStatus('error')}
          resetOnSuccess
        >
          <Field name="fullName" label="Nombre completo" required>
            <InputText placeholder="Ej. María García" />
          </Field>
          <Field name="email" label="Correo electrónico" required>
            <InputText type="email" placeholder="correo@ejemplo.com" />
          </Field>
          <div style={{ alignSelf: 'flex-start' }}>
            <Button type="submit" size="sm" loading={status === 'loading'} loadingText="Enviando…">
              Enviar
            </Button>
          </div>
        </Form>

        {status === 'success' && (
          <p style={{ color: '#16a34a', margin: 0 }}>
            ✓ Formulario enviado correctamente. Los campos se resetearon.
          </p>
        )}
        {status === 'error' && (
          <p style={{ color: '#dc2626', margin: 0 }}>
            ✗ Error al enviar. Intenta nuevamente.
          </p>
        )}
      </div>
    );
  },
};

/* ─── Inyección de error desde backend ─────────────────────────── */

export const BackendErrorInjection: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Simula un error de unicidad desde el backend. Cuando `onSubmit` detecta ' +
          'un campo en conflicto, llama `formApi.setError(field, message)` para ' +
          'inyectar el error directamente en el campo. Los errores globales burbujean ' +
          'hacia `onError`.',
      },
    },
  },
  args: {
    initialValues: { email: '' },
    validationRules: {
      email: [
        { required: true, message: 'El correo es obligatorio' },
        { pattern: 'email', message: 'Formato inválido' },
      ],
    },
  },
  render: (args) => (
    <Form
      {...args}
      onSubmit={async (_values, formApi) => {
        await new Promise((r) => setTimeout(r, 800));
        // Simula que el backend responde con un error de campo
        formApi.setError('email', 'Este correo ya está registrado en el sistema');
      }}
    >
      <Field name="email" label="Correo electrónico" required>
        <InputText
          type="email"
          placeholder="Ingresa cualquier correo y envía"
        />
      </Field>
      <p style={{ margin: 0, fontSize: '0.8rem', color: '#737373' }}>
        Enviar simula una respuesta del backend con error de campo.
      </p>
      <div style={{ alignSelf: 'flex-start' }}>
        <Button type="submit" size="sm">
          Registrar
        </Button>
      </div>
    </Form>
  ),
};

/* ─── Reset on success ──────────────────────────────────────────── */

export const ResetOnSuccess: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`resetOnSuccess={true}` restaura todos los campos a `initialValues` tras ' +
          'un submit exitoso. Ideal para formularios de alta repetida (ej. agregar ' +
          'múltiples registros en secuencia).',
      },
    },
  },
  args: {
    initialValues: { item: '', quantity: '' },
    validationRules: {
      item: [{ required: true, message: 'El artículo es obligatorio' }],
      quantity: [
        { required: true, message: 'La cantidad es obligatoria' },
        { min: 1, message: 'La cantidad mínima es 1' },
      ],
    },
    resetOnSuccess: true,
  },
  render: (args) => {
    const [log, setLog] = useState<string[]>([]);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Form
          {...args}
          onSubmit={async (values) => {
            await new Promise((r) => setTimeout(r, 400));
            setLog((prev) => [
              `${values.quantity}× ${values.item}`,
              ...prev,
            ]);
          }}
        >
          <FieldGroup columns={2}>
            <Field name="item" label="Artículo" required>
              <InputText placeholder="Nombre del artículo" />
            </Field>
            <Field name="quantity" label="Cantidad" required>
              <InputText type="number" placeholder="1" />
            </Field>
          </FieldGroup>
          <div style={{ alignSelf: 'flex-start' }}>
            <Button type="submit" size="sm">
              Agregar ítem
            </Button>
          </div>
        </Form>

        {log.length > 0 && (
          <div>
            <p style={{ margin: '0 0 8px', fontWeight: 600, fontSize: '0.85rem' }}>
              Ítems agregados:
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
              {log.map((entry, i) => (
                <li key={i} style={{ fontSize: '0.85rem' }}>
                  {entry}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  },
};

/* ─── Ejemplo completo: CreateUserForm (specs §9) ───────────────── */

export const CreateUserForm: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'El ejemplo completo de las especificaciones técnicas (§9). Muestra la ' +
          'composición canónica: `Form > FieldGroup > Field > InputText | Select`. ' +
          'Validación en blur, manejo de errores de campo desde backend, y navegación ' +
          'tras submit exitoso simulada con un alert.',
      },
    },
  },
  args: {
    initialValues: { fullName: '', email: '', role: null },
    validationRules: {
      fullName: [
        { required: true, message: 'El nombre es obligatorio' },
        { minLength: 2, message: 'Mínimo 2 caracteres' },
      ],
      email: [
        { required: true },
        { pattern: 'email', message: 'Ingresa un correo válido' },
      ],
      role: [{ required: true, message: 'Selecciona un rol' }],
    },
    validateOn: 'blur',
    resetOnSuccess: true,
  },
  render: (args) => (
    <Form
      {...args}
      onSubmit={async (values, formApi) => {
        await new Promise((r) => setTimeout(r, 1000));
        // Simula posible error de unicidad desde el backend
        if (values.email === 'admin@fragui.dev') {
          formApi.setError('email', 'Este correo ya está en uso');
          throw new Error('Email already exists');
        }
        alert(`Usuario creado:\n${JSON.stringify(values, null, 2)}`);
      }}
      onSuccess={() => {
        /* navigate('/users') en una app real */
      }}
      onError={(err) => alert(`Error: ${err.message}`)}
    >
      <FieldGroup title="Datos personales" columns={2} gap="md">
        <Field name="fullName" label="Nombre completo" required>
          <InputText
            placeholder="Ej. María García"
            autoComplete="name"
            clearable
          />
        </Field>
        <Field name="email" label="Correo electrónico" required>
          <InputText
            type="email"
            placeholder="correo@ejemplo.com"
            autoComplete="email"
          />
        </Field>
      </FieldGroup>

      <FieldGroup title="Permisos">
        <Field name="role" label="Rol del usuario" required>
          <Select
            options={roleOptions}
            searchable
            clearable
            placeholder="Selecciona un rol"
          />
        </Field>
      </FieldGroup>

      <p style={{ margin: 0, fontSize: '0.8rem', color: '#737373' }}>
        Prueba con <strong>admin@fragui.dev</strong> para ver el error de campo desde backend.
      </p>

      <div style={{ alignSelf: 'flex-start' }}>
        <Button type="submit" size="sm">
          Crear usuario
        </Button>
      </div>
    </Form>
  ),
};
