/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Добавляем базовый путь для продакшена, если установлена переменная NEXT_PUBLIC_BASE_PATH
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // Добавляем префикс для статических ресурсов
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // Разрешаем экспорт статического сайта
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  // Отключаем вывод ссылки на Next.js в HTML
  poweredByHeader: false,
  // Отключаем проверку версии Node.js
  skipNodeCheck: true,
  images: {
    domains: [],
    // Разрешаем неоптимизированные изображения для статического экспорта
    unoptimized: process.env.NODE_ENV === 'production',
  },
  // Отключаем строгую типизацию для страниц
  typescript: {
    ignoreBuildErrors: true,
  },
  // Отключаем экспериментальные функции, которые могут вызывать конфликты
  experimental: {
    // Пустые экспериментальные настройки
  }
};

module.exports = nextConfig; 