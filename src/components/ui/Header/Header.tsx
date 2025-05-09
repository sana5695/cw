'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.scss';

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: '/', label: 'Главная' },
  { href: '/customize', label: 'Настройка часов' },
  { href: '/about', label: 'О нас' },
  { href: '/contacts', label: 'Контакты' },
];

interface HeaderProps {
  title?: string;
  backUrl?: string;
  backLabel?: string;
  children?: React.ReactNode;
}

export function Header({ 
  title, 
  backUrl, 
  backLabel = 'Назад', 
  children 
}: HeaderProps) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  
  // Закрываем мобильное меню при смене маршрута
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);
  
  // Блокируем прокрутку при открытом мобильном меню
  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileNavOpen]);
  
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {backUrl ? (
          <Link href={backUrl} className={styles.backLink}>
            <span className={styles.backIcon}>&larr;</span>
            <span>{backLabel}</span>
          </Link>
        ) : (
          <div className={styles.spacer}></div>
        )}
        
        {title && <h1 className={styles.title}>{title}</h1>}
        
        {/* Десктопная навигация */}
        <nav className={styles.nav}>
          {navLinks.map(link => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.activeNavLink : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        {/* Кнопка мобильного меню */}
        <button 
          className={styles.mobileMenuButton}
          onClick={() => setMobileNavOpen(true)}
          aria-label="Открыть меню"
        >
          ☰
        </button>
        
        {/* Мобильная навигация */}
        <div className={`${styles.mobileNav} ${mobileNavOpen ? styles.mobileNavOpen : ''}`}>
          <button 
            className={styles.mobileCloseButton}
            onClick={() => setMobileNavOpen(false)}
            aria-label="Закрыть меню"
          >
            ✕
          </button>
          
          <div className={styles.mobileNavLinks}>
            {navLinks.map(link => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`${styles.navLink} ${pathname === link.href ? styles.activeNavLink : ''}`}
                onClick={() => setMobileNavOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
} 