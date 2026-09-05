/**
 * BHARAT ALPHA TERMINAL - STOCKS CONTROLLER
 * Handles Equities Research, Constituent Filtering, Valuation Multiples, and Analyst Notes.
 */

const path = require('path');
const { safeReadJSON, safeWriteJSON } = require('../store');

const STOCKS_FILE = path.join(__dirname, '../data/stocks.json');
const WATCHLIST_FILE = path.join(__dirname, '../data/watchlist.json');

function loadStocks() {
  return safeReadJSON(STOCKS_FILE, []);
}

function loadWatchlistData() {
  return safeReadJSON(WATCHLIST_FILE, { defaultWatchlist: [], userWatchlists: {}, analystNotes: {} });
}

function saveWatchlistData(data) {
  safeWriteJSON(WATCHLIST_FILE, data);
}

exports.getAllStocks = (req, res) => {
  try {
    let stocks = loadStocks();
    const { search, tier, sector, theme, sortBy, order = 'asc', limit, page = 1 } = req.query;

    if (search) {
      const q = search.toLowerCase().trim();
      stocks = stocks.filter(s =>
        (s.ticker && s.ticker.toLowerCase().includes(q)) ||
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.sector && s.sector.toLowerCase().includes(q)) ||
        (s.theme && s.theme.toLowerCase().includes(q))
      );
    }

    if (tier) {
      stocks = stocks.filter(s => s.tier && s.tier.toLowerCase() === tier.toLowerCase());
    }

    if (sector) {
      stocks = stocks.filter(s => s.sector && s.sector.toLowerCase().includes(sector.toLowerCase()));
    }

    if (theme) {
      stocks = stocks.filter(s => s.theme && s.theme.toLowerCase().includes(theme.toLowerCase()));
    }

    if (sortBy) {
      stocks.sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        // Clean numeric strings if needed (e.g. "13.8%" or "₹13,20,000 Cr")
        if (typeof valA === 'string' && !isNaN(parseFloat(valA.replace(/[^0-9.-]+/g, "")))) {
          valA = parseFloat(valA.replace(/[^0-9.-]+/g, ""));
        }
        if (typeof valB === 'string' && !isNaN(parseFloat(valB.replace(/[^0-9.-]+/g, "")))) {
          valB = parseFloat(valB.replace(/[^0-9.-]+/g, ""));
        }

        if (valA < valB) return order === 'desc' ? 1 : -1;
        if (valA > valB) return order === 'desc' ? -1 : 1;
        return 0;
      });
    }

    const totalCount = stocks.length;
    let resultStocks = stocks;

    if (limit) {
      const parsedLimit = Math.max(1, parseInt(limit, 10));
      const parsedPage = Math.max(1, parseInt(page, 10));
      const startIndex = (parsedPage - 1) * parsedLimit;
      resultStocks = stocks.slice(startIndex, startIndex + parsedLimit);
    }

    res.json({
      success: true,
      count: resultStocks.length,
      totalCount,
      timestamp: new Date().toISOString(),
      stocks: resultStocks
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getStockByTicker = (req, res) => {
  try {
    const ticker = req.params.ticker.toUpperCase();
    const stocks = loadStocks();
    const stock = stocks.find(s => s.ticker.toUpperCase() === ticker);

    if (!stock) {
      return res.status(404).json({ success: false, error: `Stock '${ticker}' not found in Bharat Alpha Universe.` });
    }

    const watchlistData = loadWatchlistData();
    const notes = watchlistData.analystNotes?.[ticker] || [];

    res.json({
      success: true,
      stock,
      notes,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.addStockNote = (req, res) => {
  try {
    const ticker = req.params.ticker.toUpperCase();
    const { text, author = 'Desk Analyst' } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, error: 'Note text cannot be empty.' });
    }

    const watchlistData = loadWatchlistData();
    if (!watchlistData.analystNotes) watchlistData.analystNotes = {};
    if (!watchlistData.analystNotes[ticker]) watchlistData.analystNotes[ticker] = [];

    const newNote = {
      id: 'note_' + Date.now(),
      author: String(author).trim() || 'Desk Analyst',
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    watchlistData.analystNotes[ticker].unshift(newNote);
    saveWatchlistData(watchlistData);

    res.status(201).json({
      success: true,
      note: newNote,
      totalNotes: watchlistData.analystNotes[ticker].length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
