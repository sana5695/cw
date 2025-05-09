import { useState, useEffect } from 'react';
import { FirebaseWatchCase, getAllWatchCases } from '@/services/watchDataService';

type UseWatchCasesReturn = {
  cases: FirebaseWatchCase[];
  loading: boolean;
  error: string | null;
  refreshCases: () => Promise<void>;
};

/**
 * Хук для работы с корпусами часов
 * Отвечает за загрузку, обработку ошибок и форматирование данных
 */
export function useWatchCases(): UseWatchCasesReturn {
  const [cases, setCases] = useState<FirebaseWatchCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Функция загрузки корпусов часов
  const loadCases = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const fetchedCases = await getAllWatchCases();
      setCases(fetchedCases);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке корпусов');
      console.error('Ошибка при загрузке корпусов:', err);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadCases();
  }, []);

  // Функция для обновления данных
  const refreshCases = async () => {
    await loadCases();
  };

  return {
    cases,
    loading,
    error,
    refreshCases
  };
}

/**
 * Форматирование цены для отображения
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  }).format(price);
} 