import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import CustomizeClient from '@/components/CustomizeClient';
import { 
  getWatchCaseByName, 
  getCompatibleWatchParts, 
  FirebaseWatchCase, 
  FirebaseWatchPart 
} from '@/services/watchDataService';

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
    // Получаем корпус из Firebase по имени
    const foundCase = await getWatchCaseByName(decodedCaseId);
    
    // Если корпус не найден, показываем 404
    if (!foundCase) {
      notFound();
    }
    
    // Преобразуем корпус в простой объект
    const convertedCase = convertFirestoreObject(foundCase);
    
    // Получаем совместимые детали для найденного корпуса
    const compatibleDials = foundCase.availableParts.hasDials 
      ? (await getCompatibleWatchParts(decodedCaseId, 'dial')).map(convertFirestoreObject)
      : [];
    
    const compatibleHands = foundCase.availableParts.hasHands 
      ? (await getCompatibleWatchParts(decodedCaseId, 'hand')).map(convertFirestoreObject)
      : [];
    
    const compatibleRotors = foundCase.availableParts.hasRotors 
      ? (await getCompatibleWatchParts(decodedCaseId, 'rotor')).map(convertFirestoreObject)
      : [];
    
    const compatibleStraps = foundCase.availableParts.hasStraps 
      ? (await getCompatibleWatchParts(decodedCaseId, 'strap')).map(convertFirestoreObject)
      : [];

    const compatibleBezels = foundCase.availableParts.hasBezel 
      ? (await getCompatibleWatchParts(decodedCaseId, 'bezel')).map(convertFirestoreObject)
      : [];
    
    // Рендерим клиентский компонент с предварительно загруженными данными
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Загрузка...</p></div>}>
        <CustomizeClient 
          selectedCase={convertedCase}
          compatibleDials={compatibleDials}
          compatibleHands={compatibleHands}
          compatibleRotors={compatibleRotors}
          compatibleStraps={compatibleStraps}
          compatibleBezels={compatibleBezels}
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