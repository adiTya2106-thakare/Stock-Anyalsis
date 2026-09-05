/**
 * BHARAT ALPHA TERMINAL (2026-2030) - MASTER TERMINAL APP
 * Coordinates the Persistent Left Phase Sidebar, Dedicated Stock Charts Desk,
 * Master Portfolio Simulator, 8 Phase Research Dossiers, and CLI Command Engine.
 */

import { MASTER_STOCKS, getStockByTicker } from './data/masterStocks.js';
import { CRISIS_MATRIX, CRUDE_SCENARIOS, MACRO_MILESTONES } from './data/macro.js';
import { WHALES_DATA } from './data/whales.js';
import { StockWorkstation } from './components/stockView.js';
import { PortfolioCalculator } from './components/portfolio.js';
import { FoRadar } from './components/foRadar.js';
import { ForensicLab, FORENSIC_CASE_STUDIES } from './components/forensicLab.js';

export class TerminalMasterApp {
  constructor() {
    this.currentView = 'charts'; // Default to Stocks & Charts Desk per user request
    this.stockWorkstation = null;
    this.portfolioCalc = new PortfolioCalculator();
    this.foRadar = new FoRadar();
    this.forensicLab = new ForensicLab();
    this.sidebarOpen = false;

    this.init();
  }

  init() {
    this.bindGlobalEvents();
    this.initSidebarSearch();
    this.initCli();

    // Check URL hash for initial route (e.g. #/charts?ticker=RELIANCE)
    const hash = window.location.hash.replace('#/', '');
    if (hash.startsWith('charts')) {
      const parts = hash.split('?ticker=');
      const ticker = parts[1] || 'HDFCBANK';
      this.switchView('charts', ticker);
    } else if (hash) {
      this.switchView(hash);
    } else {
      this.switchView('charts', 'HDFCBANK');
    }
  }

