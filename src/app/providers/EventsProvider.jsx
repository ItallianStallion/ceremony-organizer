import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  collection, onSnapshot, doc,
  addDoc, updateDoc, deleteDoc,
  getDocs,
} from 'firebase/firestore';
import { db } from '../../services/firebase/firebase'; 

const EventsContext = createContext(null);
const uid = () => Math.random().toString(36).slice(2, 10);

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const EventsProvider = ({ children }) => {
  const [events, setEvents]               = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'events'), (snap) => {
      setEvents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setEventsLoading(false);
    });
    return () => unsub();
  }, []);

  const updateEvent = useCallback((id, patch) =>
    updateDoc(doc(db, 'events', id), patch), []);

  const addEvent = useCallback((data = {}) =>
    addDoc(collection(db, 'events'), {
      title: 'Новий пакет', description: '',
      price: 0, guestRange: '10–50',
      minGuests: 10, maxGuests: 50,
      imageUrl: null, 
      includes: [], addons: [],
      ...data,
    }), []);

  const removeEvent = useCallback((id) =>
    deleteDoc(doc(db, 'events', id)), []);

  const uploadEventImage = useCallback(async (eventId, file) => {
    if (!file) throw new Error('No file');

    if (file.size > 700 * 1024) {
      throw new Error('Файл завеликий. Максимум 700KB.');
    }

    const base64 = await fileToBase64(file);
    
    await updateDoc(doc(db, 'events', eventId), { imageUrl: base64 }); 
    return base64;
  }, []);

  const addAddon = useCallback((eventId, addon) => {
    const ev = events.find((e) => e.id === eventId);
    return updateDoc(doc(db, 'events', eventId), {
      addons: [...(ev?.addons || []), { id: uid(), ...addon }],
    });
  }, [events]);

  const updateAddon = useCallback((eventId, addonId, patch) => {
    const ev = events.find((e) => e.id === eventId);
    return updateDoc(doc(db, 'events', eventId), {
      addons: ev.addons.map((a) => a.id === addonId ? { ...a, ...patch } : a),
    });
  }, [events]);

  const removeAddon = useCallback((eventId, addonId) => {
    const ev = events.find((e) => e.id === eventId);
    return updateDoc(doc(db, 'events', eventId), {
      addons: ev.addons.filter((a) => a.id !== addonId),
    });
  }, [events]);

  const addInclude = useCallback((eventId, item) => {
    const ev = events.find((e) => e.id === eventId);
    return updateDoc(doc(db, 'events', eventId), {
      includes: [...(ev?.includes || []), item],
    });
  }, [events]);

  const removeInclude = useCallback((eventId, index) => {
    const ev = events.find((e) => e.id === eventId);
    return updateDoc(doc(db, 'events', eventId), {
      includes: ev.includes.filter((_, i) => i !== index),
    });
  }, [events]);

  const resetToDefault = useCallback(async () => {
    if (!window.confirm('Скинути всі пакети до початкових?')) return;
    const snap = await getDocs(collection(db, 'events'));
    await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
    const { MOCK_EVENTS } = await import('../../utils/mockData');
    await Promise.all(
      MOCK_EVENTS.map(({ id, ...data }) =>
        addDoc(collection(db, 'events'), data)
      )
    );
  }, []);

  return (
    <EventsContext.Provider value={{
      events, eventsLoading,
      updateEvent, addEvent, removeEvent,
      uploadEventImage,
      addAddon, updateAddon, removeAddon,
      addInclude, removeInclude,
      resetToDefault,
    }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error('useEvents must be used within EventsProvider');
  return ctx;
};