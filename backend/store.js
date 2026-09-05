/**
 * BHARAT ALPHA TERMINAL - HYBRID IN-MEMORY & FILESYSTEM STORE
 * Allows persistent file writes in local dev environments while safely falling back
 * to memory in serverless/read-only hosting environments (like Vercel Lambda /tmp).
 */

const fs = require('fs');
const path = require('path');

const memoryCache = new Map();

function safeReadJSON(filePath, fallbackData = {}) {
  // Check memory cache first
  if (memoryCache.has(filePath)) {
    return memoryCache.get(filePath);
  }

  try {
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      memoryCache.set(filePath, data);
      return data;
    }
  } catch (err) {
    console.warn(`[Store] Could not read ${filePath}, using fallback:`, err.message);
  }

  memoryCache.set(filePath, fallbackData);
  return fallbackData;
}

function safeWriteJSON(filePath, data) {
  // Always update memory cache immediately
  memoryCache.set(filePath, data);

  // Attempt writing to disk if environment permits
  try {
    // If running in Vercel or read-only filesystem, fs.writeFileSync may fail
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    // Silently fall back to in-memory store in read-only / serverless containers
    console.warn(`[Store] Read-only environment detected (${err.code || err.message}). Persisting in memory cache.`);
    return false;
  }
}

module.exports = {
  safeReadJSON,
  safeWriteJSON
};
