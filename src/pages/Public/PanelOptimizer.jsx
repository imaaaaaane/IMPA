import React, { useState } from 'react';

export default function PanelOptimizer() {
  const [otoYon, setOtoYon] = useState(true);

  // The precise CSS pattern for the graph paper (millimeter grid effect)
  const graphPaperStyle = {
    backgroundColor: '#f9fafb',
    backgroundImage: `
      linear-gradient(to right, #e5e7eb 1px, transparent 1px),
      linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
    `,
    backgroundSize: '20px 20px',
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* 1. Global Layout & Header */}
      <header className="w-full bg-[#1a4731] p-6 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-white font-bold text-2xl">Plaka Kesim Optimizasyonu (Pro)</h1>
          <p className="text-emerald-100/80 text-sm mt-1">Gelişmiş fire ve kesim planı hesaplama modülü</p>
        </div>
        <button className="mt-4 md:mt-0 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded transition-colors text-sm font-medium border border-white/20">
          MAS AĞAÇ APP
        </button>
      </header>

      {/* 2. Main Body Grid */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* 3. Left Sidebar (Inputs Form) */}
          <div className="col-span-12 md:col-span-4 bg-white rounded-xl shadow-sm p-6 flex flex-col gap-5 border border-gray-100">
            
            {/* Field 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ana Plaka Ebadı (cm)</label>
              <select className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a4731] text-gray-900 font-medium">
                <option>280 x 210 (Standart MDF)</option>
                <option>366 x 183</option>
              </select>
            </div>

            {/* Field 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kesilecek İstenen Parça (cm)</label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <span className="text-xs text-gray-500 mb-1 block">En</span>
                  <input type="number" defaultValue="40" className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a4731] font-medium" />
                </div>
                <div className="flex-1">
                  <span className="text-xs text-gray-500 mb-1 block">Boy</span>
                  <input type="number" defaultValue="80" className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a4731] font-medium" />
                </div>
              </div>
            </div>

            {/* Field 3 */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">İhtiyaç Adedi</label>
                <input type="number" defaultValue="27" className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a4731] font-medium" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bıçak Payı / Kerf (mm)</label>
                <input type="number" defaultValue="4" className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a4731] font-medium" />
              </div>
            </div>

            {/* Field 4 (Toggle) */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-medium text-gray-700">Parçayı Döndür (Oto-Yön)</span>
              <button 
                type="button" 
                onClick={() => setOtoYon(!otoYon)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a4731] ${otoYon ? 'bg-[#1a4731]' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${otoYon ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Submit Button */}
            <button className="w-full bg-[#D4A373] hover:bg-[#c39162] text-white font-bold py-3 rounded-lg mt-4 transition-colors shadow-sm text-lg">
              Kesimi Optimize Et
            </button>
          </div>

          {/* 4. Right Main Area (Stats & Visualizer) */}
          <div className="col-span-12 md:col-span-8 flex flex-col gap-6">
            
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Card 1 */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-gray-400 tracking-wider mb-2">GEREKEN PLAKA</span>
                <span className="text-5xl font-black text-gray-800">2</span>
              </div>
              
              {/* Card 2 */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-gray-400 tracking-wider mb-2">1 PLAKADAN ÇIKAN</span>
                <span className="text-5xl font-black text-gray-800">27</span>
              </div>

              {/* Card 3 */}
              <div className="bg-[#1a4731] p-6 rounded-xl shadow-sm border border-[#143a28] flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-emerald-200/60 tracking-wider mb-2">VERİMLİLİK</span>
                <span className="text-5xl font-black text-white">%96.7</span>
              </div>
            </div>

            {/* 5. Visualizer Canvas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-800 font-bold">Kesim Şeması (Tabaka 1)</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">280x210 cm</span>
              </div>
              
              {/* Graph Paper Background Area */}
              <div 
                className="w-full aspect-[4/3] rounded-lg border-2 border-dashed border-gray-300 relative overflow-hidden flex items-center justify-center p-8"
                style={graphPaperStyle}
              >
                {/* The Cut Pieces (Main Board Representation) */}
                {/* 2800 / 2100 ratio board container */}
                <div className="w-[85%] aspect-[4/3] bg-gray-200 border border-gray-400 shadow flex flex-wrap content-start gap-[2px] p-[2px]">
                  
                  {/* Generated Pieces - exactly simulating blade kerf with CSS gaps */}
                  {Array.from({ length: 27 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="bg-[#1a4731] w-[calc(20%-1.6px)] h-[calc(14.28%-1.71px)] rounded-sm hover:opacity-90 cursor-pointer flex items-center justify-center transition-opacity"
                    >
                      <span className="text-white/40 text-[10px] font-mono">40x80</span>
                    </div>
                  ))}
                  
                  {/* Bottom Wastage Area visually represented */}
                  <div className="bg-amber-100/50 w-[100%] flex-1 rounded-sm border border-amber-200 border-dashed mt-auto flex items-center justify-center">
                    <span className="text-amber-600/50 text-xs font-bold">FİRE (WASTAGE)</span>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
