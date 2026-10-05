import React from 'react';

export const Select = ({
  label,
  id,
  options = [],
  children,
  error,
  helperText,
  required = false,
  className = '',
  containerStyle = {},
  style = {},
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`form-group ${className}`} style={{ ...containerStyle }}>
      {label && (
        <label htmlFor={selectId} className="form-label">
          {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}

      <select
        id={selectId}
        className="form-select"
        style={{
          borderColor: error ? 'var(--danger)' : undefined,
          ...style
        }}
        {...props}
      >
        {options.length > 0
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label || opt.value}
              </option>
            ))
          : children}
      </select>

      {error ? (
        <span style={{ fontSize: '0.8rem', color: 'var(--danger)', marginTop: '0.25rem' }}>
          {error}
        </span>
      ) : helperText ? (
        <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
};

export default Select;
