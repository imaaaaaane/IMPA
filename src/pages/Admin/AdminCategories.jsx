import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Tag } from 'lucide-react';
import { supabase } from '../../utils/supabase';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  
  const [currentCategory, setCurrentCategory] = useState({
    id: null,
    name: '',
    sub_categories: [] // array of { name: '', slug: '' }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      if (data) setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setCurrentCategory({ name: '', sub_categories: [] });
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setModalMode('edit');
    setCurrentCategory({
      id: category.id,
      name: category.name,
      sub_categories: category.sub_categories || []
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const addSubCategory = () => {
    setCurrentCategory({
      ...currentCategory,
      sub_categories: [...currentCategory.sub_categories, { name: '', slug: '' }]
    });
  };

  const removeSubCategory = (index) => {
    const updated = [...currentCategory.sub_categories];
    updated.splice(index, 1);
    setCurrentCategory({ ...currentCategory, sub_categories: updated });
  };

  const updateSubCategory = (index, field, value) => {
    const updated = [...currentCategory.sub_categories];
    updated[index][field] = value;
    
    // Auto-generate slug from name if editing name and slug is empty
    if (field === 'name' && !updated[index].slug) {
      updated[index].slug = value
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }
    
    setCurrentCategory({ ...currentCategory, sub_categories: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (modalMode === 'add') {
        const { error } = await supabase
          .from('categories')
          .insert([
            { 
              name: currentCategory.name,
              sub_categories: currentCategory.sub_categories
            }
          ]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('categories')
          .update({
            name: currentCategory.name,
            sub_categories: currentCategory.sub_categories
          })
          .eq('id', currentCategory.id);
        if (error) throw error;
      }

      await fetchCategories();
      closeModal();
    } catch (error) {
      console.error('Error saving category:', error.message);
      alert('Bir hata oluştu: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;
    
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      setCategories(categories.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error.message);
      alert('Silme işlemi başarısız: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-8 border-b border-gray-100 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Kategoriler</h2>
          <p className="text-sm text-gray-500 mt-1">Ana menü ve ürün kategorilerini yönetin.</p>
        </div>
        
        <button 
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-900 transition-all shadow-sm hover:scale-[1.02] active:scale-95 w-full sm:w-auto"
        >
          <Plus size={16} />
          Yeni Kategori Ekle
        </button>
      </div>

      <div className="flex-1 overflow-x-auto p-8">
        {loading ? (
          <div className="flex justify-center items-center py-16 text-gray-500 gap-3 text-sm">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
            Yükleniyor...
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center text-gray-500 py-16 text-sm">
            Kayıtlı kategori bulunamadı.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div key={cat.id} className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative group bg-gray-50/30">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                    <Tag size={18} className="text-gray-400" />
                    {cat.name}
                  </h3>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(cat)} className="text-gray-400 hover:text-gray-900 transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                {cat.sub_categories && cat.sub_categories.length > 0 ? (
                  <ul className="space-y-2">
                    {cat.sub_categories.map((sub, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex justify-between bg-white px-3 py-2 rounded-md border border-gray-100">
                        <span>{sub.name}</span>
                        <span className="text-xs text-gray-400 font-mono">{sub.slug}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 italic">Alt kategori yok</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity" onClick={closeModal}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative z-10 border border-gray-100 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 shrink-0">
              <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
                {modalMode === 'add' ? 'Yeni Kategori Ekle' : 'Kategoriyi Düzenle'}
              </h3>
              <button onClick={closeModal} disabled={isSubmitting} className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50">
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 space-y-5 overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ana Kategori Adı (Örn: OFİS)</label>
                  <input 
                    type="text" 
                    value={currentCategory.name}
                    onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-gray-900 text-sm"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">Alt Kategoriler</label>
                    <button 
                      type="button" 
                      onClick={addSubCategory}
                      className="text-xs flex items-center gap-1 text-black font-medium hover:bg-gray-100 px-2 py-1 rounded"
                    >
                      <Plus size={14} /> Ekle
                    </button>
                  </div>

                  <div className="space-y-3">
                    {currentCategory.sub_categories.map((sub, idx) => (
                      <div key={idx} className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="flex-1 space-y-2">
                          <input 
                            type="text" 
                            placeholder="Görünür Ad (Örn: Makam Takımları)" 
                            value={sub.name}
                            onChange={(e) => updateSubCategory(idx, 'name', e.target.value)}
                            required
                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:border-black"
                          />
                          <input 
                            type="text" 
                            placeholder="Slug (Örn: makam-takimlari)" 
                            value={sub.slug}
                            onChange={(e) => updateSubCategory(idx, 'slug', e.target.value)}
                            required
                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-xs font-mono text-gray-500 focus:outline-none focus:border-black"
                          />
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeSubCategory(idx)}
                          className="mt-1 p-1.5 text-gray-400 hover:text-red-600 rounded bg-white border border-gray-200 shadow-sm"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {currentCategory.sub_categories.length === 0 && (
                      <p className="text-sm text-gray-400 text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        Henüz alt kategori eklenmedi.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-4 border-t border-gray-100 bg-gray-50 shrink-0 flex justify-end gap-3">
                <button type="button" onClick={closeModal} disabled={isSubmitting} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors">
                  İptal
                </button>
                <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-5 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-all shadow-sm">
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
