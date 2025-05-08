import { Suspense } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CaseSelector } from '@/components/CaseSelector';

export default function CustomizePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-[var(--color-text-primary)]">Выберите корпус часов</h1>
        
        <Suspense fallback={<div className="flex justify-center py-8"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div></div>}>
          <CaseSelector linkMode={true} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
