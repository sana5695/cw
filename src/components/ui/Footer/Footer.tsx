'use client';

import styles from './Footer.module.scss';

interface FooterProps {
  text?: string;
}

export function Footer({ text = '© 2024 NOCOPY WATCH. Все права защищены.' }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.text}>{text}</p>
      </div>
    </footer>
  );
} 