import { useState, useEffect } from 'react';
import { 
  FirebaseWatchCase,
  FirebaseWatchPart, 
  getWatchCaseWithCompatibleParts 
} from '@/services/watchDataService';

// Тип возвращаемого значения хука
type UseWatchCaseReturn = {
  watchCase: FirebaseWatchCase | null;
  compatibleParts: {
    dials: FirebaseWatchPart[];
    hands: FirebaseWatchPart[];
    rotors: FirebaseWatchPart[];
    straps: FirebaseWatchPart[];
    bezels: FirebaseWatchPart[];
  };
  loading: boolean;
  error: string | null;
  refreshCase: () => Promise<void>;
};

/**
 * Преобразование временных меток Firestore в ISO строку
 */
const convertTimestamp = (timestamp: any): string | null => {
  if (!timestamp) return null;
  if (typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toISOString();
  }
  return timestamp;
};

/**
 * Преобразование объекта Firestore в простой объект
 */
const convertFirestoreObject = <T extends object>(obj: T): T => {
  if (!obj) return obj;
  const result = { ...obj } as any;
  
  // Преобразуем Timestamp поля
  if (result.createdAt) result.createdAt = convertTimestamp(result.createdAt);
  if (result.updatedAt) result.updatedAt = convertTimestamp(result.updatedAt);
  
  return result as T;
};

/**
 * Хук для получения данных о конкретном корпусе часов и совместимых деталях
 */
export function useWatchCase(caseId: string): UseWatchCaseReturn {
  const [watchCase, setWatchCase] = useState<FirebaseWatchCase | null>(null);
  const [compatibleParts, setCompatibleParts] = useState<{
    dials: FirebaseWatchPart[];
    hands: FirebaseWatchPart[];
    rotors: FirebaseWatchPart[];
    straps: FirebaseWatchPart[];
    bezels: FirebaseWatchPart[];
  }>({
    dials: [],
    hands: [],
    rotors: [],
    straps: [],
    bezels: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Функция для загрузки данных о корпусе и деталях
  const loadWatchCase = async () => {
    if (!caseId) {
      setError('ID корпуса не указан');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Получаем корпус и совместимые детали за один запрос
      const result = await getWatchCaseWithCompatibleParts(caseId);
      
      // Преобразуем корпус
      if (result.watchCase) {
        setWatchCase(convertFirestoreObject(result.watchCase));
      } else {
        setWatchCase(null);
        setError('Корпус не найден');
      }

      // Преобразуем совместимые детали
      setCompatibleParts({
        dials: result.compatibleParts.dials.map(convertFirestoreObject),
        hands: result.compatibleParts.hands.map(convertFirestoreObject),
        rotors: result.compatibleParts.rotors.map(convertFirestoreObject),
        straps: result.compatibleParts.straps.map(convertFirestoreObject),
        bezels: result.compatibleParts.bezels.map(convertFirestoreObject)
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке данных о корпусе');
      console.error('Ошибка при загрузке данных о корпусе:', err);
    } finally {
      setLoading(false);
    }
  };

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    loadWatchCase();
  }, [caseId]);

  // Функция для обновления данных
  const refreshCase = async () => {
    await loadWatchCase();
  };

  return {
    watchCase,
    compatibleParts,
    loading,
    error,
    refreshCase
  };
} 