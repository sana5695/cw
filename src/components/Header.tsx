import Link from 'next/link';

export function Header() {
    return (
        <header className="bg-[var(--color-bg-secondary)] py-4 px-6 sticky top-0 z-10 shadow-md">
            <nav className="flex flex-wrap items-center justify-center gap-6 md:gap-10 max-w-6xl mx-auto">
                <Link href="/" className="text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors font-medium">
                    Главная
                </Link>
                <Link href="/customize" className="text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors font-medium">
                    Конструктор
                </Link>
                <Link href="/about" className="text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors font-medium">
                    О нас
                </Link>
                <Link href="/contacts" className="text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors font-medium">
                    Контакты
                </Link>
            </nav>
        </header>
    );
}