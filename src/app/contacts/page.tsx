'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import PageContent from '@/components/PageContent';

export default function ContactsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <PageContent pageId="contacts" />
        </div>
      </main>
      <Footer />
    </div>
  );
}