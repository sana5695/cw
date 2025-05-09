'use client';

import { ReactNode } from 'react';
import { AdminProtectedRoute } from '@/components/AdminProtectedRoute';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import AdminNavbar from './AdminNavbar';

interface AdminLayoutProps {
  children: ReactNode;
  pageTitle?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  pageTitle = 'Панель администратора' 
}) => {
  return (
    <AdminProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Header />
        <AdminNavbar />
        <main className="flex-grow py-8 px-6">
          <div className="max-w-7xl mx-auto">
            {pageTitle && (
              <h1 className="text-2xl font-bold mb-8 text-[var(--color-text-primary)]">
                {pageTitle}
              </h1>
            )}
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </AdminProtectedRoute>
  );
};

export default AdminLayout; 