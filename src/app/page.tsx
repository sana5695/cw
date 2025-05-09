'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import PageContent from '@/components/PageContent';
import Image from 'next/image';
export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-10 px-6">
        <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center py-10 mb-10">
                    <div className="flex flex-row md:flex-row items-center justify-center gap-0 md:gap-2">
                        <div className="relative w-28 h-40 md:w-50 md:h-70">
                            <Image 
                                className="rotate-12" 
                                src="/images/cases/c1.png" 
                                alt="Logo" 
                                fill 
                                sizes="(max-width: 768px) 112px, 200px" 
                                priority 
                            />
                        </div>
                        <div className="flex flex-col items-start md:items-start">
                            <h2 className="text-4xl md:text-7xl font-bold text-[var(--color-text-primary)]">NOCOPY</h2>
                            <h2 className="text-4xl md:text-7xl font-bold text-[var(--color-text-primary)]">WATCH</h2>
                            <h2 className="text-3xl md:text-6xl font-bold text-[var(--color-text-primary)]">STORE</h2>
                        </div>
                    </div>
                </div>
          <PageContent pageId="home" />
        </div>
      </main>
      <Footer />
    </div>
  );
}