import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../supabase';

// High-end furniture placeholder images from Unsplash
const FALLBACK_GALLERY = [
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800"
];

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Determine active main image if user clicks a thumbnail
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setProduct(data);
        setActiveImage(data.image && data.image !== 'no-image' ? data.image : FALLBACK_GALLERY[0]);
      } catch (error) {
        console.error('Error fetching product:', error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#0a0a0a]">
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <div className="w-5 h-5 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin"></div>
          Yükleniyor...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA] dark:bg-[#0a0a0a]">
        <h2 className="text-2xl font-serif text-gray-900 dark:text-white mb-4">Ürün bulunamadı.</h2>
        <Link to="/" className="text-gray-500 hover:text-black dark:hover:text-white font-medium transition-colors">Ana Sayfaya Dön</Link>
      </div>
    );
  }

  // Fallbacks
  const displayGallery = product.gallery && product.gallery.length > 0 ? product.gallery : FALLBACK_GALLERY;
  const dimensions = product.dimensions || "G: 200cm x D: 160cm x Y: 110cm";
  const material = product.material || "Birinci Sınıf Ceviz Kaplama";

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0a0a0a] pt-32 pb-24 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Sleek Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-stone-500 mb-12">
          <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">Ana Sayfa</Link>
          <ChevronRight size={14} />
          <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">Koleksiyon</Link>
          <ChevronRight size={14} />
          <span className="text-black dark:text-white">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column: Media (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Main Image Frame */}
            <div className="w-full bg-white dark:bg-[#111111] aspect-[4/3] rounded-sm flex items-center justify-center overflow-hidden border border-gray-100 dark:border-stone-800 shadow-[0_2px_40px_rgb(0,0,0,0.02)]">
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>
            
            {/* Thumbnail Grid */}
            <div className="grid grid-cols-4 gap-4 sm:gap-6">
              {displayGallery.map((imgUrl, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`relative aspect-[4/3] bg-white dark:bg-[#111111] overflow-hidden border transition-all duration-300 ${
                    activeImage === imgUrl 
                      ? 'border-black dark:border-white shadow-md' 
                      : 'border-gray-100 dark:border-stone-800 hover:border-gray-300 dark:hover:border-stone-600 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`${product.name} detay ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Info (5 cols) */}
          <div className="lg:col-span-5 flex flex-col lg:py-8">
            
            {/* Title & Description */}
            <div className="mb-10">
              <h1 className="text-4xl lg:text-5xl font-serif text-gray-900 dark:text-white tracking-tight leading-tight mb-6">
                {product.name}
              </h1>
              <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            {/* Technical Specifications */}
            <div className="mb-12">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-black dark:text-white mb-6 border-b border-gray-200 dark:border-stone-800 pb-4">
                Teknik Özellikler
              </h3>
              
              <dl className="divide-y divide-gray-100 dark:divide-stone-800/60 text-sm">
                <div className="flex justify-between py-4">
                  <dt className="text-gray-500 dark:text-gray-400">Ölçüler</dt>
                  <dd className="font-medium text-gray-900 dark:text-stone-200 text-right">{dimensions}</dd>
                </div>
                <div className="flex justify-between py-4">
                  <dt className="text-gray-500 dark:text-gray-400">Malzeme</dt>
                  <dd className="font-medium text-gray-900 dark:text-stone-200 text-right">{material}</dd>
                </div>
                <div className="flex justify-between py-4">
                  <dt className="text-gray-500 dark:text-gray-400">Menşei</dt>
                  <dd className="font-medium text-gray-900 dark:text-stone-200 text-right">Türkiye</dd>
                </div>
              </dl>
            </div>

            {/* Call to Action */}
            <div className="mt-auto">
              <button 
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                className="w-full flex items-center justify-center py-4 px-8 bg-black dark:bg-white text-white dark:text-black text-sm font-semibold uppercase tracking-widest hover:bg-gray-900 dark:hover:bg-gray-200 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                Bilgi Al
              </button>
              <p className="text-center text-xs text-gray-400 dark:text-stone-500 mt-4">
                İç mimarlarımızdan randevu talep edebilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
