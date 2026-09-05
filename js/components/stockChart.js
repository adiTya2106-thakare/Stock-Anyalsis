/**
 * BHARAT ALPHA TERMINAL - INTERACTIVE TECHNICAL & PREDICTIVE CHART ENGINE
 * Canvas-based zero-dependency institutional charting with Multi-Timeframes,
 * Candlesticks/Area toggle, 50/200 DMA, Volume Profile, and 2026-2030 Target Corridor.
 */

export class StockChartEngine {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.stock = null;
    this.timeframe = '5Y'; // '1Y', '3Y', '5Y', '10Y', '20Y', 'TARGET'
    this.chartType = 'area'; // 'area' or 'candles'
    this.showDma50 = true;
    this.showDma200 = true;
    this.showVolume = true;
    this.showProjection = true;
    this.showDrawdownMarkers = true;

    this.dataPoints = [];
    this.hoverIndex = -1;
    this.mouseX = -1;
    this.mouseY = -1;

    this.bindEvents();
  }

  bindEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = (e.clientX - rect.left);
      this.mouseY = (e.clientY - rect.top);
      this.findHoverPoint();
      this.render();
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.hoverIndex = -1;
      this.mouseX = -1;
      this.mouseY = -1;
      this.render();
    });

    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.render();
    });
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    if (!parent) return;

    const width = parent.clientWidth || 800;
    const height = Math.max(380, Math.min(520, window.innerHeight * 0.48));

    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.ctx.resetTransform?.();
    this.ctx.scale(dpr, dpr);
    this.displayWidth = width;
    this.displayHeight = height;
  }

  setStock(stock, timeframe = '5Y') {
    this.stock = stock;
    this.timeframe = timeframe;
    this.generateDataSeries();
    this.resizeCanvas();
    this.render();
  }

  setTimeframe(tf) {
    this.timeframe = tf;
    this.generateDataSeries();
    this.render();
  }

  setChartType(type) {
    this.chartType = type;
    this.render();
  }

  toggleIndicator(name) {
    if (name === 'dma50') this.showDma50 = !this.showDma50;
    if (name === 'dma200') this.showDma200 = !this.showDma200;
    if (name === 'volume') this.showVolume = !this.showVolume;
    if (name === 'projection') this.showProjection = !this.showProjection;
    if (name === 'drawdowns') this.showDrawdownMarkers = !this.showDrawdownMarkers;
    this.render();
  }

  /**
   * Deterministically generate realistic multi-decade price action calibrated to
   * the stock's actual CMP, historical CAGRs, historical crisis drawdowns, and 2030 targets.
   */
  generateDataSeries() {
    if (!this.stock) return;

    const cmp = this.stock.cmp || 1000;
    const targetPrice = this.stock.targetPrice || Math.round(cmp * 1.6);
    const cagr10YNum = parseFloat(this.stock.cagr10Y) || 14.5;
    const cagr20YNum = parseFloat(this.stock.cagr20Y) || 16.5;

    let periods = 60;
    let startYear = 2021;
    let endYear = 2026;
    let isProjectionView = (this.timeframe === 'TARGET');

    if (this.timeframe === '1Y') {
      periods = 52;
      startYear = 2025.2;
      endYear = 2026.2;
    } else if (this.timeframe === '3Y') {
      periods = 75;
      startYear = 2023.2;
      endYear = 2026.2;
    } else if (this.timeframe === '5Y') {
      periods = 90;
      startYear = 2021.2;
      endYear = 2026.2;
    } else if (this.timeframe === '10Y') {
      periods = 120;
      startYear = 2016.2;
      endYear = 2026.2;
    } else if (this.timeframe === '20Y') {
      periods = 160;
      startYear = 2005.2;
      endYear = 2026.2;
    } else if (isProjectionView) {
      periods = 100;
      startYear = 2020.0;
      endYear = 2030.0; // projects to 2030
    }

    const points = [];
    const seed = this.stock.ticker.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

    // Calculate historical start price based on CAGR
    const totalYears = endYear - startYear;
    const effectiveCagr = totalYears > 12 ? cagr20YNum : cagr10YNum;
    const initialPrice = cmp / Math.pow(1 + effectiveCagr / 100, Math.min(20, totalYears));

    let curPrice = initialPrice;

    for (let i = 0; i <= periods; i++) {
      const progress = i / periods;
      const currentYear = startYear + progress * (endYear - startYear);

      // Deterministic pseudo-random variation
      const pseudoRand = Math.sin(seed * 99 + i * 0.73) * Math.cos(seed * 37 + i * 1.15);
      const trendStep = (cmp - initialPrice) / periods;

      if (currentYear > 2026.2 && isProjectionView) {
        // Forward Projection Zone (2026 - 2030)
        const projProgress = (currentYear - 2026.2) / (2030.0 - 2026.2);
        const baseProj = cmp + (targetPrice - cmp) * projProgress;
        const bullProj = cmp + (targetPrice * 1.25 - cmp) * projProgress;
        const bearProj = cmp + (targetPrice * 0.75 - cmp) * projProgress;

        const noise = pseudoRand * (targetPrice * 0.03);
        const close = Math.round(baseProj + noise);
        const high = Math.round(Math.max(close, bullProj * 0.98 + noise));
        const low = Math.round(Math.min(close, bearProj * 1.02 + noise));
        const open = Math.round(close - pseudoRand * 15);
        const volume = Math.round(1500000 + Math.abs(pseudoRand) * 1200000);

        points.push({
          date: `Q${Math.floor((currentYear % 1) * 4) + 1} ${Math.floor(currentYear)}`,
          year: currentYear,
          open,
          high,
          low,
          close,
          bull: Math.round(bullProj),
          bear: Math.round(bearProj),
          base: Math.round(baseProj),
          volume,
          isProjection: true
        });
      } else {
        // Historical Real / Simulated Curve
        let crashFactor = 1.0;

        // Specific Crisis Shocks
        if (currentYear >= 2008.0 && currentYear <= 2009.2) {
          crashFactor = 0.58; // 2008 GFC shock
        } else if (currentYear >= 2015.8 && currentYear <= 2016.8) {
          crashFactor = 0.82; // Demonetization & NPA AQR
        } else if (currentYear >= 2020.1 && currentYear <= 2020.5) {
          crashFactor = 0.62; // COVID Flash Crash
        } else if (currentYear >= 2022.0 && currentYear <= 2022.6) {
          crashFactor = 0.86; // Global Fed rate hikes
        } else if (currentYear >= 2024.4 && currentYear <= 2024.6) {
          crashFactor = 0.94; // Election day volatility
        }

        const baseline = initialPrice + (cmp - initialPrice) * Math.pow(progress, 1.2);
        let close = Math.round((baseline + pseudoRand * (baseline * 0.08)) * crashFactor);

        // Ensure last historical point strictly matches CMP
        if (i === periods || (isProjectionView && Math.abs(currentYear - 2026.2) < 0.1)) {
          close = cmp;
        }

        const volatility = close * 0.025;
        const open = Math.round(close - pseudoRand * volatility);
        const high = Math.round(Math.max(open, close) + Math.abs(pseudoRand) * volatility * 1.2);
        const low = Math.round(Math.min(open, close) - Math.abs(pseudoRand) * volatility * 1.2);
        const volume = Math.round(2000000 + Math.abs(pseudoRand) * 3500000);

        // Crisis marker flags
        let event = null;
        if (Math.abs(currentYear - 2008.8) < 0.15) event = '2008 GFC Crash';
        else if (Math.abs(currentYear - 2020.25) < 0.12) event = '2020 COVID Dip';
        else if (Math.abs(currentYear - 2022.4) < 0.12) event = '2022 Fed Shock';

        points.push({
          date: `${Math.floor(currentYear)}-${String(Math.floor((currentYear % 1) * 12) + 1).padStart(2, '0')}`,
          year: currentYear,
          open,
          high,
          low,
          close,
          volume,
          event,
          isProjection: false
        });
      }
    }

    // Compute 50-DMA and 200-DMA
    for (let i = 0; i < points.length; i++) {
      // DMA 50 (approx 12 periods on weekly/monthly)
      const dma50Window = 12;
      const start50 = Math.max(0, i - dma50Window + 1);
      const slice50 = points.slice(start50, i + 1);
      points[i].dma50 = Math.round(slice50.reduce((acc, p) => acc + p.close, 0) / slice50.length);

      // DMA 200 (approx 36 periods)
      const dma200Window = 36;
      const start200 = Math.max(0, i - dma200Window + 1);
      const slice200 = points.slice(start200, i + 1);
      points[i].dma200 = Math.round(slice200.reduce((acc, p) => acc + p.close, 0) / slice200.length);
    }

    this.dataPoints = points;
  }

  findHoverPoint() {
    if (!this.dataPoints || this.dataPoints.length === 0) {
      this.hoverIndex = -1;
      return;
    }

    const paddingLeft = 60;
    const paddingRight = 80;
    const chartWidth = this.displayWidth - paddingLeft - paddingRight;

    if (this.mouseX < paddingLeft || this.mouseX > this.displayWidth - paddingRight) {
      this.hoverIndex = -1;
      return;
    }

    const ratio = (this.mouseX - paddingLeft) / chartWidth;
    const idx = Math.round(ratio * (this.dataPoints.length - 1));
    this.hoverIndex = Math.max(0, Math.min(this.dataPoints.length - 1, idx));
  }

  render() {
    if (!this.ctx || !this.canvas || this.dataPoints.length === 0) return;

    const ctx = this.ctx;
    const width = this.displayWidth;
    const height = this.displayHeight;

    ctx.clearRect(0, 0, width, height);

    const paddingLeft = 65;
    const paddingRight = 85;
    const paddingTop = 35;
    const paddingBottom = 45;

    const plotWidth = width - paddingLeft - paddingRight;
    const plotHeight = height - paddingTop - paddingBottom;
    const volumeHeight = plotHeight * 0.18;
    const pricePlotHeight = plotHeight - volumeHeight - 15;

    // Price Bounds
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let maxVolume = 0;

    this.dataPoints.forEach(p => {
      const highVal = p.bull ? Math.max(p.high, p.bull) : p.high;
      const lowVal = p.bear ? Math.min(p.low, p.bear) : p.low;
      if (highVal > maxPrice) maxPrice = highVal;
      if (lowVal < minPrice) minPrice = lowVal;
      if (p.volume > maxVolume) maxVolume = p.volume;
    });

    // Add 10% breathing room to price limits
    const priceRange = (maxPrice - minPrice) || 100;
    minPrice = Math.max(0, minPrice - priceRange * 0.08);
    maxPrice = maxPrice + priceRange * 0.08;

    const getX = (idx) => paddingLeft + (idx / (this.dataPoints.length - 1)) * plotWidth;
    const getY = (val) => paddingTop + (1 - (val - minPrice) / (maxPrice - minPrice)) * pricePlotHeight;
    const getVolY = (vol) => height - paddingBottom - (vol / maxVolume) * volumeHeight;

    // --- 1. Background Grid & Coordinate Lines ---
    ctx.strokeStyle = '#1c2026';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);

    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = paddingTop + (i / gridLines) * pricePlotHeight;
      const priceVal = maxPrice - (i / gridLines) * (maxPrice - minPrice);

      ctx.beginPath();
      ctx.moveTo(paddingLeft, y);
      ctx.lineTo(width - paddingRight, y);
      ctx.stroke();

      // Price Axis Label (Right)
      ctx.setLineDash([]);
      ctx.fillStyle = '#dbc2ad';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(this.formatPrice(priceVal), width - paddingRight + 8, y + 4);
      ctx.setLineDash([3, 3]);
    }
    ctx.setLineDash([]);

    // --- 2. Volume Profile Bars ---
    if (this.showVolume) {
      const barWidth = Math.max(2, (plotWidth / this.dataPoints.length) * 0.65);
      this.dataPoints.forEach((p, idx) => {
        const x = getX(idx);
        const y = getVolY(p.volume);
        const h = (height - paddingBottom) - y;
        const isUp = p.close >= p.open;

        ctx.fillStyle = isUp ? 'rgba(5, 231, 119, 0.25)' : 'rgba(255, 85, 85, 0.25)';
        ctx.fillRect(x - barWidth / 2, y, barWidth, h);
      });
    }

    // --- 3. 2026-2030 Predictive Corridor (Cone) ---
    const projStartIndex = this.dataPoints.findIndex(p => p.isProjection);
    if (projStartIndex !== -1 && this.showProjection) {
      const projPoints = this.dataPoints.slice(projStartIndex);
      if (projPoints.length > 1) {
        // Shaded corridor
        ctx.beginPath();
        ctx.moveTo(getX(projStartIndex), getY(this.dataPoints[projStartIndex].close));
        projPoints.forEach((p, i) => {
          ctx.lineTo(getX(projStartIndex + i), getY(p.bull));
        });
        for (let i = projPoints.length - 1; i >= 0; i--) {
          ctx.lineTo(getX(projStartIndex + i), getY(projPoints[i].bear));
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 192, 129, 0.12)';
        ctx.fill();

        // Bull Border
        ctx.strokeStyle = 'rgba(125, 255, 162, 0.8)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        projPoints.forEach((p, i) => {
          const x = getX(projStartIndex + i);
          const y = getY(p.bull);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Base Institutional Target
        ctx.strokeStyle = 'rgba(255, 192, 129, 0.9)';
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        projPoints.forEach((p, i) => {
          const x = getX(projStartIndex + i);
          const y = getY(p.base);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Bear Floor
        ctx.strokeStyle = 'rgba(255, 100, 100, 0.6)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        projPoints.forEach((p, i) => {
          const x = getX(projStartIndex + i);
          const y = getY(p.bear);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.setLineDash([]);

        // Label on end of corridor
        const lastP = projPoints[projPoints.length - 1];
        const lastX = getX(this.dataPoints.length - 1);
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = '#7dffa2';
        ctx.fillText(`BULL: ${this.formatPrice(lastP.bull)}`, lastX - 90, getY(lastP.bull) - 6);
        ctx.fillStyle = '#ffc081';
        ctx.fillText(`TARGET: ${this.formatPrice(lastP.base)}`, lastX - 90, getY(lastP.base) - 6);
        ctx.fillStyle = '#ffb4ab';
        ctx.fillText(`FLOOR: ${this.formatPrice(lastP.bear)}`, lastX - 90, getY(lastP.bear) + 14);
      }
    }

    // --- 4. Price Action: Area or Candlesticks ---
    if (this.chartType === 'area') {
      // Area Fill Gradient
      const gradient = ctx.createLinearGradient(0, paddingTop, 0, paddingTop + pricePlotHeight);
      gradient.addColorStop(0, 'rgba(125, 255, 162, 0.28)');
      gradient.addColorStop(0.65, 'rgba(125, 255, 162, 0.08)');
      gradient.addColorStop(1, 'rgba(16, 20, 26, 0)');

      ctx.beginPath();
      ctx.moveTo(getX(0), paddingTop + pricePlotHeight);
      this.dataPoints.forEach((p, idx) => {
        ctx.lineTo(getX(idx), getY(p.close));
      });
      ctx.lineTo(getX(this.dataPoints.length - 1), paddingTop + pricePlotHeight);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Primary Line
      ctx.strokeStyle = '#7dffa2';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      this.dataPoints.forEach((p, idx) => {
        const x = getX(idx);
        const y = getY(p.close);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    } else {
      // Candlesticks Mode
      const candleWidth = Math.max(3, (plotWidth / this.dataPoints.length) * 0.7);
      this.dataPoints.forEach((p, idx) => {
        const x = getX(idx);
        const yOpen = getY(p.open);
        const yClose = getY(p.close);
        const yHigh = getY(p.high);
        const yLow = getY(p.low);
        const isUp = p.close >= p.open;

        ctx.strokeStyle = isUp ? '#05e777' : '#ff5555';
        ctx.fillStyle = isUp ? '#05e777' : '#ff5555';
        ctx.lineWidth = 1;

        // Wick
        ctx.beginPath();
        ctx.moveTo(x, yHigh);
        ctx.lineTo(x, yLow);
        ctx.stroke();

        // Body
        const topY = Math.min(yOpen, yClose);
        const bodyH = Math.max(2, Math.abs(yClose - yOpen));
        ctx.fillRect(x - candleWidth / 2, topY, candleWidth, bodyH);
      });
    }

    // --- 5. Moving Averages (50-DMA and 200-DMA) ---
    if (this.showDma50) {
      ctx.strokeStyle = '#00e0fa'; // cyan
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      this.dataPoints.forEach((p, idx) => {
        if (p.dma50) {
          const x = getX(idx);
          const y = getY(p.dma50);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    }

    if (this.showDma200) {
      ctx.strokeStyle = '#ff9800'; // amber
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      this.dataPoints.forEach((p, idx) => {
        if (p.dma200) {
          const x = getX(idx);
          const y = getY(p.dma200);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    }

    // --- 6. Historical Crisis Drawdown Markers ---
    if (this.showDrawdownMarkers) {
      this.dataPoints.forEach((p, idx) => {
        if (p.event) {
          const x = getX(idx);
          const y = getY(p.close);

          // Marker dot
          ctx.fillStyle = '#ff5555';
          ctx.beginPath();
          ctx.arc(x, y, 4.5, 0, Math.PI * 2);
          ctx.fill();

          // Marker Flag / Pill
          ctx.fillStyle = 'rgba(147, 0, 10, 0.85)';
          ctx.strokeStyle = '#ffb4ab';
          ctx.lineWidth = 1;

          const textWidth = ctx.measureText(p.event).width;
          ctx.fillRect(x - textWidth / 2 - 6, y - 28, textWidth + 12, 18);
          ctx.strokeRect(x - textWidth / 2 - 6, y - 28, textWidth + 12, 18);

          ctx.fillStyle = '#ffdad6';
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(p.event, x, y - 16);
        }
      });
    }

    // --- 7. Current CMP Marker ---
    const cmpIdx = projStartIndex !== -1 ? projStartIndex - 1 : this.dataPoints.length - 1;
    if (cmpIdx >= 0 && cmpIdx < this.dataPoints.length) {
      const cmpPoint = this.dataPoints[cmpIdx];
      const cmpX = getX(cmpIdx);
      const cmpY = getY(cmpPoint.close);

      ctx.fillStyle = '#ffc081';
      ctx.beginPath();
      ctx.arc(cmpX, cmpY, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#2c1600';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Pulsing ring
      ctx.strokeStyle = 'rgba(255, 192, 129, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cmpX, cmpY, 9, 0, Math.PI * 2);
      ctx.stroke();
    }

    // --- 8. Date X-Axis Labels ---
    ctx.fillStyle = '#8f939e';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';

    const dateStep = Math.ceil(this.dataPoints.length / 7);
    for (let i = 0; i < this.dataPoints.length; i += dateStep) {
      const p = this.dataPoints[i];
      const x = getX(i);
      ctx.fillText(p.date, x, height - paddingBottom + 18);
    }

    // --- 9. Interactive Crosshair & Tooltip HUD ---
    if (this.hoverIndex >= 0 && this.hoverIndex < this.dataPoints.length) {
      const p = this.dataPoints[this.hoverIndex];
      const hx = getX(this.hoverIndex);
      const hy = getY(p.close);

      // Vertical line
      ctx.strokeStyle = '#ffc081';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(hx, paddingTop);
      ctx.lineTo(hx, height - paddingBottom);
      ctx.stroke();

      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(paddingLeft, hy);
      ctx.lineTo(width - paddingRight, hy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Highlight point
      ctx.fillStyle = '#ffc081';
      ctx.beginPath();
      ctx.arc(hx, hy, 5, 0, Math.PI * 2);
      ctx.fill();

      // Floating HUD Tooltip Box
      const boxW = 210;
      const boxH = 110;
      let boxX = hx + 15;
      let boxY = hy - 40;

      if (boxX + boxW > width - paddingRight) boxX = hx - boxW - 15;
      if (boxY + boxH > height - paddingBottom) boxY = height - paddingBottom - boxH;
      if (boxY < paddingTop) boxY = paddingTop + 10;

      ctx.fillStyle = 'rgba(10, 14, 20, 0.92)';
      ctx.strokeStyle = '#a38d7a';
      ctx.lineWidth = 1;
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      ctx.textAlign = 'left';
      ctx.fillStyle = '#ffc081';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillText(`${this.stock.ticker} // ${p.date}`, boxX + 12, boxY + 20);

      ctx.fillStyle = '#dfe2eb';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText(`Close: ${this.formatPrice(p.close)}`, boxX + 12, boxY + 40);

      if (p.open) ctx.fillText(`Open:  ${this.formatPrice(p.open)}`, boxX + 110, boxY + 40);
      if (p.dma50) {
        ctx.fillStyle = '#00e0fa';
        ctx.fillText(`50-DMA:  ${this.formatPrice(p.dma50)}`, boxX + 12, boxY + 60);
      }
      if (p.dma200) {
        ctx.fillStyle = '#ff9800';
        ctx.fillText(`200-DMA: ${this.formatPrice(p.dma200)}`, boxX + 12, boxY + 78);
      }
      ctx.fillStyle = '#8f939e';
      ctx.fillText(`Vol: ${(p.volume / 1000000).toFixed(2)}M`, boxX + 12, boxY + 96);
    }
  }

  formatPrice(num) {
    if (num === null || num === undefined || isNaN(num)) return 'N/A';
    const isUSD = this.stock && (this.stock.tier.includes('Global') || this.stock.marketCap.includes('$'));
    const sym = isUSD ? '$' : '₹';
    return `${sym}${Math.round(num).toLocaleString('en-IN')}`;
  }
}
