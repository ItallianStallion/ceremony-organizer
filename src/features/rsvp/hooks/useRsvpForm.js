import { useState, useCallback, useEffect } from 'react';
import { isValidEmail } from '../../../utils/formatters';
import { createRsvp } from '../../../services/firebase/firestoreService';
import { useAuth } from '../../../app/providers/AuthProvider';
import { useEvents } from '../../../app/providers/EventsProvider'; // ← ДОДАТИ
import {useRef } from 'react'; 


const MIN_DATE_OFFSET_DAYS = 30;

const getMinDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + MIN_DATE_OFFSET_DAYS);
  return d.toISOString().split('T')[0];
};

const makeInitial = (eventId = '') => ({
  fullName: '', email: '',
  eventId,
  desiredDate: '', attendanceStatus: 'attending',
  guestCount: 1, foodPreference: 'none',
  selectedAddons: [], notes: '',
});


const useRsvpForm = (preselectedEvent) => {
  const { currentUser } = useAuth();
  const { events, eventsLoading } = useEvents(); // ← ДОДАТИ

  const [fields, setFields] = useState(() =>
    makeInitial(preselectedEvent?.id ?? '')
  );
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [serverError, setServerError] = useState('');

  const initializedRef = useRef(false);

  // Коли events завантажились з Firestore — встановлюємо перший якщо eventId ще порожній
 useEffect(() => {
  if (!eventsLoading && events.length > 0 && !initializedRef.current) {
    initializedRef.current = true;
    setFields((prev) => {
      if (prev.eventId) return prev; // вже встановлено через preselectedEvent
      return { ...prev, eventId: events[0].id };
    });
  }
}, [eventsLoading, events]);

  useEffect(() => {
    if (preselectedEvent?.id) {
      setFields((prev) => ({ ...prev, eventId: preselectedEvent.id, selectedAddons: [] }));
    }
  }, [preselectedEvent?.id]);

  useEffect(() => {
    if (currentUser) {
      setFields((prev) => ({
        ...prev,
        email: currentUser.email || prev.email,
        fullName: currentUser.firstName
          ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim()
          : prev.fullName,
      }));
    }
  }, [currentUser]);

  const setField = useCallback((name, value) => {
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setServerError('');
  }, []);

  const toggleAddon = useCallback((addonId) => {
    setFields((prev) => ({
      ...prev,
      selectedAddons: prev.selectedAddons.includes(addonId)
        ? prev.selectedAddons.filter((id) => id !== addonId)
        : [...prev.selectedAddons, addonId],
    }));
  }, []);

  // ← ГОЛОВНЕ ВИПРАВЛЕННЯ: шукаємо в events з Firestore, не в MOCK_EVENTS
  const selectedEvent = events.find((e) => e.id === fields.eventId) ?? events[0] ?? null;

  const totalPrice = selectedEvent
    ? selectedEvent.price + (selectedEvent.addons || [])
        .filter((a) => fields.selectedAddons.includes(a.id))
        .reduce((sum, a) => sum + a.price, 0)
    : 0;

  const minDate = getMinDate();

  const validate = useCallback(() => {
    if (!selectedEvent) return false;
    const e = {};
    if (!fields.fullName.trim()) e.fullName = "Вкажіть ім'я";
    else if (fields.fullName.trim().length < 2) e.fullName = 'Мінімум 2 символи';
    if (!fields.email.trim()) e.email = 'Email є обовʼязковим';
    else if (!isValidEmail(fields.email)) e.email = 'Введіть коректний email';
    if (!fields.desiredDate) e.desiredDate = 'Оберіть бажану дату';
    else if (fields.desiredDate < minDate) e.desiredDate = `Найраніша можлива дата: ${minDate}`;
    if (!fields.attendanceStatus) e.attendanceStatus = 'Оберіть статус';
    const gc = Number(fields.guestCount);
    if (!gc || gc < selectedEvent.minGuests)
      e.guestCount = `Мінімум ${selectedEvent.minGuests} гостей для цього пакету`;
    else if (gc > selectedEvent.maxGuests)
      e.guestCount = `Максимум ${selectedEvent.maxGuests} гостей`;
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [fields, selectedEvent, minDate]);

const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError('');
    try {
      const orderData = {
        ...fields,
        guestCount:    Number(fields.guestCount),
        eventTitle:    selectedEvent.title,
        eventCategory: selectedEvent.category || '',
        totalPrice,
        createdAt:     new Date().toISOString(),
        status:        'pending',
        // ✅ 1. Зробили правильний fallback для гостей
        userId:        currentUser?.uid || 'guest', 
        // ❌ 2. Рядок з id: order_... ВИДАЛЕНО! Firestore сам створить правильний ID
      };
      
      // Відправляємо в базу
      await createRsvp(orderData);
      
      // ❌ 3. addOrder(orderData) ВИДАЛЕНО! 
      // onSnapshot з OrdersProvider сам миттєво підтягне замовлення з бази з ПРАВИЛЬНИМ ID
      
      setSuccess(`Замовлення успішно оформлено! Ми зв'яжемось з вами найближчим часом.`);
      setFields(makeInitial()); // скидаємо форму
    } catch (err) {
      setServerError(err.message || 'Помилка надсилання. Спробуйте ще раз.');
    } finally {
      setLoading(false);
    }
  }, [fields, validate, selectedEvent, totalPrice, currentUser]); // ✅ Прибрали addOrder з залежностей

  return {
    fields, errors, loading, success, serverError,
    setField, toggleAddon, handleSubmit,
    selectedEvent, totalPrice, minDate,
    eventsLoading, events, // ← передаємо далі для dropdown
  };
};

export default useRsvpForm;