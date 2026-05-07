// Атом: кнопка з підтримкою завантаження
import React from 'react';

const Button = ({ children, variant = 'primary', loading = false, disabled = false,
                  type = 'button', onClick, className = '', fullWidth = false }) => {
  const cls = variant === 'outline' ? 'btn-outline-custom' : 'btn-primary-custom';
  return (
    <button type={type} className={`${cls} ${fullWidth ? 'w-100' : ''} ${className}`}
            disabled={disabled || loading} onClick={onClick}>
      {loading && <span className="spinner-border spinner-border-sm me-1" role="status"
                        aria-hidden="true" style={{ borderWidth: '2px' }} />}
      {children}
    </button>
  );
};
export default Button;