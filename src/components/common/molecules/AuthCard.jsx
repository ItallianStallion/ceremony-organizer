import React from 'react';

const AuthCard = ({ title, subtitle, children }) => (
  <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #fdf6ee 0%, #f5e8dc 100%)', padding: 'var(--space-6)' }}>
    <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-lg)', padding: 'var(--space-8)',
                  width: '100%', maxWidth: '440px', border: '1px solid var(--color-border)' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
        {/* SVG логотип */}
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-label="Логотип">
          <circle cx="24" cy="24" r="24" fill="var(--color-primary-light)" />
          <path d="M24 12 L28 20 L37 21 L30.5 27.5 L32 37 L24 32.5 L16 37 L17.5 27.5 L11 21 L20 20 Z"
                fill="var(--color-primary)" />
        </svg>
      </div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)',
                   textAlign: 'center', marginBottom: 'var(--space-2)' }}>{title}</h1>
      {subtitle && (
        <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)',
                    marginBottom: 'var(--space-6)' }}>{subtitle}</p>
      )}
      {children}
    </div>
  </div>
);
export default AuthCard;