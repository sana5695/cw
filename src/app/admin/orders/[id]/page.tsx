'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  getOrderById, 
  FirebaseOrder, 
  updateOrderStatus, 
  deleteOrder,
  addOrderNote
} from '@/services/orderService';
import AdminLayout from '@/components/admin/AdminLayout';
import styles from '@/styles/admin/orderDetails.module.scss';
import React from 'react';

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

export default function OrderDetails() {
  const params = useParams();
  const orderId = params.id as string;
  
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
      const orderData = await getOrderById(orderId);
      
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
      <AdminLayout pageTitle="Загрузка заказа...">
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout pageTitle="Ошибка">
        <div className={styles.errorContainer}>
          {error}
        </div>
        <Link 
          href="/admin/orders" 
          className={styles.backButton}
        >
          Вернуться к списку заказов
        </Link>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout pageTitle="Заказ не найден">
        <div className={styles.emptyStateContainer}>
          Заказ не найден
        </div>
        <Link 
          href="/admin/orders" 
          className={styles.backButton}
        >
          Вернуться к списку заказов
        </Link>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle={`Заказ #${order.id?.substring(0, 8)}`}>
      <div className={styles.container}>
        <div className={styles.backButtonContainer}>
          <Link 
            href="/admin/orders" 
            className={styles.backButton}
          >
            Назад к списку
          </Link>
        </div>

        <div className={styles.gridContainer}>
          {/* Основная информация */}
          <div className={styles.orderInfoCard}>
            <h2 className={styles.cardTitle}>
              Информация о заказе
            </h2>
            
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <p className={styles.infoLabel}>Дата создания:</p>
                <p className={styles.infoValue}>
                  {order.createdAt instanceof Date 
                    ? order.createdAt.toLocaleString()
                    : order.createdAt?.toDate?.()?.toLocaleString() || 'Н/Д'}
                </p>
              </div>
              
              <div className={styles.infoItem}>
                <p className={styles.infoLabel}>Статус:</p>
                <div>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(e.target.value as FirebaseOrder['status'])}
                    className={`${styles.statusSelect} ${statusColors[order.status] || ''}`}
                  >
                    {Object.entries(statusTranslations).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className={styles.infoItem}>
                <p className={styles.infoLabel}>Телефон клиента:</p>
                <p className={styles.infoValue}>{order.phone}</p>
              </div>
              
              <div className={styles.infoItem}>
                <p className={styles.infoLabel}>Предпочитаемый способ связи:</p>
                <p className={styles.infoValue}>{order.contactMethod}</p>
              </div>
              
              <div className={`${styles.infoItem} ${styles.fullWidthItem}`}>
                <p className={styles.infoLabel}>Комментарий клиента:</p>
                <div className={styles.commentBox}>
                  {order.comment || 'Нет комментария'}
                </div>
              </div>
            </div>

            {/* Компоненты часов */}
            <div className={styles.componentsSection}>
              <h3 className={styles.componentsTitle}>
                Выбранные компоненты
              </h3>
              
              <div className={styles.componentsList}>
                <div className={styles.componentItem}>
                  <span className={styles.componentName}>
                    Корпус: {order.selectedComponents.caseName}
                  </span>
                </div>
                
                <div className={styles.componentItem}>
                  <span className={styles.componentName}>
                    Цвет: {order.selectedComponents.color}
                  </span>
                </div>
                
                {order.selectedComponents.dial && (
                  <div className={styles.componentItem}>
                    <span className={styles.componentName}>
                      Циферблат: {order.selectedComponents.dial}
                    </span>
                  </div>
                )}
                
                {order.selectedComponents.hands && (
                  <div className={styles.componentItem}>
                    <span className={styles.componentName}>
                      Стрелки: {order.selectedComponents.hands}
                    </span>
                  </div>
                )}
                
                {order.selectedComponents.rotor && (
                  <div className={styles.componentItem}>
                    <span className={styles.componentName}>
                      Ротор: {order.selectedComponents.rotor}
                    </span>
                  </div>
                )}
                
                {order.selectedComponents.strap && (
                  <div className={styles.componentItem}>
                    <span className={styles.componentName}>
                      Ремешок: {order.selectedComponents.strap}
                    </span>
                  </div>
                )}
                
                {order.selectedComponents.bezel && (
                  <div className={styles.componentItem}>
                    <span className={styles.componentName}>
                      Безель: {order.selectedComponents.bezel}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* История статусов */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div className={styles.statusHistory}>
                <h3 className={styles.statusHistoryTitle}>
                  История статусов
                </h3>
                <div className={styles.statusHistoryList}>
                  {order.statusHistory.map((statusItem, index) => (
                    <div key={index} className={styles.statusHistoryItem}>
                      <div className={styles.statusTimestamp}>
                        {statusItem.timestamp instanceof Date 
                          ? statusItem.timestamp.toLocaleString()
                          : statusItem.timestamp?.toDate?.()?.toLocaleString() || 'Н/Д'}
                      </div>
                      <div className={styles.statusText}>
                        {statusTranslations[statusItem.status as StatusType] || statusItem.status}
                      </div>
                      {statusItem.note && (
                        <div className={styles.statusNote}>
                          {statusItem.note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Блок действий */}
          <div className={styles.actionsCard}>
            <h2 className={styles.cardTitle}>
              Действия
            </h2>
            
            <div className={styles.notesSection}>
              <p className={styles.infoLabel}>Заметки администратора:</p>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                className={styles.textarea}
                rows={4}
                placeholder="Добавьте заметки по заказу..."
              ></textarea>
              <button
                onClick={handleSaveNote}
                className={styles.saveButton}
              >
                Сохранить заметку
              </button>
            </div>
            
            <div className={styles.divider}></div>
            
            <div className={styles.deleteSection}>
              <h3 className={styles.deleteTitle}>
                Удаление заказа
              </h3>
              
              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className={styles.deleteButton}
                >
                  Удалить заказ
                </button>
              ) : (
                <div>
                  <p className={styles.confirmText}>
                    Вы уверены? Это действие нельзя отменить.
                  </p>
                  <div className={styles.confirmButtons}>
                    <button
                      onClick={handleDelete}
                      className={styles.deleteButton}
                    >
                      Да, удалить
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className={styles.cancelDeleteButton}
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 