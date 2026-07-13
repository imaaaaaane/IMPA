import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { projectsData } from '../data/projectsData';

const Projeler = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section id="projeler" className="py-24 bg-white dark:bg-[#111111] transition-colors duration-500 overflow-hidden">

      {/* L-Ktaba l-foqaniya */}
      <div className="max-w-[90rem] mx-auto px-8 md:px-16 mb-16">
        <div className="max-w-2xl">
          <span className="text-amber-600 dark:text-amber-500 font-semibold tracking-[0.3em] uppercase text-xs mb-4 block">
            {t('projeler.badge')}
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#1A1A1C] dark:text-white leading-tight mb-4 transition-colors duration-500">
            {t('projeler.title')}
          </h2>
          <p className="text-[#1A1A1C]/70 dark:text-stone-400 text-sm md:text-base transition-colors duration-500">
            {t('projeler.desc')}
          </p>
        </div>
      </div>

      {/* Container d-Scroll */}
      <div className="max-w-[90rem] mx-auto px-8 md:px-16">
        <div className="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-12 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {projectsData.map((project) => (
            <div
              key={project.id}
              onClick={() => navigate(`/proje/${project.id}`)}
              className="snap-start shrink-0 w-[270px] md:w-[320px] group cursor-pointer flex flex-col"
            >
              {/* L-Video awla T-tswira (Arched Image Container) */}
              <div className="w-full h-[400px] md:h-[450px] relative overflow-hidden rounded-t-[999px] rounded-b-xl border-2 border-[#1A1A1C] dark:border-white/20 shadow-sm group-hover:shadow-xl transition-all duration-500">
                {project.type === 'video' ? (
                  <video
                    src={project.media}
                    autoPlay loop muted playsInline
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                ) : (
                  <img
                    src={project.media}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                )}
              </div>

              {/* L-Ktaba (Text Content Below Image) */}
              <div className="p-6 flex flex-col items-center text-center">
                <span className="text-[9px] md:text-[10px] text-amber-600 dark:text-amber-500 font-bold tracking-[0.2em] uppercase mb-2 block">
                  {t(`projectsData.${project.id}.category`)}
                </span>
                <h3 className="text-lg md:text-xl font-serif text-gray-900 dark:text-white mb-3 leading-snug transition-colors duration-300 group-hover:text-amber-600 dark:group-hover:text-amber-500">
                  {t(`projectsData.${project.id}.title`)}
                </h3>

                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="h-[1px] w-5 bg-amber-500"></div>
                  <span className="text-[9px] tracking-[0.2em] text-gray-800 dark:text-stone-300 uppercase font-medium transition-colors duration-500">{t('projeler.btn')}</span>
                  <div className="h-[1px] w-5 bg-amber-500"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projeler;