'use client';

import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import PageContent from '@/components/PageContent';
import Image from 'next/image';
import { Suspense } from "react";
import styles from './page.module.scss';

export default function HomePage() {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.hero}>
            <div className={styles.heroContent}>
              <div className={styles.logoContainer}>
                <Image 
                  className={styles.logoImage} 
                  src="/images/cases/c1.png" 
                  alt="Logo" 
                  fill 
                  sizes="(max-width: 768px) 112px, 200px" 
                  priority 
                />
              </div>
              <div className={styles.titleContainer}>
                <h2 className={styles.titleLine}>NOCOPY</h2>
                <h2 className={styles.titleLine}>WATCH</h2>
                <h2 className={styles.titleLineSmall}>STORE</h2>
              </div>
            </div>
          </div>
          
          <Suspense fallback={null}>
            <PageContent pageId="home" />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}