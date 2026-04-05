import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from './Button';

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
    fullWidth: {
      control: 'boolean',
      description: 'Full width button',
    },
    effect: {
      control: 'select',
      options: ['none', 'ripple', 'scale'],
      description: 'Click effect',
    },
  },
  args: {
    onClick: fn(),
    children: 'BUTTON',
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
