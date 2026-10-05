import React from 'react';

export const Card = ({ children, className = '', style = {}, onClick, ...props }) => {
  return (
    <div
      className={`glass-panel ${className}`}
      style={{
        padding: '1.5rem',
        ...style
      }}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', style = {}, ...props }) => {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1rem',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = '', style = {}, ...props }) => {
  return (
    <h3
      className={className}
      style={{
        fontSize: '1.2rem',
        fontWeight: 700,
        color: 'var(--text-main)',
        letterSpacing: '-0.015em',
        ...style
      }}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription = ({ children, className = '', style = {}, ...props }) => {
  return (
    <p
      className={className}
      style={{
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        marginTop: '0.25rem',
        lineHeight: 1.5,
        ...style
      }}
      {...props}
    >
      {children}
    </p>
  );
};

export const CardContent = ({ children, className = '', style = {}, ...props }) => {
  return (
    <div className={className} style={{ ...style }} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '', style = {}, ...props }) => {
  return (
    <div
      className={className}
      style={{
        marginTop: '1.25rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '0.75rem',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
