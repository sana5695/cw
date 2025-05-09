import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin, adminLogout, getCurrentUser } from '@/services/authService';

/**
 * Хук для работы с авторизацией в админ-панели
 */
export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Проверка авторизации при загрузке
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Проверка статуса авторизации
   */
  const checkAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      const isAuth = await Boolean(getCurrentUser());
      setIsAuthenticated(isAuth);
    } catch (err) {
      console.error('Ошибка при проверке авторизации', err);
      setError('Не удалось проверить статус авторизации');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Вход в систему
   */
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      await adminLogin(email, password);
      setIsAuthenticated(true);
      router.push('/admin');
      return true;
    } catch (err: any) {
      setError(err.message || 'Ошибка при входе в систему');
      setIsAuthenticated(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Выход из системы
   */
  const logout = async () => {
    try {
      setLoading(true);
      await adminLogout();
      setIsAuthenticated(false);
      router.push('/admin/login');
      return true;
    } catch (err: any) {
      setError(err.message || 'Ошибка при выходе из системы');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    checkAuth
  };
} 