import {
  collection, addDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export const createRsvp = async (data) => {
  const { userId, ...rest } = data;

  const clean = Object.fromEntries(
    Object.entries(rest).filter(([, v]) => v !== undefined)
  );

  const payload = {
    ...clean,
    userId:    userId ?? null,
    status:    'pending',
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, 'orders'), payload);
  return { id: docRef.id, ...clean };
};