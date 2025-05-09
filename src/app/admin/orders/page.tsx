'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getOrders, FirebaseOrder, updateOrderStatus, deleteOrder } from '@/services/orderService';
import { adminLogout } from '@/services/authService';
import AdminLayout from '@/components/admin/AdminLayout';
import styles from '@/styles/admin/adminOrders.module.scss';

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
      <div className={styles.container}>
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
          </div>
        ) : orders.length === 0 ? (
          <div className={styles.emptyMessage}>
            Нет заказов
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.tableHeaderCell}>
                    ID
                  </th>
                  <th className={styles.tableHeaderCell}>
                    Телефон
                  </th>
                  <th className={styles.tableHeaderCell}>
                    Модель часов
                  </th>
                  <th className={styles.tableHeaderCell}>
                    Дата заказа
                  </th>
                  <th className={styles.tableHeaderCell}>
                    Статус
                  </th>
                  <th className={styles.tableHeaderCell}>
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {orders.map((order) => (
                  <tr key={order.id} className={styles.tableRow}>
                    <td className={`${styles.tableCell} ${styles.idCell}`} data-label="ID">
                      {order.id?.substring(0, 8)}...
                    </td>
                    <td className={styles.tableCell} data-label="Телефон">
                      {order.phone}
                    </td>
                    <td className={styles.tableCell} data-label="Модель часов">
                      {order.selectedComponents.caseName} ({order.selectedComponents.color})
                    </td>
                    <td className={styles.tableCell} data-label="Дата заказа">
                      {order.createdAt instanceof Date 
                        ? order.createdAt.toLocaleDateString()
                        : order.createdAt?.toDate?.()?.toLocaleDateString() || 'Н/Д'}
                    </td>
                    <td className={styles.tableCell} data-label="Статус">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id!, e.target.value as FirebaseOrder['status'])}
                        className={`${styles.statusSelect} ${statusColors[order.status] || ''}`}
                      >
                        {Object.entries(statusTranslations).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td className={`${styles.tableCell} ${styles.actionsCell}`} data-label="Действия">
                      <div className={styles.actionsContainer}>
                        <Link 
                          href={`/admin/orders/${order.id}`}
                          className={styles.detailsLink}
                        >
                          Подробнее
                        </Link>
                        <button
                          onClick={() => handleDeleteConfirm(order.id!)}
                          className={styles.deleteButton}
                        >
                          Удалить
                        </button>
                      </div>
                      
                      {confirmDelete === order.id && (
                        <div className={styles.confirmDialog}>
                          <p className={styles.confirmText}>Вы уверены?</p>
                          <div className={styles.confirmButtons}>
                            <button
                              onClick={() => handleDeleteOrder(order.id!)}
                              className={styles.confirmDeleteButton}
                            >
                              Да
                            </button>
                            <button
                              onClick={handleDeleteCancel}
                              className={styles.cancelDeleteButton}
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
      </div>
    </AdminLayout>
  );
} 