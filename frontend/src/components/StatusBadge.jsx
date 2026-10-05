import React from 'react';
import { INCIDENT_STATUSES } from '../utils/constants';

export const StatusBadge = ({ status }) => {
  const config = INCIDENT_STATUSES[status] || {
    label: status || 'Unknown',
    color: '#9ca3af',
    bg: 'rgba(156, 163, 175, 0.15)',
    border: 'rgba(156, 163, 175, 0.3)'
  };

  return (
    <span
      className="badge"
      style={{
        color: config.color,
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: config.color,
          display: 'inline-block'
        }}
      />
      {config.label}
    </span>
  );
};

export default StatusBadge;
