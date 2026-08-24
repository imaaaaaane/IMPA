import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabase';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import CinematicImage from './CinematicImage';

const Projeler = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: direction === 'left' ? -400 : 400, behavior: 'smooth' });
    }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    
    // Fix legacy data: ensure we always request the compressed .webp version
    const optimizedPath = path.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    return supabase.storage.from('project-images').getPublicUrl(optimizedPath, {
      transform: { width: 1024, quality: 80 }
    }).data.publicUrl;
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) {
          setProjects(data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section id="projeler" className="py-24 bg-white dark:bg-[#111111] overflow-hidden">

      {/* Section Header */}
      <div className="max-w-[90rem] mx-auto px-8 md:px-16 mb-16">
        <div className="max-w-2xl">
          <span className="text-gray-500 font-medium tracking-[0.3em] uppercase text-xs mb-4 block">
            {t('projeler.badge')}
          </span>
          <h2 className="text-4xl md:text-5xl font-medium text-gray-900 dark:text-white leading-tight mb-4 transition-colors duration-500">
            {t('projeler.title')}
          </h2>
          <p className="text-gray-500 dark:text-stone-400 text-sm md:text-base transition-colors duration-500">
            {t('projeler.desc')}
          </p>
        </div>
      </div>

      {/* Grid Container */}
      <div className="max-w-[90rem] mx-auto px-8 md:px-16">
        {loading ? (
          <div className="w-full flex justify-center py-20 text-gray-500">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-4 h-4 border-2 border-gray-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
              Projeler Yükleniyor...
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="w-full flex justify-center py-20 text-gray-500 text-sm">Henüz proje eklenmemiş.</div>
        ) : (
          <>
            <div className="relative group/slider">
              {/* Left Arrow */}
              <button 
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black p-3 rounded-full shadow-lg backdrop-blur-sm opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 text-gray-800 dark:text-gray-200"
              >
                <ChevronLeft size={24} />
              </button>

              <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scroll-smooth hide-scrollbar transform-gpu will-change-transform"
              >
                {projects
                  .filter(project => project.image_url && project.image_url.trim() !== '')
                  .slice(0, 6)
                  .map((project, index) => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/proje/${project.id}`)}
                  className="bg-gray-50 dark:bg-stone-900 rounded-2xl overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow duration-300 flex flex-col min-w-[85vw] md:min-w-[400px] flex-shrink-0 snap-center transform-gpu"
                >
                  {/* Image Section */}
                  <div className="w-full relative bg-gray-200 dark:bg-stone-800 flex items-center justify-center">
                    <img 
                      loading={index < 2 ? "eager" : "lazy"} 
                      decoding="async"
                      width="800" 
                      height="600" 
                      src={getImageUrl(project.image_url)}
                      alt={project.title}
                      className="w-full h-[300px] md:h-[400px] object-cover rounded-xl"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="p-6 md:p-8 flex flex-col items-start flex-grow">
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-stone-400 mb-3 block">
                      {project.category || 'Mimari Tasarım'}
                    </span>
                    
                    <h3 className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                      {project.title}
                    </h3>
                    
                    {/* Push CTA to bottom if title is short */}
                    <div className="mt-auto pt-4 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-200 group-hover:text-gray-600 dark:group-hover:text-white transition-colors duration-300">
                      {t('projeler.btn') || 'Detayları İncele'}
                      <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
                ))}
              </div>

              {/* Right Arrow */}
              <button 
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black p-3 rounded-full shadow-lg backdrop-blur-sm opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 text-gray-800 dark:text-gray-200"
              >
                <ChevronRight size={24} />
              </button>
            </div>
            
            {/* View All Button */}
            <div className="mt-16 flex justify-center">
              <button 
                onClick={() => navigate('/projeler')}
                className="px-6 py-2 border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition-colors duration-300 dark:border-gray-200 dark:text-gray-200 dark:hover:bg-white dark:hover:text-black"
              >
                Tüm Projeleri Gör
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Projeler;