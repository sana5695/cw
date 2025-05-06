'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  getOrderById, 
  FirebaseOrder, 
  updateOrderStatus, 
  deleteOrder,
  addOrderNote
} from '@/services/orderService';
import { AdminProtectedRoute } from '@/components/AdminProtectedRoute';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

type StatusType = 'new' | 'processing' | 'completed' | 'cancelled';

const statusColors: Record<StatusType, string> = {
  'new': 'bg-blue-100 text-blue-800',
  'processing': 'bg-yellow-100 text-yellow-800',
  'completed': 'bg-green-100 text-green-800',
  'cancelled': 'bg-red-100 text-red-800'
};

const statusTranslations: Record<StatusType, string> = {
  'new': 'Новый',
  'processing': 'В обработке',
  'completed': 'Завершен',
  'cancelled': 'Отменен'
};

export default function OrderDetails({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<FirebaseOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const orderData = await getOrderById(params.id);
      
      if (orderData) {
        setOrder(orderData);
        setAdminNote(orderData.adminNotes || '');
      } else {
        setError('Заказ не найден');
      }
    } catch (error: any) {
      setError(error.message || 'Не удалось загрузить заказ');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: FirebaseOrder['status']) => {
    if (!order) return;
    
    try {
      await updateOrderStatus(order.id!, newStatus);
      setOrder({
        ...order,
        status: newStatus
      });
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleSaveNote = async () => {
    if (!order) return;
    
    try {
      await addOrderNote(order.id!, adminNote);
      setOrder({
        ...order,
        adminNotes: adminNote
      });
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDelete = async () => {
    if (!order) return;
    
    try {
      await deleteOrder(order.id!);
      router.push('/admin/orders');
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <AdminProtectedRoute>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow py-10 px-6">
            <div className="max-w-6xl mx-auto flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          </main>
          <Footer />
        </div>
      </AdminProtectedRoute>
    );
  }

  if (error) {
    return (
      <AdminProtectedRoute>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow py-10 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
              <Link 
                href="/admin/orders" 
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Вернуться к списку заказов
              </Link>
            </div>
          </main>
          <Footer />
        </div>
      </AdminProtectedRoute>
    );
  }

  if (!order) {
    return (
      <AdminProtectedRoute>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow py-10 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                Заказ не найден
              </div>
              <Link 
                href="/admin/orders" 
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Вернуться к списку заказов
              </Link>
            </div>
          </main>
          <Footer />
        </div>
      </AdminProtectedRoute>
    );
  }

  return (
    <AdminProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-10 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
                Заказ #{order.id?.substring(0, 8)}
              </h1>
              <Link 
                href="/admin/orders" 
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300"
              >
                Назад к списку
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Основная информация */}
              <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg shadow-md col-span-2">
                <h2 className="text-xl font-semibold mb-4 text-[var(--color-text-primary)]">
                  Информация о заказе
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Дата создания:</p>
                    <p className="font-medium">
                      {order.createdAt instanceof Date 
                        ? order.createdAt.toLocaleString()
                        : order.createdAt?.toDate?.()?.toLocaleString() || 'Н/Д'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Статус:</p>
                    <div>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(e.target.value as FirebaseOrder['status'])}
                        className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${statusColors[order.status] || ''}`}
                      >
                        {Object.entries(statusTranslations).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Телефон клиента:</p>
                    <p className="font-medium">{order.phone}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Предпочитаемый способ связи:</p>
                    <p className="font-medium">{order.contactMethod}</p>
                  </div>
                  
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Комментарий клиента:</p>
                    <p className="font-medium text-gray-800 bg-gray-50 p-2 rounded">
                      {order.comment || 'Нет комментария'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Сводка по заказу */}
              <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-[var(--color-text-primary)]">
                  Действия
                </h2>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Заметки администратора:</p>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    className="w-full p-2 border rounded-md mb-2"
                    rows={4}
                    placeholder="Добавьте заметки по заказу..."
                  ></textarea>
                  <button
                    onClick={handleSaveNote}
                    className="bg-green-600 text-white py-1 px-4 rounded-md hover:bg-green-700 transition duration-300 text-sm"
                  >
                    Сохранить заметку
                  </button>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-2 text-[var(--color-text-primary)]">
                    Удаление заказа
                  </h3>
                  
                  {!confirmDelete ? (
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300 text-sm"
                    >
                      Удалить заказ
                    </button>
                  ) : (
                    <div>
                      <p className="text-sm mb-2 text-red-600">Вы уверены? Это действие нельзя отменить.</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleDelete}
                          className="bg-red-600 text-white py-1 px-4 rounded-md hover:bg-red-700 transition duration-300 text-sm"
                        >
                          Да, удалить
                        </button>
                        <button
                          onClick={() => setConfirmDelete(false)}
                          className="bg-gray-200 text-gray-800 py-1 px-4 rounded-md hover:bg-gray-300 transition duration-300 text-sm"
                        >
                          Отмена
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Детали заказа */}
            <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4 text-[var(--color-text-primary)]">
                Детали заказа
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Модель корпуса:</p>
                  <p className="font-medium">{order.selectedComponents.caseName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Цвет корпуса:</p>
                  <p className="font-medium">{order.selectedComponents.color}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Циферблат:</p>
                  <p className="font-medium">{order.selectedComponents.dial || 'Не выбран'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Стрелки:</p>
                  <p className="font-medium">{order.selectedComponents.hands || 'Не выбраны'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Ротор:</p>
                  <p className="font-medium">{order.selectedComponents.rotor || 'Не выбран'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Ремешок:</p>
                  <p className="font-medium">{order.selectedComponents.strap || 'Не выбран'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Безель:</p>
                  <p className="font-medium">{order.selectedComponents.bezel || 'Не выбран'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Общая стоимость:</p>
                  <p className="font-medium">{order.totalPrice ? `${order.totalPrice} ₽` : 'Не указана'}</p>
                </div>
              </div>
            </div>

            {/* История изменений статуса */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-[var(--color-text-primary)]">
                  История изменений
                </h2>
                
                <ul className="divide-y divide-gray-200">
                  {order.statusHistory.map((historyItem, index) => (
                    <li key={index} className="py-3">
                      <div className="flex items-start">
                        <div className={`h-6 w-6 rounded-full ${statusColors[historyItem.status as keyof typeof statusColors] || 'bg-gray-100'} flex items-center justify-center mr-3`}>
                          <span className="text-xs">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">
                            {statusTranslations[historyItem.status as keyof typeof statusTranslations] || historyItem.status}
                          </p>
                          <p className="text-sm text-gray-500">
                            {historyItem.timestamp instanceof Date 
                              ? historyItem.timestamp.toLocaleString()
                              : historyItem.timestamp?.toDate?.()?.toLocaleString() || 'Н/Д'}
                          </p>
                          {historyItem.note && (
                            <p className="text-sm mt-1 bg-gray-50 text-gray-800 p-1 rounded">
                              {historyItem.note}
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </AdminProtectedRoute>
  );
} 