// Shared UI primitives used across EyVay screens
// Persian RTL. All screens are placed inside IOSDevice at 390x844.

const EY = window.EY;

// ── Placeholder image: subtly-striped block with monospace explainer ──
function Placeholder({ label = 'image', height = 160, tone = 'cream', style = {} }) {
  const tones = {
    cream:   { bg: '#E6D9C2', fg: 'rgba(26,15,20,0.45)', stripe: 'rgba(26,15,20,0.05)' },
    plum:    { bg: '#2B1622', fg: 'rgba(246,239,228,0.55)', stripe: 'rgba(246,239,228,0.05)' },
    saffron: { bg: '#EBB079', fg: 'rgba(26,15,20,0.55)', stripe: 'rgba(26,15,20,0.08)' },
    sage:    { bg: '#A8B59A', fg: 'rgba(26,15,20,0.55)', stripe: 'rgba(26,15,20,0.08)' },
    rose:    { bg: '#E8B4A0', fg: 'rgba(26,15,20,0.55)', stripe: 'rgba(26,15,20,0.08)' },
  };
  const t = tones[tone] || tones.cream;
  return (
    <div style={{
      width: '100%',
      height,
      background: `repeating-linear-gradient(135deg, ${t.bg} 0 10px, ${t.stripe} 10px 11px)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: EY.font.mono,
      fontSize: 10,
      letterSpacing: 0.4,
      color: t.fg,
      textTransform: 'uppercase',
      ...style,
    }}>
      {label}
    </div>
  );
}

// ── Pill / chip ──
function Pill({ children, active = false, tone = 'ink', style = {} }) {
  const map = {
    ink: { bg: active ? EY.color.ink : 'transparent', fg: active ? EY.color.paper : EY.color.ink, border: active ? EY.color.ink : 'rgba(26,15,20,0.15)' },
    saffron: { bg: EY.color.saffron, fg: '#fff', border: EY.color.saffron },
    paper: { bg: EY.color.paperSoft, fg: EY.color.ink, border: 'transparent' },
    plum: { bg: active ? EY.color.paper : 'transparent', fg: active ? EY.color.plum : EY.color.paper, border: active ? EY.color.paper : 'rgba(246,239,228,0.3)' },
  };
  const s = map[tone];
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 32,
      padding: '0 14px',
      borderRadius: 999,
      background: s.bg,
      color: s.fg,
      border: `1px solid ${s.border}`,
      fontFamily: EY.font.body,
      fontSize: 12,
      fontWeight: 500,
      whiteSpace: 'nowrap',
      ...style,
    }}>{children}</span>
  );
}

// ── Glyph stroke icons (simple, original) ──
function Icon({ name, size = 20, color = 'currentColor', stroke = 1.6 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'home':    return <svg {...p}><path d="M4 11 12 4l8 7"/><path d="M6 10v9h12v-9"/></svg>;
    case 'search':  return <svg {...p}><circle cx="11" cy="11" r="6"/><path d="m20 20-4-4"/></svg>;
    case 'heart':   return <svg {...p}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/></svg>;
    case 'user':    return <svg {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 5-7 8-7s7 2 8 7"/></svg>;
    case 'bag':     return <svg {...p}><path d="M5 8h14l-1 12H6z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>;
    case 'bolt':    return <svg {...p}><path d="M13 3 5 14h6l-1 7 8-11h-6z"/></svg>;
    case 'clock':   return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case 'pin':     return <svg {...p}><path d="M12 22s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>;
    case 'chev':    return <svg {...p}><path d="m9 6 6 6-6 6"/></svg>;
    case 'chev-l':  return <svg {...p}><path d="m15 6-6 6 6 6"/></svg>;
    case 'chev-d':  return <svg {...p}><path d="m6 9 6 6 6-6"/></svg>;
    case 'plus':    return <svg {...p}><path d="M12 5v14M5 12h14"/></svg>;
    case 'minus':   return <svg {...p}><path d="M5 12h14"/></svg>;
    case 'share':   return <svg {...p}><path d="M4 12v7h16v-7"/><path d="M12 3v13"/><path d="m7 8 5-5 5 5"/></svg>;
    case 'flame':   return <svg {...p}><path d="M12 3c2 3 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3 0-5 1-8z"/></svg>;
    case 'filter':  return <svg {...p}><path d="M3 5h18M6 12h12M10 19h4"/></svg>;
    case 'star':    return <svg {...p}><path d="m12 3 2.5 6 6.5.5-5 4.5 1.5 6.5L12 17l-5.5 3.5L8 14 3 9.5l6.5-.5z"/></svg>;
    case 'bell':    return <svg {...p}><path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>;
    case 'scan':    return <svg {...p}><path d="M4 8V5h3M20 8V5h-3M4 16v3h3M20 16v3h-3"/><path d="M4 12h16"/></svg>;
    case 'ticket': return <svg {...p}><path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"/><path d="M12 6v12" strokeDasharray="2 2"/></svg>;
    case 'check':   return <svg {...p}><path d="m5 12 5 5 9-10"/></svg>;
    case 'x':       return <svg {...p}><path d="M6 6l12 12M18 6 6 18"/></svg>;
    case 'card':    return <svg {...p}><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/></svg>;
    case 'wallet':  return <svg {...p}><path d="M4 7h14v10H4z"/><path d="M18 10h3v4h-3a2 2 0 0 1 0-4z"/></svg>;
    case 'sparkle':return <svg {...p}><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/></svg>;
    default: return null;
  }
}

// ── Persian numerals helper ──
const FA_DIGITS = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
function fa(n) {
  return String(n).replace(/\d/g, (d) => FA_DIGITS[d]);
}

// ── Toman price: "۱۲۳٬۰۰۰ تومان" ──
function Toman({ value, size = 16, strike = false, color, weight = 700 }) {
  const formatted = fa(Number(value).toLocaleString('en-US')).replace(/,/g, '٬');
  return (
    <span style={{
      fontFamily: EY.font.display,
      fontSize: size,
      fontWeight: weight,
      color: color || EY.color.ink,
      textDecoration: strike ? 'line-through' : 'none',
      letterSpacing: 0,
      direction: 'rtl',
      unicodeBidi: 'plaintext',
    }}>
      {formatted}<span style={{ fontWeight: 400, fontSize: size * 0.7, marginInlineStart: 4, opacity: 0.7 }}>تومان</span>
    </span>
  );
}

// ── Badge — used for % off etc. ──
function DiscountBadge({ percent, style = {} }) {
  return (
    <div style={{
      background: EY.color.saffron,
      color: '#fff',
      fontFamily: EY.font.display,
      fontWeight: 800,
      fontSize: 13,
      height: 26,
      padding: '0 10px',
      borderRadius: 999,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 2,
      letterSpacing: 0.2,
      ...style,
    }}>
      <span>٪{fa(percent)}</span>
      <span style={{ fontSize: 10, opacity: 0.85, marginInlineStart: 2 }}>تخفیف</span>
    </div>
  );
}

// ── Tab bar (bottom) ──
function TabBar({ active = 'home', dark = false }) {
  const items = [
    { k: 'home',   label: 'خانه',      icon: 'home' },
    { k: 'search', label: 'جستجو',    icon: 'search' },
    { k: 'saved',  label: 'ذخیره‌ها',  icon: 'heart' },
    { k: 'bag',    label: 'سبد',       icon: 'bag' },
    { k: 'user',   label: 'من',        icon: 'user' },
  ];
  const bg = dark ? 'rgba(34,18,26,0.92)' : 'rgba(246,239,228,0.94)';
  const line = dark ? 'rgba(246,239,228,0.08)' : 'rgba(26,15,20,0.08)';
  const muted = dark ? 'rgba(246,239,228,0.5)' : 'rgba(26,15,20,0.45)';
  const on = dark ? EY.color.saffronHi : EY.color.ink;

  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      height: 88,
      background: bg,
      backdropFilter: 'blur(20px)',
      borderTop: `1px solid ${line}`,
      display: 'flex',
      paddingBottom: 24,
      direction: 'rtl',
    }}>
      {items.map(it => {
        const isActive = it.k === active;
        return (
          <div key={it.k} style={{
            flex: 1,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 3,
            color: isActive ? on : muted,
          }}>
            <Icon name={it.icon} size={22} stroke={isActive ? 2.2 : 1.6} />
            <div style={{ fontFamily: EY.font.body, fontSize: 10, fontWeight: isActive ? 600 : 400 }}>{it.label}</div>
          </div>
        );
      })}
    </div>
  );
}

// ── Top status strip baked into screen content area (below real status bar) ──
function ScreenPad({ children, bg = EY.color.paper, dark = false, style = {} }) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: bg,
      color: dark ? EY.color.paper : EY.color.ink,
      fontFamily: EY.font.body,
      direction: 'rtl',
      overflow: 'hidden',
      ...style,
    }}>
      {children}
    </div>
  );
}

Object.assign(window, {
  Placeholder, Pill, Icon, Toman, DiscountBadge, TabBar, ScreenPad, fa,
});
