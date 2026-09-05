/**
 * BHARAT ALPHA TERMINAL - STOCKS CHARTS & COMPREHENSIVE RESULTS WORKSTATION
 */

import { MASTER_STOCKS, getStockByTicker } from '../data/masterStocks.js';
import { StockChartEngine } from './stockChart.js';

export class StockWorkstation {
  constructor(containerElement, onNavigatePhase) {
    this.container = containerElement;
    this.onNavigatePhase = onNavigatePhase;
    this.currentStock = MASTER_STOCKS[0]; // Default HDFCBANK
    this.chartEngine = null;
    this.activeFilter = 'ALL';
    this.searchQuery = '';
  }

  mount(initialTicker = null) {
    if (initialTicker) {
      const found = getStockByTicker(initialTicker);
      if (found) this.currentStock = found;
    }
    this.render();
  }

  selectStock(ticker) {
    const found = getStockByTicker(ticker);
    if (!found) return;
    this.currentStock = found;
    this.render();
  }

  selectNextStock() {
    const idx = MASTER_STOCKS.findIndex(s => s.ticker === this.currentStock.ticker);
    const nextIdx = (idx + 1) % MASTER_STOCKS.length;
    this.selectStock(MASTER_STOCKS[nextIdx].ticker);
  }

  selectPrevStock() {
    const idx = MASTER_STOCKS.findIndex(s => s.ticker === this.currentStock.ticker);
    const prevIdx = (idx - 1 + MASTER_STOCKS.length) % MASTER_STOCKS.length;
    this.selectStock(MASTER_STOCKS[prevIdx].ticker);
  }

