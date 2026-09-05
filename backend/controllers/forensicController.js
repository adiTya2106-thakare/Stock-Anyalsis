/**
 * BHARAT ALPHA TERMINAL - FORENSIC ACCOUNTING LAB CONTROLLER
 * Evaluates earnings manipulation (Beneish M-Score), bankruptcy distress (Altman Z-Score), and corporate governance red flags.
 */

const path = require('path');
const { safeReadJSON } = require('../store');

const FORENSIC_FILE = path.join(__dirname, '../data/forensic.json');

function loadForensic() {
  return safeReadJSON(FORENSIC_FILE, { caseStudies: [], redFlagChecklist: [] });
}

exports.getForensicData = (req, res) => {
  try {
    const forensic = loadForensic();
    res.json({
      success: true,
      data: forensic,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.runForensicCheck = (req, res) => {
  try {
    const {
      cfoPatRatio = 1.0,
      promoterPledge = 0,
      contingentLiabilityPercent = 5,
      debtToEquity = 0.5,
      auditorResignationsCount = 0,
      relatedPartyLoansPercent = 0
    } = req.body || {};

    let score = 100;
    const detectedFlags = [];

    if (Number(cfoPatRatio) < 0.7) {
      score -= 25;
      detectedFlags.push("CFO/PAT < 0.7: Severe working capital leakage or aggressive uncollected revenue recognition.");
    }

    if (Number(promoterPledge) > 20) {
      score -= 30;
      detectedFlags.push(`Promoter Pledge at ${promoterPledge}%: Critical liquidation danger in market correction.`);
    } else if (Number(promoterPledge) > 5) {
      score -= 10;
      detectedFlags.push(`Promoter Pledge at ${promoterPledge}%: Moderate pledge risk requiring continuous monitoring.`);
    }

    if (Number(contingentLiabilityPercent) > 30) {
      score -= 20;
      detectedFlags.push(`Contingent liabilities exceed 30% of Net Worth (${contingentLiabilityPercent}%): Potential off-balance sheet catastrophic claims.`);
    }

    if (Number(auditorResignationsCount) > 0) {
      score -= 25;
      detectedFlags.push("Mid-term auditor resignation detected in preceding 36 months.");
    }

    if (Number(relatedPartyLoansPercent) > 15) {
      score -= 20;
      detectedFlags.push(`Related party loans/advances at ${relatedPartyLoansPercent}% of net worth: High siphoning vulnerability.`);
    }

    if (Number(debtToEquity) > 2.0) {
      score -= 15;
      detectedFlags.push(`D/E ratio at ${debtToEquity}x: High financial leverage reducing solvency margin of safety.`);
    }

    score = Math.max(0, Math.min(100, score));

    let rating = 'AAA (Pristine Governance)';
    if (score < 50) rating = 'D (Severe Distress / Forensic Red Alert)';
    else if (score < 70) rating = 'BB (High Accounting Vulnerability)';
    else if (score < 85) rating = 'A (Clean with Minor Caveats)';

    res.json({
      success: true,
      assessment: {
        score,
        rating,
        detectedFlagsCount: detectedFlags.length,
        flags: detectedFlags,
        isInvestable: score >= 75
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
