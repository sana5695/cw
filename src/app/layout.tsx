import './globals.css';
import { Inter } from 'next/font/google';
import ContentPreloader from '@/components/ContentPreloader';

// Оптимизация загрузки шрифта
const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  display: 'swap',  // Используем swap для более быстрого отображения текста
  preload: true     // Предзагрузка шрифта
});

export const metadata = {
  title: 'Конструктор часов',
  description: 'Создайте свои уникальные часы',
};

// Отдельный экспорт для настроек viewport в соответствии с требованиями Next.js 13+
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

// Включаем динамические импорты для оптимизации
export const dynamicParams = true;
export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ContentPreloader />
        <div suppressHydrationWarning>
          {children}
        </div>
      </body>
    </html>
  );
}
