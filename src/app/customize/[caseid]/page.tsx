'use client';

import { Suspense } from 'react';
import { useParams, notFound } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import { WatchCustomizer } from '@/components/watch/WatchCustomizer';
import { useWatchCase } from '@/hooks/useWatchCase';
import styles from './page.module.scss';

// Блок с заглушкой для быстрого первоначального рендеринга
function LoadingSkeleton() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={`${styles.placeholder} ${styles.placeholderSm}`}></div>
          <div className={`${styles.placeholder} ${styles.placeholderMd}`}></div>
          <div className={styles.spacer}></div>
        </div>
      </header>
      
      <div className={styles.previewContainer}>
        <div className={styles.previewSide}>
          <div className={styles.previewCircle}></div>
        </div>
        <div className={styles.customizeSide}>
          <div className={styles.customizeContent}>
            <div className={`${styles.placeholder} ${styles.placeholderLg}`}></div>
            <div className={styles.placeholderGrid}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={styles.placeholderItem}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Клиентский компонент страницы
export default function CustomizeWatchPage() {
  // Получаем параметры из URL
  const params = useParams();
  const caseId = params?.caseid as string;

  // Если ID корпуса отсутствует, показываем 404
  if (!caseId) {
    notFound();
  }
  
  // Используем хук для получения данных о корпусе и совместимых деталях
  const { watchCase, compatibleParts, loading, error } = useWatchCase(caseId);
  
  // Показываем индикатор загрузки
  if (loading) {
    return <LoadingSkeleton />;
  }
  
  // Показываем ошибку, если она есть
  if (error || !watchCase) {
    return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <div className={styles.errorContainer}>
            <h1 className={styles.errorTitle}>Что-то пошло не так</h1>
            <p className={styles.errorText}>
              {error || 'Не удалось загрузить данные о часах. Корпус не найден.'}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Рендерим компонент настройки часов
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <WatchCustomizer 
        selectedCase={watchCase}
        compatibleParts={compatibleParts}
      />
    </Suspense>
  );
} 