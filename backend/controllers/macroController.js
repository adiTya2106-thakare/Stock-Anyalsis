/**
 * BHARAT ALPHA TERMINAL - MACRO & INSTITUTIONAL WHALES CONTROLLER
 * Economic milestones, crisis stress transmission matrices, and super-investor portfolios.
 */

const path = require('path');
const { safeReadJSON } = require('../store');

const MACRO_FILE = path.join(__dirname, '../data/macro.json');
const WHALES_FILE = path.join(__dirname, '../data/whales.json');

function loadMacro() {
  return safeReadJSON(MACRO_FILE, {});
}

function loadWhales() {
  return safeReadJSON(WHALES_FILE, []);
}

exports.getMacro = (req, res) => {
  try {
    const macro = loadMacro();
    res.json({
      success: true,
      macro,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getWhales = (req, res) => {
  try {
    const whales = loadWhales();
    res.json({
      success: true,
      count: whales.length,
      whales,
      fiiDiiLandscape: {
        fiiOwnershipTrend: "Historical structural high of 52% compressed to ~46% in 2025-26",
        diiOwnershipTrend: "Domestic mutual funds + EPFO + insurance crossed 54% of free float",
        monthlySipRunrate: "₹24,000+ Crore ($2.9B/mo) acting as unbreakable macro put option",
        institutionalShield: "Domestic capital now absorbs $10B+ foreign selling waves with zero system collapse"
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
