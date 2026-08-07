/**
 * Strict Row-by-Row (Shelf) Bin Packing Algorithm
 * Ensures pieces never overflow the panel width by wrapping to the next row (shelf).
 * 
 * @param {number} panelWidth Max width of the panel (e.g., 2800)
 * @param {number} panelHeight Max height of the panel (e.g., 2100)
 * @param {Array} parts Array of requested part dimensions
 * @param {number} kerf Blade thickness (e.g., 3mm) to add to bounding boxes
 */
export function optimizeCuttingList(panelWidth, panelHeight, parts, kerf = 3) {
    let expandedParts = [];
    
    // 1. Expand parts based on requested quantity and add kerf to physical size
    parts.forEach(p => {
        let l = parseFloat(p.length);
        let w = parseFloat(p.width);
        let q = parseInt(p.quantity);
        if (!isNaN(l) && !isNaN(w) && !isNaN(q) && l > 0 && w > 0 && q > 0) {
            for (let i = 0; i < q; i++) {
                // If grain direction (suYonu) matters, strictly lock orientation
                let drawW, drawH;
                if (p.suYonu) {
                    drawW = l + kerf;
                    drawH = w + kerf;
                } else {
                    // Otherwise default to longest side as height for shelf stability
                    drawW = Math.min(l, w) + kerf;
                    drawH = Math.max(l, w) + kerf;
                }

                expandedParts.push({
                    id: `${p.id}-${i}`,
                    l, w,
                    drawW,
                    drawH,
                    label: p.partName || `${l}x${w}`,
                    area: (l + kerf) * (w + kerf),
                    suYonu: p.suYonu
                });
            }
        }
    });

    // 2. Sort by height descending (Shelf packing performs best sorted by height)
    expandedParts.sort((a, b) => b.drawH - a.drawH);

    let panels = [];
    let unplaced = [...expandedParts];

    // 3. Pack parts panel by panel using strict Row-by-Row boundaries
    while (unplaced.length > 0) {
        let items = [];
        let remaining = [];
        
        // Start a new panel
        let currentX = 0;
        let currentY = 0;
        let maxHeightOfCurrentRow = 0;

        for (let item of unplaced) {
            let placed = false;
            
            // Check if we can fit the piece on the CURRENT shelf/row (Normal orientation)
            if (currentX + item.drawW <= panelWidth && currentY + item.drawH <= panelHeight) {
                items.push({
                    ...item,
                    x: currentX,
                    y: currentY,
                    renderW: item.drawW - kerf,
                    renderH: item.drawH - kerf,
                    packW: item.drawW,
                    packH: item.drawH
                });
                currentX += item.drawW;
                maxHeightOfCurrentRow = Math.max(maxHeightOfCurrentRow, item.drawH);
                placed = true;
            } 
            // Check if we can fit the piece on the CURRENT shelf/row (Rotated orientation, only if grain doesn't matter)
            else if (!item.suYonu && currentX + item.drawH <= panelWidth && currentY + item.drawW <= panelHeight) {
                items.push({
                    ...item,
                    x: currentX,
                    y: currentY,
                    renderW: item.drawH - kerf,
                    renderH: item.drawW - kerf,
                    packW: item.drawH,
                    packH: item.drawW
                });
                currentX += item.drawH;
                maxHeightOfCurrentRow = Math.max(maxHeightOfCurrentRow, item.drawW);
                placed = true;
            } 
            // Try wrapping to the NEXT row (currentX = 0, currentY += maxHeight)
            else {
                let nextY = currentY + maxHeightOfCurrentRow;
                
                // Reset to new row and check normal orientation
                if (item.drawW <= panelWidth && nextY + item.drawH <= panelHeight) {
                    currentX = 0;
                    currentY = nextY;
                    maxHeightOfCurrentRow = item.drawH;
                    
                    items.push({
                        ...item,
                        x: currentX,
                        y: currentY,
                        renderW: item.drawW - kerf,
                        renderH: item.drawH - kerf,
                        packW: item.drawW,
                        packH: item.drawH
                    });
                    currentX += item.drawW;
                    placed = true;
                }
                // Check rotated orientation on new row, only if grain doesn't matter
                else if (!item.suYonu && item.drawH <= panelWidth && nextY + item.drawW <= panelHeight) {
                    currentX = 0;
                    currentY = nextY;
                    maxHeightOfCurrentRow = item.drawW;
                    
                    items.push({
                        ...item,
                        x: currentX,
                        y: currentY,
                        renderW: item.drawH - kerf,
                        renderH: item.drawW - kerf,
                        packW: item.drawH,
                        packH: item.drawW
                    });
                    currentX += item.drawH;
                    placed = true;
                }
            }

            // If it still doesn't fit on this panel, defer it to the next panel
            if (!placed) {
                remaining.push(item);
            }
        }

        panels.push({
            id: `panel-${panels.length + 1}`,
            items: items
        });
        unplaced = remaining;
    }

    // 4. Calculate exact physical metrics
    let totalCutAreaMm2 = 0;
    panels.forEach(p => {
        p.items.forEach(i => {
            totalCutAreaMm2 += (i.renderW * i.renderH);
        });
    });

    const totalPanelAreaMm2 = panels.length * panelWidth * panelHeight;
    const firePercentage = totalPanelAreaMm2 > 0 
        ? (((totalPanelAreaMm2 - totalCutAreaMm2) / totalPanelAreaMm2) * 100).toFixed(1)
        : 0;

    return {
        panels,
        totalPanels: panels.length,
        totalCutAreaM2: (totalCutAreaMm2 / 1000000).toFixed(2),
        firePercentage
    };
}
