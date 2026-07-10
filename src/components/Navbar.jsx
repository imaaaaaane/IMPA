import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  const handleSmoothScroll = (e, targetId) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav 
      className={`absolute top-0 w-full z-[100] transition-colors duration-500 ease-in-out flex justify-between items-center px-8 md:px-16 py-8 text-xs tracking-[0.2em] uppercase ${
        isMegaMenuOpen 
          ? 'bg-[#FAF9F6] text-[#1A1A1C] shadow-sm' 
          : 'bg-transparent text-white mix-blend-difference'
      }`}
    >
      <Link to="/" className="relative z-10">
        <img 
          src="/impalogo.png" 
          alt="İMPA Logo" 
          className={`h-24 md:h-32 w-auto object-contain cursor-pointer transition-all duration-500 ${
            isMegaMenuOpen ? 'brightness-0' : 'contrast-200 brightness-200'
          }`}
        />
      </Link>

      {location.pathname !== '/randevu' && (
        <div className={`hidden md:flex items-center gap-12 transition-colors duration-500 ${isMegaMenuOpen ? 'text-[#1A1A1C]' : 'text-white/80'}`}>
          <div className="flex gap-12 items-center h-full">
            <Link to="/about" className="hover:opacity-60 transition-opacity">
              {t('navAbout')}
            </Link>

            {/* ÜRÜNLER MEGA MENU WRAPPER */}
            <div 
              className="group flex items-center h-full"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              {/* Invisible padding bridge to prevent hover loss */}
              <div className="py-12 cursor-pointer flex items-center">
                <Link to="/products" className="hover:opacity-60 transition-opacity">
                  ÜRÜNLER
                </Link>
              </div>

              {/* MEGA MENU DROPDOWN */}
              <div 
                className={`absolute top-full left-0 w-full bg-[#FAF9F6] border-t border-gray-200/50 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] origin-top before:absolute before:content-[''] before:-top-12 before:left-0 before:w-full before:h-12 before:bg-transparent ${
                  isMegaMenuOpen ? 'opacity-100 scale-y-100 py-16 pointer-events-auto' : 'opacity-0 scale-y-95 py-0 pointer-events-none'
                }`}
              >
                <div className="max-w-7xl mx-auto px-8 md:px-16 flex gap-16 transition-opacity duration-700 delay-100" style={{ opacity: isMegaMenuOpen ? 1 : 0 }}>
                  
                  {/* Left Side: 60% */}
                  <div className="w-[60%] grid grid-cols-3 gap-12">
                    {/* Col 1 */}
                    <div className="space-y-6 text-[#1A1A1C]">
                      <h4 className="font-semibold tracking-[0.2em] mb-6">Oturma Grupları</h4>
                      <ul className="space-y-4 font-light text-gray-500 normal-case tracking-normal text-[13px]">
                        <li><Link to="/products" className="hover:text-black transition-colors block">Kanepeler & Koltuklar</Link></li>
                        <li><Link to="/products" className="hover:text-black transition-colors block">L Koltuklar</Link></li>
                        <li><Link to="/products" className="hover:text-black transition-colors block">Berjerler</Link></li>
                        <li><Link to="/products" className="hover:text-black transition-colors block">Orta & Yan Sehpalar</Link></li>
                      </ul>
                    </div>
                    {/* Col 2 */}
                    <div className="space-y-6 text-[#1A1A1C]">
                      <h4 className="font-semibold tracking-[0.2em] mb-6">Yemek Odası</h4>
                      <ul className="space-y-4 font-light text-gray-500 normal-case tracking-normal text-[13px]">
                        <li><Link to="/products" className="hover:text-black transition-colors block">Yemek Masaları</Link></li>
                        <li><Link to="/products" className="hover:text-black transition-colors block">Sandalyeler</Link></li>
                        <li><Link to="/products" className="hover:text-black transition-colors block">Konsol & Büfeler</Link></li>
                      </ul>
                    </div>
                    {/* Col 3 */}
                    <div className="space-y-6 text-[#1A1A1C]">
                      <h4 className="font-semibold tracking-[0.2em] mb-6">Yatak Odası</h4>
                      <ul className="space-y-4 font-light text-gray-500 normal-case tracking-normal text-[13px]">
                        <li><Link to="/products" className="hover:text-black transition-colors block">Karyola & Yataklar</Link></li>
                        <li><Link to="/products" className="hover:text-black transition-colors block">Gardıroplar</Link></li>
                        <li><Link to="/products" className="hover:text-black transition-colors block">Komodinler</Link></li>
                      </ul>
                    </div>
                  </div>

                  {/* Right Side: 40% */}
                  <div className="w-[40%] flex gap-6">
                    {/* Promo Card 1 */}
                    <Link to="/products" className="group/card relative flex-1 rounded-xl overflow-hidden block aspect-[4/5] bg-gray-100 shadow-md">
                      <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800" alt="Katalog" className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-[1500ms] ease-out" />
                      <div className="absolute inset-0 bg-black/40 group-hover/card:bg-black/50 transition-colors duration-500"></div>
                      <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                        <span className="text-[9px] text-amber-500 tracking-[0.3em] font-semibold mb-2">İNDİR</span>
                        <h4 className="text-xl font-serif normal-case tracking-normal flex items-center justify-between">
                          İMPA Katalog '26
                          <svg className="w-5 h-5 transform group-hover/card:translate-x-2 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </h4>
                      </div>
                    </Link>
                    {/* Promo Card 2 */}
                    <Link to="/products" className="group/card relative flex-1 rounded-xl overflow-hidden block aspect-[4/5] bg-gray-100 shadow-md">
                      <img src="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&q=80&w=800" alt="Koleksiyon" className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-[1500ms] ease-out" />
                      <div className="absolute inset-0 bg-black/20 group-hover/card:bg-black/30 transition-colors duration-500"></div>
                      <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                        <span className="text-[9px] text-amber-500 tracking-[0.3em] font-semibold mb-2">KEŞFET</span>
                        <h4 className="text-xl font-serif normal-case tracking-normal flex items-center justify-between">
                          Yeni Koleksiyon
                          <svg className="w-5 h-5 transform group-hover/card:translate-x-2 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </h4>
                      </div>
                    </Link>
                  </div>
                  
                </div>

                {/* Floating Close Button */}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMegaMenuOpen(false);
                  }}
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.1)] flex items-center justify-center hover:scale-110 hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)] transition-all duration-300 z-50 group/close"
                  aria-label="Menüyü Kapat"
                >
                  <svg className="w-5 h-5 text-stone-400 group-hover/close:text-stone-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <Link 
              to="/#projeler" 
              onClick={(e) => handleSmoothScroll(e, 'projeler')}
              className="hover:opacity-60 transition-opacity"
            >
              {t('navProjects')}
            </Link>
            
            <Link 
              to="/#etkinlikler" 
              onClick={(e) => handleSmoothScroll(e, 'etkinlikler')}
              className="hover:opacity-60 transition-opacity"
            >
              {t('navEvents')}
            </Link>
            
            <Link 
              to="/#iletisim" 
              onClick={(e) => handleSmoothScroll(e, 'iletisim')}
              className="hover:opacity-60 transition-opacity"
            >
              {t('navContact')}
            </Link>
          </div>
          <div className="flex ml-4 items-center gap-4 relative z-10">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </nav>
  );
}