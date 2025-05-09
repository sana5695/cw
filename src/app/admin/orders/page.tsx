'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getOrders, FirebaseOrder, updateOrderStatus, deleteOrder } from '@/services/orderService';
import { adminLogout } from '@/services/authService';
import AdminLayout from '@/components/admin/AdminLayout';

const statusColors = {
  'new': 'bg-blue-100 text-blue-800',
  'processing': 'bg-yellow-100 text-yellow-800',
  'completed': 'bg-green-100 text-green-800',
  'cancelled': 'bg-red-100 text-red-800'
};

const statusTranslations = {
  'new': 'Новый',
  'processing': 'В обработке',
  'completed': 'Завершен',
  'cancelled': 'Отменен'
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<FirebaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await getOrders();
      setOrders(ordersData);
      setError('');
    } catch (error: any) {
      setError(error.message || 'Не удалось загрузить заказы');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: FirebaseOrder['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      
      // Обновляем список заказов
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDeleteConfirm = (orderId: string) => {
    setConfirmDelete(orderId);
  };

  const handleDeleteCancel = () => {
    setConfirmDelete(null);
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrder(orderId);
      setOrders(orders.filter(order => order.id !== orderId));
      setConfirmDelete(null);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await adminLogout();
      router.push('/admin/login');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <AdminLayout pageTitle="Панель управления заказами">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg shadow-md">
          <p className="text-[var(--color-text-secondary)] text-center">Нет заказов</p>
        </div>
      ) : (
        <div className="overflow-auto rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Телефон
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Модель часов
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата заказа
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id?.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.selectedComponents.caseName} ({order.selectedComponents.color})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.createdAt instanceof Date 
                      ? order.createdAt.toLocaleDateString()
                      : order.createdAt?.toDate?.()?.toLocaleDateString() || 'Н/Д'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id!, e.target.value as FirebaseOrder['status'])}
                      className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${statusColors[order.status] || ''}`}
                    >
                      {Object.entries(statusTranslations).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link 
                        href={`/admin/orders/${order.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Подробнее
                      </Link>
                      <button
                        onClick={() => handleDeleteConfirm(order.id!)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Удалить
                      </button>
                    </div>
                    
                    {confirmDelete === order.id && (
                      <div className="absolute z-10 mt-2 bg-white p-3 rounded-md shadow-lg border border-gray-200">
                        <p className="text-sm mb-2">Вы уверены?</p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDeleteOrder(order.id!)}
                            className="bg-red-500 text-white px-2 py-1 text-xs rounded"
                          >
                            Да
                          </button>
                          <button
                            onClick={handleDeleteCancel}
                            className="bg-gray-200 text-gray-800 px-2 py-1 text-xs rounded"
                          >
                            Нет
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
} 