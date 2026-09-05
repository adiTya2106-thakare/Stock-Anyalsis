/**
 * BHARAT ALPHA TERMINAL - FORENSIC AUDITING LAB
 */

export const FORENSIC_CASE_STUDIES = [
  {
    name: "Brightcom Group (Historical Debacle)",
    ticker: "BRIGHTCOM",
    promoterPledge: 0.0,
    cfoPatRatio: 22.0, // Major fraud marker
    auditorTurnover: "Multiple Resignations",
    contingentLiabRatio: 45.0,
    rptAdvances: "Severe (Shell companies)",
    verdict: "CRITICAL FRAUD FAILURE",
    verdictClass: "badge-danger",
    analysis: "Forged bank balances, preferential allotments without funds, and fake offshore acquisitions."
  },
  {
    name: "PC Jeweller (Historical Debacle)",
    ticker: "PCJEWELLER",
    promoterPledge: 38.5, // High pledge
    cfoPatRatio: 18.0,
    auditorTurnover: "Auditor Reservations",
    contingentLiabRatio: 52.0,
    rptAdvances: "Massive export receivables to relatives",
    verdict: "CRITICAL RED FLAG",
    verdictClass: "badge-danger",
    analysis: "Unhedged gold loans, promoter relative related-party transactions, and massive bank default."
  },
  {
    name: "HDFC Bank Ltd (Institutional Anchor)",
    ticker: "HDFCBANK",
    promoterPledge: 0.0,
    cfoPatRatio: 100.0,
    auditorTurnover: "PricewaterhouseCoopers (PwC) / Big 4",
    contingentLiabRatio: 8.5,
    rptAdvances: "Zero (Strict Arms-Length)",
    verdict: "PRISTINE INSTITUTIONAL GRADE",
    verdictClass: "badge-success",
    analysis: "0.0% pledge, pristine underwriting, Big-4 audit, zero governance red flags."
  },
  {
    name: "Azad Engineering (Precision Niche)",
    ticker: "AZAD",
    promoterPledge: 0.0,
    cfoPatRatio: 84.0,
    auditorTurnover: "Tier-1 Statutory Auditor",
    contingentLiabRatio: 6.2,
    rptAdvances: "Operational Only",
    verdict: "HIGH GOVERNANCE INTEGRITY",
    verdictClass: "badge-success",
    analysis: "0.0% pledge, AS9100 aerospace certified, high CFO/PAT conversion, zero promoter diversion."
  }
];

export class ForensicLab {
  evaluateGovernance({ pledge, cfoPat, auditorChange, contingentLiab, rptStatus }) {
    let score = 100;
    const flags = [];

    // 1. Promoter Pledge
    if (pledge > 15.0) {
      score -= 35;
      flags.push({ severity: "critical", msg: `Promoter Pledge (${pledge}%) breaches 15% safety threshold. High margin call liquidation risk.` });
    } else if (pledge > 5.0) {
      score -= 15;
      flags.push({ severity: "warning", msg: `Promoter Pledge (${pledge}%) in elevated monitoring band.` });
    }

    // 2. CFO / PAT Ratio
    if (cfoPat < 40.0) {
      score -= 35;
      flags.push({ severity: "critical", msg: `Severe Cash Flow Divergence (CFO/PAT: ${cfoPat}%). High probability of paper profits trapped in fake receivables.` });
    } else if (cfoPat < 75.0) {
      score -= 15;
      flags.push({ severity: "warning", msg: `CFO/PAT (${cfoPat}%) is below institutional hurdle of 75%.` });
    }

    // 3. Auditor Stability
    if (auditorChange === "resigned") {
      score -= 40;
      flags.push({ severity: "critical", msg: `Auditor resigned mid-term citing lack of information. 99% probability of accounting fraud.` });
    } else if (auditorChange === "obscure") {
      score -= 20;
      flags.push({ severity: "warning", msg: `Company audited by small sole-proprietorship firm despite substantial reported revenue.` });
    }

    // 4. Contingent Liabilities
    if (contingentLiab > 35.0) {
      score -= 20;
      flags.push({ severity: "warning", msg: `Contingent Liabilities (${contingentLiab}% of Net Worth) pose off-balance-sheet shock risk.` });
    }

    // 5. Related-Party Transactions
    if (rptStatus === "shell") {
      score -= 40;
      flags.push({ severity: "critical", msg: `Significant loans/advances to promoter-controlled unlisted entities.` });
    }

    let verdict = "PRISTINE INSTITUTIONAL GRADE";
    let badgeClass = "badge-success";

    if (score < 50) {
      verdict = "FATAL FRAUD / REJECT IMMEDIATELY";
      badgeClass = "badge-danger";
    } else if (score < 80) {
      verdict = "FORENSIC CAUTION / WATCHLIST";
      badgeClass = "badge-warning";
    }

    return {
      score: Math.max(0, score),
      verdict,
      badgeClass,
      flags
    };
  }
}
