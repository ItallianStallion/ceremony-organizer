import React from 'react';

const AlertMessage = ({ type = 'success', message }) => {
  if (!message) return null;
  const ok = type === 'success';
  return (
    <div className={ok ? 'alert-success-custom' : 'alert-error-custom'} role="alert" aria-live="polite">
      <i className={`bi ${ok ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'}`} />
      <span>{message}</span>
    </div>
  );
};
export default AlertMessage;