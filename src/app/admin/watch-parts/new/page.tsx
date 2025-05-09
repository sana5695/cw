'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AdminProtectedRoute } from '@/components/AdminProtectedRoute';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import WatchPartForm from '@/components/admin/WatchPartForm';
import { FirebaseWatchPart } from '@/services/watchDataService';

function NewWatchPartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const partType = searchParams.get('type') as FirebaseWatchPart['partType'] || 'dial';
  const [success, setSuccess] = useState(false);

  const partTypeLabels = {
    dial: 'циферблата',
    hand: 'стрелок',
    rotor: 'ротора',
    strap: 'ремешка',
    bezel: 'безеля'
  };

  const handleSuccess = (partId: string) => {
    setSuccess(true);
    setTimeout(() => {
      router.push('/admin/watches');
    }, 1500);
  };

  const handleCancel = () => {
    router.push('/admin/watches');
  };

  return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-10 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <Link
                href="/admin/watches"
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Назад к списку
              </Link>
            </div>

            <h1 className="text-2xl font-bold mb-6 text-[var(--color-text-primary)]">
              Добавление нового {partTypeLabels[partType]}
            </h1>

            {success ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                Деталь успешно добавлена! Перенаправление на список деталей...
              </div>
            ) : (
              <WatchPartForm
                defaultPartType={partType}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            )}
          </div>
        </main>
        <Footer />
      </div>
  );
}

export default function NewWatchPartPage() {
  return (
    <AdminProtectedRoute>
      <Suspense fallback={
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </main>
          <Footer />
        </div>
      }>
        <NewWatchPartContent />
      </Suspense>
    </AdminProtectedRoute>
  );
} 