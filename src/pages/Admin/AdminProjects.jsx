import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, UploadCloud, Search } from 'lucide-react';
import { supabase } from '../../supabase';

export default function AdminProjects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  
  // State for form inputs
  const [currentProject, setCurrentProject] = useState({ 
    title: '', 
    category: '', 
    description: '',
    client: '',
    materials: '',
    year: '',
    image_url: null,
    gallery: [], // array of existing URL strings
    imageFile: null, // new main image file
    galleryFiles: [] // new gallery files
  });

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) {
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setCurrentProject({ 
      title: '', 
      category: '', 
      description: '', 
      client: '',
      materials: '',
      year: '',
      image_url: null, 
      gallery: [], 
      imageFile: null, 
      galleryFiles: [] 
    });
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setModalMode('edit');
    setCurrentProject({
      ...project,
      imageFile: null,
      galleryFiles: [],
      gallery: project.gallery || []
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Helper to upload a single file to Supabase Storage
  const uploadFile = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 1. Handle Main Image Upload
      let mainImageUrl = currentProject.image_url;
      if (currentProject.imageFile) {
        mainImageUrl = await uploadFile(currentProject.imageFile);
      }

      // 2. Handle Gallery Images Upload
      let galleryUrls = [...currentProject.gallery];
      if (currentProject.galleryFiles && currentProject.galleryFiles.length > 0) {
        const uploadPromises = Array.from(currentProject.galleryFiles).map(file => uploadFile(file));
        const newGalleryUrls = await Promise.all(uploadPromises);
        galleryUrls = [...galleryUrls, ...newGalleryUrls];
      }

      // 3. Database Operations
      const projectData = {
        title: currentProject.title,
        category: currentProject.category,
        description: currentProject.description,
        client: currentProject.client,
        materials: currentProject.materials,
        year: currentProject.year,
        image_url: mainImageUrl,
        gallery: galleryUrls
      };

      if (modalMode === 'add') {
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', currentProject.id);
          
        if (error) throw error;
      }

      await fetchProjects();
      closeModal();
    } catch (error) {
      console.error('Error saving project:', error.message);
      alert('Bir hata oluştu: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu projeyi silmek istediğinize emin misiniz?')) return;
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error.message);
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
    <div className="flex flex-col h-full bg-slate-50 p-4 sm:p-8 gap-6 overflow-hidden">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-white border border-gray-100 rounded-2xl shadow-sm gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">Projeler</h2>
          <p className="text-sm text-slate-500 mt-1">Sistemdeki tüm projeleri buradan yönetin.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Proje ara..." 
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition-all w-64 text-slate-800 placeholder-slate-400"
            />
          </div>

          <button 
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-900 transition-all shadow-sm hover:scale-[1.02] active:scale-95 w-full sm:w-auto"
          >
            <Plus size={16} />
            Yeni Proje Ekle
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] uppercase tracking-[0.1em] text-slate-400 font-semibold bg-slate-50/50">
                <th className="px-8 py-5 font-semibold">Görsel</th>
                <th className="px-8 py-5 font-semibold">Proje Adı</th>
                <th className="px-8 py-5 font-semibold">Kategori</th>
                <th className="px-8 py-5 font-semibold">Eklenme Tarihi</th>
                <th className="px-8 py-5 text-right font-semibold">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-16 text-center text-slate-500">
                    <div className="flex justify-center items-center gap-3 text-sm">
                      <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
                      Yükleniyor...
                    </div>
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-16 text-center text-slate-500 text-sm">
                    Kayıtlı proje bulunamadı. Lütfen yeni bir proje ekleyin.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/80 transition-colors duration-150 group">
                    <td className="px-8 py-4">
                      <div className="w-16 h-12 bg-slate-100 rounded-md flex items-center justify-center overflow-hidden border border-slate-200">
                        {project.image_url ? (
                          <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">Yok</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-4 font-medium text-slate-800">
                      {project.title}
                    </td>
                    <td className="px-8 py-4 text-slate-500">
                      {project.category}
                    </td>
                    <td className="px-8 py-4 text-slate-500">
                      {formatDate(project.created_at)}
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button 
                          onClick={() => openEditModal(project)}
                          className="p-1.5 text-slate-400 hover:text-slate-800 rounded-md hover:bg-slate-200/50 transition-colors"
                          title="Düzenle"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(project.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
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
        <div className="px-8 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs text-slate-500 font-medium shrink-0">
          <span>{projects.length} sonuç listeleniyor</span>
        </div>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 sm:p-6">
          <div 
            className="absolute inset-0 transition-opacity" 
            onClick={closeModal}
          ></div>
          
          {/* 2. Modal Box (constrained to screen height via max-h-full) */}
          <div className="relative w-full max-w-5xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[95vh] animate-in fade-in zoom-in-95 duration-200">
            
            {/* 3. Header (Fixed) */}
            <div className="flex-shrink-0 px-5 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
                {modalMode === 'add' ? 'Yeni Proje Ekle' : 'Projeyi Düzenle'}
              </h2>
              <button 
                onClick={closeModal}
                disabled={isSubmitting}
                className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <X size={20} strokeWidth={2} />
              </button>
            </div>

            {/* 4. Form Wrapper (The key is min-h-0 on the scrolling container or its parent) */}
            <form id="project-form" onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              
              {/* 5. Scrollable Body (Reduced padding and spacing for compact view) */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0">
                
                {/* Row 1: Title & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Project Title */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Proje Adı</label>
                    <input 
                      type="text" 
                      value={currentProject.title || ''}
                      onChange={(e) => setCurrentProject({...currentProject, title: e.target.value})}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 text-slate-800 text-sm transition-colors disabled:opacity-50 disabled:bg-slate-50 shadow-sm"
                      placeholder="Kerim Dental Kliniği"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Kategori</label>
                    <input 
                      type="text" 
                      value={currentProject.category || ''}
                      onChange={(e) => setCurrentProject({...currentProject, category: e.target.value})}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 text-slate-800 text-sm transition-colors disabled:opacity-50 disabled:bg-slate-50 shadow-sm"
                      placeholder="İç Mimari / Sağlık"
                    />
                  </div>
                </div>

                {/* Row 2: Client, Materials, Year */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Client */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Müşteri</label>
                    <input 
                      type="text" 
                      value={currentProject.client || ''}
                      onChange={(e) => setCurrentProject({...currentProject, client: e.target.value})}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 text-slate-800 text-sm transition-colors disabled:opacity-50 disabled:bg-slate-50 shadow-sm"
                      placeholder="Örn: Akbank A.Ş."
                    />
                  </div>

                  {/* Materials */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Kullanılan Malzemeler</label>
                    <input 
                      type="text" 
                      value={currentProject.materials || ''}
                      onChange={(e) => setCurrentProject({...currentProject, materials: e.target.value})}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 text-slate-800 text-sm transition-colors disabled:opacity-50 disabled:bg-slate-50 shadow-sm"
                      placeholder="Örn: Meşe Ahşap, Cam"
                    />
                  </div>

                  {/* Year */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Proje Yılı</label>
                    <input 
                      type="text" 
                      value={currentProject.year || ''}
                      onChange={(e) => setCurrentProject({...currentProject, year: e.target.value})}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 text-slate-800 text-sm transition-colors disabled:opacity-50 disabled:bg-slate-50 shadow-sm"
                      placeholder="Örn: 2023"
                    />
                  </div>
                </div>

                {/* Row 3: Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama</label>
                  <textarea 
                    value={currentProject.description || ''}
                    onChange={(e) => setCurrentProject({...currentProject, description: e.target.value})}
                    required
                    disabled={isSubmitting}
                    rows="3"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 text-slate-800 text-sm transition-colors disabled:opacity-50 disabled:bg-slate-50 resize-y shadow-sm"
                    placeholder="Proje hakkında detaylı açıklama yazın..."
                  />
                </div>

                {/* Row 4: Media Uploads Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Main Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ana Görsel (Kapak)</label>
                    <label htmlFor="main-upload" className={`flex flex-col items-center justify-center w-full h-36 px-6 transition-all bg-slate-50 border-2 border-slate-200 border-dashed rounded-2xl appearance-none relative overflow-hidden ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-slate-400 hover:bg-slate-100 group'}`}>
                      {currentProject.imageFile ? (
                        <div className="flex flex-col items-center z-10 text-center">
                          <UploadCloud className="w-8 h-8 text-slate-500 mb-2" />
                          <span className="font-medium text-slate-800 text-sm truncate max-w-[200px]">{currentProject.imageFile.name}</span>
                          <span className="text-xs text-slate-500 mt-1 hover:underline">Görseli Değiştir</span>
                        </div>
                      ) : currentProject.image_url ? (
                         <div className="absolute inset-0 w-full h-full">
                            <img src={currentProject.image_url} alt="Preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                              <span className="px-4 py-1.5 bg-slate-900/70 backdrop-blur-sm text-white text-xs font-medium rounded-full shadow-lg">Görseli Değiştir</span>
                            </div>
                         </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-2 z-10">
                          <div className="p-2 bg-white rounded-full shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                            <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                          </div>
                          <span className="text-sm font-medium text-slate-600">Ana Görsel Yükle</span>
                        </div>
                      )}
                      <input 
                        id="main-upload" 
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        disabled={isSubmitting} 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setCurrentProject({ ...currentProject, imageFile: e.target.files[0] });
                          }
                        }}
                      />
                    </label>
                  </div>

                  {/* Gallery Images Upload */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Galeri (Çoklu Seçim)</label>
                    <label htmlFor="gallery-upload" className={`flex flex-col items-center justify-center w-full h-36 px-6 transition-all bg-slate-50 border-2 border-slate-200 border-dashed rounded-2xl appearance-none relative overflow-hidden ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-slate-400 hover:bg-slate-100 group'}`}>
                      {currentProject.galleryFiles && currentProject.galleryFiles.length > 0 ? (
                        <div className="flex flex-col items-center z-10 text-center">
                          <div className="p-3 bg-white rounded-full shadow-sm border border-slate-100 mb-3">
                            <UploadCloud className="w-6 h-6 text-slate-600" />
                          </div>
                          <span className="font-semibold text-slate-800 text-sm">
                            {currentProject.galleryFiles.length} yeni görsel seçildi
                          </span>
                          <span className="text-xs text-slate-500 mt-2 hover:underline">Değiştir veya Ekle</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-3 z-10 text-center">
                          <div className="p-3 bg-white rounded-full shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                            <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-slate-600 transition-colors" />
                          </div>
                          <span className="text-sm font-medium text-slate-600">
                            Galeri Görsellerini Seç
                          </span>
                          {currentProject.gallery?.length > 0 ? (
                             <span className="text-xs text-slate-500">
                               Şu an {currentProject.gallery.length} kayıtlı görsel var<br/>Üzerine eklemek için seçin
                             </span>
                          ) : (
                             <span className="text-xs text-slate-400">Birden fazla dosya seçebilirsiniz<br/>(Max 5MB/dosya)</span>
                          )}
                        </div>
                      )}
                      <input 
                        id="gallery-upload" 
                        type="file" 
                        multiple
                        accept="image/*"
                        className="hidden" 
                        disabled={isSubmitting} 
                        onChange={(e) => {
                          if (e.target.files) {
                            setCurrentProject({ ...currentProject, galleryFiles: e.target.files });
                          }
                        }}
                      />
                    </label>
                  </div>

                </div>

              </div>

              {/* 6. Footer (Fixed) */}
              <div className="flex-shrink-0 px-5 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                <button 
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  form="project-form"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-7 py-2.5 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-all shadow-sm hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
                >
                  {isSubmitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  {isSubmitting ? 'Kaydediliyor...' : 'Projeyi Kaydet'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
