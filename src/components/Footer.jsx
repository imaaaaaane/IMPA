import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <footer className="bg-white dark:bg-[#111111] pt-24 pb-12 px-6 md:px-12 relative overflow-hidden transition-colors duration-500">
      
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
              {t('footerArchitect.title1')} <br /> {t('footerArchitect.title2')} <br /> {t('footerArchitect.title3')}
            </h2>
          </div>

          {/* Right Side: The Process & CTA */}
          <div className="bg-[#FAF9F6] dark:bg-[#111111] transition-colors duration-500 p-8 md:p-16 lg:p-20 flex flex-col justify-center">
            
            <h3 className="text-[10px] md:text-xs text-amber-600 font-semibold tracking-[0.3em] uppercase mb-12">
              {t('footerArchitect.process')}
            </h3>
            
            <div className="flex flex-col gap-10 mb-12">
              {/* Step 1 */}
              <div className="flex items-start gap-6 group">
                <span className="text-2xl font-serif text-gray-300 group-hover:text-amber-600 transition-colors duration-500">01.</span>
                <div>
                  <h4 className="text-lg font-serif text-[#1A1A1C] dark:text-white transition-colors duration-500 mb-1">{t('footerArchitect.step1Title')}</h4>
                  <p className="text-gray-500 dark:text-stone-400 transition-colors duration-500 text-sm font-light leading-relaxed">{t('footerArchitect.step1Desc')}</p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="flex items-start gap-6 group">
                <span className="text-2xl font-serif text-gray-300 group-hover:text-amber-600 transition-colors duration-500">02.</span>
                <div>
                  <h4 className="text-lg font-serif text-[#1A1A1C] dark:text-white transition-colors duration-500 mb-1">{t('footerArchitect.step2Title')}</h4>
                  <p className="text-gray-500 dark:text-stone-400 transition-colors duration-500 text-sm font-light leading-relaxed">{t('footerArchitect.step2Desc')}</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-6 group">
                <span className="text-2xl font-serif text-gray-300 group-hover:text-amber-600 transition-colors duration-500">03.</span>
                <div>
                  <h4 className="text-lg font-serif text-[#1A1A1C] dark:text-white transition-colors duration-500 mb-1">{t('footerArchitect.step3Title')}</h4>
                  <p className="text-gray-500 dark:text-stone-400 transition-colors duration-500 text-sm font-light leading-relaxed">{t('footerArchitect.step3Desc')}</p>
                </div>
              </div>
            </div>

            <button 
              type="button" 
              onClick={() => navigate('/spaces')}
              className="w-full bg-[#1A1A1C] dark:bg-white text-[#FAF9F6] dark:text-[#1A1A1C] py-5 hover:bg-black dark:hover:bg-stone-200 hover:-translate-y-1 transition-all duration-300 tracking-[0.2em] text-xs uppercase font-medium"
            >
              {t('footerArchitect.btnSelect')}
            </button>

            <div className="mt-16 text-gray-400 text-[10px] tracking-widest uppercase">
              <p>{t('footerArchitect.address1')}</p>
              <p>{t('footerArchitect.address2')}</p>
            </div>
          </div>
          
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs tracking-[0.2em] uppercase text-black/50 dark:text-white/50 font-medium transition-colors duration-500">
          <img src="/impalogo.png" alt="İMPA Logo" className="h-8 w-auto object-contain dark:brightness-0 dark:invert mb-4 md:mb-0 transition-all duration-500" />
          <div className="flex gap-8 mb-4 md:mb-0">
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t('footerCareer')}</a>
          </div>
          <div>{t('footerArchitect.copyright')}</div>
        </div>
      </div>
    </footer>
  );
}
