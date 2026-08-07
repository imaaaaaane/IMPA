import React, { useState, useEffect } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { supabase } from '../../supabase';

export default function AdminSettings() {
  const [currentHeroImage, setCurrentHeroImage] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' }); // { type: 'success' | 'error', text: '' }

  useEffect(() => {
    fetchHeroImage();
  }, []);

  const fetchHeroImage = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'hero_image_url')
        .single();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setCurrentHeroImage(data.setting_value);
      }
    } catch (error) {
      console.error('Error fetching hero image:', error.message);
      setStatusMessage({ type: 'error', text: 'Mevcut görsel yüklenirken bir hata oluştu.' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setStatusMessage({ type: '', text: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newImageFile) return;

    setIsSubmitting(true);
    setStatusMessage({ type: '', text: '' });
    
    try {
      const fileExt = newImageFile.name.split('.').pop();
      const fileName = `hero_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `hero/${fileName}`;

      // 1. Upload to 'project-images' bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, newImageFile);

      if (uploadError) {
        alert("Upload Error: " + uploadError.message);
        console.error("Supabase Storage Upload Error: ", uploadError);
        throw uploadError;
      }

      // 2. Get public URL using the returned path
      const { data: publicUrlData } = supabase.storage
        .from('project-images')
        .getPublicUrl(uploadData.path);

      const imageUrl = publicUrlData.publicUrl;
      console.log("Generated Public URL: ", imageUrl);

      // 3. Update or Insert the site_settings table
      const { data: checkData, error: checkError } = await supabase
        .from('site_settings')
        .select('id')
        .eq('setting_key', 'hero_image_url')
        .maybeSingle();

      if (checkError) {
        console.error("Supabase Database Check Error: ", checkError);
        throw checkError;
      }

      let dbResult;
      if (checkData) {
        // Exists, update it
        const { data, error } = await supabase
          .from('site_settings')
          .update({ setting_value: imageUrl })
          .eq('setting_key', 'hero_image_url')
          .select();
        
        if (error) throw error;
        dbResult = data;
      } else {
        // Does not exist, insert it
        const { data, error } = await supabase
          .from('site_settings')
          .insert([{ setting_key: 'hero_image_url', setting_value: imageUrl }])
          .select();
          
        if (error) throw error;
        dbResult = data;
      }

      console.log("Database Operation Result: ", dbResult);

      setCurrentHeroImage(imageUrl);
      setNewImageFile(null);
      setPreviewUrl(null);
      setStatusMessage({ type: 'success', text: 'Ana sayfa görseli başarıyla güncellendi!' });
      
    } catch (error) {
      const errorMessage = error.message || error.error_description || JSON.stringify(error);
      console.error('Error in handleSubmit:', error);
      setStatusMessage({ type: 'error', text: 'Görsel güncellenirken bir hata oluştu: ' + errorMessage });
      alert('Yükleme Hatası: ' + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!window.confirm('Ana sayfa görselini kaldırmak ve varsayılana dönmek istediğinize emin misiniz?')) return;
    
    setIsSubmitting(true);
    setStatusMessage({ type: '', text: '' });
    
    try {
      // (Optional) Try to delete old image from storage if it's from our bucket
      if (currentHeroImage && currentHeroImage.includes('project-images/hero/')) {
        const urlParts = currentHeroImage.split('project-images/hero/');
        if (urlParts.length > 1) {
          const fileName = urlParts[1].split('?')[0]; // Clean up any query params
          const filePath = `hero/${fileName}`;
          await supabase.storage.from('project-images').remove([filePath]);
        }
      }

      const defaultImage = '/heroimage.png';

      // Update or Insert the site_settings table
      const { data: checkData, error: checkError } = await supabase
        .from('site_settings')
        .select('id')
        .eq('setting_key', 'hero_image_url')
        .maybeSingle();

      if (checkError) throw checkError;

      if (checkData) {
        const { error: updateError } = await supabase
          .from('site_settings')
          .update({ setting_value: defaultImage })
          .eq('setting_key', 'hero_image_url');
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('site_settings')
          .insert([{ setting_key: 'hero_image_url', setting_value: defaultImage }]);
        if (insertError) throw insertError;
      }

      setCurrentHeroImage(defaultImage);
      setNewImageFile(null);
      setPreviewUrl(null);
      setStatusMessage({ type: 'success', text: 'Varsayılan görsele dönüldü!' });
      
    } catch (error) {
      console.error('Error removing hero image:', error.message);
      setStatusMessage({ type: 'error', text: 'Görsel kaldırılırken bir hata oluştu: ' + error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA]">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-8 border-b border-gray-100 gap-4 bg-white">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Site Ayarları</h2>
          <p className="text-sm text-gray-500 mt-1">Web sitenizin genel görünümünü ve ayarlarını yapılandırın.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-3xl">
          
          {/* Status Message */}
          {statusMessage.text && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 text-sm font-medium ${
              statusMessage.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {statusMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {statusMessage.text}
            </div>
          )}

          {/* Hero Image Settings Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Ana Sayfa Görseli</h3>
              <p className="text-sm text-gray-500 mt-1">Ana sayfanın giriş bölümünde (Hero) görünecek resmi belirleyin.</p>
            </div>
            
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                    Yükleniyor...
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Current Image Preview */}
                  {currentHeroImage && !previewUrl && (
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="block text-sm font-medium text-gray-700">Mevcut Görsel</span>
                        {currentHeroImage !== '/heroimage.png' && (
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            disabled={isSubmitting}
                            className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 rounded-md transition-colors disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                            Görseli Kaldır / Varsayılana Dön
                          </button>
                        )}
                      </div>
                      <div className="w-full h-64 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-inner relative">
                        <img 
                          src={currentHeroImage} 
                          alt="Current Hero" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-medium">
                          Yayında
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Upload Dropzone */}
                  <div>
                    <span className="block text-sm font-medium text-gray-700 mb-3">
                      {currentHeroImage ? 'Görseli Değiştir' : 'Yeni Görsel Yükle'}
                    </span>
                    <label 
                      htmlFor="hero-upload" 
                      className={`flex flex-col items-center justify-center w-full h-64 px-4 transition-all bg-slate-50 border-2 border-slate-200 border-dashed rounded-xl appearance-none relative overflow-hidden ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-black/30 hover:bg-gray-50 group'
                      }`}
                    >
                      {previewUrl ? (
                        <div className="absolute inset-0 w-full h-full">
                          <img src={previewUrl} alt="New Preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                            <span className="px-4 py-2 bg-black text-white text-sm font-medium rounded-full shadow-lg">Farklı Görsel Seç</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-3 z-10">
                          <div className="p-4 bg-white rounded-full shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                            <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-black transition-colors" />
                          </div>
                          <span className="font-medium text-slate-600">
                            <span className="text-black hover:underline">Dosya seçin</span> veya sürükleyin
                          </span>
                          <span className="text-sm text-slate-400">Yüksek çözünürlüklü JPEG, PNG veya WEBP (Önerilen: 1920x1080)</span>
                        </div>
                      )}
                      <input 
                        id="hero-upload" 
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        disabled={isSubmitting} 
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button 
                      type="submit"
                      disabled={!newImageFile || isSubmitting}
                      className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-all shadow-sm hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                    >
                      {isSubmitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                      {isSubmitting ? 'Yükleniyor...' : 'Değişiklikleri Kaydet'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
