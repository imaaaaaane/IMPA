import React from 'react';

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#1A1A1C]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-gray-200 dark:border-stone-800 border-t-[#7A1D2D] dark:border-t-white rounded-full animate-spin"></div>
        <span className="text-sm font-medium text-gray-500 dark:text-stone-400">Yükleniyor...</span>
      </div>
    </div>
  );
}
