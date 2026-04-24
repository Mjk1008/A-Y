// EyVay — Home V2 (interactive)
const EY_H = window.EY;

function CountdownChip({ ends }) {
  const [t, setT] = useState(ends || '۰۱:۲۳:۴۵');
  useEffect(() => {
    const i = setInterval(() => {
      setT(prev => {
        const parts = prev.split(':').map(s => Number(String(s).replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))));
        let [h, m, s] = parts;
        s -= 1;
        if (s < 0) { s = 59; m -= 1; }
        if (m < 0) { m = 59; h -= 1; }
        if (h < 0) { h = 0; m = 0; s = 0; }
        const pad = (n) => fa(String(n).padStart(2, '0'));
        return `${pad(h)}:${pad(m)}:${pad(s)}`;
      });
    }, 1000);
    return () => clearInterval(i);
  }, []);
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      <Icon name="clock" size={13} color="rgba(246,239,228,0.7)" />
      <div style={{ fontFamily: EY_H.font.mono, fontSize: 12, letterSpacing: 1, color: 'rgba(246,239,228,0.85)' }}>{t}</div>
    </div>
  );
}

function FlashHero() {
  const { nav, getDeal } = useEY();
  const deal = getDeal('d1');
  return (
    <div onClick={() => nav('detail', { id: deal.id })} style={{
      margin: '0 20px', background: EY_H.color.plum, color: EY_H.color.paper,
      borderRadius: 28, padding: 20, position: 'relative', overflow: 'hidden', cursor: 'pointer',
    }}>
      <div style={{ position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 60% at 90% 0%, rgba(232,135,59,0.35), transparent 60%)' }}/>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
        <div style={{ width: 24, height: 24, borderRadius: 999, background: EY_H.color.saffron, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="bolt" size={14} color="#fff" stroke={2.4} />
        </div>
        <div style={{ fontFamily: EY_H.font.display, fontSize: 14, fontWeight: 700 }}>حراج لحظه‌ای</div>
        <div style={{ marginInlineStart: 'auto' }}><CountdownChip ends={deal.endsIn} /></div>
      </div>
      <div style={{ marginTop: 14, fontFamily: EY_H.font.display, fontSize: 26, fontWeight: 800, lineHeight: 1.1, letterSpacing: -0.5 }}>
        قهوه و صبحانه،<br/>نصف قیمت.
      </div>
      <div style={{ marginTop: 6, fontFamily: EY_H.font.body, fontSize: 12, color: 'rgba(246,239,228,0.65)' }}>
        {deal.store} — {deal.address}
      </div>
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <Toman value={deal.price} size={22} color={EY_H.color.paper} />
          <Toman value={deal.old} size={12} strike color="rgba(246,239,228,0.5)" weight={400} />
        </div>
        <div style={{
          background: EY_H.color.saffron, color: '#fff',
          fontFamily: EY_H.font.display, fontSize: 13, fontWeight: 700,
          height: 38, padding: '0 16px', borderRadius: 999,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          بگیرش <Icon name="chev-l" size={14} color="#fff" stroke={2.4} />
        </div>
      </div>
    </div>
  );
}

function HomeV2() {
  const { activeCat, setActiveCat, nav } = useEY();
  const user = window.EY_DATA.user;
  const deals = window.EY_DATA.deals.filter(d => activeCat === 'all' || d.cat === activeCat).slice(0, 6);

  return (
    <ScreenPad bg={EY_H.color.paper}>
      {/* Top bar */}
      <div style={{ position: 'absolute', top: 54, left: 20, right: 20, display: 'flex', alignItems: 'center', gap: 10, zIndex: 5 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 14,
          background: EY_H.color.ink, color: EY_H.color.saffronHi,
          fontFamily: EY_H.font.display, fontWeight: 900, fontSize: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>ای</div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <div style={{ fontFamily: EY_H.font.body, fontSize: 11, color: 'rgba(26,15,20,0.5)', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Icon name="pin" size={11} /> {user.location}
          </div>
          <div style={{ fontFamily: EY_H.font.display, fontWeight: 700, fontSize: 15 }}>سلام، {user.name.split(' ')[0]} 👋</div>
        </div>
        <div onClick={() => nav('notifications')} style={{
          width: 40, height: 40, borderRadius: 999, background: EY_H.color.paperSoft,
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer',
        }}>
          <Icon name="bell" size={18} />
          <div style={{ position: 'absolute', top: 9, insetInlineEnd: 9, width: 8, height: 8, borderRadius: 999, background: EY_H.color.clay, border: `2px solid ${EY_H.color.paperSoft}` }}/>
        </div>
      </div>

      {/* Scroll area */}
      <div style={{ position: 'absolute', top: 108, left: 0, right: 0, bottom: 84, overflowY: 'auto', overflowX: 'hidden' }}>
        {/* Search */}
        <div onClick={() => { useEY(); nav('search'); }} style={{ margin: '0 20px 16px' }}>
          <div onClick={() => nav('search')} style={{
            height: 48, borderRadius: 16, background: EY_H.color.paperSoft,
            display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10, cursor: 'pointer',
          }}>
            <Icon name="search" size={18} color="rgba(26,15,20,0.5)" />
            <div style={{ flex: 1, fontFamily: EY_H.font.body, fontSize: 13, color: 'rgba(26,15,20,0.45)' }}>چی بگردیم امروز؟</div>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: EY_H.color.ink, color: EY_H.color.paper, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="scan" size={14} color={EY_H.color.paper} />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: 8, padding: '0 20px 16px', overflowX: 'auto', direction: 'rtl' }}>
          {window.EY_DATA.categories.map(c => (
            <div key={c.k} onClick={() => setActiveCat(c.k)} style={{ cursor: 'pointer' }}>
              <Pill active={c.k === activeCat}>{c.label}</Pill>
            </div>
          ))}
        </div>

        <FlashHero />

        {/* Section header */}
        <div style={{ margin: '24px 20px 12px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: EY_H.font.mono, fontSize: 10, letterSpacing: 2, color: 'rgba(26,15,20,0.45)', textTransform: 'uppercase', marginBottom: 2 }}>
              نزدیک تو
            </div>
            <div style={{ fontFamily: EY_H.font.display, fontSize: 22, fontWeight: 800, letterSpacing: -0.3 }}>
              محله‌ات چی داره؟
            </div>
          </div>
          <div onClick={() => nav('search')} style={{ fontFamily: EY_H.font.body, fontSize: 12, color: EY_H.color.clay, fontWeight: 600, cursor: 'pointer' }}>
            همه ←
          </div>
        </div>

        {/* Grid */}
        <div style={{ margin: '0 20px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {deals.map(d => <DealCard key={d.id} deal={d} />)}
        </div>

        {deals.length === 0 && (
          <div style={{ margin: 40, textAlign: 'center', fontFamily: EY_H.font.body, color: 'rgba(26,15,20,0.5)' }}>
            پیشنهادی در این دسته پیدا نشد.
          </div>
        )}
      </div>

      <TabBarC />
    </ScreenPad>
  );
}

Object.assign(window, { HomeV2 });
