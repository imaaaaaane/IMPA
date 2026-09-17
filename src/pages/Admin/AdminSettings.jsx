import React, { useState, useEffect } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { supabase } from '../../supabase';
import { getImageUrl } from '../../utils/image';

export default function AdminSettings() {
  const [currentHeroImage, setCurrentHeroImage] = useState(null);
  const [newImageUrl, setNewImageUrl] = useState('');
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



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newImageUrl) return;

    setIsSubmitting(true);
    setStatusMessage({ type: '', text: '' });
    
    try {
      const imageUrl = newImageUrl;

      // Update or Insert the site_settings table
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
      setNewImageUrl('');
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


      const defaultImage = '/heroimage.webp';

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
      setNewImageUrl('');
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
                  {currentHeroImage && (
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="block text-sm font-medium text-gray-700">Mevcut Görsel</span>
                        {currentHeroImage !== '/heroimage.webp' && (
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
                        <img loading="lazy" width="800" height="600" src={getImageUrl(currentHeroImage)} 
                          alt="Current Hero" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-medium">
                          Yayında
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Image URL Text Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cloudflare R2 Dosya Adı (Örn: heroimage.webp)
                    </label>
                    <input 
                      type="text" 
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-gray-900 text-sm transition-colors disabled:opacity-50 disabled:bg-gray-50 shadow-sm"
                      placeholder="Yeni görsel adı..."
                    />
                    {newImageUrl && (
                      <div className="mt-4 w-full h-64 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-inner relative">
                        <img loading="lazy" width="800" height="600" src={getImageUrl(newImageUrl)} 
                          alt="New Preview" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-medium">
                          Önizleme
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button 
                      type="submit"
                      disabled={!newImageUrl || isSubmitting}
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
