/**
 * BHARAT ALPHA TERMINAL - VERCEL SERVERLESS ENTRYPOINT
 * Routes all cloud /api/* requests directly through the central Express app.
 */

const app = require('../backend/app');

module.exports = app;
