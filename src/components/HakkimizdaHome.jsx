import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HakkimizdaHome() {
  const { t } = useTranslation();

  return (

    <section className="relative z-20 w-screen max-w-none left-1/2 -translate-x-1/2 bg-[#FAF9F6] dark:bg-[#111111] transition-colors duration-500 pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* Text Side */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="italic text-lg md:text-xl text-gray-700 dark:text-stone-400 leading-relaxed font-serif max-w-full mb-12 transition-colors duration-500"
          >
            {t('aboutHomeDesc')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
          >
            <Link
              to="/about"
              className="bg-[#1A1A1C] dark:bg-white text-white dark:text-[#1A1A1C] px-10 py-4 text-xs md:text-sm uppercase tracking-widest hover:bg-white dark:hover:bg-stone-200 hover:text-[#1A1A1C] dark:hover:text-[#1A1A1C] border border-[#1A1A1C] dark:border-white transition-all duration-500 rounded-full inline-block shadow-lg"
            >
              {t('homeHeroBtn')}
            </Link>
          </motion.div>
        </div>

        {/* Media Side */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.4 }}
        >
          <video
            src="/src/assets/hero-video2.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="rounded-[2rem] shadow-2xl w-full h-[400px] object-cover"
          />
        </motion.div>

      </div>

      {/* Animated Scroll Arrow */}
      <div className="flex justify-center mt-16 pb-8 animate-bounce opacity-60">
        <svg className="w-6 h-6 text-gray-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
}