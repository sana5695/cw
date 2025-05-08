'use client';

import { AdminProtectedRoute } from '@/components/AdminProtectedRoute';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const adminSections = [
    {
      title: 'Управление часами',
      description: 'Добавление и редактирование корпусов часов и их деталей',
      link: '/admin/watches',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Управление контентом',
      description: 'Редактирование текстов на главной странице, странице "О нас" и контактах',
      link: '/admin/content',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      title: 'Заказы',
      description: 'Просмотр и управление заказами клиентов',
      link: '/admin/orders',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      title: 'Пользователи',
      description: 'Управление пользователями и их правами',
      link: '/admin/users',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }
  ];

  return (
    <AdminProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-10 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-8 text-[var(--color-text-primary)]">
              Панель администратора
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {adminSections.map((section) => (
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
          </div>
        </main>
        <Footer />
      </div>
    </AdminProtectedRoute>
  );
} 