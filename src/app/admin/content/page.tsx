'use client';

import { useState } from 'react';
import PageContentEditor from '@/components/admin/PageContentEditor';
import AdminLayout from '@/components/admin/AdminLayout';

export default function ContentManagementPage() {
  const [activePage, setActivePage] = useState<'home' | 'about' | 'contacts'>('home');

  const pageLabels = {
    home: 'Главная страница',
    about: 'О нас',
    contacts: 'Контакты'
  };

  return (
    <AdminLayout pageTitle="Управление контентом">
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
    </AdminLayout>
  );
} 