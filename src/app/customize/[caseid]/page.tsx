import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import watchData from '../../../data/watchData';
import CustomizeClient from '@/components/CustomizeClient';

// Серверный компонент страницы
export default async function CustomizePage({ 
  params 
}: { 
  params: { caseid: string }
}) {
  // Декодируем и находим выбранный корпус
  const { caseid } = await params
  const decodedCaseId = caseid;
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