'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FirebaseWatchCase } from '@/services/watchDataService';

interface ColorSelectorProps {
  selectedCase: FirebaseWatchCase;
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

// Компонент для выбора цвета корпуса
export function ColorSelector({ 
  selectedCase, 
  selectedColor, 
  onColorSelect 
}: ColorSelectorProps) {
  return (
    <div className="overflow-y-auto h-full custom-scrollbar">
      <div className="grid p-6 grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {selectedCase.colors.map((color) => (
          <button
            key={color.name}
            onClick={() => onColorSelect(color.name)}
            className={`rounded-xl p-3 min-w-[100px] bg-gradient-to-b from-white to-gray-50 shadow-md transition-transform hover:scale-105 active:scale-95 ${
              selectedColor === color.name 
                ? 'shadow-lg shadow-[var(--color-accent)]/50 ring-2 ring-[var(--color-accent)] bg-black/10' 
                : 'hover:shadow-lg'
            }`}
          >
            <div className="relative w-full h-40 overflow-hidden rounded-lg">
              <Image
                src={color.image}
                alt={color.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={`object-contain scale-125 ${
                  selectedColor === color.name ? 'contrast-125' : ''
                }`}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 