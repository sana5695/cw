'use client';

import { useState, FormEvent, useEffect } from 'react';
import { 
  FirebaseWatchPart, 
  FirebaseWatchCase,
  addWatchPart, 
  updateWatchPart,
  getAllWatchCases 
} from '@/services/watchDataService';
import ImageUploader from './ImageUploader';

interface WatchPartFormProps {
  watchPart?: FirebaseWatchPart;
  defaultPartType?: FirebaseWatchPart['partType'];
  onSuccess: (partId: string) => void;
  onCancel: () => void;
}

export default function WatchPartForm({ 
  watchPart, 
  defaultPartType,
  onSuccess, 
  onCancel 
}: WatchPartFormProps) {
  const isEditing = !!watchPart;
  const [name, setName] = useState(watchPart?.name || '');
  const [image, setImage] = useState(watchPart?.image || '');
  const [partType, setPartType] = useState<FirebaseWatchPart['partType']>(
    watchPart?.partType || defaultPartType || 'dial'
  );
  const [compatibleCases, setCompatibleCases] = useState<string[]>(
    watchPart?.compatibleCases || []
  );
  const [price, setPrice] = useState<number | undefined>(watchPart?.price);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableCases, setAvailableCases] = useState<FirebaseWatchCase[]>([]);
  const [casesLoading, setCasesLoading] = useState(true);

  // Загрузка доступных корпусов при монтировании
  useEffect(() => {
    const loadCases = async () => {
      try {
        setCasesLoading(true);
        const cases = await getAllWatchCases();
        setAvailableCases(cases);
      } catch (err) {
        console.error('Ошибка при загрузке корпусов:', err);
        setError('Не удалось загрузить список корпусов');
      } finally {
        setCasesLoading(false);
      }
    };

    loadCases();
  }, []);

  const handleCompatibleCaseToggle = (caseName: string) => {
    setCompatibleCases(prev =>
      prev.includes(caseName)
        ? prev.filter(c => c !== caseName)
        : [...prev, caseName]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Валидация формы
    if (!name) {
      setError('Укажите название детали');
      return;
    }

    if (!image) {
      setError('Загрузите изображение детали');
      return;
    }

    if (compatibleCases.length === 0) {
      setError('Выберите хотя бы один совместимый корпус');
      return;
    }

    try {
      setLoading(true);

      const partData: Omit<FirebaseWatchPart, 'id' | 'createdAt' | 'updatedAt'> = {
        name,
        image,
        partType,
        compatibleCases,
        ...(price !== undefined && { price })
      };

      let partId: string;
      
      if (isEditing && watchPart?.id) {
        await updateWatchPart(watchPart.id, partData);
        partId = watchPart.id;
      } else {
        partId = await addWatchPart(partData);
      }

      onSuccess(partId);
    } catch (err) {
      console.error('Ошибка при сохранении детали:', err);
      setError('Произошла ошибка при сохранении. Пожалуйста, попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  const partTypeLabels = {
    dial: 'Циферблат',
    hand: 'Стрелки',
    rotor: 'Ротор',
    strap: 'Ремешок',
    bezel: 'Безель'
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[var(--color-bg-secondary)] p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? `Редактирование детали: ${partTypeLabels[partType]}` : 'Добавление новой детали'}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Название детали</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      {!isEditing && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Тип детали</label>
          <select
            value={partType}
            onChange={(e) => setPartType(e.target.value as FirebaseWatchPart['partType'])}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="dial">Циферблат</option>
            <option value="hand">Стрелки</option>
            <option value="rotor">Ротор</option>
            <option value="strap">Ремешок</option>
            <option value="bezel">Безель</option>
          </select>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Изображение детали</label>
        <ImageUploader
          currentImageUrl={image}
          onImageUploaded={setImage}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Цена (опционально)</label>
        <input
          type="number"
          value={price || ''}
          onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : undefined)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Цена в рублях"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Совместимые корпуса</label>
        
        {casesLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : availableCases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {availableCases.map((watchCase) => (
              <div key={watchCase.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`case-${watchCase.id}`}
                  checked={compatibleCases.includes(watchCase.name)}
                  onChange={() => handleCompatibleCaseToggle(watchCase.name)}
                  className="mr-2"
                />
                <label htmlFor={`case-${watchCase.id}`} className="flex items-center">
                  <div className="relative h-8 w-8 mr-2">
                    <img
                      src={watchCase.image}
                      alt={watchCase.name}
                      className="h-full w-full object-cover rounded"
                    />
                  </div>
                  <span>{watchCase.name}</span>
                </label>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-red-500">
            Нет доступных корпусов. Пожалуйста, сначала добавьте хотя бы один корпус часов.
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={loading || casesLoading || availableCases.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-300"
        >
          {loading ? 'Сохранение...' : isEditing ? 'Сохранить изменения' : 'Создать деталь'}
        </button>
      </div>
    </form>
  );
} 