// A-Y — Theme system (Dark · Cream · Sky) — global + context-driven
// Single source of truth:
//   window.THEMES              — palette tokens
//   window.ThemeContext        — React context
//   window.useActiveTheme()    — hook returning active palette object
//   window.ThemedRoot          — wrapper that injects CSS variables + ambient bg
//   window.SettingsThemedScreen — settings screen that uses global theme

const AYT = window.AY;

// ─── Theme palettes (rich token set) ────────────────────────
const THEMES = {
  dark: {
    key: 'dark',
    label: 'تاریک',
    desc: 'دنیای پیکسلی شبانه',
    bg:         '#020306',
    bgSoft:     '#05090a',
    bgGrad:     'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16,185,129,0.09), transparent 60%), #020306',
    surface:    'linear-gradient(180deg, rgba(31,46,40,0.55) 0%, rgba(18,30,24,0.45) 100%)',
    surfaceHi:  'linear-gradient(180deg, rgba(31,46,40,0.85) 0%, rgba(18,30,24,0.75) 100%)',
    surfaceFlat:'rgba(31,46,40,0.55)',
    surfaceSoft:'rgba(255,255,255,0.03)',
    surfaceNav: 'rgba(7,12,11,0.86)',
    border:     'rgba(110,231,183,0.16)',
    borderSoft: 'rgba(110,231,183,0.10)',
    divider:    'rgba(110,231,183,0.08)',
    text:       '#e8efea',
    textDim:    'rgba(232,239,234,0.62)',
    textFade:   'rgba(232,239,234,0.40)',
    textMute:   'rgba(232,239,234,0.55)',
    accent:     '#34d399',
    accentHi:   '#6ee7b7',
    accentDeep: '#10b981',
    accentBg:   'rgba(16,185,129,0.14)',
    accentBgHi: 'rgba(16,185,129,0.22)',
    accentBorder:'rgba(110,231,183,0.30)',
    accentText: '#04110a',       // text ON accent fill
    accentShadow:'0 4px 16px rgba(52,211,153,0.35)',
    accentGlow: '0 0 16px rgba(52,211,153,0.25)',
    gold:       '#fcd34d',
    violet:     '#c4b5fd',
    danger:     '#fca5a5',
    // Mascot palette
    mascotBody: '#cfe8dc',
    mascotHi:   '#e6f4ec',
    mascotSh:   '#8cb5a2',
    mascotDark: '#0a1a14',
    // Scene
    sceneStar:  '#6ee7b7',
    // Status bar (time color)
    timeText:   'rgba(232,239,234,0.55)',
    // Tile preview
    tileColors: ['#020306', '#0a1a14', '#34d399'],
    tone:       'emerald',
    isDark:     true,
  },
  cream: {
    key: 'cream',
    label: 'کرمی',
    desc: 'روز مهربان و کاغذی',
    bg:         '#f5efe3',
    bgSoft:     '#ede5d3',
    bgGrad:     'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16,120,90,0.10), transparent 60%), #f5efe3',
    surface:    'linear-gradient(180deg, rgba(255,250,240,0.90) 0%, rgba(252,245,231,0.80) 100%)',
    surfaceHi:  'linear-gradient(180deg, rgba(255,252,246,0.96) 0%, rgba(252,248,238,0.90) 100%)',
    surfaceFlat:'rgba(255,250,240,0.88)',
    surfaceSoft:'rgba(20,39,31,0.04)',
    surfaceNav: 'rgba(255,252,246,0.92)',
    border:     'rgba(20,39,31,0.14)',
    borderSoft: 'rgba(20,39,31,0.08)',
    divider:    'rgba(20,39,31,0.08)',
    text:       '#14271f',
    textDim:    'rgba(20,39,31,0.68)',
    textFade:   'rgba(20,39,31,0.45)',
    textMute:   'rgba(20,39,31,0.58)',
    accent:     '#059669',
    accentHi:   '#047857',
    accentDeep: '#065f46',
    accentBg:   'rgba(5,150,105,0.12)',
    accentBgHi: 'rgba(5,150,105,0.20)',
    accentBorder:'rgba(5,150,105,0.35)',
    accentText: '#ffffff',
    accentShadow:'0 4px 16px rgba(5,150,105,0.30)',
    accentGlow: '0 0 12px rgba(5,150,105,0.20)',
    gold:       '#b45309',
    violet:     '#6d28d9',
    danger:     '#b91c1c',
    mascotBody: '#14271f',
    mascotHi:   '#2a4b3b',
    mascotSh:   '#0a1a14',
    mascotDark: '#000000',
    sceneStar:  '#059669',
    timeText:   'rgba(20,39,31,0.6)',
    tileColors: ['#f5efe3', '#e8dec6', '#059669'],
    tone:       'paper',
    isDark:     false,
  },
  sky: {
    key: 'sky',
    label: 'آسمانی',
    desc: 'صبح مه‌آلود و سبز-آبی',
    bg:         '#e6f0f0',
    bgSoft:     '#d4e4e8',
    bgGrad:     'radial-gradient(ellipse 80% 60% at 30% 0%, rgba(14,165,233,0.18), transparent 60%), radial-gradient(ellipse 70% 50% at 90% 10%, rgba(16,185,129,0.14), transparent 60%), #e6f0f0',
    surface:    'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(245,250,251,0.75) 100%)',
    surfaceHi:  'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(250,253,254,0.88) 100%)',
    surfaceFlat:'rgba(255,255,255,0.82)',
    surfaceSoft:'rgba(12,42,51,0.04)',
    surfaceNav: 'rgba(255,255,255,0.92)',
    border:     'rgba(14,116,144,0.20)',
    borderSoft: 'rgba(14,116,144,0.12)',
    divider:    'rgba(14,116,144,0.10)',
    text:       '#0c2a33',
    textDim:    'rgba(12,42,51,0.68)',
    textFade:   'rgba(12,42,51,0.45)',
    textMute:   'rgba(12,42,51,0.58)',
    accent:     '#0e7490',
    accentHi:   '#0891b2',
    accentDeep: '#155e75',
    accentBg:   'rgba(14,116,144,0.12)',
    accentBgHi: 'rgba(14,116,144,0.22)',
    accentBorder:'rgba(14,116,144,0.38)',
    accentText: '#ffffff',
    accentShadow:'0 4px 16px rgba(14,116,144,0.28)',
    accentGlow: '0 0 12px rgba(14,116,144,0.20)',
    gold:       '#b45309',
    violet:     '#6d28d9',
    danger:     '#b91c1c',
    mascotBody: '#0c2a33',
    mascotHi:   '#1e4a57',
    mascotSh:   '#051820',
    mascotDark: '#000000',
    sceneStar:  '#0e7490',
    timeText:   'rgba(12,42,51,0.6)',
    tileColors: ['#e6f0f0', '#bfdfe4', '#0e7490'],
    tone:       'ocean',
    isDark:     false,
  },
};

