import React from 'react';
import Hero from '../Hero';
import HakkimizdaHome from '../../components/HakkimizdaHome';
import Urunler from '../../components/Urunler';
import Projeler from '../../components/Projeler';
import Footer from '../../components/Footer';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  return (
    <main className="relative">
      <div className="sticky top-0 h-screen w-full z-0 overflow-hidden">
        <Hero />
      </div>
      <div className="relative z-10 bg-white dark:bg-[#111111] transition-colors duration-500">
        <HakkimizdaHome />
        <Projeler />
        <Urunler />
        <Footer />
      </div>
    </main>
  );
};

export default Home;