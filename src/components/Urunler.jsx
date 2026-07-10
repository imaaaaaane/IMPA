import React from 'react';

import { productsData } from '../services/productsdata';
import CoreExpertise from './CoreExpertise';

const Urunler = () => {
  return (
    <>
      <section className="py-24 bg-[#FAF9F6] overflow-hidden">


      <div className="max-w-[90rem] mx-auto px-8 md:px-16 mb-12">
        <span className="text-amber-600 font-semibold tracking-[0.3em] uppercase text-xs mb-4 block">
          Koleksiyon
        </span>
        <h2 className="text-3xl md:text-4xl font-serif text-[#1A1A1C] uppercase tracking-wide">
          Sizin İçin Seçtiklerimiz
        </h2>
      </div>


      <div className="max-w-[90rem] mx-auto px-4 md:px-16">
        <div className="flex gap-6 md:gap-10 overflow-x-auto pb-16 pt-4 px-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">


          {productsData.map((product) => (
            <div
              key={product.id}
              className="snap-start shrink-0 w-[260px] md:w-[300px] group bg-transparent p-4 transition-all duration-500 hover:-translate-y-3 cursor-pointer flex flex-col justify-between items-center"
            >

              <div className="w-full aspect-square mb-8 flex items-center justify-center relative">
                <img

                  src={product.image}
                  alt={product.title}
                  className="w-[95%] h-[95%] object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-[0_15px_25px_rgba(0,0,0,0.12)]"
                />


                <button className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gray-400 hover:text-red-500 z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                </button>
              </div>


              <div className="text-center mt-auto">
                <h3 className="text-sm font-medium text-[#1A1A1C] uppercase tracking-wider mb-2">
                  {product.title}
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