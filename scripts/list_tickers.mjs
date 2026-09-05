import { STOCKS_DATA } from '../js/data/stocks.js';
console.log('Total stocks in DB:', STOCKS_DATA.length);
STOCKS_DATA.forEach((s, idx) => {
  console.log(`${idx + 1}. [${s.ticker}] ${s.name} - ${s.tier} (${s.sector})`);
});
