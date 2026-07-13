import React from 'react';
import { useTranslation } from 'react-i18next';

import { productsData } from '../services/productsdata';
import CoreExpertise from './CoreExpertise';

const Urunler = () => {
  const { t } = useTranslation();

  return (
    <>
      <section className="py-24 bg-[#FAF9F6] dark:bg-[#1A1A1C] transition-colors duration-500 overflow-hidden">


      <div className="max-w-[90rem] mx-auto px-8 md:px-16 mb-12">
        <span className="text-amber-600 dark:text-stone-400 font-semibold tracking-[0.3em] uppercase text-xs mb-4 block transition-colors duration-500">
          {t('collection.subtitle')}
        </span>
        <h2 className="text-3xl md:text-4xl font-serif text-[#1A1A1C] dark:text-white uppercase tracking-wide transition-colors duration-500">
          {t('collection.title')}
        </h2>
      </div>


      <div className="max-w-[90rem] mx-auto px-4 md:px-16">
        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-12 px-4 transform-gpu antialiased">


          {productsData.map((product) => (
            <div
              key={product.id}
              className="flex-none w-[300px] h-[400px] bg-[#FAF9F6] dark:bg-stone-900 rounded-2xl snap-center flex flex-col items-center justify-between p-8 relative overflow-hidden group border border-transparent dark:border-stone-800"
            >

              <div className="w-full flex items-center justify-center relative mb-4">
                <img

                  src={product.image}
                  alt={product.title}
                  className="w-full h-48 object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 ease-out group-hover:scale-110"
                />


                <button className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gray-400 hover:text-red-500 z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                </button>
              </div>


              <div className="text-center mt-auto">
                <h3 className="text-sm font-medium text-[#1A1A1C] dark:text-stone-200 uppercase tracking-wider mb-2 transition-colors duration-500">
                  {t(`productsData.${product.id}.title`)}
                </h3>
              </div>

            </div>
          ))}

        </div>
      </div>
      </section>
      
      {/* Render the Anatomy Switcher */}
      <CoreExpertise />
    </>
  );
};

export default Urunler;