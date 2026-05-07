import { useState, useCallback } from 'react';
import { isValidEmail } from '../../../utils/formatters';

export const useAuthForm = (initialState) => {
  const [fields, setFields] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');

  const setField = useCallback((name, value) => {
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setServerError('');
  }, []);

  const validateLogin = useCallback(() => {
    const e = {};
    if (!fields.email.trim()) e.email = 'Email є обовʼязковим';
    else if (!isValidEmail(fields.email)) e.email = 'Введіть коректний email';
    if (!fields.password) e.password = 'Пароль є обовʼязковим';
    else if (fields.password.length < 6) e.password = 'Мінімум 6 символів';
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [fields]);

  const validateSignUp = useCallback(() => {
    const e = {};
    // Валідація імені та прізвища
    if (!fields.firstName?.trim()) e.firstName = "Вкажіть ім'я";
    if (!fields.lastName?.trim()) e.lastName = 'Вкажіть прізвище';
    if (!fields.email.trim()) e.email = 'Email є обовʼязковим';
    else if (!isValidEmail(fields.email)) e.email = 'Введіть коректний email';
    if (!fields.password) e.password = 'Пароль є обовʼязковим';
    else if (fields.password.length < 6) e.password = 'Мінімум 6 символів';
    if (fields.confirm !== fields.password) e.confirm = 'Паролі не збігаються';
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [fields]);

  return {
    fields, errors, loading, serverError, success,
    setField, setLoading, setServerError, setSuccess,
    validateLogin, validateSignUp,
  };
};