/**
 * BHARAT ALPHA TERMINAL (2026-2030) - MASTER APPLICATION CONTROLLER
 */

import { STOCKS_DATA } from './data/stocks.js';
import { CRISIS_MATRIX, CRUDE_SCENARIOS, MACRO_MILESTONES } from './data/macro.js';
import { WHALES_DATA } from './data/whales.js';
import { TerminalConsole } from './components/console.js';
import { PortfolioCalculator, MODEL_PORTFOLIO_ASSETS } from './components/portfolio.js';
import { FoRadar } from './components/foRadar.js';
import { ForensicLab, FORENSIC_CASE_STUDIES } from './components/forensicLab.js';

class BharatTerminalApp {
  constructor() {
    this.currentPhase = 'portfolio'; // Default to actionable portfolio
    this.theme = localStorage.getItem('bharat_theme') || 'light';
    this.portfolioCalc = new PortfolioCalculator();
    this.foRadar = new FoRadar();
    this.forensicLab = new ForensicLab();
    this.stockFilter = 'ALL';
    this.stockSearch = '';

    this.init();
  }

  init() {
    this.applyTheme();
    this.initConsole();
    this.bindEvents();
    this.renderPhase(this.currentPhase);
  }

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.innerHTML = this.theme === 'dark' 
        ? '☀️ White-Paper Mode' 
        : '🌙 Bloomberg Dark';
    }
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('bharat_theme', this.theme);
    this.applyTheme();
  }

  initConsole() {
    this.console = new TerminalConsole(this);
    this.console.log("Bharat Alpha Terminal v2.6 Initialized. Institutional Ready.", "success");
    this.console.log("Type [DRILLDOWN: TICKER], [FORENSIC: TICKER], or [WHALES: SECTOR] anytime.", "info");
  }

  bindEvents() {
    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) themeBtn.addEventListener('click', () => this.toggleTheme());

    // Phase Navigation Tabs
    const navButtons = document.querySelectorAll('.phase-nav-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const phase = btn.dataset.phase;
        this.renderPhase(phase);
      });
    });

    // Modal Close buttons
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => this.closeModals());
    });

    // Close on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) this.closeModals();
      });
    });

    // Esc key close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModals();
    });
  }

  nextPhase() {
    const phases = ['phase1', 'phase2', 'phase3', 'phase4', 'phase5', 'phase6', 'phase7', 'phase8', 'portfolio', 'forensic'];
    const idx = phases.indexOf(this.currentPhase);
    const nextIdx = (idx + 1) % phases.length;
    this.renderPhase(phases[nextIdx]);
  }

  renderPhase(phaseId) {
    this.currentPhase = phaseId;

    // Update active tab in nav
    document.querySelectorAll('.phase-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.phase === phaseId);
    });

    const viewport = document.getElementById('main-viewport');
    if (!viewport) return;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    switch (phaseId) {
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
      case 'portfolio':
        this.renderPortfolioSimulator(viewport);
        break;
      case 'forensic':
        this.renderForensicLab(viewport);
        break;
      default:
        this.renderPortfolioSimulator(viewport);
    }
  }

  // --- RENDER PHASE 1: 50-YEAR MARKET AUTOPSY ---
  renderPhase1(container) {
    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>Phase 1: The 50-Year Market Autopsy & Macro Transmission (1975–Present)</h1>
          <div class="view-subtitle">51 years of Indian equity shocks, structural modernization, and macro transmission sensitivities.</div>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card accent">
          <div class="kpi-header"><span class="kpi-title">Sensex 1979 to 2026</span><span class="kpi-badge badge-accent">47Y CAGR</span></div>
          <div class="kpi-value font-mono">15.5% p.a.</div>
          <div class="kpi-subtitle">Base 100 in 1979 ➔ 82,500+ in 2026</div>
        </div>
        <div class="kpi-card success">
          <div class="kpi-header"><span class="kpi-title">Monthly SIP Run-Rate</span><span class="kpi-badge badge-success">Wall of Cash</span></div>
          <div class="kpi-value font-mono">₹24,200+ Cr</div>
          <div class="kpi-subtitle">~$34B/year programmatic domestic dry powder</div>
        </div>
        <div class="kpi-card gold">
          <div class="kpi-header"><span class="kpi-title">USD / INR Structural Drag</span><span class="kpi-badge badge-gold">Carry Drift</span></div>
          <div class="kpi-value font-mono">-3.4% p.a.</div>
          <div class="kpi-subtitle">₹8.40 (1975) ➔ ₹86.80 (2026)</div>
        </div>
        <div class="kpi-card warning">
          <div class="kpi-header"><span class="kpi-title">Brent Crude Sweet Spot</span><span class="kpi-badge badge-warning">Energy Tax</span></div>
          <div class="kpi-value font-mono">$65 – $75</div>
          <div class="kpi-subtitle">CAD &lt;1.2% GDP; margin bonanza for paints & auto</div>
        </div>
      </div>

      <div class="content-card">
        <h3>🏛️ 50-Year Crisis & Regulatory Recovery Matrix</h3>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Epoch & Crisis</th>
                <th>Peak Drawdown</th>
                <th>Bottom Date</th>
                <th>Recovery Time</th>
                <th>Primary Drivers</th>
                <th>Structural Regulatory Reforms Born</th>
              </tr>
            </thead>
            <tbody>
              ${CRISIS_MATRIX.map(c => `
                <tr>
                  <td><strong>${c.event}</strong> (${c.epoch})</td>
                  <td class="font-mono text-danger"><strong>${c.drawdown}</strong><br><small class="text-muted">${c.indexMove}</small></td>
                  <td>${c.troughDate}</td>
                  <td class="font-mono text-success"><strong>${c.recoveryMonths} Months</strong></td>
                  <td>${c.driver}</td>
                  <td><span class="text-accent">✓</span> ${c.reforms}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="content-card">
        <h3>🛢️ Macro Transmission Mechanics: Nifty 50 vs. Brent Crude</h3>
        <div class="kpi-grid">
          <div class="kpi-card success">
            <div class="kpi-header"><span class="kpi-title">Zone 1: Goldilocks ($60–$75)</span></div>
            <div class="kpi-subtitle"><strong>CAD:</strong> ${CRUDE_SCENARIOS.sweetSpot.cadImpact}</div>
            <div class="kpi-subtitle"><strong>Corporate:</strong> ${CRUDE_SCENARIOS.sweetSpot.corporateImpact}</div>
            <div class="kpi-subtitle font-mono text-success"><strong>Valuation:</strong> ${CRUDE_SCENARIOS.sweetSpot.valuationMultiple}</div>
          </div>
          <div class="kpi-card warning">
            <div class="kpi-header"><span class="kpi-title">Zone 2: Tolerable ($85–$95)</span></div>
            <div class="kpi-subtitle"><strong>CAD:</strong> ${CRUDE_SCENARIOS.frictionPoint.cadImpact}</div>
            <div class="kpi-subtitle"><strong>Corporate:</strong> ${CRUDE_SCENARIOS.frictionPoint.corporateImpact}</div>
            <div class="kpi-subtitle font-mono text-warning"><strong>Valuation:</strong> ${CRUDE_SCENARIOS.frictionPoint.valuationMultiple}</div>
          </div>
          <div class="kpi-card danger">
            <div class="kpi-header"><span class="kpi-title">Zone 3: Stress ($110–$130+)</span></div>
            <div class="kpi-subtitle"><strong>CAD:</strong> ${CRUDE_SCENARIOS.stressZone.cadImpact}</div>
            <div class="kpi-subtitle"><strong>Corporate:</strong> ${CRUDE_SCENARIOS.stressZone.corporateImpact}</div>
            <div class="kpi-subtitle font-mono text-danger"><strong>Valuation:</strong> ${CRUDE_SCENARIOS.stressZone.valuationMultiple}</div>
          </div>
        </div>
      </div>
    `;
  }

  // --- RENDER PHASE 2: INSTITUTIONAL WHALE PLAYBOOKS ---
  renderPhase2(container) {
    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>Phase 2: Institutional Footprint & Whale Tracking Architecture</h1>
          <div class="view-subtitle">Tracking India's sovereign domestic allocators (LIC, SBI MF) and super-investor portfolios.</div>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card accent">
          <div class="kpi-header"><span class="kpi-title">LIC Equity Portfolio</span><span class="kpi-badge badge-accent">Sovereign Whale</span></div>
          <div class="kpi-value font-mono">&gt;₹14.5L Cr</div>
          <div class="kpi-subtitle">Holds &gt;1% in 280+ companies; counter-cyclical buyer</div>
        </div>
        <div class="kpi-card success">
          <div class="kpi-header"><span class="kpi-title">Top 5 Domestic MFs AUM</span><span class="kpi-badge badge-success">DII Power</span></div>
          <div class="kpi-value font-mono">&gt;₹35L Cr</div>
          <div class="kpi-subtitle">SBI, ICICI Pru, HDFC, Nippon, Kotak MFs</div>
        </div>
        <div class="kpi-card gold">
          <div class="kpi-header"><span class="kpi-title">FII Bleed Target #1</span><span class="kpi-badge badge-gold">Liquid ATM</span></div>
          <div class="kpi-value font-mono">Private Banks &amp; IT</div>
          <div class="kpi-subtitle">Absorbs 65%+ of all FII liquidations; DIIs accumulate</div>
        </div>
      </div>

      <div class="content-card">
        <h3>🐋 Super-Investor (Whale) Matrix & Signature Portfolios</h3>
        <div class="kpi-grid" style="grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));">
          ${WHALES_DATA.map(w => `
            <div class="kpi-card">
              <div class="kpi-header">
                <div>
                  <h4 style="font-size:1.05rem; font-weight:800;">${w.name}</h4>
                  <span class="text-accent font-mono" style="font-size:0.75rem;">${w.moniker}</span>
                </div>
                <span class="badge badge-gold font-mono">${w.portfolioWorth}</span>
              </div>
              <p style="font-size:0.82rem; color:var(--text-secondary); margin:0.5rem 0;">${w.philosophy}</p>
              <div style="margin-top:0.5rem;">
                <span class="text-muted" style="font-size:0.72rem; font-weight:700; text-transform:uppercase;">Top Holdings:</span>
                <div style="display:flex; flex-wrap:wrap; gap:0.35rem; margin-top:0.3rem;">
                  ${w.topHoldings.map(h => `
                    <span class="chip-cmd" onclick="window.bharatApp.console.executeCommand('[DRILLDOWN: ${h.ticker}]')">
                      <strong>${h.ticker}</strong>: ${h.name} (${h.stake})
                    </span>
                  `).join('')}
                </div>
              </div>
              <div style="margin-top:0.75rem; font-size:0.75rem; color:var(--text-muted);">
                <strong>Forensic Hurdle:</strong> ${w.governanceHurdle}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --- RENDER STOCKS TABLES (PHASES 3, 4, 5, 6) ---
  renderStocksTable(container, title, subtitle) {
    let tierFilter = 'ALL';
    if (title.includes('Tier-1')) tierFilter = 'Tier-1 Large-Cap';
    else if (title.includes('Tier-2')) tierFilter = 'Tier-2 Mid-Cap';
    else if (title.includes('Tier-3')) tierFilter = 'Tier-3';
    else if (title.includes('Mega-Capex')) tierFilter = 'CAPEX';

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>${title}</h1>
          <div class="view-subtitle">${subtitle}</div>
        </div>
        <div class="view-actions">
          <button class="btn btn-outline" onclick="window.bharatApp.exportPortfolio()">📥 Export Data</button>
        </div>
      </div>

      <div class="table-container">
        <div class="table-toolbar">
          <div class="table-search-box">
            <span>🔍</span>
            <input type="text" id="table-search-input" placeholder="Search by ticker, name, or sector..." value="${this.stockSearch}">
          </div>
          <div class="filter-pill-group">
            <button class="filter-pill ${this.stockFilter === 'ALL' ? 'active' : ''}" data-filter="ALL">All Sectors</button>
            <button class="filter-pill ${this.stockFilter === 'Banking' ? 'active' : ''}" data-filter="Banking">Banking &amp; Fin</button>
            <button class="filter-pill ${this.stockFilter === 'IT' ? 'active' : ''}" data-filter="IT">IT &amp; Tech</button>
            <button class="filter-pill ${this.stockFilter === 'Defense' ? 'active' : ''}" data-filter="Defense">Defense &amp; Aero</button>
            <button class="filter-pill ${this.stockFilter === 'Infrastructure' ? 'active' : ''}" data-filter="Infrastructure">Infra &amp; Capex</button>
            <button class="filter-pill ${this.stockFilter === 'Consumption' ? 'active' : ''}" data-filter="Consumption">Auto &amp; FMCG</button>
          </div>
        </div>

        <table class="data-table" id="stocks-data-table">
          <thead>
            <tr>
              <th>Ticker &amp; Company</th>
              <th>Sector / Theme</th>
              <th>10Y / 20Y CAGR</th>
              <th>P/E (5Y Med)</th>
              <th>RoCE / RoE</th>
              <th>Top Owners (FII / DII / LIC)</th>
              <th>2030 Target</th>
              <th>Stance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="stocks-table-tbody">
            <!-- Dynamic Injection -->
          </tbody>
        </table>
      </div>
    `;

    // Search and filter listeners
    const searchInput = document.getElementById('table-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.stockSearch = e.target.value.toLowerCase();
        this.filterAndRenderStocks(tierFilter);
      });
    }

    const filterPills = document.querySelectorAll('.filter-pill');
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.stockFilter = pill.dataset.filter;
        this.filterAndRenderStocks(tierFilter);
      });
    });

    this.filterAndRenderStocks(tierFilter);
  }

  filterAndRenderStocks(tierFilter) {
    const tbody = document.getElementById('stocks-table-tbody');
    if (!tbody) return;

    let filtered = STOCKS_DATA.filter(s => {
      // Tier match
      if (tierFilter === 'Tier-1 Large-Cap' && !s.tier.includes('Tier-1')) return false;
      if (tierFilter === 'Tier-2 Mid-Cap' && !s.tier.includes('Tier-2')) return false;
      if (tierFilter === 'Tier-3' && !s.tier.includes('Tier-3')) return false;
      if (tierFilter === 'CAPEX' && !['Defense & Aerospace', 'Infrastructure & Capex', 'Green Energy & ESG'].includes(s.theme)) return false;

      // Sector filter
      if (this.stockFilter !== 'ALL') {
        if (!s.sector.toLowerCase().includes(this.stockFilter.toLowerCase()) &&
            !s.theme.toLowerCase().includes(this.stockFilter.toLowerCase())) {
          return false;
        }
      }

      // Search match
      if (this.stockSearch) {
        const text = `${s.ticker} ${s.name} ${s.sector} ${s.theme}`.toLowerCase();
        if (!text.includes(this.stockSearch)) return false;
      }

      return true;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding: 2rem;" class="text-muted">No stocks matched your active filter.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(s => {
      let badgeClass = 'badge-accent';
      if (s.stance.includes('Strong Accumulate') || s.stance.includes('Buy')) badgeClass = 'badge-success';
      else if (s.stance.includes('Hold')) badgeClass = 'badge-warning';
      else if (s.stance.includes('Trim')) badgeClass = 'badge-danger';

      return `
        <tr>
          <td>
            <div class="ticker-cell">
              <span class="ticker-symbol" onclick="window.bharatApp.openDrilldownModal(window.bharatApp.getStock('${s.ticker}'))">
                ${s.ticker} ↗
              </span>
              <span class="ticker-name">${s.name}</span>
            </div>
          </td>
          <td>
            <span class="text-muted" style="font-size:0.75rem;">${s.sector}</span>
          </td>
          <td class="font-mono">
            <strong>${s.cagr10Y}</strong> <span class="text-muted">/ ${s.cagr20Y}</span>
          </td>
          <td class="font-mono">
            <strong>${s.pe}x</strong> <span class="text-muted">(${s.median5YPE || 'N/A'})</span>
          </td>
          <td class="font-mono text-success">
            <strong>${s.roce}</strong> <span class="text-muted">/ ${s.roe}</span>
          </td>
          <td style="font-size:0.75rem;" class="font-mono">
            FII: ${s.fiiHolding} | DII: ${s.diiHolding} | LIC: ${s.licHolding}
          </td>
          <td class="font-mono text-accent">
            <strong>${s.target2030}</strong>
          </td>
          <td>
            <span class="badge ${badgeClass}">${s.stance}</span>
          </td>
          <td>
            <button class="btn btn-outline btn-sm" onclick="window.bharatApp.openDrilldownModal(window.bharatApp.getStock('${s.ticker}'))">Drilldown</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // --- RENDER PHASE 7: F&O DERIVATIVES RADAR ---
  renderPhase7(container) {
    const regime = this.foRadar.evaluateFiiRegime(this.foRadar.fiiLongRatio);
    const pcrEval = this.foRadar.evaluatePcr(this.foRadar.pcrValue);
    const hedge = this.foRadar.calculateHedgeCost(10000000);

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>Phase 7: Derivatives, F&O Positioning & Market Timing Secrets</h1>
          <div class="view-subtitle">Using FII Net Index Futures Long/Short ratios, PCR extremes, and options hedging mechanics.</div>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card ${regime.badgeClass.replace('badge-', '')}">
          <div class="kpi-header"><span class="kpi-title">FII Net Index Futures Longs</span><span class="kpi-badge ${regime.badgeClass}">${regime.regime}</span></div>
          <div class="kpi-value font-mono" id="fii-ratio-display">${this.foRadar.fiiLongRatio}%</div>
          <div class="kpi-subtitle" id="fii-action-display"><strong>Action:</strong> ${regime.action}</div>
        </div>
        <div class="kpi-card accent">
          <div class="kpi-header"><span class="kpi-title">Nifty Put-Call Ratio (PCR)</span><span class="kpi-badge badge-accent">Sentiment</span></div>
          <div class="kpi-value font-mono" id="pcr-display">${this.foRadar.pcrValue}</div>
          <div class="kpi-subtitle" id="pcr-eval-display">${pcrEval.status}</div>
        </div>
        <div class="kpi-card success">
          <div class="kpi-header"><span class="kpi-title">India VIX Volatility</span><span class="kpi-badge badge-success">Options Cheap</span></div>
          <div class="kpi-value font-mono">${this.foRadar.vixValue}</div>
          <div class="kpi-subtitle">VIX &lt; 13.0 = Historical underpricing of portfolio puts</div>
        </div>
      </div>

      <div class="content-card">
        <h3>⚡ Interactive FII Long/Short Simulator</h3>
        <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:1rem;">
          Drag the slider to observe how institutional market makers adjust their risk posture during extreme positioning regimes:
        </p>
        <div style="display:flex; align-items:center; gap:1.5rem; flex-wrap:wrap; margin-bottom:1.5rem;">
          <input type="range" id="fii-slider" min="5" max="95" value="${this.foRadar.fiiLongRatio}" style="flex:1; min-width:240px; height:8px; cursor:pointer;">
          <span class="font-mono" style="font-size:1.2rem; font-weight:800; min-width:80px;" id="slider-val">${this.foRadar.fiiLongRatio}% Longs</span>
        </div>
        <div id="fii-rationale-box" style="padding:1rem; border-radius:var(--radius-md); background:var(--bg-surface-elevated); border:1px solid var(--border-color); font-size:0.85rem;">
          ${regime.rationale}
        </div>
      </div>

      <div class="content-card">
        <h3>🛡️ Institutional Portfolio Hedging Calculator (₹1.00 Crore Portfolio)</h3>
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-header"><span class="kpi-title">Quarterly Far-Put Cost</span></div>
            <div class="kpi-value font-mono">₹${hedge.hedgeCostQuarterly.toLocaleString('en-IN')}</div>
            <div class="kpi-subtitle">Only ~0.75% of capital per 90-day insurance window</div>
          </div>
          <div class="kpi-card success">
            <div class="kpi-header"><span class="kpi-title">Hard Drawdown Floor</span></div>
            <div class="kpi-value font-mono">₹${hedge.downsideFloor.toLocaleString('en-IN')}</div>
            <div class="kpi-subtitle">100% of capital below 5% drawdown is protected</div>
          </div>
          <div class="kpi-card gold">
            <div class="kpi-header"><span class="kpi-title">Payout in 20% Crash</span></div>
            <div class="kpi-value font-mono text-success">+₹${hedge.crashProtectionGain.toLocaleString('en-IN')}</div>
            <div class="kpi-subtitle">Instant cash to deploy into oversold Tier-1 stocks</div>
          </div>
        </div>
      </div>
    `;

    const slider = document.getElementById('fii-slider');
    if (slider) {
      slider.addEventListener('input', (e) => {
        const val = Number(e.target.value);
        this.foRadar.fiiLongRatio = val;
        const res = this.foRadar.evaluateFiiRegime(val);

        document.getElementById('fii-ratio-display').textContent = `${val}%`;
        document.getElementById('slider-val').textContent = `${val}% Longs`;
        document.getElementById('fii-action-display').innerHTML = `<strong>Action:</strong> ${res.action}`;
        document.getElementById('fii-rationale-box').textContent = res.rationale;
      });
    }
  }

  // --- RENDER PHASE 8: MASTER 2026-2030 FORECAST ---
  renderPhase8(container) {
    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>Phase 8: The Master 2026–2030 India Forecast &amp; Action Plan</h1>
          <div class="view-subtitle">Macro milestones for Sensex &amp; Nifty at $5T and $7T GDP, plus tax optimization rules.</div>
        </div>
      </div>

      <div class="content-card">
        <h3>🎯 Nominal GDP to Index Milestones Projection Matrix</h3>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Economic Milestone</th>
                <th>India Nominal GDP</th>
                <th>Listed Equity M-Cap</th>
                <th>Nifty 50 Forward EPS</th>
                <th>Projected Nifty 50</th>
                <th>Projected Sensex</th>
                <th>Target P/E Multiple</th>
              </tr>
            </thead>
            <tbody>
              ${MACRO_MILESTONES.map(m => `
                <tr>
                  <td><strong>${m.epoch}</strong></td>
                  <td class="font-mono">${m.gdp}</td>
                  <td class="font-mono text-accent"><strong>${m.mcap}</strong></td>
                  <td class="font-mono text-success"><strong>${m.niftyEps}</strong></td>
                  <td class="font-mono"><strong>${m.niftyBase}</strong></td>
                  <td class="font-mono"><strong>${m.sensexBase}</strong></td>
                  <td class="font-mono">${m.fairPe}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card accent">
          <div class="kpi-header"><span class="kpi-title">5% Pullback Protocol</span></div>
          <div class="kpi-value font-mono">Deploy 20% Cash</div>
          <div class="kpi-subtitle">Rebalance into Tier-1 Large Caps at 200 EMA</div>
        </div>
        <div class="kpi-card warning">
          <div class="kpi-header"><span class="kpi-title">10% Correction Protocol</span></div>
          <div class="kpi-value font-mono">Deploy 40% Cash</div>
          <div class="kpi-subtitle">Accumulate high-growth Tier-2 midcaps (Polycab, CDSL)</div>
        </div>
        <div class="kpi-card success">
          <div class="kpi-header"><span class="kpi-title">20%+ Flash Crash Protocol</span></div>
          <div class="kpi-value font-mono">Deploy 100% Cash</div>
          <div class="kpi-subtitle">Harvest put hedges; aggressive multi-tier accumulation</div>
        </div>
      </div>

      <div class="content-card">
        <h3>⚖️ Capital Gains Tax Optimization Framework (STCG 20% vs LTCG 12.5%)</h3>
        <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:1rem;">
          Portfolio simulations over a 10-year holding period demonstrate that <strong>excessive portfolio churning reduces cumulative compounding wealth by >41%</strong> due to tax leakage:
        </p>
        <div style="display:flex; gap:1rem; flex-wrap:wrap;">
          <div style="flex:1; min-width:280px; padding:1.25rem; border:1px solid var(--border-color); border-radius:var(--radius-md); background:var(--bg-surface-elevated);">
            <h4 class="text-danger" style="margin-bottom:0.5rem;">Strategy A: Active Churning (&lt;12M Hold)</h4>
            <div class="font-mono" style="font-size:1.4rem; font-weight:800; margin-bottom:0.25rem;">₹3.42 Crore</div>
            <div style="font-size:0.8rem; color:var(--text-muted);">20% STCG friction erodes net CAGR to ~13.1%</div>
          </div>
          <div style="flex:1; min-width:280px; padding:1.25rem; border:1px solid var(--success); border-radius:var(--radius-md); background:var(--success-soft);">
            <h4 class="text-success" style="margin-bottom:0.5rem;">Strategy B: Institutional Buy &amp; Hold</h4>
            <div class="font-mono text-success" style="font-size:1.4rem; font-weight:800; margin-bottom:0.25rem;">₹4.85 Crore</div>
            <div style="font-size:0.8rem; color:var(--text-secondary);">Deferred 12.5% LTCG compounds wealth at ~17.1% net CAGR (+₹1.43 Cr extra wealth!)</div>
          </div>
        </div>
      </div>
    `;
  }

  // --- RENDER PORTFOLIO SIMULATOR: "THE SOVEREIGN 30" ---
  renderPortfolioSimulator(container) {
    const totals = this.portfolioCalc.getBucketTotals();
    const positions = this.portfolioCalc.calculatePositions();

    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>Master Model Portfolio: "The Sovereign 30" (2026–2030)</h1>
          <div class="view-subtitle">Institutional asset allocation blueprint with dynamic capital position-sizing and projected returns.</div>
        </div>
        <div class="view-actions">
          <button class="btn btn-primary" onclick="window.bharatApp.exportPortfolio()">📥 Export Allocation CSV</button>
        </div>
      </div>

      <!-- Capital Scaling Slider -->
      <div class="content-card" style="margin-bottom:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1rem;">
          <div>
            <h3 style="margin-bottom:0.2rem;">💼 Base Capital Deployment</h3>
            <span class="text-muted" style="font-size:0.82rem;">Adjust deployment capital to dynamically scale share counts and cash allotments:</span>
          </div>
          <div class="font-mono" style="font-size:1.6rem; font-weight:800; color:var(--accent-primary);" id="capital-display">
            ${this.portfolioCalc.formatINR(this.portfolioCalc.baseCapital)}
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:1rem;">
          <input type="range" id="capital-slider" min="1000000" max="100000000" step="500000" value="${this.portfolioCalc.baseCapital}" style="width:100%; height:8px; cursor:pointer;">
        </div>
        <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted); margin-top:0.4rem;" class="font-mono">
          <span>₹10 Lakh</span>
          <span>₹50 Lakh</span>
          <span>₹1.00 Crore (Standard)</span>
          <span>₹5.00 Crore</span>
          <span>₹10.00 Crore</span>
        </div>
      </div>

      <!-- Summary KPI Row -->
      <div class="kpi-grid">
        <div class="kpi-card accent">
          <div class="kpi-header"><span class="kpi-title">Bucket 1: Large-Caps (45%)</span></div>
          <div class="kpi-value font-mono" id="b1-val">${this.portfolioCalc.formatINR(totals.buckets["Large-Cap Titans"].capital)}</div>
          <div class="kpi-subtitle">HDFC, ICICI, RIL, L&amp;T, TCS, Titan, M&amp;M, ITC</div>
        </div>
        <div class="kpi-card success">
          <div class="kpi-header"><span class="kpi-title">Bucket 2: Mid-Caps (25%)</span></div>
          <div class="kpi-value font-mono" id="b2-val">${this.portfolioCalc.formatINR(totals.buckets["Mid-Cap Compounders"].capital)}</div>
          <div class="kpi-subtitle">Cummins, Polycab, CDSL, MCX, PI Ind, Zomato, KEI</div>
        </div>
        <div class="kpi-card gold">
          <div class="kpi-header"><span class="kpi-title">Bucket 3: Microcaps (15%)</span></div>
          <div class="kpi-value font-mono" id="b3-val">${this.portfolioCalc.formatINR(totals.buckets["Microcaps & Asymmetric Alpha"].capital)}</div>
          <div class="kpi-subtitle">Azad, Data Patterns, Harsha, Suzlon, Shivalik, Mold-Tek</div>
        </div>
        <div class="kpi-card warning">
          <div class="kpi-header"><span class="kpi-title">Bucket 4: Gold &amp; Cash (15%)</span></div>
          <div class="kpi-value font-mono" id="b4-val">${this.portfolioCalc.formatINR(totals.buckets["Tactical Hedge & Cash"].capital)}</div>
          <div class="kpi-subtitle">7.5% Sovereign Gold + 7.5% Dry Powder Arbitrage</div>
        </div>
      </div>

      <!-- Live Positions Table -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Asset / Ticker</th>
              <th>Bucket</th>
              <th>Weight (%)</th>
              <th>Allotted Capital</th>
              <th>CMP (₹)</th>
              <th>Calculated Shares</th>
              <th>2030 Target</th>
              <th>5Y CAGR</th>
              <th>Projected 2030 Value</th>
            </tr>
          </thead>
          <tbody id="portfolio-positions-tbody">
            ${positions.map(p => `
              <tr>
                <td>
                  <div class="ticker-cell">
                    <span class="ticker-symbol" onclick="window.bharatApp.console.executeCommand('[DRILLDOWN: ${p.ticker}]')">${p.ticker} ↗</span>
                    <span class="ticker-name">${p.name}</span>
                  </div>
                </td>
                <td><span class="text-muted" style="font-size:0.75rem;">${p.bucket}</span></td>
                <td class="font-mono"><strong>${p.weight.toFixed(1)}%</strong></td>
                <td class="font-mono">₹${Math.round(p.allocatedRupees).toLocaleString('en-IN')}</td>
                <td class="font-mono">₹${p.price.toLocaleString('en-IN')}</td>
                <td class="font-mono text-accent"><strong>${p.shares.toLocaleString('en-IN')}</strong></td>
                <td class="font-mono text-success"><strong>₹${p.target.toLocaleString('en-IN')}</strong></td>
                <td class="font-mono text-success">+${p.cagr}%</td>
                <td class="font-mono"><strong>₹${Math.round(p.projected2030Value).toLocaleString('en-IN')}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Slider listener
    const slider = document.getElementById('capital-slider');
    if (slider) {
      slider.addEventListener('input', (e) => {
        const val = Number(e.target.value);
        this.portfolioCalc.setCapital(val);
        document.getElementById('capital-display').textContent = this.portfolioCalc.formatINR(val);

        const newTotals = this.portfolioCalc.getBucketTotals();
        document.getElementById('b1-val').textContent = this.portfolioCalc.formatINR(newTotals.buckets["Large-Cap Titans"].capital);
        document.getElementById('b2-val').textContent = this.portfolioCalc.formatINR(newTotals.buckets["Mid-Cap Compounders"].capital);
        document.getElementById('b3-val').textContent = this.portfolioCalc.formatINR(newTotals.buckets["Microcaps & Asymmetric Alpha"].capital);
        document.getElementById('b4-val').textContent = this.portfolioCalc.formatINR(newTotals.buckets["Tactical Hedge & Cash"].capital);

        // Update rows
        const newPositions = this.portfolioCalc.calculatePositions();
        const tbody = document.getElementById('portfolio-positions-tbody');
        if (tbody) {
          tbody.innerHTML = newPositions.map(p => `
            <tr>
              <td>
                <div class="ticker-cell">
                  <span class="ticker-symbol" onclick="window.bharatApp.console.executeCommand('[DRILLDOWN: ${p.ticker}]')">${p.ticker} ↗</span>
                  <span class="ticker-name">${p.name}</span>
                </div>
              </td>
              <td><span class="text-muted" style="font-size:0.75rem;">${p.bucket}</span></td>
              <td class="font-mono"><strong>${p.weight.toFixed(1)}%</strong></td>
              <td class="font-mono">₹${Math.round(p.allocatedRupees).toLocaleString('en-IN')}</td>
              <td class="font-mono">₹${p.price.toLocaleString('en-IN')}</td>
              <td class="font-mono text-accent"><strong>${p.shares.toLocaleString('en-IN')}</strong></td>
              <td class="font-mono text-success"><strong>₹${p.target.toLocaleString('en-IN')}</strong></td>
              <td class="font-mono text-success">+${p.cagr}%</td>
              <td class="font-mono"><strong>₹${Math.round(p.projected2030Value).toLocaleString('en-IN')}</strong></td>
            </tr>
          `).join('');
        }
      });
    }
  }

  // --- RENDER FORENSIC LAB ---
  renderForensicLab(container) {
    container.innerHTML = `
      <div class="view-header">
        <div class="view-title-group">
          <h1>Interactive Forensic Audit Lab</h1>
          <div class="view-subtitle">Audit Indian stocks against the 5 deadly smallcap fraud flags with instant verdict scoring.</div>
        </div>
      </div>

      <div class="content-card">
        <h3>🧪 Real-Time 5-Point Governance Audit Evaluator</h3>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
          <div>
            <label style="font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">1. Promoter Pledge (%)</label>
            <input type="number" id="forensic-pledge" value="0.0" step="0.5" style="width:100%; padding:0.4rem; border:1px solid var(--border-color); border-radius:var(--radius-sm); font-family:var(--font-mono); background:var(--bg-surface-elevated); color:var(--text-primary);">
            <small class="text-muted" style="font-size:0.7rem;">&gt;15% triggers critical failure</small>
          </div>
          <div>
            <label style="font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">2. CFO / PAT Ratio (%)</label>
            <input type="number" id="forensic-cfopat" value="92.0" step="1.0" style="width:100%; padding:0.4rem; border:1px solid var(--border-color); border-radius:var(--radius-sm); font-family:var(--font-mono); background:var(--bg-surface-elevated); color:var(--text-primary);">
            <small class="text-muted" style="font-size:0.7rem;">&lt;75% warning, &lt;40% paper profits</small>
          </div>
          <div>
            <label style="font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">3. Auditor Profile</label>
            <select id="forensic-auditor" style="width:100%; padding:0.4rem; border:1px solid var(--border-color); border-radius:var(--radius-sm); font-family:var(--font-sans); background:var(--bg-surface-elevated); color:var(--text-primary);">
              <option value="big4">Big-4 or Top Tier Established Firm</option>
              <option value="obscure">Small 2-Partner Obscure Firm</option>
              <option value="resigned">Auditor Resigned Mid-Term</option>
            </select>
          </div>
          <div>
            <label style="font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">4. Contingent Liab (% NW)</label>
            <input type="number" id="forensic-contingent" value="8.0" step="1.0" style="width:100%; padding:0.4rem; border:1px solid var(--border-color); border-radius:var(--radius-sm); font-family:var(--font-mono); background:var(--bg-surface-elevated); color:var(--text-primary);">
            <small class="text-muted" style="font-size:0.7rem;">&gt;35% flags off-balance-sheet stress</small>
          </div>
          <div>
            <label style="font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">5. Related-Party Transactions</label>
            <select id="forensic-rpt" style="width:100%; padding:0.4rem; border:1px solid var(--border-color); border-radius:var(--radius-sm); font-family:var(--font-sans); background:var(--bg-surface-elevated); color:var(--text-primary);">
              <option value="clean">Strictly Operational &amp; Arms-Length</option>
              <option value="shell">Loans/Advances to Promoter Shells</option>
            </select>
          </div>
        </div>

        <button class="btn btn-primary" id="run-forensic-btn">🚀 Execute Forensic Audit</button>

        <div id="forensic-result-box" style="margin-top:1.5rem; padding:1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-color); background:var(--bg-surface-elevated); display:none;">
          <!-- Injected via JS -->
        </div>
      </div>

      <div class="content-card">
        <h3>📋 Pre-Loaded Forensic Case Studies</h3>
        <div class="kpi-grid">
          ${FORENSIC_CASE_STUDIES.map(cs => `
            <div class="kpi-card" style="cursor:pointer;" onclick="window.bharatApp.loadCaseStudy('${cs.ticker}')">
              <div class="kpi-header">
                <span class="kpi-title font-mono">${cs.ticker}</span>
                <span class="badge ${cs.verdictClass}">${cs.verdict}</span>
              </div>
              <p style="font-size:0.84rem; font-weight:700; margin:0.3rem 0;">${cs.name}</p>
              <p style="font-size:0.78rem; color:var(--text-secondary);">${cs.analysis}</p>
              <div style="margin-top:0.5rem; font-size:0.72rem; color:var(--accent-primary); font-weight:600;">
                Click to load parameters ➔
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const runBtn = document.getElementById('run-forensic-btn');
    if (runBtn) {
      runBtn.addEventListener('click', () => {
        const pledge = Number(document.getElementById('forensic-pledge').value);
        const cfoPat = Number(document.getElementById('forensic-cfopat').value);
        const auditorChange = document.getElementById('forensic-auditor').value;
        const contingentLiab = Number(document.getElementById('forensic-contingent').value);
        const rptStatus = document.getElementById('forensic-rpt').value;

        const res = this.forensicLab.evaluateGovernance({ pledge, cfoPat, auditorChange, contingentLiab, rptStatus });
        const resBox = document.getElementById('forensic-result-box');
        resBox.style.display = 'block';
        resBox.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <div>
              <span style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); font-weight:700;">Governance Score:</span>
              <span class="font-mono" style="font-size:1.6rem; font-weight:800; margin-left:0.5rem;">${res.score} / 100</span>
            </div>
            <span class="badge ${res.badgeClass}" style="font-size:0.85rem; padding:0.35rem 0.75rem;">${res.verdict}</span>
          </div>
          ${res.flags.length === 0 ? '<p class="text-success" style="font-size:0.85rem;">✓ No critical forensic flags detected. Balance sheet meets Tier-1 institutional safety parameters.</p>' : ''}
          ${res.flags.map(f => `
            <div style="display:flex; gap:0.5rem; align-items:center; font-size:0.82rem; margin-bottom:0.35rem;" class="${f.severity === 'critical' ? 'text-danger' : 'text-warning'}">
              <span>⚠️</span>
              <span><strong>${f.severity.toUpperCase()}:</strong> ${f.msg}</span>
            </div>
          `).join('')}
        `;
      });
    }
  }

  loadCaseStudy(ticker) {
    const cs = FORENSIC_CASE_STUDIES.find(c => c.ticker === ticker);
    if (!cs) return;

    document.getElementById('forensic-pledge').value = cs.promoterPledge;
    document.getElementById('forensic-cfopat').value = cs.cfoPatRatio;
    document.getElementById('forensic-auditor').value = cs.auditorTurnover.includes('Resign') ? 'resigned' : 'big4';
    document.getElementById('forensic-contingent').value = cs.contingentLiabRatio;
    document.getElementById('forensic-rpt').value = cs.rptAdvances.includes('Shell') ? 'shell' : 'clean';

    document.getElementById('run-forensic-btn').click();
  }

  // --- MODALS ---
  openDrilldownModal(stock) {
    if (!stock) return;
    const modal = document.getElementById('drilldown-modal');
    if (!modal) return;

    document.getElementById('drilldown-ticker').textContent = stock.ticker;
    document.getElementById('drilldown-name').textContent = `${stock.name} (${stock.sector})`;

    document.getElementById('drilldown-body').innerHTML = `
      <div class="kpi-grid">
        <div class="kpi-card accent">
          <div class="kpi-header"><span class="kpi-title">Valuation Multiple</span></div>
          <div class="kpi-value font-mono">${stock.pe}x</div>
          <div class="kpi-subtitle">5Y Median: ${stock.median5YPE ? stock.median5YPE + 'x' : 'N/A'} | P/B: ${stock.pb}x</div>
        </div>
        <div class="kpi-card success">
          <div class="kpi-header"><span class="kpi-title">Capital Return Quality</span></div>
          <div class="kpi-value font-mono">${stock.roce}</div>
          <div class="kpi-subtitle">RoE: ${stock.roe} | CFO/PAT: ${stock.cfoPatRatio}</div>
        </div>
        <div class="kpi-card gold">
          <div class="kpi-header"><span class="kpi-title">2030 Target Band</span></div>
          <div class="kpi-value font-mono">${stock.target2030}</div>
          <div class="kpi-subtitle">10Y CAGR: ${stock.cagr10Y} | 20Y: ${stock.cagr20Y}</div>
        </div>
      </div>

      <div class="content-card" style="margin-bottom:1rem;">
        <h4 style="font-weight:700; margin-bottom:0.5rem;">🏛️ Institutional Shareholding Structure</h4>
        <div style="display:flex; justify-content:space-between; font-family:var(--font-mono); font-size:0.85rem; padding:0.75rem; background:var(--bg-surface-elevated); border-radius:var(--radius-sm);">
          <span>FII Ownership: <strong>${stock.fiiHolding}</strong></span>
          <span>DII Ownership: <strong>${stock.diiHolding}</strong></span>
          <span>LIC Stake: <strong>${stock.licHolding}</strong></span>
          <span>Promoter Pledge: <strong>${stock.promoterPledge}</strong></span>
        </div>
      </div>

      <div class="content-card" style="margin-bottom:1rem;">
        <h4 style="font-weight:700; margin-bottom:0.5rem;">💥 Historical Crash Drawdowns Survived</h4>
        <p style="font-size:0.85rem; color:var(--text-secondary);">${stock.crashHistory}</p>
      </div>

      <div class="content-card">
        <h4 style="font-weight:700; margin-bottom:0.5rem;">🔍 Forensic Governance Audit</h4>
        <p style="font-size:0.85rem; color:var(--text-primary);">${stock.forensicNotes}</p>
        <div style="margin-top:0.75rem;">
          <span class="badge ${stock.stance.includes('Accumulate') || stock.stance.includes('Buy') ? 'badge-success' : 'badge-warning'}">
            Institutional Stance: ${stock.stance}
          </span>
        </div>
      </div>
    `;

    modal.classList.add('open');
  }

  openForensicModal(ticker, stock) {
    this.renderPhase('forensic');
    if (stock) {
      document.getElementById('forensic-pledge').value = parseFloat(stock.promoterPledge) || 0.0;
      document.getElementById('forensic-cfopat').value = parseFloat(stock.cfoPatRatio) || 90.0;
      document.getElementById('run-forensic-btn').click();
    }
  }

  openWhalesModal(sectorQuery) {
    this.renderPhase('phase2');
  }

  closeModals() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));
  }

  getStock(ticker) {
    return STOCKS_DATA.find(s => s.ticker === ticker);
  }

  exportPortfolio() {
    const csvContent = "data:text/csv;charset=utf-8," + this.portfolioCalc.generateCSV();
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Sovereign_30_Model_Portfolio_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Global bootstrap
document.addEventListener('DOMContentLoaded', () => {
  window.bharatApp = new BharatTerminalApp();
});
