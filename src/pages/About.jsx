import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import FaaliyetAlanlari from '../components/FaaliyetAlanlari';

const AnimatedCurvedArrow = () => (
  <div className="flex justify-center py-8 opacity-40 pointer-events-none relative z-20">
    <svg
      className="w-10 h-10 text-gray-400 hover:opacity-100 transition-opacity duration-300 animate-bounce"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5c0 5 0 9-4 12" />
      <path d="M8 17l-3.5-3.5" />
      <path d="M8 17l4.5-2.5" />
    </svg>
  </div>
);

// Reusable animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F2EB] dark:bg-[#111111] text-[#1A1A1C] dark:text-white transition-colors duration-500 font-sans antialiased selection:bg-[#1A1A1A] selection:text-white relative overflow-hidden">

      {/* --- ANIMATED PLASTER + LIGHTER LUXE GREEN/BROWN LED EDGE GLOW --- */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <style>{`
          .bg-plaster-noise {
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          }
          
          /* L-LED d-Lisr: Alwan meftou7in chwiya */
          @keyframes ledPulseLeft {
            0% { background-color: rgba(74, 111, 84, 0); transform: scale(0.8) translate(-10%, 0); }
            30% { background-color: rgba(74, 111, 84, 0.55); transform: scale(1) translate(5%, 5%); } /* Sage Green */
            70% { background-color: rgba(166, 114, 65, 0.55); transform: scale(1.1) translate(10%, -5%); } /* Warm Oak Brown */
            100% { background-color: rgba(74, 111, 84, 0); transform: scale(0.8) translate(-10%, 0); }
          }
          
          /* L-LED d-Limin: T-tadadd f l-alwan */
          @keyframes ledPulseRight {
            0% { background-color: rgba(166, 114, 65, 0); transform: scale(0.9) translate(10%, 0); }
            30% { background-color: rgba(166, 114, 65, 0.55); transform: scale(1.1) translate(-5%, -5%); } /* Warm Oak Brown */
            70% { background-color: rgba(74, 111, 84, 0.55); transform: scale(1) translate(-10%, 5%); } /* Sage Green */
            100% { background-color: rgba(166, 114, 65, 0); transform: scale(0.9) translate(10%, 0); }
          }
          
          .led-edge-left {
            animation: ledPulseLeft 16s ease-in-out infinite;
          }
          .led-edge-right {
            animation: ledPulseRight 20s ease-in-out infinite;
          }
        `}</style>

        {/* The LED Edge Glows */}
        <div className="absolute top-[10%] left-[-20%] w-[50%] h-[80%] rounded-full filter blur-[100px] led-edge-left"></div>
        <div className="absolute top-[20%] right-[-20%] w-[50%] h-[80%] rounded-full filter blur-[100px] led-edge-right"></div>

        {/* Static Plaster Texture overlay */}
        <div className="absolute inset-0 bg-plaster-noise opacity-[0.05] mix-blend-multiply"></div>

        {/* Soften everything slightly */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>
      </div>
      {/* -------------------------------------------------- */}

      <div className="max-w-5xl mx-auto px-6 py-32 relative z-10">

        {/* --- SECTION A: Header & Intro --- */}
        <motion.section
          className="mb-12 md:mb-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <div className="flex flex-col" dir="auto">
            <motion.span variants={fadeInUp} className="text-xs md:text-sm tracking-[0.3em] font-medium uppercase text-gray-500 mb-8 block" dir="auto">
              {t('about.subtitle')}
            </motion.span>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-serif leading-tight mb-12 text-[#1A1A1C] dark:text-white transition-colors duration-500" dir="auto">
              {t('about.title')}
            </motion.h1>

            <div className="flex flex-col gap-6 md:text-lg text-gray-700 dark:text-stone-400 transition-colors duration-500 font-light leading-relaxed" dir="auto">
              <motion.p variants={fadeInUp} dir="auto">
                {t('about.intro1')}
              </motion.p>
              <motion.p variants={fadeInUp} dir="auto">
                {t('about.intro2')}
              </motion.p>
            </div>
          </div>

          <motion.div variants={fadeInUp} className="w-full h-full relative bg-gray-200 dark:bg-stone-800 rounded-[2rem]">
            <video src="/hakkimizda.webm" autoPlay loop muted playsInline className="rounded-[2rem] shadow-xl w-full h-full min-h-[400px] object-cover transition-transform duration-700 ease-out hover:scale-[1.03] hover:shadow-2xl cursor-pointer" />
          </motion.div>
        </motion.section>

        <AnimatedCurvedArrow />

        {/* --- SECTION B: Timeline Integration --- */}
        <motion.section
          className="mb-12 md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-serif text-[#1A1A1C] dark:text-white transition-colors duration-500 mb-6 text-center md:text-left" dir="auto">
            {t('about.activitiesTitle')}
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-700 dark:text-stone-400 transition-colors duration-500 font-light leading-relaxed md:text-lg max-w-3xl mb-12 text-center md:text-left" dir="auto">
            {t('about.activitiesDesc')}
          </motion.p>

          <motion.div variants={fadeInUp}>
            <FaaliyetAlanlari />
          </motion.div>
        </motion.section>

        <AnimatedCurvedArrow />

        {/* --- SECTION C: Production Power --- */}
        <motion.section
          className="mb-12 md:mb-16 border-t border-black/10 pt-12 md:pt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp} className="text-sm tracking-[0.3em] font-medium uppercase text-gray-500 mb-16 text-center" dir="auto">
            {t('about.productionTitle')}
          </motion.h2>

          <div className="flex flex-col gap-16 md:gap-24">

            <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-center">
              <motion.div variants={fadeInUp} className="w-full md:w-1/2">
                <img src="/src/assets/lakekapak.jpg" alt="İMPA Modüler" className="rounded-[2rem] shadow-lg w-full h-[500px] object-cover transition-transform duration-700 ease-out hover:scale-[1.03] hover:shadow-2xl cursor-pointer" />
              </motion.div>
              <motion.div variants={fadeInUp} className="w-full md:w-1/2 flex flex-col gap-6 text-gray-700 dark:text-stone-400 transition-colors duration-500 font-light leading-relaxed" dir="auto">
                <h3 className="text-2xl md:text-4xl font-serif text-[#1A1A1C] dark:text-white transition-colors duration-300 hover:text-amber-800" dir="auto">
                  {t('about.modulerTitle')}
                </h3>
                <p className="font-medium text-gray-900 dark:text-stone-300 transition-colors duration-500 text-lg" dir="auto">
                  {t('about.modulerDesc1')}
                </p>
                <p dir="auto">
                  {t('about.modulerDesc2')}
                </p>
              </motion.div>
            </div>

            <div className="flex flex-col md:flex-row-reverse gap-12 md:gap-16 items-center">
              <motion.div variants={fadeInUp} className="w-full md:w-1/2">
                <img src="/src/assets/lake-door.jpg" alt="İMPA Surface" className="rounded-[2rem] shadow-lg w-full h-[500px] object-cover transition-transform duration-700 ease-out hover:scale-[1.03] hover:shadow-2xl cursor-pointer" />
              </motion.div>
              <motion.div variants={fadeInUp} className="w-full md:w-1/2 flex flex-col gap-6 text-gray-700 dark:text-stone-400 transition-colors duration-500 font-light leading-relaxed" dir="auto">
                <h3 className="text-2xl md:text-4xl font-serif text-[#1A1A1C] dark:text-white transition-colors duration-300 hover:text-amber-800" dir="auto">
                  {t('about.surfaceTitle')}
                </h3>
                <p className="font-medium text-gray-900 dark:text-stone-300 transition-colors duration-500 text-lg" dir="auto">
                  {t('about.surfaceDesc1')}
                </p>
                <p dir="auto">
                  {t('about.surfaceDesc2')}
                </p>
                <blockquote className="border-l-[3px] border-[#1A1A1C] dark:border-white pl-6 py-2 mt-6 text-2xl font-serif italic text-black dark:text-white transition-colors duration-500" dir="auto">
                  {t('about.surfaceQuote')}
                </blockquote>
              </motion.div>
            </div>

          </div>
        </motion.section>

        <AnimatedCurvedArrow />

        {/* --- SECTION D: Core Values --- */}
        <motion.section
          className="mb-12 md:mb-16 bg-[#1A1A1C]/90 backdrop-blur-xl text-[#FAF9F6] p-12 md:p-16 rounded-[2.5rem] shadow-2xl border border-white/10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-serif mb-16 text-center" dir="auto">
            {t('about.whyTitle')}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {(t('about.reasons', { returnObjects: true }) || []).map((item, index) => (
              <motion.div key={index} variants={fadeInUp} className="flex items-start gap-4">
                <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center shrink-0 mt-[2px]">
                  <div className="w-1.5 h-1.5 bg-[#FAF9F6] rounded-full"></div>
                </div>
                <span className="text-sm md:text-base font-light tracking-wide text-white/90" dir="auto">
                  {item}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.p variants={fadeInUp} className="text-center font-serif text-xl md:text-2xl text-white/70 italic max-w-4xl mx-auto leading-relaxed" dir="auto">
            {t('about.whyQuote')}
          </motion.p>
        </motion.section>

        {/* --- SECTION E: Vision & Mission (Yin & Yang Luxury Cards) --- */}
        <motion.section
          className="mb-16 mt-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

            <motion.div variants={fadeInUp} className="relative p-10 md:p-16 bg-white/60 dark:bg-stone-900/60 backdrop-blur-lg rounded-[2rem] shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden group hover:-translate-y-2 transition-all duration-500 border border-white/50 dark:border-white/10">
              <div className="absolute -right-10 -bottom-16 text-[18rem] font-serif text-gray-100 select-none group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                V
              </div>
              <div className="relative z-10" dir="auto">
                <h3 className="text-2xl font-serif text-[#1A1A1C] dark:text-white transition-colors duration-500 mb-6 tracking-[0.2em] uppercase" dir="auto">
                  {t('about.visionTitle')}
                </h3>
                <div className="w-16 h-[2px] bg-gray-300 mb-8"></div>
                <p className="text-gray-600 dark:text-stone-400 transition-colors duration-500 leading-relaxed font-light text-lg" dir="auto">
                  {t('about.visionDesc')}
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="relative p-10 md:p-16 bg-[#1A1A1C]/90 backdrop-blur-lg rounded-[2rem] shadow-2xl shadow-black/20 overflow-hidden group hover:-translate-y-2 transition-transform duration-500 border border-gray-800">
              <div className="absolute -right-10 -bottom-16 text-[18rem] font-serif text-white/5 select-none group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                M
              </div>
              <div className="relative z-10" dir="auto">
                <h3 className="text-2xl font-serif text-white mb-6 tracking-[0.2em] uppercase" dir="auto">
                  {t('about.missionTitle')}
                </h3>
                <div className="w-16 h-[2px] bg-gray-500 mb-8"></div>
                <p className="text-gray-400 leading-relaxed font-light text-lg" dir="auto">
                  {t('about.missionDesc')}
                </p>
              </div>
            </motion.div>

          </div>
        </motion.section>

      </div>

      {/* FOOTER */}
      <footer className="py-12 px-8 md:px-16 border-t border-black/10 dark:border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-[0.2em] uppercase text-black/50 dark:text-white/50 transition-colors duration-500 relative z-10 bg-white/40 dark:bg-[#111111]/40 backdrop-blur-md">
        <div className="font-serif text-lg text-black dark:text-white transition-colors duration-500 mb-4 md:mb-0 tracking-[0.25em]">İMPA</div>
        <div>Batman, Türkiye — © 2003–2026 İMPA Holding A.Ş.</div>
        <div className="flex gap-8 mt-4 md:mt-0">
          <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-black dark:hover:text-white transition-colors">LinkedIn</a>
        </div>
      </footer>
    </div>
  );
}