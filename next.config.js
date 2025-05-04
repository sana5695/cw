/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
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