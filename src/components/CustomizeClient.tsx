'use client';

import { useState } from 'react';
import Link from 'next/link';
import { WatchCase, WatchPart } from '../data/watchData';
import { WatchPreview } from './WatchPreview';
import { ColorSelector } from './ColorSelector';
import { PartSelector } from './PartSelector';
import { StepNavigation } from './StepNavigation';
import { CustomizeStepper } from './CustomizeStepper';

// Основной клиентский компонент
export default function CustomizeClient({ 
  selectedCase,
  compatibleDials,
  compatibleHands,
  compatibleRotors,
  compatibleStraps,
  compatibleBezels
}: {
  selectedCase: WatchCase;
  compatibleDials: WatchPart[];
  compatibleHands: WatchPart[];
  compatibleRotors: WatchPart[];
  compatibleStraps: WatchPart[];
  compatibleBezels: WatchPart[];
}) {
  // Состояние
  const [selectedColor, setSelectedColor] = useState<string>(
    selectedCase.colors.length > 0 ? selectedCase.colors[0].name : ''
  );
  const [selectedDial, setSelectedDial] = useState<string>(
    compatibleDials.length > 0 ? compatibleDials[0].name : ''
  );
  const [selectedHands, setSelectedHands] = useState<string>(
    compatibleHands.length > 0 ? compatibleHands[0].name : ''
  );
  const [selectedRotor, setSelectedRotor] = useState<string>(
    compatibleRotors.length > 0 ? compatibleRotors[0].name : ''
  );
  const [selectedStrap, setSelectedStrap] = useState<string>(
    compatibleStraps.length > 0 ? compatibleStraps[0].name : ''
  );
  const [selectedBezel, setSelectedBezel] = useState<string>(
    compatibleBezels.length > 0 ? compatibleBezels[0].name : ''
  );
  const [currentStep, setCurrentStep] = useState(0);

  // Получаем текущие выбранные компоненты
  const currentDial = compatibleDials.find(d => d.name === selectedDial);
  const currentHands = compatibleHands.find(h => h.name === selectedHands);
  const currentRotor = compatibleRotors.find(r => r.name === selectedRotor);
  const currentStrap = compatibleStraps.find(s => s.name === selectedStrap);
  const currentBezel = compatibleBezels.find(b => b.name === selectedBezel);

  // Определяем доступные шаги
  const steps = [
    { title: "Цвет корпуса", available: selectedCase.colors.length > 0 },
    { title: "Циферблат", available: selectedCase.availableParts.hasDials && compatibleDials.length > 0 },
    { title: "Стрелки", available: selectedCase.availableParts.hasHands && compatibleHands.length > 0 },
    { title: "Ротор", available: selectedCase.availableParts.hasRotors && compatibleRotors.length > 0 },
    { title: "Ремешок", available: selectedCase.availableParts.hasStraps && compatibleStraps.length > 0 },
    { title: "Безель", available: selectedCase.availableParts.hasBezel && compatibleBezels.length > 0 },
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
          <Link href={('/')} className="text-[var(--color-text-primary)] hover:opacity-80 transition-opacity flex items-center">
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
            selectedHands={selectedHands}
            selectedRotor={selectedRotor}
            selectedStrap={selectedStrap}
            selectedBezel={selectedBezel}
            setSelectedColor={setSelectedColor}
            setSelectedDial={setSelectedDial}
            setSelectedHands={setSelectedHands}
            setSelectedRotor={setSelectedRotor}
            setSelectedStrap={setSelectedStrap}
            setSelectedBezel={setSelectedBezel}
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