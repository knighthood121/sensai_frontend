import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupScreen from './SignupScreen';
import { useRegisterMutation } from '../../../service/authApi';
import { useToast } from '../../../components/common/Toast';

export default function Signup() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [register, { isLoading }] = useRegisterMutation();
  const [error, setError] = useState('');

  const handleBackClick = () => {
    navigate('/login');
  };

  const handleSubmit = async (name: string, email: string, pass: string, phone?: string) => {
    setError('');
    try {
      await register({ name, email, password: pass, phone }).unwrap();
      showToast('Account created successfully! Welcome to Sansei.');
      navigate('/');
    } catch (err: any) {
      console.error('Registration failed:', err);
      const errMsg = err?.data?.message || 'Registration failed. Please try again.';
      setError(errMsg);
      showToast(errMsg, 'error');
    }
  };

  return (
    <SignupScreen
      onBackClick={handleBackClick}
      onSubmit={handleSubmit}
      error={error}
      isLoading={isLoading}
    />
  );
}