// ─── Context + hook ────────────────────────────────────────
const ThemeContext = React.createContext(THEMES.dark);

function useActiveTheme() {
  return React.useContext(ThemeContext);
}

// ─── Global CSS recoloring ─────────────────────────────────
// All screens were built with hardcoded dark palette values. Rather than rewrite
// every JSX file, we traverse artboards on theme change and regex-rewrite inline
// styles (reading .style.cssText, which the browser has normalized) and SVG attrs.

// Build an ordered list of {regex, replacement} for a theme.
// Order matters — longer / more specific patterns first so we don't double-replace.
function buildColorReplacements(theme) {
  if (theme.key === 'dark') return null;
  const isDark = theme.isDark;

  // Utility: return "r,g,b" triple from hex
  const triple = (hex) => {
    const h = hex.replace('#', '');
    const n = h.length === 3
      ? h.split('').map(c => parseInt(c + c, 16))
      : [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    return `${n[0]}, ${n[1]}, ${n[2]}`;
  };

  // Theme triples
  const bgT       = triple(theme.bg);
  const bgSoftT   = triple(theme.bgSoft);
  const textT     = triple(theme.text);
  const accT      = triple(theme.accent);
  const accHiT    = triple(theme.accentHi);
  const accDeepT  = triple(theme.accentDeep);
  const mascotDkT = triple(theme.mascotDark);
  const mascotBdT = triple(theme.mascotBody);
  const mascotShT = triple(theme.mascotSh);

  // Build replacements — each is [regex, replacement]
  // We match rgba(r, g, b, ALPHA) with any spacing, capturing alpha, and rgb(r,g,b) too.
  const rules = [];

  // RGBA dark-palette → theme triples (alpha preserved)
  const rgbaMap = {
    '2,\\s*3,\\s*6':         bgT,        // #020306
    '5,\\s*9,\\s*10':        bgSoftT,    // #05090a
    '7,\\s*12,\\s*11':       bgSoftT,    // nav overlay
    '7,\\s*18,\\s*13':       bgT,        // #07120d scene top
    '4,\\s*8,\\s*7':         bgT,        // #040807 scene bottom
    '10,\\s*26,\\s*20':      mascotDkT,  // #0a1a14
    '31,\\s*46,\\s*40':      isDark ? null : bgSoftT,
    '18,\\s*30,\\s*24':      isDark ? null : bgT,
    '11,\\s*22,\\s*18':      isDark ? null : bgSoftT,
    '232,\\s*239,\\s*234':   textT,      // #e8efea text
    '201,\\s*214,\\s*206':   textT,      // misc dim
    '52,\\s*211,\\s*153':    accT,       // #34d399
    '110,\\s*231,\\s*183':   accHiT,     // #6ee7b7
    '16,\\s*185,\\s*129':    accDeepT,   // #10b981
    '5,\\s*150,\\s*105':     accDeepT,   // #059669
    '6,\\s*95,\\s*70':       accDeepT,
    '4,\\s*17,\\s*10':       theme.accentText.startsWith('#fff') ? '255, 255, 255' : '4, 17, 10',
    '207,\\s*232,\\s*220':   mascotBdT,  // #cfe8dc mascot body
    '230,\\s*244,\\s*236':   triple('#' + '000000'.slice(0, 6 - (theme.mascotHi || '#000').replace('#', '').length) + (theme.mascotHi || '#000').replace('#', '')),
    '140,\\s*181,\\s*162':   mascotShT,  // #8cb5a2
  };

  for (const [src, dst] of Object.entries(rgbaMap)) {
    if (!dst) continue;
    // Match rgb(…) and rgba(…) variants
    rules.push({
      re: new RegExp(`rgb\\(\\s*${src}\\s*\\)`, 'gi'),
      to: `rgb(${dst})`,
    });
    rules.push({
      re: new RegExp(`rgba\\(\\s*${src}\\s*,([^)]+)\\)`, 'gi'),
      to: (m, alpha) => `rgba(${dst},${alpha})`,
    });
  }

  // Hex replacements — case-insensitive, word-boundary-ish
  const hexMap = {
    '#020306': theme.bg,
    '#05090a': theme.bgSoft,
    '#07120d': theme.bg,
    '#040807': theme.bg,
    '#0a1a14': theme.mascotDark,
    '#e8efea': theme.text,
    '#c9d6ce': theme.textDim,
    '#34d399': theme.accent,
    '#6ee7b7': theme.accentHi,
    '#10b981': theme.accentDeep,
    '#059669': theme.accentDeep,
    '#04110a': theme.accentText,
    '#cfe8dc': theme.mascotBody,
    '#e6f4ec': theme.mascotHi,
    '#8cb5a2': theme.mascotSh,
  };
  for (const [from, to] of Object.entries(hexMap)) {
    rules.push({
      re: new RegExp(from.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1'), 'gi'),
      to: to,
    });
  }

  return rules;
}

// Apply rules to a string
function applyRules(str, rules) {
  if (!str || typeof str !== 'string' || !rules) return str;
  let out = str;
  for (const { re, to } of rules) {
    out = out.replace(re, to);
  }
  return out;
}

// Walk a DOM subtree. On first pass, snapshots original inline styles/attrs into
// data-ay-orig-* attrs. On every pass, restores from snapshot then applies rules
// (so theme switches are fully bidirectional).
function recolorSubtree(root, rules) {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  let node = walker.currentNode;
  while (node) {
    const el = node;
    // ─── inline style ───
    if (el.style) {
      // Snapshot the "original" style once — but keep it current when React
      // updates it ONLY if the current value doesn't contain theme-remapped colors.
      // Easier heuristic: snapshot on first visit.
      let orig = el.getAttribute('data-ay-orig-style');
      const current = el.style.cssText;
      if (orig === null) {
        // First visit — snapshot current style
        el.setAttribute('data-ay-orig-style', current || '');
        orig = current || '';
      } else {
        // Subsequent visit — check if React has updated the style behind our back.
        // If current doesn't equal any known "after-rules" version, treat current as new orig.
        // Simple heuristic: if React re-rendered, the style would typically revert to
        // the hardcoded original (dark). If current === our last applied output, skip snapshot update.
        const lastApplied = el.getAttribute('data-ay-last-applied');
        if (lastApplied !== null && current !== lastApplied) {
          // React wrote a new style — treat it as new original
          el.setAttribute('data-ay-orig-style', current || '');
          orig = current || '';
        }
      }
      if (rules) {
        const applied = applyRules(orig, rules);
        if (applied !== current) {
          el.style.cssText = applied;
        }
        el.setAttribute('data-ay-last-applied', applied);
      } else {
        // No rules (dark theme) — restore to original
        if (orig !== current) {
          el.style.cssText = orig;
        }
        el.setAttribute('data-ay-last-applied', orig);
      }
    }
    // ─── SVG attrs ───
    if (el.namespaceURI && el.namespaceURI.includes('svg')) {
      for (const attr of ['fill', 'stroke', 'stop-color']) {
        const current = el.getAttribute(attr);
        if (current == null) continue;
        const origKey = `data-ay-orig-${attr}`;
        let orig = el.getAttribute(origKey);
        const lastKey = `data-ay-last-${attr}`;
        const lastApplied = el.getAttribute(lastKey);
        if (orig === null) {
          el.setAttribute(origKey, current);
          orig = current;
        } else if (lastApplied !== null && current !== lastApplied) {
          el.setAttribute(origKey, current);
          orig = current;
        }
        if (rules) {
          const applied = applyRules(orig, rules);
          if (applied !== current) el.setAttribute(attr, applied);
          el.setAttribute(lastKey, applied);
        } else {
          if (orig !== current) el.setAttribute(attr, orig);
          el.setAttribute(lastKey, orig);
        }
      }
    }
    node = walker.nextNode();
  }
}

// ─── ThemedRoot — sets up context + runs global recoloring ──
function ThemedRoot({ themeKey = 'dark', children }) {
  const theme = THEMES[themeKey] || THEMES.dark;
  const rootRef = React.useRef(null);
  const rulesRef = React.useRef(null);

  React.useLayoutEffect(() => {
    if (!rootRef.current) return;
    const rules = buildColorReplacements(theme);
    rulesRef.current = rules;

    // Body + html background always reflects theme
    document.body.style.background = theme.bg;
    document.documentElement.style.background = theme.bg;

    // Run recoloring — if rules is null (dark theme), recolorSubtree will
    // restore each element to its snapshotted original style.
    const run = () => recolorSubtree(rootRef.current, rules);
    run();
    const t1 = setTimeout(run, 60);
    const t2 = setTimeout(run, 250);
    const t3 = setTimeout(run, 700);
    const t4 = setTimeout(run, 1500);

    // Observer — catches any React re-render that overwrites styles.
    // Route all mutations through recolorSubtree so snapshot/restore logic applies.
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList') {
          for (const n of m.addedNodes) {
            if (n.nodeType === 1) recolorSubtree(n, rulesRef.current);
          }
        } else if (m.type === 'attributes') {
          const el = m.target;
          if (el.nodeType !== 1) continue;
          // Ignore our own data-ay-* writes
          if (m.attributeName && m.attributeName.startsWith('data-ay-')) continue;
          // Rerun on just this element (treat as subtree of size 1)
          recolorSubtree(el, rulesRef.current);
        }
      }
    });
    obs.observe(rootRef.current, {
      childList: true, subtree: true, attributes: true,
      attributeFilter: ['style', 'fill', 'stroke', 'stop-color'],
    });

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
      obs.disconnect();
    };
  }, [theme.key]);

  return (
    <ThemeContext.Provider value={theme}>
      <div ref={rootRef} data-ay-theme={theme.key}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// ─── Theme tile — visual preview swatch ─────────────────────
function ThemeTile({ theme, active, onClick }) {
  const t = useActiveTheme();
  const [c1, c2, cA] = theme.tileColors;
  return (
    <button
      onClick={onClick}
      style={{
        all: 'unset', cursor: 'pointer',
        position: 'relative',
        display: 'block',
        width: '100%',
        padding: 14,
        borderRadius: 18,
        background: active ? t.accentBg : t.surfaceSoft,
        border: `1.5px solid ${active ? t.accentBorder : t.borderSoft}`,
        boxShadow: active ? `0 0 0 4px ${t.accentBg}` : 'none',
        transition: 'all 120ms ease',
      }}
    >
      <div style={{
        position: 'relative',
        height: 78, borderRadius: 12, overflow: 'hidden',
        background: `linear-gradient(180deg, ${c1} 0%, ${c2} 100%)`,
        border: `1px solid ${theme.border}`,
        marginBottom: 10,
      }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, top: '55%',
          height: 1, background: `${cA}80`, opacity: 0.7,
        }}/>
        <div style={{
          position: 'absolute', left: '50%', bottom: 8, transform: 'translateX(-50%)',
          width: 14, height: 12, borderRadius: '40% 40% 50% 50%',
          background: theme.mascotBody,
        }}/>
        <div style={{
          position: 'absolute', left: '50%', bottom: 13, transform: 'translateX(-50%)',
          width: 3, height: 3, background: cA, boxShadow: `0 0 4px ${cA}`,
        }}/>
        {[15, 75].map((x, i) => (
          <div key={i} style={{
            position: 'absolute', left: `${x}%`, top: 14 + i * 8,
            width: 2, height: 2, background: cA, opacity: 0.8,
          }}/>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: AYT.font.display, fontWeight: 800, fontSize: 14, color: t.text }}>
            {theme.label}
          </div>
          <div style={{ fontSize: 11, color: t.textMute, marginTop: 2 }}>
            {theme.desc}
          </div>
        </div>
        {active && (
          <div style={{
            width: 22, height: 22, borderRadius: '50%',
            background: t.accent, display: 'grid', placeItems: 'center',
            boxShadow: t.accentGlow,
          }}>
            <AYIcon name="check" size={13} color={t.accentText} stroke={2.8}/>
          </div>
        )}
      </div>
    </button>
  );
}

// ─── Theme Switcher (uses global theme via Tweaks) ─────────
function ThemeSwitcher({ value, onChange }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
      {Object.values(THEMES).map(t => (
        <ThemeTile key={t.key} theme={t} active={value === t.key} onClick={() => onChange(t.key)}/>
      ))}
    </div>
  );
}

