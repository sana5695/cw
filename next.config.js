/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Отключаем проверку ESLint при сборке
    ignoreDuringBuilds: true
  },
  images: {
    domains: ['localhost'],
  },
  // Отключаем экспериментальные функции, которые могут вызывать ошибки
  experimental: {
    // Никаких экспериментальных опций
  }
};

module.exports = nextConfig; 