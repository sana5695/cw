'use client';

import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import { useLoginForm } from '@/hooks/admin/useLoginForm';
import styles from '@/styles/admin/login.module.scss';

/**
 * Страница авторизации администратора
 */
export default function AdminLoginPage() {
  const {
    email,
    password,
    loading,
    error,
    isFormValid,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit
  } = useLoginForm();

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.loginCard}>
          <div className={styles.logoContainer}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h1 className={styles.title}>Вход в систему</h1>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                className={styles.input}
                placeholder="Введите ваш email"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Пароль
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className={styles.input}
                placeholder="Введите ваш пароль"
                required
              />
            </div>

            <button
              type="submit"
              className={styles.loginButton}
              disabled={loading || !isFormValid}
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
} 