// ─── Settings Screen · uses GLOBAL theme (via Tweaks) ──────
function SettingsThemedScreen() {
  const t = useActiveTheme();
  // Read setter from a global broadcast — Tweaks panel writes `theme` key
  const setTheme = (key) => {
    if (window.__aySetTheme) window.__aySetTheme(key);
  };

  return (
    <div style={{
      width: 448, height: 900, position: 'relative',
      background: t.bgGrad,
      color: t.text,
      fontFamily: AYT.font.display,
      overflow: 'hidden', borderRadius: 28,
      border: `1px solid ${t.border}`,
    }}>
      {/* Top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30,
        padding: '22px 20px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: t.isDark
          ? 'linear-gradient(180deg, rgba(2,3,6,0.92) 0%, rgba(2,3,6,0.0) 100%)'
          : `linear-gradient(180deg, ${t.bg}f0 0%, ${t.bg}00 100%)`,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 11,
          background: t.surfaceFlat, border: `1px solid ${t.border}`,
          display: 'grid', placeItems: 'center',
        }}>
          <AYIcon name="chev-r" size={16} color={t.text}/>
        </div>
        <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: -0.2 }}>تنظیمات</div>
        <div style={{ width: 38 }}/>
      </div>

      <div style={{ position: 'absolute', top: 70, bottom: 0, left: 0, right: 0, overflow: 'auto' }}>
        <div style={{ padding: '12px 20px 130px' }}>
          {/* Hero — themed preview */}
          <div style={{
            position: 'relative',
            height: 180,
            borderRadius: 22,
            overflow: 'hidden',
            background: t.key === 'dark'
              ? 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(16,185,129,0.22), transparent 60%)'
              : t.key === 'cream'
                ? 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(5,150,105,0.14), transparent 60%)'
                : 'radial-gradient(ellipse 70% 50% at 30% 30%, rgba(14,165,233,0.22), transparent 60%), radial-gradient(ellipse 70% 50% at 80% 20%, rgba(16,185,129,0.14), transparent 60%)',
            border: `1px solid ${t.border}`,
            marginBottom: 24,
          }}>
            <div style={{
              position: 'absolute', left: 0, right: 0, top: '65%',
              height: 1, background: `${t.accent}66`,
            }}/>
            <svg style={{ position: 'absolute', inset: 0 }} width="100%" height="100%" viewBox="0 0 400 180" preserveAspectRatio="none">
              {[-3, -2, -1, 0, 1, 2, 3].map(i => (
                <line key={i}
                  x1={200 + i * 50} y1={180}
                  x2={200} y2={180 * 0.65}
                  stroke={`${t.accent}22`} strokeWidth="1" strokeDasharray="2 4"/>
              ))}
            </svg>
            {[[15, 25], [85, 20], [25, 60], [80, 55]].map(([x, y], i) => (
              <div key={i} style={{
                position: 'absolute', left: `${x}%`, top: `${y}%`,
                width: 3, height: 3, background: t.accent, boxShadow: `0 0 6px ${t.accent}`,
                opacity: 0.7,
                animation: `ay-twinkle ${2 + i * 0.6}s ease-in-out ${i * 0.3}s infinite`,
              }}/>
            ))}
            <div style={{ position: 'absolute', left: '50%', top: '60%', transform: 'translate(-50%, -50%)' }}>
              <MascotArt
                state="idle" frame={0} blink={false} scale={4}
                accent={t.accent}
                body={t.mascotBody} bodyHi={t.mascotHi} bodySh={t.mascotSh} dark={t.mascotDark}
              />
            </div>
            <div style={{
              position: 'absolute', top: 14, insetInlineStart: 14,
              padding: '5px 10px', borderRadius: 999,
              background: t.surfaceFlat, border: `1px solid ${t.border}`,
              fontFamily: AYT.font.mono, fontSize: 10, letterSpacing: 1,
              color: t.text, fontWeight: 700, textTransform: 'uppercase',
            }}>
              {t.tone}
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: AYT.font.mono, fontSize: 10, letterSpacing: 2, color: t.accent, textTransform: 'uppercase', marginBottom: 6 }}>
              ظاهر
            </div>
            <h2 style={{ margin: 0, fontFamily: AYT.font.display, fontWeight: 900, fontSize: 22, letterSpacing: -0.5, color: t.text }}>
              تم رو انتخاب کن.
            </h2>
            <p style={{ margin: '6px 0 0', fontSize: 12.5, color: t.textDim, lineHeight: 1.65 }}>
              همهٔ صفحات (لندینگ، چت، داشبورد، شغل‌ها، …) بلافاصله با تم هماهنگ می‌شن.
            </p>
          </div>

          <ThemeSwitcher value={t.key} onChange={setTheme}/>

          <div style={{ marginTop: 24 }}>
            <div style={{ fontFamily: AYT.font.mono, fontSize: 10, letterSpacing: 2, color: t.accent, textTransform: 'uppercase', marginBottom: 10 }}>
              گزینه‌های دیگر
            </div>
            {[
              { icon: 'bell', label: 'اعلان‌ها', sub: 'پیامک، ایمیل، پوش', value: 'فعال' },
              { icon: 'shield', label: 'حریم خصوصی', sub: 'کنترل داده‌های تحلیل' },
              { icon: 'user', label: 'زبان', sub: 'Persian · English', value: 'فارسی' },
              { icon: 'crown', label: 'اشتراک', sub: 'پلن و صورت‌حساب', value: 'حرفه‌ای' },
            ].map((row, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px',
                background: t.surface,
                border: `1px solid ${t.border}`,
                borderRadius: 14,
                marginBottom: 8,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: t.accentBg, border: `1px solid ${t.border}`,
                  display: 'grid', placeItems: 'center',
                }}>
                  <AYIcon name={row.icon} size={16} color={t.accent} stroke={1.8}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5, color: t.text }}>{row.label}</div>
                  <div style={{ fontSize: 11, color: t.textDim, marginTop: 2 }}>{row.sub}</div>
                </div>
                {row.value && (
                  <span style={{ fontFamily: AYT.font.mono, fontSize: 11, color: t.accent, fontWeight: 700 }}>
                    {row.value}
                  </span>
                )}
                <AYIcon name="chev-l" size={14} color={t.textFade}/>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 28, textAlign: 'center', fontFamily: AYT.font.mono, fontSize: 10.5, color: t.textFade, letterSpacing: 1 }}>
            A-Y · v{AY_FA('۱.۰.۴')} · ساخت ایران
          </div>
        </div>
      </div>

      {/* Bottom Nav — themed */}
      <div style={{
        position: 'absolute', bottom: 18, left: 16, right: 16, zIndex: 40,
        height: 64, padding: '0 6px', borderRadius: 22,
        background: t.surfaceNav,
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        border: `1px solid ${t.border}`,
        boxShadow: t.isDark ? '0 12px 48px rgba(0,0,0,0.55)' : '0 12px 48px rgba(0,0,0,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      }}>
        {[
          { icon: 'home', label: 'خانه' },
          { icon: 'message', label: 'مسیریاب' },
          { icon: 'user', label: 'پروفایل' },
          { icon: 'crown', label: 'اشتراک' },
          { icon: 'settings', label: 'تنظیمات', on: true },
        ].map((it, i) => (
          <div key={i} style={{
            position: 'relative', flex: 1,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            padding: '8px 0',
          }}>
            {it.on && <span style={{
              position: 'absolute', top: 4, width: 24, height: 3, borderRadius: 2,
              background: t.accent, boxShadow: `0 0 10px ${t.accent}`,
            }}/>}
            <AYIcon name={it.icon} size={19} color={it.on ? t.accent : t.textFade} stroke={it.on ? 2.1 : 1.7}/>
            <span style={{ fontSize: 9.5, fontWeight: it.on ? 800 : 500, color: it.on ? t.text : t.textFade }}>
              {it.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Expose
window.THEMES = THEMES;
window.ThemeContext = ThemeContext;
window.useActiveTheme = useActiveTheme;
window.ThemedRoot = ThemedRoot;
window.ThemeSwitcher = ThemeSwitcher;
window.ThemeTile = ThemeTile;
window.SettingsThemedScreen = SettingsThemedScreen;
