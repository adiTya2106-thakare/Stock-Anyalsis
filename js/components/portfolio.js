/**
 * BHARAT ALPHA TERMINAL - "THE SOVEREIGN 30" PORTFOLIO CALCULATOR
 */

export const MODEL_PORTFOLIO_ASSETS = [
  // BUCKET 1: Large-Cap Titans (45%)
  { ticker: "HDFCBANK", name: "HDFC Bank Ltd", bucket: "Large-Cap Titans", weight: 8.0, price: 1720, target: 2750, cagr: 12.8, divYield: 1.2 },
  { ticker: "ICICIBANK", name: "ICICI Bank Ltd", bucket: "Large-Cap Titans", weight: 7.0, price: 1240, target: 2050, cagr: 13.5, divYield: 1.0 },
  { ticker: "RELIANCE", name: "Reliance Industries", bucket: "Large-Cap Titans", weight: 7.0, price: 2950, target: 4400, cagr: 12.2, divYield: 0.8 },
  { ticker: "LT", name: "Larsen & Toubro", bucket: "Large-Cap Titans", weight: 6.0, price: 3550, target: 5100, cagr: 11.8, divYield: 1.1 },
  { ticker: "TCS", name: "Tata Consultancy Services", bucket: "Large-Cap Titans", weight: 5.0, price: 4100, target: 5800, cagr: 10.5, divYield: 2.8 },
  { ticker: "TITAN", name: "Titan Company Ltd", bucket: "Large-Cap Titans", weight: 4.0, price: 3500, target: 5100, cagr: 13.2, divYield: 0.6 },
  { ticker: "M&M", name: "Mahindra & Mahindra", bucket: "Large-Cap Titans", weight: 4.0, price: 2820, target: 4100, cagr: 12.5, divYield: 1.0 },
  { ticker: "ITC", name: "ITC Ltd", bucket: "Large-Cap Titans", weight: 4.0, price: 470, target: 660, cagr: 10.8, divYield: 3.5 },

  // BUCKET 2: Mid-Cap Growth Engines (25%)
  { ticker: "CUMMINSIND", name: "Cummins India", bucket: "Mid-Cap Compounders", weight: 4.0, price: 3520, target: 5100, cagr: 16.2, divYield: 1.2 },
  { ticker: "POLYCAB", name: "Polycab India", bucket: "Mid-Cap Compounders", weight: 4.0, price: 6450, target: 9500, cagr: 18.5, divYield: 0.8 },
  { ticker: "CDSL", name: "Central Depository Services", bucket: "Mid-Cap Compounders", weight: 4.0, price: 1620, target: 2500, cagr: 17.8, divYield: 1.4 },
  { ticker: "MCX", name: "Multi Commodity Exchange", bucket: "Mid-Cap Compounders", weight: 3.5, price: 5500, target: 8400, cagr: 18.2, divYield: 1.1 },
  { ticker: "PIIND", name: "PI Industries Ltd", bucket: "Mid-Cap Compounders", weight: 3.5, price: 4050, target: 6200, cagr: 17.5, divYield: 0.6 },
  { ticker: "ZOMATO", name: "Zomato Ltd", bucket: "Mid-Cap Compounders", weight: 3.0, price: 260, target: 440, cagr: 21.5, divYield: 0.0 },
  { ticker: "KEI", name: "KEI Industries Ltd", bucket: "Mid-Cap Compounders", weight: 3.0, price: 4150, target: 6200, cagr: 17.0, divYield: 0.4 },

  // BUCKET 3: Asymmetric Small & Microcaps (15%)
  { ticker: "AZAD", name: "Azad Engineering", bucket: "Microcaps & Asymmetric Alpha", weight: 2.5, price: 1520, target: 2800, cagr: 24.5, divYield: 0.0 },
  { ticker: "DATAPATTNS", name: "Data Patterns India", bucket: "Microcaps & Asymmetric Alpha", weight: 2.5, price: 2780, target: 4200, cagr: 22.0, divYield: 0.3 },
  { ticker: "HARSHAENG", name: "Harsha Engineers", bucket: "Microcaps & Asymmetric Alpha", weight: 2.5, price: 540, target: 950, cagr: 20.5, divYield: 0.5 },
  { ticker: "SUZLON", name: "Suzlon Energy Ltd", bucket: "Microcaps & Asymmetric Alpha", weight: 2.5, price: 68, target: 105, cagr: 21.0, divYield: 0.0 },
  { ticker: "SHIVAMET", name: "Shivalik Bimetal", bucket: "Microcaps & Asymmetric Alpha", weight: 2.5, price: 560, target: 980, cagr: 22.5, divYield: 0.6 },
  { ticker: "MOLDTKPAC", name: "Mold-Tek Packaging", bucket: "Microcaps & Asymmetric Alpha", weight: 2.5, price: 760, target: 1350, cagr: 19.8, divYield: 1.2 },

  // BUCKET 4: Tactical Gold & Cash Reserve Buffer (15%)
  { ticker: "GOLDBEES", name: "Sovereign Gold Bond / Gold ETF", bucket: "Tactical Hedge & Cash", weight: 7.5, price: 72, target: 110, cagr: 10.0, divYield: 2.5 },
  { ticker: "LIQUIDBEES", name: "91-Day T-Bills / Liquid Arbitrage", bucket: "Tactical Hedge & Cash", weight: 7.5, price: 1000, target: 1350, cagr: 6.8, divYield: 6.8 }
];

