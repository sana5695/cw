import { 
  auth 
} from '../lib/firebase';
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

/**
 * Аутентификация администратора
 */
export const adminLogin = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    const errorMessage = error.message || 'Ошибка при входе в систему';
    console.error('Ошибка аутентификации:', errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Выход из системы
 */
export const adminLogout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Ошибка при выходе из системы:', error);
    throw new Error('Не удалось выйти из системы');
  }
};

/**
 * Получение текущего пользователя
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Подписка на изменение состояния аутентификации
 */
export const subscribeToAuthChanges = (callback: (user: User | null) => void): () => void => {
  return onAuthStateChanged(auth, callback);
}; 