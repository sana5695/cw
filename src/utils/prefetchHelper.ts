import { getWatchCaseWithCompatibleParts } from '@/services/watchDataService';

// Кэш для предзагруженных данных и результатов
const prefetchCache = new Set<string>();
const dataCache = new Map<string, any>();

/**
 * Предзагружает данные для конкретного корпуса часов
 * @param caseName Название корпуса
 */
export const prefetchCaseData = async (caseName: string): Promise<void> => {
  // Проверяем, не были ли уже предзагружены данные для этого корпуса
  if (prefetchCache.has(caseName)) {
    return;
  }
  
  // Добавляем имя в кэш, чтобы избежать повторных запросов
  prefetchCache.add(caseName);
  
  try {
    // Низкий приоритет для предзагрузки, чтобы не блокировать основной поток
    setTimeout(() => {
      getWatchCaseWithCompatibleParts(caseName)
        .then((data) => {
          // Сохраняем результат в кэше для потенциального использования
          dataCache.set(caseName, data);
        })
        .catch(() => {
          prefetchCache.delete(caseName);
        });
    }, 0);
  } catch (error) {
    prefetchCache.delete(caseName);
  }
};

/**
 * Получает предварительно загруженные данные для корпуса
 * @param caseName Название корпуса
 * @returns Предварительно загруженные данные или null, если их нет
 */
export const getPrefetchedData = (caseName: string): any => {
  return dataCache.get(caseName) || null;
}; 