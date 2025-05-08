'use client';

import { useState } from 'react';
import { AdminProtectedRoute } from '@/components/AdminProtectedRoute';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import WatchCasesList from '@/components/admin/WatchCasesList';
import WatchPartsList from '@/components/admin/WatchPartsList';
import Link from 'next/link';
import { FirebaseWatchPart } from '@/services/watchDataService';

export default function AdminWatchesPage() {
  const [activeTab, setActiveTab] = useState<'cases' | FirebaseWatchPart['partType']>('cases');

  const tabs = [
    { id: 'cases', label: 'Корпуса' },
    { id: 'dial', label: 'Циферблаты' },
    { id: 'hand', label: 'Стрелки' },
    { id: 'rotor', label: 'Роторы' },
    { id: 'strap', label: 'Ремешки' },
    { id: 'bezel', label: 'Безели' }
  ];

  return (
    <AdminProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-10 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
                Управление часами
              </h1>
              <div className="flex space-x-4">
                <Link 
                  href="/admin/orders" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Управление заказами
                </Link>
                <Link 
                  href="/admin/data-import" 
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
                >
                  Импорт данных
                </Link>
              </div>
            </div>

            <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg shadow-md">
              {/* Tabs */}
              <div className="flex border-b border-gray-300 mb-6 overflow-x-auto pb-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 font-medium text-sm mr-2 ${
                      activeTab === tab.id
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div>
                {activeTab === 'cases' ? (
                  <WatchCasesList />
                ) : (
                  <WatchPartsList partType={activeTab as FirebaseWatchPart['partType']} />
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </AdminProtectedRoute>
  );
} 