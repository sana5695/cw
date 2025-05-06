import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
export default function Home() {
  return (
    
    <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-10 px-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[var(--color-text-primary)]">Контакты</h1>
                <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-2xl font-semibold mb-4 text-[var(--color-text-primary)]">Свяжитесь с нами</h2>
                            
                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2 text-[var(--color-text-primary)]">Телефон</h3>
                                <p className="text-[var(--color-text-secondary)]">+7 (495) 123-45-67</p>
                                <p className="text-[var(--color-text-secondary)]">+7 (903) 987-65-43</p>
                            </div>
                            
                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2 text-[var(--color-text-primary)]">Электронная почта</h3>
                                <p className="text-[var(--color-text-secondary)]">info@customwatches.ru</p>
                                <p className="text-[var(--color-text-secondary)]">order@customwatches.ru</p>
                            </div>
                            
                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2 text-[var(--color-text-primary)]">Адрес мастерской</h3>
                                <p className="text-[var(--color-text-secondary)]">г. Москва, ул. Часовая, д. 12</p>
                                <p className="text-[var(--color-text-secondary)]">БЦ "Циферблат", 3 этаж</p>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-medium mb-2 text-[var(--color-text-primary)]">Время работы</h3>
                                <p className="text-[var(--color-text-secondary)]">Понедельник - Пятница: 10:00 - 19:00</p>
                                <p className="text-[var(--color-text-secondary)]">Суббота: 11:00 - 17:00</p>
                                <p className="text-[var(--color-text-secondary)]">Воскресенье: выходной</p>
                            </div>
                        </div>
                        
                        <div>
                            <h2 className="text-2xl font-semibold mb-4 text-[var(--color-text-primary)]">Запись на консультацию</h2>
                            
                            <p className="text-[var(--color-text-secondary)] mb-4">
                                Для обсуждения вашего индивидуального заказа мы рекомендуем записаться на персональную консультацию с нашим мастером.
                            </p>
                            
                            <p className="text-[var(--color-text-secondary)] mb-4">
                                Во время консультации вы сможете:
                            </p>
                            
                            <ul className="list-disc pl-5 mb-4 text-[var(--color-text-secondary)]">
                                <li className="mb-1">Подробно обсудить дизайн ваших будущих часов</li>
                                <li className="mb-1">Выбрать материалы для корпуса и ремешка</li>
                                <li className="mb-1">Ознакомиться с образцами наших работ</li>
                                <li className="mb-1">Узнать о процессе создания часов</li>
                                <li>Получить ответы на все ваши вопросы</li>
                            </ul>
                            
                            <p className="text-[var(--color-text-secondary)] italic">
                                Запись на консультацию осуществляется по телефону или электронной почте. Пожалуйста, укажите удобное для вас время посещения.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        <Footer />
    </div>
  );
}