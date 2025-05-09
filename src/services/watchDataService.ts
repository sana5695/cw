import { db, auth } from '../lib/firebase';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import watchData from '../data/watchData';

// Типы данных для работы с часами в Firebase
export type FirebaseWatchCase = {
  id?: string;
  name: string;
  image: string;
  colors: {
    name: string;
    image: string;
  }[];
  availableParts: {
    hasDials: boolean;
    hasHands: boolean;
    hasRotors: boolean;
    hasStraps: boolean;
    hasBezel: boolean;
  };
  price?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export type FirebaseWatchPart = {
  id?: string;
  name: string;
  image: string;
  compatibleCases: string[];
  price?: number;
  partType: 'dial' | 'hand' | 'rotor' | 'strap' | 'bezel';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

/**
 * Получение всех корпусов часов
 */
export const getAllWatchCases = async (): Promise<FirebaseWatchCase[]> => {
  try {
    console.log('Получение всех корпусов часов...');
    const casesQuery = query(collection(db, 'watchCases'), orderBy('name'));
    const querySnapshot = await getDocs(casesQuery);
    
    console.log('Найдено корпусов:', querySnapshot.size);
    const cases = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log(`Корпус ID: ${doc.id}, Имя: ${data.name}`);
      return {
        id: doc.id,
        ...data
      } as FirebaseWatchCase;
    });
    
    return cases;
  } catch (error) {
    console.error('Ошибка при получении корпусов часов:', error);
    throw new Error('Не удалось получить список корпусов часов.');
  }
};

/**
 * Получение корпуса часов по ID
 */
export const getWatchCaseById = async (caseId: string): Promise<FirebaseWatchCase | null> => {
  try {
    if (!caseId) {
      throw new Error('ID корпуса часов не указан');
    }

    console.log('Получение корпуса часов с ID:', caseId);
    const docRef = doc(db, 'watchCases', caseId);
    
    // Проверяем существование документа
    const docSnap = await getDoc(docRef);
    console.log('Документ существует:', docSnap.exists());
    
    if (!docSnap.exists()) {
      console.log('Документ не найден в Firestore');
      return null;
    }

    const data = docSnap.data();
    console.log('Данные документа:', data);
    
    if (!data) {
      console.log('Документ существует, но данные отсутствуют');
      return null;
    }

    return {
      id: docSnap.id,
      ...data
    } as FirebaseWatchCase;
  } catch (error) {
    console.error(`Ошибка при получении корпуса часов ${caseId}:`, error);
    throw error instanceof Error ? error : new Error('Не удалось получить данные корпуса часов.');
  }
};

/**
 * Получение корпуса часов по имени
 */
export const getWatchCaseByName = async (caseName: string): Promise<FirebaseWatchCase | null> => {
  try {
    const casesQuery = query(
      collection(db, 'watchCases'), 
      where('name', '==', caseName)
    );
    const querySnapshot = await getDocs(casesQuery);
    
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as FirebaseWatchCase;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Ошибка при получении корпуса часов по имени ${caseName}:`, error);
    throw new Error('Не удалось получить данные корпуса часов.');
  }
};

/**
 * Добавление нового корпуса часов
 */
export const addWatchCase = async (watchCase: Omit<FirebaseWatchCase, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const now = Timestamp.now();
    
    const watchCaseData: Omit<FirebaseWatchCase, 'id'> = {
      ...watchCase,
      createdAt: now,
      updatedAt: now
    };

    console.log(watchCaseData);
    
    const docRef = await addDoc(collection(db, 'watchCases'), watchCaseData);
    console.log(docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Ошибка при добавлении корпуса часов:', error);
    throw new Error('Не удалось добавить корпус часов.');
  }
};

/**
 * Обновление корпуса часов
 */
export const updateWatchCase = async (
  caseId: string, 
  watchCase: Partial<Omit<FirebaseWatchCase, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  try {
    const docRef = doc(db, 'watchCases', caseId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Корпус часов не найден');
    }
    
    // Удаляем undefined значения из объекта
    const updateData = Object.entries(watchCase).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
    
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error(`Ошибка при обновлении корпуса часов ${caseId}:`, error);
    throw new Error('Не удалось обновить корпус часов.');
  }
};

/**
 * Удаление корпуса часов
 */
export const deleteWatchCase = async (caseId: string): Promise<void> => {
  try {
    const docRef = doc(db, 'watchCases', caseId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Ошибка при удалении корпуса часов ${caseId}:`, error);
    throw new Error('Не удалось удалить корпус часов.');
  }
};

