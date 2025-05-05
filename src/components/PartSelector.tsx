'use client';

import Image from 'next/image';
import { WatchPart } from '../data/watchData';

// Компонент для выбора частей часов
export function PartSelector({ 
  parts, 
  selectedPart, 
  onSelectPart 
}: { 
  parts: WatchPart[]; 
  selectedPart: string; 
  onSelectPart: (name: string) => void;
}) {
  return (
    <div className="overflow-y-auto h-full custom-scrollbar">
      <div className="grid p-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {parts.map((part) => (
          <button
            key={part.name}
            onClick={() => onSelectPart(part.name)}
            className={`flex items-center justify-center rounded-xl bg-gradient-to-b from-white to-gray-50 shadow-md transition-transform hover:scale-105 active:scale-95 ${
              selectedPart === part.name 
                ? 'shadow-lg shadow-[var(--color-accent)]/50 ring-2 ring-[var(--color-accent)] bg-black/10' 
                : 'hover:shadow-lg'
            }`}
          >
            <div className={`relative size-32 overflow-hidden rounded-lg ${part.name[0] === 's' ? 'h-48 w-20' : ''}`}>
              <Image
                src={part.image}
                alt={part.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 73vw"
                className={`object-contain ${selectedPart === part.name ? 'contrast-125' : ''}`}
                style={{ scale: 1.5, }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 