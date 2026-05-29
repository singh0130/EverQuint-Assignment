import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  id,
  className = '',
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`form-group-container ${className}`}>
      {label && (
        <label htmlFor={selectId} className="ds-label">
          {label}
        </label>
      )}
      <div className="ds-select-wrapper">
        <select
          id={selectId}
          className={`ds-select ${error ? 'ds-select-error' : ''}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error && <span className="ds-error-text">{error}</span>}
    </div>
  );
};
