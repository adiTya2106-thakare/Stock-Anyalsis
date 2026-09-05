/**
 * BHARAT ALPHA TERMINAL - COMMAND CONSOLE (CLI) COMPONENT
 */

import { STOCKS_DATA } from '../data/stocks.js';
import { WHALES_DATA } from '../data/whales.js';

export class TerminalConsole {
  constructor(app) {
    this.app = app;
    this.history = [];
    this.historyIndex = -1;
    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.input = document.getElementById('terminal-cli-input');
    this.outputDrawer = document.getElementById('terminal-output-drawer');
    this.logContainer = document.getElementById('terminal-log-stream');
    this.chips = document.querySelectorAll('.chip-cmd');
  }

  bindEvents() {
    if (!this.input) return;

    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = this.input.value.trim();
        if (cmd) {
          this.executeCommand(cmd);
          this.history.push(cmd);
          this.historyIndex = this.history.length;
          this.input.value = '';
        }
      } else if (e.key === 'ArrowUp') {
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.history[this.historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex];
        } else {
          this.historyIndex = this.history.length;
          this.input.value = '';
        }
      }
    });

    this.chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const cmd = chip.dataset.cmd || chip.textContent.trim();
        this.executeCommand(cmd);
      });
    });
  }

  log(text, type = 'info') {
    if (!this.logContainer) return;
    const entry = document.createElement('div');
    entry.className = 'terminal-log-entry';
    
    const time = new Date().toTimeString().split(' ')[0];
    entry.innerHTML = `
      <span class="log-timestamp">[${time}]</span>
      <span class="log-content ${type}">${text}</span>
    `;
    this.logContainer.appendChild(entry);
    this.outputDrawer.classList.add('open');
    this.logContainer.scrollTop = this.logContainer.scrollHeight;
  }

  executeCommand(rawCmd) {
    const cmd = rawCmd.trim();
    this.log(`> ${cmd}`, 'cmd');

    // 1. Check for NEXT / CONTINUE
    if (/^(NEXT|CONTINUE)$/i.test(cmd)) {
      this.app.nextPhase();
      this.log(`Advanced to next phase: ${this.app.currentPhase}`, 'success');
      return;
    }

    // 2. Check for DRILLDOWN command: [DRILLDOWN: TICKER] or DRILLDOWN TICKER
    const drillMatch = cmd.match(/^\[?DRILLDOWN:\s*([A-Za-z0-9_-]+)\]?$/i) || cmd.match(/^DRILLDOWN\s+([A-Za-z0-9_-]+)$/i);
    if (drillMatch) {
      const ticker = drillMatch[1].toUpperCase();
      this.handleDrilldown(ticker);
      return;
    }

    // 3. Check for FORENSIC command: [FORENSIC: TICKER] or FORENSIC TICKER
    const forensicMatch = cmd.match(/^\[?FORENSIC:\s*([A-Za-z0-9_-]+)\]?$/i) || cmd.match(/^FORENSIC\s+([A-Za-z0-9_-]+)$/i);
    if (forensicMatch) {
      const ticker = forensicMatch[1].toUpperCase();
      this.handleForensic(ticker);
      return;
    }

    // 4. Check for WHALES command: [WHALES: SECTOR] or WHALES SECTOR
    const whaleMatch = cmd.match(/^\[?WHALES:\s*(.+)\]?$/i) || cmd.match(/^WHALES\s+(.+)$/i);
    if (whaleMatch) {
      const sector = whaleMatch[1].trim();
      this.handleWhales(sector);
      return;
    }

    // 5. Check for HELP
    if (/^HELP$/i.test(cmd)) {
      this.log(`Available Commands:
• NEXT or CONTINUE: Advance to the next research phase
• [DRILLDOWN: <TICKER>]: Open detailed valuation, crash history & targets (e.g. [DRILLDOWN: HDFCBANK])
• [FORENSIC: <TICKER>]: Run 5-factor red-flag governance audit (e.g. [FORENSIC: ADANIENT])
• [WHALES: <SECTOR>]: Audit super-investor holdings (e.g. [WHALES: DEFENSE] or [WHALES: ALL])
• EXPORT: Export current Sovereign 30 portfolio allocation to CSV
• CLEAR: Clear terminal log`, 'info');
      return;
    }

    // 6. Check for CLEAR
    if (/^CLEAR$/i.test(cmd)) {
      if (this.logContainer) this.logContainer.innerHTML = '';
      this.outputDrawer.classList.remove('open');
      return;
    }

    // 7. Check for EXPORT
    if (/^EXPORT$/i.test(cmd)) {
      this.app.exportPortfolio();
      this.log(`Sovereign 30 Portfolio exported to CSV.`, 'success');
      return;
    }

    // Unknown command
    this.log(`Command '${cmd}' not recognized. Type HELP for command syntax.`, 'error');
  }

  handleDrilldown(ticker) {
    const stock = STOCKS_DATA.find(s => s.ticker === ticker);
    if (stock) {
      this.log(`Loading institutional dossier for ${stock.name} (${stock.ticker})...`, 'success');
      this.app.openDrilldownModal(stock);
    } else {
      this.log(`Ticker '${ticker}' not found in active coverage database. Available tickers include: HDFCBANK, ICICIBANK, RELIANCE, TCS, LT, TITAN, CUMMINSIND, POLYCAB, CDSL, AZAD, SUZLON, HAL, BEL.`, 'warning');
    }
  }

  handleForensic(ticker) {
    const stock = STOCKS_DATA.find(s => s.ticker === ticker);
    this.app.openForensicModal(ticker, stock);
    this.log(`Running forensic red-flag screening engine on ${ticker}...`, 'warning');
  }

  handleWhales(sectorQuery) {
    this.log(`Searching super-investor allocations for '${sectorQuery}'...`, 'info');
    this.app.openWhalesModal(sectorQuery);
  }
}
