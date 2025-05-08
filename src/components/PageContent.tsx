'use client';

import { useState, useEffect } from 'react';
import type { PageContent } from '@/services/pageContentService';
import { getPageContent } from '@/services/pageContentService';

interface PageContentProps {
  pageId: string;
}

export default function PageContent({ pageId }: PageContentProps) {
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, [pageId]);

  const loadContent = async () => {
    try {
      setLoading(true);
      const pageContent = await getPageContent(pageId);
      setContent(pageContent);
    } catch (err) {
      console.error('Ошибка при загрузке контента:', err);
      setError('Не удалось загрузить контент страницы');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!content) {
    return (
      <div className="text-center py-8 text-gray-500">
        Контент не найден
      </div>
    );
  }

  return (
    <div className="prose max-w-none">
      <h1 className="text-3xl font-bold mb-6">{content.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content.content }} />
    </div>
  );
} 