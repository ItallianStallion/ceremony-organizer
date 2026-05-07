import React from 'react';
import AuthCard from '../../../components/common/molecules/AuthCard';
import LoginForm from '../components/LoginForm';

const LoginPage = ({ onSuccess, onGoSignUp }) => (
  <AuthCard title="З поверненням" subtitle="Увійдіть, щоб продовжити">
    <LoginForm onSuccess={onSuccess} onGoSignUp={onGoSignUp} />
  </AuthCard>
);
export default LoginPage;