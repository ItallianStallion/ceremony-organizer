import { useState, useCallback } from 'react';
import { isValidEmail } from '../../../utils/formatters';
import { updateProfile, updatePassword } from '../../../services/firebase/authService';

const useProfileForm = (currentUser) => {
  const [info, setInfo] = useState({
    firstName: currentUser?.firstName || '',
    lastName:  currentUser?.lastName  || '',
    email:     currentUser?.email     || '',
  });
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [infoErrors,  setInfoErrors]  = useState({});
  const [passErrors,  setPassErrors]  = useState({});
  const [infoLoading, setInfoLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [infoSuccess, setInfoSuccess] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [infoError,   setInfoError]   = useState('');
  const [passError,   setPassError]   = useState('');

  const setInfoField = useCallback((k, v) => {
    setInfo((p) => ({ ...p, [k]: v }));
    setInfoErrors((p) => ({ ...p, [k]: '' }));
    setInfoError('');
  }, []);

  const setPassField = useCallback((k, v) => {
    setPasswords((p) => ({ ...p, [k]: v }));
    setPassErrors((p) => ({ ...p, [k]: '' }));
    setPassError('');
  }, []);

  const validateInfo = useCallback(() => {
    const e = {};
    if (!info.firstName.trim()) e.firstName = "Вкажіть ім'я";
    if (!info.email.trim()) e.email = 'Email є обовʼязковим';
    else if (!isValidEmail(info.email)) e.email = 'Введіть коректний email';
    setInfoErrors(e);
    return Object.keys(e).length === 0;
  }, [info]);

  const validatePass = useCallback(() => {
    const e = {};
    if (!passwords.current) e.current = 'Введіть поточний пароль';
    if (!passwords.next) e.next = 'Введіть новий пароль';
    else if (passwords.next.length < 6) e.next = 'Мінімум 6 символів';
    if (passwords.next !== passwords.confirm) e.confirm = 'Паролі не збігаються';
    setPassErrors(e);
    return Object.keys(e).length === 0;
  }, [passwords]);

  const handleInfoSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateInfo()) return;
    setInfoLoading(true);
    try {
      await updateProfile({ firstName: info.firstName, lastName: info.lastName, email: info.email });
      setInfoSuccess('Профіль оновлено!');
      setTimeout(() => setInfoSuccess(''), 3000);
    } catch (err) {
      setInfoError(err.message || 'Помилка збереження. Спробуйте ще раз.');
    } finally {
      setInfoLoading(false);
    }
  }, [info, validateInfo]);

  const handlePassSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validatePass()) return;
    setPassLoading(true);
    try {
      await updatePassword({ current: passwords.current, next: passwords.next });
      setPassSuccess('Пароль змінено!');
      setPasswords({ current: '', next: '', confirm: '' });
      setTimeout(() => setPassSuccess(''), 3000);
    } catch (err) {
      setPassError(err.message || 'Помилка. Перевірте поточний пароль.');
    } finally {
      setPassLoading(false);
    }
  }, [passwords, validatePass]);

  return {
    info, passwords, infoErrors, passErrors,
    infoLoading, passLoading, infoSuccess, passSuccess, infoError, passError,
    setInfoField, setPassField, handleInfoSubmit, handlePassSubmit,
  };
};

export default useProfileForm;