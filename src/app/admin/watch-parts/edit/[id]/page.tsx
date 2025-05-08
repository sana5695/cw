'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminProtectedRoute } from '@/components/AdminProtectedRoute';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import WatchPartForm from '@/components/admin/WatchPartForm';
import { getWatchPartById, FirebaseWatchPart } from '@/services/watchDataService';

export default function EditWatchPartPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [watchPart, setWatchPart] = useState<FirebaseWatchPart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadPart = async () => {
      try {
        setLoading(true);
        const partData = await getWatchPartById(resolvedParams.id);
        
        if (partData) {
          setWatchPart(partData);
        } else {
          setError('Деталь часов не найдена');
        }
      } catch (err) {
        console.error('Ошибка при загрузке детали:', err);
        setError('Не удалось загрузить данные детали часов');
      } finally {
        setLoading(false);
      }
    };

    loadPart();
  }, [resolvedParams.id]);

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
    <AdminProtectedRoute>
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
              {watchPart 
                ? `Редактирование ${watchPart.partType === 'dial' ? 'циферблата' : 
                   watchPart.partType === 'hand' ? 'стрелок' :
                   watchPart.partType === 'rotor' ? 'ротора' :
                   watchPart.partType === 'strap' ? 'ремешка' : 'безеля'}`
                : 'Редактирование детали'}
            </h1>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            ) : success ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                Деталь часов успешно обновлена! Перенаправление на список деталей...
              </div>
            ) : watchPart ? (
              <WatchPartForm
                watchPart={watchPart}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            ) : null}
          </div>
        </main>
        <Footer />
      </div>
    </AdminProtectedRoute>
  );
} 