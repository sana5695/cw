'use client';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)]">
      <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-md shadow-2xl">
        <p className="text-[var(--color-text-primary)] text-xl font-light">Загрузка...</p>
      </div>
    </div>
  );
} 