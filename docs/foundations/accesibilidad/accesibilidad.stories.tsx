import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from '../../../src/components/alert';
import { Badge } from '../../../src/components/badge';
import { Button } from '../../../src/components/button';
import { colors } from '../../../src/theme/tokens/colors';
import { Icon } from '../iconografia/Icon';

const meta = {
  title: 'Foundations/Accesibilidad/Ejemplos',
  parameters: {
    layout: 'centered',
    a11y: { disable: true },
    test: { skip: true },
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['!dev'],
} satisfies Meta;

export default meta;

// ── Helpers ──────────────────────────────────────────────────

const row: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap',
};

const fauxButton: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  minHeight: '40px',
  padding: '0 16px',
  border: `1px solid ${colors.neutral[200]}`,
  backgroundColor: colors.neutral[100],
  color: colors.neutral[500],
  fontWeight: 700,
  cursor: 'pointer',
};

const fauxClose: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  color: colors.neutral[400],
  fontSize: '18px',
};

// ── Correctos ───────────────────────────────────────────────

export const SemanticaNativa: StoryObj = {
  name: 'Semántica nativa',
  tags: ['!dev'],
  render: () => (
    <div style={row}>
      <Button size="sm">Guardar</Button>
      <Button variant="outlined" size="sm" startIcon={<Icon name="archive" />}>
        Archivar
      </Button>
    </div>
  ),
};

export const NombreAccesibleIcono: StoryObj = {
  name: 'Nombre accesible en control icónico',
  tags: ['!dev'],
  render: () => (
    <div style={row}>
      <Button aria-label="Home" startIcon={<Icon name="home" />} />
      <Badge mode="numeric" value={5}>
        <Button
          aria-label="Notificaciones, 5 nuevas"
          startIcon={<Icon name="infoSquare" />}
        />
      </Badge>
    </div>
  ),
};

export const AnuncioAdecuado: StoryObj = {
  name: 'Anuncio con prioridad adecuada',
  tags: ['!dev'],
  render: () => (
    <Alert
      status="error"
      variant="filled"
      showIcon
      dismissible
      title="No se pudo guardar"
      description="Revisa tu conexión e intenta de nuevo."
    />
  ),
};

export const CierreAccesible: StoryObj = {
  name: 'Cierre accesible',
  tags: ['!dev'],
  render: () => (
    <Alert
      status="success"
      variant="outlined"
      showIcon
      dismissible
      title="Cambios guardados"
    />
  ),
};

export const EstadoCarga: StoryObj = {
  name: 'Estado de carga',
  tags: ['!dev'],
  render: () => (
    <div style={row}>
      <Button loading loadingText="Guardando…" size="sm">
        Guardar
      </Button>
      <Button loading size="sm">
        Agregar
      </Button>
    </div>
  ),
};

// ── Incorrectos ─────────────────────────────────────────────

export const SinSemantica: StoryObj = {
  name: 'Sin semántica nativa',
  tags: ['!dev'],
  render: () => (
    <div style={row}>
      <span style={fauxButton}>Guardar</span>
      <span style={fauxButton}>
        <Icon name="archive" size={16} />
        Archivar
      </span>
    </div>
  ),
};

export const SinNombreAccesible: StoryObj = {
  name: 'Sin nombre accesible',
  tags: ['!dev'],
  render: () => (
    <div style={row}>
      <Button startIcon={<Icon name="home" />} />
      <Badge mode="dot">
        <Button startIcon={<Icon name="infoSquare" />} />
      </Badge>
    </div>
  ),
};

export const CierreSinEtiqueta: StoryObj = {
  name: 'Cierre sin etiqueta',
  tags: ['!dev'],
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        padding: '12px 16px',
        border: `1px solid ${colors.orange[300]}`,
        backgroundColor: colors.orange[100],
        color: colors.neutral[500],
      }}
    >
      <span style={{ flex: 1 }}>
        <strong>Revisa los campos obligatorios</strong>
      </span>
      <span style={fauxClose} role="button">×</span>
    </div>
  ),
};

export const EstadoSoloColor: StoryObj = {
  name: 'Estado solo por color',
  tags: ['!dev'],
  render: () => (
    <div style={row}>
      <Badge mode="dot">
        <Button variant="outlined" size="sm">Cuenta</Button>
      </Badge>
      <Badge mode="dot" color="pine">
        <Button variant="outlined" size="sm">Perfil</Button>
      </Badge>
    </div>
  ),
};