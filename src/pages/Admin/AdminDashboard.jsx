import React from 'react';

export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Genel Bakış</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Placeholder Stat Cards */}
        {[
          { title: 'Toplam Proje', value: '24' },
          { title: 'Aktif Ürünler', value: '156' },
          { title: 'Okunmamış Mesajlar', value: '3' }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#1A1A1C] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-stone-800 transition-colors duration-500">
            <h3 className="text-sm font-medium text-gray-500 dark:text-stone-400 mb-2 transition-colors">{stat.title}</h3>
            <p className="text-3xl font-serif text-[#1A1A1C] dark:text-white transition-colors">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white dark:bg-[#1A1A1C] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-stone-800 h-[400px] flex items-center justify-center transition-colors duration-500">
        <p className="text-gray-400 dark:text-stone-500">Dashboard Grafik Alanı (Placeholder)</p>
      </div>
    </div>
  );
}
