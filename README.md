# Bharat Alpha Terminal (2026–2030)
### Sovereign Institutional Equities Research & Predictive Allocation Operating System

An institutional-grade research platform, multi-decade market autopsy (1975–Present), and forward-looking predictive allocation blueprint covering all tiers of the Indian equities ecosystem (NSE, BSE, and SME Platforms).

---

## 🚀 Quick Start / How to Run

### Method 1: Local Full-Stack Server (Express API + Web Terminal)
```bash
# Install dependencies
npm install

# Run automated backend test suite
npm test

# Start the unified Express & Terminal Server
npm start
# or
npm run dev
```
Navigate to: **`http://localhost:3000/`**  
The Express API is active under: **`http://localhost:3000/api/`** (Health check: `http://localhost:3000/api/health`).

### Method 2: Cloud Deployment on Vercel
The repository is pre-configured with `vercel.json` and serverless handler `api/index.js`:
1. Push this repository to GitHub.
2. Import the project into **Vercel** (`https://vercel.com/new`).
3. Add Environment Variables in Vercel Settings (optional for Clerk Auth):
   - `CLERK_PUBLISHABLE_KEY` (from `.env.example`)
   - `CLERK_SECRET_KEY` (from `.env.example`)
4. Click **Deploy**. Vercel will serve all static assets via global edge CDN and execute all `/api/*` endpoints as low-latency Serverless Functions.

