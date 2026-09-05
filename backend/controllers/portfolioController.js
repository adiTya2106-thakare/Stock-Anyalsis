/**
 * BHARAT ALPHA TERMINAL - PORTFOLIO & WATCHLIST CONTROLLER
 * Dynamic capital allocation engine, 2026-2030 Sovereign 30 Model Portfolio, and Watchlist state.
 */

const path = require('path');
const { safeReadJSON, safeWriteJSON } = require('../store');

const PORTFOLIO_FILE = path.join(__dirname, '../data/portfolio.json');
const WATCHLIST_FILE = path.join(__dirname, '../data/watchlist.json');
const STOCKS_FILE = path.join(__dirname, '../data/stocks.json');

function loadPortfolio() {
  return safeReadJSON(PORTFOLIO_FILE, { modelAssets: [], assetAllocation: {} });
}

function loadWatchlistData() {
  return safeReadJSON(WATCHLIST_FILE, { defaultWatchlist: [], userWatchlists: {}, analystNotes: {} });
}

function saveWatchlistData(data) {
  safeWriteJSON(WATCHLIST_FILE, data);
}

exports.getModelPortfolio = (req, res) => {
  try {
    const portfolio = loadPortfolio();
    res.json({
      success: true,
      data: portfolio,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.simulatePortfolio = (req, res) => {
  try {
    const { capital = 10000000, riskProfile = 'Sovereign 30' } = req.body;
    const baseCapital = Math.max(50000, Number(capital) || 10000000);
    const portfolio = loadPortfolio();
    const assets = portfolio.modelAssets || [];

    let totalAllocated = 0;
    let totalProjected2030 = 0;
    let totalAnnualDividend = 0;

    const positions = assets.map(asset => {
      const allocatedRupees = (baseCapital * asset.weight) / 100;
      const shares = Math.floor(allocatedRupees / (asset.price || 1));
      const actualRupees = shares * (asset.price || 1);
      const projected2030Value = shares * (asset.target || asset.price || 1);
      const annualDividend = Math.round((allocatedRupees * (asset.divYield || 0)) / 100);

      totalAllocated += actualRupees;
      totalProjected2030 += projected2030Value;
      totalAnnualDividend += annualDividend;

      return {
        ticker: asset.ticker,
        name: asset.name,
        bucket: asset.bucket,
        weight: asset.weight,
        cmp: asset.price,
        target2030: asset.target,
        cagr: asset.cagr,
        divYield: asset.divYield,
        shares,
        investedAmount: actualRupees,
        projected2030Value,
        projectedGain: projected2030Value - actualRupees,
        annualDividend
      };
    });

    const unallocatedCash = baseCapital - totalAllocated;
    const overallCagr = ((Math.pow(totalProjected2030 / baseCapital, 1 / 4.5) - 1) * 100).toFixed(2);

    res.json({
      success: true,
      simulation: {
        capital: baseCapital,
        riskProfile,
        totalAllocated,
        unallocatedCash,
        totalProjected2030,
        projectedNetWealthCreation: totalProjected2030 - baseCapital,
        overallProjectedCagr: `${overallCagr}%`,
        totalAnnualDividend,
        portfolioDivYield: ((totalAnnualDividend / baseCapital) * 100).toFixed(2) + '%',
        positionsCount: positions.length,
        positions
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getWatchlist = (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'default';
    const watchlistData = loadWatchlistData();
    const list = watchlistData.userWatchlists?.[userId] || watchlistData.defaultWatchlist || [];

    const stocks = safeReadJSON(STOCKS_FILE, []);

    const enrichedList = list.map(ticker => {
      const stock = stocks.find(s => s.ticker && s.ticker.toUpperCase() === ticker.toUpperCase());
      return stock || { ticker, name: ticker, cmp: 'N/A', stance: 'Track' };
    });

    res.json({
      success: true,
      userId,
      count: enrichedList.length,
      watchlist: enrichedList
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.toggleWatchlist = (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'default';
    const { ticker } = req.body;

    if (!ticker) {
      return res.status(400).json({ success: false, error: 'Ticker symbol is required.' });
    }

    const cleanTicker = ticker.toUpperCase().trim();
    const watchlistData = loadWatchlistData();

    if (!watchlistData.userWatchlists) watchlistData.userWatchlists = {};
    let currentList = watchlistData.userWatchlists[userId] || [...(watchlistData.defaultWatchlist || [])];

    let action = 'added';
    if (currentList.includes(cleanTicker)) {
      currentList = currentList.filter(t => t !== cleanTicker);
      action = 'removed';
    } else {
      currentList.unshift(cleanTicker);
    }

    watchlistData.userWatchlists[userId] = currentList;
    saveWatchlistData(watchlistData);

    res.json({
      success: true,
      action,
      ticker: cleanTicker,
      watchlist: currentList
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
