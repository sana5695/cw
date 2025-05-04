/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost'],
  },
  // Отключаем экспериментальные функции, которые могут вызывать ошибки
  experimental: {
    serverActions: false,
  }
};

module.exports = nextConfig; 