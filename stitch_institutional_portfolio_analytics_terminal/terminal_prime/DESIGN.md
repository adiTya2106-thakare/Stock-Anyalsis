---
name: Terminal Prime
colors:
  surface: '#10141a'
  surface-dim: '#10141a'
  surface-bright: '#353940'
  surface-container-lowest: '#0a0e14'
  surface-container-low: '#181c22'
  surface-container: '#1c2026'
  surface-container-high: '#262a31'
  surface-container-highest: '#31353c'
  on-surface: '#dfe2eb'
  on-surface-variant: '#dbc2ad'
  inverse-surface: '#dfe2eb'
  inverse-on-surface: '#2d3137'
  outline: '#a38d7a'
  outline-variant: '#554434'
  surface-tint: '#ffb870'
  primary: '#ffc081'
  on-primary: '#4a2800'
  primary-container: '#ff9800'
  on-primary-container: '#653900'
  inverse-primary: '#8b5000'
  secondary: '#7dffa2'
  on-secondary: '#003918'
  secondary-container: '#05e777'
  on-secondary-container: '#00622e'
  tertiary: '#00e0fa'
  on-tertiary: '#00363d'
  tertiary-container: '#00c2d8'
  on-tertiary-container: '#004b54'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdcbe'
  primary-fixed-dim: '#ffb870'
  on-primary-fixed: '#2c1600'
  on-primary-fixed-variant: '#693c00'
  secondary-fixed: '#62ff96'
  secondary-fixed-dim: '#00e475'
  on-secondary-fixed: '#00210b'
  on-secondary-fixed-variant: '#005226'
  tertiary-fixed: '#9cf0ff'
  tertiary-fixed-dim: '#00daf3'
  on-tertiary-fixed: '#001f24'
  on-tertiary-fixed-variant: '#004f58'
  background: '#10141a'
  on-background: '#dfe2eb'
  surface-variant: '#31353c'
typography:
  display:
    fontFamily: IBM Plex Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.005em
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0em
  headline-sm:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  body-lg:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: -0.01em
  body-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0em
  body-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
    letterSpacing: 0.01em
  code-cli:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0em
  metric-display:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 24px
    letterSpacing: -0.02em
  metric-table:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0em
  label-caps:
    fontFamily: IBM Plex Sans
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.08em
  micro-badge:
    fontFamily: JetBrains Mono
    fontSize: 9px
    fontWeight: '700'
    lineHeight: 10px
    letterSpacing: 0.05em
spacing:
  space-2xs: 2px
  space-xs: 4px
  space-sm: 8px
  space-md: 12px
  space-lg: 16px
  space-xl: 24px
  space-2xl: 32px
  pane-header-height: 28px
  table-row-height: 20px
  cli-bar-height: 36px
  status-strip-height: 22px
---

## Brand & Style
The design system delivers an elite, institutional-grade financial workstation interface engineered for proprietary trading desks, asset managers, and quantitative research analysts. 

The aesthetic is characterized by high-density information architecture, zero-latency perceived responsiveness, and uncompromising technical rigor. It merges the legendary functional authority of vintage terminal workstations with modern ergonomic precision.

Visual characteristics:
- **Zero Softness:** Pure mathematical edges, sharp intersections, zero-radius geometry, and rigid 1px structural framing.
- **Data Supremacy:** Visual ornamentation is suppressed in favor of raw informational clarity, micro-badges, state indicators, and monospaced quantitative grids.
- **Dual High-Contrast Archetypes:** Defaulting to a deep pitch obsidian terminal environment lit by luminous amber, emerald, and ruby data feeds, with a parallel daylight counterpart derived from high-end corporate financial whitepapers.

## Colors
The color hierarchy is purpose-built for split-second financial decisions under multi-monitor configurations. Colors indicate transactional status, directional delta, or functional category rather than decoration.

### Color Roles & Semantic Values
- **Primary Amber (`#FF9800`):** System focus, CLI inputs, active selection, terminal prompt cursor, and top-level market alerts.
- **Secondary Emerald (`#00E676`):** Positive yield, upward basis point deltas, bid orders, long exposure.
- **Tertiary Electric Cyan (`#00E5FF`):** Real-time tick indicators, streaming execution queues, quantitative identifiers, derivative parameters.
- **Negative Crimson (`#FF1744`):** Short exposure, downward deltas, ask orders, liquidation thresholds, circuit breakers.
- **Neutral Obsidian (`#0D1117` / `#080A0E`):** Multi-tiered structural canvas. Pure `#05070A` base foundation, `#0D1117` container backgrounds, and `#161B22` pane headers.
- **Border Grayscale (`#21262D` / `#30363D`):** Crisp, low-noise dividers separating high-density data matrices.
- **Light Theme (Institutional White-Paper):** Grounded in clean alabaster (`#F8F9FA`) and pure ivory (`#FFFFFF`), anchored by carbon slate typography (`#1F2328`, `#090D12`), subtle warm-grey rules (`#D0D7DE`), and conservative deep forest (`#097A44`) and oxblood (`#CF222E`) data shifts.

