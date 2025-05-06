import { db } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  Timestamp, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { OrderFormData } from '../components/OrderForm';

// Тип для данных заказа в Firebase
export interface FirebaseOrder {
  id?: string; // ID документа в Firestore
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
  adminNotes?: string; // Заметки администратора по заказу
  statusHistory?: Array<{
    status: string;
    timestamp: Timestamp;
    note?: string;
  }>;
}

/**
 * Отправка заказа в Firebase
 */
export const submitOrder = async (orderData: OrderFormData & { totalPrice?: number }): Promise<string> => {
  try {
    // Создаем текущую временную метку вручную
    const now = Timestamp.now();
    
    // Подготавливаем данные для сохранения
    const firebaseOrder: FirebaseOrder = {
      ...orderData,
      createdAt: serverTimestamp() as Timestamp,
      status: 'new',
      statusHistory: [{
        status: 'new',
        timestamp: now, // Используем Timestamp.now() вместо serverTimestamp()
        note: 'Заказ создан'
      }]
    };
    
    // Добавляем документ в коллекцию "orders"
    const docRef = await addDoc(collection(db, 'orders'), firebaseOrder);
    
    return docRef.id;
  } catch (error) {
    console.error('Ошибка при отправке заказа:', error);
    throw new Error('Не удалось отправить заказ. Пожалуйста, попробуйте позже.');
  }
};

/**
 * Получение всех заказов
 */
export const getOrders = async (): Promise<FirebaseOrder[]> => {
  try {
    const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(ordersQuery);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FirebaseOrder));
  } catch (error) {
    console.error('Ошибка при получении заказов:', error);
    throw new Error('Не удалось получить список заказов.');
  }
};

/**
 * Получение заказа по ID
 */
export const getOrderById = async (orderId: string): Promise<FirebaseOrder | null> => {
  try {
    const docRef = doc(db, 'orders', orderId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as FirebaseOrder;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Ошибка при получении заказа ${orderId}:`, error);
    throw new Error('Не удалось получить данные заказа.');
  }
};

/**
 * Обновление статуса заказа
 */
export const updateOrderStatus = async (
  orderId: string, 
  newStatus: FirebaseOrder['status'], 
  note?: string
): Promise<void> => {
  try {
    const docRef = doc(db, 'orders', orderId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Заказ не найден');
    }
    
    const currentOrder = docSnap.data() as FirebaseOrder;
    const statusHistory = currentOrder.statusHistory || [];
    
    // Используем Timestamp.now() вместо serverTimestamp()
    statusHistory.push({
      status: newStatus,
      timestamp: Timestamp.now(),
      note: note || `Статус изменен на "${newStatus}"`
    });
    
    await updateDoc(docRef, {
      status: newStatus,
      statusHistory
    });
  } catch (error) {
    console.error(`Ошибка при обновлении статуса заказа ${orderId}:`, error);
    throw new Error('Не удалось обновить статус заказа.');
  }
};

/**
 * Добавление заметки к заказу
 */
export const addOrderNote = async (orderId: string, note: string): Promise<void> => {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      adminNotes: note
    });
  } catch (error) {
    console.error(`Ошибка при добавлении заметки к заказу ${orderId}:`, error);
    throw new Error('Не удалось добавить заметку к заказу.');
  }
};

/**
 * Удаление заказа
 */
export const deleteOrder = async (orderId: string): Promise<void> => {
  try {
    const docRef = doc(db, 'orders', orderId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Ошибка при удалении заказа ${orderId}:`, error);
    throw new Error('Не удалось удалить заказ.');
  }
}; 