// Атом: date-picker з блокуванням минулого та lead-time
import React from 'react';
import { toInputDateValue, formatDisplayDate, getMinBookingDate } from '../../../utils/formatters';

const DatePicker = ({ id, label, value, onChange, leadDays = 1, required = false, error = '' }) => {
  const minDate = getMinBookingDate(leadDays);
  const minValue = toInputDateValue(minDate);

  const handleChange = (e) => {
    const raw = e.target.value; // 'РРРР-ММ-ДД'
    if (!raw) { onChange(null); return; }
    const [y, m, d] = raw.split('-').map(Number);
    const selected = new Date(y, m - 1, d);
    // Додатковий захист — не приймати дати раніше мінімуму
    if (selected < minDate) return;
    onChange(selected);
  };

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={id} className="form-label-custom">
          {label}
          {required && <span style={{ color: 'var(--color-primary)', marginLeft: 3 }}>*</span>}
        </label>
      )}
      <input
        id={id}
        type="date"
        min={minValue}
        value={value ? toInputDateValue(value) : ''}
        onChange={handleChange}
        required={required}
        aria-describedby={error ? `${id}-error` : `${id}-hint`}
        className={`form-control-custom ${error ? 'is-invalid' : ''}`}
        style={{ colorScheme: 'light' }}
      />
      {/* Підказка про мінімальну дату */}
      {!error && (
        <div id={`${id}-hint`} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)',
                                         marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
          <i className="bi bi-info-circle" />
          Найраніша можлива дата: <strong>{formatDisplayDate(minDate)}</strong>
        </div>
      )}
      {error && (
        <div id={`${id}-error`} role="alert"
             style={{ fontSize: 'var(--text-xs)', color: 'var(--color-error)', marginTop: 4,
                      display: 'flex', alignItems: 'center', gap: 4 }}>
          <i className="bi bi-exclamation-circle" />{error}
        </div>
      )}
    </div>
  );
};

export default DatePicker;