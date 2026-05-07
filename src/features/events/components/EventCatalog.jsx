import React, { useState } from 'react';
import useEvents from '../hooks/useEvents';
import EventCard from '../../../components/common/molecules/EventCard';
import SkeletonCard from '../../../components/common/molecules/SkeletonCard';
import EventDetailModal from './EventDetailModal';
import './EventCatalog.css'; 

// onBook — колбек для переходу до RSVP з попередньо заповненим пакетом
const EventCatalog = ({ onBook }) => {
  const { events, loading, error } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleBook = (event) => {
    setSelectedEvent(null);
    onBook?.(event);
  };

  if (loading) {
    return (
      <div className="row g-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="col-12 col-sm-6 col-lg-4">
            <SkeletonCard />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="catalog-feedback-container">
        <i className="bi bi-wifi-off catalog-feedback-icon" />
        <h3 className="catalog-feedback-title">
          Не вдалося завантажити заходи
        </h3>
        <p className="catalog-feedback-text">{error}</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="catalog-feedback-container">
        <i className="bi bi-calendar-x catalog-feedback-icon" />
        <h3 className="catalog-feedback-title">
          Заходів ще немає
        </h3>
        <p className="catalog-feedback-text">
          Незабаром тут з'являться наші пакети урочистостей.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="row g-4">
        {events.map((event) => (
          <div key={event.id} className="col-12 col-sm-6 col-lg-4">
            <EventCard 
              event={event} 
              onDetails={setSelectedEvent} 
              onBook={handleBook} 
            />
          </div>
        ))}
      </div>

      {/* Модалка деталей */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onBook={onBook}
        />
      )}
    </>
  );
};

export default EventCatalog;