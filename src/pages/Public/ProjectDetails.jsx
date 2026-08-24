import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Building2, Box, Calendar, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../supabase';
import OptimizedImage from '../../components/OptimizedImage';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nextProjectId, setNextProjectId] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const [projectRes, allProjectsRes] = await Promise.all([
          supabase.from('projects').select('*').eq('id', id).single(),
          supabase.from('projects').select('id').order('created_at', { ascending: false })
        ]);

        if (projectRes.error) throw projectRes.error;
        if (projectRes.data) {
          setProject(projectRes.data);
          
          // Dynamically inject preload link for critical above-the-fold hero image
          if (projectRes.data.image_url) {
            let optimizedPath = projectRes.data.image_url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            const url = supabase.storage.from('project-images').getPublicUrl(optimizedPath, {
              transform: { width: 1920, quality: 80 }
            }).data.publicUrl;
            
            const preloadLink = document.createElement('link');
            preloadLink.href = url;
            preloadLink.rel = 'preload';
            preloadLink.as = 'image';
            document.head.appendChild(preloadLink);
          }
        }

        // Calculate Next Project ID
        const allProjects = allProjectsRes.data;
        if (allProjects && allProjects.length > 0) {
          const currentIndex = allProjects.findIndex(p => p.id === id);
          if (currentIndex !== -1) {
            const nextIndex = (currentIndex + 1) % allProjects.length;
            setNextProjectId(allProjects[nextIndex].id);
          }
        }
      } catch (error) {
        console.error('Error fetching project:', error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  // Scroll to top when navigating to a new project on the same route
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    
    // Fix legacy data: ensure we always request the compressed .webp version
    const optimizedPath = path.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    return supabase.storage.from('project-images').getPublicUrl(optimizedPath, {
      transform: { width: 1920, quality: 80 }
    }).data.publicUrl;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center gap-8">
        <h2 className="text-4xl font-medium text-gray-900">Proje Bulunamadı</h2>
        <Link to="/" className="text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors">
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  // Fallback images if gallery is empty
  const galleryImages = project.gallery && project.gallery.length > 0 
    ? project.gallery 
    : [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&fm=webp&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&fm=webp&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&fm=webp&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&fm=webp&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&fm=webp&fit=crop&w=800&q=80'
      ];

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans pb-32">
      
      {/* Floating Back Navigation */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-gray-200 text-gray-900 hover:bg-white hover:scale-105 transition-all duration-300 transform-gpu"
      >
        <ArrowLeft size={20} />
      </Link>

      {/* 1. Raw Hero Image Header */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden bg-gray-100 transform-gpu"
      >
        {project.image_url ? (
          <OptimizedImage 
            loading="eager" 
            src={getImageUrl(project.image_url)} 
            alt={project.title} 
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[10px] text-gray-400 uppercase tracking-[0.3em]">Görsel Yok</span>
          </div>
        )}
      </motion.div>

      {/* Main Content Layout - Sticky Sidebar Grid */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-16 lg:pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* 2. Left Column - Sticky Content */}
          <div className="lg:col-span-5 lg:sticky lg:top-12">
            <motion.div 
              initial="hidden" animate="visible" variants={fadeUp}
              className="flex flex-col transform-gpu"
            >
              <span className="block text-xs uppercase tracking-[0.2em] text-gray-400 font-medium mb-4">
                {project.category || 'Mimari Tasarım'}
              </span>
              <h1 className="text-4xl md:text-5xl font-medium text-gray-900 leading-tight mb-8">
                {project.title}
              </h1>
              
              {/* Framed Meta Data Cards */}
              <div className="flex flex-col gap-4 mb-10">
                {/* Client Card */}
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 flex items-center gap-5">
                   <div className="w-12 h-12 bg-gray-50 rounded-full flex-shrink-0 flex items-center justify-center text-gray-400">
                     <Building2 size={24} strokeWidth={1.2} />
                   </div>
                   <div className="flex flex-col">
                     <span className="text-sm font-semibold text-gray-900 mb-0.5">Müşteri</span>
                     <span className="italic text-gray-500 font-serif text-base">{project.client || 'Gizli Müşteri'}</span>
                   </div>
                </div>

                {/* Material Card */}
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 flex items-center gap-5">
                   <div className="w-12 h-12 bg-gray-50 rounded-full flex-shrink-0 flex items-center justify-center text-gray-400">
                     <Box size={24} strokeWidth={1.2} />
                   </div>
                   <div className="flex flex-col">
                     <span className="text-sm font-semibold text-gray-900 mb-0.5">Malzeme</span>
                     <span className="italic text-gray-500 font-serif text-base">{project.materials || 'Özel Yapım Paneller'}</span>
                   </div>
                </div>

                {/* Year Card */}
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 flex items-center gap-5">
                   <div className="w-12 h-12 bg-gray-50 rounded-full flex-shrink-0 flex items-center justify-center text-gray-400">
                     <Calendar size={24} strokeWidth={1.2} />
                   </div>
                   <div className="flex flex-col">
                     <span className="text-sm font-semibold text-gray-900 mb-0.5">Yıl</span>
                     <span className="italic text-gray-500 font-serif text-base">{project.year || new Date(project.created_at).getFullYear()}</span>
                   </div>
                </div>
              </div>

              <p className="text-lg md:text-xl font-light text-gray-700 leading-relaxed whitespace-pre-line mb-10">
                {project.description}
              </p>

            </motion.div>
          </div>

          {/* 3. Right Column - Scrolling Gallery */}
          <div className="lg:col-span-7">
            {/* Bento Box Gallery */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                visible: { transition: { staggerChildren: 0.15 } }
              }}
              className="grid grid-cols-2 gap-4 md:gap-6 transform-gpu"
            >
              {galleryImages.map((img, index) => {
                const isFullWidth = index === 0;
                
                return (
                  <motion.div 
                    key={index}
                    variants={fadeUp}
                    onClick={() => setLightboxIndex(index)}
                    className={`overflow-hidden rounded-2xl shadow-sm bg-gray-200 group transform-gpu cursor-pointer hover:opacity-90 transition-opacity duration-300 ${
                      isFullWidth ? 'col-span-2 aspect-video' : 'col-span-1 aspect-square md:aspect-[4/3] min-h-[250px]'
                    }`}
                  >
                    <OptimizedImage 
                      loading="lazy" 
                      src={getImageUrl(img)} 
                      alt={`Gallery ${index}`} 
                      className="w-full h-full group-hover:scale-105 transition-transform duration-700"
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Minimalist Sonraki Proje Navigation */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="mt-24 pt-8 border-t border-gray-200 flex justify-end"
        >
          {nextProjectId && (
            <Link 
              to={`/proje/${nextProjectId}`} 
              className="group flex items-center gap-4 text-gray-900 hover:text-gray-500 transition-colors"
            >
              <span className="text-2xl md:text-4xl font-light tracking-tight">Sonraki Proje</span>
              <ArrowRight size={32} strokeWidth={1.5} className="group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          )}
        </motion.div>
      </main>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-md"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 z-50"
            onClick={() => setLightboxIndex(null)}
          >
            <X size={40} strokeWidth={1.5} />
          </button>

          {/* Prev Button */}
          <button 
            className="absolute left-4 md:left-8 text-white/70 hover:text-white transition-colors p-2 z-50"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
            }}
          >
            <ArrowLeft size={48} strokeWidth={1.5} />
          </button>

          {/* Current Image */}
          <img 
            src={getImageUrl(galleryImages[lightboxIndex])} 
            alt="Gallery Fullscreen" 
            className="max-w-[90vw] max-h-[90vh] object-contain select-none"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next Button */}
          <button 
            className="absolute right-4 md:right-8 text-white/70 hover:text-white transition-colors p-2 z-50"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => (prev + 1) % galleryImages.length);
            }}
          >
            <ArrowRight size={48} strokeWidth={1.5} />
          </button>
        </div>
      )}
    </div>
  );
}