export class PortfolioCalculator {
  constructor() {
    this.baseCapital = 10000000; // Default ₹1.00 Crore
  }

  setCapital(amount) {
    this.baseCapital = Math.max(100000, Number(amount));
  }

  formatINR(num) {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} Lakh`;
    } else {
      return `₹${num.toLocaleString('en-IN')}`;
    }
  }

  calculatePositions() {
    return MODEL_PORTFOLIO_ASSETS.map(asset => {
      const allocatedRupees = (this.baseCapital * asset.weight) / 100;
      const shares = Math.floor(allocatedRupees / asset.price);
      const actualRupees = shares * asset.price;
      const projected2030Value = shares * asset.target;
      const annualDividend = Math.round((allocatedRupees * asset.divYield) / 100);

      return {
        ...asset,
        allocatedRupees,
        shares,
        actualRupees,
        projected2030Value,
        annualDividend
      };
    });
  }

  getBucketTotals() {
    const positions = this.calculatePositions();
    const buckets = {
      "Large-Cap Titans": { weight: 45, capital: 0, projected2030: 0 },
      "Mid-Cap Compounders": { weight: 25, capital: 0, projected2030: 0 },
      "Microcaps & Asymmetric Alpha": { weight: 15, capital: 0, projected2030: 0 },
      "Tactical Hedge & Cash": { weight: 15, capital: 0, projected2030: 0 }
    };

    positions.forEach(pos => {
      if (buckets[pos.bucket]) {
        buckets[pos.bucket].capital += pos.allocatedRupees;
        buckets[pos.bucket].projected2030 += pos.projected2030Value;
      }
    });

    const totalProjected = Object.values(buckets).reduce((sum, b) => sum + b.projected2030, 0);
    const projectedCAGR = (Math.pow(totalProjected / this.baseCapital, 1 / 5) - 1) * 100;

    return {
      buckets,
      totalCapital: this.baseCapital,
      totalProjected,
      projectedCAGR: projectedCAGR.toFixed(1)
    };
  }

  generateCSV() {
    const positions = this.calculatePositions();
    let csv = "Ticker,Company,Bucket,Weight(%),Allocated Rupee,Share Price,Share Count,2030 Target,Projected 2030 Value\n";
    positions.forEach(p => {
      csv += `"${p.ticker}","${p.name}","${p.bucket}",${p.weight},${p.allocatedRupees.toFixed(0)},${p.price},${p.shares},${p.target},${p.projected2030Value.toFixed(0)}\n`;
    });
    return csv;
  }
}
