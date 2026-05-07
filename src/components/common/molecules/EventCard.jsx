import React, { useState } from 'react';
import { formatPrice } from '../../../utils/formatters';
import './EventCard.css'; // Імпортуємо стилі

// ── Модалка деталей події ──
const EventModal = ({ event, onClose, onBook }) => {
  if (!event) return null;

  return (
    <div className="event-modal-overlay" onClick={onClose}>
      <div className="event-modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Блок зображення в модалці */}
        <div className="event-image-wrapper event-image-wrapper-modal">
          {event.imageUrl ? (
            <img src={event.imageUrl} alt={event.title} className="event-image" />
          ) : (
            <div className="event-missing-photo">
              <i className="bi bi-image" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}></i>
              <span style={{ fontSize: '1rem', fontWeight: 500 }}>Фото відсутнє</span>
            </div>
          )}
          
          <div className="event-modal-gradient" />
          
          {event.category && (
            <span className="event-category-badge event-badge-modal">
              {event.category}
            </span>
          )}
          
          <button onClick={onClose} aria-label="Закрити" className="event-modal-close-btn">
            X
          </button>
        </div>

        {/* Контент модалки */}
        <div className="event-modal-body">
          <h2 className="event-modal-title">{event.title}</h2>
          <p className="event-modal-desc">{event.description}</p>

          {event.includes?.length > 0 && (
            <div className="event-includes-box">
              <p className="event-includes-header">
                <span>✦</span> Що входить у пакет
              </p>
              <ul className="event-includes-list">
                {event.includes.map((item) => (
                  <li key={item} className="event-includes-item">
                    <i className="bi bi-check-circle-fill event-includes-icon" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {event.guestRange && (
            <div className="event-guest-range">
              <i className="bi bi-people" />
              <span>Гості: {event.guestRange}</span>
            </div>
          )}

          <div className="event-modal-footer">
            <div>
              <div className="event-price-label">від</div>
              <div className="event-price-value">{formatPrice(event.price)}</div>
            </div>

            <button
              className="btn rounded-pill px-4 py-2 event-btn-primary"
              onClick={() => {
                onClose();
                onBook?.(event);
              }}
            >
              Оформити цей пакет
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// ── Картка події ──
const EventCard = ({ event, onBook }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { title, category, description, price, imageUrl } = event;

  return (
    <>
      <div className="card h-100 shadow-sm border-0 event-card-container">
        
        {/* Блок зображення в картці */}
        <div className="event-image-wrapper event-image-wrapper-card">
          {imageUrl ? (
            <img src={imageUrl} alt={title} loading="lazy" width={600} height={338} className="event-image" />
          ) : (
            <div className="event-missing-photo">
              <i className="bi bi-image" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}></i>
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Фото відсутнє</span>
            </div>
          )}

          {category && (
            <span className="event-category-badge event-badge-card">
              {category}
            </span>
          )}
        </div>

        {/* Тіло картки */}
        <div className="event-card-body">
          <h3 className="event-card-title">{title}</h3>
          <p className="event-card-desc">{description}</p>
        </div>

        {/* Підвал картки */}
        <div className="event-card-footer">
          <div>
            <div className="event-price-label">від</div>
            <div className="event-price-value">{formatPrice(price)}</div>
          </div>
          <button
            className="btn rounded-pill event-btn-outline"
            onClick={() => setModalOpen(true)}
          >
            Детальніше
          </button>
        </div>
      </div>

      {modalOpen && (
        <EventModal
          event={event}
          onClose={() => setModalOpen(false)}
          onBook={onBook}
        />
      )}
    </>
  );
};

export default EventCard;