import React from 'react';
import { ShieldAlert, LogIn, LogOut } from 'lucide-react';
import { USER_ROLES } from '../utils/constants';
import { useAuthContext } from '../context/AuthContext';

export const Navbar = ({ currentRole, onRoleChange, onNewReportClick, onOpenAuth }) => {
  const { currentUser, mongoUser, logout } = useAuthContext();

  return (
    <header
      style={{
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0.75rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        backgroundColor: 'rgba(7, 9, 14, 0.85)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        flexWrap: 'wrap',
        gap: '1rem'
      }}
    >
      {/* Brand Identity / Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <a
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(241, 245, 249, 0.92))',
            padding: '4px 12px 4px 6px',
            borderRadius: '10px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease'
          }}
          title="Cafeteria Incident Tracker"
        >
          <img
            src="/logo.svg"
            alt="Cafeteria Incident Tracker"
            style={{
              height: '38px',
              width: 'auto',
              display: 'block'
            }}
          />
        </a>

        {/* Live Status and Firebase Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '0.65rem',
              padding: '0.15rem 0.45rem',
              borderRadius: '4px',
              background: 'rgba(59, 130, 246, 0.2)',
              color: '#60a5fa',
              fontWeight: 700,
              textTransform: 'uppercase'
            }}
          >
            Live QA
          </span>
          {/* Firebase Connected Indicator */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.65rem',
              padding: '0.15rem 0.45rem',
              borderRadius: '999px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              fontWeight: 600
            }}
            title="Connected to Firebase Authentication: jaaamin-rox"
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 6px #10b981'
              }}
            />
            Firebase: jaaamin-rox
          </span>
        </div>
      </div>

      {/* Role Switcher Pills + Auth Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
        {/* Role Switcher Pills */}
        <div className="pill-tabs" title="Switch active dashboard view">
          <button
            onClick={() => onRoleChange(USER_ROLES.STUDENT)}
            className={`pill-tab ${currentRole === USER_ROLES.STUDENT ? 'active' : ''}`}
          >
            Student Reporter
          </button>
          <button
            onClick={() => onRoleChange(USER_ROLES.INSPECTOR)}
            className={`pill-tab ${currentRole === USER_ROLES.INSPECTOR ? 'active' : ''}`}
          >
            Inspector Triage
          </button>
          <button
            onClick={() => onRoleChange(USER_ROLES.ADMIN)}
            className={`pill-tab ${currentRole === USER_ROLES.ADMIN ? 'active' : ''}`}
          >
            Campus Admin
          </button>
        </div>

        {/* Quick Report Trigger for students */}
        {currentRole === USER_ROLES.STUDENT && onNewReportClick && (
          <button
            onClick={onNewReportClick}
            className="btn btn-primary btn-sm"
          >
            <ShieldAlert size={15} /> Log Hazard
          </button>
        )}

        {/* Firebase Authentication Button / Account Pill */}
        {currentUser ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'rgba(59, 130, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#60a5fa'
              }}
            >
              {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {currentUser.displayName || currentUser.email?.split('@')[0]}
              </span>
              <span style={{ fontSize: '0.65rem', color: '#10b981', textTransform: 'capitalize' }}>
                {mongoUser?.role || 'User'}
              </span>
            </div>
            <button
              onClick={logout}
              title="Sign Out of Firebase"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                marginLeft: '0.3rem',
                padding: '0.2rem',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <LogIn size={15} /> Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
