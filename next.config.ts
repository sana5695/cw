import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i.ibb.co'],
    // Альтернативно, можно использовать более детальную настройку:
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'i.ibb.co',
    //     pathname: '**',
    //   },
    // ],
  },
  // Отключаем строгую типизацию для страниц
  typescript: {
    ignoreBuildErrors: true,
  },
  // Отключаем экспериментальные функции, которые могут вызывать конфликты
  experimental: {

  }
};

export default nextConfig;
