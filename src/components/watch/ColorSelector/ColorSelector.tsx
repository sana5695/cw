'use client';

import { FirebaseWatchCase } from '@/services/watchDataService';
import styles from './ColorSelector.module.scss';

interface ColorSelectorProps {
  selectedCase: FirebaseWatchCase;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
}

export function ColorSelector({ 
  selectedCase, 
  selectedColor, 
  setSelectedColor 
}: ColorSelectorProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Выберите цвет корпуса</h2>
      
      <div className={styles.colorsGrid}>
        {selectedCase.colors.map(color => {
          const isSelected = color.name === selectedColor;
          const itemClasses = [
            styles.colorItem,
            isSelected && styles.selected
          ].filter(Boolean).join(' ');
          
          return (
            <div 
              key={color.name} 
              className={itemClasses}
              onClick={() => setSelectedColor(color.name)}
            >
              <div 
                className={styles.colorPreview} 
                style={{ backgroundColor: '#888888' }}
              />
              <span className={styles.colorName}>{color.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
} 