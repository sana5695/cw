'use client';

import Image from 'next/image';
import { FirebaseWatchPart } from '@/services/watchDataService';
import styles from './PartSelector.module.scss';

interface PartSelectorProps {
  title: string;
  parts: FirebaseWatchPart[];
  selectedPartId: string | null;
  onSelectPart: (partId: string, partName: string) => void;
}

export function PartSelector({ 
  title, 
  parts, 
  selectedPartId, 
  onSelectPart 
}: PartSelectorProps) {
  // Форматирование цены
  const formatPrice = (price: number = 0): string => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      
      {parts.length > 0 ? (
        <div className={styles.partsGrid}>
          {parts.map(part => {
            const isSelected = part.id === selectedPartId;
            const cardClasses = [
              styles.partCard,
              isSelected && styles.selected
            ].filter(Boolean).join(' ');
            
            return (
              <div 
                key={part.id} 
                className={cardClasses}
                onClick={() => onSelectPart(part.id!, part.name)}
              >
                <div className={styles.imageContainer}>
                  <Image
                    src={part.image}
                    alt={part.name}
                    fill
                    className={styles.partImage}
                    sizes="(max-width: 768px) 8rem, 12rem"
                  />
                </div>
                <div className={styles.partInfo}>
                  <h3 className={styles.partName}>{part.name}</h3>
                  {part.price !== undefined && (
                    <div className={styles.partPrice}>{formatPrice(part.price)}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.noPartsMessage}>
          Нет доступных деталей для выбора
        </div>
      )}
    </div>
  );
} 