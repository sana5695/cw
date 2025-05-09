'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';
import styles from '@/styles/admin/adminNavbar.module.scss';

// Определение типа для навигационных секций
export interface AdminSection {
  title: string;
  description?: string;
  link: string;
  icon: React.ReactNode;
}

// Секции админ-панели
export const adminSections: AdminSection[] = [
  {
    title: 'Управление часами',
    description: 'Добавление и редактирование корпусов часов и их деталей',
    link: '/admin/watches',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: 'Управление контентом',
    description: 'Редактирование текстов на главной странице, странице "О нас" и контактах',
    link: '/admin/content',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    )
  },
  {
    title: 'Заказы',
    description: 'Просмотр и управление заказами клиентов',
    link: '/admin/orders',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    )
  }
];

/**
 * Компонент навигационной панели админ-панели
 */
export default function AdminNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { logout } = useAdminAuth();

  // Проверяем, является ли текущий путь или его часть активным разделом
  const isActive = (path: string) => {
    if (path === '/admin' && pathname === '/admin') {
      return true;
    }
    if (path !== '/admin' && pathname?.startsWith(path)) {
      return true;
    }
    return false;
  };

  // Обработчик выхода
  const handleLogout = async () => {
    await logout();
  };

  // Переключение мобильного меню
  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <div className={styles.navbarContent}>
          <div className={styles.logoContainer}>
            <Link href="/admin" className={styles.logoText}>
              Админ-панель
            </Link>
          </div>

          {/* Десктопная навигация */}
          <div className={styles.desktopNav}>
            <div className={styles.navLinks}>
              {adminSections.map((section) => (
                <Link
                  key={section.link}
                  href={section.link}
                  className={`${styles.navLink} ${
                    isActive(section.link) ? styles.activeNavLink : ''
                  }`}
                >
                  <span className={styles.navIcon}>{section.icon}</span>
                  {section.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Кнопка выхода для десктопа */}
          <button 
            onClick={handleLogout}
            className={styles.logoutButton}
          >
            Выйти
          </button>

          {/* Кнопка мобильного меню */}
          <button 
            className={styles.mobileMenuButton}
            onClick={toggleMobileMenu}
            aria-label="Открыть меню"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      <div className={`${styles.mobileNav} ${mobileMenuOpen ? styles.mobileNavOpen : ''}`}>
        {adminSections.map((section) => (
          <Link
            key={section.link}
            href={section.link}
            className={`${styles.mobileNavLink} ${
              isActive(section.link) ? styles.activeMobileNavLink : ''
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className={styles.navIcon}>{section.icon}</span>
            {section.title}
          </Link>
        ))}
        
        <div className={styles.mobileDivider}></div>
        
        {/* Кнопка выхода для мобильных устройств */}
        <button 
          onClick={handleLogout}
          className={`${styles.logoutButton} ${styles.mobileLogoutButton}`}
        >
          Выйти
        </button>
      </div>
    </nav>
  );
} 