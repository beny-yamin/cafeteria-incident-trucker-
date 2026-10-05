import React from 'react';

export const Input = ({
  label,
  id,
  error,
  helperText,
  required = false,
  leftIcon = null,
  rightIcon = null,
  className = '',
  containerStyle = {},
  style = {},
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`form-group ${className}`} style={{ ...containerStyle }}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {leftIcon && (
          <span
            style={{
              position: 'absolute',
              left: '0.85rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none'
            }}
          >
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          className="form-input"
          style={{
            paddingLeft: leftIcon ? '2.5rem' : '0.9rem',
            paddingRight: rightIcon ? '2.5rem' : '0.9rem',
            borderColor: error ? 'var(--danger)' : undefined,
            ...style
          }}
          {...props}
        />

        {rightIcon && (
          <span
            style={{
              position: 'absolute',
              right: '0.85rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {rightIcon}
          </span>
        )}
      </div>

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

export default Input;
