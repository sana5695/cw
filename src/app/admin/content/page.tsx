'use client';

import { useState } from 'react';
import { AdminProtectedRoute } from '@/components/AdminProtectedRoute';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import PageContentEditor from '@/components/admin/PageContentEditor';

export default function ContentManagementPage() {
  const [activePage, setActivePage] = useState<'home' | 'about' | 'contacts'>('home');

  const pageLabels = {
    home: 'Главная страница',
    about: 'О нас',
    contacts: 'Контакты'
  };

  return (
    <AdminProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-10 px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-[var(--color-text-primary)]">
              Управление контентом
            </h1>

            <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg shadow-md">
              {/* Tabs */}
              <div className="flex border-b border-gray-300 mb-6 overflow-x-auto pb-1">
                {Object.entries(pageLabels).map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setActivePage(id as 'home' | 'about' | 'contacts')}
                    className={`px-4 py-2 font-medium text-sm mr-2 ${
                      activePage === id
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Content Editor */}
              <PageContentEditor pageId={activePage} />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </AdminProtectedRoute>
  );
} 