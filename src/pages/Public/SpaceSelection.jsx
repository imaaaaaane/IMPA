import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BeforeAfterShowcase from '../../components/BeforeAfterShowcase';

import { useTranslation } from 'react-i18next';

const spacesData = [
  { id: 1, titleKey: 'livingRoom', video: '/livingroom.mp4' },
  { id: 2, titleKey: 'bathroom', video: '/bathroom.mp4' },
  { id: 3, titleKey: 'bedroom', video: '/bedroom.mp4' },
  { id: 4, titleKey: 'kitchen', video: '/kitchen.mp4' },
  { id: 5, titleKey: 'wholeHouse', video: '/tumev.mp4' }
];

const processSteps = [
  {
    id: 1,
    number: '01.',
    keyPrefix: 'step1',
    type: 'image',
    src: '/architectconsultatio.jpg'
  },
  {
    id: 2,
    number: '02.',
    keyPrefix: 'step2',
    type: 'video',
    src: '/architectplan.mp4'
  },
  {
    id: 3,
    number: '03.',
    keyPrefix: 'step3',
    type: 'video',
    src: '/architectwork.mp4'
  }
];
export default function SpaceSelection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#FAF9F6] dark:bg-[#111111] transition-colors duration-500 font-sans min-h-screen">
      
      {/* 1. Full Screen Gallery Section */}
      {/* pt-[140px] ensures the global Navbar sits entirely on the clean bg-[#FAF9F6] background without overlapping the videos */}
      <section className="pt-[140px] px-4 pb-6 w-full">
        {/* The height is explicitly calculated to fill exactly the remaining screen space (100vh - 140px padding - 24px bottom padding) */}
        <div className="h-[calc(100vh-164px)] min-h-[500px] w-full flex flex-row gap-1 bg-[#FAF9F6] dark:bg-[#111111] transition-colors duration-500 rounded-2xl overflow-hidden shadow-lg shadow-black/5">
          {spacesData.map((space) => (
            <div 
              key={space.id} 
              onClick={() => navigate('/randevu', { state: { selectedSpace: t(`spaces.${space.titleKey}`) } })}
              className="relative flex-1 group cursor-pointer overflow-hidden transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] hover:flex-[4] lg:hover:flex-[5]"
            >
              {/* Background Video (Locked to z-0, fully contained by absolute inset-0 and object-cover) */}
              <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                src={space.video}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105 z-0"
              />
              
              {/* Warm Overlay (Safely stacked on top of video at z-10) */}
              <div className="absolute inset-0 bg-stone-900/40 dark:bg-stone-900/60 transition-colors duration-[800ms] ease-in-out group-hover:bg-stone-900/10 dark:group-hover:bg-stone-900/20 z-10"></div>
              
              {/* Vertical Text (Safely stacked on top of everything at z-20) */}
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-[#FAF9F6] tracking-[0.2em] whitespace-nowrap drop-shadow-md transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] -rotate-90 group-hover:rotate-0">
                  {t(`spaces.${space.titleKey}`)}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Scrollable Details & Process Section */}
      <section className="py-24 px-6 md:px-12 max-w-[90rem] mx-auto w-full">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <h3 className="text-xs text-amber-600 font-semibold tracking-[0.3em] uppercase mb-4">{t('spaces.processSubtitle')}</h3>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1A1A1C] dark:text-white transition-colors duration-500">{t('spaces.processTitle')}</h2>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10 mb-32">
          {processSteps.map((step) => (
            <div key={step.id} className="group cursor-pointer">
              <div className="relative aspect-square md:aspect-[4/5] rounded-2xl overflow-hidden mb-8 shadow-md">
                {step.type === 'video' ? (
                  <video 
                    src={step.src} 
                    autoPlay loop muted playsInline
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                  />
                ) : (
                  <img 
                    src={step.src} 
                    alt={step.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                  />
                )}
              </div>
              <div className="flex gap-4 items-start">
                <span className="text-2xl md:text-3xl font-serif text-gray-300 group-hover:text-amber-600 transition-colors duration-500">
                  {step.number}
                </span>
                <div>
                  <h4 className="text-xl md:text-2xl font-serif text-[#1A1A1C] dark:text-white transition-colors duration-500 mb-3">{t(`spaces.${step.keyPrefix}Title`)}</h4>
                  <p className="text-gray-500 dark:text-stone-400 transition-colors duration-500 font-light leading-relaxed">{t(`spaces.${step.keyPrefix}Desc`)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* 3. Epic Before & After Showcase */}
      <BeforeAfterShowcase />

    </div>
  );
}
