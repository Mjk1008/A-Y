// A-Y (EyVay) — dark cinematic tokens
window.AY = {
  color: {
    // Deep emerald-black base
    ink950: '#020306',
    ink900: '#05090a',
    ink850: '#070d10',
    ink800: '#0a1a14',
    ink700: '#0e2018',
    ink600: '#13281f',
    ink500: '#1a3a2c',
    ink400: '#26564a',
    ink300: '#4a7566',
    ink200: '#8aa99b',
    ink100: '#c9d8d0',
    ink50:  '#e8efea',

    // Emerald accent
    em300: '#6ee7b7',
    em400: '#34d399',
    em500: '#10b981',
    em600: '#059669',
    em700: '#047857',

    // Gold (premium)
    gold300: '#fde68a',
    gold400: '#facc15',
    gold500: '#eab308',
    gold600: '#ca8a04',

    // Glass
    glass:       'rgba(31,46,40,0.55)',
    glassBorder: 'rgba(110,231,183,0.10)',
    glassHi:     'rgba(255,255,255,0.06)',

    // Text
    text:     '#e8efea',
    textDim:  'rgba(232,239,234,0.62)',
    textFade: 'rgba(232,239,234,0.35)',
  },
  radius: { sm: 10, md: 14, lg: 20, xl: 28, pill: 999 },
  font: {
    display: "'Peyda', 'Vazirmatn', 'Tiro Gurmukhi', sans-serif",
    body:    "'Peyda', 'Vazirmatn', -apple-system, system-ui, sans-serif",
    mono:    "'JetBrains Mono', ui-monospace, monospace",
  },
  shadow: {
    glow:   '0 10px 40px rgba(16,185,129,0.25), 0 0 0 1px rgba(110,231,183,0.18)',
    gold:   '0 10px 40px rgba(234,179,8,0.25), 0 0 0 1px rgba(250,204,21,0.25)',
    lift:   '0 24px 60px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.4)',
  },
};

// Persian-digit helper
window.AY_FA = (s) => String(s).replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d]);
