import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabase';
import { getOptimizedUrl } from '../../utils/imageUtils';
import ProgressiveImage from '../../components/ProgressiveImage';

const CATEGORY_NAMES = {
  'makam-takimlari': 'Makam Takımları',
  'toplanti-masalari': 'Toplantı Masaları',
  'depolama-dolaplar': 'Depolama & Dolaplar',
  'tv-uniteleri-konsol': 'TV Üniteleri & Konsol'
};

export default function UrunlerPage() {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (data) {
          const grouped = data.reduce((acc, product) => {
            const cat = product.category_slug || 'diger';
            if (!acc[cat]) {
              acc[cat] = [];
            }
            acc[cat].push(product);
            return acc;
          }, {});
          setGroupedProducts(grouped);
        }
      } catch (error) {
        console.error('Error fetching products:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getCategoryTitle = (slug) => {
    if (CATEGORY_NAMES[slug]) return CATEGORY_NAMES[slug];
    if (slug === 'diger') return 'Diğer Ürünler';
    return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const order = ['makam-takimlari', 'toplanti-masalari', 'depolama-dolaplar', 'tv-uniteleri-konsol', 'diger'];
  
  const categories = Object.keys(groupedProducts).sort((a, b) => {
    const idxA = order.indexOf(a);
    const idxB = order.indexOf(b);
    if (idxA === -1 && idxB === -1) return a.localeCompare(b);
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });

  return (
    <div className="pt-32 pb-24 bg-[#FAF9F6] dark:bg-[#111111] min-h-screen transition-colors duration-500">
      <div className="max-w-[90rem] mx-auto px-8 md:px-16 mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-serif text-[#1A1A1C] dark:text-white uppercase tracking-widest mb-4 transition-colors duration-500">
          Koleksiyonlarımız
        </h1>
        <p className="text-gray-500 dark:text-stone-400 max-w-2xl mx-auto italic font-light text-lg">
          İMPA Mobilya'nın eşsiz tasarımlarıyla ofis ve çalışma alanlarınızı yeniden keşfedin.
        </p>
      </div>

      {loading ? (
        <div className="w-full flex justify-center py-20 text-gray-500">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            Yükleniyor...
          </div>
        </div>
      ) : categories.length === 0 ? (
        <div className="w-full flex justify-center py-20 text-gray-500 text-sm">
          Henüz ürün eklenmemiş.
        </div>
      ) : (
        <div className="max-w-[90rem] mx-auto px-4 md:px-16 space-y-24">
          {categories.map((categorySlug) => {
            const categoryProducts = groupedProducts[categorySlug];
            if (!categoryProducts || categoryProducts.length === 0) return null;

            return (
              <section key={categorySlug} className="scroll-mt-32" id={categorySlug}>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-2xl md:text-3xl font-serif text-[#1A1A1C] dark:text-stone-100 tracking-wide uppercase">
                    {getCategoryTitle(categorySlug)}
                  </h2>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-stone-800 transition-colors"></div>
                  <span className="text-sm font-medium text-gray-400 dark:text-stone-500">
                    {categoryProducts.length} Ürün
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {categoryProducts.map((product) => (
                    <Link
                      to={`/urun/${product.id}`}
                      key={product.id}
                      className="bg-white dark:bg-stone-900 rounded-2xl flex flex-col items-center justify-between p-8 relative overflow-hidden group border border-gray-100 dark:border-stone-800 hover:border-gray-200 dark:hover:border-stone-700 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-stone-900/50 transition-all duration-300"
                    >
                      <div className="w-full aspect-square flex items-center justify-center relative mb-6">
                        {product.image && product.image !== 'no-image' ? (
                          <ProgressiveImage 
                            src={getOptimizedUrl(product.image)}
                            alt={product.name}
                            className="w-full h-full mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 ease-out group-hover:scale-105 rounded-lg overflow-hidden"
                            imageClassName="object-contain"
                            isThumbnail={true}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-50 dark:bg-stone-800/50 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400 dark:text-stone-500 text-[10px] uppercase tracking-wider font-medium">
                              Görsel Yok
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="text-center w-full mt-auto">
                        <h3 className="text-sm font-bold text-[#1A1A1C] dark:text-stone-200 uppercase tracking-widest mb-2 transition-colors duration-500 group-hover:text-amber-700 dark:group-hover:text-amber-500">
                          {product.name}
                        </h3>
                        {product.subtitle && (
                          <p className="text-xs text-gray-500 dark:text-stone-400 line-clamp-1">
                            {product.subtitle}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
