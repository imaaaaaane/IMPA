import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase'; // Adjust path if necessary
import * as XLSX from 'xlsx';
import { Trash2 } from 'lucide-react';

const AdminEbatlama = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ebatlama_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = async (order) => {
    // Parse the JSON array of rows
    const details = order.siparis_detaylari;
    if (!details || details.length === 0) {
      alert('Bu siparişte parça detayı bulunmuyor.');
      return;
    }

    // Format data for CNC Machine Excel format
    const excelData = details.map((row, index) => ({
      'No': index + 1,
      'Boy (mm)': row.boy,
      'En (mm)': row.en,
      'Adet': row.adet,
      'Kalınlık': row.kalinlik || '',
      'Plaka': row.plaka || '',
      'Bant Uzun 1 (B1)': row.b1 ? 'Var' : '-',
      'Bant Uzun 2 (B2)': row.b2 ? 'Var' : '-',
      'Bant Kısa 1 (E1)': row.e1 ? 'Var' : '-',
      'Bant Kısa 2 (E2)': row.e2 ? 'Var' : '-',
    }));

    // Create Workbook & Worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Kesim Listesi');

    // Auto-size columns slightly
    const colWidths = [{ wch: 5 }, { wch: 10 }, { wch: 10 }, { wch: 8 }, { wch: 10 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
    worksheet['!cols'] = colWidths;

    // Format Date for filename
    const dateString = new Date(order.created_at).toLocaleDateString('tr-TR').replace(/\./g, '-');
    const fileName = `IMPA_${order.firma_adi}_${dateString}.xlsx`;

    // Trigger Download
    XLSX.writeFile(workbook, fileName);

    // Mark as downloaded in DB
    const { error } = await supabase
      .from('ebatlama_orders')
      .update({ indirildi: true })
      .eq('id', order.id);

    // Update local UI state immediately
    if (!error) {
      setOrders(prevOrders => prevOrders.map(o => 
        o.id === order.id ? { ...o, indirildi: true } : o
      ));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu siparişi silmek istediğinize emin misiniz?')) {
      try {
        const { data, error } = await supabase.from('ebatlama_orders').delete().eq('id', id).select();
        
        if (error) {
          console.error("Supabase Delete Error:", error);
          alert(`Sipariş silinirken veritabanı hatası oluştu: ${error.message}`);
          return;
        }

        if (!data || data.length === 0) {
          console.error("Supabase Delete Error: No rows deleted. Check RLS policies.");
          alert('Sipariş silinemedi. Yetki hatası olabilir (RLS).');
          return;
        }

        // Only update local state if DB deletion was completely successful
        setOrders(prevOrders => prevOrders.filter(order => order.id !== id));
      } catch (err) {
        console.error("Delete Exception:", err);
        alert("Sipariş silinirken beklenmeyen bir hata oluştu.");
      }
    }
  };

  const handleStatusChange = async (order, newStatus) => {
    // 1. Update DB
    const { error } = await supabase
      .from('ebatlama_orders')
      .update({ durum: newStatus })
      .eq('id', order.id);

    if (error) {
      console.error("Supabase Update Error:", error.message);
      alert(`Durum güncellenirken bir hata oluştu: ${error.message}`);
      return;
    }

    // 2. Update Local State
    setOrders(prevOrders => prevOrders.map(o => 
      o.id === order.id ? { ...o, durum: newStatus } : o
    ));

    alert(`Durum "${newStatus}" olarak güncellendi.`);
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Siparişler yükleniyor...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kesim Siparişleri</h1>
          <p className="text-sm text-gray-500 mt-1">Müşterilerden gelen tüm kesim ve ebatlama talepleri.</p>
        </div>
        <button onClick={fetchOrders} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Yenile
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tarih</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Firma / Yetkili</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">İletişim</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Toplam (m²)</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Durum</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Henüz sipariş bulunmuyor.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    <div className="text-xs text-gray-400">{new Date(order.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="font-bold text-[#1A365D]">{order.firma_adi}</div>
                    <div className="text-gray-500">{order.yetkili_kisi}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {order.telefon}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-amber-100 text-amber-800">
                      {order.toplam_metrekare ? `${Number(order.toplam_metrekare).toFixed(2)} m²` : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      value={order.durum || 'Sipariş Alındı'}
                      onChange={(e) => handleStatusChange(order, e.target.value)}
                      className={`text-xs font-semibold rounded-full px-3 py-1.5 outline-none cursor-pointer border appearance-none text-center ${
                        (!order.durum || order.durum === 'Sipariş Alındı' || order.durum === 'Bekliyor') ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        order.durum === 'Hazırlanıyor' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        'bg-green-100 text-green-800 border-green-200'
                      }`}
                    >
                      <option value="Sipariş Alındı">Sipariş Alındı</option>
                      <option value="Hazırlanıyor">Hazırlanıyor</option>
                      <option value="Tamamlandı">Tamamlandı</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {order.indirildi ? (
                        <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          İndirildi
                        </span>
                      ) : (
                        <button
                          onClick={() => handleDownloadExcel(order)}
                          className="inline-flex items-center gap-1.5 bg-[#1A4731] hover:bg-[#123322] text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium shadow-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                          Excel
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(order.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Siparişi Sil"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminEbatlama;
