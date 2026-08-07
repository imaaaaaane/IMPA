import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Building2, Box, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../supabase';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        if (data) {
          setProject(data);
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

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return supabase.storage.from('project-images').getPublicUrl(path).data.publicUrl;
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
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
        className="absolute top-8 left-8 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-gray-200 text-gray-900 hover:bg-white hover:scale-105 transition-all duration-300"
      >
        <ArrowLeft size={20} />
      </Link>

      {/* 1. Raw Hero Image Header */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden bg-gray-100"
      >
        {project.image_url ? (
          <img 
            src={getImageUrl(project.image_url)} 
            alt={project.title} 
            className="w-full h-full object-cover"
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
              className="flex flex-col"
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
              className="grid grid-cols-2 gap-4 md:gap-6"
            >
              {galleryImages.map((img, index) => {
                // Symmetrical Grid Pattern:
                // First image is a massive hero shot (col-span-2). 
                // All subsequent images are neat half-width squares (col-span-1).
                const isFullWidth = index === 0;
                
                return (
                  <motion.div 
                    key={index}
                    variants={fadeUp}
                    className={`overflow-hidden rounded-2xl shadow-sm bg-gray-200 group ${
                      isFullWidth ? 'col-span-2 aspect-video' : 'col-span-1 aspect-square md:aspect-[4/3] min-h-[250px]'
                    }`}
                  >
                    <img 
                      src={getImageUrl(img)} 
                      alt={`Gallery ${index}`} 
                      className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
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
          <Link 
            to="#" 
            className="group flex items-center gap-4 text-gray-900 hover:text-gray-500 transition-colors"
          >
            <span className="text-2xl md:text-4xl font-light tracking-tight">Sonraki Proje</span>
            <ArrowRight size={32} strokeWidth={1.5} className="group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
