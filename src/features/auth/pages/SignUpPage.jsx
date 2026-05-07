import React from 'react';
import AuthCard from '../../../components/common/molecules/AuthCard';
import SignUpForm from '../components/SignUpForm';

const SignUpPage = ({ onSuccess, onGoLogin }) => (
  <AuthCard title="Реєстрація" subtitle="Створіть акаунт, щоб почати">
    <SignUpForm onSuccess={onSuccess} onGoLogin={onGoLogin} />
  </AuthCard>
);
export default SignUpPage;