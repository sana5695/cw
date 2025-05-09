'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { FirebaseWatchCase, FirebaseWatchPart } from '@/services/watchDataService';
import { CustomizeStepper } from '@/components/CustomizeStepper';
import { StepNavigation } from '@/components/StepNavigation';

// Динамический импорт компонентов для ленивой загрузки
const WatchPreviewLazy = dynamic(() => import('@/components/WatchPreview').then(mod => ({ default: mod.WatchPreview })), { 
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center">Загрузка предпросмотра...</div>
});

interface WatchCustomizerProps {
  selectedCase: FirebaseWatchCase;
  compatibleParts: {
    dials: FirebaseWatchPart[];
    hands: FirebaseWatchPart[];
    rotors: FirebaseWatchPart[];
    straps: FirebaseWatchPart[];
    bezels: FirebaseWatchPart[];
  };
}

/**
 * Компонент для настройки отдельного корпуса часов
 */
export function WatchCustomizer({ selectedCase, compatibleParts }: WatchCustomizerProps) {
  // Состояние для выбранного цвета
  const [selectedColor, setSelectedColor] = useState<string>(
    selectedCase?.colors?.length > 0 ? selectedCase.colors[0].name : ''
  );
  
  // Состояние для выбранных деталей - имена
  const [selectedDial, setSelectedDial] = useState<string | null>(null);
  const [selectedHands, setSelectedHands] = useState<string | null>(null);
  const [selectedRotor, setSelectedRotor] = useState<string | null>(null);
  const [selectedStrap, setSelectedStrap] = useState<string | null>(null);
  const [selectedBezel, setSelectedBezel] = useState<string | null>(null);
  
  // Состояние для выбранных деталей - ID
  const [selectedDialId, setSelectedDialId] = useState<string | null>(null);
  const [selectedHandsId, setSelectedHandsId] = useState<string | null>(null);
  const [selectedRotorId, setSelectedRotorId] = useState<string | null>(null);
  const [selectedStrapId, setSelectedStrapId] = useState<string | null>(null);
  const [selectedBezelId, setSelectedBezelId] = useState<string | null>(null);
  
  const [currentStep, setCurrentStep] = useState(0);

  // Автоматически выбираем первые детали при загрузке
  useEffect(() => {
    if (compatibleParts.dials.length > 0 && !selectedDial) {
      handleSetDial(compatibleParts.dials[0].id || '', compatibleParts.dials[0].name);
    }
    if (compatibleParts.hands.length > 0 && !selectedHands) {
      handleSetHands(compatibleParts.hands[0].id || '', compatibleParts.hands[0].name);
    }
    if (compatibleParts.rotors.length > 0 && !selectedRotor) {
      handleSetRotor(compatibleParts.rotors[0].id || '', compatibleParts.rotors[0].name);
    }
    if (compatibleParts.straps.length > 0 && !selectedStrap) {
      handleSetStrap(compatibleParts.straps[0].id || '', compatibleParts.straps[0].name);
    }
    if (compatibleParts.bezels.length > 0 && !selectedBezel) {
      handleSetBezel(compatibleParts.bezels[0].id || '', compatibleParts.bezels[0].name);
    }
  }, [compatibleParts]);

  // Функции-обработчики для выбора деталей
  const handleSetDial = (partId: string, partName: string) => {
    setSelectedDialId(partId);
    setSelectedDial(partName);
  };

  const handleSetHands = (partId: string, partName: string) => {
    setSelectedHandsId(partId);
    setSelectedHands(partName);
  };

  const handleSetRotor = (partId: string, partName: string) => {
    setSelectedRotorId(partId);
    setSelectedRotor(partName);
  };

  const handleSetStrap = (partId: string, partName: string) => {
    setSelectedStrapId(partId);
    setSelectedStrap(partName);
  };

  const handleSetBezel = (partId: string, partName: string) => {
    setSelectedBezelId(partId);
    setSelectedBezel(partName);
  };

  // Получаем текущие выбранные компоненты для предпросмотра
  const currentDial = useMemo(() => 
    compatibleParts.dials.find(d => d.name === selectedDial),
    [compatibleParts.dials, selectedDial]
  );
  
  const currentHands = useMemo(() => 
    compatibleParts.hands.find(h => h.name === selectedHands),
    [compatibleParts.hands, selectedHands]
  );
  
  const currentRotor = useMemo(() => 
    compatibleParts.rotors.find(r => r.name === selectedRotor),
    [compatibleParts.rotors, selectedRotor]
  );
  
  const currentStrap = useMemo(() => 
    compatibleParts.straps.find(s => s.name === selectedStrap),
    [compatibleParts.straps, selectedStrap]
  );
  
  const currentBezel = useMemo(() => 
    compatibleParts.bezels.find(b => b.name === selectedBezel),
    [compatibleParts.bezels, selectedBezel]
  );

  // Определяем доступные шаги
  const steps = useMemo(() => {
    if (!selectedCase) return [];
    
    return [
      { title: "Цвет корпуса", available: selectedCase.colors.length > 0 },
      { title: "Циферблат", available: selectedCase.availableParts?.hasDials },
      { title: "Стрелки", available: selectedCase.availableParts?.hasHands },
      { title: "Ротор", available: selectedCase.availableParts?.hasRotors },
      { title: "Ремешок", available: selectedCase.availableParts?.hasStraps },
      { title: "Безель", available: selectedCase.availableParts?.hasBezel },
      { title: "Заказ", available: true }
    ].filter(step => step.available);
  }, [selectedCase]);

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  if (!selectedCase) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-2">Корпус не найден</h1>
        <Link href="/customize" className="text-accent hover:underline">
          Вернуться к выбору корпуса
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-screen flex flex-col overflow-hidden bg-gradient-to-b from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)]">
      <header className="bg-[var(--color-bg-secondary)]/80 py-3 px-6 shadow-md">
        <div className="flex justify-between items-center">
          <Link href="/customize" className="text-[var(--color-text-primary)] hover:opacity-80 transition-opacity flex items-center">
            <span className="text-xl">&larr;</span><span className="ml-2 font-medium">Назад</span>
          </Link>
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
            {selectedCase.name}
          </h1>
          <div className="w-24"></div>
        </div>
      </header>
      
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden h-[calc(100vh-60px)]">
        {/* Всегда показываем превью часов */}
        <div className={`md:w-1/2 h-2/5 md:h-full lg:w-1/4 xl:w-1/5 ${
          currentStep === steps.length - 1 ? 'md:block hidden' : ''
        }`}>
          <WatchPreviewLazy
            selectedCase={selectedCase}
            selectedColor={selectedColor}
            currentDial={currentDial}
            currentHands={currentHands}
            currentRotor={currentRotor}
            currentStrap={currentStrap}
            currentBezel={currentBezel}
          />
        </div>
        
        <div className={`${
          currentStep === steps.length - 1 
            ? 'w-full md:w-3/4 xl:w-4/5' 
            : 'md:w-1/2 h-3/5 md:h-full lg:w-3/4 xl:w-4/5'
        } flex flex-col bg-white/90 rounded-tl-3xl shadow-xl`}>
          <CustomizeStepper 
            selectedCase={selectedCase}
            compatibleDials={compatibleParts.dials}
            compatibleHands={compatibleParts.hands}
            compatibleRotors={compatibleParts.rotors}
            compatibleStraps={compatibleParts.straps}
            compatibleBezels={compatibleParts.bezels}
            selectedColor={selectedColor}
            selectedDial={selectedDial}
            selectedDialId={selectedDialId}
            selectedHands={selectedHands}
            selectedHandsId={selectedHandsId}
            selectedRotor={selectedRotor}
            selectedRotorId={selectedRotorId}
            selectedStrap={selectedStrap}
            selectedStrapId={selectedStrapId}
            selectedBezel={selectedBezel}
            selectedBezelId={selectedBezelId}
            setSelectedColor={setSelectedColor}
            setSelectedDial={handleSetDial}
            setSelectedHands={handleSetHands}
            setSelectedRotor={handleSetRotor}
            setSelectedStrap={handleSetStrap}
            setSelectedBezel={handleSetBezel}
            currentStep={currentStep}
            totalSteps={steps.length}
            currentDial={currentDial}
            currentHands={currentHands}
            currentRotor={currentRotor}
            currentStrap={currentStrap}
            currentBezel={currentBezel}
          />
          
          <div className="bg-white/50">
            <StepNavigation
              currentStep={currentStep}
              totalSteps={steps.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
              isNextDisabled={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 