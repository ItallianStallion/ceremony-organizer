// Форма входу
import React from 'react';
import { signIn } from '../../../services/firebase/authService';
import { useAuthForm } from '../hooks/useAuthForm';
import Input from '../../../components/common/atoms/Input';
import Button from '../../../components/common/atoms/Button';
import AlertMessage from '../../../components/common/atoms/AlertMessage';

const LoginForm = ({ onSuccess, onGoSignUp }) => {
  const { fields, errors, loading, serverError, setField,
          setLoading, setServerError, validateLogin } = useAuthForm({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setLoading(true);
    try {
      await signIn(fields.email, fields.password);
      onSuccess?.();
    } catch (err) {
      setServerError(err.message || 'Помилка входу. Спробуйте ще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <AlertMessage type="error" message={serverError} />
      {serverError && <div style={{ marginBottom: 'var(--space-4)' }} />}

      <Input id="login-email" label="Email" type="email" required
             value={fields.email} onChange={(e) => setField('email', e.target.value)}
             placeholder="your@email.com" error={errors.email} />

      <Input id="login-password" label="Пароль" type="password" required
             value={fields.password} onChange={(e) => setField('password', e.target.value)}
             placeholder="Мінімум 6 символів" error={errors.password} />

      <Button type="submit" loading={loading} fullWidth style={{ marginTop: 'var(--space-2)' }}>
        <i className="bi bi-box-arrow-in-right me-1" />
        Увійти
      </Button>

      <p style={{ textAlign: 'center', marginTop: 'var(--space-5)',
                  fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
        Ще не маєте акаунту?{' '}
        <button type="button" onClick={onGoSignUp}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)',
                         fontWeight: 600, cursor: 'pointer', padding: 0 }}>
          Зареєструватися
        </button>
      </p>
    </form>
  );
};
export default LoginForm;