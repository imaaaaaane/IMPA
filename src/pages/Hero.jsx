import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CinematicImage from '../components/CinematicImage';
import { supabase } from '../supabase';

export default function Hero() {
  const { t } = useTranslation();
  const [heroImageUrl, setHeroImageUrl] = useState('/heroimage.png');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('setting_value')
          .eq('setting_key', 'hero_image_url')
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching hero image:', error);
        } else if (data && data.setting_value) {
          setHeroImageUrl(data.setting_value);
        }
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
      <CinematicImage 
        src={heroImageUrl} 
        alt="IMPA Hero" 
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 ${loading ? 'opacity-50' : 'opacity-100'}`} 
        durationClass="duration-[6000ms]" 
        finalBrightness="brightness-100"
      />

      {/* 2. The Smooth Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 pointer-events-none"></div>

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