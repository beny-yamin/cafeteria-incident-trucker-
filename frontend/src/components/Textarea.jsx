import React from 'react';

export const Textarea = ({
  label,
  id,
  error,
  helperText,
  required = false,
  rows = 4,
  maxLength,
  value = '',
  className = '',
  containerStyle = {},
  style = {},
  ...props
}) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`form-group ${className}`} style={{ ...containerStyle }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label htmlFor={textareaId} className="form-label">
            {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
          </label>
          {maxLength && (
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              {value.length} / {maxLength}
            </span>
          )}
        </div>
      )}

      <textarea
        id={textareaId}
        rows={rows}
        maxLength={maxLength}
        value={value}
        className="form-textarea"
        style={{
          borderColor: error ? 'var(--danger)' : undefined,
          ...style
        }}
        {...props}
      />

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

export default Textarea;
