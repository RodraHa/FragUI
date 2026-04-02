import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap: Record<string, React.CSSProperties> = {
  sm: { padding: '4px 12px', fontSize: '12px' },
  md: { padding: '8px 16px', fontSize: '14px' },
  lg: { padding: '12px 24px', fontSize: '16px' },
};

const variantMap: Record<string, React.CSSProperties> = {
  primary: {
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    border: 'none',
  },
  secondary: {
    backgroundColor: '#6b7280',
    color: '#ffffff',
    border: 'none',
  },
  outline: {
    backgroundColor: 'transparent',
    color: '#4f46e5',
    border: '2px solid #4f46e5',
  },
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  style,
  ...props
}) => {
  const baseStyle: React.CSSProperties = {
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 600,
    lineHeight: 1.5,
    transition: 'opacity 0.2s',
    ...variantMap[variant],
    ...sizeMap[size],
    ...style,
  };

  return (
    <button style={baseStyle} {...props}>
      {children}
    </button>
  );
};
