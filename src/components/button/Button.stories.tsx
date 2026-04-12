import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from './Button';
import {
  BxsHome,
  BxsArchive,
  BxsCart,
  BxsPlusCircle,
} from '../../assets/icons';

const iconMap: Record<string, React.ReactNode> = {
  none: undefined,
  home: <BxsHome />,
  archive: <BxsArchive />,
  cart: <BxsCart />,
  plusCircle: <BxsPlusCircle />,
};

const iconOptions = Object.keys(iconMap);

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['contained', 'outlined', 'text'],
      description: 'Visual style variant',
    },
    color: {
      control: 'select',
      options: ['ink', 'sea', 'brick', 'ochre', 'pine', 'grape'],
      description: 'Color preset',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
    },
    radius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Border radius',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
    loadingText: {
      control: 'text',
      description: 'Text shown while loading',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Full width button',
    },
    effect: {
      control: 'select',
      options: ['none', 'press'],
      description: 'Click effect',
    },
    tooltip: {
      control: 'text',
      description: 'Tooltip text',
    },
    startIcon: {
      control: 'select',
      options: iconOptions,
      mapping: iconMap,
      description: 'Icon before text',
    },
    endIcon: {
      control: 'select',
      options: iconOptions,
      mapping: iconMap,
      description: 'Icon after text',
    },
  },
  args: {
    onClick: fn(),
    children: 'BUTTON',
    startIcon: 'none',
    endIcon: 'none',
    effect: 'press',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Contained: Story = {
  args: {
    variant: 'contained',
    color: 'ink',
    size: 'md',
    radius: 'none',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    color: 'ink',
    size: 'md',
    radius: 'none',
  },
};

export const Text: Story = {
  args: {
    variant: 'text',
    color: 'ink',
    size: 'md',
    radius: 'none',
  },
};
