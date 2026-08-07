import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function PublicLayout() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/ebatlama';

  return (
    <div className="relative min-h-screen transition-colors duration-500 bg-white dark:bg-[#1A1A1C] text-[#1A1A1C] dark:text-[#FAF9F6]">
      {!hideNavbar && <Navbar />}
      <Outlet />
    </div>
  );
}
