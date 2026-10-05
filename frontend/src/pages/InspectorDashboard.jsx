import React, { useState } from 'react';
import {
  DashboardLayout,
  Tabs,
  Button,
  Textarea,
  Modal,
  Alert,
  EmptyState,
  IncidentCard
} from '../components';
import {
  ClipboardCheck,
  CheckCircle2,
  Building2
} from 'lucide-react';

export const InspectorDashboard = ({
  incidents = [],
  halls = [],
  inspector = null,
  onClaimReport,
  onResolveReport,
  onDismissReport,
  isLoading = false,
  error = null
}) => {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [activeModal, setActiveModal] = useState(null); // { type: 'resolve' | 'dismiss', incident: obj }
  const [noteInput, setNoteInput] = useState('');
  const [noteError, setNoteError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Inspector identity
  const currentInspector = inspector || {
    fullName: 'Sarah Chen (Senior Inspector)',
    badgeNumber: 'QC-8821',
    assignedHalls: []
  };

  // Safe hall extraction (handling populated objects or raw ID strings)
  const assignedHallIds = (currentInspector.assignedHalls || []).map((h) =>
    h._id ? h._id.toString() : h.toString()
  );

  const assignedHalls = halls.filter((h) =>
    assignedHallIds.includes(h._id.toString())
  );

  // Backend automatically partitions incidents for inspectors; we can also apply local status filtering
  const queueIncidents = incidents.filter((inc) => {
    if (filterStatus === 'ALL') return true;
    return inc.status === filterStatus;
  });

  const handleActionClick = async (actionType, incident) => {
    if (actionType === 'claim') {
      try {
        await onClaimReport(incident._id);
      } catch (err) {
        alert(err.message || 'Failed to claim incident');
      }
    } else {
      setActiveModal({ type: actionType, incident });
      setNoteInput('');
      setNoteError('');
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!noteInput.trim()) {
      setNoteError('Mandatory note: You must document audit findings and action taken.');
      return;
    }

    setIsProcessing(true);
    try {
      if (activeModal.type === 'resolve') {
        await onResolveReport(activeModal.incident._id, noteInput.trim());
      } else {
        await onDismissReport(activeModal.incident._id, noteInput.trim());
      }
      setActiveModal(null);
    } catch (err) {
      setNoteError(err.message || 'Operation failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const filterTabs = [
    { id: 'ALL', label: 'All Assigned', badge: queueIncidents.length },
    { id: 'SUBMITTED', label: 'Submitted' },
    { id: 'UNDER_REVIEW', label: 'Under Review' },
    { id: 'ACTION_TAKEN', label: 'Action Taken' },
    { id: 'DISMISSED', label: 'Dismissed' }
  ];

  return (
    <DashboardLayout
      title="Field Triage & Incident Audit Queue"
      subtitle={`Auditing as ${currentInspector.fullName} (${currentInspector.badgeNumber || 'Certified'}). Showing incidents strictly partitioned to your assigned facilities.`}
      actions={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Building2 size={14} /> Assigned:
          </span>
          {assignedHalls.length === 0 ? (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              No facilities assigned yet
            </span>
          ) : (
            assignedHalls.map((hall) => (
              <span
                key={hall._id}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.3rem 0.65rem',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  color: '#60a5fa',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }}
              >
                {hall.name}
              </span>
            ))
          )}
        </div>
      }
    >
      {error && (
        <Alert variant="danger" title="Error" style={{ marginBottom: '1.5rem' }}>
          {error}
        </Alert>
      )}

      {/* Filter Tabs Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <Tabs tabs={filterTabs} activeTab={filterStatus} onChange={setFilterStatus} />

        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Showing {queueIncidents.length} {queueIncidents.length === 1 ? 'incident' : 'incidents'}
        </span>
      </div>

      {/* Incident Queue */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {queueIncidents.length === 0 ? (
          <EmptyState
            icon={<CheckCircle2 size={38} color="var(--accent)" />}
            title="Triage queue is clear"
            description={`No incidents found under status '${filterStatus}' for your assigned dining facilities.`}
          />
        ) : (
          queueIncidents.map((incident) => (
            <IncidentCard
              key={incident._id}
              incident={incident}
              onAction={handleActionClick}
              userRole="inspector"
            />
          ))
        )}
      </div>

      {/* Inspector Findings / Resolution Modal */}
      <Modal
        isOpen={Boolean(activeModal)}
        onClose={() => !isProcessing && setActiveModal(null)}
        title={
          activeModal?.type === 'resolve'
            ? 'Verify Corrective Action Taken'
            : 'Dismiss Incident Report'
        }
      >
        <form onSubmit={handleModalSubmit}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
            {activeModal?.type === 'resolve'
              ? 'Document on-site kitchen inspection findings, corrective measures enforced (e.g. food batch discarded, equipment recalibrated), and supervisor follow-up.'
              : 'Provide the justification for dismissing this ticket (e.g., unfounded, duplicate report, unverified student report).'}
          </p>

          <Textarea
            label="Mandatory Inspector Note"
            required
            rows={4}
            error={noteError}
            placeholder="Enter comprehensive findings..."
            value={noteInput}
            onChange={(e) => {
              setNoteInput(e.target.value);
              setNoteError('');
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <Button
              type="button"
              variant="secondary"
              disabled={isProcessing}
              onClick={() => setActiveModal(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isProcessing}
              variant={activeModal?.type === 'resolve' ? 'success' : 'danger'}
            >
              {activeModal?.type === 'resolve' ? 'Confirm Action Taken' : 'Confirm Dismissal'}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default InspectorDashboard;
