import React, { useState } from 'react';
import { uploadGalleryImageBase64, deleteGalleryImage } from '../../services/firebase/galleryService';
import useGallery from '../../features/gallery/hooks/useGallery'; 
import Button from '../../components/common/atoms/Button';
import styles from './GalleryManager.module.css'; 

const GalleryManager = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  
  const { images, loading: galleryLoading } = useGallery();

  const handleUpload = async () => {
    if (!file) return;
    if (file.size > 900000) { 
      setStatus('❌ Файл занадто великий. Використовуйте фото до 900 КБ.');
      return;
    }
    setLoading(true);
    setStatus('⌛ Обробка зображення...');
    try {
      await uploadGalleryImageBase64(file);
      setStatus('✅ Фото успішно додано!');
      setFile(null);
      document.getElementById('gallery-input').value = '';
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setStatus('❌ Помилка: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Видалити це фото назавжди?')) return;
    try {
      await deleteGalleryImage(id);
    } catch (err) {
      alert('Помилка видалення: ' + err.message);
    }
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Керування портфоліо</h3>
      
      <div className="d-flex gap-3 align-items-end mb-4">
        <div className="flex-grow-1">
          <label className={styles.label}>Додати нове фото (до 900 КБ)</label>
          <input 
            id="gallery-input"
            type="file" 
            accept="image/*"
            className="form-control"
            onChange={(e) => {
              setFile(e.target.files[0]);
              setStatus('');
            }}
          />
        </div>
        <Button onClick={handleUpload} disabled={!file || loading} loading={loading}>
          Завантажити
        </Button>
      </div>

      {status && (
        <div className={`${styles.statusMessage} ${status.includes('✅') ? styles.statusSuccess : styles.statusError}`}>
          {status}
        </div>
      )}

      <h5 className="fw-bold mb-3" style={{ color: '#495057' }}>Поточні фото ({images.length})</h5>
      
      {galleryLoading ? (
        <div>Завантаження списку...</div>
      ) : (
        <div className="row g-3">
          {images.map((img) => (
            <div key={img.id} className="col-4 col-md-3">
              <div className={styles.imageWrapper}>
                <img src={img.url} alt="Gallery item" className={styles.imageThumb} />
                <button onClick={() => handleDelete(img.id)} className={styles.deleteBtn} title="Видалити">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
          </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryManager;