import React, { useEffect } from 'react';
import { formatPrice } from '../../../utils/formatters';
import './EventDetailModal.css'; 

const EventDetailModal = ({ event, onClose, onBook }) => {
  // Закриття по Escape та блокування скролу екрану
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!event) return null;

  return (
    <div
      className="event-modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="modal-title"
    >
      <div className="event-modal-container">

        {/* Фото */}
        <div className="event-modal-image-wrapper">
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            loading="lazy"
            className="event-modal-image" 
          />
          
          {/* Кнопка закрити */}
          <button 
            onClick={onClose} 
            aria-label="Закрити"
            className="event-modal-close-btn"
          >
            <i className="bi bi-x-lg" />
          </button>
          
          {/* Бейдж категорії */}
          <span className="event-modal-category-badge">
            {event.category}
          </span>
        </div>

        {/* Контент */}
        <div className="event-modal-content">
          <h2 id="modal-title" className="event-modal-title">
            {event.title}
          </h2>
          <p className="event-modal-description">
            {event.description}
          </p>

          {/* Що входить */}
          <div className="event-modal-includes-box">
            <p className="event-modal-includes-title">
              Що входить у пакет
            </p>
            <ul className="event-modal-includes-list">
              {(event.details || []).map((item, i) => (
                <li key={i} className="event-modal-includes-item">
                  <i className="bi bi-check2-circle event-modal-includes-icon" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Ціна + кнопка */}
          <div className="event-modal-footer">
            <div>
              <div className="event-modal-price-label">від</div>
              <div className="event-modal-price-value">
                {formatPrice(event.minPrice)}
              </div>
            </div>
            
            <button 
              className="btn-primary-custom event-modal-book-btn" 
              onClick={() => onBook(event)}
            >
              <i className="bi bi-calendar-check me-1" />
              Оформити цей пакет
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;