  render() {
    const s = this.currentStock;
    const isUSD = s.tier.includes('Global') || s.marketCap.includes('$');
    const currSym = isUSD ? '$' : '₹';

    // Calculate upside percentage to 2030 target
    let upsidePct = 'N/A';
    if (s.targetPrice && s.cmp) {
      upsidePct = `+${Math.round(((s.targetPrice - s.cmp) / s.cmp) * 100)}%`;
    }

    // 52-Week Range Percentage Position
    const rangeSpan = (s.high52 - s.low52) || 100;
    const rangePos = Math.min(100, Math.max(0, Math.round(((s.cmp - s.low52) / rangeSpan) * 100)));

    // Stance Badge
    let stanceBadgeClass = 'bg-secondary text-on-secondary';
    if (s.stance.includes('Strong') || s.stance.includes('Buy')) stanceBadgeClass = 'bg-secondary text-on-secondary';
    else if (s.stance.includes('Hold') || s.stance.includes('Defensive')) stanceBadgeClass = 'bg-primary text-on-primary';
    else if (s.stance.includes('Candidate') || s.stance.includes('Multibagger')) stanceBadgeClass = 'bg-tertiary-container text-on-tertiary-container';

    // Filter stocks list for top switcher ribbon
    const filteredList = MASTER_STOCKS.filter(stock => {
      if (this.activeFilter === 'Tier-1' && !stock.tier.includes('Tier-1')) return false;
      if (this.activeFilter === 'Tier-2' && !stock.tier.includes('Tier-2')) return false;
      if (this.activeFilter === 'Tier-3' && !stock.tier.includes('Tier-3')) return false;
      if (this.activeFilter === 'Capex' && !['Defense & Aerospace', 'Infrastructure & Capex', 'Green Energy & Wind'].includes(stock.theme)) return false;
      if (this.activeFilter === 'Global' && !stock.tier.includes('Global')) return false;

      if (this.searchQuery) {
        const text = `${stock.ticker} ${stock.name} ${stock.sector}`.toLowerCase();
        if (!text.includes(this.searchQuery.toLowerCase())) return false;
      }
      return true;
    });

    this.container.innerHTML = `
      <div class="space-y-space-md w-full animate-fadeIn">
        <!-- 1. TOP STOCKS SELECTOR & FILTER DOCK -->
        <div class="bg-surface-container-low p-space-sm border border-surface-container-high shadow-md">
          <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-sm">
            <!-- Search & Quick Navigation -->
            <div class="flex items-center gap-space-xs shrink-0">
              <div class="relative flex items-center bg-surface-container-lowest border border-surface-container-high px-space-sm py-space-xs">
                <span class="material-symbols-outlined text-[16px] text-primary mr-space-xs">search</span>
                <input 
                  type="text" 
                  id="stockSearchInput" 
                  placeholder="SEARCH 45+ STOCKS (E.G. RELIANCE, TCS)..." 
                  value="${this.searchQuery}"
                  class="bg-transparent text-code-cli font-code-cli text-on-surface placeholder:text-surface-variant focus:outline-none w-56 sm:w-64"
                />
              </div>
              <button id="btnPrevStock" class="px-space-sm py-space-xs bg-surface-container hover:bg-surface-bright text-on-surface border border-surface-container-high font-micro-badge text-micro-badge uppercase flex items-center gap-space-2xs transition-colors" title="Previous Stock ([ key)">
                <span class="material-symbols-outlined text-[14px]">arrow_back</span> PREV
              </button>
              <button id="btnNextStock" class="px-space-sm py-space-xs bg-surface-container hover:bg-surface-bright text-on-surface border border-surface-container-high font-micro-badge text-micro-badge uppercase flex items-center gap-space-2xs transition-colors" title="Next Stock (] key)">
                NEXT <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>

            <!-- Filter Category Tabs -->
            <div class="flex items-center gap-space-2xs overflow-x-auto whitespace-nowrap pb-1 lg:pb-0">
              <button class="stock-filter-tab px-space-sm py-space-xs font-label-caps text-label-caps uppercase border transition-colors ${this.activeFilter === 'ALL' ? 'bg-primary text-on-primary font-bold border-primary' : 'bg-surface-container text-on-surface-variant hover:text-on-surface border-surface-container-high'}" data-filter="ALL">ALL (45+)</button>
              <button class="stock-filter-tab px-space-sm py-space-xs font-label-caps text-label-caps uppercase border transition-colors ${this.activeFilter === 'Tier-1' ? 'bg-primary text-on-primary font-bold border-primary' : 'bg-surface-container text-on-surface-variant hover:text-on-surface border-surface-container-high'}" data-filter="Tier-1">TIER-1 LARGE</button>
              <button class="stock-filter-tab px-space-sm py-space-xs font-label-caps text-label-caps uppercase border transition-colors ${this.activeFilter === 'Tier-2' ? 'bg-primary text-on-primary font-bold border-primary' : 'bg-surface-container text-on-surface-variant hover:text-on-surface border-surface-container-high'}" data-filter="Tier-2">TIER-2 MID</button>
              <button class="stock-filter-tab px-space-sm py-space-xs font-label-caps text-label-caps uppercase border transition-colors ${this.activeFilter === 'Tier-3' ? 'bg-primary text-on-primary font-bold border-primary' : 'bg-surface-container text-on-surface-variant hover:text-on-surface border-surface-container-high'}" data-filter="Tier-3">TIER-3 SMALL/SME</button>
              <button class="stock-filter-tab px-space-sm py-space-xs font-label-caps text-label-caps uppercase border transition-colors ${this.activeFilter === 'Capex' ? 'bg-primary text-on-primary font-bold border-primary' : 'bg-surface-container text-on-surface-variant hover:text-on-surface border-surface-container-high'}" data-filter="Capex">CAPEX &amp; DEFENSE</button>
              <button class="stock-filter-tab px-space-sm py-space-xs font-label-caps text-label-caps uppercase border transition-colors ${this.activeFilter === 'Global' ? 'bg-primary text-on-primary font-bold border-primary' : 'bg-surface-container text-on-surface-variant hover:text-on-surface border-surface-container-high'}" data-filter="Global">GLOBAL SOVEREIGN</button>
            </div>
          </div>

          <!-- Stock Chips Horizontal Scroll Ribbon -->
          <div class="mt-space-xs pt-space-xs border-t border-surface-container-high/60 flex items-center gap-space-xs overflow-x-auto py-space-2xs">
            ${filteredList.map(item => `
              <button 
                class="stock-chip px-space-sm py-space-2xs text-metric-table font-metric-table whitespace-nowrap transition-all border ${item.ticker === s.ticker ? 'bg-primary text-on-primary font-bold border-primary shadow-sm' : 'bg-surface-container text-on-surface hover:bg-surface-bright border-surface-container-high'}"
                data-ticker="${item.ticker}"
              >
                ${item.ticker} <span class="text-[10px] opacity-75">${isUSD ? '$' : '₹'}${item.cmp}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- 2. ACTIVE STOCK HERO BANNER & REAL-TIME TELEMETRY -->
        <div class="bg-surface-container-low p-space-lg border border-surface-container-high relative overflow-hidden shadow-lg">
          <div class="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-space-md">
            <!-- Ticker, Name & Badges -->
            <div class="space-y-space-xs">
              <div class="flex items-center gap-space-xs flex-wrap">
                <span class="font-mono text-[28px] font-bold text-primary tracking-tight">${s.ticker}</span>
                <span class="font-headline-lg text-headline-lg text-on-surface">${s.name}</span>
                <span class="font-micro-badge text-micro-badge px-space-xs py-space-2xs bg-surface-container-highest text-on-surface-variant uppercase">${s.tier}</span>
                <span class="font-micro-badge text-micro-badge px-space-xs py-space-2xs ${stanceBadgeClass} uppercase font-bold tracking-wider">${s.stance}</span>
              </div>
              <div class="flex items-center gap-space-sm text-metric-table font-metric-table text-on-surface-variant text-[12px] flex-wrap">
                <span>SECTOR: <strong class="text-on-surface">${s.sector}</strong></span>
                <span class="text-outline-variant">•</span>
                <span>THEME: <strong class="text-on-surface">${s.theme}</strong></span>
                <span class="text-outline-variant">•</span>
                <span>FORENSIC GOVERNANCE: <strong class="text-secondary">${s.forensicScore}/100 [PRISTINE]</strong></span>
              </div>
            </div>

            <!-- Price & 2030 Target Readout -->
            <div class="flex items-center gap-space-lg flex-wrap shrink-0">
              <div class="space-y-space-2xs">
                <div class="text-[10px] font-label-caps text-label-caps text-on-surface-variant uppercase">CURRENT MARKET PRICE (CMP)</div>
                <div class="font-mono text-[32px] font-bold text-secondary leading-none">${currSym}${s.cmp.toLocaleString('en-IN')}</div>
                <div class="text-[11px] font-metric-table text-secondary flex items-center gap-space-2xs">
                  <span class="material-symbols-outlined text-[14px]">trending_up</span> 20Y CAGR: ${s.cagr20Y}
                </div>
              </div>

              <!-- 52-Week Range Bar -->
              <div class="hidden md:block w-44 space-y-space-2xs">
                <div class="flex justify-between text-[10px] font-metric-table text-on-surface-variant">
                  <span>52W L: ${currSym}${s.low52}</span>
                  <span>52W H: ${currSym}${s.high52}</span>
                </div>
                <div class="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden relative">
                  <div class="bg-primary h-full rounded-full" style="width: ${rangePos}%"></div>
                </div>
                <div class="text-center text-[9px] font-mono text-outline-variant">RANGE POSITION: ${rangePos}%</div>
              </div>

              <div class="space-y-space-2xs border-l border-surface-container-high pl-space-md">
                <div class="text-[10px] font-label-caps text-label-caps text-primary uppercase font-bold">2030 TARGET CORRIDOR</div>
                <div class="font-mono text-[26px] font-bold text-primary leading-none">${s.target2030}</div>
                <div class="text-[11px] font-metric-table text-secondary font-bold">
                  EXP. UPSIDE: ${upsidePct}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. INTERACTIVE CHART COCKPIT -->
        <div class="bg-surface-container-lowest p-space-md border border-surface-container-high shadow-xl relative">
          <!-- Chart Controls Bar -->
          <div class="flex flex-wrap items-center justify-between gap-space-sm pb-space-sm border-b border-surface-container-high/70">
            <!-- Timeframe Selector -->
            <div class="flex items-center gap-space-2xs">
              <span class="font-label-caps text-label-caps text-on-surface-variant uppercase mr-space-xs hidden sm:inline">TIMEFRAME:</span>
              <button class="chart-tf-btn px-space-sm py-space-2xs text-metric-table font-metric-table text-[11px] border transition-colors bg-surface-container text-on-surface-variant hover:text-on-surface border-surface-container-high" data-tf="1Y">1Y</button>
              <button class="chart-tf-btn px-space-sm py-space-2xs text-metric-table font-metric-table text-[11px] border transition-colors bg-surface-container text-on-surface-variant hover:text-on-surface border-surface-container-high" data-tf="3Y">3Y</button>
              <button class="chart-tf-btn px-space-sm py-space-2xs text-metric-table font-metric-table text-[11px] border transition-colors bg-primary text-on-primary font-bold border-primary" data-tf="5Y">5Y</button>
              <button class="chart-tf-btn px-space-sm py-space-2xs text-metric-table font-metric-table text-[11px] border transition-colors bg-surface-container text-on-surface-variant hover:text-on-surface border-surface-container-high" data-tf="10Y">10Y</button>
              <button class="chart-tf-btn px-space-sm py-space-2xs text-metric-table font-metric-table text-[11px] border transition-colors bg-surface-container text-on-surface-variant hover:text-on-surface border-surface-container-high" data-tf="20Y">20Y</button>
              <button class="chart-tf-btn px-space-sm py-space-2xs text-metric-table font-metric-table text-[11px] border transition-colors bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary border-primary/50 font-bold" data-tf="TARGET">🎯 2026-30 TARGET</button>
            </div>

            <!-- Chart Mode & Indicator Toggles -->
            <div class="flex items-center gap-space-xs flex-wrap">
              <div class="flex items-center bg-surface-container border border-surface-container-high p-space-2xs">
                <button id="btnModeArea" class="px-space-xs py-space-2xs font-micro-badge text-micro-badge uppercase bg-primary text-on-primary font-bold">AREA</button>
                <button id="btnModeCandles" class="px-space-xs py-space-2xs font-micro-badge text-micro-badge uppercase text-on-surface-variant hover:text-on-surface">CANDLES</button>
              </div>

              <button id="btnToggleDma50" class="px-space-xs py-space-2xs bg-surface-container border border-surface-container-high text-[#00e0fa] font-micro-badge text-micro-badge uppercase font-bold" title="Toggle 50-DMA">✓ 50-DMA</button>
              <button id="btnToggleDma200" class="px-space-xs py-space-2xs bg-surface-container border border-surface-container-high text-[#ff9800] font-micro-badge text-micro-badge uppercase font-bold" title="Toggle 200-DMA">✓ 200-DMA</button>
              <button id="btnToggleVolume" class="px-space-xs py-space-2xs bg-surface-container border border-surface-container-high text-on-surface-variant font-micro-badge text-micro-badge uppercase" title="Toggle Volume">✓ VOL</button>
              <button id="btnToggleDrawdowns" class="px-space-xs py-space-2xs bg-surface-container border border-surface-container-high text-error font-micro-badge text-micro-badge uppercase" title="Toggle Crisis Markers">✓ CRISIS DIPS</button>
            </div>
          </div>

          <!-- The Canvas Chart Container -->
          <div class="w-full mt-space-sm relative" style="min-height: 380px;">
            <canvas id="stockMainCanvas" class="w-full block"></canvas>
          </div>

          <!-- Chart Footer Legend -->
          <div class="mt-space-sm pt-space-xs border-t border-surface-container-high/60 flex flex-wrap items-center justify-between text-[11px] font-metric-table text-on-surface-variant">
            <div class="flex items-center gap-space-md flex-wrap">
              <span class="flex items-center gap-space-2xs"><span class="w-2.5 h-1 bg-[#7dffa2] rounded"></span> PRICE CURVE</span>
              <span class="flex items-center gap-space-2xs"><span class="w-2.5 h-1 bg-[#00e0fa] rounded"></span> 50-DMA (INTERMEDIATE TREND)</span>
              <span class="flex items-center gap-space-2xs"><span class="w-2.5 h-1 bg-[#ff9800] rounded"></span> 200-DMA (LONG-TERM SUPPORT)</span>
              <span class="flex items-center gap-space-2xs"><span class="w-2.5 h-2 bg-primary/20 border border-primary/50"></span> 2026-2030 PREDICTIVE CORRIDOR</span>
              <span class="flex items-center gap-space-2xs"><span class="w-2 h-2 rounded-full bg-error"></span> HISTORICAL CRISIS DIP</span>
            </div>
            <div class="font-mono text-outline">
              ENGINE: BHARAT-CHART v3.2 // HIGH RESOLUTION
            </div>
          </div>
        </div>

        <!-- 4. COMPREHENSIVE INSTITUTIONAL RESULTS & METRICS SCORECARD -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
          <!-- Card 1: Valuation & Multiples -->
          <div class="bg-surface-container-low p-space-md border border-surface-container-high space-y-space-sm">
            <div class="font-label-caps text-label-caps text-primary uppercase font-bold flex items-center justify-between">
              <span>VALUATION MULTIPLES</span>
              <span class="material-symbols-outlined text-[16px]">price_change</span>
            </div>
            <div class="space-y-space-xs text-metric-table font-metric-table text-[12px]">
              <div class="flex justify-between py-space-2xs border-b border-surface-container-high/40">
                <span class="text-on-surface-variant">PRICE-TO-EARNINGS (P/E):</span>
                <strong class="text-on-surface">${s.pe}x</strong>
              </div>
              <div class="flex justify-between py-space-2xs border-b border-surface-container-high/40">
                <span class="text-on-surface-variant">5-YEAR MEDIAN P/E:</span>
                <strong class="text-primary">${s.median5YPE ? s.median5YPE + 'x' : 'N/A'}</strong>
              </div>
              <div class="flex justify-between py-space-2xs border-b border-surface-container-high/40">
                <span class="text-on-surface-variant">PRICE-TO-BOOK (P/B):</span>
                <strong class="text-on-surface">${s.pb}x</strong>
              </div>
              <div class="flex justify-between py-space-2xs border-b border-surface-container-high/40">
                <span class="text-on-surface-variant">EV / EBITDA:</span>
                <strong class="text-on-surface">${s.evEbitda}x</strong>
              </div>
              <div class="flex justify-between py-space-2xs">
                <span class="text-on-surface-variant">MARKET CAP:</span>
                <strong class="text-secondary">${s.marketCap}</strong>
              </div>
            </div>
          </div>

          <!-- Card 2: Return on Capital & Cash Flows -->
          <div class="bg-surface-container-low p-space-md border border-surface-container-high space-y-space-sm">
            <div class="font-label-caps text-label-caps text-secondary uppercase font-bold flex items-center justify-between">
              <span>CAPITAL RETURN QUALITY</span>
              <span class="material-symbols-outlined text-[16px]">savings</span>
            </div>
            <div class="space-y-space-xs text-metric-table font-metric-table text-[12px]">
              <div class="flex justify-between py-space-2xs border-b border-surface-container-high/40">
                <span class="text-on-surface-variant">RETURN ON CAPITAL (RoCE):</span>
                <strong class="text-secondary">${s.roce}</strong>
              </div>
              <div class="flex justify-between py-space-2xs border-b border-surface-container-high/40">
                <span class="text-on-surface-variant">RETURN ON EQUITY (RoE):</span>
                <strong class="text-secondary">${s.roe}</strong>
              </div>
              <div class="flex justify-between py-space-2xs border-b border-surface-container-high/40">
                <span class="text-on-surface-variant">CFO / PAT CONVERSION:</span>
                <strong class="text-on-surface">${s.cfoPatRatio}</strong>
              </div>
              <div class="flex justify-between py-space-2xs border-b border-surface-container-high/40">
                <span class="text-on-surface-variant">FREE CASH FLOW YIELD:</span>
                <strong class="text-on-surface">${s.fcfYield}</strong>
              </div>
              <div class="flex justify-between py-space-2xs">
                <span class="text-on-surface-variant">PROMOTER PLEDGE:</span>
                <strong class="${s.promoterPledge === '0.0%' ? 'text-secondary' : 'text-error'}">${s.promoterPledge} [SAFE]</strong>
              </div>
            </div>
          </div>

          <!-- Card 3: Compounding & Ownership -->
          <div class="bg-surface-container-low p-space-md border border-surface-container-high space-y-space-sm">
            <div class="font-label-caps text-label-caps text-tertiary uppercase font-bold flex items-center justify-between">
              <span>OWNERSHIP &amp; COMPOUNDING</span>
              <span class="material-symbols-outlined text-[16px]">pie_chart</span>
            </div>
            <div class="space-y-space-xs text-metric-table font-metric-table text-[12px]">
              <div class="flex justify-between py-space-2xs border-b border-surface-container-high/40">
                <span class="text-on-surface-variant">10-YEAR CAGR:</span>
                <strong class="text-primary">${s.cagr10Y}</strong>
              </div>
              <div class="flex justify-between py-space-2xs border-b border-surface-container-high/40">
                <span class="text-on-surface-variant">20-YEAR CAGR:</span>
                <strong class="text-secondary">${s.cagr20Y}</strong>
              </div>
              <div class="flex justify-between py-space-2xs border-b border-surface-container-high/40">
                <span class="text-on-surface-variant">FII OWNERSHIP:</span>
                <strong class="text-on-surface">${s.fiiHolding}</strong>
              </div>
              <div class="flex justify-between py-space-2xs border-b border-surface-container-high/40">
                <span class="text-on-surface-variant">DII MUTUAL FUNDS:</span>
                <strong class="text-on-surface">${s.diiHolding}</strong>
              </div>
              <div class="flex justify-between py-space-2xs">
                <span class="text-on-surface-variant">LIC / SOVEREIGN FLOAT:</span>
                <strong class="text-on-surface">${s.licHolding}</strong>
              </div>
            </div>
          </div>

          <!-- Card 4: Action & Quick Simulator -->
          <div class="bg-surface-container-low p-space-md border border-surface-container-high space-y-space-sm flex flex-col justify-between">
            <div class="space-y-space-2xs">
              <div class="font-label-caps text-label-caps text-on-surface uppercase font-bold flex items-center justify-between">
                <span>INSTITUTIONAL ACTIONS</span>
                <span class="material-symbols-outlined text-[16px] text-primary">bolt</span>
              </div>
              <p class="text-[11px] text-on-surface-variant leading-relaxed">
                Execute simulated allocation orders or audit balance-sheet governance flags directly from the cockpit.
              </p>
            </div>
            <div class="space-y-space-xs pt-space-xs">
              <button id="btnRunForensicOnStock" class="w-full py-space-xs bg-surface-container-high hover:bg-surface-bright text-on-surface border border-surface-container-highest font-label-caps text-label-caps font-bold uppercase tracking-wider flex items-center justify-center gap-space-xs transition-colors">
                <span class="material-symbols-outlined text-[15px] text-tertiary">biotech</span> RUN FORENSIC AUDIT
              </button>
              <button id="btnAddToSim" class="w-full py-space-xs bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps font-bold uppercase tracking-wider flex items-center justify-center gap-space-xs transition-colors">
                <span class="material-symbols-outlined text-[15px]">add_task</span> BUY IN PORTFOLIO SIM
              </button>
              <button id="btnExportStockData" class="w-full py-space-xs bg-surface-container hover:bg-surface-bright text-on-surface-variant hover:text-on-surface border border-surface-container-high font-label-caps text-label-caps uppercase flex items-center justify-center gap-space-xs transition-colors">
                <span class="material-symbols-outlined text-[15px] text-secondary">download</span> EXPORT STOCK DOSSIER
              </button>
            </div>
          </div>
        </div>

        <!-- 5. DEEP DIVE INSTITUTIONAL THESIS & COMPETITIVE MOATS -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
          <div class="bg-surface-container-low p-space-lg border border-surface-container-high space-y-space-xs">
            <div class="flex items-center gap-space-xs font-headline-md text-headline-md text-primary font-semibold uppercase">
              <span class="material-symbols-outlined text-[18px]">verified</span>
              <span>CORE INSTITUTIONAL THESIS (2026–2030)</span>
            </div>
            <p class="text-body-md text-body-md text-on-surface leading-relaxed pt-space-xs">
              ${s.thesis}
            </p>
            <div class="mt-space-sm pt-space-xs border-t border-surface-container-high/60 text-[11px] font-metric-table text-on-surface-variant">
              CRASH SURVIVAL RECORD: <strong class="text-on-surface">${s.crashHistory}</strong>
            </div>
          </div>

          <div class="bg-surface-container-low p-space-lg border border-surface-container-high space-y-space-xs">
            <div class="flex items-center gap-space-xs font-headline-md text-headline-md text-secondary font-semibold uppercase">
              <span class="material-symbols-outlined text-[18px]">shield</span>
              <span>COMPETITIVE MOAT &amp; BARRIERS TO ENTRY</span>
            </div>
            <p class="text-body-md text-body-md text-on-surface leading-relaxed pt-space-xs">
              ${s.moat}
            </p>
            <div class="mt-space-sm pt-space-xs border-t border-surface-container-high/60 flex justify-between text-[11px] font-metric-table text-on-surface-variant">
              <span>SOLVENCY HORIZON: <strong class="text-secondary">FORTRESS GRADE</strong></span>
              <span>BETA TO NIFTY: <strong class="text-primary">0.92</strong></span>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindDOMEvents();
    this.initChart();
  }

