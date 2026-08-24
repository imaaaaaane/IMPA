import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled((prev) => {
        const next = window.scrollY > 50;
        return prev === next ? prev : next;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isProjectPage = location.pathname.startsWith('/proje/');

  if (isProjectPage) return null;

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
      className={`fixed top-0 w-full z-[100] transition-all duration-300 ease-in-out flex justify-between items-center px-8 md:px-16 py-4 text-xs tracking-[0.2em] uppercase ${
        isMegaMenuOpen || isScrolled
          ? 'bg-white text-gray-900 shadow-md'
          : 'bg-transparent text-white'
      }`}
    >
      <Link to="/" className="relative z-10">
        <img 
          src="/impalogo.webp" 
          alt="İMPA Logo" 
          className={`h-10 md:h-12 w-auto object-contain cursor-pointer transition-all duration-300 ${
            isMegaMenuOpen || isScrolled ? 'brightness-0' : 'brightness-200 contrast-200'
          }`}
        />
      </Link>

      {location.pathname !== '/randevu' && (
        <div className={`hidden md:flex items-center gap-12 transition-colors duration-300 ${isMegaMenuOpen || isScrolled ? 'text-gray-900' : 'text-white'}`}>
          <div className="flex gap-12 items-center h-full">
            <Link to="/about" className="hover:text-blue-600 dark:hover:text-amber-500 transition-colors">
              {t('navAbout')}
            </Link>

            {/* ÜRÜNLER MEGA MENU WRAPPER */}
            <div 
              className="group flex items-center h-full"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <div className="py-4 cursor-pointer flex items-center">
                <Link to="/products" className="hover:text-blue-600 dark:hover:text-amber-500 transition-colors">
                  {t('navbarMega.products')}
                </Link>
              </div>

              {/* MEGA MENU DROPDOWN */}
              <div 
                className={`absolute top-full left-0 w-full bg-[#FAF9F6] dark:bg-[#111111] border-t border-gray-200/50 dark:border-white/10 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] origin-top before:absolute before:content-[''] before:-top-12 before:left-0 before:w-full before:h-12 before:bg-transparent ${
                  isMegaMenuOpen ? 'opacity-100 scale-y-100 py-16 pointer-events-auto' : 'opacity-0 scale-y-95 py-0 pointer-events-none'
                }`}
              >
                <div className="max-w-7xl mx-auto px-8 md:px-16 flex gap-16 transition-opacity duration-700 delay-100" style={{ opacity: isMegaMenuOpen ? 1 : 0 }}>
                  
                  {/* Left Side: 60% */}
                  <div className="w-[60%] grid grid-cols-3 gap-12">
                    {/* Col 1 */}
                    <div className="space-y-6 text-[#1A1A1C] dark:text-white">
                      <h4 className="font-semibold tracking-[0.2em] mb-6">OFİS</h4>
                      <ul className="space-y-4 font-light text-gray-500 dark:text-stone-400 normal-case tracking-normal text-[13px]">
                        <li><Link to="/urunler/makam-takimlari" className="hover:text-black dark:hover:text-white transition-colors block">Makam Takımları</Link></li>
                        <li><Link to="/urunler/toplanti-masalari" className="hover:text-black dark:hover:text-white transition-colors block">Toplantı Masaları</Link></li>
                      </ul>
                    </div>
                    {/* Col 2 */}
                    <div className="space-y-6 text-[#1A1A1C] dark:text-white">
                      <h4 className="font-semibold tracking-[0.2em] mb-6">EV & DEPOLAMA</h4>
                      <ul className="space-y-4 font-light text-gray-500 dark:text-stone-400 normal-case tracking-normal text-[13px]">
                        <li><Link to="/urunler/depolama-dolaplar" className="hover:text-black dark:hover:text-white transition-colors block">Depolama & Dolaplar</Link></li>
                        <li><Link to="/urunler/tv-uniteleri-konsol" className="hover:text-black dark:hover:text-white transition-colors block">TV Üniteleri & Konsol</Link></li>
                      </ul>
                    </div>
                    {/* Col 3 */}
                    <div className="space-y-6 text-[#1A1A1C] dark:text-white">
                      <h4 className="font-semibold tracking-[0.2em] mb-6">DİĞER</h4>
                      <ul className="space-y-4 font-light text-gray-500 dark:text-stone-400 normal-case tracking-normal text-[13px]">
                        <li><Link to="/urunler" className="hover:text-black dark:hover:text-white transition-colors block">Tüm Ürünler</Link></li>
                      </ul>
                    </div>
                  </div>

                  {/* Right Side: 40% */}
                  <div className="w-[40%] flex gap-6">
                    {/* Promo Card 1 */}
                    <Link to="/products" className="group/card relative flex-1 rounded-xl overflow-hidden block aspect-[4/5] bg-gray-100 shadow-md">
                      <img loading="lazy" width="800" height="600" src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800" alt="Katalog" className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-[1500ms] ease-out" />
                      <div className="absolute inset-0 bg-black/40 group-hover/card:bg-black/50 transition-colors duration-500"></div>
                      <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                        <span className="text-[9px] text-amber-500 tracking-[0.3em] font-semibold mb-2">{t('navbarMega.promo1.badge')}</span>
                        <h4 className="text-xl font-serif normal-case tracking-normal flex items-center justify-between">
                          {t('navbarMega.promo1.title')}
                          <svg className="w-5 h-5 transform group-hover/card:translate-x-2 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </h4>
                      </div>
                    </Link>
                    {/* Promo Card 2 */}
                    <Link to="/products" className="group/card relative flex-1 rounded-xl overflow-hidden block aspect-[4/5] bg-gray-100 shadow-md">
                      <img loading="lazy" width="800" height="600" src="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&q=80&w=800" alt="Koleksiyon" className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-[1500ms] ease-out" />
                      <div className="absolute inset-0 bg-black/20 group-hover/card:bg-black/30 transition-colors duration-500"></div>
                      <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                        <span className="text-[9px] text-amber-500 tracking-[0.3em] font-semibold mb-2">{t('navbarMega.promo2.badge')}</span>
                        <h4 className="text-xl font-serif normal-case tracking-normal flex items-center justify-between">
                          {t('navbarMega.promo2.title')}
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
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white dark:bg-stone-800 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.1)] flex items-center justify-center hover:scale-110 hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)] transition-all duration-300 z-50 group/close"
                  aria-label="Menüyü Kapat"
                >
                  <svg className="w-5 h-5 text-stone-400 dark:text-stone-300 group-hover/close:text-stone-800 dark:group-hover/close:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <a 
              href="/#projeler" 
              className="hover:text-blue-600 dark:hover:text-amber-500 transition-colors"
            >
              {t('navProjects')}
            </a>
            
            <Link 
              to="/ebatlama" 
              className="hover:text-blue-600 dark:hover:text-amber-500 transition-colors"
            >
              EBATLAMA
            </Link>
            
            <Link 
              to="/#etkinlikler" 
              onClick={(e) => handleSmoothScroll(e, 'etkinlikler')}
              className="hover:text-blue-600 dark:hover:text-amber-500 transition-colors"
            >
              {t('navEvents')}
            </Link>
            
            <Link 
              to="/#iletisim" 
              onClick={(e) => handleSmoothScroll(e, 'iletisim')}
              className="hover:text-blue-600 dark:hover:text-amber-500 transition-colors"
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

      {/* MOBILE MENU TOGGLE (Hamburger) */}
      {location.pathname !== '/randevu' && (
        <div className="flex items-center gap-4 md:hidden relative z-[110]">
          <ThemeToggle />
          <LanguageSwitcher />
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 rounded-lg transition-colors ${
              isMobileMenuOpen || isScrolled || isMegaMenuOpen
                ? 'text-gray-900 bg-gray-100 hover:bg-gray-200' 
                : 'text-white bg-black/20 backdrop-blur-md hover:bg-black/40'
            }`}
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      )}

      {/* MOBILE MENU DRAWER */}
      <div 
        className={`fixed inset-0 bg-[#FAF9F6] dark:bg-[#111111] z-[105] flex flex-col pt-32 px-8 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-8 text-xl font-serif text-[#1A1A1C] dark:text-white tracking-wide">
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-amber-500 transition-colors">
            {t('navAbout')}
          </Link>
          <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-amber-500 transition-colors">
            {t('navbarMega.products')}
          </Link>
          <a href="/#projeler" onClick={(e) => { setIsMobileMenuOpen(false); handleSmoothScroll(e, 'projeler'); }} className="hover:text-amber-500 transition-colors">
            {t('navProjects')}
          </a>
          <Link to="/ebatlama" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-amber-500 transition-colors">
            EBATLAMA
          </Link>
          <a href="/#etkinlikler" onClick={(e) => { setIsMobileMenuOpen(false); handleSmoothScroll(e, 'etkinlikler'); }} className="hover:text-amber-500 transition-colors">
            {t('navEvents')}
          </a>
          <a href="/#iletisim" onClick={(e) => { setIsMobileMenuOpen(false); handleSmoothScroll(e, 'iletisim'); }} className="hover:text-amber-500 transition-colors">
            {t('navContact')}
          </a>
        </div>
      </div>
    </nav>
  );
}