/**
 * Получение всех деталей часов определенного типа
 */
export const getWatchParts = async (partType: FirebaseWatchPart['partType']): Promise<FirebaseWatchPart[]> => {
  try {
    const partsQuery = query(
      collection(db, 'watchParts'), 
      where('partType', '==', partType),
      orderBy('name')
    );
    console.log(partsQuery);
    const querySnapshot = await getDocs(partsQuery);

    console.log(querySnapshot);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FirebaseWatchPart));
  } catch (error) {
    console.error(`Ошибка при получении деталей часов типа ${partType}:`, error);
    throw new Error(`Не удалось получить список деталей типа ${partType}.`);
  }
};

/**
 * Получение деталей часов, совместимых с указанным корпусом
 */
export const getCompatibleWatchParts = async (
  caseName: string,
  partType: FirebaseWatchPart['partType']
): Promise<FirebaseWatchPart[]> => {
  try {
    const partsQuery = query(
      collection(db, 'watchParts'), 
      where('partType', '==', partType),
      where('compatibleCases', 'array-contains', caseName),
      orderBy('name')
    );
    const querySnapshot = await getDocs(partsQuery);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FirebaseWatchPart));
  } catch (error) {
    console.error(`Ошибка при получении совместимых деталей типа ${partType} для корпуса ${caseName}:`, error);
    throw new Error(`Не удалось получить список совместимых деталей.`);
  }
};

/**
 * Получение детали часов по ID
 */
export const getWatchPartById = async (partId: string): Promise<FirebaseWatchPart | null> => {
  try {
    const docRef = doc(db, 'watchParts', partId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as FirebaseWatchPart;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Ошибка при получении детали часов ${partId}:`, error);
    throw new Error('Не удалось получить данные детали часов.');
  }
};

/**
 * Добавление новой детали часов
 */
export const addWatchPart = async (watchPart: Omit<FirebaseWatchPart, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    console.log(watchPart);
    const now = Timestamp.now();
    
    const watchPartData: Omit<FirebaseWatchPart, 'id'> = {
      ...watchPart,
      createdAt: now,
      updatedAt: now
    };

    console.log(watchPartData);
    
    const docRef = await addDoc(collection(db, 'watchParts'), watchPartData);
    console.log(docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Ошибка при добавлении детали часов:', error);
    throw new Error('Не удалось добавить деталь часов.');
  }
};

/**
 * Обновление детали часов
 */
export const updateWatchPart = async (
  partId: string, 
  watchPart: Partial<Omit<FirebaseWatchPart, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  try {
    const docRef = doc(db, 'watchParts', partId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Деталь часов не найдена');
    }
    
    // Удаляем undefined значения из объекта
    const updateData = Object.entries(watchPart).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
    
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error(`Ошибка при обновлении детали часов ${partId}:`, error);
    throw new Error('Не удалось обновить деталь часов.');
  }
};

/**
 * Удаление детали часов
 */
export const deleteWatchPart = async (partId: string): Promise<void> => {
  try {
    const docRef = doc(db, 'watchParts', partId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Ошибка при удалении детали часов ${partId}:`, error);
    throw new Error('Не удалось удалить деталь часов.');
  }
};

/**
 * Получение полной структуры данных часов из Firebase
 * аналогично структуре watchData.ts
 */
export const getFullWatchData = async (): Promise<{
  cases: FirebaseWatchCase[];
  dials: FirebaseWatchPart[];
  hands: FirebaseWatchPart[];
  rotors: FirebaseWatchPart[];
  straps: FirebaseWatchPart[];
  bezels: FirebaseWatchPart[];
}> => {
  try {
    const cases = await getAllWatchCases();
    const dials = await getWatchParts('dial');
    const hands = await getWatchParts('hand');
    const rotors = await getWatchParts('rotor');
    const straps = await getWatchParts('strap');
    const bezels = await getWatchParts('bezel');
    
    return { cases, dials, hands, rotors, straps, bezels };
  } catch (error) {
    console.error('Ошибка при получении полных данных о часах:', error);
    throw new Error('Не удалось получить данные о часах.');
  }
};

