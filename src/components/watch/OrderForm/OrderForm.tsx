'use client';

import { useState, FormEvent } from 'react';
import { FirebaseWatchCase } from '@/services/watchDataService';
import styles from './OrderForm.module.scss';

export interface OrderFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  comments: string;
}

interface OrderFormProps {
  selectedCase: FirebaseWatchCase;
  selectedColor: string;
  selectedDial: string;
  selectedHands: string;
  selectedRotor: string;
  selectedStrap: string;
  selectedBezel: string;
  onSubmit: (data: OrderFormData) => void;
  isSubmitting: boolean;
}

export function OrderForm({
  selectedCase,
  selectedColor,
  selectedDial,
  selectedHands,
  selectedRotor,
  selectedStrap,
  selectedBezel,
  onSubmit,
  isSubmitting
}: OrderFormProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    comments: ''
  });
  
  const [errors, setErrors] = useState<Partial<OrderFormData>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Очищаем ошибку при изменении поля
    if (errors[name as keyof OrderFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<OrderFormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Пожалуйста, укажите ваше имя';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Пожалуйста, укажите ваш email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Пожалуйста, укажите корректный email';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Пожалуйста, укажите ваш телефон';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Пожалуйста, укажите ваш адрес';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Оформление заказа</h2>
      
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.formLabel}>Имя*</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={styles.formInput}
          placeholder="Введите ваше имя"
          disabled={isSubmitting}
        />
        {errors.name && <div className={styles.formError}>{errors.name}</div>}
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.formLabel}>Email*</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={styles.formInput}
          placeholder="example@mail.com"
          disabled={isSubmitting}
        />
        {errors.email && <div className={styles.formError}>{errors.email}</div>}
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="phone" className={styles.formLabel}>Телефон*</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={styles.formInput}
          placeholder="+7 (___) ___-__-__"
          disabled={isSubmitting}
        />
        {errors.phone && <div className={styles.formError}>{errors.phone}</div>}
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="address" className={styles.formLabel}>Адрес доставки*</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={styles.formInput}
          placeholder="Город, улица, дом, квартира"
          disabled={isSubmitting}
        />
        {errors.address && <div className={styles.formError}>{errors.address}</div>}
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="comments" className={styles.formLabel}>Комментарии к заказу</label>
        <textarea
          id="comments"
          name="comments"
          value={formData.comments}
          onChange={handleChange}
          className={`${styles.formInput} ${styles.formTextarea}`}
          placeholder="Дополнительная информация к заказу"
          disabled={isSubmitting}
        />
      </div>
      
      <button
        type="submit"
        className={styles.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className={styles.buttonSpinner}>⟳</span>
            Отправка...
          </>
        ) : (
          'Оформить заказ'
        )}
      </button>
    </form>
  );
} 