'use client';

import Image from 'next/image';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import PageContent from '@/components/PageContent';
import styles from './page.module.scss';


export default function AboutPage() {
  return (
    <div className={styles.container}>
      <Header />
      
      
      <PageContent pageId="about" />
      
      <Footer />
    </div>
  );
}