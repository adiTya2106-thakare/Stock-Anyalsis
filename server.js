/**
 * BHARAT ALPHA TERMINAL - PRODUCTION & LOCAL SERVER
 * Unifies the Express API Engine with static asset serving for the Terminal SPA.
 */

const path = require('path');
const express = require('express');
const app = require('./backend/app');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

// 1. Legacy View Redirects to Modern Terminal Hash Routes
app.get(['/view2', '/view2.html'], (req, res) => res.redirect(302, '/#/crisis'));
app.get(['/view3', '/view3.html'], (req, res) => res.redirect(302, '/#/phase2'));
app.get(['/view4', '/view4.html'], (req, res) => res.redirect(302, '/#/phase7'));
app.get(['/view5', '/view5.html'], (req, res) => res.redirect(302, '/#/forensic'));

// 2. Serve Static Assets (index.html, js, css, markdown research dossiers)
app.use(express.static(BASE_DIR, {
  dotfiles: 'ignore',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

// 3. Fallback for SPA routing: send index.html for unhandled web navigation
app.use((req, res) => {
  res.sendFile(path.join(BASE_DIR, 'index.html'));
});

// 4. Start HTTP Server
app.listen(PORT, () => {
  console.log('====================================================');
  console.log('🏛️  BHARAT ALPHA TERMINAL (2026-2030) UNIFIED SERVER');
  console.log(`🌐 Server running at: http://localhost:${PORT}/`);
  console.log(`⚡ Express API mounted at: http://localhost:${PORT}/api/`);
  console.log(`🩺 Health check at: http://localhost:${PORT}/api/health`);
  console.log('====================================================');
});
