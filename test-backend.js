/**
 * BHARAT ALPHA TERMINAL - AUTOMATED BACKEND VERIFICATION SUITE
 */

const http = require('http');
const app = require('./backend/app');

const PORT = 3999;
let server;

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Starting Backend Automated Test Suite on ephemeral port', PORT);
  server = app.listen(PORT);

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}:`, err.message);
      failed++;
    }
  }

  try {
    // 1. Health
    await test('GET /api/health returns status ok', async () => {
      const res = await request('GET', '/api/health');
      if (res.status !== 200 || res.body.status !== 'ok') throw new Error(`Unexpected: ${JSON.stringify(res)}`);
    });

    // 2. All Stocks
    await test('GET /api/stocks returns list of stocks', async () => {
      const res = await request('GET', '/api/stocks');
      if (res.status !== 200 || !Array.isArray(res.body.stocks) || res.body.count < 10) {
        throw new Error(`Invalid stock list response: ${res.body.count}`);
      }
    });

    // 3. Stock by Ticker
    await test('GET /api/stocks/RELIANCE returns stock detail', async () => {
      const res = await request('GET', '/api/stocks/RELIANCE');
      if (res.status !== 200 || res.body.stock.ticker !== 'RELIANCE') {
        throw new Error(`Stock not found: ${JSON.stringify(res.body)}`);
      }
    });

    // 4. Add Stock Note
    await test('POST /api/stocks/RELIANCE/notes adds analyst note', async () => {
      const res = await request('POST', '/api/stocks/RELIANCE/notes', {
        text: 'Automated test note from CI/CD pipeline verification.',
        author: 'Lead Quant'
      });
      if (res.status !== 201 || !res.body.success || !res.body.note) {
        throw new Error(`Failed to add note: ${JSON.stringify(res.body)}`);
      }
    });

    // 5. Portfolio
    await test('GET /api/portfolio returns model portfolio', async () => {
      const res = await request('GET', '/api/portfolio');
      if (res.status !== 200 || !res.body.data.modelAssets) {
        throw new Error(`Portfolio fetch error: ${JSON.stringify(res.body)}`);
      }
    });

    // 6. Portfolio Simulate
    await test('POST /api/portfolio/simulate calculates projected wealth', async () => {
      const res = await request('POST', '/api/portfolio/simulate', {
        capital: 5000000,
        riskProfile: 'Sovereign 30'
      });
      if (res.status !== 200 || !res.body.simulation || res.body.simulation.positionsCount < 10) {
        throw new Error(`Simulation failed: ${JSON.stringify(res.body)}`);
      }
    });

    // 7. Watchlist Get
    await test('GET /api/watchlist returns watchlist', async () => {
      const res = await request('GET', '/api/watchlist');
      if (res.status !== 200 || !Array.isArray(res.body.watchlist)) {
        throw new Error(`Watchlist failed: ${JSON.stringify(res.body)}`);
      }
    });

    // 8. Watchlist Toggle
    await test('POST /api/watchlist toggles stock in watchlist', async () => {
      const res = await request('POST', '/api/watchlist', { ticker: 'SUZLON' });
      if (res.status !== 200 || !res.body.action) {
        throw new Error(`Toggle watchlist failed: ${JSON.stringify(res.body)}`);
      }
    });

    // 9. Macro
    await test('GET /api/macro returns crisis matrix and milestones', async () => {
      const res = await request('GET', '/api/macro');
      if (res.status !== 200 || !res.body.macro.crisisMatrix) {
        throw new Error(`Macro failed: ${JSON.stringify(res.body)}`);
      }
    });

    // 10. Whales
    await test('GET /api/whales returns institutional super-investors', async () => {
      const res = await request('GET', '/api/whales');
      if (res.status !== 200 || !Array.isArray(res.body.whales)) {
        throw new Error(`Whales failed: ${JSON.stringify(res.body)}`);
      }
    });

    // 11. Forensic Data
    await test('GET /api/forensic returns case studies & checklist', async () => {
      const res = await request('GET', '/api/forensic');
      if (res.status !== 200 || !res.body.data.caseStudies) {
        throw new Error(`Forensic failed: ${JSON.stringify(res.body)}`);
      }
    });

    // 12. Forensic Check
    await test('POST /api/forensic/check calculates governance score', async () => {
      const res = await request('POST', '/api/forensic/check', {
        cfoPatRatio: 0.5,
        promoterPledge: 25,
        contingentLiabilityPercent: 35
      });
      if (res.status !== 200 || typeof res.body.assessment.score !== 'number') {
        throw new Error(`Forensic check failed: ${JSON.stringify(res.body)}`);
      }
    });

    // 13. F&O Radar
    await test('GET /api/fo-radar returns derivatives positioning', async () => {
      const res = await request('GET', '/api/fo-radar');
      if (res.status !== 200 || !res.body.data.indices) {
        throw new Error(`F&O Radar failed: ${JSON.stringify(res.body)}`);
      }
    });

    // 14. Auth Me
    await test('GET /api/auth/me returns guest/offline or authenticated state', async () => {
      const res = await request('GET', '/api/auth/me');
      if (res.status !== 200 || !res.body.user) {
        throw new Error(`Auth Me failed: ${JSON.stringify(res.body)}`);
      }
    });

    // 15. Undefined route handling
    await test('GET /api/invalid-route returns 404 JSON', async () => {
      const res = await request('GET', '/api/invalid-route');
      if (res.status !== 404 || res.body.success !== false) {
        throw new Error(`Expected 404 JSON response: ${JSON.stringify(res)}`);
      }
    });

    console.log(`\n🏁 Test Run Completed: ${passed} passed, ${failed} failed.`);
  } finally {
    server.close();
  }

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
