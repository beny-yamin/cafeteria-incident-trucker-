import React, { useState } from 'react';
import { KeyRound, Eye, EyeOff, CheckCircle2, ShieldCheck } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import Alert from './Alert';
import { useAuthContext } from '../context/AuthContext';

export const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { currentUser, changePassword } = useAuthContext();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
    setSuccess(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setLoading(true);
    try {
      await changePassword(newPassword, currentPassword || null);
      setSuccess('Password updated successfully! Please use this new password next time you sign in.');
      setTimeout(() => {
        handleClose();
      }, 1600);
    } catch (err) {
      const code = err.code || '';
      if (code.includes('auth/wrong-password') || code.includes('auth/invalid-credential')) {
        setError('Current password entered is incorrect.');
      } else if (code.includes('auth/requires-recent-login')) {
        setError('For security, please enter your current password to confirm your identity.');
      } else if (code.includes('auth/weak-password')) {
        setError('The new password is too weak. Please use at least 6 characters.');
      } else {
        setError(err.message || 'Failed to update password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Change Password">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div
          style={{
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <ShieldCheck size={20} color="#60a5fa" />
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Changing password for <strong style={{ color: '#fff' }}>{currentUser?.email}</strong>.
            This updates your login credentials in Firebase Authentication.
          </div>
        </div>

        {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Current Password (Optional if recently signed in)
            </label>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              New Password (min 6 characters)
            </label>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Confirm New Password
            </label>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer'
              }}
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              {showPassword ? 'Hide Passwords' : 'Show Passwords'}
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              <KeyRound size={16} /> {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ChangePasswordModal;
