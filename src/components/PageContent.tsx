'use client';

import { useState, useEffect, memo, useCallback } from 'react';
import type { PageContent } from '@/services/pageContentService';
import { getPageContent } from '@/services/pageContentService';

interface PageContentProps {
  pageId: string;
}

// Скелетон для состояния загрузки
const ContentSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-10 bg-gray-200 rounded mb-6 w-2/3"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      <div className="h-4 bg-gray-200 rounded w-3/6"></div>
    </div>
  </div>
);

function PageContentComponent({ pageId }: PageContentProps) {
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Мемоизируем функцию загрузки для оптимизации производительности
  const loadContent = useCallback(async () => {
    if (!pageId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const pageContent = await getPageContent(pageId);
      setContent(pageContent);
    } catch (err) {
      console.error('Ошибка при загрузке контента:', err);
      setError('Не удалось загрузить контент страницы');
    } finally {
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    const controller = new AbortController();
    
    // Добавляем небольшую задержку для предотвращения LCP ухудшения
    const timeoutId = setTimeout(() => {
      loadContent().catch(() => {});
    }, 0);
    
    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [loadContent]);

  if (loading) {
    return <ContentSkeleton />;
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
      <div dangerouslySetInnerHTML={{ __html: content.title }} />
      <div dangerouslySetInnerHTML={{ __html: content.content }} />
    </div>
  );
}

// Используем React.memo для предотвращения лишних перерисовок
export default memo(PageContentComponent); 