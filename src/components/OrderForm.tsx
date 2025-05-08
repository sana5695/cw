'use client';

import { useState } from 'react';
import { FirebaseWatchCase } from '@/services/watchDataService';

type ContactMethod = 'phone' | 'telegram' | 'whatsapp' | 'viber';

type OrderFormProps = {
  selectedCase: FirebaseWatchCase;
  selectedColor: string;
  selectedDial: string;
  selectedHands: string;
  selectedRotor: string;
  selectedStrap: string;
  selectedBezel: string;
  onSubmit: (formData: OrderFormData) => Promise<void>;
  isSubmitting: boolean;
};

export type OrderFormData = {
  phone: string;
  comment: string;
  contactMethod: ContactMethod;
  selectedComponents: {
    caseName: string;
    color: string;
    dial: string;
    hands: string;
    rotor: string;
    strap: string;
    bezel: string;
  };
};

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
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [contactMethod, setContactMethod] = useState<ContactMethod>('phone');
  const [phoneError, setPhoneError] = useState('');
  
  // Валидация телефона
  const validatePhone = (value: string) => {
    const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    
    if (!value) {
      setPhoneError('Телефон обязателен');
      return false;
    } else if (!phoneRegex.test(value)) {
      setPhoneError('Некорректный формат телефона');
      return false;
    } else {
      setPhoneError('');
      return true;
    }
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    if (value) validatePhone(value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhone(phone)) return;
    
    const formData: OrderFormData = {
      phone,
      comment,
      contactMethod,
      selectedComponents: {
        caseName: selectedCase.name,
        color: selectedColor,
        dial: selectedDial,
        hands: selectedHands,
        rotor: selectedRotor,
        strap: selectedStrap,
        bezel: selectedBezel
      }
    };
    
    await onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h3 className="text-xl font-semibold text-black">Завершение заказа</h3>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-bg-primary)]">
          Номер телефона*
        </label>
        <input
          type="tel"
          value={phone}
          onChange={handlePhoneChange}
          onBlur={() => validatePhone(phone)}
          placeholder="+7 (XXX) XXX-XX-XX"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] outline-none text-black ${
            phoneError ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        />
        {phoneError && (
          <p className="text-red-500 text-sm">{phoneError}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-bg-primary)]">
          Удобный способ связи
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setContactMethod('phone')}
            className={`px-3 py-2 rounded-lg border transition-colors text-sm ${
              contactMethod === 'phone'
                ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                : 'border-gray-300 bg-white text-[var(--color-bg-primary)]'
            }`}
          >
            Звонок
          </button>
          <button
            type="button"
            onClick={() => setContactMethod('telegram')}
            className={`px-3 py-2 rounded-lg border transition-colors text-sm ${
              contactMethod === 'telegram'
                ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                : 'border-gray-300 bg-white text-[var(--color-bg-primary)]'
            }`}
          >
            Telegram
          </button>
          <button
            type="button"
            onClick={() => setContactMethod('whatsapp')}
            className={`px-3 py-2 rounded-lg border transition-colors text-sm ${
              contactMethod === 'whatsapp'
                ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                : 'border-gray-300 bg-white text-[var(--color-bg-primary)]'
            }`}
          >
            WhatsApp
          </button>
          <button
            type="button"
            onClick={() => setContactMethod('viber')}
            className={`px-3 py-2 rounded-lg border transition-colors text-sm ${
              contactMethod === 'viber'
                ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                : 'border-gray-300 bg-white text-[var(--color-bg-primary)]'
            }`}
          >
            Viber
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-bg-primary)]">
          Комментарий (необязательно)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Дополнительная информация о заказе..."
          className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] outline-none min-h-[80px]"
        />
      </div>
      
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-5 py-3 rounded-lg shadow-md transition-all ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)] text-white hover:shadow-lg'
          }`}
        >
          {isSubmitting ? 'Отправка...' : 'Отправить заказ'}
        </button>
      </div>
    </form>
  );
} 