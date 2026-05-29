document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const inputHeights = document.getElementById('inputHeights');
  const btnCalculate = document.getElementById('btnCalculate');
  const presetsContainer = document.getElementById('presetsContainer');
  const statTotalWater = document.getElementById('statTotalWater');
  const statMaxHeight = document.getElementById('statMaxHeight');
  
  const tabCombined = document.getElementById('tabCombined');
  const tabWaterOnly = document.getElementById('tabWaterOnly');
  const vizSvg = document.getElementById('vizSvg');
  const svgContainer = document.getElementById('svgContainer');
  const svgGridGroup = document.getElementById('svgGridGroup');
  const svgColumnGroup = document.getElementById('svgColumnGroup');
  const svgOverlayGroup = document.getElementById('svgOverlayGroup');
  
  const hoverInfo = document.getElementById('hoverInfo');
  const tableBody = document.getElementById('tableBody');

  // --- State Configuration ---
  let heights = [0, 4, 0, 0, 0, 6, 0, 6, 4, 0];
  let activeTab = 'combined'; // 'combined' | 'waterOnly'
  let isDragging = false;
  let lastDraggedIndex = -1;

  // --- SVG Dimensions ---
  let svgWidth = 800;
  let svgHeight = 450;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 40;

  // Set initial SVG viewBox
  vizSvg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);

  // --- Trapping Rain Water Algorithm ---
  function calculateTrappedWater(arr) {
    const n = arr.length;
    if (n === 0) return { totalWater: 0, leftMax: [], rightMax: [], water: [] };

    const leftMax = new Array(n).fill(0);
    const rightMax = new Array(n).fill(0);
    const water = new Array(n).fill(0);

    // Fill left max array
    leftMax[0] = arr[0];
    for (let i = 1; i < n; i++) {
      leftMax[i] = Math.max(leftMax[i - 1], arr[i]);
    }

    // Fill right max array
    rightMax[n - 1] = arr[n - 1];
    for (let i = n - 2; i >= 0; i--) {
      rightMax[i] = Math.max(rightMax[i + 1], arr[i]);
    }

    // Calculate trapped water
    let totalWater = 0;
    for (let i = 0; i < n; i++) {
      const minHeight = Math.min(leftMax[i], rightMax[i]);
      water[i] = Math.max(0, minHeight - arr[i]);
      totalWater += water[i];
    }

    return { totalWater, leftMax, rightMax, water };
  }

  // --- Render Functions ---
  function renderAll() {
    const analysis = calculateTrappedWater(heights);
    
    // Update Stats
    statTotalWater.textContent = `${analysis.totalWater} Unit${analysis.totalWater !== 1 ? 's' : ''}`;
    const maxVal = Math.max(...heights, 0);
    statMaxHeight.textContent = `${maxVal} Block${maxVal !== 1 ? 's' : ''}`;

    // Update Table
    updateTraceTable(analysis);

    // Update SVG Visualization
    drawVisualization(analysis);
  }

  function updateTraceTable(analysis) {
    tableBody.innerHTML = '';
    
    for (let i = 0; i < heights.length; i++) {
      const row = document.createElement('tr');
      if (analysis.water[i] > 0) {
        row.classList.add('water-cell-active');
      }

      const minMax = Math.min(analysis.leftMax[i], analysis.rightMax[i]);

      row.innerHTML = `
        <td>${i}</td>
        <td class="block-cell">${heights[i]}</td>
        <td>${analysis.leftMax[i]}</td>
        <td>${analysis.rightMax[i]}</td>
        <td>${minMax}</td>
        <td class="water-cell">${analysis.water[i] > 0 ? analysis.water[i] : '-'}</td>
      `;
      tableBody.appendChild(row);
    }
  }

  function drawVisualization(analysis) {
    // Clear dynamic SVGs
    svgGridGroup.innerHTML = '';
    svgColumnGroup.innerHTML = '';
    svgOverlayGroup.innerHTML = '';

    const n = heights.length;
    if (n === 0) return;

    // Grid Scaling calculations
    // We want the grid height to scale to fit the max height, with at least 8 divisions
    const maxVal = Math.max(...heights, 0);
    const gridMaxHeight = Math.max(8, maxVal + 2); // Leave 2 units gap at the top

    const plotWidth = svgWidth - paddingLeft - paddingRight;
    const plotHeight = svgHeight - paddingTop - paddingBottom;
    
    const colWidth = plotWidth / n;
    const unitHeight = plotHeight / gridMaxHeight;

    // 1. Draw Grid Lines (Horizontal and Vertical)
    // Horizontal lines
    for (let h = 0; h <= gridMaxHeight; h++) {
      const y = svgHeight - paddingBottom - (h * unitHeight);
      const isBold = (h === 0 || h === gridMaxHeight || h % 5 === 0);
      
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', paddingLeft);
      line.setAttribute('y1', y);
      line.setAttribute('x2', svgWidth - paddingRight);
      line.setAttribute('y2', y);
      line.setAttribute('class', isBold ? 'grid-line-bold' : 'grid-line');
      svgGridGroup.appendChild(line);

      // Y-axis label text
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', paddingLeft - 10);
      text.setAttribute('y', y + 4);
      text.setAttribute('text-anchor', 'end');
      text.setAttribute('class', 'axis-text');
      text.textContent = h;
      svgGridGroup.appendChild(text);
    }

    // Vertical line labels (Index labels at bottom)
    for (let i = 0; i < n; i++) {
      const x = paddingLeft + (i * colWidth) + (colWidth / 2);
      const y = svgHeight - paddingBottom + 18;
      
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', y);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('class', 'axis-text');
      text.textContent = i;
      svgGridGroup.appendChild(text);
    }

    // 2. Draw Columns
    for (let i = 0; i < n; i++) {
      const x = paddingLeft + (i * colWidth);
      const hBlock = heights[i];
      const hWater = analysis.water[i];
      
      const blockPixelHeight = hBlock * unitHeight;
      const waterPixelHeight = hWater * unitHeight;
      
      const blockY = svgHeight - paddingBottom - blockPixelHeight;
      const waterY = blockY - waterPixelHeight;

      if (activeTab === 'combined') {
        // Render block if height > 0
        if (hBlock > 0) {
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('x', x + 1);
          rect.setAttribute('y', blockY);
          rect.setAttribute('width', colWidth - 2);
          rect.setAttribute('height', blockPixelHeight);
          rect.setAttribute('class', 'block-rect');
          rect.setAttribute('data-index', i);
          svgColumnGroup.appendChild(rect);
        }

        // Render water if water > 0
        if (hWater > 0) {
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('x', x + 1);
          rect.setAttribute('y', waterY);
          rect.setAttribute('width', colWidth - 2);
          rect.setAttribute('height', waterPixelHeight);
          rect.setAttribute('class', 'water-rect');
          rect.setAttribute('data-index', i);
          svgColumnGroup.appendChild(rect);
        }
      } else {
        // Water Only View: render only the water columns from bottom of the grid
        if (hWater > 0) {
          const waterBaseY = svgHeight - paddingBottom - waterPixelHeight;
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('x', x + 1);
          rect.setAttribute('y', waterBaseY);
          rect.setAttribute('width', colWidth - 2);
          rect.setAttribute('height', waterPixelHeight);
          rect.setAttribute('class', 'water-rect-pure');
          rect.setAttribute('data-index', i);
          svgColumnGroup.appendChild(rect);
        }
      }

      // 3. Draw Editor Guidelines / Helper overlays
      // Interactive/Hover zone overlay (full grid height)
      const overlayRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      overlayRect.setAttribute('x', x);
      overlayRect.setAttribute('y', paddingTop);
      overlayRect.setAttribute('width', colWidth);
      overlayRect.setAttribute('height', plotHeight);
      overlayRect.setAttribute('fill', 'transparent');
      overlayRect.setAttribute('class', 'interactive-col');
      overlayRect.setAttribute('data-index', i);
      
      // Hover effects & interaction bindings
      overlayRect.addEventListener('mouseenter', () => {
        hoverInfo.innerHTML = `Index: <strong>${i}</strong> | Block Height: <strong class="block-cell">${heights[i]}</strong> | Water: <strong class="water-cell">${hWater} Unit${hWater !== 1 ? 's' : ''}</strong>`;
        
        // Highlight corresponding block
        const blockNode = svgColumnGroup.querySelector(`.block-rect[data-index="${i}"]`);
        if (blockNode) blockNode.classList.add('hovered');
      });

      overlayRect.addEventListener('mouseleave', () => {
        hoverInfo.textContent = 'Hover over columns or drag to edit heights';
        const blockNode = svgColumnGroup.querySelector(`.block-rect[data-index="${i}"]`);
        if (blockNode) blockNode.classList.remove('hovered');
      });

      // Mouse events for click & drag editing
      overlayRect.addEventListener('mousedown', (e) => {
        isDragging = true;
        lastDraggedIndex = i;
        handleHeightEdit(e, i, plotHeight, gridMaxHeight);
      });

      overlayRect.addEventListener('mousemove', (e) => {
        if (isDragging && lastDraggedIndex === i) {
          handleHeightEdit(e, i, plotHeight, gridMaxHeight);
        }
      });

      svgOverlayGroup.appendChild(overlayRect);
    }
  }

  // --- Dynamic Heights Editor Logic ---
  function handleHeightEdit(event, index, plotHeight, gridMaxHeight) {
    const rect = vizSvg.getBoundingClientRect();
    
    // Calculate relative Y coordinate on SVG canvas
    const relativeY = event.clientY - rect.top;
    
    // Normalize Y relative to the plot height area
    const yFromBottom = (svgHeight - paddingBottom) - (relativeY * (svgHeight / rect.height));
    
    // Map to discrete height increments
    let newHeight = Math.round(yFromBottom / (plotHeight / gridMaxHeight));
    
    // Constrain height (between 0 and gridMaxHeight - 2)
    newHeight = Math.max(0, Math.min(newHeight, gridMaxHeight - 2));

    if (heights[index] !== newHeight) {
      heights[index] = newHeight;
      inputHeights.value = heights.join(',');
      renderAll();
    }
  }

  // Handle global mouseup to end drag state
  window.addEventListener('mouseup', () => {
    isDragging = false;
    lastDraggedIndex = -1;
  });

  // --- Handlers & Input Events ---
  function loadInputString(val) {
    const parsed = val.split(',')
      .map(item => parseInt(item.trim(), 10))
      .filter(item => !isNaN(item) && item >= 0);

    if (parsed.length > 0) {
      heights = parsed;
      renderAll();
    } else {
      alert("Invalid input format. Please enter a list of non-negative integers separated by commas.");
    }
  }

  btnCalculate.addEventListener('click', () => {
    loadInputString(inputHeights.value);
  });

  inputHeights.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      loadInputString(inputHeights.value);
    }
  });

  // Presets Click Handler
  presetsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-preset');
    if (!btn) return;

    // Set Active Preset Style
    document.querySelectorAll('.btn-preset').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const presetVal = btn.getAttribute('data-preset');
    if (presetVal === 'random') {
      // Generate a random map: 8 to 12 elements, heights between 0 and 7
      const len = Math.floor(Math.random() * 5) + 8; // 8-12
      const randomMap = Array.from({ length: len }, () => Math.floor(Math.random() * 7));
      inputHeights.value = randomMap.join(',');
      heights = randomMap;
      renderAll();
    } else {
      inputHeights.value = presetVal.slice(1, -1); // remove brackets
      loadInputString(inputHeights.value);
    }
  });

  // --- View Tab Switchers ---
  tabCombined.addEventListener('click', () => {
    tabCombined.classList.add('active');
    tabWaterOnly.classList.remove('active');
    activeTab = 'combined';
    renderAll();
  });

  tabWaterOnly.addEventListener('click', () => {
    tabWaterOnly.classList.add('active');
    tabCombined.classList.remove('active');
    activeTab = 'waterOnly';
    renderAll();
  });

  // --- Initial Render ---
  renderAll();

  // Watch for resizing to keep SVG coordinates properly matched to CSS rendering
  window.addEventListener('resize', renderAll);
});
