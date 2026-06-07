# FragUI

Biblioteca de componentes React con TypeScript. Incluye controles de formulario con validación integrada, componentes de visualización de datos y primitivos de UI.

## Instalación

```bash
npm install fragui
```

Requiere las siguientes dependencias en tu proyecto:

```bash
npm install react react-dom @floating-ui/react
```

`react >=18`, `react-dom >=18`, `@floating-ui/react >=0.27`

---

## Componentes disponibles

| Componente | Descripción |
|---|---|
| `Button` | Botón con variantes, colores, estados loading/disabled y efectos visuales |
| `Badge` | Indicador numérico, de punto o de etiqueta — puede anclar sobre otro elemento |
| `Alert` | Mensaje de estado (success / info / warning / error) con icono, acción y auto-cierre |
| `Card` | Tarjeta composable con subcomponentes Media, Body, Eyebrow, Title, Description, Actions |
| `Tabs` | Pestañas horizontales o verticales con activación automática o manual |
| `DataList` | Lista de ítems seleccionable con estado loading, vacío personalizable y variantes |
| `InputText` | Campo de texto controlado o no controlado con clear, tipos de input y estados de validación |
| `Select` | Selector con búsqueda, grupos, opciones deshabilitadas y posicionamiento flotante |
| `Field` | Wrapper que vincula label, helper text y error a su control hijo |
| `FieldGroup` | Agrupa campos relacionados con título y opción de colapsar |
| `Form` | Contenedor de estado, validación y envío — conecta automáticamente todos los campos hijos |

Todos los tipos están incluidos. No se necesita `@types/fragui`.

---

## Uso básico

```tsx
import { Button, Badge, Alert } from 'fragui';

// Botón
<Button variant="contained" color="sea">Guardar</Button>

// Badge numérico sobre un botón
<Badge value={3} color="brick">
  <Button variant="outlined">Mensajes</Button>
</Badge>

// Alerta con icono
<Alert status="success" showIcon description="Cambios guardados correctamente." />
```

---

## Sistema de formularios

`Form`, `FieldGroup`, `Field`, `InputText` y `Select` forman un sistema integrado: la validación, los errores, el estado disabled y el focus-on-error se propagan automáticamente por contexto sin necesidad de prop drilling.

### Ejemplo completo

```tsx
import { Form, FieldGroup, Field, InputText, Select, Button } from 'fragui';

const roles = [
  { value: 'admin',  label: 'Administrador' },
  { value: 'editor', label: 'Editor' },
];

<Form
  initialValues={{ nombre: '', email: '', rol: '' }}
  validationRules={{
    nombre: [{ required: true, message: 'El nombre es obligatorio' }],
    email: [
      { required: true },
      { pattern: 'email', message: 'Introduce un email válido' },
    ],
    rol: [{ required: true, message: 'Selecciona un rol' }],
  }}
  validateOn="blur"
  onSubmit={async (values, api) => {
    await guardarUsuario(values);
  }}
  onSuccess={() => console.log('¡Enviado!')}
>
  <FieldGroup title="Datos del usuario">
    <Field name="nombre" label="Nombre completo" required>
      <InputText placeholder="Ej. Ana García" clearable />
    </Field>
    <Field name="email" label="Correo electrónico" required>
      <InputText type="email" placeholder="usuario@ejemplo.com" />
    </Field>
    <Field name="rol" label="Rol">
      <Select options={roles} placeholder="Selecciona…" />
    </Field>
  </FieldGroup>

  <Button type="submit" variant="contained" color="ink">Guardar</Button>
  <Button type="reset"  variant="outlined"  color="ink">Cancelar</Button>
</Form>
```

### Cómo funciona la validación

- `validationRules` en `Form` — define las reglas por nombre de campo.
- `validateOn` — cuándo se evalúa: `"blur"` (al salir del campo), `"change"` (en tiempo real) o `"submit"` (solo al enviar).
- Los errores se muestran automáticamente en el `Field` correspondiente.
- Si el envío falla validación, el foco salta al primer campo con error.

### Reglas disponibles

```ts
{ required: true,  message?: string }
{ minLength: 3,    message?: string }
{ maxLength: 100,  message?: string }
{ min: 0,          message?: string }   // numérico
{ max: 999,        message?: string }   // numérico
{ pattern: 'email' | 'url' | 'tel' | RegExp, message?: string }
{ validate: (value) => string | null | Promise<string | null> }
```

### Acceso al estado del formulario desde fuera del árbol

```tsx
import { useForm } from 'fragui';

// Requiere id en el Form
const api = useForm('mi-formulario');
// api.values, api.errors, api.isDirty, api.isValid, api.isSubmitting
// api.setValue(name, value), api.setError(name, msg), api.reset(), api.submit()
```

### Acceso vía ref

```tsx
import { useRef } from 'react';
import type { FormApi } from 'fragui';

const formRef = useRef<FormApi>(null);

<Form ref={formRef} onSubmit={...}>...</Form>

// Desde fuera:
formRef.current?.submit();
formRef.current?.reset();
```

---

## Card composable

```tsx
import { Card } from 'fragui';

<Card variant="outlined">
  <Card.Media src="/imagen.jpg" alt="Portada" />
  <Card.Body>
    <Card.Eyebrow>Categoría</Card.Eyebrow>
    <Card.Title>Título de la tarjeta</Card.Title>
    <Card.Description>Descripción breve del contenido.</Card.Description>
    <Card.Actions>
      <Button size="sm" variant="outlined">Ver más</Button>
    </Card.Actions>
  </Card.Body>
</Card>

// Interactiva (se comporta como botón o enlace)
<Card interactive onClick={() => navigate('/detalle')}>...</Card>
<Card interactive as="a" href="/detalle">...</Card>
```

---

## Tabs

```tsx
import { Tabs } from 'fragui';

const tabs = [
  { id: 'overview', label: 'Resumen',  content: <Resumen /> },
  { id: 'details',  label: 'Detalles', content: <Detalles /> },
];

<Tabs tabs={tabs} defaultValue="overview" />
```

---

## DataList

```tsx
import { DataList } from 'fragui';

const items = [
  { id: '1', label: 'Ana García',  description: 'admin@ejemplo.com' },
  { id: '2', label: 'Carlos Ruiz', description: 'dev@ejemplo.com', disabled: true },
];

<DataList
  items={items}
  selectable
  defaultSelectedKeys={['1']}
  onSelectionChange={(keys) => console.log(keys)}
/>
```
