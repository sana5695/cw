'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import router from 'next/router';
import { adminLogout } from '@/services/authService';

// Определение типа данных для навигационных секций
export interface AdminSection {
  title: string;
  description?: string;
  link: string;
  icon: React.ReactNode;
}

// Экспорт массива секций для возможности использования в других компонентах
export const adminSections: AdminSection[] = [
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
  }
];

const AdminNavbar: React.FC = () => {
  const pathname = usePathname();

  // Проверяем, является ли текущий путь или его часть активным разделом
  const isActive = (path: string) => {
    // Для главной страницы админки проверяем точное соответствие
    if (path === '/admin' && pathname === '/admin') {
      return true;
    }
    // Для остальных страниц проверяем, начинается ли путь с указанного пути раздела
    if (path !== '/admin') {
      return pathname?.startsWith(path);
    }
    return false;
  };

  const handleLogout = async () => {
    try {
      await adminLogout();
      router.push('/admin/login');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link
              key="admin-link"
              href="/admin"
              >
              <span className="font-bold text-xl">Админ-панель</span>
              </Link>
              
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {adminSections.map((section) => (
                  <Link
                    key={section.link}
                    href={section.link}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200 ${
                      isActive(section.link)
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <span className="mr-2">{section.icon}</span>
                    {section.title}
                  </Link>
                ))}
                <button
                onClick={handleLogout}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300"
              >
                Выйти
              </button>
              </div>
              
            </div>
          </div>
        </div>
      </div>
      
      {/* Мобильное меню */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {adminSections.map((section) => (
            <Link
              key={section.link}
              href={section.link}
              className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                isActive(section.link)
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="mr-2">{section.icon}</span>
              {section.title}
            </Link>
            
          ))}
                          <button
                onClick={handleLogout}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300"
              >
                Выйти
              </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar; 

function setError(message: any) {
  throw new Error('Function not implemented.');
}