### Method 3: Instant Direct Launch (Static Preview)
Simply double-click or open **[`index.html`](file:///c:/Users/DELL/Desktop/clerk2.0/index.html)** in any browser. The client automatically switches to standalone offline mode if the backend is not running.

---

## ⚡ Backend Architecture & API Surface

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | `GET` | System heartbeat, version, and serverless runtime telemetry |
| `/api/stocks` | `GET` | Full institutional universe with query search, sector/tier filter & sorting |
| `/api/stocks/:ticker` | `GET` | Individual stock valuation multiples, institutional thesis & analyst notes |
| `/api/stocks/:ticker/notes` | `POST` | Commit persistent analyst memo/note to the stock dossier |
| `/api/portfolio` | `GET` | Retrieve Sovereign 30 Model Portfolio asset allocation |
| `/api/portfolio/simulate` | `POST` | Dynamic capital allocation and 2030 wealth projection engine |
| `/api/watchlist` | `GET` | Active user or desk watchlist with stock quotes |
| `/api/watchlist` | `POST` | Toggle add/remove stock to watchlist |
| `/api/macro` | `GET` | 50-year crisis drawdowns and macro milestone targets |
| `/api/whales` | `GET` | Super-investor portfolios and institutional footprint trends |
| `/api/forensic` | `GET` | Smallcap forensic fraud cases and red-flag checklist |
| `/api/forensic/check` | `POST` | Balance-sheet governance score calculation |
| `/api/fo-radar` | `GET` | F&O derivatives radar, PCR, and institutional rollover metrics |
| `/api/auth/me` | `GET` | Clerk session validation and role verification |

---

## 🏛️ System Features & Interactive Capabilities

### 1. 💼 "The Sovereign 30" Master Portfolio Simulator
*   **Dynamic Capital Slider**: Scale deployment capital from ₹10 Lakhs to ₹100 Crores (Default: ₹1.00 Crore).
*   **Automated Position Sizer**: Real-time computation of exact share counts, allocated capital, CMP, and 2030 projected targets across the 4 asset buckets:
    *   **Bucket 1 (45%)**: Large-Cap Titans (HDFC Bank, ICICI Bank, RIL, L&T, TCS, Titan, M&M, ITC).
    *   **Bucket 2 (25%)**: Mid-Cap Compounders (Cummins, Polycab, CDSL, MCX, PI Ind, Zomato, KEI).
    *   **Bucket 3 (15%)**: Asymmetric Microcaps (Azad, Data Patterns, Harsha, Suzlon, Shivalik, Mold-Tek).
    *   **Bucket 4 (15%)**: Tactical Hedge Buffer (7.5% Sovereign Gold + 7.5% Cash Arbitrage).
*   **1-Click Export**: Export the live portfolio configuration to CSV format.

### 2. 💻 Interactive Command Console (Bottom Dock CLI)
Type any of the following triggers into the bottom terminal prompt or click the quick-action chips:
*   `NEXT` or `CONTINUE` ➔ Cycles sequentially through the research phases.
*   `[DRILLDOWN: <TICKER>]` (e.g. `[DRILLDOWN: HDFCBANK]`, `[DRILLDOWN: SUZLON]`, `[DRILLDOWN: AZAD]`) ➔ Opens granular institutional dossier with valuation multiples, crash survivorship, institutional float (FII/DII/LIC), and 2030 target price.
*   `[FORENSIC: <TICKER>]` (e.g. `[FORENSIC: ADANIENT]`, `[FORENSIC: BRIGHTCOM]`) ➔ Executes a 5-factor forensic governance audit.
*   `[WHALES: <SECTOR>]` (e.g. `[WHALES: DEFENSE]`, `[WHALES: ALL]`) ➔ Audits portfolios of Indian super-investors (Radhakishan Damani, Ashish Kacholia, Mukul Agrawal, Vijay Kedia, Sunil Singhania).
*   `EXPORT` ➔ Downloads current portfolio allocation to CSV.
*   `CLEAR` ➔ Clears the terminal log stream.
*   `HELP` ➔ Displays interactive syntax assistance.

### 3. 🧪 Interactive Forensic Audit Lab
Test any stock against the 5 deadly smallcap fraud flags:
1.  **Promoter Pledge** (&gt;15% critical risk)
2.  **CFO / PAT Divergence** (&lt;75% warning, &lt;40% paper profit fraud)
3.  **Auditor Profile & Turnover** (Mid-term resignation = 99% fraud confidence)
4.  **Contingent Liabilities** (&gt;35% net worth off-balance-sheet shock)
5.  **Related-Party Transactions** (Advances to promoter shell LLPs)
*Includes pre-loaded historical post-mortems for Brightcom Group, PC Jeweller, HDFC Bank, and Azad Engineering.*

### 4. 🧭 F&O Positioning & Hedging Radar
*   **Interactive FII Long/Short Slider**: Observe the market regime transition from extreme capitulation (&lt;18% FII longs = strong buy) to euphoric exhaustion (&gt;80% FII longs = hedge/trim).
*   **PCR Meter**: Put-Call ratio sentiment tracking.
*   **Far-Put Hedging Calculator**: Estimates exact quarterly insurance cost and 20% crash protection payout.

### 5. 🎨 Dual Institutional Themes
*   **White-Paper Mode** (Default): Crisp, high-contrast, clean-bordered light theme designed for sovereign advisory reports.
*   **Bloomberg Dark Mode**: Obsidian terminal theme with gold/cyan institutional highlights.

---

## 📁 Codebase Structure

```
c:\Users\DELL\Desktop\clerk2.0\
├── index.html                   # Master single-page terminal UI & shells
├── server.js                    # Zero-dependency local Node.js HTTP server
├── css/
│   ├── index.css                # Design system variables, light/dark themes, typography
│   ├── components.css           # KPI cards, high-contrast tables, badges, modals
│   └── terminal.css             # Interactive CLI console, command chips, radar styling
├── js/
│   ├── app.js                   # Master application controller, phase routing, modals
│   ├── data/
│   │   ├── stocks.js            # Normalized database of 60+ benchmark pillars
│   │   ├── macro.js             # 50-year crisis matrix, crude/INR sensitivity, $5T/$7T GDP data
│   │   └── whales.js            # Super-investor portfolios (Damani, Kacholia, Agrawal, etc.)
│   └── components/
│       ├── console.js           # CLI parser and command router
│       ├── portfolio.js         # Sovereign 30 portfolio calculator & CSV generator
│       ├── foRadar.js           # F&O sentiment and hedging cost engine
│       └── forensicLab.js       # 5-factor governance auditing engine
└── [Research PRD Files (Phases 1–8 + Sovereign 30 Portfolio)]
```

---

## 📚 Complete Research Dossier Index (PRD Markdown Files)
- **[Phase 1: 50-Year Market Autopsy & Macro Transmission (1975–Present)](./PHASE_1_Market_Autopsy_and_Macro_Shocks.md)**
- **[Phase 2: Institutional Footprint & Whale Tracking Architecture](./PHASE_2_Institutional_Footprint_and_Whale_Architecture.md)**
- **[Phase 3: Tier-1 Large-Cap Titans (36 Mega-Caps across 7 Pillars)](./PHASE_3_Tier_1_Large_Cap_Titans.md)**
- **[Phase 4: Tier-2 High-Growth Compounders (Nifty Next 50 & Midcap 150)](./PHASE_4_Tier_2_High_Growth_Compounders.md)**
- **[Phase 5: Tier-3 Smallcaps, Microcaps & SME Multibaggers](./PHASE_5_Tier_3_Smallcaps_Microcaps_and_SME_Multibaggers.md)**
- **[Phase 6: Mega-Capex & Government Thematic Supercycles (2026–2030)](./PHASE_6_Mega_Capex_and_Government_Thematic_Supercycles.md)**
- **[Phase 7: Derivatives, F&O Positioning & Market Timing Secrets](./PHASE_7_Derivatives_FO_Positioning_and_Market_Timing.md)**
- **[Phase 8: The Master 2026–2030 India Forecast & Action Plan](./PHASE_8_Master_2026_2030_India_Forecast_and_Action_Plan.md)**
- **[Master Model Portfolio: "The Sovereign 30" (2026–2030)](./MASTER_MODEL_PORTFOLIO_2026_2030.md)**
