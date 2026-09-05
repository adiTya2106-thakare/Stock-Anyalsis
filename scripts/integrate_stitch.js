/**
 * Script to integrate Stitch UI views into the root web application
 */
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const STITCH_DIR = path.join(ROOT_DIR, 'stitch_institutional_portfolio_analytics_terminal');

const views = [
  {
    src: path.join(STITCH_DIR, 'view_1_master_portfolio_simulator', 'code.html'),
    dest: path.join(ROOT_DIR, 'index.html'),
    viewIndex: 1,
    title: 'SOVEREIGN // 30 TERMINAL - MASTER SIMULATOR'
  },
  {
    src: path.join(STITCH_DIR, 'view_2_50_year_crisis_matrix_crude_sensitivity', 'code.html'),
    dest: path.join(ROOT_DIR, 'view2.html'),
    viewIndex: 2,
    title: 'SOVEREIGN // 30 - 50Y CRISIS & OIL MATRIX'
  },
  {
    src: path.join(STITCH_DIR, 'view_3_super_investor_whales_tracker', 'code.html'),
    dest: path.join(ROOT_DIR, 'view3.html'),
    viewIndex: 3,
    title: 'SOVEREIGN // 30 - SUPER-INVESTORS (WHALES)'
  },
  {
    src: path.join(STITCH_DIR, 'view_4_f_o_derivatives_timing_radar', 'code.html'),
    dest: path.join(ROOT_DIR, 'view4.html'),
    viewIndex: 4,
    title: 'SOVEREIGN // 30 - F&O DERIVATIVES & TIMING RADAR'
  },
  {
    src: path.join(STITCH_DIR, 'view_5_forensic_audit_lab', 'code.html'),
    dest: path.join(ROOT_DIR, 'view5.html'),
    viewIndex: 5,
    title: 'SOVEREIGN // 30 - FORENSIC AUDIT LAB'
  }
];

function generateNav(currentViewIndex) {
  const links = [
    { idx: 1, url: 'index.html', label: 'VIEW 1: MASTER SIMULATOR' },
    { idx: 2, url: 'view2.html', label: 'VIEW 2: 50Y CRISIS & OIL MATRIX' },
    { idx: 3, url: 'view3.html', label: 'VIEW 3: SUPER-INVESTORS (WHALES)' },
    { idx: 4, url: 'view4.html', label: 'VIEW 4: F&O DERIVATIVES & TIMING RADAR' },
    { idx: 5, url: 'view5.html', label: 'VIEW 5: FORENSIC AUDIT LAB' }
  ];

  const linkHtml = links.map(l => {
    if (l.idx === currentViewIndex) {
      return `<a aria-current="page" class="px-space-md h-full flex items-center font-label-caps uppercase tracking-wider transition-colors bg-surface-container-lowest text-primary border-b-2 border-primary" data-path="${l.url}" href="${l.url}">${l.label}</a>`;
    } else {
      return `<a class="px-space-md h-full flex items-center text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps uppercase tracking-wider border-r border-surface-container-high transition-colors" data-path="${l.url}" href="${l.url}">${l.label}</a>`;
    }
  }).join('');

  return `<nav class="flex items-center h-full gap-space-xs shrink-0" data-active-classes="bg-surface-container-lowest text-primary border-b-2 border-primary">${linkHtml}</nav>`;
}

const cliInteractiveScript = `
<script>
  // Terminal CLI Navigation & Hotkeys Router
  (function() {
    document.addEventListener('DOMContentLoaded', () => {
      const cliInput = document.querySelector('footer input[type="text"]');
      if (cliInput) {
        cliInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            const cmd = cliInput.value.trim().toUpperCase();
            if (cmd === 'NEXT' || cmd === 'CONTINUE') {
              const currentPath = window.location.pathname;
              if (currentPath.includes('view2')) window.location.href = 'view3.html';
              else if (currentPath.includes('view3')) window.location.href = 'view4.html';
              else if (currentPath.includes('view4')) window.location.href = 'view5.html';
              else if (currentPath.includes('view5')) window.location.href = 'index.html';
              else window.location.href = 'view2.html';
            } else if (cmd === 'VIEW 1' || cmd === 'SIM' || cmd === 'MASTER') {
              window.location.href = 'index.html';
            } else if (cmd === 'VIEW 2' || cmd === 'CRISIS' || cmd === 'OIL') {
              window.location.href = 'view2.html';
            } else if (cmd === 'VIEW 3' || cmd === 'WHALES' || cmd === 'WHALE') {
              window.location.href = 'view3.html';
            } else if (cmd === 'VIEW 4' || cmd === 'DERIVATIVES' || cmd === 'RADAR' || cmd === 'FO') {
              window.location.href = 'view4.html';
            } else if (cmd === 'VIEW 5' || cmd === 'FORENSIC' || cmd === 'AUDIT') {
              window.location.href = 'view5.html';
            } else if (cmd === 'BUY_SIM') {
              if (typeof setCapital === 'function') setCapital(100);
              else window.location.href = 'index.html';
            } else if (cmd === 'HEDGE_CALC') {
              window.location.href = 'view4.html';
            } else if (cmd === 'FORENSIC_RUN') {
              window.location.href = 'view5.html';
            } else if (cmd === 'STRESS_TEST') {
              window.location.href = 'view2.html';
            } else if (cmd === 'EXPORT_CSV' || cmd === 'EXPORT') {
              if (typeof exportAllocationsCSV === 'function') exportAllocationsCSV();
              else alert('Navigating to Master Simulator for CSV Export');
            } else {
              alert("COMMAND EXECUTED: " + cmd + "\\nAvailable Commands: NEXT, VIEW 1, VIEW 2, VIEW 3, VIEW 4, VIEW 5, BUY_SIM, HEDGE_CALC, FORENSIC_RUN, STRESS_TEST, EXPORT_CSV");
            }
          }
        });
      }

      // Hotkey buttons in footer
      const hotkeys = document.querySelectorAll('footer button');
      hotkeys.forEach(btn => {
        const txt = btn.textContent.trim();
        if (txt === 'BUY_SIM') {
          btn.onclick = () => { window.location.href = 'index.html'; };
        } else if (txt === 'HEDGE_CALC') {
          btn.onclick = () => { window.location.href = 'view4.html'; };
        } else if (txt === 'FORENSIC_RUN') {
          btn.onclick = () => { window.location.href = 'view5.html'; };
        } else if (txt === 'STRESS_TEST') {
          btn.onclick = () => { window.location.href = 'view2.html'; };
        } else if (txt === 'EXPORT_CSV') {
          btn.onclick = () => {
            if (typeof exportAllocationsCSV === 'function') exportAllocationsCSV();
            else window.location.href = 'index.html';
          };
        }
      });
    });
  })();
</script>
`;

views.forEach(v => {
  if (!fs.existsSync(v.src)) {
    console.error('Source not found: ' + v.src);
    return;
  }

  let html = fs.readFileSync(v.src, 'utf8');

  // Replace navigation bar
  const navRegex = /<nav class="flex items-center h-full gap-space-xs shrink-0"[^>]*>[\s\S]*?<\/nav>/i;
  const newNav = generateNav(v.viewIndex);
  html = html.replace(navRegex, newNav);

  // Inject CLI Interactive script before </body>
  html = html.replace('</body>', `${cliInteractiveScript}</body>`);

  fs.writeFileSync(v.dest, html, 'utf8');
  console.log(`Successfully generated: ${v.dest}`);
});

console.log('Stitch UI integration complete!');
