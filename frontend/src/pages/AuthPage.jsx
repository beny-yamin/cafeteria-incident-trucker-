import React, { useState } from 'react';
import {
  LogIn,
  UserPlus,
  KeyRound,
  Mail,
  User,
  Shield,
  GraduationCap,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Send
} from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import { USER_ROLES } from '../utils/constants';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Alert from '../components/Alert';

// Instant Role Accounts available right out of the box
const INSTANT_ACCOUNTS = [
  {
    role: USER_ROLES.STUDENT,
    roleTitle: 'Student Reporter',
    email: 'student@university.edu',
    password: 'Student123!',
    icon: GraduationCap,
    badgeColor: '#3b82f6',
    description: 'Report dining hazards & view cafeterias'
  },
  {
    role: USER_ROLES.INSPECTOR,
    roleTitle: 'Safety Inspector',
    email: 'inspector@university.edu',
    password: 'Inspector123!',
    icon: Shield,
    badgeColor: '#10b981',
    description: 'Triage, claim & resolve dining reports'
  },
  {
    role: USER_ROLES.ADMIN,
    roleTitle: 'Campus Administrator',
    email: 'admin@university.edu',
    password: 'Admin123!',
    icon: KeyRound,
    badgeColor: '#f87171',
    description: 'Manage halls, assign inspectors & analytics'
  }
];

