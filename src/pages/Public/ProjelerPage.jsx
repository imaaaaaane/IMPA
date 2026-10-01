import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabase';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import ProgressiveImage from '../../components/ProgressiveImage';
import { motion } from 'framer-motion';

export default function ProjelerPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('order_index', { ascending: true });
        
        if (error) throw error;
        if (data) {
          setProjects(data);
        }
      } catch (err) {
        console.error('Error fetching projects:', err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
    window.scrollTo(0, 0);
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans pb-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-32 lg:pt-40">
        
        {/* Header Section */}
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp}
          className="mb-16 md:mb-24 flex flex-col items-start"
        >
          <Link 
            to="/" 
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Ana Sayfaya Dön
          </Link>
          <h1 className="text-5xl md:text-6xl font-medium text-gray-900 leading-tight tracking-tight mb-4">
            Tüm Projeler
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl">
            Tasarımdan uygulamaya kadar hayata geçirdiğimiz tüm mimari projelerimizi detaylı olarak inceleyebilirsiniz.
          </p>
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <div className="w-full flex justify-center py-20 text-gray-500">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
              Projeler Yükleniyor...
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="w-full flex justify-center py-20 text-gray-500 text-sm">
            Henüz proje eklenmemiş.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {projects.map((project) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                transition={{ duration: 0.6 }}
                key={project.id}
              >
                <Link 
                  to={`/proje/${project.id}`}
                  className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 transform-gpu"
                >
                  {/* Image Section */}
                  <div className="w-full relative aspect-[4/3] overflow-hidden bg-gray-100 flex items-center justify-center">
                    {project.image_url ? (
                      <ProgressiveImage 
                        bucket="project-images"
                        path={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        isThumbnail={true}
                      />
                    ) : (
                      <span className="text-[10px] text-gray-400 uppercase tracking-[0.3em]">Görsel Yok</span>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-6 md:p-8 flex flex-col items-start flex-grow">
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 mb-3 block">
                      {project.category || 'Mimari Tasarım'}
                    </span>
                    
                    <h3 className="text-xl font-medium text-gray-900 mb-4 transition-colors duration-300">
                      {project.title}
                    </h3>
                    
                    <div className="mt-auto pt-4 flex items-center gap-2 text-sm font-medium text-gray-900 group-hover:text-gray-500 transition-colors duration-300">
                      Detayları İncele
                      <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
