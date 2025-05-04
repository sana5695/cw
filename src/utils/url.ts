/**
 * Утилиты для работы с URL в Next.js приложении
 */

/**
 * Возвращает путь с учетом базового пути (basePath) из переменной окружения
 * @param path Относительный путь в приложении
 * @returns Полный путь с учетом базового пути
 */
export function getAppPath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  // Убираем лишние слеши и соединяем пути
  return `${basePath}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Возвращает абсолютный URL, включая базовый путь
 * @param path Относительный путь в приложении
 * @returns Абсолютный URL
 */
export function getAbsoluteUrl(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  return `${baseUrl}${basePath}${path.startsWith('/') ? path : `/${path}`}`;
} 