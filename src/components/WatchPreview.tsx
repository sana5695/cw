'use client';

import Image from 'next/image';
import { WatchCase, WatchPart } from '../data/watchData';

// Компонент для отображения превью часов 
export function WatchPreview({ 
  selectedCase, 
  selectedColor, 
  currentDial, 
  currentHands, 
  currentRotor, 
  currentStrap,
  currentBezel,
  compactMode = false
}: { 
  selectedCase: WatchCase;
  selectedColor: string;
  currentDial: WatchPart | undefined;
  currentHands: WatchPart | undefined;
  currentRotor: WatchPart | undefined;
  currentStrap: WatchPart | undefined;
  currentBezel: WatchPart | undefined;
  compactMode?: boolean; // Режим компактного отображения для страницы заказа
}) {
  // Находим выбранный цвет только один раз
  const selectedCaseColor = selectedCase.colors.find(c => c.name === selectedColor);

  return (
    <div className={`${compactMode ? 'h-full max-h-96' : 'h-full'} bg-gradient-to-br from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)] rounded-lg flex flex-col items-center shadow-2xl`}>
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

        {currentBezel && (
          <Image
            src={currentBezel.image}
            alt={currentBezel.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain drop-shadow-xl"
            style={{ zIndex: 60 }}
          />
        )}
        
      </div>
    </div>
  );
} 