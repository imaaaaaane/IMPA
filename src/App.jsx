import React from "react";
import ProjeDetayi from './pages/ProjectDetails';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Public/Home";
import SpaceSelection from "./pages/Public/SpaceSelection";
import Randevu from "./pages/Public/Randevu";
import About from "./pages/About";
import SmoothScroll from "./components/SmoothScroll";

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScroll>
        <div className="relative min-h-screen transition-colors duration-500 bg-white dark:bg-[#1A1A1C] text-[#1A1A1C] dark:text-[#FAF9F6]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/spaces" element={<SpaceSelection />} />
          <Route path="/randevu" element={<Randevu />} />
          <Route path="/about" element={<About />} />
        </Routes>
        </div>
      </SmoothScroll>
    </BrowserRouter>
  );
}
