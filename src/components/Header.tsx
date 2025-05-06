import Link from 'next/link';

export function Header() {
    return (
        <header>
            <Link href="/">Главная</Link>
            <Link href="/customize">Конструктор</Link>
            <Link href="/about">О нас</Link>
            <Link href="/contacts">Контакты</Link>
        </header>
    );
}