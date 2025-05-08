'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminProtectedRoute } from '@/components/AdminProtectedRoute';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import WatchCaseForm from '@/components/admin/WatchCaseForm';
import { getWatchCaseById, FirebaseWatchCase } from '@/services/watchDataService';

export default function EditWatchCasePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [watchCase, setWatchCase] = useState<FirebaseWatchCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadCase = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!params.id) {
          console.error('ID корпуса часов не указан в параметрах');
          setError('ID корпуса часов не указан');
          return;
        }

        console.log('Загрузка корпуса часов с ID:', params.id);
        const caseData = await getWatchCaseById(params.id);
        console.log('Полученные данные корпуса:', caseData);
        
        if (caseData) {
          setWatchCase(caseData);
        } else {
          console.log('Корпус часов не найден в базе данных');
          setError('Корпус часов не найден');
        }
      } catch (err) {
        console.error('Ошибка при загрузке корпуса:', err);
        setError(err instanceof Error ? err.message : 'Не удалось загрузить данные корпуса часов');
      } finally {
        setLoading(false);
      }
    };

    loadCase();
  }, [params.id]);

  const handleSuccess = (caseId: string) => {
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
              Редактирование корпуса часов
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
                Корпус часов успешно обновлен! Перенаправление на список корпусов...
              </div>
            ) : watchCase ? (
              <WatchCaseForm
                watchCase={watchCase}
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