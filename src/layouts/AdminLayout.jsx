import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Package, Mail, Scissors, Settings, LogOut } from 'lucide-react';
import { supabase } from '../utils/supabase';

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-[#7A1D2D] selection:text-white">
      
      {/* Sidebar - Neo-Minimalist Light */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 z-20 print:hidden">
        
        {/* Logo Section */}
        <div className="pt-8 pb-8 px-8 flex flex-col items-center justify-center">
          <img src="/impalogo2.webp" alt="IMPA Admin Logo" className="h-16 w-auto object-contain" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-[#7A1D2D] text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <LayoutDashboard size={16} strokeWidth={isActive ? 2.5 : 2} />
                Genel Bakış
              </>
            )}
          </NavLink>
          
          <NavLink
            to="/admin/projects"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-[#7A1D2D] text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <FolderKanban size={16} strokeWidth={isActive ? 2.5 : 2} />
                Projeler
              </>
            )}
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-[#7A1D2D] text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Package size={16} strokeWidth={isActive ? 2.5 : 2} />
                Ürünler
              </>
            )}
          </NavLink>

          <NavLink
            to="/admin/messages"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-[#7A1D2D] text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Mail size={16} strokeWidth={isActive ? 2.5 : 2} />
                Mesajlar
              </>
            )}
          </NavLink>

          <NavLink
            to="/admin/ebatlama"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-[#7A1D2D] text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Scissors size={16} strokeWidth={isActive ? 2.5 : 2} />
                Kesim Siparişleri
              </>
            )}
          </NavLink>

          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-[#7A1D2D] text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Settings size={16} strokeWidth={isActive ? 2.5 : 2} />
                Site Ayarları
              </>
            )}
          </NavLink>
        </nav>

        {/* Footer / Logout */}
        <div className="p-4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
          >
            <LogOut size={16} strokeWidth={2} />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 print:ml-0 min-h-screen flex flex-col items-center">
        {/* Minimal Header */}
        <header className="w-full max-w-6xl h-20 flex items-center justify-end px-8 print:hidden">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-900 group-hover:text-black transition-colors">IMPA ADMIN</span>
              <span className="text-xs text-gray-400 font-medium tracking-wide">Yönetici</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-sm text-[#7A1D2D] group-hover:border-[#7A1D2D]/30 group-hover:bg-[#7A1D2D]/5 transition-all">
              I
            </div>
          </div>
        </header>

        {/* Floating Content Card */}
        <div className="w-full max-w-6xl px-8 pb-12 print:px-0 print:pb-0 print:max-w-none flex-1 flex flex-col">
          <div className="flex-1 bg-white border border-gray-200 print:border-none rounded-xl print:rounded-none shadow-sm print:shadow-none overflow-hidden flex flex-col">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
