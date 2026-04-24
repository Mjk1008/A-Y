// A-Y — shared primitives
const AY = window.AY;

// Pure-stroke Lucide-style icons, 24px default
function AYIcon({ name, size = 20, color = 'currentColor', stroke = 1.8 }) {
  const p = { fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    'sparkle':  <><path {...p} d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></>,
    'arrow-l':  <path {...p} d="M19 12H5M12 19l-7-7 7-7"/>,
    'arrow-r':  <path {...p} d="M5 12h14M12 5l7 7-7 7"/>,
    'chev-l':   <path {...p} d="M15 18l-6-6 6-6"/>,
    'chev-r':   <path {...p} d="M9 6l6 6-6 6"/>,
    'chev-d':   <path {...p} d="M6 9l6 6 6-6"/>,
    'check':    <path {...p} d="M20 6L9 17l-5-5"/>,
    'x':        <path {...p} d="M18 6L6 18M6 6l12 12"/>,
    'plus':     <path {...p} d="M12 5v14M5 12h14"/>,
    'upload':   <path {...p} d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>,
    'bolt':     <path {...p} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>,
    'compass':  <><circle cx="12" cy="12" r="9" {...p}/><path {...p} d="M15.5 8.5l-2 6-6 2 2-6 6-2z"/></>,
    'target':   <><circle cx="12" cy="12" r="9" {...p}/><circle cx="12" cy="12" r="5" {...p}/><circle cx="12" cy="12" r="1" {...p}/></>,
    'message':  <path {...p} d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"/>,
    'send':     <path {...p} d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>,
    'user':     <><circle cx="12" cy="8" r="4" {...p}/><path {...p} d="M20 21a8 8 0 10-16 0"/></>,
    'crown':    <path {...p} d="M2 7l5 4 5-7 5 7 5-4-2 12H4L2 7z"/>,
    'shield':   <path {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    'brain':    <path {...p} d="M9 2a3 3 0 00-3 3v1a3 3 0 00-3 3 3 3 0 002 2.8A3 3 0 005 15a3 3 0 002 2.8A3 3 0 009 21a3 3 0 003-3V5a3 3 0 00-3-3zM15 2a3 3 0 013 3v1a3 3 0 013 3 3 3 0 01-2 2.8A3 3 0 0119 15a3 3 0 01-2 2.8A3 3 0 0115 21a3 3 0 01-3-3V5a3 3 0 013-3z"/>,
    'grid':     <><rect x="3" y="3" width="7" height="7" {...p}/><rect x="14" y="3" width="7" height="7" {...p}/><rect x="3" y="14" width="7" height="7" {...p}/><rect x="14" y="14" width="7" height="7" {...p}/></>,
    'list':     <path {...p} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>,
    'clock':    <><circle cx="12" cy="12" r="9" {...p}/><path {...p} d="M12 7v5l3 2"/></>,
    'lock':     <><rect x="3" y="11" width="18" height="10" rx="2" {...p}/><path {...p} d="M7 11V7a5 5 0 0110 0v4"/></>,
    'search':   <><circle cx="11" cy="11" r="7" {...p}/><path {...p} d="M21 21l-4.3-4.3"/></>,
    'file':     <><path {...p} d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path {...p} d="M14 2v6h6"/></>,
    'mic':      <><rect x="9" y="3" width="6" height="12" rx="3" {...p}/><path {...p} d="M5 11a7 7 0 0014 0M12 18v3"/></>,
    'plus-s':   <path {...p} d="M12 5v14M5 12h14"/>,
    'trending': <path {...p} d="M3 17l6-6 4 4 8-8M15 7h6v6"/>,
    'star':     <path {...p} d="M12 2l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-7z"/>,
    'play':     <path {...p} d="M6 4l14 8-14 8V4z"/>,
    'book':     <path {...p} d="M4 4v16a1 1 0 001 1h14V3H5a1 1 0 00-1 1z M4 19h15"/>,
    'home':     <path {...p} d="M3 11l9-8 9 8v10a2 2 0 01-2 2h-4v-6H10v6H6a2 2 0 01-2-2V11z"/>,
    'settings': <><circle cx="12" cy="12" r="3" {...p}/><path {...p} d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 01-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 010-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3h.1a1.7 1.7 0 001-1.5V3a2 2 0 014 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8v.1a1.7 1.7 0 001.5 1H21a2 2 0 010 4h-.1a1.7 1.7 0 00-1.5 1z"/></>,
    'bell':     <path {...p} d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 004 0"/>,
    'logo':     <><path {...p} d="M4 4l6 10v6M20 4l-6 10" strokeWidth={stroke}/><circle cx="10" cy="20" r="1" fill={color} stroke="none"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'inline-block', flexShrink: 0 }}>
      {paths[name] || null}
    </svg>
  );
}