## Typography
Typography is split strictly into two engines: **IBM Plex Sans** for navigation, metadata, and structural chrome labels; and **JetBrains Mono** for all analytical outputs, pricing streams, depth ladders, code, and table cells.

- All numeric presentations enforce open-type tabular figures (`tnum`) and slashed zeros (`zero`) to guarantee strict vertical column alignment across thousands of financial rows.
- Letter spacing on micro-labels is expanded to maintain instant legibility at 9px and 10px sizes.
- Line heights are condensed to maximize vertical screen real estate without row overlap.

## Layout & Spacing
The layout leverages a dynamic mosaic tiled window manager paradigm rather than traditional web pages. The terminal defaults to a 100vw/100vh locked viewport with multi-pane dockable regions.

- **Micro-Scale Spacing:** The baseline rhythmic unit is 4px. Structural borders are exactly 1px. Table cells utilize 2px vertical padding and 6px horizontal padding to preserve extreme data density.
- **Docking Grid:** Panes split horizontally and vertically using 1px interior borders without external margins or gaps.
- **Information Density:** Vertical space never exceeds 28px for pane headers or 20px for high-frequency pricing rows.
- **CLI Dock:** Persistent bottom docked console fixed at 36px height with global focus override hotkey (`~` or `/`).

## Elevation & Depth
Elevation is rendered strictly through high-contrast borders and subtle background tone shifts, completely eschewing soft or diffuse drop shadows.

- **Level 0 (Foundation Base):** Pitch black `#05070A`. Serves as the canvas floor beneath split panes and gutters.
- **Level 1 (Docked Data Pane):** Surface fill `#0D1117` with a 1px solid border `#21262D`. 
- **Level 2 (Active/Hovered Pane):** Surface fill `#12171F` with a 1px solid border `#FF9800` (Amber highlight indicating active terminal keyboard context).
- **Level 3 (Modal / Financial Drilldown):** Surface fill `#0D1117`, enclosed in a 1px `#484F58` border with a 0px offset hard inset hairline highlight (`inset 0 0 0 1px #30363D`). Backed by an 80% opacity `#000000` backdrop blocker.
- **Light Theme Elevation:** Achieved strictly via 1px ruled borders (`#D0D7DE`) over white (`#FFFFFF`) against an off-white canvas (`#F8F9FA`), preventing blur bleed in intense daylight trading floor environments.

## Shapes
Every component, window, button, tag, badge, input field, and modal uses an absolute `0px` border radius. 

Curves are completely absent from the visual grammar. Sharp 90-degree corners convey mechanical precision, optimize pixel rendering on high-DPI panels, maximize space efficiency at pane seams, and reinforce the feeling of an uncompromising enterprise instrument.

## Components

### Buttons & Command Triggers
- **Primary Command:** Solid `#FF9800` background, `#000000` text, bold `JetBrains Mono` 11px uppercase, zero border. Hover state transitions to high-intensity amber `#FFB74D`.
- **Secondary Action:** Transparent background, 1px solid `#30363D`, text `#C9D1D9`. Hover state shifts border to `#FF9800` with text `#FFFFFF`.
- **Destructive/Emergency Order Cancel:** Solid `#FF1744` with `#FFFFFF` text.

### Segmented Tabs & Toolbars
- Height: 24px.
- Sits seamlessly along the top edge of each dockable pane.
- Inactive tabs: `#161B22` background, `#8B949E` text, 1px right border `#21262D`.
- Active tab: `#0D1117` background, `#FF9800` text, with an accent 2px top border in `#FF9800`.

### Data Grid & Financial Depth Tables
- Rows feature a fixed 20px height with alternating row striping (`#0D1117` and `#090D12`).
- Right-aligned tabular numeric values with flash-fill animations: green `#00E676` flash on uptick, red `#FF1744` on downtick (300ms fade).
- Hovering a row applies a 1px top/bottom border in `#FF9800` with an amber background tint (`rgba(255, 152, 0, 0.08)`).

### Bottom Floating CLI Console
- Pinned to the viewport bottom: `#080A0E` fill, 1px top border `#FF9800`.
- Terminal prompt glyph: `>` rendered in glowing amber (`#FF9800`).
- Auto-complete drawer pops vertically upward with monospaced command options and keyboard shortcut indicators (`F1`-`F12`).

### Financial Drilldown Modals
- Bounded 1px borders with title bar displaying asset ticker, ISIN, and market segment in 10px uppercase chips.
- Split-screen order entry: Left-side order book depth ladder, right-side execution parameters with instant key-navigable tabs (`MKT`, `LMT`, `STP`, `ICE`).

### Status Indicators & Micro Badges
- Micro-pill dimensions: 14px total height, 0px radius, 4px horizontal padding.
- Live feed status: 6px solid square dot with green pulse for online websocket connections, solid red for suspended trading halts.