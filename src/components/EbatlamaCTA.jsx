import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EbatlamaCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-stone-950 via-stone-900 to-emerald-950 text-white overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-900 rounded-full mix-blend-screen filter blur-[100px] opacity-30" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-stone-800 rounded-full mix-blend-screen filter blur-[100px] opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-16 h-16 bg-stone-800 rounded-2xl flex items-center justify-center mb-8 border border-stone-700 shadow-xl"
        >
          <Scissors size={32} className="text-emerald-500" />
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl font-light mb-6 tracking-tight"
        >
          Özel <span className="font-semibold text-emerald-500">Ebatlama ve Kesim</span> Hizmetleri
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10 font-light leading-relaxed"
        >
          B2B müşterilerimize özel, projelerinize tam uyum sağlayan hassas ahşap kesim ve ebatlama. 
          İhtiyacınız olan kesim listesini şimdi çevrimiçi olarak bize iletin, üretim sürecini hemen başlatalım.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link 
            to="/ebatlama" 
            className="group relative flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-full text-lg font-medium hover:scale-105 transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            Kesim Listesi Oluştur
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
