import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
export default function Home() {
  return (
    
    <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-10 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col items-center justify-center py-10 mb-10">
                    <div className="flex flex-row md:flex-row items-center justify-center gap-0 md:gap-2">
                        <div className="relative w-28 h-40 md:w-50 md:h-70">
                            <Image className=" rotate-12"  src="/images/cases/c1.png" alt="Logo" fill sizes="100vh , 100vw" />
                        </div>
                        <div className="flex flex-col items-start md:items-start">
                            <h2 className="text-4xl md:text-7xl font-bold text-[var(--color-text-primary)]">NOCOPY</h2>
                            <h2 className="text-4xl md:text-7xl font-bold text-[var(--color-text-primary)]">WATCH</h2>
                            <h2 className="text-3xl md:text-6xl font-bold text-[var(--color-text-primary)]">STORE</h2>
                        </div>
                    </div>
                </div>
                
                <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg shadow-md">
                    <p className="text-[var(--color-text-secondary)] mb-4">Добро ПОжаловать в магазин уникальных часов NOCOPY WATCH STORE! Создайте свои неповторимые часы с помощью нашего
                        <Link href="/customize" className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"> конструктора</Link>.</p>
                </div>
            </div>
        </main>
        <Footer />
    </div>
  );
}