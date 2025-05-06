"use client";

import Link from 'next/link';
import Image from 'next/image';
import watchData from '../../data/watchData';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
    <main className=" p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-[var(--color-text-primary)]">Выберите корпус часов</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {watchData.cases.map((watchCase) => (
          <Link 
            href={(`/customize/${watchCase.name}`)}
            key={watchCase.name}
            className="rounded-xl p-4 min-w-[180px] bg-gradient-to-b from-white to-gray-50 shadow-md transition-transform hover:scale-105 hover:shadow-lg"
          >
            <div className="flex flex-col items-center">
              <div className="relative w-full h-64 mb-4 overflow-hidden rounded-lg">
                <Image
                  src={watchCase.image}
                  alt={watchCase.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={watchCase.name === 'Nautilus'}
                  className="object-contain scale-125"
                />
              </div>
              <h2 className="text-xl font-semibold text-black">{watchCase.name}</h2>
              <p className="text-gray-600 mt-2 mb-1">
                <span className="px-3 py-1 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-sm">
                  {watchCase.colors.length} вариантов цвета
                </span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
    <Footer />
    </div>
  );
}
