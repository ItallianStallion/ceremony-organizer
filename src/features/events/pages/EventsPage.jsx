import React from 'react';
import EventCatalog from '../components/EventCatalog';

const EventsPage = ({ onNavigate, onBookEvent }) => (
  <main>
    <section style={{ background: 'var(--color-primary-light)', padding: 'var(--space-12) 0 var(--space-8)' }}>
      <div className="container">
        <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.1em', color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
          Наші послуги
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-4)' }}>
          Пакети урочистостей
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-muted)',
                    maxWidth: '52ch', lineHeight: 1.65 }}>
          Від інтимних вечорів до масштабних торжеств — ми маємо ідеальний пакет для кожної події.
        </p>
      </div>
    </section>
    <section style={{ padding: 'var(--space-12) 0' }}>
      <div className="container">
        {/* onBook переводить на RSVP із заповненим пакетом */}
        <EventCatalog onBook={onBookEvent} />
      </div>
    </section>
  </main>
);
export default EventsPage;