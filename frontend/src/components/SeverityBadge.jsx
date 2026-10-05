import React from 'react';
import { INCIDENT_SEVERITIES } from '../utils/constants';

export const SeverityBadge = ({ severity }) => {
  const config = INCIDENT_SEVERITIES[severity] || {
    label: severity || 'Low',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.25)'
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
      {config.label}
    </span>
  );
};

export default SeverityBadge;
