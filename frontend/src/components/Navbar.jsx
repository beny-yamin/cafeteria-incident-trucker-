import React from 'react';
import { ShieldAlert, LogOut, KeyRound, Shield, GraduationCap, Crown } from 'lucide-react';
import { USER_ROLES } from '../utils/constants';
import { useAuthContext } from '../context/AuthContext';

export const Navbar = ({ currentRole, onNewReportClick, onOpenChangePassword }) => {
  const { currentUser, mongoUser, logout } = useAuthContext();

  const getRoleBadge = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return {
          icon: Crown,
          label: 'Campus Admin',
          color: '#f87171',
          bg: 'rgba(239, 68, 68, 0.15)',
          border: 'rgba(239, 68, 68, 0.3)'
        };
      case USER_ROLES.INSPECTOR:
        return {
          icon: Shield,
          label: 'Safety Inspector',
          color: '#34d399',
          bg: 'rgba(16, 185, 129, 0.15)',
          border: 'rgba(16, 185, 129, 0.3)'
        };
      case USER_ROLES.STUDENT:
      default:
        return {
          icon: GraduationCap,
          label: 'Student Reporter',
          color: '#60a5fa',
          bg: 'rgba(59, 130, 246, 0.15)',
          border: 'rgba(59, 130, 246, 0.3)'
        };
    }
  };

  const badgeInfo = getRoleBadge(currentRole);
  const BadgeIcon = badgeInfo.icon;

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

      {/* Role Indicator & Authenticated User Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
        {/* Active Role Indicator Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.75rem',
            borderRadius: '999px',
            backgroundColor: badgeInfo.bg,
            border: `1px solid ${badgeInfo.border}`,
            color: badgeInfo.color,
            fontSize: '0.8rem',
            fontWeight: 700
          }}
          title={`Authenticated Role: ${badgeInfo.label}`}
        >
          <BadgeIcon size={14} />
          <span>{badgeInfo.label}</span>
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

        {/* User Account Pill */}
        {currentUser && (
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
                backgroundColor: `${badgeInfo.color}33`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: badgeInfo.color
              }}
            >
              {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {currentUser.displayName || currentUser.email?.split('@')[0]}
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                {currentUser.email}
              </span>
            </div>

            {/* Change Password Trigger */}
            {onOpenChangePassword && (
              <button
                onClick={onOpenChangePassword}
                title="Change Password"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  marginLeft: '0.4rem',
                  padding: '0.25rem 0.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.7rem'
                }}
              >
                <KeyRound size={13} />
                <span>Password</span>
              </button>
            )}

            {/* Sign Out Button */}
            <button
              onClick={logout}
              title="Sign Out of Account"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                marginLeft: '0.25rem',
                padding: '0.25rem',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <LogOut size={15} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
