import { collection, addDoc, deleteDoc, doc, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore'; 
import { db } from './firebase';

// Хелпер для конвертації файлу в Base64
const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

// Завантаження фото як Base64 у Firestore
export const uploadGalleryImageBase64 = async (file, altText = '') => {
  const base64String = await fileToBase64(file);
  
  const docRef = await addDoc(collection(db, 'gallery'), {
    url: base64String, // Сам контент зображення
    alt: altText || 'Фото з церемонії',
    createdAt: serverTimestamp()
  });

  return docRef.id;
};

// Отримання списку зображень (від нових до старих)
export const fetchGalleryImages = async () => {
  const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const deleteGalleryImage = async (imageId) => {
  try {
    const docRef = doc(db, 'gallery', imageId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Помилка видалення фото:", error);
    throw error;
  }
};