export const AuthPage = () => {
  const { loginWithEmail, signupWithEmail, loginWithGoogle, resetPassword } = useAuthContext();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState(USER_ROLES.STUDENT);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [autofillNotice, setAutofillNotice] = useState(null);

  // Forgot password flow
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const resetForm = () => {
    setError(null);
    setSuccessMsg(null);
    setAutofillNotice(null);
  };

  const handleModeChange = (newMode) => {
    resetForm();
    setMode(newMode);
  };

  const parseFirebaseError = (err) => {
    const code = err.code || '';
    if (code.includes('auth/invalid-email')) return 'Invalid email address format.';
    if (code.includes('auth/user-not-found')) return 'No account found with this email. Please check your email or create an account.';
    if (code.includes('auth/wrong-password') || code.includes('auth/invalid-credential'))
      return 'Incorrect password or credentials. Make sure you are using the correct password or use instant credentials below.';
    if (code.includes('auth/email-already-in-use'))
      return 'An account with this email already exists. Try signing in instead.';
    if (code.includes('auth/weak-password'))
      return 'Password should be at least 6 characters long.';
    if (code.includes('auth/popup-closed-by-user'))
      return 'Sign-in popup was closed before completion.';
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
      setSuccessMsg('Signed in successfully! Redirecting to your dashboard...');
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
      setSuccessMsg(`Account created successfully as ${role}! Redirecting to dashboard...`);
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
      setSuccessMsg('Signed in with Google successfully! Redirecting...');
    } catch (err) {
      setError(parseFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  // Instant credential quick-fill
  const handleAutofill = (acc) => {
    setMode('login');
    setEmail(acc.email);
    setPassword(acc.password);
    setError(null);
    setAutofillNotice(`Filled credentials for ${acc.roleTitle}. Click "Sign In" to proceed.`);
  };

  const handleSendPasswordReset = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setError('Please enter your email to receive a password reset link.');
      return;
    }
    setResetLoading(true);
    setError(null);
    try {
      await resetPassword(resetEmail);
      setSuccessMsg(`Password reset link sent to ${resetEmail}! Check your inbox.`);
      setShowForgot(false);
    } catch (err) {
      setError(parseFirebaseError(err));
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        background: 'radial-gradient(ellipse at top, #10192e 0%, #07090e 70%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative ambient background glows */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '20%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '20%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 16px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(241, 245, 249, 0.92))',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
              marginBottom: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.4)'
            }}
          >
            <img
              src="/logo.svg"
              alt="Cafeteria Incident Tracker"
              style={{ height: '48px', width: 'auto', display: 'block' }}
            />
          </div>

          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: '#f8fafc',
              marginBottom: '0.4rem',
              fontFamily: 'var(--font-display)'
            }}
          >
            University Food Quality Portal
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto' }}>
            Sign in to access your role-specific dining dashboard and reporting tools.
          </p>
        </div>

        {/* Main Card */}
        <div
          className="glass-panel"
          style={{
            padding: '2rem',
            border: '1px solid var(--border-light)',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7)'
          }}
        >
          {/* Mode Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              background: 'rgba(13, 18, 31, 0.85)',
              padding: '0.35rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <button
              onClick={() => handleModeChange('login')}
              style={{
                flex: 1,
                padding: '0.65rem 0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: mode === 'login' ? 'var(--primary)' : 'transparent',
                color: mode === 'login' ? '#ffffff' : 'var(--text-secondary)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <LogIn size={16} /> Sign In
            </button>
            <button
              onClick={() => handleModeChange('register')}
              style={{
                flex: 1,
                padding: '0.65rem 0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: mode === 'register' ? 'var(--primary)' : 'transparent',
                color: mode === 'register' ? '#ffffff' : 'var(--text-secondary)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <UserPlus size={16} /> Create Account
            </button>
          </div>

          {/* Feedback Alerts */}
          {error && <Alert type="danger" message={error} onClose={() => setError(null)} />}
          {successMsg && <Alert type="success" message={successMsg} onClose={() => setSuccessMsg(null)} />}
          {autofillNotice && (
            <div
              style={{
                marginBottom: '1.25rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(59, 130, 246, 0.12)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.82rem',
                color: '#93c5fd'
              }}
            >
              <span>{autofillNotice}</span>
              <button
                onClick={() => setAutofillNotice(null)}
                style={{ background: 'none', border: 'none', color: '#93c5fd', cursor: 'pointer', fontSize: '1rem' }}
              >
                &times;
              </button>
            </div>
          )}

          {/* TAB 1: SIGN IN */}
          {mode === 'login' && (
            <div>
              <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Password</label>
                    <button
                      type="button"
                      onClick={() => setShowForgot(!showForgot)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Inline Forgot Password Box */}
                {showForgot && (
                  <div
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(13, 18, 31, 0.9)',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      Enter your email to receive a password reset link:
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Input
                        type="email"
                        placeholder="your-email@university.edu"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleSendPasswordReset}
                        disabled={resetLoading}
                      >
                        <Send size={14} /> {resetLoading ? 'Sending...' : 'Send'}
                      </Button>
                    </div>
                  </div>
                )}

                <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '0.25rem' }} disabled={loading}>
                  <LogIn size={16} /> {loading ? 'Signing In...' : 'Sign In'}
                </Button>

                {/* OR divider */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    margin: '0.25rem 0',
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem'
                  }}
                >
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
                  <span style={{ padding: '0 0.75rem' }}>OR</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
                </div>

                {/* Google Sign In */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.6rem' }}
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

              {/* INSTANT ROLE CREDENTIALS SECTION */}
              <div
                style={{
                  marginTop: '1.75rem',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sparkles size={16} color="#60a5fa" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                      Instant Role Credentials
                    </span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Click to autofill
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {INSTANT_ACCOUNTS.map((acc) => {
                    const Icon = acc.icon;
                    return (
                      <button
                        key={acc.role}
                        type="button"
                        onClick={() => handleAutofill(acc)}
                        style={{
                          padding: '0.75rem 0.9rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: 'rgba(13, 18, 31, 0.7)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          color: 'var(--text-main)',
                          textAlign: 'left',
                          transition: 'all 0.2s ease',
                          gap: '0.75rem'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = acc.badgeColor;
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border-subtle)';
                          e.currentTarget.style.backgroundColor = 'rgba(13, 18, 31, 0.7)';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              backgroundColor: `${acc.badgeColor}20`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Icon size={16} color={acc.badgeColor} />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
                              {acc.roleTitle}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              <code>{acc.email}</code> • Pass: <code>{acc.password}</code>
                            </div>
                          </div>
                        </div>

                        <span
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.2rem 0.55rem',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: `${acc.badgeColor}15`,
                            color: acc.badgeColor,
                            fontWeight: 600
                          }}
                        >
                          Autofill
                        </span>
                      </button>
                    );
                  })}
                </div>

                <p
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    marginTop: '0.75rem',
                    textAlign: 'center',
                    lineHeight: 1.4
                  }}
                >
                  🔒 Real Firebase accounts. You can change any password anytime from inside your dashboard or via Firebase Console.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: REGISTER */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Full Name
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Jordan Lee"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  University Email
                </label>
                <Input
                  type="email"
                  placeholder="jordan@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Password (min 6 characters)
                </label>
                <div style={{ position: 'relative' }}>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Assigned System Role
                </label>
                <Select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  options={[
                    { value: USER_ROLES.STUDENT, label: '🎓 Student Reporter (Report dining issues)' },
                    { value: USER_ROLES.INSPECTOR, label: '🛡️ Safety Inspector (Triage & resolve reports)' },
                    { value: USER_ROLES.ADMIN, label: '👑 Campus Administrator (Full management & halls)' }
                  ]}
                />
              </div>

              <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
                <UserPlus size={16} /> {loading ? 'Creating Account...' : 'Create Account & Sign In'}
              </Button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div
          style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              display: 'inline-block',
              boxShadow: '0 0 8px rgba(16, 185, 129, 0.8)'
            }}
          />
          <span>Firebase Authentication: <strong>jaaamin-rox</strong></span>
          <span>•</span>
          <span>Express Backend Ready</span>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
