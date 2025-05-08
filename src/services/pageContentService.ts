import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export interface PageContent {
  title: string;
  content: string;
  updatedAt: Date;
}

export const getPageContent = async (pageId: string): Promise<PageContent | null> => {
  try {
    const docRef = doc(db, 'pages', pageId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as PageContent;
    }
    
    return null;
  } catch (error) {
    console.error('Ошибка при получении контента страницы:', error);
    throw error;
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
  } catch (error) {
    console.error('Ошибка при обновлении контента страницы:', error);
    throw error;
  }
}; 