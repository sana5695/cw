'use client';

import { useEffect } from 'react';
import { prefetchPriorityPages } from '@/services/pageContentService';

// Глобальный флаг для отслеживания, была ли уже выполнена предзагрузка
let hasPrefetched = false;

export default function ContentPreloader() {
  useEffect(() => {
    // Используем requestIdleCallback для выполнения предзагрузки 
    // когда браузер не занят критическими задачами
    const prefetch = () => {
      if (!hasPrefetched) {
        hasPrefetched = true;
        prefetchPriorityPages();
      }
    };

    // Используем requestIdleCallback если он доступен, или setTimeout с небольшой задержкой
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(prefetch);
      } else {
        // Задержка 1 секунда, чтобы дать время для основного рендеринга
        setTimeout(prefetch, 1000);
      }
    }
  }, []);

  // Компонент ничего не рендерит
  return null;
} 