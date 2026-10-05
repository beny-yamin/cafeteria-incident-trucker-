import React, { useState, useEffect } from 'react';
import {
  DashboardLayout,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Select,
  Textarea,
  Button,
  Alert,
  EmptyState,
  IncidentCard
} from '../components';
import {
  MEAL_TYPES,
  INCIDENT_CATEGORIES,
  INCIDENT_SEVERITIES
} from '../utils/constants';
import { Send, AlertCircle, History, UtensilsCrossed } from 'lucide-react';

export const StudentDashboard = ({
  halls = [],
  incidents = [],
  onSubmitIncident,
  isLoading = false,
  error = null
}) => {
  const [formData, setFormData] = useState({
    hallId: '',
    mealType: 'Lunch',
    category: 'Foreign Object',
    severity: 'Medium',
    description: '',
    imageUrl: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Default to first active hall when halls load from API
  useEffect(() => {
    if ((!formData.hallId || !halls.some((h) => h._id === formData.hallId)) && halls.length > 0) {
      const firstActive = halls.find((h) => h.isActive) || halls[0];
      if (firstActive) {
        setFormData((prev) => ({ ...prev, hallId: firstActive._id }));
      }
    }
  }, [halls, formData.hallId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.hallId) {
      setFormError('Please select a dining hall facility.');
      return;
    }

    if (!formData.description.trim()) {
      setFormError('Please provide a description of the incident.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitIncident({
        hallId: formData.hallId,
        mealType: formData.mealType,
        category: formData.category,
        severity: formData.severity,
        description: formData.description.trim(),
        imageUrl: formData.imageUrl.trim()
      });

      setFormData((prev) => ({
        ...prev,
        description: '',
        imageUrl: ''
      }));
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4500);
    } catch (err) {
      setFormError(err.message || 'Failed to submit incident report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hallOptions = halls
    .filter((h) => h.isActive)
    .map((h) => ({
      value: h._id,
      label: `${h.name} (${h.campus})`
    }));

  const categoryOptions = INCIDENT_CATEGORIES.map((cat) => ({
    value: cat,
    label: cat
  }));

  return (
    <DashboardLayout
      title="Student Dining Quality Hub"
      subtitle="Report food safety hazards, undercooked meals, and hygiene concerns. Submissions directly alert campus quality inspectors."
    >
      {error && (
        <Alert variant="danger" title="System Error" style={{ marginBottom: '1.5rem' }}>
          {error}
        </Alert>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 460px) 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Incident Filing Form Panel */}
        <Card style={{ position: 'sticky', top: '5rem' }}>
          <CardHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  padding: '0.45rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  color: 'var(--primary)',
                  display: 'flex'
                }}
              >
                <AlertCircle size={18} />
              </div>
              <CardTitle>Log Food Hazard</CardTitle>
            </div>
          </CardHeader>

          <CardContent>
            {submitSuccess && (
              <Alert
                variant="success"
                title="Report Submitted"
                style={{ marginBottom: '1.25rem' }}
                onClose={() => setSubmitSuccess(false)}
              >
                Your report has been saved to the database and queued for inspector triage.
              </Alert>
            )}

            {formError && (
              <Alert
                variant="danger"
                style={{ marginBottom: '1.25rem' }}
                onClose={() => setFormError('')}
              >
                {formError}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Select
                label="Dining Facility"
                required
                options={hallOptions}
                value={formData.hallId}
                onChange={(e) => setFormData({ ...formData, hallId: e.target.value })}
              />

              {/* Meal Period */}
              <div className="form-group">
                <label className="form-label">
                  Meal Period <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {MEAL_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, mealType: type })}
                      className={`pill-tab ${formData.mealType === type ? 'active' : ''}`}
                      style={{ textAlign: 'center', padding: '0.5rem' }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <Select
                label="Hazard Category"
                required
                options={categoryOptions}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />

              {/* Severity Selection */}
              <div className="form-group">
                <label className="form-label">
                  Severity Level <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {Object.keys(INCIDENT_SEVERITIES).map((sev) => {
                    const isSelected = formData.severity === sev;
                    const cfg = INCIDENT_SEVERITIES[sev];
                    return (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setFormData({ ...formData, severity: sev })}
                        style={{
                          padding: '0.45rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          borderRadius: 'var(--radius-sm)',
                          border: isSelected ? `2px solid ${cfg.color}` : '1px solid var(--border-light)',
                          backgroundColor: isSelected ? cfg.bg : 'transparent',
                          color: isSelected ? cfg.color : 'var(--text-secondary)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {sev}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Textarea
                label="Incident Description"
                required
                rows={4}
                maxLength={500}
                placeholder="Describe what occurred (e.g. food was undercooked, foreign object spotted, food temperature was inappropriate)..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <Input
                label="Evidence Photo URL (Optional)"
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />

              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                leftIcon={<Send size={16} />}
                style={{ width: '100%', marginTop: '0.75rem' }}
              >
                Submit Incident Report
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Submissions History */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <History size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Your Reported Submissions</h3>
            </div>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              {incidents.length} {incidents.length === 1 ? 'ticket' : 'tickets'} tracked
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {incidents.length === 0 ? (
              <EmptyState
                icon={<UtensilsCrossed size={36} color="var(--accent)" />}
                title="No incidents logged"
                description="Your dining experiences look safe! If you spot any health violations or food issues, use the form on the left."
              />
            ) : (
              incidents.map((report) => (
                <IncidentCard key={report._id} incident={report} userRole="student" />
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
