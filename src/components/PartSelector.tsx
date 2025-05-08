'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FirebaseWatchPart, getWatchParts, getCompatibleWatchParts } from '@/services/watchDataService';

interface PartSelectorProps {
  partType: FirebaseWatchPart['partType'];
  selectedPart: string | null;
  onSelectPart: (partId: string, partName: string) => void;
  caseId?: string;
  caseName?: string;
}

export function PartSelector({ 
  partType,
  selectedPart, 
  onSelectPart,
  caseId,
  caseName
}: PartSelectorProps) {
  const [parts, setParts] = useState<FirebaseWatchPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadParts = async () => {
      try {
        setLoading(true);
        
        let partsData: FirebaseWatchPart[];
        
        // Если указан caseName, получаем только совместимые детали
        if (caseName) {
          partsData = await getCompatibleWatchParts(caseName, partType);
        } else {
          // Иначе получаем все детали данного типа
          partsData = await getWatchParts(partType);
        }
        
        setParts(partsData);
      } catch (err) {
        console.error('Ошибка при загрузке деталей:', err);
        setError('Не удалось загрузить детали часов');
      } finally {
        setLoading(false);
      }
    };

    loadParts();
  }, [partType, caseName]);

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

  if (parts.length === 0) {
    return (
      <div className="flex justify-center items-center h-full p-6">
        <div className="bg-gray-100 border border-gray-200 text-gray-700 px-4 py-3 rounded text-center">
          {caseName 
            ? `Нет доступных деталей типа "${partType}" для корпуса "${caseName}"`
            : `Нет доступных деталей типа "${partType}"`}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full custom-scrollbar">
      <div className="grid p-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {parts.map((part) => (
          <button
            key={part.id}
            onClick={() => onSelectPart(part.id!, part.name)}
            className={`flex items-center justify-center rounded-xl bg-gradient-to-b from-white to-gray-50 shadow-md transition-transform hover:scale-105 active:scale-95 ${
              selectedPart === part.id 
                ? 'shadow-lg shadow-[var(--color-accent)]/50 ring-2 ring-[var(--color-accent)] bg-black/10' 
                : 'hover:shadow-lg'
            }`}
          >
            <div className={`relative size-32 overflow-hidden rounded-lg ${partType === 'strap' ? 'h-48 w-20' : ''}`}>
              <Image
                src={part.image}
                alt={part.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 73vw"
                className={`object-contain ${selectedPart === part.id ? 'contrast-125' : ''}`}
                style={{ scale: 1.5, }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 