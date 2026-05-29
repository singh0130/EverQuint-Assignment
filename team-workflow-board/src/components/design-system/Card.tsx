import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false
}) => {
  const baseClass = 'card-ds';
  const interactiveClass = onClick || hoverable ? 'card-ds-interactive' : '';

  return (
    <div
      className={`${baseClass} ${interactiveClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
