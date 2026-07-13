import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 1. Data Arrays mapping exactly to the local assets requested
const modulerAssets = [
  "/modul1.jpg", 
  "/module2.jpg", 
  "/module3.jpg", 
  "/module4.jpg", 
  "/moduler5.jpg"
];

const surfaceAssets = [
  "/surface1.jpg", 
  "/surface2.jpg", 
  "/surface3.jpg", 
  "/surface4.jpg", 
  "/surface5.jpg"
];

// Ultra-Minimalist Check Icon
const CheckIcon = () => (
  <svg 
    className="w-4 h-4 text-stone-400 mt-[5px] shrink-0" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
  </svg>
);

export default function CoreExpertise() {
  const { t } = useTranslation();

  return (
    <section className="pt-12 pb-32 bg-[#FAF9F6] dark:bg-[#111111] transition-colors duration-500 relative overflow-hidden">
      
      <style>
        {`
          @keyframes scrollY {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
          }
          @keyframes scrollReverseY {
            0% { transform: translateY(-50%); }
            100% { transform: translateY(0); }
          }
          /* Cinematic, ultra-slow pacing */
          .animate-scroll-y {
            animation: scrollY 50s linear infinite;
          }
          .animate-scroll-reverse-y {
            animation: scrollReverseY 50s linear infinite;
          }
        `}
      </style>

      {/* 1. Spatial Expansion: max-w-[1400px] */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 relative z-10">
        
        {/* Global Title */}
        <div className="text-center mb-32 md:mb-48">
          <h3 className="text-[10px] text-stone-400 tracking-[0.4em] font-light uppercase mb-6">
            {t('coreExpertise.subtitle')}
          </h3>
          <h2 className="text-3xl md:text-5xl font-serif text-[#1A1A1C] dark:text-white transition-colors duration-500 font-light tracking-widest relative inline-block">
            {t('coreExpertise.title')}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-12 h-[1px] bg-stone-300"></div>
          </h2>
        </div>

        {/* BLOCK 1: İMPA MODÜLER */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-40 mb-40 lg:mb-56 items-center">
          
          {/* Gallery Left (De-boxed: No heavy shadows, sharp corners) */}
          <div className="relative w-full h-[600px] md:h-[700px] rounded-sm overflow-hidden group">
            {/* Gradient Mask Overlays (Strictly matching background color) */}
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#FAF9F6] dark:from-[#111111] transition-colors duration-500 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#FAF9F6] dark:from-[#111111] transition-colors duration-500 to-transparent z-10 pointer-events-none"></div>
            
            {/* Infinite Scroll Track */}
            <div className="animate-scroll-y flex flex-col group-hover:[animation-play-state:paused] pt-4">
              <div className="flex flex-col gap-10 pb-10 px-2">
                {modulerAssets.map((src, i) => (
                  <div key={`m1-${i}`} className="w-full aspect-[4/5] rounded-sm overflow-hidden">
                    <img src={src} alt={`İMPA Modüler ${i + 1}`} className="w-full h-full object-cover grayscale-[0.1]" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-10 pb-10 px-2">
                {modulerAssets.map((src, i) => (
                  <div key={`m2-${i}`} className="w-full aspect-[4/5] rounded-sm overflow-hidden">
                    <img src={src} alt={`İMPA Modüler ${i + 1} clone`} className="w-full h-full object-cover grayscale-[0.1]" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Text Right (Constrained max-w-lg) */}
          <div className="flex flex-col justify-center space-y-12 lg:pr-12 max-w-lg mx-auto lg:mx-0">
            <h3 className="text-3xl md:text-5xl font-serif text-[#1A1A1C] dark:text-white transition-colors duration-500 font-light leading-snug">
              {t('coreExpertise.moduler.title')} <br/>
              <span className="text-xl md:text-2xl text-stone-400 font-normal mt-4 block">{t('coreExpertise.moduler.subtitle')}</span>
            </h3>
            
            {/* Breathable Paragraph */}
            <p className="text-stone-500 dark:text-stone-400 transition-colors duration-500 font-light text-[15px] leading-[2.2rem]">
              {t('coreExpertise.moduler.desc')}
            </p>
            
            {/* Elegant List */}
            <ul className="space-y-6 pt-2">
              <li className="flex items-start gap-5 text-stone-600 dark:text-stone-400 transition-colors duration-500 font-light text-[15px] tracking-wide">
                <CheckIcon /> {t('coreExpertise.moduler.feature1')}
              </li>
              <li className="flex items-start gap-5 text-stone-600 dark:text-stone-400 transition-colors duration-500 font-light text-[15px] tracking-wide">
                <CheckIcon /> {t('coreExpertise.moduler.feature2')}
              </li>
              <li className="flex items-start gap-5 text-stone-600 dark:text-stone-400 transition-colors duration-500 font-light text-[15px] tracking-wide">
                <CheckIcon /> {t('coreExpertise.moduler.feature3')}
              </li>
              <li className="flex items-start gap-5 text-stone-600 dark:text-stone-400 transition-colors duration-500 font-light text-[15px] tracking-wide">
                <CheckIcon /> {t('coreExpertise.moduler.feature4')}
              </li>
            </ul>

            <div className="pt-8">
              <a href="#" className="group flex items-center gap-4 w-fit px-8 py-3.5 mt-4 border border-stone-900 dark:border-white text-[11px] font-semibold tracking-[0.25em] uppercase text-stone-900 dark:text-white hover:bg-stone-900 dark:hover:bg-white hover:text-white dark:hover:text-stone-950 transition-all duration-400 ease-out">
                {t('coreExpertise.btnDetails')}
                <ArrowRight strokeWidth={1} size={16} className="transform group-hover:translate-x-1.5 transition-transform duration-400" />
              </a>
            </div>
          </div>
        </div>

        {/* BLOCK 2: İMPA SURFACE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-40 items-center">
          
          {/* Text Left (Order 2 on mobile, 1 on desktop) */}
          <div className="flex flex-col justify-center space-y-12 lg:pl-12 order-2 lg:order-1 max-w-lg mx-auto lg:mx-0 lg:ml-auto">
            <h3 className="text-3xl md:text-5xl font-serif text-[#1A1A1C] dark:text-white transition-colors duration-500 font-light leading-snug">
              {t('coreExpertise.surface.title')} <br/>
              <span className="text-xl md:text-2xl text-stone-400 font-normal mt-4 block">{t('coreExpertise.surface.subtitle')}</span>
            </h3>
            
            <p className="text-stone-500 dark:text-stone-400 transition-colors duration-500 font-light text-[15px] leading-[2.2rem]">
              {t('coreExpertise.surface.desc')}
            </p>
            
            <ul className="space-y-6 pt-2">
              <li className="flex items-start gap-5 text-stone-600 dark:text-stone-400 transition-colors duration-500 font-light text-[15px] tracking-wide">
                <CheckIcon /> {t('coreExpertise.surface.feature1')}
              </li>
              <li className="flex items-start gap-5 text-stone-600 dark:text-stone-400 transition-colors duration-500 font-light text-[15px] tracking-wide">
                <CheckIcon /> {t('coreExpertise.surface.feature2')}
              </li>
              <li className="flex items-start gap-5 text-stone-600 dark:text-stone-400 transition-colors duration-500 font-light text-[15px] tracking-wide">
                <CheckIcon /> {t('coreExpertise.surface.feature3')}
              </li>
              <li className="flex items-start gap-5 text-stone-600 dark:text-stone-400 transition-colors duration-500 font-light text-[15px] tracking-wide">
                <CheckIcon /> {t('coreExpertise.surface.feature4')}
              </li>
            </ul>

            <div className="pt-8">
              <a href="#" className="group flex items-center gap-4 w-fit px-8 py-3.5 mt-4 border border-stone-900 dark:border-white text-[11px] font-semibold tracking-[0.25em] uppercase text-stone-900 dark:text-white hover:bg-stone-900 dark:hover:bg-white hover:text-white dark:hover:text-stone-950 transition-all duration-400 ease-out">
                {t('coreExpertise.btnDetails')}
                <ArrowRight strokeWidth={1} size={16} className="transform group-hover:translate-x-1.5 transition-transform duration-400" />
              </a>
            </div>
          </div>

          {/* Gallery Right */}
          <div className="relative w-full h-[600px] md:h-[700px] rounded-sm overflow-hidden group order-1 lg:order-2">
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#FAF9F6] dark:from-[#111111] transition-colors duration-500 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#FAF9F6] dark:from-[#111111] transition-colors duration-500 to-transparent z-10 pointer-events-none"></div>
            
            <div className="animate-scroll-reverse-y flex flex-col group-hover:[animation-play-state:paused] pt-4">
              <div className="flex flex-col gap-10 pb-10 px-2">
                {surfaceAssets.map((src, i) => (
                  <div key={`s1-${i}`} className="w-full aspect-[4/5] rounded-sm overflow-hidden">
                    <img src={src} alt={`İMPA Surface ${i + 1}`} className="w-full h-full object-cover grayscale-[0.1]" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-10 pb-10 px-2">
                {surfaceAssets.map((src, i) => (
                  <div key={`s2-${i}`} className="w-full aspect-[4/5] rounded-sm overflow-hidden">
                    <img src={src} alt={`İMPA Surface ${i + 1} clone`} className="w-full h-full object-cover grayscale-[0.1]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>

      </div>
    </section>
  );
}
