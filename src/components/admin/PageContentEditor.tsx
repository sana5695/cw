'use client';

import { useState, useEffect } from 'react';
import { PageContent, getPageContent, updatePageContent } from '@/services/pageContentService';

interface PageContentEditorProps {
  pageId: string;
  onSuccess?: () => void;
}

export default function PageContentEditor({ pageId, onSuccess }: PageContentEditorProps) {
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadContent();
  }, [pageId]);

  const loadContent = async () => {
    try {
      setLoading(true);
      const pageContent = await getPageContent(pageId);
      setContent(pageContent || { title: '', content: '', updatedAt: new Date() });
    } catch (err) {
      console.error('Ошибка при загрузке контента:', err);
      setError('Не удалось загрузить контент страницы');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    try {
      setSaving(true);
      setError(null);
      await updatePageContent(pageId, content);
      setSuccess(true);
      onSuccess?.();
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Ошибка при сохранении контента:', err);
      setError('Не удалось сохранить изменения');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Изменения успешно сохранены
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Заголовок
        </label>
        <input
          type="text"
          id="title"
          value={content?.title || ''}
          onChange={(e) => setContent(prev => prev ? { ...prev, title: e.target.value } : null)}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Содержание
        </label>
        <textarea
          id="content"
          value={content?.content || ''}
          onChange={(e) => setContent(prev => prev ? { ...prev, content: e.target.value } : null)}
          rows={10}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-300"
        >
          {saving ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </div>
    </form>
  );
} 