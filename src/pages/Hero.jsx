import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { supabase } from '../supabase';

export default function Hero() {
  const { t } = useTranslation();
  const [heroImageUrl, setHeroImageUrl] = useState('/heroimage.webp');
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Fallback: If image takes longer than 500ms to load, force the animation to start
    const timer = setTimeout(() => {
      setImageLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('setting_value')
          .eq('setting_key', 'hero_image_url')
          .single();
          
        let url = '/heroimage.webp';
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching hero image:', error);
        } else if (data && data.setting_value) {
          url = data.setting_value;
          // Apply on-the-fly Supabase compression if it's a Supabase URL
          if (url.includes('supabase.co')) {
            const separator = url.includes('?') ? '&' : '?';
            url = `${url}${separator}width=1920&quality=75`;
          }
        }
        
        setHeroImageUrl(url);
        
        // Dynamically inject preload link for critical above-the-fold image
        const preloadLink = document.createElement('link');
        preloadLink.href = url;
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.setAttribute('fetchpriority', 'high');
        document.head.appendChild(preloadLink);

      } catch (err) {
        console.error('Unexpected error fetching hero image:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroImage();
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 1. The Background Image */}
      <div className="absolute inset-0 w-full h-full bg-black overflow-hidden z-0">
        {heroImageUrl && (
          <>
            <img
              src={heroImageUrl}
              alt="IMPA Hero"
              fetchPriority="high"
              loading="eager"
              onLoad={() => setImageLoaded(true)}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* 10-Second Cinematic Reveal Overlay */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: imageLoaded ? 0 : 1 }}
              transition={{ duration: 10, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full bg-black pointer-events-none"
            />
          </>
        )}
      </div>

      {/* 3. The Content Container (FORCES TEXT TO THE BOTTOM) */}
      <div className="relative z-20 w-full h-full flex flex-col justify-end pb-20 px-8 md:px-16 fade-in-up">
        
        <div className="text-[#1A1A1A] text-xs tracking-[0.2em] uppercase mb-6 flex items-center justify-start gap-4 bg-white/90 py-2 px-6 rounded-full drop-shadow-xl backdrop-blur-sm w-fit">
          <span className="w-8 h-[1px] bg-black/50"></span>
          {t('estBadge')}
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] text-white font-serif tracking-tight leading-[1.1] mb-12 drop-shadow-[0_5px_15px_rgba(0,0,0,0.4)] text-left max-w-5xl">
          {t('homeHeroTitle1')}<br />
          <span className="italic opacity-90">{t('homeHeroTitle2')}</span>
        </h1>

      </div>

      <style>{`
        .fade-in-up {
          animation: fadeInUp 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}