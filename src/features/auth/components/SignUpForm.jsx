import React from 'react';
import { signUp } from '../../../services/firebase/authService';
import { useAuthForm } from '../hooks/useAuthForm';
import Input from '../../../components/common/atoms/Input';
import Button from '../../../components/common/atoms/Button';
import AlertMessage from '../../../components/common/atoms/AlertMessage';

const SignUpForm = ({ onSuccess, onGoLogin }) => {
  const {
    fields, errors, loading, serverError, success,
    setField, setLoading, setServerError, setSuccess, validateSignUp,
  } = useAuthForm({ firstName: '', lastName: '', email: '', password: '', confirm: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateSignUp()) return;
    setLoading(true);
    try {
      await signUp(fields.email, fields.password, fields.firstName, fields.lastName);
      setSuccess('Акаунт створено! Ласкаво просимо 🎉');
      setTimeout(() => onSuccess?.(), 1200);
    } catch (err) {
      setServerError(err.message || 'Помилка реєстрації.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <AlertMessage type="error" message={serverError} />
      <AlertMessage type="success" message={success} />
      {(serverError || success) && <div style={{ marginBottom: 'var(--space-4)' }} />}

      {/* Ім'я та прізвище в одному рядку */}
      <div className="row g-3">
        <div className="col-6">
          <Input id="signup-firstname" label="Імʼя" required
                 value={fields.firstName} onChange={(e) => setField('firstName', e.target.value)}
                 placeholder="Іван" error={errors.firstName} />
        </div>
        <div className="col-6">
          <Input id="signup-lastname" label="Прізвище" required
                 value={fields.lastName} onChange={(e) => setField('lastName', e.target.value)}
                 placeholder="Петренко" error={errors.lastName} />
        </div>
      </div>

      <Input id="signup-email" label="Email" type="email" required
             value={fields.email} onChange={(e) => setField('email', e.target.value)}
             placeholder="your@email.com" error={errors.email} />

      <Input id="signup-password" label="Пароль" type="password" required
             value={fields.password} onChange={(e) => setField('password', e.target.value)}
             placeholder="Мінімум 6 символів" error={errors.password} />

      <Input id="signup-confirm" label="Підтвердьте пароль" type="password" required
             value={fields.confirm} onChange={(e) => setField('confirm', e.target.value)}
             placeholder="Повторіть пароль" error={errors.confirm} />

      <Button type="submit" loading={loading} disabled={!!success} fullWidth>
        <i className="bi bi-person-plus me-1" />
        Створити акаунт
      </Button>

      <p style={{ textAlign: 'center', marginTop: 'var(--space-5)',
                  fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
        Вже маєте акаунт?{' '}
        <button type="button" onClick={onGoLogin}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)',
                         fontWeight: 600, cursor: 'pointer', padding: 0 }}>
          Увійти
        </button>
      </p>
    </form>
  );
};

export default SignUpForm;