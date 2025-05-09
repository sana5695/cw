'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AdminProtectedRoute } from '@/components/AdminProtectedRoute';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import AdminNavbar from '@/components/admin/ui/AdminNavbar';
import styles from '@/styles/admin/adminLayout.module.scss';

interface AdminLayoutProps {
  children: ReactNode;
  pageTitle?: string;
  hideTitle?: boolean;
}

/**
 * Базовый макет для страниц админ-панели
 */
export default function AdminLayout({ 
  children, 
  pageTitle = 'Панель администратора',
  hideTitle = false
}: AdminLayoutProps) {
  return (
    <AdminProtectedRoute>
      <div className={styles.adminContainer}>
        <Header />
        <AdminNavbar />
        <main className={styles.mainContent}>
          <div className={styles.contentWrapper}>
            {pageTitle && !hideTitle && (
              <h1 className={styles.pageTitle}>
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
} 