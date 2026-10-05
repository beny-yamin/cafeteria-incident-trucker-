import React from 'react';
import Card from './Card';
import { Inbox } from 'lucide-react';

export const EmptyState = ({
  icon = <Inbox size={38} color="var(--primary)" />,
  title = 'No items found',
  description = 'There are no records matching your current selection.',
  action = null,
  className = '',
  style = {}
}) => {
  return (
    <Card
      className={className}
      style={{
        padding: '3.5rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed',
        ...style
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
        }}
      >
        {icon}
      </div>

      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
        {title}
      </h4>

      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '420px', lineHeight: 1.5, marginBottom: action ? '1.5rem' : 0 }}>
        {description}
      </p>

      {action && <div>{action}</div>}
    </Card>
  );
};

export default EmptyState;
