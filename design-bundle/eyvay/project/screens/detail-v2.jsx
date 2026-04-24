// EyVay — Detail V2
const EY_Det = window.EY;

function DetailV2() {
  const { route, back, getDeal, addToCart, nav, flash } = useEY();
  const deal = getDeal(route.params.id) || getDeal('d1');
  const [qty, setQty] = useState(1);

  return (
    <ScreenPad bg={EY_Det.color.paper}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 420 }}>
        <Placeholder label="product · hero" height="100%" tone={deal.tone} />
        <div style={{ position: 'absolute', top: 56, left: 20, right: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div onClick={back} style={{ width: 40, height: 40, borderRadius: 999, background: 'rgba(246,239,228,0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Icon name="chev" size={18} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div onClick={() => flash('لینک کپی شد')} style={{ width: 40, height: 40, borderRadius: 999, background: 'rgba(246,239,228,0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Icon name="share" size={17} />
            </div>
            <SaveBtn id={deal.id} size={40} />
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 50, insetInlineStart: 20 }}>
          <DiscountBadge percent={deal.percent} />
        </div>
        <div style={{ position: 'absolute', bottom: 50, insetInlineEnd: 20, display: 'flex', gap: 4 }}>
          {[0,1,2,3].map(i => <div key={i} style={{ width: i === 0 ? 18 : 5, height: 5, borderRadius: 999, background: i === 0 ? EY_Det.color.ink : 'rgba(246,239,228,0.7)' }}/>)}
        </div>
      </div>

      <div style={{ position: 'absolute', top: 390, left: 0, right: 0, bottom: 98, background: EY_Det.color.paper, borderRadius: '28px 28px 0 0', padding: '22px 20px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{ fontFamily: EY_Det.font.mono, fontSize: 10, letterSpacing: 2, color: EY_Det.color.clay, textTransform: 'uppercase' }}>
            فقط {deal.endsIn}
          </div>
          <div style={{ flex: 1, height: 1, background: 'rgba(26,15,20,0.1)' }}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon name="star" size={13} color={EY_Det.color.saffron} />
            <span style={{ fontFamily: EY_Det.font.body, fontSize: 12, fontWeight: 600 }}>{fa(deal.rating)}</span>
            <span style={{ fontFamily: EY_Det.font.body, fontSize: 11, opacity: 0.5 }}>({fa(deal.ratingCount)})</span>
          </div>
        </div>
        <div style={{ fontFamily: EY_Det.font.display, fontSize: 24, fontWeight: 800, lineHeight: 1.2, letterSpacing: -0.5 }}>
          {deal.title}
        </div>
        <div style={{ marginTop: 6, fontFamily: EY_Det.font.body, fontSize: 13, color: 'rgba(26,15,20,0.55)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="pin" size={13} /> {deal.store} · {fa(deal.distance)} متر از شما
        </div>

        <div style={{ marginTop: 18, display: 'flex', alignItems: 'baseline', gap: 10, paddingBottom: 16, borderBottom: '1px dashed rgba(26,15,20,0.15)' }}>
          <Toman value={deal.price} size={24} />
          <Toman value={deal.old} size={13} strike color="rgba(26,15,20,0.4)" weight={400} />
          <div style={{ marginInlineStart: 'auto', fontFamily: EY_Det.font.body, fontSize: 11, color: EY_Det.color.clay, fontWeight: 600 }}>
            {fa((deal.old - deal.price).toLocaleString('en-US')).replace(/,/g,'٬')} ت صرفه
          </div>
        </div>

        <div style={{ marginTop: 14, fontFamily: EY_Det.font.body, fontSize: 13, lineHeight: 1.8, color: 'rgba(26,15,20,0.7)' }}>
          {deal.desc}
        </div>

        {/* qty picker */}
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: EY_Det.font.display, fontSize: 13, fontWeight: 700 }}>تعداد</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: EY_Det.color.paperSoft, borderRadius: 999, padding: '4px 6px' }}>
            <div onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 30, height: 30, borderRadius: 999, background: EY_Det.color.ink, color: EY_Det.color.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Icon name="minus" size={14} color={EY_Det.color.paper} />
            </div>
            <div style={{ fontFamily: EY_Det.font.display, fontSize: 15, fontWeight: 700, width: 20, textAlign: 'center' }}>{fa(qty)}</div>
            <div onClick={() => setQty(qty + 1)} style={{ width: 30, height: 30, borderRadius: 999, background: EY_Det.color.ink, color: EY_Det.color.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Icon name="plus" size={14} color={EY_Det.color.paper} />
            </div>
          </div>
        </div>

        {/* Reviews teaser */}
        <div style={{ marginTop: 22, padding: 16, borderRadius: 18, background: EY_Det.color.paperSoft }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 28, height: 28, borderRadius: 999, background: EY_Det.color.sage, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: EY_Det.font.display, fontWeight: 800, fontSize: 12 }}>م</div>
            <div style={{ fontFamily: EY_Det.font.display, fontSize: 12, fontWeight: 700 }}>مریم ک.</div>
            <div style={{ display: 'flex', gap: 1, marginInlineStart: 'auto' }}>
              {[0,1,2,3,4].map(i => <Icon key={i} name="star" size={11} color={EY_Det.color.saffron} stroke={2.4} />)}
            </div>
          </div>
          <div style={{ fontFamily: EY_Det.font.body, fontSize: 12, lineHeight: 1.7, color: 'rgba(26,15,20,0.7)' }}>
            «واقعاً ارزشش رو داشت. صبحانه خیلی تازه و حجمش عالی. حتماً دوباره می‌آم.»
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 20px 28px', background: EY_Det.color.paper, borderTop: '1px solid rgba(26,15,20,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 48, height: 52, borderRadius: 16, background: EY_Det.color.paperSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="ticket" size={20} />
        </div>
        <button onClick={() => { addToCart(deal.id, qty); nav('cart'); }} style={{
          flex: 1, height: 52, border: 'none', borderRadius: 16,
          background: EY_Det.color.ink, color: EY_Det.color.paper,
          fontFamily: EY_Det.font.display, fontSize: 14, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer',
        }}>
          افزودن به سبد
          <span style={{ opacity: 0.6, fontSize: 12, fontWeight: 400 }}>· {fa((deal.price * qty).toLocaleString('en-US')).replace(/,/g,'٬')} ت</span>
        </button>
      </div>
    </ScreenPad>
  );
}

Object.assign(window, { DetailV2 });
