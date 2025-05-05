'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { WatchCase, WatchPart } from '../data/watchData';
import { getAppPath } from '../utils/url';

// Компонент для отображения превью часов 
function WatchPreview({ 
  selectedCase, 
  selectedColor, 
  currentDial, 
  currentHands, 
  currentRotor, 
  currentStrap 
}: { 
  selectedCase: WatchCase;
  selectedColor: string;
  currentDial: WatchPart | undefined;
  currentHands: WatchPart | undefined;
  currentRotor: WatchPart | undefined;
  currentStrap: WatchPart | undefined;
}) {
  // Находим выбранный цвет только один раз
  const selectedCaseColor = selectedCase.colors.find(c => c.name === selectedColor);

  return (
    <div className="bg-gradient-to-br from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)] rounded-lg p-6 flex flex-col items-center h-full shadow-2xl">
      <h2 className="text-xl font-bold mb-4 text-[var(--color-text-primary)] tracking-wide">Предпросмотр</h2>
      
      <div className="relative w-full h-[calc(100%-2rem)] flex-grow">
        {selectedCaseColor && (
          <Image
            src={selectedCaseColor.image}
            alt={selectedCase.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-contain drop-shadow-2xl"
            style={{ zIndex: 10 }}
          />
        )}
        
        {currentDial && (
          <Image
            src={currentDial.image}
            alt={currentDial.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-contain drop-shadow-lg"
            style={{ zIndex: 1 }}
          />
        )}
        
        {currentHands && (
          <Image
            src={currentHands.image}
            alt={currentHands.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain drop-shadow-md"
            style={{ zIndex: 30 }}
          />
        )}
        
        {currentRotor && (
          <Image
            src={currentRotor.image}
            alt={currentRotor.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain drop-shadow-md"
            style={{ zIndex: 40 }}
          />
        )}
        
        {currentStrap && (
          <Image
            src={currentStrap.image}
            alt={currentStrap.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain drop-shadow-xl"
            style={{ zIndex: 50 }}
          />
        )}
      </div>
    </div>
  );
}

// Компонент для выбора цвета корпуса
function ColorSelector({ 
  selectedCase, 
  selectedColor, 
  onColorSelect 
}: { 
  selectedCase: WatchCase;
  selectedColor: string;
  onColorSelect: (color: string) => void;
}) {
  return (
    <div className="overflow-y-auto h-full custom-scrollbar">
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {selectedCase.colors.map((color) => (
          <button
            key={color.name}
            onClick={() => onColorSelect(color.name)}
            className={`rounded-xl p-3 min-w-[100px] bg-gradient-to-b from-white to-gray-50 shadow-md transition-transform hover:scale-105 active:scale-95 ${
              selectedColor === color.name 
                ? 'shadow-lg shadow-[var(--color-accent)]/50 ring-2 ring-[var(--color-accent)] bg-black/10' 
                : 'hover:shadow-lg'
            }`}
          >
            <div className="relative w-full h-40 overflow-hidden rounded-lg">
              <Image
                src={color.image}
                alt={color.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={`object-contain scale-125 ${
                  selectedColor === color.name ? 'contrast-125' : ''
                }`}
              />
            </div>
            <p className="text-sm mt-3 text-center font-medium">{color.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// Компонент для выбора частей часов
function PartSelector({ 
  parts, 
  selectedPart, 
  onSelectPart 
}: { 
  parts: WatchPart[]; 
  selectedPart: string; 
  onSelectPart: (name: string) => void;
}) {
  return (
    <div className="overflow-y-auto h-full custom-scrollbar">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {parts.map((part) => (
          <button
            key={part.name}
            onClick={() => onSelectPart(part.name)}
            className={`rounded-xl p-3 min-w-[150px] bg-gradient-to-b from-white to-gray-50 shadow-md transition-transform hover:scale-105 active:scale-95 ${
              selectedPart === part.name 
                ? 'shadow-lg shadow-[var(--color-accent)]/50 ring-2 ring-[var(--color-accent)] bg-black/10' 
                : 'hover:shadow-lg'
            }`}
          >
            <div className="relative w-full h-40 overflow-hidden rounded-lg">
              <Image
                src={part.image}
                alt={part.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={`object-contain scale-250 ${selectedPart === part.name ? 'contrast-125' : ''}`}
              />
            </div>
            <p className="text-sm mt-3 text-center font-medium">{part.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// Навигация по шагам
function StepNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isNextDisabled
}: {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  isNextDisabled: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-5 px-3">
      <button
        onClick={onPrevious}
        disabled={currentStep === 0}
        className={`px-5 py-3 mx-4 rounded-full shadow-md transition-transform hover:scale-105 active:scale-95 ${
          currentStep === 0 
            ? 'bg-[var(--color-disabled)] text-gray-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)] text-[var(--color-text-primary)]'
        }`}
      >
        Назад
      </button>
      <div className="text-center font-medium text-[var(--color-text-secondary)]">
        <span className="inline-block px-3 py-1 bg-[var(--color-bg-secondary)]/10 rounded-full">
          {currentStep + 1} / {totalSteps}
        </span>
      </div>
      <button
        onClick={onNext}
        disabled={isNextDisabled}
        className={`px-5 py-3 mx-4 rounded-full shadow-md transition-transform hover:scale-105 active:scale-95 ${
          isNextDisabled 
            ? 'bg-[var(--color-disabled)] text-gray-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)] text-[var(--color-text-primary)]'
        }`}
      >
        {currentStep === totalSteps - 1 ? 'Завершить' : 'Далее'}
      </button>
    </div>
  );
}

// Основной клиентский компонент
export default function CustomizeClient({ 
  selectedCase,
  compatibleDials,
  compatibleHands,
  compatibleRotors,
  compatibleStraps
}: {
  selectedCase: WatchCase;
  compatibleDials: WatchPart[];
  compatibleHands: WatchPart[];
  compatibleRotors: WatchPart[];
  compatibleStraps: WatchPart[];
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
  const [currentStep, setCurrentStep] = useState(0);

  // Получаем текущие выбранные компоненты
  const currentDial = compatibleDials.find(d => d.name === selectedDial);
  const currentHands = compatibleHands.find(h => h.name === selectedHands);
  const currentRotor = compatibleRotors.find(r => r.name === selectedRotor);
  const currentStrap = compatibleStraps.find(s => s.name === selectedStrap);

  // Определяем доступные шаги
  const steps = [
    { title: "Цвет корпуса", available: selectedCase.colors.length > 0 },
    { title: "Циферблат", available: selectedCase.availableParts.hasDials && compatibleDials.length > 0 },
    { title: "Стрелки", available: selectedCase.availableParts.hasHands && compatibleHands.length > 0 },
    { title: "Ротор", available: selectedCase.availableParts.hasRotors && compatibleRotors.length > 0 },
    { title: "Ремешок", available: selectedCase.availableParts.hasStraps && compatibleStraps.length > 0 }
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

  // Рендеринг текущего шага
  const renderCurrentStep = () => {
    const step = steps[currentStep];
    
    switch (step.title) {
      case "Цвет корпуса":
        return (
          <div className="h-full flex flex-col">
            <ColorSelector
              selectedCase={selectedCase}
              selectedColor={selectedColor}
              onColorSelect={setSelectedColor}
            />
          </div>
        );
      case "Циферблат":
        return (
          <div className="h-full flex flex-col">
            <PartSelector
              parts={compatibleDials}
              selectedPart={selectedDial}
              onSelectPart={setSelectedDial}
            />
          </div>
        );
      case "Стрелки":
        return (
          <div className="h-full flex flex-col">
            <PartSelector
              parts={compatibleHands}
              selectedPart={selectedHands}
              onSelectPart={setSelectedHands}
            />
          </div>
        );
      case "Ротор":
        return (
          <div className="h-full flex flex-col">
            <PartSelector
              parts={compatibleRotors}
              selectedPart={selectedRotor}
              onSelectPart={setSelectedRotor}
            />
          </div>
        );
      case "Ремешок":
        return (
          <div className="h-full flex flex-col">
            <PartSelector
              parts={compatibleStraps}
              selectedPart={selectedStrap}
              onSelectPart={setSelectedStrap}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen h-screen flex flex-col overflow-hidden bg-gradient-to-b from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)]">
      <header className="bg-[var(--color-bg-secondary)]/80 py-3 px-6 shadow-md">
        <div className="flex justify-between items-center">
          <Link href={getAppPath('/')} className="text-[var(--color-text-primary)] hover:opacity-80 transition-opacity flex items-center">
            <span className="text-xl">&larr;</span><span className="ml-2 font-medium">Назад</span>
          </Link>
          <h1 className="text-xl font-bold  text-[var(--color-text-primary)]">
            {selectedCase.name}
          </h1>
          <div className="w-24"></div>
        </div>
      </header>
      
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden h-[calc(100vh-60px)]">
        <div className="md:w-1/2 h-1/2 md:h-full lg:w-1/4 xl:w-1/5 p-4">
          <WatchPreview
            selectedCase={selectedCase}
            selectedColor={selectedColor}
            currentDial={currentDial}
            currentHands={currentHands}
            currentRotor={currentRotor}
            currentStrap={currentStrap}
          />
        </div>
        
        <div className="md:w-1/2 h-1/2 md:h-full lg:w-3/4 xl:w-4/5 flex flex-col bg-white/90 rounded-tl-3xl shadow-xl">
          <div className="p-6 pb-0">
            <h2 className="text-2xl font-bold text-[var(--color-bg-primary)] mb-1">
              {steps[currentStep].title}
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-[var(--color-accent)] to-transparent rounded-full mb-4"></div>
          </div>
          
          <div className="flex-grow p-6 pt-0 overflow-hidden h-[calc(100vh-180px)]">
            {renderCurrentStep()}
          </div>
          
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