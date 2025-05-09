'use client';

import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminSections } from '@/components/admin/ui/AdminNavbar';
import styles from '@/styles/admin/adminLayout.module.scss';

/**
 * Главная страница админ-панели
 */
export default function AdminDashboardPage() {
  // Исключаем "Панель управления" из отображаемых секций, т.к. мы уже на этой странице
  const displaySections = adminSections.filter(section => section.link !== '/admin');

  return (
    <AdminLayout pageTitle="Панель администратора">
      <div className={styles.grid}>
        {displaySections.map((section) => (
          <Link
            key={section.link}
            href={section.link}
            className={styles.card}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 p-3 rounded-lg text-blue-600 bg-blue-100">
                {section.icon}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold mb-2 text-[var(--color-text-primary)]">
                  {section.title}
                </h2>
                <p className="text-[var(--color-text-secondary)]">
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