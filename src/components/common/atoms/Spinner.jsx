import React from 'react';

const Spinner = ({ size = 'md', text = 'Завантаження...' }) => {
  const sizeMap = { sm: '1rem', md: '1.75rem', lg: '2.5rem' };
  return (
    <div className="d-flex flex-column align-items-center gap-2" role="status" aria-label={text}>
      <div className="spinner-border"
           style={{ width: sizeMap[size], height: sizeMap[size], color: 'var(--color-primary)', borderWidth: '2.5px' }} />
      {text && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{text}</span>}
    </div>
  );
};
export default Spinner;