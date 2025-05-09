import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import CustomizeClient from '@/components/CustomizeClient';
import { 
  getWatchCaseWithCompatibleParts,
  FirebaseWatchCase, 
  FirebaseWatchPart 
} from '@/services/watchDataService';
import { getPrefetchedData } from '@/utils/prefetchHelper';

// Функция для преобразования Firestore Timestamp в ISO строку
const convertTimestamp = (timestamp: any) => {
  if (!timestamp) return null;
  if (typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toISOString();
  }
  return timestamp;
};

// Функция для преобразования объекта Firestore в простой объект
const convertFirestoreObject = (obj: any) => {
  if (!obj) return null;
  const result: any = { ...obj };
  
  // Преобразуем Timestamp поля
  if (result.createdAt) result.createdAt = convertTimestamp(result.createdAt);
  if (result.updatedAt) result.updatedAt = convertTimestamp(result.updatedAt);
  
  return result;
};

// Блок с заглушкой для быстрого первоначального рендеринга
function LoadingSkeleton() {
  return (
    <div className="min-h-screen h-screen flex flex-col overflow-hidden bg-gradient-to-b from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)]">
      <header className="bg-[var(--color-bg-secondary)]/80 py-3 px-6 shadow-md">
        <div className="flex justify-between items-center">
          <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-40 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-24"></div>
        </div>
      </header>
      
      <div className="flex-grow flex flex-col md:flex-row">
        <div className="md:w-1/2 h-2/5 md:h-full lg:w-1/4 xl:w-1/5 bg-gray-100 flex justify-center items-center">
          <div className="w-40 h-40 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        <div className="md:w-1/2 h-3/5 md:h-full lg:w-3/4 xl:w-4/5 bg-white/90 rounded-tl-3xl shadow-xl">
          <div className="p-6 space-y-4">
            <div className="w-48 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Включаем динамическое кэширование для повышения производительности
export const dynamic = 'force-dynamic'; 
export const fetchCache = 'default-no-store';
export const revalidate = 0; // Отключаем кеширование страницы

// Серверный компонент страницы
export default async function CustomizePage({ 
  params 
}: { 
  params: { caseid: string }
}) {
  // Дожидаемся параметров маршрута
  const resolvedParams = await Promise.resolve(params);
  
  if (!resolvedParams?.caseid) {
    notFound();
  }
  
  // Декодируем и находим выбранный корпус
  const decodedCaseId = decodeURIComponent(resolvedParams.caseid);
  
  try {
    // Проверяем, есть ли предзагруженные данные
    let watchCase, compatibleParts;
    const prefetchedData = getPrefetchedData(decodedCaseId);
    
    if (prefetchedData) {
      // Используем предзагруженные данные
      watchCase = prefetchedData.watchCase;
      compatibleParts = prefetchedData.compatibleParts;
    } else {
      // Получаем корпус и все совместимые детали за один запрос
      const result = await getWatchCaseWithCompatibleParts(decodedCaseId);
      watchCase = result.watchCase;
      compatibleParts = result.compatibleParts;
    }
    
    // Если корпус не найден, показываем 404
    if (!watchCase) {
      notFound();
    }
    
    // Преобразуем корпус и все детали в простые объекты
    const convertedCase = convertFirestoreObject(watchCase);
    const convertedDials = compatibleParts.dials.map(convertFirestoreObject);
    const convertedHands = compatibleParts.hands.map(convertFirestoreObject);
    const convertedRotors = compatibleParts.rotors.map(convertFirestoreObject);
    const convertedStraps = compatibleParts.straps.map(convertFirestoreObject);
    const convertedBezels = compatibleParts.bezels.map(convertFirestoreObject);
    
    // Рендерим клиентский компонент с предварительно загруженными данными
    return (
      <Suspense fallback={<LoadingSkeleton />}>
        <CustomizeClient 
          selectedCase={convertedCase}
          compatibleDials={convertedDials}
          compatibleHands={convertedHands}
          compatibleRotors={convertedRotors}
          compatibleStraps={convertedStraps}
          compatibleBezels={convertedBezels}
        />
      </Suspense>
    );
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Что-то пошло не так</h1>
        <p className="text-gray-600">Не удалось загрузить данные о часах. Пожалуйста, попробуйте позже.</p>
      </div>
    );
  }
} 