/**
 * Сервис для работы с ImgBB API
 * Документация API: https://api.imgbb.com/
 */

// API ключ для ImgBB, следует хранить в переменных окружения
// TODO: Добавьте в .env файл строку: IMGBB_API_KEY=ваш_ключ_api
const IMGBB_API_KEY = '6624623236b5115398184757711b6f35';

/**
 * Загружает изображение на ImgBB
 * @param file Файл изображения для загрузки
 * @param expiration Время хранения изображения в секундах (0 = без ограничений)
 * @returns Объект с данными загруженного изображения
 */
export const uploadImageToImgBB = async (
  file: File,
  expiration: number = 0
): Promise<ImgBBResponse> => {
  if (!IMGBB_API_KEY) {
    throw new Error('ImgBB API ключ не найден. Проверьте переменные окружения.');
  }

  const formData = new FormData();
  formData.append('key', IMGBB_API_KEY);
  formData.append('image', file);
  
  if (expiration > 0) {
    formData.append('expiration', expiration.toString());
  }

  try {
    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Ошибка при загрузке изображения: ${response.statusText}`);
    }

    const data: ImgBBApiResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.error?.message || 'Ошибка при загрузке изображения');
    }

    return data.data;
  } catch (error) {
    console.error('Ошибка при загрузке изображения в ImgBB:', error);
    throw error;
  }
};

/**
 * Загружает изображение из URL на ImgBB
 * @param imageUrl URL изображения для загрузки
 * @param expiration Время хранения изображения в секундах (0 = без ограничений)
 * @returns Объект с данными загруженного изображения
 */
export const uploadImageUrlToImgBB = async (
  imageUrl: string,
  expiration: number = 0
): Promise<ImgBBResponse> => {
  if (!IMGBB_API_KEY) {
    throw new Error('ImgBB API ключ не найден. Проверьте переменные окружения.');
  }

  const formData = new FormData();
  formData.append('key', IMGBB_API_KEY);
  formData.append('image', imageUrl);
  
  if (expiration > 0) {
    formData.append('expiration', expiration.toString());
  }

  try {
    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Ошибка при загрузке изображения: ${response.statusText}`);
    }

    const data: ImgBBApiResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.error?.message || 'Ошибка при загрузке изображения');
    }

    return data.data;
  } catch (error) {
    console.error('Ошибка при загрузке изображения в ImgBB:', error);
    throw error;
  }
};

// Интерфейсы для типизации ответов API ImgBB
export interface ImgBBApiResponse {
  data: ImgBBResponse;
  success: boolean;
  status: number;
  error?: {
    message: string;
    code: number;
  };
}

export interface ImgBBResponse {
  id: string;
  title: string;
  url_viewer: string;
  url: string;
  display_url: string;
  width: number;
  height: number;
  size: number;
  time: number;
  expiration: number;
  image: {
    filename: string;
    name: string;
    mime: string;
    extension: string;
    url: string;
  };
  thumb: {
    filename: string;
    name: string;
    mime: string;
    extension: string;
    url: string;
  };
  medium?: {
    filename: string;
    name: string;
    mime: string;
    extension: string;
    url: string;
  };
  delete_url: string;
} 