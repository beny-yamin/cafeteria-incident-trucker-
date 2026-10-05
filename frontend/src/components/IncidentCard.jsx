import React from 'react';
import StatusBadge from './StatusBadge';
import SeverityBadge from './SeverityBadge';
import { Clock, MapPin, AlertCircle, FileText, CheckCircle2, User, ChevronRight } from 'lucide-react';

export const IncidentCard = ({ incident, onAction, userRole = 'student' }) => {
  const hallName = incident.hallId?.name || 'Unknown Dining Hall';
  const campus = incident.hallId?.campus || 'Campus';
  const formattedDate = new Date(incident.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <MapPin size={15} color="var(--primary)" />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {hallName}
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• {campus}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{incident.mealType}</span>
            <span>•</span>
            <span>{incident.category}</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock size={12} /> {formattedDate}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <SeverityBadge severity={incident.severity} />
          <StatusBadge status={incident.status} />
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        {incident.description}
      </p>

      {/* Image Preview if provided */}
      {incident.imageUrl && (
        <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', maxHeight: '180px', width: 'fit-content' }}>
          <img
            src={incident.imageUrl}
            alt="Incident evidence"
            style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}

      {/* Inspector Note & Audit section */}
      {incident.inspectorNote && (
        <div
          style={{
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#60a5fa', fontWeight: 700 }}>
            <FileText size={14} /> INSPECTOR AUDIT FINDINGS:
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontStyle: 'italic' }}>
            "{incident.inspectorNote}"
          </p>
          {incident.assignedInspectorId && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Assigned: {incident.assignedInspectorId.fullName || 'Inspector'}
            </div>
          )}
        </div>
      )}

      {/* Action footer for inspector or admin triage */}
      {onAction && (userRole === 'inspector' || userRole === 'admin') && incident.status !== 'ACTION_TAKEN' && incident.status !== 'DISMISSED' && (
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '0.85rem',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.5rem',
            marginTop: 'auto'
          }}
        >
          {incident.status === 'SUBMITTED' && (
            <button
              onClick={() => onAction('claim', incident)}
              className="btn btn-primary btn-sm"
            >
              Claim for Review <ChevronRight size={14} />
            </button>
          )}

          {incident.status === 'UNDER_REVIEW' && (
            <>
              <button
                onClick={() => onAction('dismiss', incident)}
                className="btn btn-secondary btn-sm"
              >
                Dismiss Report
              </button>
              <button
                onClick={() => onAction('resolve', incident)}
                className="btn btn-success btn-sm"
              >
                <CheckCircle2 size={14} /> Record Action Taken
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default IncidentCard;
