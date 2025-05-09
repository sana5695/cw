export default function Loading() {
  return (
    <div className="min-h-screen h-screen flex flex-col overflow-hidden bg-gradient-to-b from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)]">
      <header className="bg-[var(--color-bg-secondary)]/80 py-3 px-6 shadow-md">
        <div className="flex justify-between items-center">
          <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-40 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-24"></div>
        </div>
      </header>
      
      <div className="flex-grow flex flex-col md:flex-row">
        <div className="md:w-1/2 h-2/5 md:h-full lg:w-1/4 xl:w-1/5 bg-gray-100 flex justify-center items-center">
          <div className="w-40 h-40 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        <div className="md:w-1/2 h-3/5 md:h-full lg:w-3/4 xl:w-4/5 bg-white/90 rounded-tl-3xl shadow-xl">
          <div className="p-6 space-y-4">
            <div className="w-48 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 