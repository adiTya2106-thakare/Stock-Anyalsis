/**
 * BHARAT ALPHA TERMINAL - CENTRAL API ROUTER
 * Wires all controller routes under /api
 */

const express = require('express');
const router = express.Router();

const stocksController = require('../controllers/stocksController');
const portfolioController = require('../controllers/portfolioController');
const macroController = require('../controllers/macroController');
const forensicController = require('../controllers/forensicController');
const foRadarController = require('../controllers/foRadarController');
const authController = require('../controllers/authController');

// 1. System Health
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Bharat Alpha Sovereign 30 Terminal Backend',
    version: '2.6.0',
    runtime: process.env.VERCEL ? 'Vercel Serverless' : 'Node.js Standalone',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/health',
      '/api/stocks',
      '/api/stocks/:ticker',
      '/api/stocks/:ticker/notes',
      '/api/portfolio',
      '/api/portfolio/simulate',
      '/api/watchlist',
      '/api/macro',
      '/api/whales',
      '/api/forensic',
      '/api/forensic/check',
      '/api/fo-radar',
      '/api/auth/me',
      '/api/auth/verify'
    ]
  });
});

// 2. Equities Universe
router.get('/stocks', stocksController.getAllStocks);
router.get('/stocks/:ticker', stocksController.getStockByTicker);
router.post('/stocks/:ticker/notes', stocksController.addStockNote);

// 3. Model Portfolio & Watchlist
router.get('/portfolio', portfolioController.getModelPortfolio);
router.post('/portfolio/simulate', portfolioController.simulatePortfolio);
router.get('/watchlist', portfolioController.getWatchlist);
router.post('/watchlist', portfolioController.toggleWatchlist);

// 4. Macro & Whales
router.get('/macro', macroController.getMacro);
router.get('/whales', macroController.getWhales);

// 5. Forensic Accounting Lab
router.get('/forensic', forensicController.getForensicData);
router.post('/forensic/check', forensicController.runForensicCheck);

// 6. F&O Derivatives Radar
router.get('/fo-radar', foRadarController.getFoRadar);

// 7. Clerk Authentication & Session Verification
router.get('/auth/me', authController.getCurrentUser);
router.post('/auth/verify', authController.verifySession);

// 8. Catch-all for undefined /api routes
router.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `API endpoint '${req.originalUrl}' does not exist on Bharat Alpha Terminal.`,
    availableEndpoints: [
      '/api/health',
      '/api/stocks',
      '/api/stocks/:ticker',
      '/api/stocks/:ticker/notes',
      '/api/portfolio',
      '/api/portfolio/simulate',
      '/api/watchlist',
      '/api/macro',
      '/api/whales',
      '/api/forensic',
      '/api/forensic/check',
      '/api/fo-radar',
      '/api/auth/me',
      '/api/auth/verify'
    ]
  });
});

module.exports = router;
