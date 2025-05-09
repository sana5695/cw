'use client';

import Image from 'next/image';
import { FirebaseWatchCase, FirebaseWatchPart } from '@/services/watchDataService';
import styles from './WatchPreview.module.scss';

interface WatchPreviewProps {
  selectedCase: FirebaseWatchCase;
  selectedColor: string;
  currentDial?: FirebaseWatchPart;
  currentHands?: FirebaseWatchPart;
  currentRotor?: FirebaseWatchPart;
  currentStrap?: FirebaseWatchPart;
  currentBezel?: FirebaseWatchPart;
  compactMode?: boolean;
}

export function WatchPreview({ 
  selectedCase, 
  selectedColor, 
  currentDial, 
  currentHands, 
  currentRotor, 
  currentStrap,
  currentBezel,
  compactMode = false
}: WatchPreviewProps) {
  // Находим выбранный цвет
  const selectedCaseColor = selectedCase.colors.find(c => c.name === selectedColor);

  const containerClasses = [
    styles.container,
    compactMode && styles.compact
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <div className={styles.previewArea}>
        {selectedCaseColor && (
          <Image
            src={selectedCaseColor.image}
            alt={selectedCase.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className={styles.watchImage}
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
            className={styles.dialImage}
            style={{ zIndex: 1 }}
          />
        )}
        
        {currentHands && (
          <Image
            src={currentHands.image}
            alt={currentHands.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.handsImage}
            style={{ zIndex: 30 }}
          />
        )}
        
        {currentRotor && (
          <Image
            src={currentRotor.image}
            alt={currentRotor.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.rotorImage}
            style={{ zIndex: 40 }}
          />
        )}
        
        {currentStrap && (
          <Image
            src={currentStrap.image}
            alt={currentStrap.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.strapImage}
            style={{ zIndex: 50 }}
          />
        )}

        {currentBezel && (
          <Image
            src={currentBezel.image}
            alt={currentBezel.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.bezelImage}
            style={{ zIndex: 60 }}
          />
        )}
      </div>
    </div>
  );
} 