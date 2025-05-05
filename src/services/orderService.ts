import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { OrderFormData } from '../components/OrderForm';

// Тип для данных заказа в Firebase
interface FirebaseOrder {
  phone: string;
  comment: string;
  contactMethod: string;
  selectedComponents: {
    caseName: string;
    color: string;
    dial: string;
    hands: string;
    rotor: string;
    strap: string;
    bezel: string;
  };
  totalPrice?: number; // Общая стоимость заказа
  createdAt: Timestamp;
  status: 'new' | 'processing' | 'completed' | 'cancelled';
}

/**
 * Отправка заказа в Firebase
 */
export const submitOrder = async (orderData: OrderFormData & { totalPrice?: number }): Promise<string> => {
  try {
    // Подготавливаем данные для сохранения
    const firebaseOrder: FirebaseOrder = {
      ...orderData,
      createdAt: serverTimestamp() as Timestamp,
      status: 'new'
    };
    
    // Добавляем документ в коллекцию "orders"
    const docRef = await addDoc(collection(db, 'orders'), firebaseOrder);
    
    return docRef.id;
  } catch (error) {
    console.error('Ошибка при отправке заказа:', error);
    throw new Error('Не удалось отправить заказ. Пожалуйста, попробуйте позже.');
  }
}; 