// Glass card
function Glass({ children, style = {}, accent, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: 'linear-gradient(180deg, rgba(31,46,40,0.65) 0%, rgba(18,30,24,0.55) 100%)',
      backdropFilter: 'blur(14px) saturate(160%)',
      WebkitBackdropFilter: 'blur(14px) saturate(160%)',
      border: `1px solid ${accent || 'rgba(110,231,183,0.10)'}`,
      borderRadius: 20,
      boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset, 0 24px 60px rgba(0,0,0,0.35)',
      position: 'relative',
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}>{children}</div>
  );
}

// Primary emerald button
function AYButton({ children, variant = 'primary', size = 'md', style = {}, iconEnd, iconStart, onClick, full }) {
  const sizes = {
    sm: { h: 36, fs: 13, px: 16 },
    md: { h: 44, fs: 14, px: 20 },
    lg: { h: 52, fs: 16, px: 24 },
  };
  const s = sizes[size];
  const variants = {
    primary: {
      background: 'linear-gradient(180deg, #34d399 0%, #10b981 100%)',
      color: '#04110a',
      boxShadow: '0 8px 28px rgba(16,185,129,0.45), 0 0 0 1px rgba(110,231,183,0.3) inset, 0 1px 0 rgba(255,255,255,0.3) inset',
      border: 'none',
    },
    secondary: {
      background: 'rgba(255,255,255,0.04)',
      color: '#e8efea',
      border: '1px solid rgba(110,231,183,0.22)',
      backdropFilter: 'blur(8px)',
    },
    ghost: {
      background: 'transparent',
      color: '#e8efea',
      border: 'none',
    },
    gold: {
      background: 'linear-gradient(180deg, #fde68a 0%, #eab308 100%)',
      color: '#2a1d03',
      boxShadow: '0 8px 28px rgba(234,179,8,0.4), 0 0 0 1px rgba(250,204,21,0.5) inset, 0 1px 0 rgba(255,255,255,0.35) inset',
      border: 'none',
    },
    dark: {
      background: 'rgba(2,3,6,0.7)',
      color: '#e8efea',
      border: '1px solid rgba(110,231,183,0.14)',
    },
  };
  return (
    <button onClick={onClick} style={{
      height: s.h, padding: `0 ${s.px}px`,
      fontFamily: AY.font.display, fontSize: s.fs, fontWeight: 700,
      letterSpacing: -0.2,
      borderRadius: 999,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      width: full ? '100%' : undefined,
      cursor: 'pointer',
      transition: 'transform .15s ease, filter .15s ease',
      ...variants[variant], ...style,
    }}>
      {iconStart}
      {children}
      {iconEnd}
    </button>
  );
}

