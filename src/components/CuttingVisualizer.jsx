import React from 'react';

const CuttingVisualizer = ({ activeRows = [], selectedPlaka = '2800x2100', otoYon = true }) => {
  // Filter out unselected/empty rows for the visualizer
  const validRows = activeRows.filter(p => p.boy && p.en && p.adet && parseFloat(p.boy) > 0 && parseFloat(p.en) > 0 && parseInt(p.adet) > 0);

  // If no parts are added, show the elegant empty state
  if (validRows.length === 0) {
    return (
      <div className="bg-[#ffffff] rounded-xl shadow-sm border border-[#e5e7eb] p-12 text-center mt-8">
        <svg className="w-16 h-16 mx-auto text-[#d1d5db] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <h3 className="text-[#111827] font-semibold text-lg">Parça Eklenmedi</h3>
        <p className="text-[#6b7280] mt-2">Optimizasyon planını görüntülemek için lütfen tabloya parça ekleyiniz.</p>
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

  // 2D Bin Packing (Guillotine Split / Best Area Fit)
  const padding = 3;
  const tabakalar = []; // Array of boards: { pieces: [], freeRects: [] }

  const allPieces = [];
  validRows.forEach((row, rowIndex) => {
    const boy = parseFloat(row.boy);
    const en = parseFloat(row.en);
    const adet = parseInt(row.adet);
    for (let i = 0; i < adet; i++) {
      allPieces.push({ id: `${rowIndex}-${i}`, w: boy, h: en, label: `${boy}x${en}` });
    }
  });

  // Sort by area descending (largest pieces first)
  allPieces.sort((a, b) => (b.w * b.h) - (a.w * a.h));

  allPieces.forEach(piece => {
    let bestBoardIndex = -1;
    let bestRectIndex = -1;
    let bestShortSideFit = Infinity;
    let bestAreaFit = Infinity;
    let bestFitW = 0;
    let bestFitH = 0;

    // Best Short Side Fit (BSSF)
    for (let bIndex = 0; bIndex < tabakalar.length; bIndex++) {
      const board = tabakalar[bIndex];
      for (let rIndex = 0; rIndex < board.freeRects.length; rIndex++) {
        const rect = board.freeRects[rIndex];
        
        const tryFit = (w, h) => {
          if (w <= rect.w && h <= rect.h) {
            const leftoverW = Math.abs(rect.w - w);
            const leftoverH = Math.abs(rect.h - h);
            const shortSide = Math.min(leftoverW, leftoverH);
            const areaFit = (rect.w * rect.h) - (w * h);

            if (shortSide < bestShortSideFit || (shortSide === bestShortSideFit && areaFit < bestAreaFit)) {
              bestShortSideFit = shortSide;
              bestAreaFit = areaFit;
              bestBoardIndex = bIndex;
              bestRectIndex = rIndex;
              bestFitW = w;
              bestFitH = h;
            }
          }
        };

        tryFit(piece.w, piece.h);
        if (otoYon && piece.w !== piece.h) {
          tryFit(piece.h, piece.w);
        }
      }
    }

    let boardToUse;
    let targetRect;

    if (bestBoardIndex !== -1) {
      boardToUse = tabakalar[bestBoardIndex];
      targetRect = boardToUse.freeRects[bestRectIndex];
    } else {
      // Create new board
      boardToUse = { 
        pieces: [], 
        freeRects: [{ x: 0, y: 0, w: PANEL_WIDTH, h: PANEL_HEIGHT }] 
      };
      tabakalar.push(boardToUse);
      targetRect = boardToUse.freeRects[0];

      bestFitW = piece.w;
      bestFitH = piece.h;
      if (otoYon && piece.h < piece.w && piece.h <= targetRect.w && piece.w <= targetRect.h) {
        bestFitW = piece.h;
        bestFitH = piece.w;
      }
    }

    const placedRect = {
      x: targetRect.x,
      y: targetRect.y,
      w: bestFitW,
      h: bestFitH
    };

    boardToUse.pieces.push({
      id: piece.id,
      x: placedRect.x,
      y: placedRect.y,
      w: placedRect.w,
      h: placedRect.h,
      label: `${placedRect.w}x${placedRect.h}`
    });

    // MaxRects Split Logic
    const newFreeRects = [];
    const paddedPlaced = {
      x: placedRect.x,
      y: placedRect.y,
      w: placedRect.w + padding,
      h: placedRect.h + padding
    };

    for (let i = 0; i < boardToUse.freeRects.length; i++) {
      const F = boardToUse.freeRects[i];
      
      // Check overlap with the newly placed piece (including padding)
      if (paddedPlaced.x < F.x + F.w && paddedPlaced.x + paddedPlaced.w > F.x &&
          paddedPlaced.y < F.y + F.h && paddedPlaced.y + paddedPlaced.h > F.y) {
        
        // Split Top
        if (paddedPlaced.y > F.y) {
          newFreeRects.push({ x: F.x, y: F.y, w: F.w, h: paddedPlaced.y - F.y });
        }
        // Split Bottom
        if (paddedPlaced.y + paddedPlaced.h < F.y + F.h) {
          newFreeRects.push({ x: F.x, y: paddedPlaced.y + paddedPlaced.h, w: F.w, h: (F.y + F.h) - (paddedPlaced.y + paddedPlaced.h) });
        }
        // Split Left
        if (paddedPlaced.x > F.x) {
          newFreeRects.push({ x: F.x, y: F.y, w: paddedPlaced.x - F.x, h: F.h });
        }
        // Split Right
        if (paddedPlaced.x + paddedPlaced.w < F.x + F.w) {
          newFreeRects.push({ x: paddedPlaced.x + paddedPlaced.w, y: F.y, w: (F.x + F.w) - (paddedPlaced.x + paddedPlaced.w), h: F.h });
        }
      } else {
        // No overlap, keep the free rect
        newFreeRects.push(F);
      }
    }

    // Prune enclosed free rects
    boardToUse.freeRects = [];
    for (let i = 0; i < newFreeRects.length; i++) {
      let isEnclosed = false;
      for (let j = 0; j < newFreeRects.length; j++) {
        if (i !== j) {
          const A = newFreeRects[i];
          const B = newFreeRects[j];
          if (A.x >= B.x && A.y >= B.y && A.x + A.w <= B.x + B.w && A.y + A.h <= B.y + B.h) {
            isEnclosed = true;
            break;
          }
        }
      }
      if (!isEnclosed) {
        boardToUse.freeRects.push(newFreeRects[i]);
      }
    }
  });

  const boardArea = PANEL_WIDTH * PANEL_HEIGHT;

  return (
    <div className="space-y-8 mt-8">
      {tabakalar.map((board, index) => {
        const tabakaNumber = index + 1;
        const piecesOnThisBoard = board.pieces;
        const piecesArea = piecesOnThisBoard.reduce((sum, piece) => sum + (piece.w * piece.h), 0);
        const calculatedFire = boardArea > 0 ? Math.max(0, 100 - ((piecesArea / boardArea) * 100)).toFixed(1) : "0.0";
        
        return (
          <div key={`tabaka-${tabakaNumber}`} className="bg-[#ffffff] rounded-xl shadow-sm border border-[#e5e7eb] p-8 relative">
            <div className="flex flex-col md:flex-row justify-between md:items-end mb-6 gap-4">
              <div>
                <h3 className="text-xl font-semibold text-[#1F2937] flex items-center gap-2">
                  <span className="bg-[#8B5A2B] text-[#ffffff] w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">{tabakaNumber}</span>
                  Kesim Şeması (Tabaka {tabakaNumber})
                </h3>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-sm text-[#6b7280] font-medium">Plaka: {PANEL_WIDTH} x {PANEL_HEIGHT} mm</p>
                  <span className="text-[#ef4444] font-medium">
                    Fire Oranı: %{calculatedFire}
                  </span>
                </div>
              </div>
              
              {/* Aesthetic Legend */}
              <div className="flex items-center gap-6 text-sm font-medium bg-[#f9fafb] px-4 py-3 rounded-lg border border-[#f3f4f6] shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-sm shadow-sm bg-[#7A918D]"></span>
                  <span className="text-[#374151]">İşlenen Parça</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-sm shadow-sm bg-[#E07A5F] opacity-50 border border-[#E07A5F] border-dashed"></span>
                  <span className="text-[#374151]">Fire Alanı</span>
                </div>
              </div>
            </div>

            {/* SVG Canvas with dynamic aspect ratio and professional graph background */}
            <div className="relative w-full aspect-[4/3] bg-[#ffffff] border-2 border-[#e5e7eb] rounded-xl overflow-hidden shadow-inner bg-[length:40px_40px] bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] flex items-center justify-center p-8">
              
              {/* The Guillotine Layout SVG acting as the Main Board (Plaka) */}
              <svg 
                viewBox={`0 0 ${PANEL_WIDTH} ${PANEL_HEIGHT}`} 
                className="w-full h-full shadow-md border-[6px] border-[#7A1D2D] bg-[#FFF0F0]"
                preserveAspectRatio="xMidYMid meet"
                style={{ 
                  backgroundImage: 'linear-gradient(#fecaca 2px, transparent 2px), linear-gradient(90deg, #fecaca 2px, transparent 2px)',
                  backgroundSize: '40px 40px' 
                }}
              >
                {/* Render Placed Pieces */}
                {piecesOnThisBoard.map((piece) => (
                  <g key={piece.id}>
                    <rect 
                      x={piece.x} 
                      y={piece.y} 
                      width={piece.w} 
                      height={piece.h} 
                      fill="#64827c" 
                      stroke="#ffffff"
                      strokeWidth={Math.max(10, PANEL_WIDTH / 200)} 
                    />
                    <text 
                      x={piece.x + piece.w / 2} 
                      y={piece.y + piece.h / 2} 
                      fill="#ffffff" 
                      fontSize={Math.min(piece.w / 5, piece.h / 2, 80)} 
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
            
            <div className="mt-4 text-xs text-[#9ca3af] text-right">
              * Görsel temsilidir. Gerçek kesim optimizasyonu üretim sürecinde belirlenir.
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CuttingVisualizer;
