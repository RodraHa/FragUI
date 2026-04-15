import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './Alert';
import { fontFamily } from '../../theme/tokens/typography';
import {
  BxsHome,
  BxsArchive,
  BxsCart,
  BxsPlusCircle,
  BxsCheckSquare,
  BxsInfoSquare,
  BxsXSquare,
  WarningFilled,
} from '../../assets/icons';

const iconMap: Record<string, React.ReactNode> = {
  none: undefined,
  home: <BxsHome />,
  archive: <BxsArchive />,
  cart: <BxsCart />,
  plusCircle: <BxsPlusCircle />,
  checkSquare: <BxsCheckSquare />,
  infoSquare: <BxsInfoSquare />,
  xSquare: <BxsXSquare />,
  warning: <WarningFilled />,
};

const iconOptions = Object.keys(iconMap);

const meta = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Mensajes breves para informar al usuario sin interrumpir el flujo. ' +
          'Soporta cuatro variantes visuales (filled, outlined, stripe, banner), ' +
          'cuatro estados semanticos, icono personalizable, accion opcional, ' +
          'cierre manual y auto-hide con pausa por hover/focus.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          fontFamily: fontFamily.satoshi,
        }}
      >
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['success', 'info', 'warning', 'error'],
      description:
        'Significado semantico y prioridad de anuncio para lectores de pantalla.',
      table: { category: 'Semantica', defaultValue: { summary: 'info' } },
    },
    variant: {
      control: 'select',
      options: ['filled', 'outlined', 'stripe', 'banner'],
      description: 'Estilo visual de la alerta.',
      table: { category: 'Apariencia', defaultValue: { summary: 'filled' } },
    },
    showIcon: {
      control: 'boolean',
      description: 'Muestra el icono por defecto asociado al status.',
      table: { category: 'Contenido', defaultValue: { summary: 'false' } },
    },
    title: {
      control: 'text',
      description: 'Encabezado breve de la alerta.',
      table: { category: 'Contenido' },
    },
    description: {
      control: 'text',
      description: 'Descripcion o detalle de la alerta.',
      table: { category: 'Contenido' },
    },
    dismissible: {
      control: 'boolean',
      description: 'Renderiza un boton de cierre manual.',
      table: { category: 'Comportamiento', defaultValue: { summary: 'false' } },
    },
    autoHideDuration: {
      control: 'number',
      description:
        'Tiempo (ms) tras el cual la alerta se oculta automaticamente. ' +
        'Se ignora para status "error" y "warning".',
      table: { category: 'Comportamiento' },
    },
    autoFocus: {
      control: 'boolean',
      description: 'Mueve el foco al contenedor de la alerta al montarse.',
      table: {
        category: 'Accesibilidad',
        defaultValue: { summary: 'false' },
      },
    },
    animation: {
      control: 'select',
      options: ['none', 'fade', 'slide'],
      description: 'Animacion de entrada al montar la alerta.',
      table: { category: 'Apariencia', defaultValue: { summary: 'none' } },
    },
    action: {
      control: 'object',
      description:
        'Accion opcional que renderiza un boton tamano "sm". ' +
        'Recibe un objeto con "label" (texto) y "onClick" (handler). ' +
        'Alert aplica el estilo correcto segun variant y status.',
      table: { category: 'Contenido' },
    },
    icon: {
      control: 'select',
      options: iconOptions,
      mapping: iconMap,
      description:
        'Icono personalizado que reemplaza el icono por defecto del status cuando showIcon esta activo.',
      table: { category: 'Contenido', defaultValue: { summary: 'none' } },
    },
    onClose: { table: { disable: true } },
  },
  args: {
    icon: 'none',
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Galeria por variante ─────────────────────────────────────

export const Filled: Story = {
  args: {
    variant: 'filled',
    status: 'info',
    showIcon: true,
    dismissible: true,
    title: 'High Resource Usage',
    description: 'Memory consumption is nearing capacity limits.',
    action: { label: 'Review' },
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    status: 'info',
    showIcon: true,
    dismissible: true,
    title: 'New update available',
    description:
      "We've added some cool new features to your dashboard. Take a look!",
    action: { label: 'Learn more' },
  },
};

export const Stripe: Story = {
  args: {
    variant: 'stripe',
    status: 'info',
    showIcon: true,
    dismissible: true,
    title: 'New update available',
    description:
      "We've added some cool new features to your dashboard. Take a look!",
    action: { label: 'Learn more' },
  },
};

export const Banner: Story = {
  args: {
    variant: 'banner',
    status: 'info',
    showIcon: true,
    dismissible: true,
    title: 'New update available',
    description:
      "We've added some cool new features to your dashboard. Take a look!",
    action: { label: 'Learn more' },
  },
};

// ─── Galeria por status ───────────────────────────────────────

export const Success: Story = {
  args: {
    status: 'success',
    variant: 'filled',
    showIcon: true,
    dismissible: true,
    title: 'Changes saved!',
    description:
      'Your profile has been updated successfully. Everything looks good.',
    action: { label: 'Dismiss' },
  },
};

export const Warning: Story = {
  args: {
    status: 'warning',
    variant: 'filled',
    showIcon: true,
    dismissible: true,
    title: 'High Resource Usage',
    description: 'Memory consumption is nearing capacity limits.',
    action: { label: 'Review' },
  },
};

export const Error: Story = {
  args: {
    status: 'error',
    variant: 'filled',
    showIcon: true,
    dismissible: true,
    title: 'Unable to connect',
    description:
      "We're having trouble reaching the server. Please check your connection.",
    action: { label: 'Retry' },
  },
};

// ─── Escenarios especificos ──────────────────────────────────

export const WithIconOnly: Story = {
  name: 'Only icon (no action, no dismiss)',
  args: {
    status: 'warning',
    variant: 'outlined',
    showIcon: true,
    title: 'High Resource Usage',
    description: 'Memory consumption is nearing capacity limits.',
  },
};

export const DismissibleOnly: Story = {
  args: {
    variant: 'filled',
    status: 'info',
    dismissible: true,
    title: 'High Resource Usage',
    description: 'Memory consumption is nearing capacity limits.',
  },
};

export const WithAction: Story = {
  args: {
    variant: 'outlined',
    status: 'info',
    title: 'High Resource Usage',
    description: 'Memory consumption is nearing capacity limits.',
    action: { label: 'Review' },
  },
};

export const FadeAnimation: Story = {
  args: {
    variant: 'filled',
    status: 'info',
    showIcon: true,
    title: 'Fade in',
    description: 'This alert fades in on mount.',
    animation: 'fade',
  },
};

export const SlideAnimation: Story = {
  args: {
    variant: 'filled',
    status: 'info',
    showIcon: true,
    title: 'Slide in',
    description: 'This alert slides in on mount.',
    animation: 'slide',
  },
};
