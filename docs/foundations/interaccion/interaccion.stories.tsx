import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from '../../../src/components/alert';
import { Badge } from '../../../src/components/badge';
import { Button } from '../../../src/components/button';
import { colors } from '../../../src/theme/tokens/colors';
import { Icon } from '../iconografia/Icon';

const meta = {
  title: 'Foundations/Interacción/Ejemplos',
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

// ── Correctos ───────────────────────────────────────────────

export const FeedbackInmediato: StoryObj = {
  name: 'Feedback inmediato',
  tags: ['!dev'],
  render: () => (
    <div style={row}>
      <Button effect="press" size="sm">
        Press
      </Button>
      <Button effect="lift" size="sm" color="sea">
        Lift
      </Button>
      <Button effect="glow" size="sm" color="grape">
        Glow
      </Button>
    </div>
  ),
};

export const EstadosDiferenciados: StoryObj = {
  name: 'Estados diferenciados',
  tags: ['!dev'],
  render: () => (
    <div style={row}>
      <Button size="sm">Normal</Button>
      <Button size="sm" disabled>
        Disabled
      </Button>
      <Button size="sm" loading loadingText="Cargando…">
        Guardar
      </Button>
    </div>
  ),
};

export const TransicionConProposito: StoryObj = {
  name: 'Transición con propósito',
  tags: ['!dev'],
  render: () => (
    <Alert
      status="success"
      variant="filled"
      showIcon
      dismissible
      animation="fade"
      title="Cambios guardados"
      description="Se aplicaron correctamente."
    />
  ),
};

export const PausaEnInteraccion: StoryObj = {
  name: 'Pausa en interacción',
  tags: ['!dev'],
  render: () => (
    <Alert
      status="info"
      variant="outlined"
      showIcon
      dismissible
      autoHideDuration={5000}
      title="Este mensaje desaparece en 5 s"
      description="Pasa el cursor o pon el foco sobre la alerta para pausar el temporizador."
    />
  ),
};

export const AnimacionRespetuosa: StoryObj = {
  name: 'Animación respetuosa',
  tags: ['!dev'],
  render: () => (
    <div style={row}>
      <Badge mode="dot" pulse color="brick">
        <Button
          variant="outlined"
          size="sm"
          aria-label="Notificaciones, nuevas"
          startIcon={<Icon name="infoSquare" />}
        />
      </Badge>
    </div>
  ),
};

// ── Incorrectos ─────────────────────────────────────────────

export const SinFeedback: StoryObj = {
  name: 'Sin feedback',
  tags: ['!dev'],
  render: () => (
    <div style={row}>
      <Button effect="none" size="sm">
        Sin efecto
      </Button>
      <Button effect="none" size="sm" variant="outlined" color="sea">
        Sin efecto
      </Button>
    </div>
  ),
};

export const CargaSinIndicador: StoryObj = {
  name: 'Carga sin indicador',
  tags: ['!dev'],
  render: () => (
    <div style={row}>
      <Button size="sm" disabled>
        Guardar
      </Button>
      <span style={{ color: colors.neutral[400], fontSize: '0.85rem' }}>
        El botón está inactivo pero no comunica que algo está en progreso.
      </span>
    </div>
  ),
};

export const DesaparicionSinControl: StoryObj = {
  name: 'Desaparición sin control',
  tags: ['!dev'],
  render: () => (
    <Alert
      status="info"
      variant="stripe"
      showIcon
      title="Este mensaje desaparece en 3 s"
      description="No hay forma de pausar ni cerrar manualmente."
      autoHideDuration={3000}
    />
  ),
};

export const AnimacionExcesiva: StoryObj = {
  name: 'Animación excesiva',
  tags: ['!dev'],
  render: () => (
    <div style={row}>
      <Badge mode="dot" pulse color="brick">
        <Badge mode="dot" pulse color="ochre" anchor="top-left">
          <Badge mode="dot" pulse color="pine" anchor="bottom-right">
            <Button variant="outlined" size="sm">
              Cuenta
            </Button>
          </Badge>
        </Badge>
      </Badge>
    </div>
  ),
};
