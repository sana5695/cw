'use client';

import { useState } from 'react';
import { FirebaseWatchCase, FirebaseWatchPart } from '@/services/watchDataService';
import { OrderForm, OrderFormData } from '../OrderForm';
import { submitOrder } from '@/services/orderService';
import { WatchPreview } from '../WatchPreview';
import { ColorSelector } from '../ColorSelector';
import { PartSelector } from '../PartSelector';
import { Button } from '@/components/ui/Button';
import styles from './CustomizeStepper.module.scss';

// Компонент успешного оформления заказа
const OrderSuccess = ({ orderId }: { orderId: string }) => (
  <div className={styles.successContainer}>
    <div className={styles.successIcon}>
      <svg className={styles.successIconInner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h3 className={styles.successTitle}>Заказ успешно отправлен!</h3>
    <p className={styles.successText}>
      Номер вашего заказа: <span className={styles.orderId}>{orderId}</span>
    </p>
    <p className={styles.successText}>Мы свяжемся с вами в ближайшее время для уточнения деталей.</p>
  </div>
);

// Компонент ошибки при оформлении заказа
const OrderError = ({ 
  errorMessage, 
  onRetry 
}: { 
  errorMessage: string, 
  onRetry: () => void 
}) => (
  <div className={styles.errorContainer}>
    <div className={styles.errorIcon}>
      <svg className={styles.errorIconInner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <h3 className={styles.errorTitle}>Ошибка при отправке заказа</h3>
    <p className={styles.errorText}>{errorMessage}</p>
    <Button variant="primary" onClick={onRetry}>
      Попробовать снова
    </Button>
  </div>
);

// Компонент сводки заказа
const OrderSummary = ({
  selectedCase,
  selectedColor,
  currentDial,
  currentHands,
  currentRotor,
  currentStrap,
  currentBezel
}: {
  selectedCase: FirebaseWatchCase;
  selectedColor: string;
  currentDial?: FirebaseWatchPart;
  currentHands?: FirebaseWatchPart;
  currentRotor?: FirebaseWatchPart;
  currentStrap?: FirebaseWatchPart;
  currentBezel?: FirebaseWatchPart;
}) => (
  <div className={styles.orderSummary}>
    <h3 className={styles.orderSummaryTitle}>Состав заказа</h3>
    
    <div className={styles.orderItem}>
      <span className={styles.orderItemName}>Корпус: {selectedCase.name}</span>
    </div>
    
    {currentDial && (
      <div className={styles.orderItem}>
        <span className={styles.orderItemName}>Циферблат: {currentDial.name}</span>
      </div>
    )}
    
    {currentHands && (
      <div className={styles.orderItem}>
        <span className={styles.orderItemName}>Стрелки: {currentHands.name}</span>
      </div>
    )}
    
    {currentRotor && (
      <div className={styles.orderItem}>
        <span className={styles.orderItemName}>Ротор: {currentRotor.name}</span>
      </div>
    )}
    
    {currentStrap && (
      <div className={styles.orderItem}>
        <span className={styles.orderItemName}>Ремешок: {currentStrap.name}</span>
      </div>
    )}
    
    {currentBezel && (
      <div className={styles.orderItem}>
        <span className={styles.orderItemName}>Безель: {currentBezel.name}</span>
      </div>
    )}
  </div>
);

// Основной компонент CustomizeStepper
interface CustomizeStepperProps {
  selectedCase: FirebaseWatchCase;
  compatibleDials: FirebaseWatchPart[];
  compatibleHands: FirebaseWatchPart[];
  compatibleRotors: FirebaseWatchPart[];
  compatibleStraps: FirebaseWatchPart[];
  compatibleBezels: FirebaseWatchPart[];
  selectedColor: string;
  selectedDial: string | null;
  selectedDialId: string | null;
  selectedHands: string | null;
  selectedHandsId: string | null;
  selectedRotor: string | null;
  selectedRotorId: string | null;
  selectedStrap: string | null;
  selectedStrapId: string | null;
  selectedBezel: string | null;
  selectedBezelId: string | null;
  setSelectedColor: (color: string) => void;
  setSelectedDial: (partId: string, partName: string) => void;
  setSelectedHands: (partId: string, partName: string) => void;
  setSelectedRotor: (partId: string, partName: string) => void;
  setSelectedStrap: (partId: string, partName: string) => void;
  setSelectedBezel: (partId: string, partName: string) => void;
  currentStep: number;
  totalSteps: number;
  currentDial?: FirebaseWatchPart;
  currentHands?: FirebaseWatchPart;
  currentRotor?: FirebaseWatchPart;
  currentStrap?: FirebaseWatchPart;
  currentBezel?: FirebaseWatchPart;
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
  selectedDialId,
  selectedHands,
  selectedHandsId,
  selectedRotor,
  selectedRotorId,
  selectedStrap,
  selectedStrapId,
  selectedBezel,
  selectedBezelId,
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
}: CustomizeStepperProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
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
  
  // Расчет суммы заказа
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
      // Добавляем цену и идентификаторы деталей к заказу
      const formDataWithDetails = {
        ...formData,
        comment: formData.comments,
        contactMethod: 'phone' as 'phone' | 'telegram' | 'whatsapp' | 'viber', // указываем конкретный тип
        selectedComponents: {
          caseName: selectedCase.name,
          color: selectedColor,
          dial: selectedDial || '',
          hands: selectedHands || '',
          rotor: selectedRotor || '',
          strap: selectedStrap || '',
          bezel: selectedBezel || ''
        },
        totalPrice: calculateTotal(),
        caseId: selectedCase.id,
        dialId: selectedDialId,
        handsId: selectedHandsId,
        rotorId: selectedRotorId,
        strapId: selectedStrapId,
        bezelId: selectedBezelId
      };
      
      const id = await submitOrder(formDataWithDetails);
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

  // Рендеринг текущего шага
  const renderCurrentStep = () => {
    if (currentStep === steps.length - 1) {
      // Последний шаг - форма заказа
      if (orderSubmitted) {
        return <OrderSuccess orderId={orderId!} />;
      }
      
      if (errorMessage) {
        return <OrderError errorMessage={errorMessage} onRetry={() => setErrorMessage(null)} />;
      }
      
      // Отображение состава заказа и формы
      return (
        <div className={`${styles.content} custom-scrollbar`}>
          <div className="grid grid-cols-1 gap-6 p-4">
            <div className="order-1">
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
              
              <OrderSummary
                selectedCase={selectedCase}
                selectedColor={selectedColor}
                currentDial={currentDial}
                currentHands={currentHands}
                currentRotor={currentRotor}
                currentStrap={currentStrap}
                currentBezel={currentBezel}
              />
            </div>
            
            <div className="order-2">
              <OrderForm
                selectedCase={selectedCase}
                selectedColor={selectedColor}
                selectedDial={selectedDial || ''}
                selectedHands={selectedHands || ''}
                selectedRotor={selectedRotor || ''}
                selectedStrap={selectedStrap || ''}
                selectedBezel={selectedBezel || ''}
                onSubmit={handleSubmitOrder}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      );
    }
    
    // Шаг выбора цвета
    if (steps[currentStep].title === "Цвет корпуса") {
      return (
        <div className={styles.content}>
          <ColorSelector
            selectedCase={selectedCase}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
          />
        </div>
      );
    }
    
    // Шаг выбора циферблата
    if (steps[currentStep].title === "Циферблат") {
      return (
        <div className={styles.content}>
          <PartSelector
            title="Выберите циферблат"
            parts={compatibleDials}
            selectedPartId={selectedDialId}
            onSelectPart={setSelectedDial}
          />
        </div>
      );
    }
    
    // Шаг выбора стрелок
    if (steps[currentStep].title === "Стрелки") {
      return (
        <div className={styles.content}>
          <PartSelector
            title="Выберите стрелки"
            parts={compatibleHands}
            selectedPartId={selectedHandsId}
            onSelectPart={setSelectedHands}
          />
        </div>
      );
    }
    
    // Шаг выбора ротора
    if (steps[currentStep].title === "Ротор") {
      return (
        <div className={styles.content}>
          <PartSelector
            title="Выберите ротор"
            parts={compatibleRotors}
            selectedPartId={selectedRotorId}
            onSelectPart={setSelectedRotor}
          />
        </div>
      );
    }
    
    // Шаг выбора ремешка
    if (steps[currentStep].title === "Ремешок") {
      return (
        <div className={styles.content}>
          <PartSelector
            title="Выберите ремешок"
            parts={compatibleStraps}
            selectedPartId={selectedStrapId}
            onSelectPart={setSelectedStrap}
          />
        </div>
      );
    }
    
    // Шаг выбора безеля
    if (steps[currentStep].title === "Безель") {
      return (
        <div className={styles.content}>
          <PartSelector
            title="Выберите безель"
            parts={compatibleBezels}
            selectedPartId={selectedBezelId}
            onSelectPart={setSelectedBezel}
          />
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className={styles.container}>
      {renderCurrentStep()}
    </div>
  );
} 