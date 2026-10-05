import React from 'react';
import Card from './Card';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  color = 'var(--primary)',
  trend = null,
  className = '',
  style = {}
}) => {
  return (
    <Card
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          {title}
        </span>
        {icon && (
          <div
            style={{
              padding: '0.45rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: `rgba(255, 255, 255, 0.04)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color
            }}
          >
            {icon}
          </div>
        )}
      </div>

      <div>
        <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1 }}>
          {value}
        </div>
        {(subtitle || trend) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.45rem', fontSize: '0.8rem' }}>
            {trend && <span style={{ color, fontWeight: 700 }}>{trend}</span>}
            {subtitle && <span style={{ color: 'var(--text-secondary)' }}>{subtitle}</span>}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
