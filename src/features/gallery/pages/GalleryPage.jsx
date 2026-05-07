import React from 'react';
import GalleryGrid from '../components/GalleryGrid';

const GalleryPage = () => (
  <main>
    <section style={{ background: 'var(--color-primary-light)', padding: 'var(--space-12) 0 var(--space-8)' }}>
      <div className="container">
        <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.1em', color: 'var(--color-primary)', marginBottom: 'var(--space-3)' }}>
          Портфоліо
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)',
                     marginBottom: 'var(--space-4)' }}>
          Наші урочистості
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-muted)',
                    maxWidth: '52ch', lineHeight: 1.65 }}>
          Кожна фотографія — це спогад, який ми допомогли створити.
        </p>
      </div>
    </section>
    <section style={{ padding: 'var(--space-12) 0' }}>
      <div className="container">
        <GalleryGrid />
      </div>
    </section>
  </main>
);
export default GalleryPage;