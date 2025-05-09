import { useState, useEffect } from 'react';
import { useAdminAuth } from './useAdminAuth';

/**
 * Хук для работы с формой логина
 */
export function useLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const { login, loading, error } = useAdminAuth();

  // Проверка валидности формы
  useEffect(() => {
    const isValid = email.trim() !== '' && password.trim().length >= 6;
    setIsFormValid(isValid);
  }, [email, password]);

  // Обработка изменения email
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // Обработка изменения пароля
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  // Обработка отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      return;
    }
    
    await login(email, password);
  };

  return {
    email,
    password,
    loading,
    error,
    isFormValid,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit
  };
} 