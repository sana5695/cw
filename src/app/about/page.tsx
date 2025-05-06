import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
export default function Home() {
  return (
    
    <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-10 px-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[var(--color-text-primary)]">О нас</h1>
                <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-[var(--color-text-primary)]">Мастерская эксклюзивных часов</h2>
                    
                    <p className="text-[var(--color-text-secondary)] mb-4">
                        Мы — команда опытных часовых мастеров с более чем 15-летним опытом в создании и реставрации часов. Наша мастерская специализируется на изготовлении эксклюзивных часов по индивидуальному заказу, где каждая деталь продумана и выполнена вручную.
                    </p>
                    
                    <p className="text-[var(--color-text-secondary)] mb-4">
                        Наша философия основана на сочетании традиционного часового искусства и инновационных технологий. Мы используем только высококачественные материалы: от благородных металлов для корпусов до швейцарских механизмов, гарантирующих точность и надежность.
                    </p>
                    
                    <h3 className="text-xl font-semibold mb-3 mt-6 text-[var(--color-text-primary)]">Наше мастерство</h3>
                    
                    <p className="text-[var(--color-text-secondary)] mb-4">
                        Каждые часы, созданные в нашей мастерской, проходят через руки нескольких мастеров-специалистов. Мы контролируем весь процесс создания: от разработки индивидуального дизайна до финальной полировки и настройки механизма.
                    </p>
                    
                    <p className="text-[var(--color-text-secondary)] mb-4">
                        Особое внимание мы уделяем деталям — гравировке циферблата, отделке корпуса, качеству ремешков. Наши часы — это не просто прибор для измерения времени, а произведение искусства, которое станет вашей семейной реликвией.
                    </p>
                    
                    <h3 className="text-xl font-semibold mb-3 mt-6 text-[var(--color-text-primary)]">Индивидуальный подход</h3>
                    
                    <p className="text-[var(--color-text-secondary)] mb-4">
                        Мы верим, что часы должны отражать индивидуальность своего владельца. Поэтому каждый проект начинается с подробной консультации, где мы обсуждаем ваши предпочтения, стиль жизни и особые пожелания. 
                    </p>
                    
                    <p className="text-[var(--color-text-secondary)]">
                        Наша цель — создать для вас уникальные часы, которые будут радовать вас десятилетиями и передаваться из поколения в поколение, сохраняя свою красоту и точность.
                    </p>
                </div>
            </div>
        </main>
        <Footer />
    </div>
  );
}