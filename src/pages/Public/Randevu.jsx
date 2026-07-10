import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Randevu() {
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
          Hayalinizdeki <br /> Alanı <br /> Tasarlayalım.
        </h2>
      </div>

      {/* Right Side: The Booking Form */}
      <div className="w-full lg:w-1/2 bg-[#FAF9F6] p-8 md:p-16 lg:p-24 flex flex-col justify-center">
        <h3 className="text-2xl font-serif text-[#1A1A1C] mb-12">Danışmanlık Formu</h3>
        
        <form className="flex flex-col gap-10 max-w-lg">
          
          <div className="relative">
            <input 
              type="text" 
              id="name"
              className="block w-full bg-transparent border-b border-gray-300 py-2 text-[#1A1A1C] focus:outline-none focus:border-[#1A1A1C] transition-colors peer placeholder-transparent"
              placeholder="Adınız Soyadınız"
            />
            <label 
              htmlFor="name"
              className="absolute left-0 -top-5 text-xs text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-xs peer-focus:text-[#1A1A1C]"
            >
              Adınız Soyadınız
            </label>
          </div>

          <div className="relative">
            <input 
              type="text" 
              id="contact"
              className="block w-full bg-transparent border-b border-gray-300 py-2 text-[#1A1A1C] focus:outline-none focus:border-[#1A1A1C] transition-colors peer placeholder-transparent"
              placeholder="E-Posta / Telefon"
            />
            <label 
              htmlFor="contact"
              className="absolute left-0 -top-5 text-xs text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-xs peer-focus:text-[#1A1A1C]"
            >
              E-Posta / Telefon
            </label>
          </div>

          <div className="relative">
            <input 
              type="text" 
              id="space"
              defaultValue={selectedSpace}
              className="block w-full bg-transparent border-b border-gray-300 py-2 text-[#1A1A1C] focus:outline-none focus:border-[#1A1A1C] transition-colors peer placeholder-transparent"
              placeholder="İlgilendiğiniz Alan"
            />
            <label 
              htmlFor="space"
              className="absolute left-0 -top-5 text-xs text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-xs peer-focus:text-[#1A1A1C]"
            >
              İlgilendiğiniz Alan
            </label>
          </div>

          <button 
            type="button" 
            className="mt-6 w-full bg-[#1A1A1C] text-[#FAF9F6] py-5 hover:bg-stone-800 hover:-translate-y-1 transition-all duration-300 tracking-[0.2em] text-xs uppercase font-medium shadow-xl shadow-black/10"
          >
            Ücretsiz Danışmanlık Al
          </button>
        </form>
      </div>
    </div>
  );
}