/**
 * Инициализация данных в Firestore из локального файла
 */
export const initializeWatchData = async (): Promise<void> => {
  try {
    const batch = writeBatch(db);
    
    // Добавляем корпуса часов
    for (const watchCase of watchData.cases) {
      const docRef = doc(collection(db, 'watchCases'));
      batch.set(docRef, {
        ...watchCase,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    }
    
    // Добавляем детали часов
    const parts = [
      ...watchData.dials.map(part => ({ ...part, partType: 'dial' as const })),
      ...watchData.hands.map(part => ({ ...part, partType: 'hand' as const })),
      ...watchData.rotors.map(part => ({ ...part, partType: 'rotor' as const })),
      ...watchData.straps.map(part => ({ ...part, partType: 'strap' as const })),
      ...watchData.bezels.map(part => ({ ...part, partType: 'bezel' as const }))
    ];
    
    for (const part of parts) {
      const docRef = doc(collection(db, 'watchParts'));
      batch.set(docRef, {
        ...part,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    }
    
    await batch.commit();
    console.log('Данные успешно инициализированы в Firestore');
  } catch (error) {
    console.error('Ошибка при инициализации данных:', error);
    throw new Error('Не удалось инициализировать данные в Firestore');
  }
};

/**
 * Оптимизированная функция для одновременного получения корпуса часов и всех совместимых деталей
 */
export const getWatchCaseWithCompatibleParts = async (caseName: string): Promise<{
  watchCase: FirebaseWatchCase | null;
  compatibleParts: {
    dials: FirebaseWatchPart[];
    hands: FirebaseWatchPart[];
    rotors: FirebaseWatchPart[];
    straps: FirebaseWatchPart[];
    bezels: FirebaseWatchPart[];
  };
}> => {
  try {
    // Получаем корпус часов
    const casesQuery = query(
      collection(db, 'watchCases'),
      where('name', '==', caseName)
    );
    
    const querySnapshot = await getDocs(casesQuery);
    
    if (querySnapshot.empty) {
      return {
        watchCase: null,
        compatibleParts: {
          dials: [],
          hands: [],
          rotors: [],
          straps: [],
          bezels: []
        }
      };
    }
    
    const docSnap = querySnapshot.docs[0];
    const watchCase = {
      id: docSnap.id,
      ...docSnap.data()
    } as FirebaseWatchCase;
    
    // Определяем, какие типы деталей нужно получить
    const partTypesToFetch = [];
    if (watchCase.availableParts.hasDials) partTypesToFetch.push('dial');
    if (watchCase.availableParts.hasHands) partTypesToFetch.push('hand');
    if (watchCase.availableParts.hasRotors) partTypesToFetch.push('rotor');
    if (watchCase.availableParts.hasStraps) partTypesToFetch.push('strap');
    if (watchCase.availableParts.hasBezel) partTypesToFetch.push('bezel');
    
    // Параллельно получаем все совместимые детали
    const fetchPromises = partTypesToFetch.map(partType => 
      getCompatibleWatchParts(caseName, partType as FirebaseWatchPart['partType'])
    );
    
    const results = await Promise.all(fetchPromises);
    
    // Собираем результаты
    const compatibleParts = {
      dials: [] as FirebaseWatchPart[],
      hands: [] as FirebaseWatchPart[],
      rotors: [] as FirebaseWatchPart[],
      straps: [] as FirebaseWatchPart[],
      bezels: [] as FirebaseWatchPart[]
    };
    
    partTypesToFetch.forEach((partType, index) => {
      switch(partType) {
        case 'dial':
          compatibleParts.dials = results[index];
          break;
        case 'hand':
          compatibleParts.hands = results[index];
          break;
        case 'rotor':
          compatibleParts.rotors = results[index];
          break;
        case 'strap':
          compatibleParts.straps = results[index];
          break;
        case 'bezel':
          compatibleParts.bezels = results[index];
          break;
      }
    });
    
    return { watchCase, compatibleParts };
  } catch (error) {
    console.error(`Ошибка при получении данных для кастомизации ${caseName}:`, error);
    throw new Error('Не удалось получить данные для кастомизации часов.');
  }
}; 