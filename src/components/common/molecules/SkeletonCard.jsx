import React from 'react';

const SkeletonCard = () => (
  <div className="card-ceremony">
    <div className="skeleton" style={{ aspectRatio: '16/9' }} />
    <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <div className="skeleton" style={{ height: '0.75rem', width: '35%' }} />
      <div className="skeleton" style={{ height: '1.4rem', width: '70%' }} />
      <div className="skeleton" style={{ height: '1rem', width: '100%' }} />
      <div className="skeleton" style={{ height: '1rem', width: '85%' }} />
      <div style={{ borderTop: '1px solid var(--color-divider)', paddingTop: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
        <div className="skeleton" style={{ height: '1.4rem', width: '45%', marginLeft: 'auto' }} />
      </div>
    </div>
  </div>
);
export default SkeletonCard;