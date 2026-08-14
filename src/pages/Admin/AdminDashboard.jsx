import React, { useState, useEffect } from 'react';
import { PackagePlus, Settings, Scissors } from 'lucide-react';
import { supabase } from '../../utils/supabase';

export default function AdminDashboard() {
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({ projects: 0, products: 0, messages: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);

      // Fetch Recent Orders
      try {
        const { data, error } = await supabase
          .from('ebatlama_orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (!error && data) {
          setRecentOrders(data);
        }
      } catch (err) {
        console.error("Error fetching recent orders:", err);
      }

      // Fetch Stats
      const newStats = { projects: 0, products: 0, messages: 0 };

      try {
        const { count, error } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true });
        if (!error && count !== null) newStats.projects = count;
      } catch (e) {
        console.error("Error counting projects:", e);
      }

      try {
        const { count, error } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });
        if (!error && count !== null) newStats.products = count;
      } catch (e) {
        console.error("Error counting products:", e);
      }

      try {
        const { count, error } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true });
        if (!error && count !== null) newStats.messages = count;
      } catch (e) {
        console.error("Error counting messages:", e);
      }

      setStats(newStats);
      setIsLoading(false);
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7A1D2D]"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Genel Bakış</h2>
      
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { title: 'Toplam Proje', value: stats.projects },
          { title: 'Aktif Ürünler', value: stats.products },
          { title: 'Okunmamış Mesajlar', value: stats.messages }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#1A1A1C] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-stone-800 transition-colors duration-500">
            <h3 className="text-sm font-medium text-gray-500 dark:text-stone-400 mb-2 transition-colors">{stat.title}</h3>
            <p className="text-3xl font-serif text-[#1A1A1C] dark:text-white transition-colors">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-[#1A1A1C] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-stone-800 mb-8 transition-colors duration-500">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Aylık Sipariş Özeti</h3>
        </div>
        <div className="h-64 flex items-end justify-between gap-2 px-2 pb-2 border-b border-gray-100 dark:border-stone-800 relative">
          {/* Y-Axis mock lines */}
          <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none">
            <div className="w-full border-t border-gray-400"></div>
            <div className="w-full border-t border-gray-400"></div>
            <div className="w-full border-t border-gray-400"></div>
            <div className="w-full border-t border-gray-400"></div>
          </div>
          
          {/* CSS-only Bar Chart */}
          {[40, 65, 45, 80, 55, 90, 75, 40, 60, 85, 70, 95].map((height, i) => (
            <div key={i} className="w-full relative group flex flex-col items-center justify-end h-full">
              <div 
                className="w-full rounded-t-sm bg-gradient-to-t from-[#7A1D2D] to-red-400 transition-all duration-500 group-hover:opacity-80" 
                style={{ height: `${height}%` }}
              ></div>
              <div className="absolute -bottom-6 text-xs text-gray-400 font-medium">{i + 1}</div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">
          Son 12 ayın sipariş dağılım grafiği
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (Span 2) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1A1A1C] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-stone-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Son Kesim Siparişleri</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 dark:text-stone-400">
              <thead className="text-xs uppercase bg-gray-50 dark:bg-[#111111] text-gray-500 dark:text-stone-500">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg font-medium">Müşteri / Firma</th>
                  <th className="px-4 py-3 font-medium">Tarih</th>
                  <th className="px-4 py-3 font-medium">Plaka</th>
                  <th className="px-4 py-3 rounded-r-lg font-medium">Durum</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-6 text-center text-gray-500">Henüz sipariş bulunmuyor.</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 dark:border-stone-800/50 last:border-0 hover:bg-gray-50 dark:hover:bg-[#111111] transition-colors">
                      <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">{order.firma_adi || order.yetkili_kisi || '-'}</td>
                      <td className="px-4 py-4">{formatDate(order.created_at)}</td>
                      <td className="px-4 py-4">{order.plaka || '-'}</td>
                      <td className="px-4 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
                          {order.durum || 'Bekliyor'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions (Span 1) */}
        <div className="bg-white dark:bg-[#1A1A1C] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-stone-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Hızlı İşlemler</h3>
          <div className="space-y-3">
            {[
              { icon: <Scissors size={18} />, title: 'Yeni Kesim Siparişi' },
              { icon: <PackagePlus size={18} />, title: 'Yeni Ürün Ekle' },
              { icon: <Settings size={18} />, title: 'Sistem Ayarları' }
            ].map((action, i) => (
              <button 
                key={i}
                className="w-full flex items-center gap-3 p-4 bg-gray-50 dark:bg-[#111111] border border-gray-100 dark:border-stone-800 rounded-xl hover:-translate-y-0.5 hover:shadow-sm hover:bg-white dark:hover:bg-[#1A1A1C] transition-all text-sm font-semibold text-gray-700 dark:text-stone-300 text-left"
              >
                <div className="text-[#7A1D2D] dark:text-[#E2A6B2]">
                  {action.icon}
                </div>
                {action.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
