'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import { adminSections } from '@/components/admin/AdminNavbar';

export default function AdminDashboardPage() {
  // Фильтруем секции, исключая "Панель управления", т.к. мы уже на этой странице
  const displaySections = adminSections.filter(section => section.link !== '/admin');

  return (
    <AdminLayout pageTitle="Панель администратора">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displaySections.map((section) => (
          <Link
            key={section.link}
            href={section.link}
            className="block bg-[var(--color-bg-secondary)] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg text-blue-600">
                {section.icon}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                  {section.title}
                </h2>
                <p className="text-gray-600">
                  {section.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
} 