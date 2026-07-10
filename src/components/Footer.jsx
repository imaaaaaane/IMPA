import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <footer className="bg-white dark:bg-[#1A1A1C] pt-24 pb-12 px-6 md:px-12 relative overflow-hidden transition-colors duration-500">
      
      <div className="max-w-[90rem] mx-auto relative z-10">
        
        {/* Split Screen Consultation Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden mb-20">
          
          {/* Left Side: Visual & Copy */}
          <div className="relative h-[500px] lg:h-auto flex items-end p-8 md:p-16">
            {/* Moody Image Placeholder */}
            <img 
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop" 
              alt="Interior Architect Consultation" 
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            {/* Dark Overlay for Text Legibility */}
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            
            <h2 className="relative z-20 text-4xl md:text-5xl lg:text-6xl font-serif text-[#FAF9F6] leading-tight">
              İç Mimarımızla <br /> Hayalinizdeki Alanı <br /> Tasarlayın.
            </h2>
          </div>

          {/* Right Side: The Process & CTA */}
          <div className="bg-[#FAF9F6] p-8 md:p-16 lg:p-20 flex flex-col justify-center">
            
            <h3 className="text-[10px] md:text-xs text-amber-600 font-semibold tracking-[0.3em] uppercase mb-12">
              Sürecimiz Nasıl İşliyor?
            </h3>
            
            <div className="flex flex-col gap-10 mb-12">
              {/* Step 1 */}
              <div className="flex items-start gap-6 group">
                <span className="text-2xl font-serif text-gray-300 group-hover:text-amber-600 transition-colors duration-500">01.</span>
                <div>
                  <h4 className="text-lg font-serif text-[#1A1A1C] mb-1">Tanışma & Keşif</h4>
                  <p className="text-gray-500 text-sm font-light leading-relaxed">Beklentilerinizi dinliyor, alanınızı analiz ediyoruz.</p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="flex items-start gap-6 group">
                <span className="text-2xl font-serif text-gray-300 group-hover:text-amber-600 transition-colors duration-500">02.</span>
                <div>
                  <h4 className="text-lg font-serif text-[#1A1A1C] mb-1">3D Tasarım</h4>
                  <p className="text-gray-500 text-sm font-light leading-relaxed">Hayalinizdeki mekanı 3 boyutlu olarak modelliyoruz.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-6 group">
                <span className="text-2xl font-serif text-gray-300 group-hover:text-amber-600 transition-colors duration-500">03.</span>
                <div>
                  <h4 className="text-lg font-serif text-[#1A1A1C] mb-1">Üretim & Kurulum</h4>
                  <p className="text-gray-500 text-sm font-light leading-relaxed">Kendi fabrikamızda üretiyor ve teslim ediyoruz.</p>
                </div>
              </div>
            </div>

            <button 
              type="button" 
              onClick={() => navigate('/spaces')}
              className="w-full bg-[#1A1A1C] text-[#FAF9F6] py-5 hover:bg-black hover:-translate-y-1 transition-all duration-300 tracking-[0.2em] text-xs uppercase font-medium"
            >
              Alanınızı Seçin
            </button>

            <div className="mt-16 text-gray-400 text-[10px] tracking-widest uppercase">
              <p>Organize Sanayi Bölgesi</p>
              <p>Batman, Türkiye</p>
            </div>
          </div>
          
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs tracking-[0.2em] uppercase text-black/50 dark:text-white/50 font-medium transition-colors duration-500">
          <div className="font-serif text-2xl text-black dark:text-[#FAF9F6] mb-4 md:mb-0 tracking-[0.25em] transition-colors duration-500">İMPA</div>
          <div className="flex gap-8 mb-4 md:mb-0">
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t('footerCareer')}</a>
          </div>
          <div>© 2003–2026 İMPA ORMAN ÜRÜNLERİ.</div>
        </div>
      </div>
    </footer>
  );
}
