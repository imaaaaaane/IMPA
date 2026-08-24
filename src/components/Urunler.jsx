import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../supabase';
import CoreExpertise from './CoreExpertise';

const Urunler = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { categorySlug } = useParams();

  useEffect(() => {
    fetchProducts();
  }, [categorySlug]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (categorySlug) {
        query = query.eq('category_slug', categorySlug);
      }

      const { data, error } = await query;

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

  return (
    <>
      <section className="py-24 bg-[#FAF9F6] dark:bg-[#1A1A1C] transition-colors duration-500 overflow-hidden">
        <div className="max-w-[90rem] mx-auto px-8 md:px-16 mb-12">
          <span className="text-amber-600 dark:text-stone-400 font-semibold tracking-[0.3em] uppercase text-xs mb-4 block transition-colors duration-500">
            {t('collection.subtitle')}
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-[#1A1A1C] dark:text-white uppercase tracking-wide transition-colors duration-500">
            {categorySlug 
              ? categorySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') 
              : t('collection.title')}
          </h2>
        </div>

        <div className="max-w-[90rem] mx-auto px-4 md:px-16">
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-12 px-4 transform-gpu antialiased">
            {loading ? (
              <div className="w-full flex justify-center py-20 text-gray-500">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                  Yükleniyor...
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="w-full flex justify-center py-20 text-gray-500 text-sm">Henüz ürün eklenmemiş.</div>
            ) : (
              products.map((product) => (
                <Link
                  to={`/urun/${product.id}`}
                  key={product.id}
                  className="flex-none w-[300px] h-[400px] bg-[#FAF9F6] dark:bg-stone-900 rounded-2xl snap-center flex flex-col items-center justify-between p-8 relative overflow-hidden group border border-transparent dark:border-stone-800 hover:border-gray-200 dark:hover:border-stone-700 transition-colors"
                >
                  <div className="w-full h-48 flex items-center justify-center relative mb-4">
                    {product.image && product.image !== 'no-image' ? (
                      <img loading="lazy" width="800" height="600" src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 dark:bg-stone-800 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 dark:text-stone-500 text-[10px] uppercase tracking-wider font-medium">Görsel Yok</span>
                      </div>
                    )}
                  </div>

                  <div className="text-center mt-auto">
                    <h3 className="text-sm font-medium text-[#1A1A1C] dark:text-stone-200 uppercase tracking-wider mb-2 transition-colors duration-500">
                      {product.name}
                    </h3>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* Render the Anatomy Switcher */}
      <CoreExpertise />
    </>
  );
};

export default Urunler;