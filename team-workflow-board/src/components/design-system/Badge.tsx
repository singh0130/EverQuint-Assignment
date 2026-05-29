import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
  onClick?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  onClick
}) => {
  const baseClass = 'badge';
  const variantClass = `badge-${variant}`;
  const sizeClass = `badge-${size}`;
  const interactiveClass = onClick ? 'badge-interactive' : '';

  return (
    <span
      className={`${baseClass} ${variantClass} ${sizeClass} ${interactiveClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </span>
  );
};
