import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Randevu() {
  const { t } = useTranslation();
  const location = useLocation();
  const selectedSpace = location.state?.selectedSpace || '';

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FAF9F6] pt-24 lg:pt-0">
      
      {/* Left Side: Visual & Copy */}
      <div className="relative w-full lg:w-1/2 h-[400px] lg:min-h-screen flex items-end p-8 md:p-16">
        <img 
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format&fit=crop" 
          alt="Interior Architect Consultation" 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-stone-900/40 z-10"></div>
        <h2 className="relative z-20 text-4xl md:text-5xl lg:text-6xl font-serif text-[#FAF9F6] leading-tight drop-shadow-xl">
          {t('randevu.heroTitle1')} <br /> {t('randevu.heroTitle2')} <br /> {t('randevu.heroTitle3')}
        </h2>
      </div>

      {/* Right Side: The Booking Form */}
      <div className="w-full lg:w-1/2 bg-[#FAF9F6] p-8 md:p-16 lg:p-24 flex flex-col justify-center">
        <h3 className="text-2xl font-serif text-[#1A1A1C] mb-12">{t('randevu.formTitle')}</h3>
        
        <form className="flex flex-col gap-10 max-w-lg">
          
          <div className="relative">
            <input 
              type="text" 
              id="name"
              className="block w-full bg-transparent border-b border-gray-300 py-2 text-[#1A1A1C] focus:outline-none focus:border-[#1A1A1C] transition-colors peer placeholder-transparent"
              placeholder={t('randevu.name')}
            />
            <label 
              htmlFor="name"
              className="absolute left-0 -top-5 text-xs text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-xs peer-focus:text-[#1A1A1C]"
            >
              {t('randevu.name')}
            </label>
          </div>

          <div className="relative">
            <input 
              type="text" 
              id="contact"
              className="block w-full bg-transparent border-b border-gray-300 py-2 text-[#1A1A1C] focus:outline-none focus:border-[#1A1A1C] transition-colors peer placeholder-transparent"
              placeholder={t('randevu.contact')}
            />
            <label 
              htmlFor="contact"
              className="absolute left-0 -top-5 text-xs text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-xs peer-focus:text-[#1A1A1C]"
            >
              {t('randevu.contact')}
            </label>
          </div>

          <div className="relative">
            <input 
              type="text" 
              id="space"
              defaultValue={selectedSpace}
              className="block w-full bg-transparent border-b border-gray-300 py-2 text-[#1A1A1C] focus:outline-none focus:border-[#1A1A1C] transition-colors peer placeholder-transparent"
              placeholder={t('randevu.space')}
            />
            <label 
              htmlFor="space"
              className="absolute left-0 -top-5 text-xs text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-xs peer-focus:text-[#1A1A1C]"
            >
              {t('randevu.space')}
            </label>
          </div>

          <button 
            type="button" 
            className="mt-6 w-full bg-[#1A1A1C] text-[#FAF9F6] py-5 hover:bg-stone-800 hover:-translate-y-1 transition-all duration-300 tracking-[0.2em] text-xs uppercase font-medium shadow-xl shadow-black/10"
          >
            {t('randevu.submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
