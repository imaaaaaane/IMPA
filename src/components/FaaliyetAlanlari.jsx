import React from 'react';
import { useTranslation } from 'react-i18next';

export default function FaaliyetAlanlari() {
  const { t } = useTranslation();

  const activities = [
    { id: '01', key: 'raw' },
    { id: '02', key: 'mdf' },
    { id: '03', key: 'modular' },
    { id: '04', key: 'surface' }
  ];

  return (
    <section className="relative z-20 bg-[#FAF9F6] py-16 px-6 md:px-12 overflow-hidden">

      {/* CSS Animations */}
      <style>{`
        .timeline-line {
          transform-origin: top;
          animation: scaleYLine 2.5s ease-out forwards;
        }
        @keyframes scaleYLine {
          0% { transform: scaleY(0); }
          100% { transform: scaleY(1); }
        }
        .fade-in-right {
          opacity: 0;
          transform: translateX(30px);
          animation: fadeInRight 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeInRight {
          to { opacity: 1; transform: translateX(0); }
        }
        .pulse-dot {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(26, 26, 28, 0.15); }
          70% { box-shadow: 0 0 0 10px rgba(26, 26, 28, 0); }
          100% { box-shadow: 0 0 0 0 rgba(26, 26, 28, 0); }
        }
      `}</style>

      {/* Container m-qssom 3la 2 (Split-Screen) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* 1. J-Jiha d-L-Video (Media Side) */}
        <div className="relative w-full h-[400px] lg:h-[700px] rounded-[2rem] overflow-hidden shadow-2xl">
          <video
            src="/src/assets/fabric.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        </div>

        {/* 2. J-Jiha d-Timeline (Text Side) */}
        <div className="relative w-full py-8 lg:py-12">

          {/* L-Khet l-3amoudi (Main Vertical Line) */}
          <div className="absolute left-[11px] top-0 bottom-0 w-[1px] bg-gray-300 timeline-line"></div>

          <div className="flex flex-col space-y-12 lg:space-y-16">
            {activities.map((item, index) => {
              const delay = 0.3 + (index * 0.2); // Bash y-bano b-t-tartib

              return (
                <div
                  key={item.id}
                  className="relative pl-12 md:pl-20 fade-in-right"
                  style={{ animationDelay: `${delay}s` }}
                >
                  {/* Nqita (The Dot on the line) */}
                  <div className="absolute left-[7px] top-[10px] w-2.5 h-2.5 bg-[#1A1A1C] rounded-full pulse-dot"></div>

                  {/* L-Khet l-Ofoqi (Horizontal Branch) */}
                  <div className="absolute left-[19px] top-[14px] w-6 md:w-10 h-[1px] bg-gray-300"></div>

                  {/* L-Ktaba (Content) */}
                  <div>
                    <span className="text-[#1A1A1C] opacity-40 text-xs tracking-[0.25em] font-medium mb-2 block">
                      {item.id}
                    </span>
                    <h3 className="text-xl md:text-2xl font-serif text-[#1A1A1C] mb-3 tracking-wide leading-snug">
                      {t(`activities.${item.key}.title`)}
                    </h3>
                    <p className="text-gray-600 font-light leading-relaxed text-sm max-w-md">
                      {t(`activities.${item.key}.desc`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}