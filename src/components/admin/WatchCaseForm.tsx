'use client';

import { useState, FormEvent, useEffect } from 'react';
import { FirebaseWatchCase, addWatchCase, updateWatchCase } from '@/services/watchDataService';
import ImageUploader from './ImageUploader';

interface WatchCaseFormProps {
  watchCase?: FirebaseWatchCase;
  onSuccess: (caseId: string) => void;
  onCancel: () => void;
}

export default function WatchCaseForm({ watchCase, onSuccess, onCancel }: WatchCaseFormProps) {
  const isEditing = !!watchCase;
  const [name, setName] = useState(watchCase?.name || '');
  const [mainImage, setMainImage] = useState(watchCase?.image || '');
  const [colors, setColors] = useState<{ name: string; image: string }[]>(
    watchCase?.colors || []
  );
  const [price, setPrice] = useState<number | undefined>(watchCase?.price);
  const [availableParts, setAvailableParts] = useState(
    watchCase?.availableParts || {
      hasDials: false,
      hasHands: false,
      hasRotors: false,
      hasStraps: false,
      hasBezel: false,
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newColorName, setNewColorName] = useState('');
  const [newColorImage, setNewColorImage] = useState('');

  const handleAddColor = () => {
    if (!newColorName || !newColorImage) {
      setError('Необходимо указать название и изображение цвета');
      return;
    }

    setColors([...colors, { name: newColorName, image: newColorImage }]);
    setNewColorName('');
    setNewColorImage('');
    setError(null);
  };

  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleAvailablePartsChange = (key: keyof typeof availableParts) => {
    setAvailableParts({
      ...availableParts,
      [key]: !availableParts[key],
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Валидация формы
    if (!name) {
      setError('Укажите название корпуса');
      return;
    }

    if (!mainImage) {
      setError('Загрузите изображение корпуса');
      return;
    }

    if (colors.length === 0) {
      setError('Добавьте хотя бы один цвет корпуса');
      return;
    }

    try {
      setLoading(true);

      const caseData: Omit<FirebaseWatchCase, 'id' | 'createdAt' | 'updatedAt'> = {
        name,
        image: mainImage,
        colors,
        availableParts,
        ...(price !== undefined && { price })
      };

      let caseId: string;
      
      if (isEditing && watchCase?.id) {
        await updateWatchCase(watchCase.id, caseData);
        caseId = watchCase.id;
      } else {
        caseId = await addWatchCase(caseData);
      }

      onSuccess(caseId);
    } catch (err) {
      console.error('Ошибка при сохранении корпуса:', err);
      setError('Произошла ошибка при сохранении. Пожалуйста, попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[var(--color-bg-secondary)] p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? 'Редактирование корпуса часов' : 'Добавление нового корпуса часов'}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Название корпуса</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Основное изображение корпуса</label>
        <ImageUploader
          currentImageUrl={mainImage}
          onImageUploaded={setMainImage}
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Доступные детали</label>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hasDials"
              checked={availableParts.hasDials}
              onChange={() => handleAvailablePartsChange('hasDials')}
              className="mr-2"
            />
            <label htmlFor="hasDials">Циферблаты</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hasHands"
              checked={availableParts.hasHands}
              onChange={() => handleAvailablePartsChange('hasHands')}
              className="mr-2"
            />
            <label htmlFor="hasHands">Стрелки</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hasRotors"
              checked={availableParts.hasRotors}
              onChange={() => handleAvailablePartsChange('hasRotors')}
              className="mr-2"
            />
            <label htmlFor="hasRotors">Роторы</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hasStraps"
              checked={availableParts.hasStraps}
              onChange={() => handleAvailablePartsChange('hasStraps')}
              className="mr-2"
            />
            <label htmlFor="hasStraps">Ремешки</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hasBezel"
              checked={availableParts.hasBezel}
              onChange={() => handleAvailablePartsChange('hasBezel')}
              className="mr-2"
            />
            <label htmlFor="hasBezel">Безели</label>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Цвета корпуса</label>
        
        {colors.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Добавленные цвета:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {colors.map((color, index) => (
                <div key={index} className="border p-3 rounded-md flex items-center space-x-3">
                  <div className="relative h-10 w-10 flex-shrink-0">
                    <img
                      src={color.image}
                      alt={color.name}
                      className="h-full w-full object-cover rounded"
                    />
                  </div>
                  <span className="flex-grow">{color.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Удалить
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-[var(--color-bg-secondary)] p-4 rounded-md">
          <h3 className="text-sm font-medium mb-2">Добавить новый цвет:</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs mb-1">Название цвета</label>
              <input
                type="text"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Например: Золотой"
              />
            </div>
            
            <div>
              <label className="block text-xs mb-1">Изображение цвета</label>
              <ImageUploader
                currentImageUrl={newColorImage}
                onImageUploaded={setNewColorImage}
                label="Выбрать изображение цвета"
              />
            </div>
            
            <button
              type="button"
              onClick={handleAddColor}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              Добавить цвет
            </button>
          </div>
        </div>
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
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-300"
        >
          {loading ? 'Сохранение...' : isEditing ? 'Сохранить изменения' : 'Создать корпус'}
        </button>
      </div>
    </form>
  );
} 