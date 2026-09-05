/**
 * BHARAT ALPHA TERMINAL - CENTRAL API CLIENT
 * Connects frontend UI components to backend Express/Vercel endpoints,
 * with Clerk Bearer token injection and resilient offline fallback.
 */

import { MASTER_STOCKS, getStockByTicker as getLocalStock } from './data/masterStocks.js';
import { CRISIS_MATRIX, CRUDE_SCENARIOS, MACRO_MILESTONES } from './data/macro.js';
import { WHALES_DATA } from './data/whales.js';
import { MODEL_PORTFOLIO_ASSETS } from './components/portfolio.js';
import { FORENSIC_CASE_STUDIES, RED_FLAG_CHECKLIST } from './components/forensicLab.js';

class ApiClient {
  constructor() {
    this.baseUrl = window.location.origin;
    this.isBackendOnline = null;
    this.cachedStocks = null;
  }

  async getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };

    try {
      if (window.Clerk && window.Clerk.session) {
        const token = await window.Clerk.session.getToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }
      if (window.Clerk && window.Clerk.user) {
        headers['x-user-id'] = window.Clerk.user.id;
      }
    } catch (e) {
      console.warn('[ApiClient] Failed to acquire Clerk session token:', e);
    }

    return headers;
  }

  async checkHealth() {
    try {
      const res = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const data = await res.json();
        this.isBackendOnline = true;
        return { online: true, data };
      }
    } catch (e) {
      // Backend offline or unreachable
    }
    this.isBackendOnline = false;
    return { online: false, data: null };
  }

  async getStocks(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `${this.baseUrl}/api/stocks${query ? `?${query}` : ''}`;

    try {
      const headers = await this.getAuthHeaders();
      const res = await fetch(url, { headers });
      if (res.ok) {
        const json = await res.json();
        this.cachedStocks = json.stocks;
        this.isBackendOnline = true;
        return json.stocks;
      }
    } catch (e) {
      console.warn('[ApiClient] Backend stocks fetch failed, falling back to local dataset:', e.message);
    }

    // Resilient fallback to bundled stocks
    this.isBackendOnline = false;
    return MASTER_STOCKS;
  }

  async getStock(ticker) {
    if (!ticker) return null;
    const cleanTicker = ticker.toUpperCase().trim();

    try {
      const headers = await this.getAuthHeaders();
      const res = await fetch(`${this.baseUrl}/api/stocks/${encodeURIComponent(cleanTicker)}`, { headers });
      if (res.ok) {
        const json = await res.json();
        return { stock: json.stock, notes: json.notes || [] };
      }
    } catch (e) {
      console.warn(`[ApiClient] Backend getStock(${cleanTicker}) failed, falling back:`, e.message);
    }

    // Fallback
    const local = getLocalStock(cleanTicker);
    return { stock: local, notes: [] };
  }

  async addStockNote(ticker, noteText, author = 'Desk Analyst') {
    const cleanTicker = ticker.toUpperCase().trim();
    try {
      const headers = await this.getAuthHeaders();
      const res = await fetch(`${this.baseUrl}/api/stocks/${encodeURIComponent(cleanTicker)}/notes`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ text: noteText, author })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error(`[ApiClient] Failed to post analyst note for ${cleanTicker}:`, e.message);
    }
    return { success: false, error: 'Network error or backend offline' };
  }

  async getModelPortfolio() {
    try {
      const headers = await this.getAuthHeaders();
      const res = await fetch(`${this.baseUrl}/api/portfolio`, { headers });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('[ApiClient] Portfolio fetch failed, falling back:', e.message);
    }

    return { modelAssets: MODEL_PORTFOLIO_ASSETS };
  }

  async simulatePortfolio(capital = 10000000, riskProfile = 'Sovereign 30') {
    try {
      const headers = await this.getAuthHeaders();
      const res = await fetch(`${this.baseUrl}/api/portfolio/simulate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ capital, riskProfile })
      });
      if (res.ok) {
        const json = await res.json();
        return json.simulation;
      }
    } catch (e) {
      console.warn('[ApiClient] Portfolio simulate failed, falling back to local calculation:', e.message);
    }

    return null;
  }

  async getWatchlist() {
    try {
      const headers = await this.getAuthHeaders();
      const res = await fetch(`${this.baseUrl}/api/watchlist`, { headers });
      if (res.ok) {
        const json = await res.json();
        return json.watchlist;
      }
    } catch (e) {
      console.warn('[ApiClient] Watchlist fetch failed:', e.message);
    }
    return [];
  }

  async toggleWatchlist(ticker) {
    try {
      const headers = await this.getAuthHeaders();
      const res = await fetch(`${this.baseUrl}/api/watchlist`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ticker: ticker.toUpperCase() })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error('[ApiClient] Toggle watchlist failed:', e.message);
    }
    return { success: false };
  }

  async getMacro() {
    try {
      const headers = await this.getAuthHeaders();
      const res = await fetch(`${this.baseUrl}/api/macro`, { headers });
      if (res.ok) {
        const json = await res.json();
        return json.macro;
      }
    } catch (e) {
      console.warn('[ApiClient] Macro fetch failed, falling back:', e.message);
    }

    return {
      crisisMatrix: CRISIS_MATRIX,
      crudeScenarios: CRUDE_SCENARIOS,
      macroMilestones: MACRO_MILESTONES
    };
  }

  async getWhales() {
    try {
      const headers = await this.getAuthHeaders();
      const res = await fetch(`${this.baseUrl}/api/whales`, { headers });
      if (res.ok) {
        const json = await res.json();
        return json.whales;
      }
    } catch (e) {
      console.warn('[ApiClient] Whales fetch failed, falling back:', e.message);
    }

    return WHALES_DATA;
  }

  async getForensicData() {
    try {
      const headers = await this.getAuthHeaders();
      const res = await fetch(`${this.baseUrl}/api/forensic`, { headers });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('[ApiClient] Forensic fetch failed, falling back:', e.message);
    }

    return {
      caseStudies: FORENSIC_CASE_STUDIES,
      redFlagChecklist: RED_FLAG_CHECKLIST
    };
  }

  async runForensicCheck(inputs) {
    try {
      const headers = await this.getAuthHeaders();
      const res = await fetch(`${this.baseUrl}/api/forensic/check`, {
        method: 'POST',
        headers,
        body: JSON.stringify(inputs)
      });
      if (res.ok) {
        const json = await res.json();
        return json.assessment;
      }
    } catch (e) {
      console.warn('[ApiClient] Backend forensic check failed:', e.message);
    }
    return null;
  }

  async getFoRadar() {
    try {
      const headers = await this.getAuthHeaders();
      const res = await fetch(`${this.baseUrl}/api/fo-radar`, { headers });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('[ApiClient] F&O Radar fetch failed:', e.message);
    }
    return null;
  }
}

export const apiClient = new ApiClient();
