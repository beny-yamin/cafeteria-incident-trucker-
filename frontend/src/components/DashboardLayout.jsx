import React from 'react';

export const DashboardLayout = ({
  title,
  subtitle,
  badge = null,
  actions = null,
  children,
  maxWidth = '1280px'
}) => {
  return (
    <div style={{ maxWidth, margin: '0 auto', width: '100%' }}>
      {/* Page Header Banner */}
      {(title || subtitle || actions) && (
        <section
          style={{
            marginBottom: '2.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
              <h2
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  letterSpacing: '-0.025em',
                  color: 'var(--text-main)',
                  lineHeight: 1.2
                }}
              >
                {title}
              </h2>
              {badge}
            </div>
            {subtitle && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '680px', lineHeight: 1.5 }}>
                {subtitle}
              </p>
            )}
          </div>

          {actions && <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>{actions}</div>}
        </section>
      )}

      {/* Main Content Slot */}
      {children}
    </div>
  );
};

export default DashboardLayout;
