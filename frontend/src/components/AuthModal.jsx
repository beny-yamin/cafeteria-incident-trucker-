import React, { useState } from 'react';
import { LogIn, UserPlus, KeyRound, Mail, User, Shield, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import Alert from './Alert';
import { useAuthContext } from '../context/AuthContext';
import { USER_ROLES } from '../utils/constants';

export const AuthModal = ({ isOpen, onClose }) => {
  const {
    currentUser,
    mongoUser,
    loginWithEmail,
    signupWithEmail,
    loginWithGoogle,
    loginDemo,
    logout
  } = useAuthContext();

  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'demo'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState(USER_ROLES.STUDENT);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const resetForm = () => {
    setError(null);
    setSuccessMsg(null);
  };

  const handleModeChange = (newMode) => {
    resetForm();
    setMode(newMode);
  };

  const parseFirebaseError = (err) => {
    const code = err.code || '';
    if (code.includes('auth/invalid-email')) return 'Invalid email address format.';
    if (code.includes('auth/user-not-found')) return 'No account found with this email. Please sign up.';
    if (code.includes('auth/wrong-password') || code.includes('auth/invalid-credential'))
      return 'Incorrect password or credentials.';
    if (code.includes('auth/email-already-in-use'))
      return 'An account with this email already exists. Try signing in.';
    if (code.includes('auth/weak-password'))
      return 'Password should be at least 6 characters long.';
    if (code.includes('auth/popup-closed-by-user'))
      return 'Sign-in window was closed before completion.';
    if (code.includes('auth/operation-not-allowed'))
      return 'This sign-in method is not enabled in the Firebase Console yet. You can use Quick Demo Access below or enable Email/Password in Firebase Console.';
    return err.message || 'Authentication error. Please check your credentials.';
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      setSuccessMsg('Successfully signed in with Firebase!');
      setTimeout(() => {
        onClose();
        resetForm();
      }, 700);
    } catch (err) {
      setError(parseFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      setError('Please complete all required fields.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signupWithEmail(email, password, fullName, role);
      setSuccessMsg(`Account created successfully as ${role}!`);
      setTimeout(() => {
        onClose();
        resetForm();
      }, 700);
    } catch (err) {
      setError(parseFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      setSuccessMsg('Signed in with Google successfully!');
      setTimeout(() => {
        onClose();
        resetForm();
      }, 700);
    } catch (err) {
      setError(parseFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (targetRole) => {
    setError(null);
    setLoading(true);
    try {
      await loginDemo(targetRole);
      setSuccessMsg(`Switched to demo ${targetRole} mode.`);
      setTimeout(() => {
        onClose();
        resetForm();
      }, 500);
    } catch (err) {
      setError('Failed to switch to demo role.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Firebase Authentication">
      {/* Active User Banner if logged in */}
      {currentUser && (
        <div
          style={{
            padding: '0.85rem 1rem',
            marginBottom: '1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#34d399' }}>
                Signed in as {currentUser.email}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Database Role: <strong>{mongoUser?.role || 'student'}</strong> | UID: {currentUser.uid.slice(0, 12)}...
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              await logout();
              setSuccessMsg('Signed out.');
            }}
          >
            Sign Out
          </Button>
        </div>
      )}

      {/* Mode Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.75rem',
          marginBottom: '1.25rem'
        }}
      >
        <button
          onClick={() => handleModeChange('login')}
          style={{
            flex: 1,
            padding: '0.6rem 0.5rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: mode === 'login' ? 'var(--primary-color)' : 'transparent',
            color: mode === 'login' ? '#ffffff' : 'var(--text-muted)',
            transition: 'all 0.2s ease'
          }}
        >
          Sign In
        </button>
        <button
          onClick={() => handleModeChange('register')}
          style={{
            flex: 1,
            padding: '0.6rem 0.5rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: mode === 'register' ? 'var(--primary-color)' : 'transparent',
            color: mode === 'register' ? '#ffffff' : 'var(--text-muted)',
            transition: 'all 0.2s ease'
          }}
        >
          Create Account
        </button>
        <button
          onClick={() => handleModeChange('demo')}
          style={{
            flex: 1,
            padding: '0.6rem 0.5rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: mode === 'demo' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
            color: mode === 'demo' ? '#60a5fa' : 'var(--text-muted)',
            transition: 'all 0.2s ease'
          }}
        >
          ⚡ Quick Demo
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <Alert
          type="danger"
          message={error}
          onClose={() => setError(null)}
        />
      )}
      {successMsg && (
        <Alert
          type="success"
          message={successMsg}
          onClose={() => setSuccessMsg(null)}
        />
      )}

      {/* Tab 1: Sign In */}
      {mode === 'login' && (
        <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Email Address
            </label>
            <Input
              type="email"
              placeholder="e.g. student@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            <LogIn size={16} /> {loading ? 'Signing In...' : 'Sign In with Email'}
          </Button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              margin: '0.5rem 0',
              color: 'var(--text-muted)',
              fontSize: '0.75rem'
            }}
          >
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
            <span style={{ padding: '0 0.75rem' }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </Button>
        </form>
      )}

      {/* Tab 2: Register */}
      {mode === 'register' && (
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Full Name
            </label>
            <Input
              type="text"
              placeholder="e.g. Alex Morgan"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              University Email
            </label>
            <Input
              type="email"
              placeholder="alex@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Password
            </label>
            <Input
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              System Role
            </label>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              options={[
                { value: USER_ROLES.STUDENT, label: 'Student Reporter (Report dining issues)' },
                { value: USER_ROLES.INSPECTOR, label: 'Food Safety Inspector (Investigate & resolve)' },
                { value: USER_ROLES.ADMIN, label: 'Campus Administrator (Manage dining halls & staff)' }
              ]}
            />
          </div>

          <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            <UserPlus size={16} /> {loading ? 'Registering...' : 'Create Account'}
          </Button>
        </form>
      )}

      {/* Tab 3: Quick Demo Role Switcher */}
      {mode === 'demo' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Instant evaluation mode: switch between pre-configured university accounts without typing credentials.
          </p>

          <button
            onClick={() => handleDemoLogin(USER_ROLES.STUDENT)}
            style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'rgba(59, 130, 246, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              color: 'var(--text-main)',
              textAlign: 'left'
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#60a5fa' }}>Student Reporter</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                student@university.edu • File hazard reports & view dining halls
              </div>
            </div>
            <Sparkles size={16} color="#60a5fa" />
          </button>

          <button
            onClick={() => handleDemoLogin(USER_ROLES.INSPECTOR)}
            style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              color: 'var(--text-main)',
              textAlign: 'left'
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#34d399' }}>Food Safety Inspector</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                inspector@university.edu • Claim, investigate & resolve reports
              </div>
            </div>
            <Shield size={16} color="#34d399" />
          </button>

          <button
            onClick={() => handleDemoLogin(USER_ROLES.ADMIN)}
            style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              color: 'var(--text-main)',
              textAlign: 'left'
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f87171' }}>Campus Administrator</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                admin@university.edu • Full oversight, manage halls & assign staff
              </div>
            </div>
            <KeyRound size={16} color="#f87171" />
          </button>
        </div>
      )}

      {/* Footer Firebase Connection Metadata */}
      <div
        style={{
          marginTop: '1.5rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              display: 'inline-block',
              boxShadow: '0 0 6px rgba(16, 185, 129, 0.8)'
            }}
          />
          <span>Firebase Project: <strong>jaaamin-rox</strong></span>
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Auth Ready</span>
      </div>
    </Modal>
  );
};

export default AuthModal;
