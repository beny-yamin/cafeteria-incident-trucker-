import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const Alert = ({
  variant = 'info',
  title,
  children,
  onClose,
  className = '',
  style = {}
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          bg: 'rgba(16, 185, 129, 0.12)',
          border: 'rgba(16, 185, 129, 0.3)',
          color: '#34d399',
          icon: <CheckCircle2 size={18} color="#34d399" />
        };
      case 'warning':
        return {
          bg: 'rgba(245, 158, 11, 0.12)',
          border: 'rgba(245, 158, 11, 0.3)',
          color: '#fbbf24',
          icon: <AlertTriangle size={18} color="#fbbf24" />
        };
      case 'danger':
        return {
          bg: 'rgba(239, 68, 68, 0.14)',
          border: 'rgba(239, 68, 68, 0.35)',
          color: '#f87171',
          icon: <AlertCircle size={18} color="#f87171" />
        };
      case 'info':
      default:
        return {
          bg: 'rgba(59, 130, 246, 0.12)',
          border: 'rgba(59, 130, 246, 0.3)',
          color: '#60a5fa',
          icon: <Info size={18} color="#60a5fa" />
        };
    }
  };

  const current = getVariantStyles();

  return (
    <div
      className={`animate-fade-in ${className}`}
      style={{
        padding: '0.85rem 1.15rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: current.bg,
        border: `1px solid ${current.border}`,
        color: 'var(--text-main)',
        fontSize: '0.875rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        ...style
      }}
    >
      <div style={{ flexShrink: 0, marginTop: '1px' }}>{current.icon}</div>

      <div style={{ flex: 1 }}>
        {title && (
          <h5 style={{ fontWeight: 700, color: current.color, marginBottom: '0.2rem', fontSize: '0.9rem' }}>
            {title}
          </h5>
        )}
        <div style={{ color: 'var(--text-main)', lineHeight: 1.45 }}>{children}</div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;
