import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabase';
import { getOptimizedUrl } from '../../utils/imageUtils';
import ProgressiveImage from '../../components/ProgressiveImage';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function UrunlerPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('order_index', { ascending: true });

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
    fetchProducts();
  }, []);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pt-32 pb-24 bg-[#FAF9F6] dark:bg-[#111111] min-h-screen transition-colors duration-500">
      <div className="max-w-[90rem] mx-auto px-8 md:px-16 mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-serif text-[#1A1A1C] dark:text-white uppercase tracking-widest mb-4 transition-colors duration-500">
          ÜRÜNLER
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
      ) : products.length === 0 ? (
        <div className="w-full flex justify-center py-20 text-gray-500 text-sm">
          Henüz ürün eklenmemiş.
        </div>
      ) : (
        <div className="max-w-[90rem] mx-auto px-4 md:px-16 flex flex-col items-center">
          
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-stone-900 rounded-xl flex flex-col p-6 relative group shadow-sm hover:shadow-xl dark:shadow-stone-900/50 transition-all duration-300 border border-gray-100 dark:border-stone-800"
              >
                <div className="w-full aspect-[4/3] flex items-center justify-center relative mb-6 overflow-hidden rounded-lg bg-gray-50 dark:bg-stone-800/50">
                  {product.image && product.image !== 'no-image' ? (
                    <ProgressiveImage 
                      src={getOptimizedUrl(product.image)}
                      alt={product.name}
                      className="w-full h-full mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 ease-out group-hover:scale-105"
                      imageClassName="object-contain"
                      isThumbnail={true}
                    />
                  ) : (
                    <span className="text-gray-400 dark:text-stone-500 text-[10px] uppercase tracking-wider font-medium">
                      Görsel Yok
                    </span>
                  )}
                </div>

                <div className="flex flex-col flex-grow text-center">
                  <h3 className="text-lg font-serif text-[#1A1A1C] dark:text-stone-200 tracking-wide mb-2 transition-colors duration-500">
                    {product.name}
                  </h3>
                  {product.subtitle && (
                    <p className="text-sm text-gray-500 dark:text-stone-400 line-clamp-2 mb-6">
                      {product.subtitle}
                    </p>
                  )}
                  
                  <Link
                    to={`/urun/${product.id}`}
                    className="mt-auto block w-full py-3 bg-[#1A1A1C] dark:bg-white text-white dark:text-[#1A1A1C] text-[10px] tracking-[0.2em] font-medium uppercase hover:bg-amber-600 dark:hover:bg-amber-500 transition-colors"
                  >
                    DETAYLARI İNCELE
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2 mt-8">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-stone-800 hover:bg-gray-100 dark:hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                      currentPage === i + 1 
                        ? 'bg-[#1A1A1C] text-white dark:bg-white dark:text-[#1A1A1C]' 
                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-stone-800 hover:bg-gray-100 dark:hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
