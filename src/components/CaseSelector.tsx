'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FirebaseWatchCase, getAllWatchCases } from '@/services/watchDataService';

interface CaseSelectorProps {
  onSelectCase?: (caseId: string, caseName: string) => void;
  linkMode?: boolean;
}

export function CaseSelector({ 
  onSelectCase,
  linkMode = false 
}: CaseSelectorProps) {
  const [cases, setCases] = useState<FirebaseWatchCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCases = async () => {
      try {
        setLoading(true);
        const casesData = await getAllWatchCases();
        setCases(casesData);
      } catch (err) {
        console.error('Ошибка при загрузке корпусов часов:', err);
        setError('Не удалось загрузить корпуса часов');
      } finally {
        setLoading(false);
      }
    };

    loadCases();
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
        {cases.map((watchCase) => (
          linkMode ? (
            <Link
              key={watchCase.id}
              href={`/customize/${encodeURIComponent(watchCase.name)}`}
              className="rounded-xl bg-gradient-to-b from-white to-gray-50 shadow-md transition-transform hover:scale-105 overflow-hidden flex flex-col"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={watchCase.image}
                  alt={watchCase.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain"
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
            </Link>
          ) : (
            <button
              key={watchCase.id}
              onClick={() => onSelectCase && onSelectCase(watchCase.id!, watchCase.name)}
              className="rounded-xl bg-gradient-to-b from-white to-gray-50 shadow-md transition-transform hover:scale-105 overflow-hidden flex flex-col"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={watchCase.image}
                  alt={watchCase.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{watchCase.name}</h3>
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
            </button>
          )
        ))}
      </div>
    </div>
  );
} 