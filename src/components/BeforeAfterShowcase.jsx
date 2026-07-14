import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import after1Img from '../assets/after1.jpg';
import before1Img from '../assets/before1.jpg';
import before2Img from '../assets/before2.jpg';
import after3Img from '../assets/after3.jpg';
import before3Img from '../assets/before3.jpg';

// =========================================================================
// PROJECT 1: THE BLUEPRINT SLIDER (Interactive Drag Reveal)
// =========================================================================
function BlueprintSlider() {
  const { t } = useTranslation();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const onMouseMove = (e) => { if (isDragging) handleMove(e.clientX); };
    const onTouchMove = (e) => { if (isDragging) handleMove(e.touches[0].clientX); };

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[50vh] md:h-[70vh] rounded-2xl overflow-hidden cursor-ew-resize select-none shadow-2xl group"
      onMouseDown={(e) => { setIsDragging(true); handleMove(e.clientX); }}
      onTouchStart={(e) => { setIsDragging(true); handleMove(e.touches[0].clientX); }}
    >
      {/* BACKGROUND IMAGE (The Full, Final "AFTER" Image) */}
      <img 
        src={after1Img} 
        alt="After" 
        className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
      />
      
      {/* FOREGROUND CLIPPED IMAGE (The "BEFORE" Image) */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none" 
        style={{ 
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
        }}
      >
        <img 
          src={before1Img} 
          alt="Before" 
          className="absolute inset-0 w-full h-full object-cover" 
        />
      </div>

      {/* Elegant Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 z-20 w-[2px] bg-white flex items-center justify-center transform -translate-x-1/2 pointer-events-none shadow-[0_0_15px_rgba(255,255,255,0.9)]" 
        style={{ left: `${sliderPosition}%` }}
      >
        <div className={`w-12 h-16 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center shadow-2xl text-stone-900 border border-white/40 transition-transform duration-300 ${isDragging ? 'scale-110' : 'group-hover:scale-110'}`}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" transform="rotate(90 12 12)" />
          </svg>
        </div>
      </div>

      <div className="absolute top-6 left-6 z-10 px-5 py-2 bg-black/60 backdrop-blur-md text-white text-xs tracking-widest uppercase rounded">{t('spaces.01.before')}</div>
      <div className="absolute top-6 right-6 z-20 px-5 py-2 bg-black/60 backdrop-blur-md text-white text-xs tracking-widest uppercase rounded">{t('spaces.01.after')}</div>
    </div>
  );
}


// =========================================================================
// PROJECT 2: HOVER LENS REVEAL (Master Yatak Odası)
// =========================================================================
function HoverLens() {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  
  // We track physics without triggering React renders
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const targetRadius = useRef(0);
  const currentRadius = useRef(0);

  const updateLens = () => {
    // Lerp radius for smooth expand/collapse
    currentRadius.current += (targetRadius.current - currentRadius.current) * 0.15;
    
    // Lerp position for buttery smooth tracking (eliminates jagged mouse moves)
    currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.35;
    currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.35;

    if (containerRef.current) {
      // Direct DOM manipulation via CSS Variables for 60fps performance
      containerRef.current.style.setProperty('--lens-x', `${currentPos.current.x}px`);
      containerRef.current.style.setProperty('--lens-y', `${currentPos.current.y}px`);
      containerRef.current.style.setProperty('--lens-r', `${currentRadius.current}px`);
      
      // Calculate normalized opacity based on radius expansion
      const opacity = Math.max(0, currentRadius.current / 250);
      containerRef.current.style.setProperty('--lens-opacity', opacity.toString());
    }
    
    rafRef.current = requestAnimationFrame(updateLens);
  };

  useEffect(() => {
    rafRef.current = requestAnimationFrame(updateLens);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    targetPos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleTouchMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    targetPos.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[50vh] md:h-[70vh] rounded-2xl overflow-hidden shadow-2xl cursor-crosshair bg-stone-200"
      onMouseEnter={() => { targetRadius.current = 250; }}
      onMouseLeave={() => { targetRadius.current = 0; }}
      onMouseMove={handleMouseMove}
      onTouchStart={() => { targetRadius.current = 250; }}
      onTouchEnd={() => { targetRadius.current = 0; }}
      onTouchMove={handleTouchMove}
      style={{ '--lens-x': '0px', '--lens-y': '0px', '--lens-r': '0px', '--lens-opacity': '0' }}
    >
      {/* Before Image (Top Visible Layer) */}
      <img 
        src={before3Img} 
        alt="Before" 
        className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
      />
      
      {/* After Image (Hidden layer revealed by lens) */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none" 
        style={{ 
          clipPath: `circle(var(--lens-r, 0px) at var(--lens-x, 0px) var(--lens-y, 0px))`
        }}
      >
        <img 
          src={after3Img} 
          alt="After" 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        
        {/* Glow Ring inside the mask */}
        <div 
          className="absolute rounded-full border-2 border-white/60 shadow-[inset_0_0_40px_rgba(255,255,255,0.6)] pointer-events-none"
          style={{
            transform: `translate(calc(var(--lens-x, 0px) - var(--lens-r, 0px)), calc(var(--lens-y, 0px) - var(--lens-r, 0px)))`,
            width: `calc(var(--lens-r, 0px) * 2)`,
            height: `calc(var(--lens-r, 0px) * 2)`,
            opacity: `var(--lens-opacity, 0)`
          }}
        />
      </div>

      {/* Floating Status Badge */}
      <div 
        className="absolute bottom-6 left-1/2 z-20 px-8 py-4 bg-black/60 backdrop-blur-xl text-white text-xs tracking-[0.2em] uppercase rounded-full pointer-events-none shadow-xl whitespace-nowrap"
        style={{
          opacity: `calc(1 - var(--lens-opacity))`,
          transform: `translate(-50%, calc(var(--lens-opacity) * -16px))`
        }}
      >
        {t('spaces.02.prompt')}
      </div>
    </div>
  );
}


// =========================================================================
// PROJECT 3: SCROLL FADE BUILD (Minimalist Mutfak - Video Fade)
// =========================================================================
function ScrollFade() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      // Higher threshold: forces the user to scroll down further (80% of container) before triggering
      { threshold: 0.8 } 
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[50vh] md:h-[70vh] rounded-2xl overflow-hidden shadow-2xl bg-stone-900"
    >
      {/* Before Image (The Sketch) */}
      <img 
        src={before2Img} 
        alt="Before" 
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-[2500ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isVisible ? 'opacity-0 scale-95 blur-md' : 'opacity-100 scale-100 blur-0'
        }`}
      />
      
      {/* After Media (The Video fading in) */}
      <video 
        autoPlay loop muted playsInline preload="auto"
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-[2500ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isVisible ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-110 blur-sm'
        }`}
      >
        <source src="/after2.webm" type="video/webm" />
      </video>
      
      {/* Minimalist Observer Status */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
        <div className={`px-4 py-2 text-[10px] tracking-widest uppercase rounded transition-all duration-1000 ${!isVisible ? 'bg-black/80 text-white' : 'bg-transparent text-transparent'}`}>
          {t('spaces.03.before')}
        </div>
        <div className={`px-4 py-2 text-[10px] tracking-widest uppercase rounded transition-all duration-1000 ${isVisible ? 'bg-black/80 text-white' : 'bg-transparent text-transparent'}`}>
          {t('spaces.03.after')}
        </div>
      </div>
    </div>
  );
}


