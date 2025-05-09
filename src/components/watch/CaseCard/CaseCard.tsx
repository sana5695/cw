import Link from 'next/link';
import Image from 'next/image';
import { FirebaseWatchCase } from '@/services/watchDataService';
import { formatPrice } from '@/hooks/useWatchCases';
import styles from './CaseCard.module.scss';

interface CaseCardProps {
  caseItem: FirebaseWatchCase;
}

/**
 * Компонент для отображения карточки корпуса часов
 */
export function CaseCard({ caseItem }: CaseCardProps) {
  return (
    <div className={styles.caseCard}>
      <div className={styles.caseImageContainer}>
        {caseItem.colors && caseItem.colors.length > 0 && (
          <Image
            src={caseItem.image}
            alt={caseItem.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={styles.caseImage}
          />
        )}
      </div>
      <div className={styles.caseInfo}>
        <h2 className={styles.caseName}>{caseItem.name}</h2>
        <p className={styles.caseDescription}>{caseItem.description || `Корпус часов ${caseItem.name}`}</p>
        <p className={styles.casePrice}>{formatPrice(caseItem.price || 0)}</p>
        <Link
          href={`/customize/${caseItem.name}`}
          className={styles.customizeButton}
        >
          Настроить
        </Link>
      </div>
    </div>
  );
} 