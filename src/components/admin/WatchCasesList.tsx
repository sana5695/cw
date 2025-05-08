'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FirebaseWatchCase, getAllWatchCases, deleteWatchCase } from '@/services/watchDataService';

export default function WatchCasesList() {
  const [cases, setCases] = useState<FirebaseWatchCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      setLoading(true);
      const casesData = await getAllWatchCases();
      setCases(casesData);
      setError(null);
    } catch (error: any) {
      console.error('Ошибка при загрузке корпусов:', error);
      setError('Не удалось загрузить список корпусов часов');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = (caseId: string) => {
    setConfirmDelete(caseId);
  };

  const handleDeleteCancel = () => {
    setConfirmDelete(null);
  };

  const handleDeleteCase = async (caseId: string) => {
    try {
      await deleteWatchCase(caseId);
      setCases(cases.filter(c => c.id !== caseId));
      setConfirmDelete(null);
    } catch (error: any) {
      console.error('Ошибка при удалении корпуса:', error);
      setError('Не удалось удалить корпус часов');
    }
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
        <h2 className="text-xl font-semibold">Корпуса часов</h2>
        <Link 
          href="/admin/watch-cases/new" 
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
        >
          Добавить корпус
        </Link>
      </div>

      {cases.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-gray-500">Корпуса часов не найдены</p>
          <p className="text-sm text-gray-400 mt-2">Создайте первый корпус, нажав кнопку "Добавить корпус"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((watchCase) => (
            <div key={watchCase.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="relative h-48 w-full">
                <img
                  src={watchCase.image}
                  alt={watchCase.name}
                  className="h-full w-full object-cover"
                />
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{watchCase.name}</h3>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-600">Доступные цвета: {watchCase.colors.length}</p>
                  <div className="flex mt-1 space-x-1">
                    {watchCase.colors.slice(0, 5).map((color, index) => (
                      <div key={index} className="relative h-6 w-6 rounded-full border border-gray-300">
                        <img
                          src={color.image}
                          alt={color.name}
                          className="h-full w-full object-cover rounded-full"
                          title={color.name}
                        />
                      </div>
                    ))}
                    {watchCase.colors.length > 5 && (
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-xs">
                        +{watchCase.colors.length - 5}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex mt-4 justify-end space-x-2">
                  <Link
                    href={`/admin/watch-cases/edit/${watchCase.id}`}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors duration-200"
                  >
                    Изменить
                  </Link>
                  
                  <button
                    onClick={() => handleDeleteConfirm(watchCase.id!)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors duration-200"
                  >
                    Удалить
                  </button>
                </div>
                
                {confirmDelete === watchCase.id && (
                  <div className="absolute z-10 inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full m-4">
                      <h4 className="text-lg font-semibold mb-2">Подтверждение удаления</h4>
                      <p className="mb-4">
                        Вы уверены, что хотите удалить корпус "{watchCase.name}"? Это действие нельзя отменить.
                      </p>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={handleDeleteCancel}
                          className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors duration-200"
                        >
                          Отмена
                        </button>
                        <button
                          onClick={() => handleDeleteCase(watchCase.id!)}
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