// =========================================================================
// MAIN COMPONENT EXPORT
// =========================================================================
export default function BeforeAfterShowcase() {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-[#FAF9F6] dark:bg-[#111111] py-32 px-6 md:px-12 font-sans border-t border-gray-200 dark:border-stone-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-48">
        
        {/* Intro Header */}
        <div className="text-center space-y-6">
          <h3 className="text-xs text-amber-600 tracking-[0.3em] font-semibold uppercase">{t('spaces.hero.subtitle')}</h3>
          <h2 className="text-5xl md:text-7xl font-serif text-[#1A1A1C] dark:text-white transition-colors duration-500">{t('spaces.hero.title')}</h2>
          <p className="text-gray-500 dark:text-stone-400 font-light text-lg max-w-2xl mx-auto transition-colors duration-500">
            {t('spaces.hero.desc')}
          </p>
        </div>

        {/* Showcase 1 */}
        <div className="space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-center">
            <div className="lg:col-span-1 flex flex-col justify-center h-full space-y-4 pr-4">
              <h3 className="text-xs text-amber-600 tracking-[0.3em] font-semibold uppercase">{t('spaces.01.subtitle')}</h3>
              <h4 className="text-3xl font-serif text-[#1A1A1C] dark:text-white transition-colors duration-500">{t('spaces.01.title')}</h4>
              <p className="text-gray-500 dark:text-stone-400 font-light leading-relaxed transition-colors duration-500">
                {t('spaces.01.desc')}
              </p>
            </div>
            <div className="lg:col-span-3">
              <BlueprintSlider />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-200 dark:bg-stone-800 max-w-3xl mx-auto transition-colors duration-500"></div>

        {/* Showcase 2 */}
        <div className="space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-center">
            <div className="lg:col-span-3 order-2 lg:order-1">
              <HoverLens />
            </div>
            <div className="lg:col-span-1 flex flex-col justify-center h-full space-y-4 pl-4 order-1 lg:order-2">
              <h3 className="text-xs text-amber-600 tracking-[0.3em] font-semibold uppercase">{t('spaces.02.subtitle')}</h3>
              <h4 className="text-3xl font-serif text-[#1A1A1C] dark:text-white transition-colors duration-500">{t('spaces.02.title')}</h4>
              <p className="text-gray-500 dark:text-stone-400 font-light leading-relaxed transition-colors duration-500">
                {t('spaces.02.desc')}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-200 dark:bg-stone-800 max-w-3xl mx-auto transition-colors duration-500"></div>

        {/* Showcase 3 */}
        <div className="space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-center">
            <div className="lg:col-span-1 flex flex-col justify-center h-full space-y-4 pr-4">
              <h3 className="text-xs text-amber-600 tracking-[0.3em] font-semibold uppercase">{t('spaces.03.subtitle')}</h3>
              <h4 className="text-3xl font-serif text-[#1A1A1C] dark:text-white transition-colors duration-500">{t('spaces.03.title')}</h4>
              <p className="text-gray-500 dark:text-stone-400 font-light leading-relaxed transition-colors duration-500">
                {t('spaces.03.desc')}
              </p>
            </div>
            <div className="lg:col-span-3">
              <ScrollFade />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
