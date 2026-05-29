import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  multiline?: boolean;
  rows?: number;
  icon?: React.ReactNode;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  multiline = false,
  rows = 3,
  icon,
  id,
  className = '',
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`form-group-container ${className}`}>
      {label && (
        <label htmlFor={inputId} className="ds-label">
          {label}
        </label>
      )}
      <div className="ds-input-wrapper">
        {icon && <span className="ds-input-icon">{icon}</span>}
        {multiline ? (
          <textarea
            id={inputId}
            rows={rows}
            className={`ds-input ds-textarea ${icon ? 'ds-input-has-icon' : ''} ${error ? 'ds-input-error' : ''}`}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            id={inputId}
            type={props.type || 'text'}
            className={`ds-input ${icon ? 'ds-input-has-icon' : ''} ${error ? 'ds-input-error' : ''}`}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
      </div>
      {error && <span className="ds-error-text">{error}</span>}
    </div>
  );
};
