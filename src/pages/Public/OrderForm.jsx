
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Send, ShoppingCart, CheckCircle2, Loader2, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrderForm() {
  const initialClientState = {
    company: '',
    contactName: '',
    phone: '',
    email: ''
  };

  const initialItemState = () => ({
    id: Date.now() + Math.random(),
    category: '',
    material: '',
    length: '',
    width: '',
    thickness: '',
    quantity: 1,
    unitPrice: 0
  });

  const [clientInfo, setClientInfo] = useState(initialClientState);
  const [orderItems, setOrderItems] = useState([initialItemState()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const categories = ['Ahşap Plaka', 'Seramik', 'Kenar Bandı', 'Aksesuar', 'Diğer'];

  // Mock auto-pricing based on category and material for demo purposes
  useEffect(() => {
    // This is optional but gives a nice B2B feel if prices auto-fill occasionally
  }, [orderItems]);

  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setClientInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (id, field, value) => {
    setOrderItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Mock auto-price logic for demonstration (if user types 'MDF Beyaz', set price to 1250)
        if (field === 'material' && value.toLowerCase().includes('mdf beyaz') && updatedItem.unitPrice === 0) {
           updatedItem.unitPrice = 1250;
        }
        if (field === 'material' && value.toLowerCase().includes('meşe') && updatedItem.unitPrice === 0) {
           updatedItem.unitPrice = 1450;
        }

        return updatedItem;
      }
      return item;
    }));
  };

  const addRow = () => {
    setOrderItems(prev => [...prev, initialItemState()]);
  };

  const removeRow = (id) => {
    if (orderItems.length === 1) return; 
    setOrderItems(prev => prev.filter(item => item.id !== id));
  };

  const calculateGrandTotal = () => {
    return orderItems.reduce((total, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.unitPrice) || 0;
      return total + (qty * price);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mock API Call to Supabase / Backend
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Order Submitted:', { clientInfo, orderItems, grandTotal: calculateGrandTotal() });
    
    setIsSubmitting(false);
    setIsSuccess(true);

    // Reset form after showing success message
    setTimeout(() => {
      setIsSuccess(false);
      setClientInfo(initialClientState);
      setOrderItems([initialItemState()]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 4000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-4 sm:px-6 lg:px-8 font-sans pt-32">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp}
          className="mb-12 text-center md:text-left"
        >
          <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
              <ShoppingCart size={28} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                B2B Sipariş Formu
              </h1>
              <p className="text-slate-500 text-lg mt-1">
                Toptan malzeme ve kesim siparişlerinizi hızlıca oluşturun.
              </p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {isSuccess && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              className="bg-green-50 border border-green-200 text-green-800 rounded-2xl p-6 mb-8 flex items-center gap-4 shadow-sm"
            >
              <CheckCircle2 className="text-green-500 w-8 h-8 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Siparişiniz Başarıyla Alındı!</h3>
                <p className="text-green-700/80">Sipariş detaylarınız sistemimize iletildi. Müşteri temsilcimiz en kısa sürede sizinle iletişime geçecektir.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* 1. Client Info Section */}
          <motion.div 
            initial="hidden" animate="visible" variants={fadeUp}
            className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200"
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold border border-indigo-100">1</span>
              Müşteri & Firma Bilgileri
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Firma Adı</label>
                <input 
                  type="text" name="company" value={clientInfo.company} onChange={handleClientChange} required
                  placeholder="Firma ünvanı"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 text-sm transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Yetkili Kişi</label>
                <input 
                  type="text" name="contactName" value={clientInfo.contactName} onChange={handleClientChange} required
                  placeholder="Ad Soyad"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 text-sm transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Telefon</label>
                <input 
                  type="tel" name="phone" value={clientInfo.phone} onChange={handleClientChange} required
                  placeholder="05XX XXX XX XX"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 text-sm transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">E-posta</label>
                <input 
                  type="email" name="email" value={clientInfo.email} onChange={handleClientChange} required
                  placeholder="ornek@firma.com"
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 text-sm transition-all shadow-sm"
                />
              </div>
            </div>
          </motion.div>

          {/* 2. Dynamic Order Table */}
          <motion.div 
            initial="hidden" animate="visible" variants={fadeUp}
            className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold border border-indigo-100">2</span>
                Sipariş Kalemleri
              </h2>
            </div>
            
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left min-w-[1000px] border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-40">Kategori</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-48">Malzeme / Renk</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-48">Ebatlar (Boy x En)</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-24">Kalınlık</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-24 text-right">Adet</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-32 text-right">Birim Fiyat</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-32 text-right">Toplam (TL)</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-16 text-center">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orderItems.map((item, index) => {
                    const rowTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <select 
                            required value={item.category} onChange={(e) => handleItemChange(item.id, 'category', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 text-sm"
                          >
                            <option value="">Seçiniz</option>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="text" required placeholder="Örn: MDF Beyaz" value={item.material} onChange={(e) => handleItemChange(item.id, 'material', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 text-sm"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <input 
                              type="number" placeholder="2800" value={item.length} onChange={(e) => handleItemChange(item.id, 'length', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 text-sm"
                            />
                            <span className="text-slate-400 text-xs">x</span>
                            <input 
                              type="number" placeholder="2100" value={item.width} onChange={(e) => handleItemChange(item.id, 'width', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 text-sm"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="text" placeholder="18mm" value={item.thickness} onChange={(e) => handleItemChange(item.id, 'thickness', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 text-sm"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="number" required min="1" value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 text-sm text-right font-medium"
                          />
                        </td>
                        <td className="px-4 py-3 relative">
                          <input 
                            type="number" required min="0" step="0.01" value={item.unitPrice || ''} onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)}
                            placeholder="0.00"
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 text-sm text-right font-medium pr-7"
                          />
                          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">₺</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-slate-900 font-semibold">{formatCurrency(rowTotal)}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button" onClick={() => removeRow(item.id)} disabled={orderItems.length === 1}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex justify-between items-center">
              <button
                type="button"
                onClick={addRow}
                className="flex items-center gap-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors border border-indigo-100/50"
              >
                <Plus size={18} />
                Yeni Kalem Ekle
              </button>
            </div>
          </motion.div>

          {/* 3. Order Summary & Submission */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
              
              <div className="flex flex-col items-center md:items-start">
                <span className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">Genel Toplam (KDV Dahil)</span>
                <div className="text-4xl font-black text-slate-900 tracking-tight flex items-baseline gap-2">
                  {formatCurrency(calculateGrandTotal())}
                </div>
              </div>

              <div className="w-full md:w-auto flex-shrink-0">
                <button
                  type="submit"
                  disabled={isSubmitting || calculateGrandTotal() === 0}
                  className="w-full md:w-auto group relative flex items-center justify-center gap-3 bg-indigo-600 text-white px-10 py-5 rounded-2xl text-lg font-semibold hover:bg-indigo-700 hover:shadow-lg transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:hover:bg-indigo-600 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <>
                      <CreditCard size={24} className="group-hover:-translate-y-1 transition-transform" />
                      Siparişi Onayla
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

        </form>
      </div>
    </div>
  );
}