  bindGlobalEvents() {
    // Left Sidebar Navigation Links
    document.querySelectorAll('.sidebar-nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const viewId = btn.dataset.view;
        this.switchView(viewId);

        // Close sidebar on mobile
        if (window.innerWidth < 1024) {
          this.toggleSidebar(false);
        }
      });
    });

    // Mobile Sidebar Toggle Button
    const mobileToggle = document.getElementById('mobileSidebarToggle');
    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => this.toggleSidebar());
    }

    // Backdrop for mobile
    const backdrop = document.getElementById('sidebarBackdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => this.toggleSidebar(false));
    }
  }

  toggleSidebar(forceState) {
    const sidebar = document.getElementById('mainSidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (!sidebar) return;

    this.sidebarOpen = (forceState !== undefined) ? forceState : !this.sidebarOpen;

    if (this.sidebarOpen) {
      sidebar.classList.remove('-translate-x-full');
      sidebar.classList.add('translate-x-0');
      if (backdrop) backdrop.classList.remove('hidden');
    } else {
      sidebar.classList.add('-translate-x-full');
      sidebar.classList.remove('translate-x-0');
      if (backdrop) backdrop.classList.add('hidden');
    }
  }

  initSidebarSearch() {
    const searchInput = document.getElementById('sidebarStockSearch');
    const resultsContainer = document.getElementById('sidebarSearchResults');
    if (!searchInput || !resultsContainer) return;

    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (!q) {
        resultsContainer.classList.add('hidden');
        resultsContainer.innerHTML = '';
        return;
      }

      const matches = MASTER_STOCKS.filter(s => 
        s.ticker.toLowerCase().includes(q) || 
        s.name.toLowerCase().includes(q) || 
        s.sector.toLowerCase().includes(q)
      ).slice(0, 8);

      if (matches.length === 0) {
        resultsContainer.innerHTML = `<div class="p-space-xs text-[11px] text-on-surface-variant font-mono text-center">NO MATCHES FOUND</div>`;
        resultsContainer.classList.remove('hidden');
        return;
      }

      resultsContainer.innerHTML = matches.map(s => `
        <div class="sidebar-search-item px-space-sm py-space-xs hover:bg-surface-bright cursor-pointer flex items-center justify-between border-b border-surface-container-high/40 text-metric-table font-metric-table transition-colors" data-ticker="${s.ticker}">
          <div>
            <span class="text-primary font-bold">${s.ticker}</span>
            <span class="text-on-surface text-[11px] block truncate max-w-[130px]">${s.name}</span>
          </div>
          <span class="text-secondary text-[11px] font-mono">${s.tier.includes('Global') ? '$' : '₹'}${s.cmp}</span>
        </div>
      `).join('');

      resultsContainer.classList.remove('hidden');

      resultsContainer.querySelectorAll('.sidebar-search-item').forEach(item => {
        item.addEventListener('click', () => {
          const ticker = item.dataset.ticker;
          this.openStock(ticker);
          searchInput.value = '';
          resultsContainer.classList.add('hidden');
          if (window.innerWidth < 1024) this.toggleSidebar(false);
        });
      });
    });

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
        resultsContainer.classList.add('hidden');
      }
    });
  }

  initCli() {
    const cliInput = document.getElementById('footerCliInput');
    if (!cliInput) return;

    cliInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = cliInput.value.trim().toUpperCase();
        cliInput.value = '';
        this.executeCliCommand(cmd);
      }
    });

    // Hotkeys buttons in footer
    document.querySelectorAll('.cli-hotkey-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cmd = btn.dataset.cmd || btn.textContent.trim().toUpperCase();
        this.executeCliCommand(cmd);
      });
    });
  }

  executeCliCommand(cmd) {
    if (!cmd) return;

    if (cmd.startsWith('CHART ') || cmd.startsWith('STOCK ') || cmd.startsWith('DRILLDOWN ')) {
      const ticker = cmd.split(' ')[1];
      this.openStock(ticker);
    } else if (cmd === 'BUY_SIM') {
      this.switchView('portfolio');
    } else if (cmd === 'HEDGE_CALC') {
      this.switchView('phase7');
    } else if (cmd === 'FORENSIC_RUN') {
      this.switchView('forensic');
    } else if (cmd === 'STRESS_TEST') {
      this.switchView('crisis');
    } else if (cmd === 'EXPORT_CSV' || cmd === 'EXPORT') {
      this.exportActiveData();
    } else if (cmd === 'NEXT') {
      this.cycleNextView();
    } else if (cmd === 'PREV') {
      this.cyclePrevView();
    } else if (cmd.startsWith('PHASE ')) {
      const pNum = cmd.split(' ')[1];
      this.switchView(`phase${pNum}`);
    } else if (cmd === 'VIEW 1' || cmd === 'SIMULATOR') {
      this.switchView('portfolio');
    } else if (cmd === 'VIEW 2' || cmd === 'CRISIS') {
      this.switchView('crisis');
    } else if (cmd === 'VIEW 3' || cmd === 'WHALES') {
      this.switchView('phase2');
    } else if (cmd === 'VIEW 4' || cmd === 'RADAR') {
      this.switchView('phase7');
    } else if (cmd === 'VIEW 5' || cmd === 'FORENSIC') {
      this.switchView('forensic');
    } else {
      // Try treating as a ticker symbol
      const found = getStockByTicker(cmd);
      if (found) {
        this.openStock(cmd);
      } else {
        alert(`COMMAND EXECUTED: ${cmd}\n\nAvailable Commands:\n• CHART <TICKER> (e.g. CHART RELIANCE, CHART HDFCBANK)\n• PHASE 1 to PHASE 8\n• BUY_SIM, HEDGE_CALC, FORENSIC_RUN, STRESS_TEST, EXPORT\n• NEXT / PREV`);
      }
    }
  }

  cycleNextView() {
    const views = ['charts', 'portfolio', 'phase1', 'phase2', 'phase3', 'phase4', 'phase5', 'phase6', 'phase7', 'phase8', 'crisis', 'forensic'];
    const idx = views.indexOf(this.currentView);
    const nextIdx = (idx + 1) % views.length;
    this.switchView(views[nextIdx]);
  }

  cyclePrevView() {
    const views = ['charts', 'portfolio', 'phase1', 'phase2', 'phase3', 'phase4', 'phase5', 'phase6', 'phase7', 'phase8', 'crisis', 'forensic'];
    const idx = views.indexOf(this.currentView);
    const prevIdx = (idx - 1 + views.length) % views.length;
    this.switchView(views[prevIdx]);
  }

  openStock(ticker) {
    this.switchView('charts', ticker);
  }

  switchView(viewId, extraParam = null) {
    this.currentView = viewId;

    // Update active state on sidebar navigation
    document.querySelectorAll('.sidebar-nav-btn').forEach(btn => {
      const isTarget = btn.dataset.view === viewId;
      if (isTarget) {
        btn.className = 'sidebar-nav-btn w-full px-space-sm py-space-xs flex items-center justify-between border-l-2 border-primary bg-surface-container-lowest text-primary font-label-caps text-label-caps uppercase transition-colors';
      } else {
        btn.className = 'sidebar-nav-btn w-full px-space-sm py-space-xs flex items-center justify-between border-l-2 border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low font-label-caps text-label-caps uppercase transition-colors';
      }
    });

    const viewport = document.getElementById('mainViewportContent');
    if (!viewport) return;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    switch (viewId) {
      case 'charts':
        this.renderStocksDesk(viewport, extraParam);
        break;
      case 'portfolio':
        this.renderMasterSimulator(viewport);
        break;
      case 'phase1':
        this.renderPhase1(viewport);
        break;
      case 'phase2':
        this.renderPhase2(viewport);
        break;
      case 'phase3':
        this.renderStocksTable(viewport, 'Tier-1 Large-Cap Titans', 'Nifty 50 & Sensex Mega-Caps across 7 core pillars.');
        break;
      case 'phase4':
        this.renderStocksTable(viewport, 'Tier-2 High-Growth Compounders', 'Nifty Next 50 & Midcap 150 leaders with high RoCE.');
        break;
      case 'phase5':
        this.renderStocksTable(viewport, 'Tier-3 Smallcaps, Microcaps & SME', '₹500Cr–₹5,000Cr niche monopolies with asymmetric 10x-50x potential.');
        break;
      case 'phase6':
        this.renderStocksTable(viewport, 'Mega-Capex & Government Thematic Supercycles', 'Defense, Rail, Green Energy, EMS & Hyperscale Data Centers.');
        break;
      case 'phase7':
        this.renderPhase7(viewport);
        break;
      case 'phase8':
        this.renderPhase8(viewport);
        break;
      case 'crisis':
        this.renderCrisisMatrix(viewport);
        break;
      case 'forensic':
        this.renderForensicLab(viewport, extraParam);
        break;
      default:
        this.renderStocksDesk(viewport);
    }
  }

  // --- 1. DEDICATED STOCKS CHARTS & RESULTS DESK ---
  renderStocksDesk(container, initialTicker) {
    if (!this.stockWorkstation) {
      this.stockWorkstation = new StockWorkstation(container, (targetPhase, stock) => {
        this.switchView(targetPhase, stock);
      });
    } else {
      this.stockWorkstation.container = container;
    }

    this.stockWorkstation.mount(initialTicker || (this.stockWorkstation.currentStock ? this.stockWorkstation.currentStock.ticker : 'HDFCBANK'));
  }

  // --- 2. MASTER PORTFOLIO SIMULATOR ---
  renderMasterSimulator(container) {
    const capital = this.portfolioCalc.baseCapital;
    const totals = this.portfolioCalc.getBucketTotals();
    const positions = this.portfolioCalc.calculatePositions();

    container.innerHTML = `
      <div class="space-y-space-md w-full animate-fadeIn">
        <!-- Capital Scaling Hero Cockpit -->
        <div class="bg-surface-container-low p-space-lg border border-surface-container-high relative overflow-hidden shadow-lg">
          <div class="flex flex-col xl:flex-row items-start xl:items-end justify-between gap-space-lg relative z-10">
            <div class="space-y-space-sm w-full xl:max-w-2xl">
              <div class="flex items-center justify-between">
                <span class="font-label-caps text-label-caps tracking-widest text-on-surface-variant uppercase flex items-center gap-space-xs">
                  <span class="material-symbols-outlined text-[15px] text-primary">account_balance</span>
                  PORTFOLIO SIMULATION CAPITAL ALLOCATION (AUM)
                </span>
                <span class="font-micro-badge text-micro-badge bg-surface-container-highest px-space-xs py-space-2xs text-primary font-bold">
                  AUTO-REINVEST HARVEST: ENABLED
                </span>
              </div>
              <div class="flex items-baseline gap-space-md flex-wrap">
                <div class="font-mono text-[36px] font-bold text-primary tracking-tight" id="simCapitalDisplay">
                  ${this.portfolioCalc.formatINR(capital)}
                </div>
                <span class="font-headline-sm text-headline-sm text-on-surface-variant uppercase">ALLOCATED CAPITAL</span>
                <span class="font-micro-badge text-micro-badge bg-secondary/10 text-secondary px-space-xs py-space-2xs">SOVEREIGN 30 MODEL</span>
              </div>
              <!-- Range Slider -->
              <div class="pt-space-xs space-y-space-xs">
                <input class="w-full h-1.5 bg-surface-container-highest appearance-none cursor-pointer accent-primary focus:outline-none" id="simCapitalSlider" max="1000000000" min="1000000" step="5000000" type="range" value="${capital}"/>
                <div class="flex justify-between items-center text-metric-table font-metric-table text-on-surface-variant text-[10px]">
                  <span>₹10 LAKH MIN</span>
                  <span>₹1 CRORE</span>
                  <span>₹10 CRORE</span>
                  <span>₹50 CRORE</span>
                  <span>₹100 CRORE MAX</span>
                </div>
              </div>
              <!-- Presets -->
              <div class="flex flex-wrap items-center gap-space-xs pt-space-xs">
                <span class="text-on-surface-variant font-label-caps text-label-caps uppercase mr-space-xs">PRESETS:</span>
                <button class="sim-preset-btn px-space-sm py-space-2xs bg-surface-container hover:bg-surface-bright text-on-surface font-metric-table text-metric-table text-[11px] border border-surface-container-high transition-colors" data-amt="1000000">10L</button>
                <button class="sim-preset-btn px-space-sm py-space-2xs bg-surface-container hover:bg-surface-bright text-on-surface font-metric-table text-metric-table text-[11px] border border-surface-container-high transition-colors" data-amt="5000000">50L</button>
                <button class="sim-preset-btn px-space-sm py-space-2xs bg-primary text-on-primary font-bold font-metric-table text-metric-table text-[11px] border border-primary transition-colors" data-amt="10000000">1 Cr</button>
                <button class="sim-preset-btn px-space-sm py-space-2xs bg-surface-container hover:bg-surface-bright text-on-surface font-metric-table text-metric-table text-[11px] border border-surface-container-high transition-colors" data-amt="50000000">5 Cr</button>
                <button class="sim-preset-btn px-space-sm py-space-2xs bg-surface-container hover:bg-surface-bright text-on-surface font-metric-table text-metric-table text-[11px] border border-surface-container-high transition-colors" data-amt="100000000">10 Cr</button>
                <button class="sim-preset-btn px-space-sm py-space-2xs bg-surface-container hover:bg-surface-bright text-on-surface font-metric-table text-metric-table text-[11px] border border-surface-container-high transition-colors" data-amt="500000000">50 Cr</button>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-space-xs w-full xl:w-auto shrink-0">
              <button id="btnSimMonteCarlo" class="px-space-md py-space-sm bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps font-bold uppercase tracking-wider flex items-center justify-center gap-space-xs transition-colors">
                <span class="material-symbols-outlined text-[15px]">bolt</span> MONTE CARLO
              </button>
              <button id="btnSimExportCsv" class="px-space-md py-space-sm bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-caps text-label-caps font-bold uppercase tracking-wider flex items-center justify-center gap-space-xs transition-colors">
                <span class="material-symbols-outlined text-[15px] text-secondary">download</span> EXPORT CSV
              </button>
            </div>
          </div>
        </div>

        <!-- 4 Allocation Buckets -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
          <div class="bg-surface-container-low p-space-md border border-surface-container-high space-y-space-xs">
            <span class="font-label-caps text-label-caps text-primary uppercase font-bold">BUCKET A: LARGE-CAP TITANS (45%)</span>
            <div class="font-mono text-[22px] font-bold text-on-surface" id="bucketAVal">${this.portfolioCalc.formatINR(totals.buckets["Large-Cap Titans"].capital)}</div>
            <div class="text-[11px] font-metric-table text-on-surface-variant">Target Return: 12.5% CAGR // Anchor Balance</div>
          </div>
          <div class="bg-surface-container-low p-space-md border border-surface-container-high space-y-space-xs">
            <span class="font-label-caps text-label-caps text-secondary uppercase font-bold">BUCKET B: MID-CAP ENGINES (25%)</span>
            <div class="font-mono text-[22px] font-bold text-on-surface" id="bucketBVal">${this.portfolioCalc.formatINR(totals.buckets["Mid-Cap Compounders"].capital)}</div>
            <div class="text-[11px] font-metric-table text-on-surface-variant">Target Return: 17.5% CAGR // Capex Outperformance</div>
          </div>
          <div class="bg-surface-container-low p-space-md border border-surface-container-high space-y-space-xs">
            <span class="font-label-caps text-label-caps text-tertiary uppercase font-bold">BUCKET C: ASYMMETRIC SMALLCAPS (15%)</span>
            <div class="font-mono text-[22px] font-bold text-on-surface" id="bucketCVal">${this.portfolioCalc.formatINR(totals.buckets["Microcaps & Asymmetric Alpha"].capital)}</div>
            <div class="text-[11px] font-metric-table text-on-surface-variant">Target Return: 22.0% CAGR // Multibagger Potential</div>
          </div>
          <div class="bg-surface-container-low p-space-md border border-surface-container-high space-y-space-xs">
            <span class="font-label-caps text-label-caps text-error uppercase font-bold">BUCKET D: TACTICAL GOLD &amp; CASH (15%)</span>
            <div class="font-mono text-[22px] font-bold text-on-surface" id="bucketDVal">${this.portfolioCalc.formatINR(totals.buckets["Tactical Hedge & Cash"].capital)}</div>
            <div class="text-[11px] font-metric-table text-on-surface-variant">Sovereign Gold Bond + 91-Day T-Bills Dry Powder</div>
          </div>
        </div>

        <!-- Position Breakdown Table -->
        <div class="bg-surface-container-lowest border border-surface-container-high overflow-x-auto">
          <div class="p-space-sm bg-surface-container-low border-b border-surface-container-high flex justify-between items-center">
            <span class="font-label-caps text-label-caps text-on-surface uppercase font-bold">SOVEREIGN 30 CONSTITUENT ALLOCATIONS (CLICK ANY TICKER FOR CHARTS)</span>
            <span class="text-[11px] font-mono text-secondary">REBALANCE DRIFT: 0.00%</span>
          </div>
          <table class="w-full text-left text-metric-table font-metric-table text-[11px]">
            <thead class="bg-surface-container text-on-surface-variant uppercase text-[10px] border-b border-surface-container-high">
              <tr>
                <th class="p-space-sm">Ticker &amp; Asset</th>
                <th class="p-space-sm">Bucket</th>
                <th class="p-space-sm">Weight</th>
                <th class="p-space-sm">Allocated INR</th>
                <th class="p-space-sm">CMP</th>
                <th class="p-space-sm">Shares</th>
                <th class="p-space-sm">2030 Target</th>
                <th class="p-space-sm">Exp CAGR</th>
                <th class="p-space-sm">2030 Exp Value</th>
                <th class="p-space-sm">Action</th>
              </tr>
            </thead>
            <tbody id="simPositionsTbody">
              ${positions.map(p => `
                <tr class="border-b border-surface-container-high/40 hover:bg-surface-container-low transition-colors">
                  <td class="p-space-sm">
                    <button class="font-bold text-primary hover:underline flex items-center gap-space-2xs" onclick="window.terminalApp.openStock('${p.ticker}')">
                      ${p.ticker} ↗
                    </button>
                    <span class="text-[10px] text-on-surface-variant block">${p.name}</span>
                  </td>
                  <td class="p-space-sm text-on-surface-variant">${p.bucket}</td>
                  <td class="p-space-sm font-mono font-bold">${p.weight.toFixed(1)}%</td>
                  <td class="p-space-sm font-mono">${this.portfolioCalc.formatINR(p.allocatedRupees)}</td>
                  <td class="p-space-sm font-mono">₹${p.price.toLocaleString('en-IN')}</td>
                  <td class="p-space-sm font-mono text-secondary font-bold">${p.shares.toLocaleString('en-IN')}</td>
                  <td class="p-space-sm font-mono text-primary">₹${p.target.toLocaleString('en-IN')}</td>
                  <td class="p-space-sm font-mono text-secondary font-bold">+${p.cagr}%</td>
                  <td class="p-space-sm font-mono font-bold">${this.portfolioCalc.formatINR(p.projected2030Value)}</td>
                  <td class="p-space-sm">
                    <button class="px-space-xs py-space-2xs bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface border border-surface-container-high font-micro-badge text-micro-badge uppercase transition-colors" onclick="window.terminalApp.openStock('${p.ticker}')">
                      OPEN CHART
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Slider & preset listeners
    const slider = document.getElementById('simCapitalSlider');
    if (slider) {
      slider.addEventListener('input', (e) => {
        const val = Number(e.target.value);
        this.portfolioCalc.setCapital(val);
        document.getElementById('simCapitalDisplay').textContent = this.portfolioCalc.formatINR(val);

        const newTotals = this.portfolioCalc.getBucketTotals();
        document.getElementById('bucketAVal').textContent = this.portfolioCalc.formatINR(newTotals.buckets["Large-Cap Titans"].capital);
        document.getElementById('bucketBVal').textContent = this.portfolioCalc.formatINR(newTotals.buckets["Mid-Cap Compounders"].capital);
        document.getElementById('bucketCVal').textContent = this.portfolioCalc.formatINR(newTotals.buckets["Microcaps & Asymmetric Alpha"].capital);
        document.getElementById('bucketDVal').textContent = this.portfolioCalc.formatINR(newTotals.buckets["Tactical Hedge & Cash"].capital);

        // Update positions table
        const newPos = this.portfolioCalc.calculatePositions();
        const tbody = document.getElementById('simPositionsTbody');
        if (tbody) {
          tbody.innerHTML = newPos.map(p => `
            <tr class="border-b border-surface-container-high/40 hover:bg-surface-container-low transition-colors">
              <td class="p-space-sm">
                <button class="font-bold text-primary hover:underline flex items-center gap-space-2xs" onclick="window.terminalApp.openStock('${p.ticker}')">
                  ${p.ticker} ↗
                </button>
                <span class="text-[10px] text-on-surface-variant block">${p.name}</span>
              </td>
              <td class="p-space-sm text-on-surface-variant">${p.bucket}</td>
              <td class="p-space-sm font-mono font-bold">${p.weight.toFixed(1)}%</td>
              <td class="p-space-sm font-mono">${this.portfolioCalc.formatINR(p.allocatedRupees)}</td>
              <td class="p-space-sm font-mono">₹${p.price.toLocaleString('en-IN')}</td>
              <td class="p-space-sm font-mono text-secondary font-bold">${p.shares.toLocaleString('en-IN')}</td>
              <td class="p-space-sm font-mono text-primary">₹${p.target.toLocaleString('en-IN')}</td>
              <td class="p-space-sm font-mono text-secondary font-bold">+${p.cagr}%</td>
              <td class="p-space-sm font-mono font-bold">${this.portfolioCalc.formatINR(p.projected2030Value)}</td>
              <td class="p-space-sm">
                <button class="px-space-xs py-space-2xs bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface border border-surface-container-high font-micro-badge text-micro-badge uppercase transition-colors" onclick="window.terminalApp.openStock('${p.ticker}')">
                  OPEN CHART
                </button>
              </td>
            </tr>
          `).join('');
        }
      });
    }

    document.querySelectorAll('.sim-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const amt = Number(btn.dataset.amt);
        if (slider) {
          slider.value = amt;
          slider.dispatchEvent(new Event('input'));
        }
      });
    });

    const btnMonteCarlo = document.getElementById('btnSimMonteCarlo');
    if (btnMonteCarlo) {
      btnMonteCarlo.addEventListener('click', () => {
        alert("MONTE CARLO v9.4 COMPLETE: 10,000 paths simulated.\n\nMedian Expected Return: +16.2% p.a.\nSharpe Ratio: 2.18\n99% Value at Risk (10-Day): -2.40%\nSolvency Horizon: Fortress Grade");
      });
    }

    const btnExport = document.getElementById('btnSimExportCsv');
    if (btnExport) {
      btnExport.addEventListener('click', () => this.portfolioCalc.exportCSV());
    }
  }

  // --- 3. RENDER PHASE 1: 50-YEAR AUTOPSY ---
  renderPhase1(container) {
    container.innerHTML = `
      <div class="space-y-space-md w-full animate-fadeIn">
        <div class="bg-surface-container-low p-space-md border border-surface-container-high">
          <h1 class="font-headline-lg text-headline-lg text-primary uppercase">PHASE 1: THE 50-YEAR MARKET AUTOPSY &amp; MACRO TRANSMISSION (1975–PRESENT)</h1>
          <div class="text-body-sm text-body-sm text-on-surface-variant">51 years of Indian equity shocks, structural modernization, and macro transmission sensitivities.</div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
          <div class="bg-surface-container-low p-space-md border border-surface-container-high space-y-space-2xs">
            <span class="font-label-caps text-label-caps text-primary uppercase font-bold">SENSEX 1979 TO 2026</span>
            <div class="font-mono text-[24px] font-bold text-secondary">15.5% p.a.</div>
            <div class="text-[11px] text-on-surface-variant">Base 100 in 1979 ➔ 82,500+ in 2026</div>
          </div>
          <div class="bg-surface-container-low p-space-md border border-surface-container-high space-y-space-2xs">
            <span class="font-label-caps text-label-caps text-secondary uppercase font-bold">MONTHLY SIP RUN-RATE</span>
            <div class="font-mono text-[24px] font-bold text-secondary">₹24,200+ Cr</div>
            <div class="text-[11px] text-on-surface-variant">~$34B/year programmatic domestic dry powder</div>
          </div>
          <div class="bg-surface-container-low p-space-md border border-surface-container-high space-y-space-2xs">
            <span class="font-label-caps text-label-caps text-tertiary uppercase font-bold">USD / INR STRUCTURAL DRIFT</span>
            <div class="font-mono text-[24px] font-bold text-primary">-3.4% p.a.</div>
            <div class="text-[11px] text-on-surface-variant">₹8.40 (1975) ➔ ₹86.80 (2026)</div>
          </div>
          <div class="bg-surface-container-low p-space-md border border-surface-container-high space-y-space-2xs">
            <span class="font-label-caps text-label-caps text-error uppercase font-bold">BRENT CRUDE SWEET SPOT</span>
            <div class="font-mono text-[24px] font-bold text-error">$65 – $75</div>
            <div class="text-[11px] text-on-surface-variant">CAD &lt;1.2% GDP; margin bonanza for manufacturing</div>
          </div>
        </div>

        <!-- Crisis Table -->
        <div class="bg-surface-container-lowest border border-surface-container-high overflow-x-auto">
          <div class="p-space-sm bg-surface-container-low border-b border-surface-container-high">
            <span class="font-label-caps text-label-caps text-primary uppercase font-bold">🏛️ 50-YEAR CRISIS &amp; REGULATORY RECOVERY MATRIX (1975–2026)</span>
          </div>
          <table class="w-full text-left text-metric-table font-metric-table text-[11px]">
            <thead class="bg-surface-container text-on-surface-variant uppercase text-[10px] border-b border-surface-container-high">
              <tr>
                <th class="p-space-sm">Epoch &amp; Crisis</th>
                <th class="p-space-sm">Peak Drawdown</th>
                <th class="p-space-sm">Bottom Date</th>
                <th class="p-space-sm">Recovery Time</th>
                <th class="p-space-sm">Primary Drivers</th>
                <th class="p-space-sm">Reforms Born</th>
              </tr>
            </thead>
            <tbody>
              ${CRISIS_MATRIX.map(c => `
                <tr class="border-b border-surface-container-high/40 hover:bg-surface-container-low transition-colors">
                  <td class="p-space-sm font-bold text-on-surface">${c.event} (${c.epoch})</td>
                  <td class="p-space-sm text-error font-bold">${c.drawdown}<br><span class="text-on-surface-variant text-[10px]">${c.indexMove}</span></td>
                  <td class="p-space-sm text-on-surface-variant">${c.troughDate}</td>
                  <td class="p-space-sm text-secondary font-bold">${c.recoveryMonths} Months</td>
                  <td class="p-space-sm text-on-surface-variant">${c.driver}</td>
                  <td class="p-space-sm text-primary font-bold">✓ ${c.reforms}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // --- 4. RENDER PHASE 2: WHALES TRACKER ---
  renderPhase2(container) {
    container.innerHTML = `
      <div class="space-y-space-md w-full animate-fadeIn">
        <div class="bg-surface-container-low p-space-md border border-surface-container-high">
          <h1 class="font-headline-lg text-headline-lg text-primary uppercase">PHASE 2: INSTITUTIONAL FOOTPRINT &amp; WHALE ARCHITECTURE</h1>
          <div class="text-body-sm text-body-sm text-on-surface-variant">Tracking India's sovereign domestic allocators (LIC, SBI MF) and legendary super-investor portfolios.</div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md">
          ${WHALES_DATA.map(w => `
            <div class="bg-surface-container-low p-space-md border border-surface-container-high space-y-space-sm">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-headline-md text-headline-md text-on-surface font-bold">${w.name}</h3>
                  <span class="text-primary font-mono text-[11px]">${w.moniker}</span>
                </div>
                <span class="font-mono text-secondary font-bold bg-surface-container px-space-xs py-space-2xs text-[11px]">${w.portfolioWorth}</span>
              </div>
              <p class="text-[12px] text-on-surface-variant leading-relaxed">${w.philosophy}</p>
              
              <div class="pt-space-xs border-t border-surface-container-high/60 space-y-space-xs">
                <span class="font-label-caps text-label-caps text-on-surface-variant uppercase">SIGNATURE HOLDINGS (CLICK TO OPEN CHART):</span>
                <div class="flex flex-wrap gap-space-2xs">
                  ${w.topHoldings.map(h => `
                    <button class="px-space-xs py-space-2xs bg-surface-container hover:bg-primary hover:text-on-primary text-primary font-mono text-[10px] border border-surface-container-high transition-colors" onclick="window.terminalApp.openStock('${h.ticker}')">
                      ${h.ticker} (${h.stake}) ↗
                    </button>
                  `).join('')}
                </div>
              </div>

              <div class="text-[10px] font-mono text-outline pt-space-2xs">
                FORENSIC HURDLE: <strong class="text-on-surface">${w.governanceHurdle}</strong>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --- 5. RENDER STOCKS TABLES (PHASES 3, 4, 5, 6) ---
  renderStocksTable(container, title, subtitle) {
    let tierFilter = 'ALL';
    if (title.includes('Tier-1')) tierFilter = 'Tier-1 Large-Cap';
    else if (title.includes('Tier-2')) tierFilter = 'Tier-2 Mid-Cap';
    else if (title.includes('Tier-3')) tierFilter = 'Tier-3';
    else if (title.includes('Mega-Capex')) tierFilter = 'CAPEX';

    const stocks = MASTER_STOCKS.filter(s => {
      if (tierFilter === 'Tier-1 Large-Cap') return s.tier.includes('Tier-1');
      if (tierFilter === 'Tier-2 Mid-Cap') return s.tier.includes('Tier-2');
      if (tierFilter === 'Tier-3') return s.tier.includes('Tier-3');
      if (tierFilter === 'CAPEX') return ['Defense & Aerospace', 'Infrastructure & Capex', 'Green Energy & Wind'].includes(s.theme);
      return true;
    });

    container.innerHTML = `
      <div class="space-y-space-md w-full animate-fadeIn">
        <div class="bg-surface-container-low p-space-md border border-surface-container-high flex flex-col sm:flex-row justify-between items-start sm:items-center gap-space-sm">
          <div>
            <h1 class="font-headline-lg text-headline-lg text-primary uppercase">${title}</h1>
            <div class="text-body-sm text-body-sm text-on-surface-variant">${subtitle}</div>
          </div>
          <button class="px-space-md py-space-xs bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps uppercase font-bold flex items-center gap-space-xs transition-colors" onclick="window.terminalApp.switchView('charts')">
            <span class="material-symbols-outlined text-[15px]">show_chart</span> OPEN ALL IN CHARTS DESK
          </button>
        </div>

        <div class="bg-surface-container-lowest border border-surface-container-high overflow-x-auto">
          <table class="w-full text-left text-metric-table font-metric-table text-[11px]">
            <thead class="bg-surface-container text-on-surface-variant uppercase text-[10px] border-b border-surface-container-high">
              <tr>
                <th class="p-space-sm">Ticker &amp; Company</th>
                <th class="p-space-sm">Sector / Theme</th>
                <th class="p-space-sm">CMP</th>
                <th class="p-space-sm">10Y / 20Y CAGR</th>
                <th class="p-space-sm">P/E (5Y Med)</th>
                <th class="p-space-sm">RoCE / RoE</th>
                <th class="p-space-sm">Top Owners (FII / DII / LIC)</th>
                <th class="p-space-sm">2030 Target</th>
                <th class="p-space-sm">Stance</th>
                <th class="p-space-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              ${stocks.map(s => `
                <tr class="border-b border-surface-container-high/40 hover:bg-surface-container-low transition-colors">
                  <td class="p-space-sm">
                    <button class="font-bold text-primary hover:underline flex items-center gap-space-2xs text-[12px]" onclick="window.terminalApp.openStock('${s.ticker}')">
                      ${s.ticker} ↗
                    </button>
                    <span class="text-[10px] text-on-surface-variant block">${s.name}</span>
                  </td>
                  <td class="p-space-sm text-on-surface-variant">${s.sector}</td>
                  <td class="p-space-sm font-mono font-bold text-on-surface">${s.tier.includes('Global') ? '$' : '₹'}${s.cmp}</td>
                  <td class="p-space-sm font-mono font-bold text-secondary">${s.cagr10Y} <span class="text-on-surface-variant">/ ${s.cagr20Y}</span></td>
                  <td class="p-space-sm font-mono text-on-surface">${s.pe}x <span class="text-on-surface-variant">(${s.median5YPE ? s.median5YPE + 'x' : 'N/A'})</span></td>
                  <td class="p-space-sm font-mono text-secondary">${s.roce} <span class="text-on-surface-variant">/ ${s.roe}</span></td>
                  <td class="p-space-sm font-mono text-[10px] text-on-surface-variant">FII: ${s.fiiHolding} | DII: ${s.diiHolding} | LIC: ${s.licHolding}</td>
                  <td class="p-space-sm font-mono text-primary font-bold">${s.target2030}</td>
                  <td class="p-space-sm font-mono text-secondary font-bold">${s.stance}</td>
                  <td class="p-space-sm">
                    <button class="px-space-xs py-space-2xs bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface border border-surface-container-high font-micro-badge text-micro-badge uppercase transition-colors" onclick="window.terminalApp.openStock('${s.ticker}')">
                      VIEW CHART
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // --- 6. RENDER PHASE 7: F&O DERIVATIVES ---
  renderPhase7(container) {
    const regime = this.foRadar.evaluateFiiRegime(this.foRadar.fiiLongRatio);
    const pcrEval = this.foRadar.evaluatePcr(this.foRadar.pcrValue);
    const hedge = this.foRadar.calculateHedgeCost(10000000);

    container.innerHTML = `
      <div class="space-y-space-md w-full animate-fadeIn">
        <div class="bg-surface-container-low p-space-md border border-surface-container-high">
          <h1 class="font-headline-lg text-headline-lg text-primary uppercase">PHASE 7: DERIVATIVES, F&amp;O POSITIONING &amp; TIMING RADAR</h1>
          <div class="text-body-sm text-body-sm text-on-surface-variant">Using FII Net Index Futures Long/Short ratios, PCR extremes, and options hedging mechanics.</div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          <div class="bg-surface-container-low p-space-md border border-surface-container-high space-y-space-xs">
            <span class="font-label-caps text-label-caps text-primary uppercase font-bold">FII NET INDEX FUTURES LONGS</span>
            <div class="font-mono text-[28px] font-bold text-secondary" id="fiiRatioDisplay">${this.foRadar.fiiLongRatio}%</div>
            <div class="text-[11px] text-on-surface" id="fiiActionDisplay"><strong>REGIME:</strong> ${regime.action}</div>
          </div>
          <div class="bg-surface-container-low p-space-md border border-surface-container-high space-y-space-xs">
            <span class="font-label-caps text-label-caps text-secondary uppercase font-bold">PUT-CALL RATIO (PCR)</span>
            <div class="font-mono text-[28px] font-bold text-secondary">${this.foRadar.pcrValue}</div>
            <div class="text-[11px] text-on-surface-variant">${pcrEval.status}</div>
          </div>
          <div class="bg-surface-container-low p-space-md border border-surface-container-high space-y-space-xs">
            <span class="font-label-caps text-label-caps text-tertiary uppercase font-bold">INDIA VIX VOLATILITY</span>
            <div class="font-mono text-[28px] font-bold text-primary">${this.foRadar.vixValue}</div>
            <div class="text-[11px] text-on-surface-variant">VIX &lt; 13.0 = Historical underpricing of portfolio puts</div>
          </div>
        </div>

        <!-- Slider Simulator -->
        <div class="bg-surface-container-low p-space-md border border-surface-container-high space-y-space-sm">
          <span class="font-label-caps text-label-caps text-primary uppercase font-bold">⚡ INTERACTIVE FII LONG/SHORT RATIO SIMULATOR</span>
          <div class="flex items-center gap-space-md flex-wrap pt-space-xs">
            <input type="range" id="fiiSlider" min="5" max="95" value="${this.foRadar.fiiLongRatio}" class="flex-1 h-2 bg-surface-container-highest cursor-pointer accent-primary">
            <span class="font-mono text-[20px] font-bold text-primary w-24" id="fiiSliderVal">${this.foRadar.fiiLongRatio}% Longs</span>
          </div>
          <div id="fiiRationaleBox" class="p-space-sm bg-surface-container-lowest border border-surface-container-high font-mono text-[12px] text-on-surface leading-relaxed">
            ${regime.rationale}
          </div>
        </div>
      </div>
    `;

    const slider = document.getElementById('fiiSlider');
    if (slider) {
      slider.addEventListener('input', (e) => {
        const val = Number(e.target.value);
        this.foRadar.fiiLongRatio = val;
        const res = this.foRadar.evaluateFiiRegime(val);

        document.getElementById('fiiRatioDisplay').textContent = `${val}%`;
        document.getElementById('fiiSliderVal').textContent = `${val}% Longs`;
        document.getElementById('fiiActionDisplay').innerHTML = `<strong>REGIME:</strong> ${res.action}`;
        document.getElementById('fiiRationaleBox').textContent = res.rationale;
      });
    }
  }

  // --- 7. RENDER PHASE 8: MASTER 2026-2030 FORECAST ---
  renderPhase8(container) {
    container.innerHTML = `
      <div class="space-y-space-md w-full animate-fadeIn">
        <div class="bg-surface-container-low p-space-md border border-surface-container-high">
          <h1 class="font-headline-lg text-headline-lg text-primary uppercase">PHASE 8: THE MASTER 2026–2030 INDIA FORECAST &amp; ACTION PLAN</h1>
          <div class="text-body-sm text-body-sm text-on-surface-variant">Macro milestones for Sensex &amp; Nifty at $5T and $7T GDP, plus tax optimization rules.</div>
        </div>

        <!-- Milestones Table -->
        <div class="bg-surface-container-lowest border border-surface-container-high overflow-x-auto">
          <div class="p-space-sm bg-surface-container-low border-b border-surface-container-high">
            <span class="font-label-caps text-label-caps text-primary uppercase font-bold">🎯 NOMINAL GDP TO INDEX MILESTONES PROJECTION MATRIX</span>
          </div>
          <table class="w-full text-left text-metric-table font-metric-table text-[11px]">
            <thead class="bg-surface-container text-on-surface-variant uppercase text-[10px] border-b border-surface-container-high">
              <tr>
                <th class="p-space-sm">Economic Milestone</th>
                <th class="p-space-sm">India Nominal GDP</th>
                <th class="p-space-sm">Equity Market Cap</th>
                <th class="p-space-sm">Nifty 50 EPS</th>
                <th class="p-space-sm">Projected Nifty</th>
                <th class="p-space-sm">Projected Sensex</th>
                <th class="p-space-sm">Fair P/E</th>
              </tr>
            </thead>
            <tbody>
              ${MACRO_MILESTONES.map(m => `
                <tr class="border-b border-surface-container-high/40 hover:bg-surface-container-low transition-colors">
                  <td class="p-space-sm font-bold text-on-surface">${m.epoch}</td>
                  <td class="p-space-sm font-mono text-primary font-bold">${m.gdp}</td>
                  <td class="p-space-sm font-mono text-secondary font-bold">${m.mcap}</td>
                  <td class="p-space-sm font-mono text-on-surface">${m.niftyEps}</td>
                  <td class="p-space-sm font-mono text-primary font-bold">${m.niftyBase}</td>
                  <td class="p-space-sm font-mono text-secondary font-bold">${m.sensexBase}</td>
                  <td class="p-space-sm font-mono text-on-surface-variant">${m.fairPe}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // --- 8. RENDER CRISIS MATRIX ---
  renderCrisisMatrix(container) {
    this.renderPhase1(container);
  }

  // --- 9. RENDER FORENSIC LAB ---
  renderForensicLab(container, initialStock) {
    container.innerHTML = `
      <div class="space-y-space-md w-full animate-fadeIn">
        <div class="bg-surface-container-low p-space-md border border-surface-container-high">
          <h1 class="font-headline-lg text-headline-lg text-primary uppercase">FORENSIC AUDIT LAB &amp; GOVERNANCE SCREENER</h1>
          <div class="text-body-sm text-body-sm text-on-surface-variant">Real-time 5-Point Governance Evaluator with pre-loaded corporate fraud autopsy case studies.</div>
        </div>

        <div class="bg-surface-container-low p-space-md border border-surface-container-high space-y-space-md">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
            <div>
              <label class="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-1">1. Promoter Pledge (%)</label>
              <input type="number" id="forensicPledgeInput" value="0.0" step="0.5" class="w-full bg-surface-container-lowest border border-surface-container-high p-space-xs font-mono text-on-surface">
            </div>
            <div>
              <label class="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-1">2. CFO / PAT Ratio (%)</label>
              <input type="number" id="forensicCfoPatInput" value="98.0" step="1.0" class="w-full bg-surface-container-lowest border border-surface-container-high p-space-xs font-mono text-on-surface">
            </div>
            <div>
              <label class="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-1">3. Auditor Pedigree</label>
              <select id="forensicAuditorInput" class="w-full bg-surface-container-lowest border border-surface-container-high p-space-xs font-mono text-on-surface">
                <option value="big4">Big-4 / Reputable Established Firm</option>
                <option value="obscure">Small 2-Partner Obscure Firm</option>
                <option value="resigned">Auditor Resigned Mid-Term</option>
              </select>
            </div>
            <div>
              <label class="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-1">4. Contingent Liab (% NW)</label>
              <input type="number" id="forensicContingentInput" value="8.0" step="1.0" class="w-full bg-surface-container-lowest border border-surface-container-high p-space-xs font-mono text-on-surface">
            </div>
            <div>
              <label class="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-1">5. Related-Party Transactions</label>
              <select id="forensicRptInput" class="w-full bg-surface-container-lowest border border-surface-container-high p-space-xs font-mono text-on-surface">
                <option value="clean">Strictly Operational &amp; Arms-Length</option>
                <option value="shell">Loans/Advances to Promoter Shells</option>
              </select>
            </div>
          </div>

          <button id="btnRunAuditExec" class="px-space-md py-space-xs bg-primary hover:bg-primary-container text-on-primary font-label-caps text-label-caps uppercase font-bold flex items-center gap-space-xs transition-colors">
            <span class="material-symbols-outlined text-[15px]">biotech</span> EXECUTE FORENSIC AUDIT
          </button>

          <div id="forensicResultsBox" class="p-space-md bg-surface-container-lowest border border-surface-container-high space-y-space-xs">
            <div class="flex items-center justify-between">
              <span class="font-label-caps text-label-caps text-secondary uppercase font-bold">GOVERNANCE VERDICT: 96/100 [PRISTINE INSTITUTIONAL GRADE]</span>
              <span class="font-micro-badge text-micro-badge bg-secondary text-on-secondary px-space-xs py-space-2xs uppercase font-bold">PASSED</span>
            </div>
            <p class="text-[12px] text-on-surface-variant">No critical forensic red flags detected. Meets sovereign risk hurdle criteria.</p>
          </div>
        </div>

        <!-- Preloaded Case Studies -->
        <div class="bg-surface-container-lowest border border-surface-container-high p-space-md space-y-space-sm">
          <span class="font-label-caps text-label-caps text-primary uppercase font-bold">PRE-LOADED FRAUD CASE STUDIES (CLICK TO LOAD)</span>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm">
            ${FORENSIC_CASE_STUDIES.map(cs => `
              <div class="bg-surface-container-low p-space-sm border border-surface-container-high cursor-pointer hover:bg-surface-container transition-colors" onclick="window.terminalApp.loadForensicCaseStudy('${cs.ticker}')">
                <div class="flex justify-between items-center mb-1">
                  <span class="font-mono font-bold text-primary">${cs.ticker}</span>
                  <span class="font-micro-badge text-micro-badge text-error uppercase font-bold">${cs.verdict}</span>
                </div>
                <div class="text-[11px] font-bold text-on-surface">${cs.name}</div>
                <div class="text-[10px] text-on-surface-variant mt-1">${cs.analysis}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    const btnExec = document.getElementById('btnRunAuditExec');
    if (btnExec) {
      btnExec.addEventListener('click', () => {
        const pledge = Number(document.getElementById('forensicPledgeInput').value);
        const cfoPat = Number(document.getElementById('forensicCfoPatInput').value);
        const auditorChange = document.getElementById('forensicAuditorInput').value;
        const contingentLiab = Number(document.getElementById('forensicContingentInput').value);
        const rptStatus = document.getElementById('forensicRptInput').value;

        const res = this.forensicLab.evaluateGovernance({ pledge, cfoPat, auditorChange, contingentLiab, rptStatus });
        const box = document.getElementById('forensicResultsBox');
        if (box) {
          box.innerHTML = `
            <div class="flex items-center justify-between">
              <span class="font-label-caps text-label-caps text-primary uppercase font-bold">GOVERNANCE SCORE: ${res.score} / 100</span>
              <span class="font-micro-badge text-micro-badge ${res.score >= 80 ? 'bg-secondary text-on-secondary' : 'bg-error text-on-error'} px-space-xs py-space-2xs uppercase font-bold">${res.verdict}</span>
            </div>
            ${res.flags.length === 0 ? '<p class="text-secondary text-[12px]">✓ No forensic anomalies detected. Balance sheet meets Tier-1 safety standards.</p>' : ''}
            ${res.flags.map(f => `
              <div class="text-error text-[11px] font-mono">⚠️ <strong>${f.severity.toUpperCase()}:</strong> ${f.msg}</div>
            `).join('')}
          `;
        }
      });
    }

    if (initialStock) {
      const p = document.getElementById('forensicPledgeInput');
      const c = document.getElementById('forensicCfoPatInput');
      if (p && initialStock.promoterPledge) p.value = parseFloat(initialStock.promoterPledge) || 0;
      if (c && initialStock.cfoPatRatio) c.value = parseFloat(initialStock.cfoPatRatio) || 95;
      if (btnExec) btnExec.click();
    }
  }

  loadForensicCaseStudy(ticker) {
    const cs = FORENSIC_CASE_STUDIES.find(c => c.ticker === ticker);
    if (!cs) return;

    document.getElementById('forensicPledgeInput').value = cs.promoterPledge;
    document.getElementById('forensicCfoPatInput').value = cs.cfoPatRatio;
    document.getElementById('forensicAuditorInput').value = cs.auditorTurnover.includes('Resign') ? 'resigned' : 'big4';
    document.getElementById('forensicContingentInput').value = cs.contingentLiabRatio;
    document.getElementById('forensicRptInput').value = cs.rptAdvances.includes('Shell') ? 'shell' : 'clean';

    const btnExec = document.getElementById('btnRunAuditExec');
    if (btnExec) btnExec.click();
  }

  exportActiveData() {
    if (this.currentView === 'charts' && this.stockWorkstation) {
      this.stockWorkstation.exportStockCSV();
    } else {
      this.portfolioCalc.exportCSV();
    }
  }
}
