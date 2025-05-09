import { getWatchCaseWithCompatibleParts } from '@/services/watchDataService';

// Кэш для предзагруженных данных
const prefetchCache = new Set<string>();

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
    // Запускаем предзагрузку в фоновом режиме
    getWatchCaseWithCompatibleParts(caseName).catch(() => {
      // Если произошла ошибка, удаляем из кэша, чтобы попытаться загрузить снова при следующей попытке
      prefetchCache.delete(caseName);
    });
  } catch (error) {
    // В случае ошибки удаляем из кэша
    prefetchCache.delete(caseName);
  }
}; 