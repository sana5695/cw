'use client';

import styles from './StepNavigation.module.scss';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
  nextLabel?: string;
  prevLabel?: string;
}

export function StepNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isNextDisabled = false,
  nextLabel = 'Далее',
  prevLabel = 'Назад'
}: StepNavigationProps) {
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;
  
  return (
    <div className={styles.navigation}>
      <div className={styles.steps}>
        Шаг {currentStep + 1} из {totalSteps}
      </div>
      
      <div className={styles.buttons}>
        <button
          className={`${styles.button} ${styles.prevButton}`}
          onClick={onPrevious}
          disabled={isFirstStep}
        >
          {prevLabel}
        </button>
        
        <button
          className={`${styles.button} ${styles.nextButton}`}
          onClick={onNext}
          disabled={isNextDisabled}
        >
          {isLastStep ? 'Завершить' : nextLabel}
        </button>
      </div>
    </div>
  );
} 