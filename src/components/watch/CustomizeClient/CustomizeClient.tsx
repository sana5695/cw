'use client';

import { useState, useEffect, useMemo } from 'react';
import { FirebaseWatchCase, FirebaseWatchPart } from '@/services/watchDataService';
import { CustomizeStepper } from '../CustomizeStepper';
import { WatchPreview } from '../WatchPreview';
import { StepNavigation } from '@/components/ui/StepNavigation';
import { Header } from '@/components/ui/Header';
import styles from './CustomizeClient.module.scss';

interface CustomizeClientProps {
  selectedCase: FirebaseWatchCase;
  compatibleDials: FirebaseWatchPart[];
  compatibleHands: FirebaseWatchPart[];
  compatibleRotors: FirebaseWatchPart[];
  compatibleStraps: FirebaseWatchPart[];
  compatibleBezels: FirebaseWatchPart[];
}

function CustomizeClient({
  selectedCase,
  compatibleDials,
  compatibleHands,
  compatibleRotors,
  compatibleStraps,
  compatibleBezels
}: CustomizeClientProps) {
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
  
  // Текущий шаг кастомизации
  const [currentStep, setCurrentStep] = useState(0);

  // Определяем доступные шаги
  const steps = useMemo(() => [
    { title: "Цвет корпуса", available: selectedCase.colors.length > 0 },
    { title: "Циферблат", available: selectedCase.availableParts.hasDials },
    { title: "Стрелки", available: selectedCase.availableParts.hasHands },
    { title: "Ротор", available: selectedCase.availableParts.hasRotors },
    { title: "Ремешок", available: selectedCase.availableParts.hasStraps },
    { title: "Безель", available: selectedCase.availableParts.hasBezel },
    { title: "Заказ", available: true }
  ].filter(step => step.available), [selectedCase]);

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
    compatibleDials.find(d => d.name === selectedDial),
    [compatibleDials, selectedDial]
  );
  
  const currentHands = useMemo(() => 
    compatibleHands.find(h => h.name === selectedHands),
    [compatibleHands, selectedHands]
  );
  
  const currentRotor = useMemo(() => 
    compatibleRotors.find(r => r.name === selectedRotor),
    [compatibleRotors, selectedRotor]
  );
  
  const currentStrap = useMemo(() => 
    compatibleStraps.find(s => s.name === selectedStrap),
    [compatibleStraps, selectedStrap]
  );
  
  const currentBezel = useMemo(() => 
    compatibleBezels.find(b => b.name === selectedBezel),
    [compatibleBezels, selectedBezel]
  );

  // Обработчики навигации
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

  // Определяем классы для секций в зависимости от текущего шага
  const isLastStep = currentStep === steps.length - 1;
  const previewSectionClasses = [
    styles.previewSection,
    isLastStep && styles.previewSectionHidden
  ].filter(Boolean).join(' ');
  
  const stepsSectionClasses = [
    isLastStep ? styles.orderSection : styles.stepsSection
  ].join(' ');

  return (
    <div className={styles.container}>
      <Header 
        title={selectedCase.name}
        backUrl="/customize"
      />
      
      <div className={styles.content}>
        {/* Секция предпросмотра часов */}
        <div className={previewSectionClasses}>
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
        
        {/* Секция с шагами кастомизации */}
        <div className={stepsSectionClasses}>
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
  );
}

export default CustomizeClient; 