// Label pill / kicker
function AYKicker({ children, tone = 'emerald', icon, style = {} }) {
  const tones = {
    emerald: { bg: 'rgba(16,185,129,0.10)', bd: 'rgba(110,231,183,0.25)', fg: '#6ee7b7' },
    gold:    { bg: 'rgba(234,179,8,0.10)',  bd: 'rgba(250,204,21,0.35)',  fg: '#fde68a' },
    ink:     { bg: 'rgba(255,255,255,0.05)',bd: 'rgba(255,255,255,0.10)', fg: '#c9d8d0' },
  };
  const t = tones[tone] || tones.emerald;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      height: 28, padding: '0 12px', borderRadius: 999,
      background: t.bg, border: `1px solid ${t.bd}`, color: t.fg,
      fontFamily: AY.font.display, fontSize: 11, fontWeight: 600,
      letterSpacing: 0.3, textTransform: 'uppercase',
      backdropFilter: 'blur(8px)',
      ...style,
    }}>
      {icon}
      {children}
    </span>
  );
}

// Tool glyph — geometric monogram for AI tools
function ToolGlyph({ name = 'GPT', tone = 'emerald', size = 44 }) {
  const tones = {
    emerald: { bg: 'linear-gradient(135deg, #0e2018 0%, #13281f 100%)', fg: '#6ee7b7', bd: 'rgba(110,231,183,0.22)' },
    gold:    { bg: 'linear-gradient(135deg, #2a1d03 0%, #1a1100 100%)', fg: '#fde68a', bd: 'rgba(250,204,21,0.3)' },
    violet:  { bg: 'linear-gradient(135deg, #1a1030 0%, #0d0820 100%)', fg: '#c4b5fd', bd: 'rgba(167,139,250,0.3)' },
    rose:    { bg: 'linear-gradient(135deg, #2a0e1a 0%, #1a0610 100%)', fg: '#fda4af', bd: 'rgba(244,114,182,0.3)' },
    cyan:    { bg: 'linear-gradient(135deg, #042a30 0%, #021520 100%)', fg: '#67e8f9', bd: 'rgba(103,232,249,0.3)' },
  };
  const t = tones[tone] || tones.emerald;
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28,
      background: t.bg, border: `1px solid ${t.bd}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: t.fg,
      fontFamily: AY.font.mono, fontSize: size * 0.32, fontWeight: 700, letterSpacing: -0.5,
      boxShadow: `0 0 24px ${t.fg}22, 0 4px 16px rgba(0,0,0,0.5)`,
      flexShrink: 0,
    }}>{name}</div>
  );
}

// Avatar monogram
function Avatar({ initials = '۱', tone = 'emerald', size = 36 }) {
  const tones = {
    emerald: ['#10b981', '#047857'],
    gold:    ['#eab308', '#ca8a04'],
    ink:     ['#4a7566', '#1a3a2c'],
    cyan:    ['#0891b2', '#155e75'],
    violet:  ['#8b5cf6', '#5b21b6'],
  };
  const [a, b] = tones[tone] || tones.emerald;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${a}, ${b})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#04110a', fontFamily: AY.font.display, fontWeight: 800,
      fontSize: size * 0.42, letterSpacing: -0.3,
      boxShadow: `0 0 20px ${a}55`,
      flexShrink: 0,
    }}>{initials}</div>
  );
}

// Floating glass pill nav (used on landing + mobile frame)
function GlassPill({ children, style = {} }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 12,
      height: 48, padding: '0 18px', borderRadius: 999,
      background: 'rgba(5,9,10,0.55)',
      backdropFilter: 'blur(18px) saturate(160%)',
      WebkitBackdropFilter: 'blur(18px) saturate(160%)',
      border: '1px solid rgba(110,231,183,0.14)',
      boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05) inset',
      ...style,
    }}>{children}</div>
  );
}

// Divider
function Divider({ label, style = {} }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, ...style }}>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(110,231,183,0.18), transparent)' }}/>
      {label && (
        <div style={{
          fontFamily: AY.font.mono, fontSize: 10, letterSpacing: 2,
          color: 'rgba(232,239,234,0.4)', textTransform: 'uppercase',
        }}>{label}</div>
      )}
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(110,231,183,0.18), transparent)' }}/>
    </div>
  );
}

Object.assign(window, { AYIcon, Glass, AYButton, AYKicker, ToolGlyph, Avatar, GlassPill, Divider });
