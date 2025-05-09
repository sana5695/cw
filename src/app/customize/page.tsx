'use client';

import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import { useWatchCases } from '@/hooks/useWatchCases';
import { CaseCard } from '@/components/watch/CaseCard';
import styles from './page.module.scss';

/**
 * Страница настройки часов
 * Отображает доступные корпуса часов для начала процесса кастомизации
 */
export default function CustomizePage() {
  // Получаем данные о корпусах через хук
  const { cases, loading, error } = useWatchCases();
  
  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>Настройте свои часы</h1>

          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">Произошла ошибка при загрузке данных</p>
              <p>{error}</p>
            </div>
          ) : (
            <div className={styles.casesGrid}>
              {cases.map(caseItem => (
                <CaseCard key={caseItem.id} caseItem={caseItem} />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
