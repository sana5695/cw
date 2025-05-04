import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import watchData from '../../../data/watchData';
import CustomizeClient from '@/components/CustomizeClient';

/**
 * Генерирует статические параметры для страниц часов при сборке
 * Необходимо для работы с output: export в next.config.js
 */
export function generateStaticParams() {
  // Возвращаем массив объектов с возможными значениями caseId
  return watchData.cases.map((watchCase) => ({
    // Используем encodeURIComponent для корректного кодирования значений
    // Next.js самостоятельно обработает это значение при генерации файлов
    caseId: encodeURIComponent(watchCase.name),
  }));
}

// Серверный компонент страницы
export default async function CustomizePage({ 
  params 
}: { 
  params: { caseId: string } 
}) {
  // Декодируем и находим выбранный корпус
  // Параметр caseId может быть URL-кодированным, поэтому используем decodeURIComponent
  const decodedCaseId = decodeURIComponent(params.caseId);
  const foundCase = watchData.cases.find(c => c.name === decodedCaseId);
  
  // Если корпус не найден, показываем 404
  if (!foundCase) {
    notFound();
  }
  
  // Фильтруем совместимые детали для найденного корпуса
  const compatibleDials = watchData.dials.filter(
    dial => dial.compatibleCases.length === 0 || dial.compatibleCases.includes(decodedCaseId)
  );
  
  const compatibleHands = watchData.hands.filter(
    hands => hands.compatibleCases.length === 0 || hands.compatibleCases.includes(decodedCaseId)
  );
  
  const compatibleRotors = watchData.rotors.filter(
    rotor => rotor.compatibleCases.length === 0 || rotor.compatibleCases.includes(decodedCaseId)
  );
  
  const compatibleStraps = watchData.straps.filter(
    strap => strap.compatibleCases.length === 0 || strap.compatibleCases.includes(decodedCaseId)
  );
  
  // Рендерим клиентский компонент с предварительно загруженными данными
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Загрузка...</p></div>}>
      <CustomizeClient 
        selectedCase={foundCase}
        compatibleDials={compatibleDials}
        compatibleHands={compatibleHands}
        compatibleRotors={compatibleRotors}
        compatibleStraps={compatibleStraps}
      />
    </Suspense>
  );
} 