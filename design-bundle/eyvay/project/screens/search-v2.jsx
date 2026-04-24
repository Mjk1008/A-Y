// EyVay — Search V2
const EY_Srch = window.EY;

function SearchV2() {
  const { searchQ, setSearchQ, setActiveCat, goTab } = useEY();
  const data = window.EY_DATA;
  const [focused, setFocused] = useState(false);
  const results = searchQ
    ? data.deals.filter(d => d.title.includes(searchQ) || d.store.includes(searchQ))
    : [];

  return (
    <ScreenPad bg={EY_Srch.color.paper}>
      <div style={{ position: 'absolute', top: 58, left: 20, right: 20, zIndex: 5 }}>
        <div style={{ fontFamily: EY_Srch.font.display, fontSize: 30, fontWeight: 800, letterSpacing: -0.5, marginBottom: 14 }}>
          چی می‌خوای امروز؟
        </div>
        <div style={{
          height: 52, borderRadius: 16,
          background: EY_Srch.color.paperSoft,
          display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12,
          border: focused ? `2px solid ${EY_Srch.color.ink}` : '2px solid transparent',
          transition: 'border 0.15s',
        }}>
          <Icon name="search" size={18} color="rgba(26,15,20,0.5)" />
          <input
            value={searchQ} onChange={(e) => setSearchQ(e.target.value)}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            placeholder="فروشگاه یا محصول..."
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: EY_Srch.font.body, fontSize: 14, color: EY_Srch.color.ink,
              direction: 'rtl',
            }} />
          {searchQ && (
            <div onClick={() => setSearchQ('')} style={{ cursor: 'pointer' }}>
              <Icon name="x" size={16} color="rgba(26,15,20,0.5)" />
            </div>
          )}
        </div>
      </div>

      <div style={{ position: 'absolute', top: 190, left: 0, right: 0, bottom: 84, overflowY: 'auto' }}>
        {searchQ ? (
          <div style={{ padding: '10px 20px' }}>
            <div style={{ fontFamily: EY_Srch.font.mono, fontSize: 10, letterSpacing: 1.5, color: 'rgba(26,15,20,0.5)', marginBottom: 10 }}>
              {fa(results.length)} نتیجه
            </div>
            {results.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'rgba(26,15,20,0.5)', fontFamily: EY_Srch.font.body, fontSize: 13 }}>
                چیزی پیدا نشد. یک کلمه‌ی دیگه امتحان کن.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {results.map(d => <DealCard key={d.id} deal={d} />)}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div style={{ padding: '10px 20px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <Icon name="flame" size={15} color={EY_Srch.color.clay} />
                <span style={{ fontFamily: EY_Srch.font.display, fontSize: 13, fontWeight: 700 }}>داغ امروز</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {data.trending.map((t, i) => (
                  <div key={t} onClick={() => setSearchQ(t)} style={{ cursor: 'pointer' }}>
                    <Pill tone={i === 2 ? 'saffron' : 'paper'}>{t}</Pill>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '0 20px 20px' }}>
              <div style={{ fontFamily: EY_Srch.font.display, fontSize: 13, fontWeight: 700, marginBottom: 10 }}>دسته‌بندی‌ها</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {data.categories.filter(c => c.k !== 'all').map(c => {
                  const count = data.deals.filter(d => d.cat === c.k).length;
                  return (
                    <div key={c.k} onClick={() => { setActiveCat(c.k); goTab('home'); }} style={{ height: 110, borderRadius: 20, overflow: 'hidden', position: 'relative', cursor: 'pointer' }}>
                      <Placeholder label={c.k} height="100%" tone={c.tone} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(26,15,20,0.55))', padding: 12, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', color: EY_Srch.color.paper }}>
                        <div style={{ fontFamily: EY_Srch.font.display, fontSize: 16, fontWeight: 800 }}>{c.label}</div>
                        <div style={{ fontFamily: EY_Srch.font.mono, fontSize: 10, letterSpacing: 1, opacity: 0.8 }}>{fa(count)} پیشنهاد</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <TabBarC />
    </ScreenPad>
  );
}

Object.assign(window, { SearchV2 });
