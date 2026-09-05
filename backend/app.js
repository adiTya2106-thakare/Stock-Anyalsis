/**
 * BHARAT ALPHA TERMINAL - EXPRESS APPLICATION INSTANCE
 * Central Express App mounted by both local server (server.js) and Vercel serverless (api/index.js).
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/apiRoutes');

// Load environment variables if .env or .env.local exists
try {
  const fs = require('fs');
  const envLocalPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envLocalPath)) {
    const envContent = fs.readFileSync(envLocalPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [k, ...v] = trimmed.split('=');
        if (!process.env[k.trim()]) {
          process.env[k.trim()] = v.join('=').trim();
        }
      }
    });
  }
} catch (e) {
  // Silent ignore if env loader fails
}

const app = express();

// 1. Cross-Origin Resource Sharing
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));

// 2. Body Parsing Middleware
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// 3. Mount Central API Routes under /api
app.use('/api', apiRoutes);

// 4. Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Terminal Backend Error]', err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

module.exports = app;
