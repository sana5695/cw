/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    // Отключаем некоторые экспериментальные функции, которые могут вызывать проблемы с гидратацией
    serverComponentsExternalPackages: [],
    optimizeCss: false,
    scrollRestoration: false,
  }
};

module.exports = nextConfig; 