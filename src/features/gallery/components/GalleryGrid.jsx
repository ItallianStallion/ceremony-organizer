import React, { useState } from 'react';
import useGallery from '../hooks/useGallery';
import './GalleryGrid.css';

// Легкий lightbox
const Lightbox = ({ image, onClose }) => (
  <div className="lightbox-overlay" onClick={onClose}>
    <img 
      src={image.url} 
      alt={image.alt || 'Gallery image'} 
      loading="lazy"
      className="lightbox-image"
      onClick={(e) => e.stopPropagation()} 
    />
    <button 
      onClick={onClose} 
      aria-label="Закрити"
      className="lightbox-close-btn"
    >
      <i className="bi bi-x-lg" />
    </button>
  </div>
);

const GalleryGrid = () => {
  const { images, loading, error } = useGallery();
  const [selected, setSelected] = useState(null);

  if (loading) {
    return (
      <div className="row g-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="col-6 col-md-4 col-lg-3">
            <div className="skeleton gallery-skeleton" />
          </div>
        ))}
      </div>
    );
  }

  if (error || images.length === 0) {
    return (
      <div className="gallery-feedback-container">
        <i className="bi bi-camera gallery-feedback-icon" />
        <p className="gallery-feedback-text">{error || 'Галерея порожня'}</p>
      </div>
    );
  }

  return (
    <>
      <div className="row g-3">
        {images.map((img) => (
          <div key={img.id} className="col-6 col-md-4 col-lg-3">
            <div className="gallery-item" onClick={() => setSelected(img)}>
              {/* Тут ми беремо img.url, де лежить твій Base64 */}
              <img 
                src={img.url} 
                alt={img.alt || 'Фото галереї'} 
                className="gallery-image" 
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Модалка */}
      {selected && (
        <Lightbox 
          image={selected} 
          onClose={() => setSelected(null)} 
        />
      )}
    </>
  );
};

export default GalleryGrid;