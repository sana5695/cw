'use client';

import { useState, ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import { uploadImageToImgBB, ImgBBResponse } from '../../services/imgbbService';

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImageUrl?: string;
  label?: string;
}

export default function ImageUploader({ 
  onImageUploaded, 
  currentImageUrl,
  label = 'Загрузить изображение' 
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, загрузите изображение');
      return;
    }

    // Предварительный просмотр
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setIsUploading(true);
      setError(null);
      
      // Загрузка изображения на ImgBB
      const response = await uploadImageToImgBB(file);
      
      // Передаем URL изображения родительскому компоненту
      onImageUploaded(response.display_url);
      
      setIsUploading(false);
    } catch (err) {
      setIsUploading(false);
      setError('Ошибка при загрузке изображения. Пожалуйста, попробуйте снова.');
      console.error('Ошибка загрузки:', err);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-4">
      <div className="flex flex-col space-y-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        
        {previewUrl && (
          <div className="relative h-40 w-40 mb-2">
            <Image 
              src={previewUrl}
              alt="Preview"
              fill
              className="object-cover rounded"
            />
          </div>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={isUploading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-300 w-fit"
        >
          {isUploading ? 'Загрузка...' : 'Выбрать изображение'}
        </button>
        
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </div>
    </div>
  );
} 