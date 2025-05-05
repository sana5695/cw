'use client';

import { useState } from 'react';
import { WatchCase, WatchPart } from '../data/watchData';
import { PartSelector } from './PartSelector';
import { ColorSelector } from './ColorSelector';
import { OrderForm, OrderFormData } from './OrderForm';
import { submitOrder } from '../services/orderService';
import { WatchPreview } from './WatchPreview';

type StepperProps = {
  selectedCase: WatchCase;
  compatibleDials: WatchPart[];
  compatibleHands: WatchPart[];
  compatibleRotors: WatchPart[];
  compatibleStraps: WatchPart[];
  compatibleBezels: WatchPart[];
  selectedColor: string;
  selectedDial: string;
  selectedHands: string;
  selectedRotor: string;
  selectedStrap: string;
  selectedBezel: string;
  setSelectedColor: (color: string) => void;
  setSelectedDial: (dial: string) => void;
  setSelectedHands: (hands: string) => void;
  setSelectedRotor: (rotor: string) => void;
  setSelectedStrap: (strap: string) => void;
  setSelectedBezel: (bezel: string) => void;
  currentStep: number;
  totalSteps: number;
  currentDial: WatchPart | undefined;
  currentHands: WatchPart | undefined;
  currentRotor: WatchPart | undefined;
  currentStrap: WatchPart | undefined;
  currentBezel: WatchPart | undefined;
}

export function CustomizeStepper({
  selectedCase,
  compatibleDials,
  compatibleHands,
  compatibleRotors,
  compatibleStraps,
  compatibleBezels,
  selectedColor,
  selectedDial,
  selectedHands,
  selectedRotor,
  selectedStrap,
  selectedBezel,
  setSelectedColor,
  setSelectedDial,
  setSelectedHands,
  setSelectedRotor,
  setSelectedStrap,
  setSelectedBezel,
  currentStep,
  totalSteps,
  currentDial,
  currentHands,
  currentRotor,
  currentStrap,
  currentBezel
}: StepperProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
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
  
  // Расчет суммы заказа (пример)
  const calculateTotal = (): number => {
    let total = selectedCase.price || 20000; // Базовая цена корпуса
    
    if (currentDial) total += currentDial.price || 0;
    if (currentHands) total += currentHands.price || 0;
    if (currentRotor) total += currentRotor.price || 0;
    if (currentStrap) total += currentStrap.price || 0;
    if (currentBezel) total += currentBezel.price || 0;
    
    return total;
  };
  
  // Обработчик отправки заказа
  const handleSubmitOrder = async (formData: OrderFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      // Добавляем цену к заказу
      const formDataWithPrice = {
        ...formData,
        totalPrice: calculateTotal(),
      };
      
      const id = await submitOrder(formDataWithPrice);
      setOrderId(id);
      setOrderSubmitted(true);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Произошла ошибка при отправке заказа. Пожалуйста, попробуйте позже.';
      setErrorMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Форматирование цены
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Рендеринг текущего шага
  const renderCurrentStep = () => {
    if (currentStep === steps.length - 1) {
      // Последний шаг - форма заказа
      if (orderSubmitted) {
        return (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-bg-primary)] mb-2">Заказ успешно отправлен!</h3>
            <p className="text-gray-600 mb-4">Номер вашего заказа: <span className="font-semibold">{orderId}</span></p>
            <p className="text-gray-600">Мы свяжемся с вами в ближайшее время для уточнения деталей.</p>
          </div>
        );
      }
      
      if (errorMessage) {
        return (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-red-600 mb-2">Ошибка при отправке заказа</h3>
            <p className="text-gray-600 mb-4">{errorMessage}</p>
            <button 
              onClick={() => setErrorMessage(null)}
              className="px-5 py-2 bg-[var(--color-accent)] text-white rounded-lg shadow-md hover:bg-[var(--color-accent-hover)] transition-colors"
            >
              Попробовать снова
            </button>
          </div>
        );
      }
      
      // Отображение состава заказа и формы
      return (
        <div className="h-full overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 gap-6 p-4">
            <div className="order-2">
              <OrderForm
                selectedCase={selectedCase}
                selectedColor={selectedColor}
                selectedDial={selectedDial}
                selectedHands={selectedHands}
                selectedRotor={selectedRotor}
                selectedStrap={selectedStrap}
                selectedBezel={selectedBezel}
                onSubmit={handleSubmitOrder}
                isSubmitting={isSubmitting}
              />
            </div>
            
            <div className="order-1 rounded-lg bg-gray-50 p-6 shadow-inner">
              <h3 className="text-xl font-semibold text-[var(--color-bg-primary)] mb-4">Состав заказа</h3>
              
              {/* Превью часов в мобильном - компактная версия */}
              <div className="block md:hidden mb-6 h-48 w-full">
                <WatchPreview
                  selectedCase={selectedCase}
                  selectedColor={selectedColor}
                  currentDial={currentDial}
                  currentHands={currentHands}
                  currentRotor={currentRotor}
                  currentStrap={currentStrap}
                  currentBezel={currentBezel}
                  compactMode={true}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-black">Корпус: {selectedCase.name}</span>
                </div>
                
                {currentDial && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-black">Циферблат: {currentDial.name}</span>
                  </div>
                )}
                
                {currentHands && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-black">Стрелки: {currentHands.name}</span>
                  </div>
                )}
                
                {currentRotor && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-black">Ротор: {currentRotor.name}</span>
                  </div>
                )}
                
                {currentStrap && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-black">Ремешок: {currentStrap.name}</span>
                  </div>
                )}
                
                {currentBezel && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-black">Безель: {currentBezel.name}</span>
                  </div>
                )}
                
                <div className="flex justify-between pt-4 font-bold text-lg">
                  <span className="text-[var(--color-accent)] text-4xl">{formatPrice(calculateTotal())}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
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
      case "Безель":
        return (
          <div className="h-full flex flex-col">
            <PartSelector
              parts={compatibleBezels}
              selectedPart={selectedBezel}
              onSelectPart={setSelectedBezel}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="p-6 pb-0">
        <h2 className="text-2xl font-bold text-[var(--color-bg-primary)] mb-1">
          {steps[currentStep].title}
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-[var(--color-accent)] to-transparent rounded-full mb-4"></div>
      </div>
      
      <div className="flex-grow p-0 pt-0 overflow-hidden h-[calc(100vh-220px)]">
        {renderCurrentStep()}
      </div>
    </>
  );
} 