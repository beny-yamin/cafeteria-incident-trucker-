import React, { useState } from 'react';
import {
  DashboardLayout,
  StatCard,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Input,
  Modal,
  Alert
} from '../components';
import {
  Building,
  Plus,
  CheckCircle2,
  Clock,
  ShieldAlert,
  UserCheck
} from 'lucide-react';

export const AdminDashboard = ({
  halls = [],
  inspectors = [],
  incidents = [],
  onAddHall,
  onToggleHallStatus,
  onAssignHallsToInspector,
  isLoading = false,
  error = null
}) => {
  // Modal states
  const [isAddHallOpen, setIsAddHallOpen] = useState(false);
  const [newHall, setNewHall] = useState({ name: '', campus: '', supervisorName: '', isActive: true });
  const [isAddingHall, setIsAddingHall] = useState(false);
  const [addHallError, setAddHallError] = useState('');

  const [assignModalInspector, setAssignModalInspector] = useState(null);
  const [selectedHalls, setSelectedHalls] = useState([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignError, setAssignError] = useState('');

  // Analytics Metrics
  const totalIncidents = incidents.length;
  const underReviewCount = incidents.filter((i) => i.status === 'UNDER_REVIEW').length;
  const actionTakenCount = incidents.filter((i) => i.status === 'ACTION_TAKEN').length;
  const resolutionRate = totalIncidents > 0 ? Math.round((actionTakenCount / totalIncidents) * 100) : 0;

  const handleAddHallSubmit = async (e) => {
    e.preventDefault();
    setAddHallError('');
    if (!newHall.name.trim() || !newHall.campus.trim()) return;

    setIsAddingHall(true);
    try {
      await onAddHall({
        name: newHall.name.trim(),
        campus: newHall.campus.trim(),
        supervisorName: newHall.supervisorName.trim(),
        isActive: newHall.isActive
      });

      setNewHall({ name: '', campus: '', supervisorName: '', isActive: true });
      setIsAddHallOpen(false);
    } catch (err) {
      setAddHallError(err.message || 'Failed to create facility');
    } finally {
      setIsAddingHall(false);
    }
  };

  const handleOpenAssignModal = (insp) => {
    setAssignModalInspector(insp);
    setAssignError('');
    const currentIds = (insp.assignedHalls || []).map((h) =>
      h._id ? h._id.toString() : h.toString()
    );
    setSelectedHalls(currentIds);
  };

  const handleToggleHallSelection = (hallId) => {
    const idStr = hallId.toString();
    if (selectedHalls.includes(idStr)) {
      setSelectedHalls(selectedHalls.filter((id) => id !== idStr));
    } else {
      setSelectedHalls([...selectedHalls, idStr]);
    }
  };

  const handleSaveAssignments = async () => {
    if (!assignModalInspector) return;
    setIsAssigning(true);
    setAssignError('');
    try {
      await onAssignHallsToInspector(assignModalInspector._id, selectedHalls);
      setAssignModalInspector(null);
    } catch (err) {
      setAssignError(err.message || 'Failed to assign dining facilities');
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <DashboardLayout
      title="Campus Administration & Governance"
      subtitle="Oversee dining facility compliance, assign inspection zones, and audit campus-wide safety resolution metrics."
    >
      {error && (
        <Alert variant="danger" title="Error" style={{ marginBottom: '1.5rem' }}>
          {error}
        </Alert>
      )}

      {/* Analytics KPI Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}
      >
        <StatCard
          title="Total Incidents"
          value={totalIncidents}
          subtitle="Campus-wide submissions"
          icon={<ShieldAlert size={20} />}
          color="var(--primary)"
        />

        <StatCard
          title="Under Investigation"
          value={underReviewCount}
          subtitle="Assigned to inspectors"
          icon={<Clock size={20} />}
          color="var(--warning)"
        />

        <StatCard
          title="Action Taken Rate"
          value={`${resolutionRate}%`}
          subtitle="Verified remediation"
          icon={<CheckCircle2 size={20} />}
          color="var(--accent)"
        />

        <StatCard
          title="Dining Facilities"
          value={halls.length}
          subtitle={`${halls.filter((h) => h.isActive).length} active facilities`}
          icon={<Building size={20} />}
          color="#a855f7"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '2rem' }}>
        {/* Dining Hall Management Card */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Dining Hall Facilities</CardTitle>
              <CardDescription>Locations eligible for student reports</CardDescription>
            </div>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={15} />}
              onClick={() => setIsAddHallOpen(true)}
            >
              Add Facility
            </Button>
          </CardHeader>

          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {halls.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No facilities in database. Click 'Add Facility' above to register the first dining hall.
                </div>
              ) : (
                halls.map((hall) => (
                  <div
                    key={hall._id}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(13, 18, 31, 0.65)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{hall.name}</span>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: hall.isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: hall.isActive ? '#10b981' : '#ef4444'
                          }}
                        >
                          {hall.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        {hall.campus} • Supervisor: {hall.supervisorName || 'Not Assigned'}
                      </div>
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onToggleHallStatus(hall._id, hall.isActive)}
                    >
                      {hall.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Inspector Hall Assignments Manager */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Inspector Hall Coverage</CardTitle>
              <CardDescription>Inspectors only receive triage tickets for their designated halls</CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {inspectors.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No inspectors registered yet.
                </div>
              ) : (
                inspectors.map((insp) => {
                  const assignedIds = (insp.assignedHalls || []).map((h) =>
                    h._id ? h._id.toString() : h.toString()
                  );
                  const assigned = halls.filter((h) => assignedIds.includes(h._id.toString()));

                  return (
                    <div
                      key={insp._id}
                      style={{
                        padding: '1.2rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'rgba(13, 18, 31, 0.65)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1rem' }}>{insp.fullName}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Badge: {insp.badgeNumber || 'Certified'} • {insp.email}
                          </div>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<UserCheck size={14} />}
                          onClick={() => handleOpenAssignModal(insp)}
                        >
                          Assign Halls
                        </Button>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {assigned.length === 0 ? (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            No dining halls currently assigned.
                          </span>
                        ) : (
                          assigned.map((h) => (
                            <span
                              key={h._id}
                              style={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                padding: '0.25rem 0.55rem',
                                borderRadius: '4px',
                                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                                color: '#60a5fa',
                                border: '1px solid rgba(59, 130, 246, 0.3)'
                              }}
                            >
                              {h.name}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal: Add Dining Hall */}
      <Modal isOpen={isAddHallOpen} onClose={() => !isAddingHall && setIsAddHallOpen(false)} title="Register Dining Facility">
        <form onSubmit={handleAddHallSubmit}>
          {addHallError && (
            <Alert variant="danger" style={{ marginBottom: '1rem' }} onClose={() => setAddHallError('')}>
              {addHallError}
            </Alert>
          )}

          <Input
            label="Facility Name"
            required
            placeholder="e.g. West Campus Commons"
            value={newHall.name}
            onChange={(e) => setNewHall({ ...newHall, name: e.target.value })}
          />

          <Input
            label="Campus Zone"
            required
            placeholder="e.g. West Campus, North Quad"
            value={newHall.campus}
            onChange={(e) => setNewHall({ ...newHall, campus: e.target.value })}
          />

          <Input
            label="Supervisor / Executive Chef"
            placeholder="e.g. Chef Ronald Sterling"
            value={newHall.supervisorName}
            onChange={(e) => setNewHall({ ...newHall, supervisorName: e.target.value })}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button
              type="button"
              variant="secondary"
              disabled={isAddingHall}
              onClick={() => setIsAddHallOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isAddingHall}>
              Save Facility
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Assign Halls to Inspector */}
      <Modal
        isOpen={Boolean(assignModalInspector)}
        onClose={() => !isAssigning && setAssignModalInspector(null)}
        title={`Assign Facilities to ${assignModalInspector?.fullName}`}
      >
        {assignError && (
          <Alert variant="danger" style={{ marginBottom: '1rem' }} onClose={() => setAssignError('')}>
            {assignError}
          </Alert>
        )}

        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
          Select the dining halls this inspector will audit. Any tickets submitted for checked halls will populate into their triage queue.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
          {halls.map((h) => {
            const isChecked = selectedHalls.includes(h._id.toString());
            return (
              <label
                key={h._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isChecked ? 'rgba(59, 130, 246, 0.15)' : 'rgba(13, 18, 31, 0.5)',
                  border: isChecked ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggleHallSelection(h._id)}
                  style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{h.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{h.campus}</div>
                </div>
              </label>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <Button
            type="button"
            variant="secondary"
            disabled={isAssigning}
            onClick={() => setAssignModalInspector(null)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            isLoading={isAssigning}
            onClick={handleSaveAssignments}
          >
            Save Assignments
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default AdminDashboard;
