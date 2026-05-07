import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../../services/firebase/firebase';

const useGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // 1. Створюємо запит до колекції gallery у Firestore
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));

    // 2. Вмикаємо слухач реального часу
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setImages(docs);
      setLoading(false);
    }, (err) => {
      console.error("Firebase Error:", err);
      setError('Не вдалося завантажити фото: ' + err.message);
      setLoading(false);
    });

    // 3. Чистимо підписку при виході
    return () => unsubscribe();
  }, []);

  return { images, loading, error };
};

export default useGallery;