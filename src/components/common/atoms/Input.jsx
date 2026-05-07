// Атом: поле введення з міткою та валідацією
import React from 'react';

const Input = ({ id, label, type = 'text', value, onChange, placeholder = '',
                 error = '', required = false, as = 'input', children, rows = 3 }) => {
  const Tag = as === 'textarea' ? 'textarea' : as === 'select' ? 'select' : 'input';
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={id} className="form-label-custom">
          {label}{required && <span style={{ color: 'var(--color-primary)', marginLeft: 3 }}>*</span>}
        </label>
      )}
      <Tag id={id} type={as === 'input' ? type : undefined} value={value} onChange={onChange}
           placeholder={placeholder} required={required}
           rows={as === 'textarea' ? rows : undefined}
           className={`form-control-custom ${error ? 'is-invalid' : ''}`}
           aria-describedby={error ? `${id}-error` : undefined}>
        {as === 'select' ? children : null}
      </Tag>
      {error && (
        <div id={`${id}-error`} role="alert"
             style={{ fontSize: 'var(--text-xs)', color: 'var(--color-error)', marginTop: 4 }}>
          <i className="bi bi-exclamation-circle me-1" />{error}
        </div>
      )}
    </div>
  );
};
export default Input;