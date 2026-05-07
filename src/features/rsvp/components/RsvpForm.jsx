import React, { useEffect } from 'react';
import useRsvpForm from '../hooks/useRsvpForm';
import Input from '../../../components/common/atoms/Input';
import Button from '../../../components/common/atoms/Button';
import AlertMessage from '../../../components/common/atoms/AlertMessage';
import { formatPrice } from '../../../utils/formatters';

import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { uk } from 'date-fns/locale/uk';
import './RsvpForm.css';
registerLocale('uk', uk);

const PackageIncludes = ({ event }) => (
  <div className="rsvp-package-includes">
    <p className="rsvp-package-title">
      <span>✦</span> Що включено в пакет
    </p>
    <ul className="rsvp-package-list">
      {event.includes.map((item, i) => (
        <li key={i} className="rsvp-package-item">
          <i className="bi bi-check-circle-fill rsvp-package-icon" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
    <div className="rsvp-package-footer">
      <i className="bi bi-people" />
      <span>Гості: {event.minGuests}–{event.maxGuests} осіб</span>
    </div>
  </div>
);

const AddonCheckbox = ({ addon, checked, onToggle }) => (
  <label className={`rsvp-addon-label ${checked ? 'checked' : ''}`}>
    <div className="rsvp-addon-left">
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={() => onToggle(addon.id)}
        className="rsvp-addon-checkbox" 
      />
      <span className={`rsvp-addon-text ${checked ? 'checked' : ''}`}>
        {addon.label}
      </span>
    </div>
    <span className="rsvp-addon-price">
      +{formatPrice(addon.price)}
    </span>
  </label>
);

const RsvpForm = ({ onGoProfile, preselectedEvent }) => {
  const {
    fields, errors, loading, success, serverError,
    setField, toggleAddon, handleSubmit,
    selectedEvent, totalPrice, minDate,
    events, eventsLoading,
  } = useRsvpForm(preselectedEvent);

  useEffect(() => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      const idMap = {
        fullName: 'rsvp-name',
        email: 'rsvp-email',
        eventId: 'rsvp-event',
        desiredDate: 'rsvp-date',
        attendanceStatus: 'rsvp-status',
        guestCount: 'rsvp-guests',
      };
      const firstErrorId = idMap[errorKeys[0]];
      if (firstErrorId) {
        const element = document.getElementById(firstErrorId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus(); 
        }
      }
    }
  }, [errors]);

  if (success) {
    return (
      <div className="rsvp-success-container">
        <div className="rsvp-success-emoji">🎉</div>
        <h3 className="rsvp-success-title">Замовлення прийнято!</h3>
        <p className="rsvp-success-text">{success}</p>
        
        <div className="rsvp-success-actions">
          {onGoProfile && (
            <Button onClick={onGoProfile} className="rsvp-btn-primary">
              <i className="bi bi-person-circle me-2" />Мої замовлення
            </Button>
          )}
          <Button variant="outline" onClick={() => window.location.reload()} className="rsvp-btn-outline">
            Нове замовлення
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <AlertMessage type="error" message={serverError} />
      {serverError && <div className="mb-3" />}

      {/* ── Особисті дані ── */}
      <div className="rsvp-section">
        <p className="rsvp-section-title">Особисті дані</p>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <Input id="rsvp-name" label="Повне ім'я" required
                   value={fields.fullName} onChange={(e) => setField('fullName', e.target.value)}
                   placeholder="Іван Петренко" error={errors.fullName} />
          </div>
          <div className="col-12 col-md-6">
            <Input id="rsvp-email" label="Email" type="email" required
                   value={fields.email} onChange={(e) => setField('email', e.target.value)}
                   placeholder="your@email.com" error={errors.email} />
          </div>
        </div>
      </div>

      {/* ── Пакет та деталі ── */}
      <div className="rsvp-section">
        <p className="rsvp-section-title">Пакет та деталі</p>
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-8">
            <Input id="rsvp-event" label="Пакет заходу" as="select" required
                   value={fields.eventId} onChange={(e) => setField('eventId', e.target.value)}>
              {eventsLoading
                ? <option disabled>Завантаження...</option>
                : events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title} — від {ev.price.toLocaleString('uk-UA')} грн
                    </option>
                  ))
              }
            </Input>
          </div>
          <div className="col-12 col-md-4">
            <div className="rsvp-price-preview-wrapper">
              <div className="rsvp-price-preview-card">
                <div className="rsvp-price-preview-label">
                  <i className="bi bi-tag" /> Мінімальна вартість пакету
                </div>
                <div className="rsvp-price-preview-value">
                  {selectedEvent ? formatPrice(selectedEvent.price) : '—'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {selectedEvent && <PackageIncludes event={selectedEvent} />}

        <div className="row g-3">
 
          <div className="col-12 col-md-6">
            <label className="rsvp-date-label">
              Бажана дата <span className="rsvp-date-required">*</span>
            </label>
            <DatePicker
              id="rsvp-date"
              selected={fields.desiredDate ? new Date(fields.desiredDate) : null}
              onChange={(date) => {
                const formatted = date ? date.toISOString().split('T')[0] : '';
                setField('desiredDate', formatted);
              }}
              minDate={new Date(minDate)}
              dateFormat="dd.MM.yyyy"
              locale="uk"
              placeholderText="ДД.ММ.РРРР"
              autoComplete="off"
              className={`form-control ${errors.desiredDate ? 'is-invalid' : ''}`}
              containerClassName="d-block"
            />
            {errors.desiredDate && (
              <div className="rsvp-date-error">
                {errors.desiredDate}
              </div>
            )}
            {!errors.desiredDate && (
              <div className="rsvp-date-info">
                <i className="bi bi-info-circle" /> Найраніша можлива дата: {minDate}
              </div>
            )}
          </div>

          <div className="col-12 col-md-6">
            <Input id="rsvp-status" label="Статус відвідування" as="select" required
                   value={fields.attendanceStatus}
                   onChange={(e) => setField('attendanceStatus', e.target.value)}
                   error={errors.attendanceStatus}>
              <option value="attending">✅ Буду присутній</option>
              <option value="not_attending">❌ Не зможу прийти</option>
              <option value="maybe">🤔 Можливо</option>
            </Input>
          </div>
          
          <div className="col-12 col-md-6">
            <Input id="rsvp-guests"
                   label={selectedEvent
                     ? `Кількість гостей (${selectedEvent.minGuests}–${selectedEvent.maxGuests})`
                     : 'Кількість гостей'}
                   type="number" required value={fields.guestCount}
                   onChange={(e) => setField('guestCount', e.target.value)}
                   error={errors.guestCount} />
          </div>
          
          <div className="col-12 col-md-6">
            <Input id="rsvp-food" label="Харчові вподобання" as="select"
                   value={fields.foodPreference}
                   onChange={(e) => setField('foodPreference', e.target.value)}>
              <option value="none">Без особливостей</option>
              <option value="vegetarian">🌱 Вегетаріанське</option>
              <option value="vegan">🥦 Веганське</option>
              <option value="halal">☪️ Халяль</option>
              <option value="gluten_free">🌾 Без глютену</option>
            </Input>
          </div>
        </div>
      </div>

      {/* ── Додаткові опції ── */}
      {selectedEvent && selectedEvent.addons?.length > 0 && (
        <div className="rsvp-section">
          <p className="rsvp-section-title">
            Додаткові опції
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {selectedEvent.addons.map((addon) => (
              <AddonCheckbox key={addon.id} addon={addon}
                             checked={fields.selectedAddons.includes(addon.id)}
                             onToggle={toggleAddon} />
            ))}
          </div>
        </div>
      )}

      <Input id="rsvp-notes" label="Додаткові побажання" as="textarea" rows={3}
             value={fields.notes} onChange={(e) => setField('notes', e.target.value)}
             placeholder="Алергії, особливі запити, привітання..." />

      {/* ── Підсумок вартості ── */}
      <div className="rsvp-summary-card">
        <div>
          <div className="rsvp-summary-label">
            Орієнтовна вартість
          </div>
          <div className="rsvp-summary-total">
            {formatPrice(totalPrice)}
          </div>
          {fields.selectedAddons.length > 0 && selectedEvent && (
            <div className="rsvp-summary-details">
              Базова {formatPrice(selectedEvent.price)} + {fields.selectedAddons.length} опції
            </div>
          )}
        </div>
        
        <Button type="submit" loading={loading} className="rsvp-submit-btn">
          <i className="bi bi-send-fill me-2" />Оформити замовлення
        </Button>
      </div>
    </form>
  );
};

export default RsvpForm;