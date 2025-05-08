'use client';

import { useState } from 'react';
import { AdminProtectedRoute } from '@/components/AdminProtectedRoute';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { initializeWatchData } from '@/services/watchDataService';

export default function InitializePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInitialize = async () => {
    try {
      setLoading(true);
      setError(null);
      await initializeWatchData();
      setSuccess(true);
    } catch (err) {
      console.error('Ошибка при инициализации данных:', err);
      setError(err instanceof Error ? err.message : 'Не удалось инициализировать данные');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-10 px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-[var(--color-text-primary)]">
              Инициализация данных
            </h1>

            <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg shadow-md">
              <p className="mb-4 text-[var(--color-text-secondary)]">
                Эта страница позволяет инициализировать данные в Firestore из локального файла watchData.ts.
                Будьте осторожны, так как это действие перезапишет существующие данные.
              </p>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  Данные успешно инициализированы!
                </div>
              )}

              <button
                onClick={handleInitialize}
                disabled={loading}
                className={`px-4 py-2 rounded ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                {loading ? 'Инициализация...' : 'Инициализировать данные'}
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </AdminProtectedRoute>
  );
} 