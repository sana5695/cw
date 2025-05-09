'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { WatchPreview } from './WatchPreview';
import { ColorSelector } from './ColorSelector';
import { PartSelector } from './PartSelector';
import { StepNavigation } from './StepNavigation';
import { CustomizeStepper } from './CustomizeStepper';
import { FirebaseWatchCase, FirebaseWatchPart } from '@/services/watchDataService';

// Основной клиентский компонент
export default function CustomizeClient({ 
  selectedCase,
  compatibleDials,
  compatibleHands,
  compatibleRotors,
  compatibleStraps,
  compatibleBezels
}: {
  selectedCase: FirebaseWatchCase;
  compatibleDials: FirebaseWatchPart[];
  compatibleHands: FirebaseWatchPart[];
  compatibleRotors: FirebaseWatchPart[];
  compatibleStraps: FirebaseWatchPart[];
  compatibleBezels: FirebaseWatchPart[];
}) {
  // Состояние для выбранного цвета
  const [selectedColor, setSelectedColor] = useState<string>(
    selectedCase.colors.length > 0 ? selectedCase.colors[0].name : ''
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
    if (compatibleDials.length > 0 && !selectedDial) {
      handleSetDial(compatibleDials[0].id!, compatibleDials[0].name);
    }
    if (compatibleHands.length > 0 && !selectedHands) {
      handleSetHands(compatibleHands[0].id!, compatibleHands[0].name);
    }
    if (compatibleRotors.length > 0 && !selectedRotor) {
      handleSetRotor(compatibleRotors[0].id!, compatibleRotors[0].name);
    }
    if (compatibleStraps.length > 0 && !selectedStrap) {
      handleSetStrap(compatibleStraps[0].id!, compatibleStraps[0].name);
    }
    if (compatibleBezels.length > 0 && !selectedBezel) {
      handleSetBezel(compatibleBezels[0].id!, compatibleBezels[0].name);
    }
  }, [compatibleDials, compatibleHands, compatibleRotors, compatibleStraps, compatibleBezels]);

  // Функции установки выбранных деталей
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
  const currentDial = compatibleDials.find(d => d.name === selectedDial);
  const currentHands = compatibleHands.find(h => h.name === selectedHands);
  const currentRotor = compatibleRotors.find(r => r.name === selectedRotor);
  const currentStrap = compatibleStraps.find(s => s.name === selectedStrap);
  const currentBezel = compatibleBezels.find(b => b.name === selectedBezel);

  // Определяем доступные шаги
  const steps = [
    { title: "Цвет корпуса", available: selectedCase.colors.length > 0 },
    { title: "Циферблат", available: selectedCase.availableParts.hasDials },
    { title: "Стрелки", available: selectedCase.availableParts.hasHands },
    { title: "Ротор", available: selectedCase.availableParts.hasRotors },
    { title: "Ремешок", available: selectedCase.availableParts.hasStraps },
    { title: "Безель", available: selectedCase.availableParts.hasBezel },
    { title: "Заказ", available: true }
  ].filter(step => step.available);

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="min-h-screen h-screen flex flex-col overflow-hidden bg-gradient-to-b from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)]">
      <header className="bg-[var(--color-bg-secondary)]/80 py-3 px-6 shadow-md">
        <div className="flex justify-between items-center">
          <Link href={('/customize')} className="text-[var(--color-text-primary)] hover:opacity-80 transition-opacity flex items-center">
            <span className="text-xl">&larr;</span><span className="ml-2 font-medium">Назад</span>
          </Link>
          <h1 className="text-xl font-bold  text-[var(--color-text-primary)]">
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
          <WatchPreview
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
            compatibleDials={compatibleDials}
            compatibleHands={compatibleHands}
            compatibleRotors={compatibleRotors}
            compatibleStraps={compatibleStraps}
            compatibleBezels={compatibleBezels}
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