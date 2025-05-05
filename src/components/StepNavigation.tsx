'use client';

// Навигация по шагам
export function StepNavigation({
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
  const isLastStep = currentStep === totalSteps - 1;
  
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
        <span className="inline-block px-3 py-1 bg-[var(--color-bg-secondary)]/10 rounded-full text-black" >
          {currentStep + 1} / {totalSteps}
        </span>
      </div>
      {!isLastStep && (
        <button
          onClick={onNext}
          disabled={isNextDisabled}
          className={`px-5 py-3 mx-4 rounded-full shadow-md transition-transform hover:scale-105 active:scale-95 ${
            isNextDisabled 
              ? 'bg-[var(--color-disabled)] text-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)] text-[var(--color-text-primary)]'
          }`}
        >
          {currentStep === totalSteps - 2 ? 'Готово' : 'Далее'}
        </button>
      )}
      {isLastStep && (
        <div className="w-28"></div> // Пустое пространство для сохранения выравнивания
      )}
    </div>
  );
} 