import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BeforeAfterShowcase from '../../components/BeforeAfterShowcase';

const spacesData = [
  { id: 1, title: 'SALON', video: '/livingroom.mp4' },
  { id: 2, title: 'BANYO', video: '/bathroom.mp4' },
  { id: 3, title: 'YATAK ODASI', video: '/bedroom.mp4' },
  { id: 4, title: 'MUTFAK', video: '/kitchen.mp4' },
  { id: 5, title: 'TÜM EV', video: '/tumev.mp4' }
];

const processSteps = [
  {
    id: 1,
    number: '01.',
    title: 'Keşif & Analiz',
    desc: 'Beklentilerinizi dinliyor, alanınızı uzman mimarlarımızla yerinde analiz ediyoruz.',
    type: 'image',
    src: '/architectconsultatio.jpg'
  },
  {
    id: 2,
    number: '02.',
    title: '3D Modelleme',
    desc: 'Hayalinizdeki mekanı 3 boyutlu render teknolojimizle gerçeğe en yakın şekilde tasarlıyoruz.',
    type: 'video',
    src: '/architectplan.mp4'
  },
  {
    id: 3,
    number: '03.',
    title: 'Üretim & Teslimat',
    desc: 'Kendi fabrikamızda kusursuzca üretiyor ve profesyonel ekibimizle anahtar teslim kuruyoruz.',
    type: 'video',
    src: '/architectwork.mp4'
  }
];
export default function SpaceSelection() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#FAF9F6] font-sans min-h-screen">
      
      {/* 1. Full Screen Gallery Section */}
      {/* pt-[140px] ensures the global Navbar sits entirely on the clean bg-[#FAF9F6] background without overlapping the videos */}
      <section className="pt-[140px] px-4 pb-6 w-full">
        {/* The height is explicitly calculated to fill exactly the remaining screen space (100vh - 140px padding - 24px bottom padding) */}
        <div className="h-[calc(100vh-164px)] min-h-[500px] w-full flex flex-row gap-1 bg-[#FAF9F6] rounded-2xl overflow-hidden shadow-lg shadow-black/5">
          {spacesData.map((space) => (
            <div 
              key={space.id} 
              onClick={() => navigate('/randevu', { state: { selectedSpace: space.title } })}
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
              <div className="absolute inset-0 bg-stone-900/40 transition-colors duration-[800ms] ease-in-out group-hover:bg-stone-900/10 z-10"></div>
              
              {/* Vertical Text (Safely stacked on top of everything at z-20) */}
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-[#FAF9F6] tracking-[0.2em] whitespace-nowrap drop-shadow-md transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] -rotate-90 group-hover:rotate-0">
                  {space.title}
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
          <h3 className="text-xs text-amber-600 font-semibold tracking-[0.3em] uppercase mb-4">Sürecimiz</h3>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1A1A1C]">Nasıl Çalışıyoruz?</h2>
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
                  <h4 className="text-xl md:text-2xl font-serif text-[#1A1A1C] mb-3">{step.title}</h4>
                  <p className="text-gray-500 font-light leading-relaxed">{step.desc}</p>
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
