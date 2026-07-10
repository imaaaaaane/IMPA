import React from 'react';
import { useTranslation } from 'react-i18next';

export default function UrunlerHome() {
  const { t } = useTranslation();

  const products = [
    {
      title: t('product1Title'),
      subtitle: t('product1Desc'),
      img: "/src/assets/lakekapak.jpg",
    },
    {
      title: t('product2Title'),
      subtitle: t('product2Desc'),
      img: "/src/assets/lake-door.jpg",
    },
    {
      title: t('product3Title'),
      subtitle: t('product3Desc'),
      img: "/src/assets/wood-texture.jpg",
    }
  ];

  return (
    <section className="py-32 px-6 md:px-12 bg-[#F5F2EB] dark:bg-[#151515] transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-xs tracking-[0.3em] font-medium uppercase text-amber-800/60 dark:text-amber-600/80 mb-6 block transition-colors duration-500">
            {t('productsHomeBadge')}
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#1A1A1C] dark:text-[#FAF9F6] transition-colors duration-500">
            {t('productsHomeTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div key={index} className="group relative h-[500px] overflow-hidden rounded-2xl cursor-pointer">
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-700 z-10"></div>
              {/* Product Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-1000"
                style={{ backgroundImage: `url('${product.img}')` }}
              ></div>
              
              {/* Overlay Gradient for Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1C]/90 via-[#1A1A1C]/20 to-transparent z-10"></div>

              {/* Text Content */}
              <div className="absolute bottom-0 left-0 w-full p-8 z-20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                <div className="w-10 h-[1px] bg-amber-500/50 mb-6 group-hover:w-20 transition-all duration-700"></div>
                <h3 className="text-3xl font-serif text-[#FAF9F6] mb-2">{product.title}</h3>
                <p className="text-white/60 font-light tracking-wide text-sm">{product.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
