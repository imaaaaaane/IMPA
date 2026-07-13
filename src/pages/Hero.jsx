import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-start bg-black">

      {/* Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/hero-video.mp4"
      />

     
      <div className="relative z-10 flex flex-col items-start px-6 md:px-16 lg:px-24 mt-20 fade-in-up max-w-5xl">

       
        <div className="text-[#1A1A1A] text-xs tracking-[0.2em] uppercase mb-6 flex items-center justify-start gap-4 bg-white/90 py-2 px-6 rounded-full drop-shadow-xl backdrop-blur-sm">
          <span className="w-8 h-[1px] bg-black/50"></span>
          {t('estBadge')}
        </div>

      
        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] text-white font-serif tracking-tight leading-[1.1] mb-12 drop-shadow-[0_5px_15px_rgba(0,0,0,0.4)] text-left">
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

    </section>
  );
}