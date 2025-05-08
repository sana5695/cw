'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FirebaseWatchPart, 
  getWatchParts, 
  deleteWatchPart 
} from '@/services/watchDataService';

interface WatchPartsListProps {
  partType: FirebaseWatchPart['partType'];
}

export default function WatchPartsList({ partType }: WatchPartsListProps) {
  const [parts, setParts] = useState<FirebaseWatchPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    loadParts();
  }, [partType]);

  const loadParts = async () => {
    try {
      setLoading(true);
      const partsData = await getWatchParts(partType);
      setParts(partsData);
      setError(null);
    } catch (error: any) {
      console.error(`Ошибка при загрузке деталей типа ${partType}:`, error);
      setError(`Не удалось загрузить список деталей`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = (partId: string) => {
    setConfirmDelete(partId);
  };

  const handleDeleteCancel = () => {
    setConfirmDelete(null);
  };

  const handleDeletePart = async (partId: string) => {
    try {
      await deleteWatchPart(partId);
      setParts(parts.filter(p => p.id !== partId));
      setConfirmDelete(null);
    } catch (error: any) {
      console.error('Ошибка при удалении детали:', error);
      setError('Не удалось удалить деталь');
    }
  };

  const partTypeLabels = {
    dial: 'Циферблаты',
    hand: 'Стрелки',
    rotor: 'Роторы',
    strap: 'Ремешки',
    bezel: 'Безели'
  };

  const partTypeLabelSingular = {
    dial: 'циферблат',
    hand: 'стрелку',
    rotor: 'ротор',
    strap: 'ремешок',
    bezel: 'безель'
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{partTypeLabels[partType]}</h2>
        <Link 
          href={`/admin/watch-parts/new?type=${partType}`}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
        >
          Добавить {partTypeLabelSingular[partType]}
        </Link>
      </div>

      {parts.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-gray-500">{partTypeLabels[partType]} не найдены</p>
          <p className="text-sm text-gray-400 mt-2">
            Создайте первый элемент, нажав кнопку "Добавить {partTypeLabelSingular[partType]}"
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {parts.map((part) => (
            <div key={part.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="relative h-40 w-full">
                <img
                  src={part.image}
                  alt={part.name}
                  className="h-full w-full object-cover"
                />
              </div>
              
              <div className="p-3">
                <h3 className="font-medium text-black mb-1">{part.name}</h3>
                
                <p className="text-xs text-gray-600 mb-2">
                  Совместимо с: {part.compatibleCases.join(', ')}
                </p>
                
                <div className="flex justify-end space-x-2">
                  <Link
                    href={`/admin/watch-parts/edit/${part.id}`}
                    className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors duration-200"
                  >
                    Изменить
                  </Link>
                  
                  <button
                    onClick={() => handleDeleteConfirm(part.id!)}
                    className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors duration-200"
                  >
                    Удалить
                  </button>
                </div>
                
                {confirmDelete === part.id && (
                  <div className="fixed z-50 inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full m-4">
                      <h4 className="text-lg font-semibold mb-2">Подтверждение удаления</h4>
                      <p className="mb-4 text-black">
                        Вы уверены, что хотите удалить деталь "{part.name}"? Это действие нельзя отменить.
                      </p>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={handleDeleteCancel}
                          className="px-3 py-1 border text-black border-gray-300 rounded hover:bg-gray-100 transition-colors duration-200"
                        >
                          Отмена
                        </button>
                        <button
                          onClick={() => handleDeletePart(part.id!)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 