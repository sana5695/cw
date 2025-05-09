'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FirebaseWatchCase, getAllWatchCases } from '@/services/watchDataService';
import { prefetchCaseData } from '@/utils/prefetchHelper';

interface CaseSelectorProps {
  onSelectCase?: (caseId: string, caseName: string) => void;
  linkMode?: boolean;
}

export function CaseSelector({ 
  onSelectCase,
  linkMode = false 
}: CaseSelectorProps) {
  const router = useRouter();
  const [cases, setCases] = useState<FirebaseWatchCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadCases = async () => {
      try {
        setLoading(true);
        const casesData = await getAllWatchCases();
        setCases(casesData);
        
        // Предзагружаем данные для первых 2 корпусов автоматически
        if (casesData.length > 0) {
          prefetchCaseData(casesData[0].name);
          if (casesData.length > 1) {
            prefetchCaseData(casesData[1].name);
          }
        }
      } catch (err) {
        console.error('Ошибка при загрузке корпусов часов:', err);
        setError('Не удалось загрузить корпуса часов');
      } finally {
        setLoading(false);
      }
    };

    loadCases();
  }, []);
  
  // Мемоизированная функция для прямого перехода к конструктору
  const handleCaseClick = useCallback((watchCase: FirebaseWatchCase, index: number) => {
    if (!linkMode) {
      onSelectCase && onSelectCase(watchCase.id!, watchCase.name);
      return;
    }
    
    // Сохраняем активный индекс для визуального отклика
    setActiveIndex(index);
    
    // Начинаем предзагрузку данных и сразу перенаправляем пользователя
    const targetUrl = `/customize/${encodeURIComponent(watchCase.name)}`;
    prefetchCaseData(watchCase.name);
    
    // Используем setTimeout(0) для обеспечения визуального отклика перед навигацией
    setTimeout(() => {
      router.push(targetUrl);
    }, 0);
  }, [linkMode, onSelectCase, router]);

  // Оптимизированная функция для предварительной загрузки при наведении
  const handleMouseEnter = useCallback((watchCase: FirebaseWatchCase) => {
    // Используем requestIdleCallback для загрузки в фоновом режиме
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        prefetchCaseData(watchCase.name);
      });
    } else {
      prefetchCaseData(watchCase.name);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (cases.length === 0) {
    return (
      <div className="flex justify-center items-center h-full p-6">
        <div className="bg-gray-100 border border-gray-200 text-gray-700 px-4 py-3 rounded text-center">
          Корпуса часов не найдены
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full custom-scrollbar">
      <div className="grid p-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cases.map((watchCase, index) => (
          <div
            key={watchCase.id}
            onClick={() => handleCaseClick(watchCase, index)}
            className={`rounded-xl bg-gradient-to-b from-white to-gray-50 shadow-md transition-all hover:scale-105 overflow-hidden flex flex-col cursor-pointer
              ${activeIndex === index ? 'scale-95 opacity-70' : ''}`}
            onMouseEnter={() => handleMouseEnter(watchCase)}
          >
            <div className="relative h-48 w-full">
              <Image
                src={watchCase.image}
                alt={watchCase.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain"
                priority={index < 4} // Приоритет для первых 4 изображений
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-black text-lg">{watchCase.name}</h3>
              {watchCase.price && (
                <p className="text-[var(--color-accent)] font-medium mt-1">
                  {new Intl.NumberFormat('ru-RU', {
                    style: 'currency',
                    currency: 'RUB',
                    maximumFractionDigits: 0
                  }).format(watchCase.price)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 