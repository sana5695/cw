import { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
    serverActions: false
  }
};

export default nextConfig;
