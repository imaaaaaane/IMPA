import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, UploadCloud, Search } from 'lucide-react';
import { supabase } from '../../supabase';

export default function AdminProducts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [currentProduct, setCurrentProduct] = useState({ name: '', description: '', dimensions: '', material: '', category_slug: '', image: null });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) {
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setCurrentProduct({ name: '', description: '', dimensions: '', material: '', category_slug: '', image: null });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setModalMode('edit');
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let imageUrl = currentProduct.image || 'no-image';

      // If a new file is selected, upload it to Supabase Storage
      if (currentProduct.imageFile) {
        const file = currentProduct.imageFile;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      if (modalMode === 'add') {
        const { error } = await supabase
          .from('products')
          .insert([
            { 
              name: currentProduct.name, 
              description: currentProduct.description,
              dimensions: currentProduct.dimensions,
              material: currentProduct.material,
              category_slug: currentProduct.category_slug,
              image: imageUrl
            }
          ]);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .update({
            name: currentProduct.name,
            description: currentProduct.description,
            dimensions: currentProduct.dimensions,
            material: currentProduct.material,
            category_slug: currentProduct.category_slug,
            ...(currentProduct.imageFile && { image: imageUrl })
          })
          .eq('id', currentProduct.id);
          
        if (error) throw error;
      }

      await fetchProducts(); // Refresh list
      closeModal();
    } catch (error) {
      console.error('Error saving product:', error.message);
      alert('Bir hata oluştu: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    
    try {
      // Note: Ideally, we would also delete the image from the storage bucket here
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error.message);
      alert('Silme işlemi başarısız: ' + error.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-8 border-b border-gray-100 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Ürünler</h2>
          <p className="text-sm text-gray-500 mt-1">Tüm mobilya ve panel ürünlerini buradan yönetin.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Minimalist Search Bar */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Ürün ara..." 
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all w-64 text-gray-900 placeholder-gray-400"
            />
          </div>

          <button 
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-900 transition-all shadow-sm hover:scale-[1.02] active:scale-95 w-full sm:w-auto"
          >
            <Plus size={16} />
            Yeni Ürün Ekle
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-[11px] uppercase tracking-[0.1em] text-gray-400 font-semibold bg-gray-50/50">
              <th className="px-8 py-4 font-semibold">Görsel</th>
              <th className="px-8 py-4 font-semibold">Ürün Adı</th>
              <th className="px-8 py-4 font-semibold">Açıklama</th>
              <th className="px-8 py-4 font-semibold">Eklenme Tarihi</th>
              <th className="px-8 py-4 text-right font-semibold">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-8 py-16 text-center text-gray-500">
                  <div className="flex justify-center items-center gap-3 text-sm">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                    Yükleniyor...
                  </div>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-8 py-16 text-center text-gray-500 text-sm">
                  Kayıtlı ürün bulunamadı. Lütfen yeni bir ürün ekleyin.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/80 transition-colors duration-150 group">
                  <td className="px-8 py-4">
                    <div className="w-12 h-10 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden border border-gray-200">
                      {product.image && product.image !== 'no-image' ? (
                        <img loading="lazy" width="800" height="600" src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[9px] text-gray-400 font-medium uppercase tracking-wider">Yok</span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-4 font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-8 py-4 text-gray-500 max-w-xs truncate">
                    {product.description}
                  </td>
                  <td className="px-8 py-4 text-gray-500">
                    {formatDate(product.created_at)}
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button 
                        onClick={() => openEditModal(product)}
                        className="p-1.5 text-gray-400 hover:text-gray-900 rounded-md hover:bg-gray-200/50 transition-colors"
                        title="Düzenle"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                        title="Sil"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="px-8 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center text-xs text-gray-500 font-medium">
        <span>{products.length} sonuç listeleniyor</span>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Subtle Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity" 
            onClick={closeModal}
          ></div>
          
          {/* Modal Container */}
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative z-10 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
                {modalMode === 'add' ? 'Yeni Ürün Ekle' : 'Ürünü Düzenle'}
              </h3>
              <button 
                onClick={closeModal}
                disabled={isSubmitting}
                className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Ürün Adı
                </label>
                <input 
                  type="text" 
                  value={currentProduct.name || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-gray-900 text-sm transition-colors disabled:opacity-50 disabled:bg-gray-50"
                  placeholder="Ürün adı girin..."
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Açıklama
                </label>
                <textarea 
                  value={currentProduct.description || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
                  rows="3"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-gray-900 text-sm transition-colors resize-none disabled:opacity-50 disabled:bg-gray-50"
                  placeholder="Ürünün özelliklerini yazın..."
                ></textarea>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Kategori
                </label>
                <select 
                  value={currentProduct.category_slug || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, category_slug: e.target.value})}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-gray-900 text-sm transition-colors disabled:opacity-50 disabled:bg-gray-50 appearance-none"
                >
                  <option value="">Seçiniz...</option>
                  <option value="makam-takimlari">Makam Takımları</option>
                  <option value="toplanti-masalari">Toplantı Masaları</option>
                  <option value="depolama-dolaplar">Depolama & Dolaplar</option>
                  <option value="tv-uniteleri-konsol">TV Üniteleri & Konsol</option>
                </select>
              </div>

              {/* Dimensions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Ölçüler
                </label>
                <input 
                  type="text" 
                  value={currentProduct.dimensions || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, dimensions: e.target.value})}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-gray-900 text-sm transition-colors disabled:opacity-50 disabled:bg-gray-50"
                  placeholder="Örn: G: 200cm x D: 160cm x Y: 110cm"
                />
              </div>

              {/* Material */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Malzeme
                </label>
                <input 
                  type="text" 
                  value={currentProduct.material || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, material: e.target.value})}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-gray-900 text-sm transition-colors disabled:opacity-50 disabled:bg-gray-50"
                  placeholder="Örn: Birinci Sınıf Ceviz Kaplama"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Görsel Seç
                </label>
                <label htmlFor="file-upload" className={`flex flex-col items-center justify-center w-full h-40 px-4 transition-all bg-slate-50 dark:bg-[#0a0a0a] border-2 border-slate-200 dark:border-stone-800 border-dashed rounded-2xl appearance-none relative overflow-hidden ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-amber-500/50 hover:bg-amber-50/50 dark:hover:bg-amber-900/10 group'}`}>
                  {currentProduct.imageFile ? (
                    <div className="flex flex-col items-center z-10">
                      <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-600 dark:text-amber-500 mb-2">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <span className="font-medium text-slate-800 dark:text-stone-200 truncate max-w-[200px]">{currentProduct.imageFile.name}</span>
                      <span className="text-xs text-amber-600 dark:text-amber-500 mt-1 font-medium hover:underline">Değiştir</span>
                    </div>
                  ) : currentProduct.image && currentProduct.image !== 'no-image' ? (
                     <div className="absolute inset-0 w-full h-full">
                        <img loading="lazy" width="800" height="600" src={currentProduct.image} alt="Preview" className="w-full h-full object-cover opacity-40 group-hover:opacity-30 transition-opacity" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                          <span className="px-3 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm">Görseli Değiştir</span>
                        </div>
                     </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-2 z-10">
                      <div className="p-3 bg-white dark:bg-[#161616] rounded-full shadow-sm border border-slate-100 dark:border-stone-800 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-amber-500 transition-colors" />
                      </div>
                      <span className="font-medium text-slate-600 dark:text-stone-300 mt-2">
                        <span className="text-amber-600 dark:text-amber-500 hover:underline">Dosya seçin</span> veya sürükleyin
                      </span>
                      <span className="text-xs text-slate-400 dark:text-stone-500">PNG, JPG, WEBP (Max 5MB)</span>
                    </div>
                  )}
                  <input 
                    id="file-upload" 
                    type="file" 
                    accept="image/*"
                    className="hidden" 
                    disabled={isSubmitting} 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setCurrentProduct({ ...currentProduct, imageFile: e.target.files[0] });
                      }
                    }}
                  />
                </label>
              </div>

              {/* Actions */}
              <div className="pt-2 flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-all shadow-sm hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
                >
                  {isSubmitting && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
