import React from 'react';

const CuttingVisualizer = ({ activeRows = [], selectedPlaka = '2800x2100', otoYon = true }) => {
  // Filter out unselected/empty rows for the visualizer
  const validRows = activeRows.filter(p => p.boy && p.en && p.adet && parseFloat(p.boy) > 0 && parseFloat(p.en) > 0 && parseInt(p.adet) > 0);

  // If no parts are added, show the elegant empty state
  if (validRows.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center mt-8">
        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <h3 className="text-gray-900 font-semibold text-lg">Parça Eklenmedi</h3>
        <p className="text-gray-500 mt-2">Optimizasyon planını görüntülemek için lütfen tabloya parça ekleyiniz.</p>
      </div>
    );
  }

  // Parse selectedPlaka
  let PANEL_WIDTH = 2800;
  let PANEL_HEIGHT = 2100;
  if (selectedPlaka && selectedPlaka !== 'Seçiniz') {
    const parts = selectedPlaka.split('x');
    if (parts.length === 2) {
      PANEL_WIDTH = parseInt(parts[0], 10);
      PANEL_HEIGHT = parseInt(parts[1], 10);
    }
  }

  // Calculate Total Used Area
  const usedArea = validRows.reduce((acc, row) => {
    return acc + (parseFloat(row.boy) * parseFloat(row.en) * parseInt(row.adet));
  }, 0);

  // Calculate Fire Oranı (Waste Percentage)
  const totalPanelArea = PANEL_WIDTH * PANEL_HEIGHT;
  const verimlilik = totalPanelArea > 0 ? ((usedArea / totalPanelArea) * 100) : 0;
  // Calculate fire rate correctly ensuring it doesn't go below 0
  const fireOrani = Math.max(0, (100 - verimlilik)).toFixed(1);

  // Linear stacking algorithm for visualization
  let currentX = 0;
  let currentY = 0;
  let maxHeightInRow = 0;
  const padding = 3;
  const placedPieces = [];

  validRows.forEach((row, rowIndex) => {
    const boy = parseFloat(row.boy);
    const en = parseFloat(row.en);
    const adet = parseInt(row.adet);

    for (let i = 0; i < adet; i++) {
      let pieceW = boy;
      let pieceH = en;

      if (otoYon) {
        // Optimize orientation to save horizontal space or if it doesn't fit horizontally
        if ((currentX + pieceW > PANEL_WIDTH && currentX + pieceH <= PANEL_WIDTH) || (pieceH < pieceW && currentX + pieceH <= PANEL_WIDTH)) {
          pieceW = en;
          pieceH = boy;
        }
      }

      if (currentX + pieceW > PANEL_WIDTH) {
        currentX = 0;
        currentY += maxHeightInRow + padding;
        maxHeightInRow = 0;
      }
      
      placedPieces.push({
        id: `${rowIndex}-${i}`,
        x: currentX,
        y: currentY,
        w: pieceW,
        h: pieceH,
        label: `${pieceW}x${pieceH}`
      });

      currentX += pieceW + padding;
      maxHeightInRow = Math.max(maxHeightInRow, pieceH);
    }
  });

  // Calculate the total area of the physical board (in mm^2)
  const boardArea = PANEL_WIDTH * PANEL_HEIGHT;

  // Only count pieces that physically fit on Tabaka 1
  const piecesOnThisBoard = placedPieces.filter(piece => piece.y + piece.h <= PANEL_HEIGHT);

  // Calculate the total area of all pieces currently placed in THIS specific board
  const piecesArea = piecesOnThisBoard.reduce((sum, piece) => sum + (piece.w * piece.h), 0);

  // Calculate the exact fire (waste) percentage for this board
  const calculatedFire = boardArea > 0 ? Math.max(0, 100 - ((piecesArea / boardArea) * 100)).toFixed(1) : "0.0";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mt-8">
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-6 gap-4">
        <div>
          <h3 className="text-xl font-semibold text-[#1F2937] flex items-center gap-2">
            <span className="bg-[#8B5A2B] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">4</span>
            Kesim Şeması (Tabaka 1)
          </h3>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-sm text-gray-500 font-medium">Seçili Plaka: {PANEL_WIDTH} x {PANEL_HEIGHT} mm</p>
            <span className="text-red-500 font-medium">
              Fire Oranı: %{calculatedFire}
            </span>
          </div>
        </div>
        
        {/* Aesthetic Legend */}
        <div className="flex items-center gap-6 text-sm font-medium bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-sm shadow-sm bg-[#7A918D]"></span>
            <span className="text-gray-700">İşlenen Parça</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-sm shadow-sm bg-[#E07A5F] opacity-50 border border-[#E07A5F] border-dashed"></span>
            <span className="text-gray-700">Fire Alanı</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas with dynamic aspect ratio and professional graph background */}
      <div className="relative w-full aspect-[4/3] bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-inner bg-[length:40px_40px] bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] flex items-center justify-center p-8">
        
        {/* The Guillotine Layout SVG acting as the Main Board (Plaka) */}
        <svg 
          viewBox={`0 0 ${PANEL_WIDTH} ${PANEL_HEIGHT}`} 
          className="w-full h-full shadow-md border-[6px] border-[#7A1D2D] bg-[#FFF0F0]"
          preserveAspectRatio="xMidYMid meet"
          style={{ 
            backgroundImage: 'linear-gradient(#fecaca 2px, transparent 2px), linear-gradient(90deg, #fecaca 2px, transparent 2px)',
            backgroundSize: '40px 40px' // Slightly larger grid for SVG view scale
          }}
        >
          {/* Render Placed Pieces (Solid background with crisp white border) */}
          {piecesOnThisBoard.map((piece) => (
            <g key={piece.id}>
              <rect 
                x={piece.x} 
                y={piece.y} 
                width={piece.w} 
                height={piece.h} 
                fill="#64827c" 
                stroke="#ffffff"
                strokeWidth={Math.max(10, PANEL_WIDTH / 200)} // Dynamic stroke width to ensure crisp white borders
              />
              <text 
                x={piece.x + piece.w / 2} 
                y={piece.y + piece.h / 2} 
                fill="#ffffff" 
                fontSize={Math.min(piece.w / 5, piece.h / 2, 80)} // Dynamic scaling for text fitting
                fontFamily="sans-serif"
                fontWeight="700"
                textAnchor="middle" 
                alignmentBaseline="middle"
              >
                {piece.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      
      <div className="mt-4 text-xs text-gray-400 text-right">
        * Görsel temsilidir. Gerçek kesim optimizasyonu üretim sürecinde belirlenir.
      </div>
    </div>
  );
};

export default CuttingVisualizer;
