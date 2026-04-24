// EyVay — interactive screens (v2, connected to store)
const EY_E = window.EY;

// ── Shared: save heart button ──
function SaveBtn({ id, size = 30 }) {
  const { saved, toggleSaved } = useEY();
  const on = saved.has(id);
  return (
    <div onClick={(e) => { e.stopPropagation(); toggleSaved(id); }}
      style={{
        width: size, height: size, borderRadius: 999,
        background: 'rgba(246,239,228,0.92)',
        backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        transition: 'transform 0.15s',
        transform: on ? 'scale(1.08)' : 'scale(1)',
      }}>
      <svg width={size*0.55} height={size*0.55} viewBox="0 0 24 24"
        fill={on ? EY_E.color.clay : 'none'}
        stroke={on ? EY_E.color.clay : EY_E.color.ink}
        strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>
      </svg>
    </div>
  );
}

// ── Deal card (vertical) ──
function DealCard({ deal, compact = false }) {
  const { nav } = useEY();
  return (
    <div onClick={() => nav('detail', { id: deal.id })} style={{
      background: EY_E.color.paperSoft,
      borderRadius: 22, overflow: 'hidden',
      border: '1px solid rgba(26,15,20,0.05)',
      cursor: 'pointer',
      transition: 'transform 0.2s',
    }}
      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={{ position: 'relative' }}>
        <Placeholder label={deal.cat} height={compact ? 100 : 124} tone={deal.tone} />
        <div style={{ position: 'absolute', top: 8, insetInlineStart: 8 }}>
          <DiscountBadge percent={deal.percent} />
        </div>
        <div style={{ position: 'absolute', top: 8, insetInlineEnd: 8 }}>
          <SaveBtn id={deal.id} />
        </div>
        {deal.hot && (
          <div style={{
            position: 'absolute', bottom: 8, insetInlineStart: 8,
            background: EY_E.color.plum, color: EY_E.color.paper,
            fontFamily: EY_E.font.mono, fontSize: 9, letterSpacing: 1,
            padding: '3px 8px', borderRadius: 999,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <Icon name="flame" size={10} color={EY_E.color.saffronHi}/> داغ
          </div>
        )}
      </div>
      <div style={{ padding: '10px 12px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontFamily: EY_E.font.body, fontSize: 11, color: 'rgba(26,15,20,0.5)' }}>{deal.store}</div>
        <div style={{
          fontFamily: EY_E.font.display, fontSize: 13, fontWeight: 700,
          lineHeight: 1.35, color: EY_E.color.ink, minHeight: 36,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{deal.title}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
          <Toman value={deal.price} size={14} />
          <Toman value={deal.old} size={10} strike color="rgba(26,15,20,0.4)" weight={400} />
        </div>
      </div>
    </div>
  );
}

// ── Tab bar (connected) ──
function TabBarC() {
  const { tab, goTab, cartCount } = useEY();
  const items = [
    { k: 'home',   label: 'خانه',     icon: 'home' },
    { k: 'search', label: 'جستجو',   icon: 'search' },
    { k: 'saved',  label: 'ذخیره‌ها', icon: 'heart' },
    { k: 'bag',    label: 'سبد',      icon: 'bag' },
    { k: 'user',   label: 'من',       icon: 'user' },
  ];
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      height: 84, background: 'rgba(246,239,228,0.96)', backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(26,15,20,0.08)',
      display: 'flex', paddingBottom: 24, direction: 'rtl', zIndex: 20,
    }}>
      {items.map(it => {
        const active = it.k === tab;
        return (
          <div key={it.k} onClick={() => goTab(it.k)} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 3,
            color: active ? EY_E.color.ink : 'rgba(26,15,20,0.45)',
            cursor: 'pointer', position: 'relative',
          }}>
            <div style={{ position: 'relative' }}>
              <Icon name={it.icon} size={22} stroke={active ? 2.2 : 1.6} />
              {it.k === 'bag' && cartCount > 0 && (
                <div style={{
                  position: 'absolute', top: -4, insetInlineEnd: -6,
                  minWidth: 16, height: 16, padding: '0 4px', borderRadius: 999,
                  background: EY_E.color.clay, color: '#fff',
                  fontFamily: EY_E.font.display, fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{fa(cartCount)}</div>
              )}
            </div>
            <div style={{ fontFamily: EY_E.font.body, fontSize: 10, fontWeight: active ? 600 : 400 }}>{it.label}</div>
            {active && (
              <div style={{
                position: 'absolute', top: 4, width: 24, height: 3, borderRadius: 999,
                background: EY_E.color.saffron,
              }}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Splash ──
function SplashV2() {
  return (
    <ScreenPad bg={EY_E.color.plumDeep} dark>
      <div style={{ position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(232,135,59,0.35), transparent 70%)' }}/>
      <div style={{ position: 'absolute', top: '38%', left: 0, right: 0, textAlign: 'center' }}>
        <div style={{
          fontFamily: EY_E.font.display, fontSize: 86, fontWeight: 900,
          color: EY_E.color.paper, letterSpacing: -2, lineHeight: 0.9,
        }}>
          ای‌<span style={{ color: EY_E.color.saffronHi }}>وای</span>
        </div>
        <div style={{ marginTop: 12, fontFamily: EY_E.font.body, fontSize: 13, color: 'rgba(246,239,228,0.55)', letterSpacing: 6}}>
          ارزان‌ترین، سریع‌ترین
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 120, display: 'flex', gap: 6, justifyContent: 'center' }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: 999, background: 'rgba(246,239,228,0.3)'}}/>
        ))}
      </div>
    </ScreenPad>
  );
}

// ── Onboarding (3 steps) ──
function OnboardingV2() {
  const [step, setStep] = useState(0);
  const { nav } = useEY();
  const steps = [
    { title: 'تخفیف‌هایی که\nدل می‌برند', body: 'هر روز صدها پیشنهاد ویژه از فروشگاه‌های محله‌ات.', tone: 'saffron', tag: 'market' },
    { title: 'محله‌ات\nارزان‌تر می‌شه', body: 'بر اساس فاصله‌ی جغرافیایی، بهترین‌ها رو اول می‌بینی.', tone: 'plum', tag: 'neighborhood' },
    { title: 'یک کلیک\nتا سبد خرید', body: 'رزرو، پرداخت، دریافت کد — همه در ای‌وای.', tone: 'rose', tag: 'checkout' },
  ];
  const s = steps[step];
  const next = () => step < 2 ? setStep(step + 1) : nav('home');

  return (
    <ScreenPad bg={EY_E.color.paper}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '55%' }}>
        <Placeholder label={s.tag} height="100%" tone={s.tone} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(34,18,26,0) 40%, #F6EFE4 100%)' }}/>
        <div style={{ position: 'absolute', top: 64, insetInlineEnd: 24, fontFamily: EY_E.font.mono, fontSize: 11, letterSpacing: 2, color: EY_E.color.paper, opacity: 0.8 }}>
          {fa(step + 1).padStart(2, '۰')} / ۰۳
        </div>
        <div onClick={() => nav('home')} style={{ position: 'absolute', top: 62, insetInlineStart: 24, fontFamily: EY_E.font.body, fontSize: 13, color: EY_E.color.paper, opacity: 0.8, cursor: 'pointer' }}>
          رد شدن
        </div>
      </div>
      <div key={step} style={{ position: 'absolute', top: '50%', left: 0, right: 0, bottom: 0, padding: '32px 28px 120px'}}>
        <div style={{ fontFamily: EY_E.font.display, fontSize: 38, fontWeight: 800, lineHeight: 1.08, letterSpacing: -1, whiteSpace: 'pre-line', color: EY_E.color.ink }}>
          {s.title.split('\n').map((l, i) => <div key={i} style={{ color: i === 1 ? EY_E.color.clay : EY_E.color.ink }}>{l}</div>)}
        </div>
        <div style={{ marginTop: 14, fontFamily: EY_E.font.body, fontSize: 15, lineHeight: 1.7, color: 'rgba(26,15,20,0.65)', maxWidth: 300 }}>
          {s.body}
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 22 }}>
          {steps.map((_, i) => (
            <div key={i} style={{ width: i === step ? 22 : 6, height: 6, borderRadius: 999, background: i === step ? EY_E.color.ink : 'rgba(26,15,20,0.2)', transition: 'width 0.3s' }}/>
          ))}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 20, right: 20, bottom: 40 }}>
        <button onClick={next} style={{
          width: '100%', height: 56, border: 'none', borderRadius: 999,
          background: EY_E.color.ink, color: EY_E.color.paper,
          fontFamily: EY_E.font.display, fontSize: 16, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer',
        }}>
          {step < 2 ? 'ادامه' : 'بزن بریم'}
          <Icon name="chev-l" size={18} color={EY_E.color.paper} />
        </button>
      </div>
    </ScreenPad>
  );
}

Object.assign(window, { SaveBtn, DealCard, TabBarC, SplashV2, OnboardingV2 });
