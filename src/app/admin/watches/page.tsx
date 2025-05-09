'use client';

import { useState } from 'react';
import WatchCasesList from '@/components/admin/WatchCasesList';
import WatchPartsList from '@/components/admin/WatchPartsList';
import Link from 'next/link';
import { FirebaseWatchPart } from '@/services/watchDataService';
import AdminLayout from '@/components/admin/AdminLayout';

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
    <AdminLayout pageTitle="Управление часами">
      

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
    </AdminLayout>
  );
} 