  bindDOMEvents() {
    // Stock search input
    const searchInput = document.getElementById('stockSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.render();
      });
    }

    // Prev / Next stock buttons
    const prevBtn = document.getElementById('btnPrevStock');
    if (prevBtn) prevBtn.addEventListener('click', () => this.selectPrevStock());

    const nextBtn = document.getElementById('btnNextStock');
    if (nextBtn) nextBtn.addEventListener('click', () => this.selectNextStock());

    // Filter category tabs
    const filterTabs = document.querySelectorAll('.stock-filter-tab');
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.activeFilter = tab.dataset.filter;
        this.render();
      });
    });

    // Stock chips
    const stockChips = document.querySelectorAll('.stock-chip');
    stockChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const ticker = chip.dataset.ticker;
        this.selectStock(ticker);
      });
    });

    // Action buttons
    const btnForensic = document.getElementById('btnRunForensicOnStock');
    if (btnForensic) {
      btnForensic.addEventListener('click', () => {
        if (this.onNavigatePhase) this.onNavigatePhase('forensic', this.currentStock);
      });
    }

    const btnAddToSim = document.getElementById('btnAddToSim');
    if (btnAddToSim) {
      btnAddToSim.addEventListener('click', () => {
        alert(`Allocated simulated position in ${this.currentStock.ticker} (${this.currentStock.name}). Navigating to Master Simulator.`);
        if (this.onNavigatePhase) this.onNavigatePhase('portfolio');
      });
    }

    const btnExportStock = document.getElementById('btnExportStockData');
    if (btnExportStock) {
      btnExportStock.addEventListener('click', () => this.exportStockCSV());
    }

    // Keyboard shortcuts for cycling stocks: [ and ]
    window.onkeydown = (e) => {
      if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
      if (e.key === '[') this.selectPrevStock();
      else if (e.key === ']') this.selectNextStock();
    };
  }

  initChart() {
    const canvas = document.getElementById('stockMainCanvas');
    if (!canvas) return;

    this.chartEngine = new StockChartEngine(canvas);
    this.chartEngine.setStock(this.currentStock, '5Y');

    // Timeframe buttons
    const tfBtns = document.querySelectorAll('.chart-tf-btn');
    tfBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tfBtns.forEach(b => {
          b.className = 'chart-tf-btn px-space-sm py-space-2xs text-metric-table font-metric-table text-[11px] border transition-colors bg-surface-container text-on-surface-variant hover:text-on-surface border-surface-container-high';
        });
        btn.className = 'chart-tf-btn px-space-sm py-space-2xs text-metric-table font-metric-table text-[11px] border transition-colors bg-primary text-on-primary font-bold border-primary';
        this.chartEngine.setTimeframe(btn.dataset.tf);
      });
    });

    // Chart Mode Area vs Candles
    const btnArea = document.getElementById('btnModeArea');
    const btnCandles = document.getElementById('btnModeCandles');

    if (btnArea && btnCandles) {
      btnArea.addEventListener('click', () => {
        btnArea.className = 'px-space-xs py-space-2xs font-micro-badge text-micro-badge uppercase bg-primary text-on-primary font-bold';
        btnCandles.className = 'px-space-xs py-space-2xs font-micro-badge text-micro-badge uppercase text-on-surface-variant hover:text-on-surface';
        this.chartEngine.setChartType('area');
      });

      btnCandles.addEventListener('click', () => {
        btnCandles.className = 'px-space-xs py-space-2xs font-micro-badge text-micro-badge uppercase bg-primary text-on-primary font-bold';
        btnArea.className = 'px-space-xs py-space-2xs font-micro-badge text-micro-badge uppercase text-on-surface-variant hover:text-on-surface';
        this.chartEngine.setChartType('candles');
      });
    }

    // Indicator Toggles
    const btnDma50 = document.getElementById('btnToggleDma50');
    if (btnDma50) {
      btnDma50.addEventListener('click', () => {
        this.chartEngine.toggleIndicator('dma50');
        btnDma50.classList.toggle('opacity-50');
      });
    }

    const btnDma200 = document.getElementById('btnToggleDma200');
    if (btnDma200) {
      btnDma200.addEventListener('click', () => {
        this.chartEngine.toggleIndicator('dma200');
        btnDma200.classList.toggle('opacity-50');
      });
    }

    const btnVol = document.getElementById('btnToggleVolume');
    if (btnVol) {
      btnVol.addEventListener('click', () => {
        this.chartEngine.toggleIndicator('volume');
        btnVol.classList.toggle('opacity-50');
      });
    }

    const btnDips = document.getElementById('btnToggleDrawdowns');
    if (btnDips) {
      btnDips.addEventListener('click', () => {
        this.chartEngine.toggleIndicator('drawdowns');
        btnDips.classList.toggle('opacity-50');
      });
    }
  }

  exportStockCSV() {
    const s = this.currentStock;
    const rows = [
      ["Metric", "Value"],
      ["Ticker", s.ticker],
      ["Company Name", s.name],
      ["Tier", s.tier],
      ["Sector", s.sector],
      ["Theme", s.theme],
      ["CMP", s.cmp],
      ["52W High", s.high52],
      ["52W Low", s.low52],
      ["Market Cap", s.marketCap],
      ["P/E", s.pe],
      ["5Y Median P/E", s.median5YPE || "N/A"],
      ["P/B", s.pb],
      ["RoCE", s.roce],
      ["RoE", s.roe],
      ["10Y CAGR", s.cagr10Y],
      ["20Y CAGR", s.cagr20Y],
      ["FII Holding", s.fiiHolding],
      ["DII Holding", s.diiHolding],
      ["LIC Holding", s.licHolding],
      ["Promoter Pledge", s.promoterPledge],
      ["Forensic Score", `${s.forensicScore}/100`],
      ["2030 Target Band", s.target2030],
      ["Investment Stance", s.stance],
      ["Moat", s.moat],
      ["Thesis", s.thesis]
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => `"${e[0]}","${String(e[1]).replace(/"/g, '""')}"`).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `${s.ticker}_INSTITUTIONAL_DOSSIER.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
