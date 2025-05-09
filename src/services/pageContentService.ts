import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, getDocs, query, collection, limit, where } from 'firebase/firestore';

export interface PageContent {
  title: string;
  content: string;
  updatedAt: Date;
}

// Кэш для хранения контента страниц
const pageContentCache: Record<string, { content: PageContent, timestamp: number }> = {};

// Приоритетные страницы для предзагрузки
const priorityPages = ['home', 'about', 'contacts'];

// Время жизни кэша (12 часов в миллисекундах)
const CACHE_TTL = 12 * 60 * 60 * 1000; 

// Функция для проверки актуальности кэша
const isCacheValid = (pageId: string): boolean => {
  const cached = pageContentCache[pageId];
  if (!cached) return false;
  
  const now = Date.now();
  return (now - cached.timestamp) < CACHE_TTL;
};

export const getPageContent = async (pageId: string): Promise<PageContent | null> => {
  try {
    // Проверяем кэш перед запросом к Firebase
    if (isCacheValid(pageId)) {
      return pageContentCache[pageId].content;
    }
    
    const docRef = doc(db, 'pages', pageId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const content = docSnap.data() as PageContent;
      
      // Сохраняем в кэш
      pageContentCache[pageId] = { 
        content, 
        timestamp: Date.now() 
      };
      
      return content;
    }
    
    return null;
  } catch (error) {
    console.error('Ошибка при получении контента страницы:', error);
    throw error;
  }
};

// Оптимизированная функция для предзагрузки приоритетных страниц
export const prefetchPriorityPages = async (): Promise<void> => {
  try {
    // Проверяем, какие страницы еще не загружены в кэш
    const pagesToLoad = priorityPages.filter(pageId => !isCacheValid(pageId));
    
    if (pagesToLoad.length === 0) {
      // Все страницы уже в кэше
      return;
    }
    
    // Используем один запрос с where in для загрузки только нужных страниц
    const pagesQuery = query(
      collection(db, 'pages'),
      where('__name__', 'in', pagesToLoad)
    );
    
    const querySnapshot = await getDocs(pagesQuery);
    
    querySnapshot.forEach((doc) => {
      pageContentCache[doc.id] = {
        content: doc.data() as PageContent,
        timestamp: Date.now()
      };
    });
  } catch (error) {
    console.error('Ошибка при предзагрузке страниц:', error);
  }
};

export const updatePageContent = async (pageId: string, content: Partial<PageContent>): Promise<void> => {
  try {
    const docRef = doc(db, 'pages', pageId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      await updateDoc(docRef, {
        ...content,
        updatedAt: new Date()
      });
    } else {
      await setDoc(docRef, {
        ...content,
        updatedAt: new Date()
      });
    }
    
    // Инвалидируем кэш при обновлении контента
    delete pageContentCache[pageId];
  } catch (error) {
    console.error('Ошибка при обновлении контента страницы:', error);
    throw error;
  }
}; 