'use client';

import { useState, FormEvent } from 'react';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import PageContent from '@/components/PageContent';
import styles from './page.module.scss';

export default function ContactsPage() {
  return (
    <div className={styles.container}>
      <Header />
      
      
      <PageContent pageId="contacts" />
      
      <Footer />
    </div>
  );
}