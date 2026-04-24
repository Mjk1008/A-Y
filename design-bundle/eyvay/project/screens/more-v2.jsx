// EyVay — Saved, Profile, Notifications, Cart, Checkout, Success
const EY_M = window.EY;

// ── SAVED ──
function SavedV2() {
  const { saved, getDeal, goTab } = useEY();
  const items = [...saved].map(getDeal).filter(Boolean);
  return (
    <ScreenPad bg={EY_M.color.paper}>
      <div style={{ position: 'absolute', top: 58, left: 20, right: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: EY_M.font.display, fontSize: 30, fontWeight: 800, letterSpacing: -0.5 }}>ذخیره‌ها</div>
          <div style={{ fontFamily: EY_M.font.body, fontSize: 12, color: 'rgba(26,15,20,0.55)' }}>{fa(items.length)} مورد</div>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
          <Pill active>همه</Pill>
          <Pill>در دسترس</Pill>
          <Pill>ارزان‌تر شد</Pill>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 170, left: 0, right: 0, bottom: 84, padding: '10px 20px', overflowY: 'auto' }}>
        {items.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, margin: '0 auto 16px', borderRadius: 999, background: EY_M.color.paperSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="heart" size={28} color="rgba(26,15,20,0.35)" />
            </div>
            <div style={{ fontFamily: EY_M.font.display, fontSize: 16, fontWeight: 700, marginBottom: 6 }}>هنوز چیزی ذخیره نکردی</div>
            <div style={{ fontFamily: EY_M.font.body, fontSize: 13, color: 'rgba(26,15,20,0.55)', marginBottom: 20 }}>پیشنهادهایی که دوست داری رو با ❤️ نگه دار.</div>
            <button onClick={() => goTab('home')} style={{ padding: '10px 24px', border: 'none', borderRadius: 999, background: EY_M.color.ink, color: EY_M.color.paper, fontFamily: EY_M.font.display, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              برگرد به فید
            </button>
          </div>
        ) : (
          <SavedList items={items} />
        )}
      </div>
      <TabBarC />
    </ScreenPad>
  );
}

function SavedList({ items }) {
  const { nav } = useEY();
  return (
    <>
      {items.map((it, i) => (
        <div key={it.id} onClick={() => nav('detail', { id: it.id })} style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: i < items.length - 1 ? '1px solid rgba(26,15,20,0.08)' : 'none', cursor: 'pointer' }}>
          <div style={{ width: 88, height: 88, borderRadius: 16, overflow: 'hidden', flexShrink: 0 }}>
            <Placeholder label="item" height="100%" tone={it.tone} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
            <div>
              <div style={{ fontFamily: EY_M.font.body, fontSize: 10, letterSpacing: 0.3, color: 'rgba(26,15,20,0.5)' }}>{it.store}</div>
              <div style={{ fontFamily: EY_M.font.display, fontSize: 13, fontWeight: 700, lineHeight: 1.35, marginTop: 2 }}>{it.title}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <Toman value={it.price} size={13} />
              <Toman value={it.old} size={10} strike color="rgba(26,15,20,0.4)" weight={400} />
              <div style={{ marginInlineStart: 'auto', fontFamily: EY_M.font.display, fontSize: 11, fontWeight: 800, color: EY_M.color.clay }}>٪{fa(it.percent)}-</div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

// ── PROFILE ──
function ProfileV2() {
  const { nav } = useEY();
  const u = window.EY_DATA.user;
  return (
    <ScreenPad bg={EY_M.color.paper}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 240, background: EY_M.color.plum }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 80% 100%, rgba(232,135,59,0.3), transparent 60%)' }}/>
        <div style={{ position: 'absolute', top: 56, insetInlineStart: 20, width: 40, height: 40, borderRadius: 999, background: 'rgba(246,239,228,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="sparkle" size={18} color={EY_M.color.paper} />
        </div>
      </div>
      <div style={{ position: 'absolute', top: 130, left: 20, right: 20 }}>
        <div style={{ width: 88, height: 88, borderRadius: '50%', background: EY_M.color.saffron, border: `4px solid ${EY_M.color.paper}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: EY_M.font.display, fontSize: 32, fontWeight: 900, color: '#fff' }}>
          {u.initial}
        </div>
        <div style={{ marginTop: 14 }}>
          <div style={{ fontFamily: EY_M.font.display, fontSize: 24, fontWeight: 800, letterSpacing: -0.3 }}>{u.name}</div>
          <div style={{ fontFamily: EY_M.font.mono, fontSize: 11, color: 'rgba(26,15,20,0.55)', letterSpacing: 1, marginTop: 2 }}>
            عضو از {u.since} · سطح {u.level}
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 328, left: 20, right: 20 }}>
        <div style={{ background: EY_M.color.paperSoft, borderRadius: 22, padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: EY_M.color.ink, color: EY_M.color.saffronHi, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: EY_M.font.display, fontSize: 20, fontWeight: 800 }}>٪</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: EY_M.font.body, fontSize: 11, color: 'rgba(26,15,20,0.55)' }}>مجموع صرفه‌جویی</div>
            <Toman value={u.savings} size={20} />
          </div>
          <Icon name="chev" size={18} color="rgba(26,15,20,0.4)" />
        </div>
      </div>
      <div style={{ position: 'absolute', top: 420, left: 20, right: 20, bottom: 100, overflowY: 'auto' }}>
        {[
          { icon: 'ticket', label: 'کوپن‌های من', meta: '۴ فعال' },
          { icon: 'wallet', label: 'کیف پول', meta: '۲۸۰٬۰۰۰ ت' },
          { icon: 'pin', label: 'آدرس‌ها', meta: '۲ مورد' },
          { icon: 'bell', label: 'اعلان‌ها', meta: '', action: () => nav('notifications') },
          { icon: 'user', label: 'حساب کاربری', meta: '' },
        ].map((m, i, arr) => (
          <div key={m.label} onClick={m.action} style={{ height: 52, display: 'flex', alignItems: 'center', gap: 14, borderBottom: i < arr.length - 1 ? '1px solid rgba(26,15,20,0.07)' : 'none', cursor: 'pointer' }}>
            <Icon name={m.icon} size={19} />
            <div style={{ flex: 1, fontFamily: EY_M.font.display, fontSize: 14, fontWeight: 600 }}>{m.label}</div>
            {m.meta && <div style={{ fontFamily: EY_M.font.body, fontSize: 12, color: 'rgba(26,15,20,0.5)' }}>{m.meta}</div>}
            <Icon name="chev" size={16} color="rgba(26,15,20,0.4)" />
          </div>
        ))}
      </div>
      <TabBarC />
    </ScreenPad>
  );
}

// ── NOTIFICATIONS ──
function NotificationsV2() {
  const { back } = useEY();
  return (
    <ScreenPad bg={EY_M.color.paper}>
      <div style={{ position: 'absolute', top: 56, left: 20, right: 20, display: 'flex', alignItems: 'center' }}>
        <div onClick={back} style={{ width: 40, height: 40, borderRadius: 999, background: EY_M.color.paperSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Icon name="chev" size={17} />
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontFamily: EY_M.font.display, fontSize: 16, fontWeight: 700 }}>اعلان‌ها</div>
        <div style={{ width: 40 }}/>
      </div>
      <div style={{ position: 'absolute', top: 120, left: 0, right: 0, bottom: 0, overflowY: 'auto', padding: '0 20px 30px' }}>
        {window.EY_DATA.notifications.map(n => (
          <div key={n.id} style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: '1px solid rgba(26,15,20,0.06)' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: n.unread ? EY_M.color.saffron : EY_M.color.paperSoft, color: n.unread ? '#fff' : EY_M.color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name={n.icon} size={18} color={n.unread ? '#fff' : EY_M.color.ink} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: EY_M.font.display, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                {n.title}
                {n.unread && <div style={{ width: 6, height: 6, borderRadius: 999, background: EY_M.color.clay }}/>}
              </div>
              <div style={{ fontFamily: EY_M.font.body, fontSize: 12, color: 'rgba(26,15,20,0.65)', marginTop: 3, lineHeight: 1.5 }}>{n.body}</div>
              <div style={{ fontFamily: EY_M.font.mono, fontSize: 10, color: 'rgba(26,15,20,0.45)', marginTop: 4, letterSpacing: 0.5 }}>{n.ago}</div>
            </div>
          </div>
        ))}
      </div>
    </ScreenPad>
  );
}

// ── CART ──
function CartV2() {
  const { cart, setCartQty, getDeal, cartTotal, cartSavings, nav, goTab } = useEY();
  const items = cart.map(c => ({ ...c, deal: getDeal(c.id) })).filter(x => x.deal);

  if (items.length === 0) {
    return (
      <ScreenPad bg={EY_M.color.paper}>
        <div style={{ position: 'absolute', top: 58, left: 20, right: 20, fontFamily: EY_M.font.display, fontSize: 30, fontWeight: 800, letterSpacing: -0.5 }}>سبد خرید</div>
        <div style={{ position: 'absolute', top: '30%', left: 20, right: 20, textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, margin: '0 auto 18px', borderRadius: 999, background: EY_M.color.paperSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="bag" size={32} color="rgba(26,15,20,0.4)" />
          </div>
          <div style={{ fontFamily: EY_M.font.display, fontSize: 18, fontWeight: 800 }}>سبدت خالیه</div>
          <div style={{ fontFamily: EY_M.font.body, fontSize: 13, color: 'rgba(26,15,20,0.6)', marginTop: 8, marginBottom: 22 }}>
            یک پیشنهاد خوب پیدا کن و اضافه کن.
          </div>
          <button onClick={() => goTab('home')} style={{ padding: '12px 28px', border: 'none', borderRadius: 999, background: EY_M.color.ink, color: EY_M.color.paper, fontFamily: EY_M.font.display, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            بریم سراغ پیشنهادها
          </button>
        </div>
        <TabBarC />
      </ScreenPad>
    );
  }

  return (
    <ScreenPad bg={EY_M.color.paper}>
      <div style={{ position: 'absolute', top: 58, left: 20, right: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: EY_M.font.display, fontSize: 30, fontWeight: 800, letterSpacing: -0.5 }}>سبد خرید</div>
        <div style={{ fontFamily: EY_M.font.body, fontSize: 12, color: 'rgba(26,15,20,0.55)' }}>{fa(items.length)} مورد</div>
      </div>
      <div style={{ position: 'absolute', top: 120, left: 0, right: 0, bottom: 180, overflowY: 'auto', padding: '0 20px' }}>
        {items.map(({ deal, qty }) => (
          <div key={deal.id} style={{ display: 'flex', gap: 12, padding: 14, background: EY_M.color.paperSoft, borderRadius: 18, marginBottom: 10 }}>
            <div style={{ width: 72, height: 72, borderRadius: 14, overflow: 'hidden', flexShrink: 0 }}>
              <Placeholder label="item" height="100%" tone={deal.tone} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
              <div>
                <div style={{ fontFamily: EY_M.font.body, fontSize: 10, color: 'rgba(26,15,20,0.5)' }}>{deal.store}</div>
                <div style={{ fontFamily: EY_M.font.display, fontSize: 13, fontWeight: 700, lineHeight: 1.35 }}>{deal.title}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: EY_M.color.paper, borderRadius: 999, padding: '3px 4px', border: '1px solid rgba(26,15,20,0.08)' }}>
                  <div onClick={() => setCartQty(deal.id, qty - 1)} style={{ width: 22, height: 22, borderRadius: 999, background: EY_M.color.ink, color: EY_M.color.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Icon name="minus" size={12} color={EY_M.color.paper} />
                  </div>
                  <span style={{ fontFamily: EY_M.font.display, fontSize: 12, fontWeight: 700, width: 14, textAlign: 'center' }}>{fa(qty)}</span>
                  <div onClick={() => setCartQty(deal.id, qty + 1)} style={{ width: 22, height: 22, borderRadius: 999, background: EY_M.color.ink, color: EY_M.color.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Icon name="plus" size={12} color={EY_M.color.paper} />
                  </div>
                </div>
                <div style={{ marginInlineStart: 'auto' }}>
                  <Toman value={deal.price * qty} size={13} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 84, padding: '14px 20px', background: EY_M.color.paper, borderTop: '1px solid rgba(26,15,20,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontFamily: EY_M.font.body, fontSize: 12, color: 'rgba(26,15,20,0.6)' }}>
          <span>جمع کل</span>
          <span style={{ color: EY_M.color.clay, fontWeight: 600 }}>{fa(cartSavings.toLocaleString('en-US')).replace(/,/g,'٬')} ت صرفه</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <Toman value={cartTotal} size={20} />
        </div>
        <button onClick={() => nav('checkout')} style={{ width: '100%', height: 50, border: 'none', borderRadius: 14, background: EY_M.color.saffron, color: '#fff', fontFamily: EY_M.font.display, fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
          ادامه به پرداخت <Icon name="chev-l" size={15} color="#fff" stroke={2.4} />
        </button>
      </div>
      <TabBarC />
    </ScreenPad>
  );
}

// ── CHECKOUT ──
function CheckoutV2() {
  const { cart, getDeal, cartTotal, cartSavings, back, nav, clearCart, flash } = useEY();
  const items = cart.map(c => ({ ...c, deal: getDeal(c.id) })).filter(x => x.deal);
  const [pay, setPay] = useState('wallet');
  const [coupon, setCoupon] = useState(true);

  if (items.length === 0) {
    return (
      <ScreenPad bg={EY_M.color.paper}>
        <div style={{ position: 'absolute', top: '40%', left: 20, right: 20, textAlign: 'center' }}>
          <div style={{ fontFamily: EY_M.font.display, fontSize: 16 }}>سبدت خالیه</div>
          <button onClick={back} style={{ marginTop: 16, padding: '10px 24px', border: 'none', borderRadius: 999, background: EY_M.color.ink, color: EY_M.color.paper, fontFamily: EY_M.font.display, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>برگشت</button>
        </div>
      </ScreenPad>
    );
  }

  return (
    <ScreenPad bg={EY_M.color.paper}>
      <div style={{ position: 'absolute', top: 56, left: 20, right: 20, display: 'flex', alignItems: 'center' }}>
        <div onClick={back} style={{ width: 40, height: 40, borderRadius: 999, background: EY_M.color.paperSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Icon name="chev" size={17} />
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontFamily: EY_M.font.display, fontSize: 16, fontWeight: 700 }}>تأیید و پرداخت</div>
        <div style={{ width: 40 }}/>
      </div>

      <div style={{ position: 'absolute', top: 116, left: 0, right: 0, bottom: 180, overflowY: 'auto', padding: '0 20px' }}>
        {items.slice(0, 1).map(({ deal, qty }) => (
          <div key={deal.id} style={{ background: EY_M.color.paperSoft, borderRadius: 20, padding: 14, display: 'flex', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 64, height: 64, borderRadius: 12, overflow: 'hidden' }}>
              <Placeholder label="order" height="100%" tone={deal.tone} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: EY_M.font.body, fontSize: 10, color: 'rgba(26,15,20,0.5)' }}>{deal.store}</div>
              <div style={{ fontFamily: EY_M.font.display, fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{deal.title}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <div style={{ fontFamily: EY_M.font.body, fontSize: 11, color: 'rgba(26,15,20,0.55)' }}>تعداد: {fa(qty)}</div>
                <Toman value={deal.price * qty} size={13} />
              </div>
            </div>
          </div>
        ))}
        {items.length > 1 && (
          <div style={{ textAlign: 'center', fontFamily: EY_M.font.body, fontSize: 11, color: 'rgba(26,15,20,0.5)', marginBottom: 12 }}>
            و {fa(items.length - 1)} مورد دیگر
          </div>
        )}

        <div onClick={() => setCoupon(!coupon)} style={{ height: 52, borderRadius: 14, background: EY_M.color.paperSoft, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 12, marginBottom: 16, cursor: 'pointer' }}>
          <Icon name="ticket" size={18} color={EY_M.color.clay} />
          <div style={{ flex: 1, fontFamily: EY_M.font.body, fontSize: 13 }}>
            {coupon ? 'کد «ایوای۱۰» اعمال شد' : 'کد تخفیف داری؟'}
          </div>
          {coupon
            ? <Icon name="check" size={16} color={EY_M.color.clay} stroke={2.4} />
            : <Icon name="chev" size={15} color="rgba(26,15,20,0.4)" />
          }
        </div>

        <div style={{ fontFamily: EY_M.font.display, fontSize: 13, fontWeight: 700, marginBottom: 10 }}>روش پرداخت</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { k: 'wallet', label: 'کیف پول ای‌وای', meta: 'موجودی ۲۸۰٬۰۰۰ ت', icon: 'wallet' },
            { k: 'card', label: 'کارت بانکی · ۶۱۰۴ ···· ۲۲۴۸', meta: 'ملت', icon: 'card' },
          ].map(p => {
            const on = pay === p.k;
            return (
              <div key={p.k} onClick={() => setPay(p.k)} style={{ height: 58, borderRadius: 16, padding: '0 14px', background: on ? EY_M.color.ink : EY_M.color.paperSoft, color: on ? EY_M.color.paper : EY_M.color.ink, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'background 0.2s' }}>
                <Icon name={p.icon} size={18} color={on ? EY_M.color.paper : EY_M.color.ink} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: EY_M.font.display, fontSize: 13, fontWeight: 700 }}>{p.label}</div>
                  <div style={{ fontFamily: EY_M.font.body, fontSize: 11, opacity: 0.6 }}>{p.meta}</div>
                </div>
                <div style={{ width: 20, height: 20, borderRadius: 999, border: `2px solid ${on ? EY_M.color.saffronHi : 'rgba(26,15,20,0.25)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {on && <div style={{ width: 10, height: 10, borderRadius: 999, background: EY_M.color.saffronHi }}/>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: EY_M.color.paper, borderTop: '1px solid rgba(26,15,20,0.06)', padding: '14px 20px 30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontFamily: EY_M.font.body, fontSize: 12, color: 'rgba(26,15,20,0.55)' }}>
          <span>جمع کل</span>
          <span style={{ color: EY_M.color.clay, fontWeight: 600 }}>{fa(cartSavings.toLocaleString('en-US')).replace(/,/g,'٬')} ت صرفه</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <Toman value={cartTotal} size={22} />
          <div style={{ fontFamily: EY_M.font.body, fontSize: 11, color: 'rgba(26,15,20,0.5)' }}>شامل ۹٪ مالیات</div>
        </div>
        <button onClick={() => { clearCart(); nav('success'); }} style={{ width: '100%', height: 54, border: 'none', borderRadius: 16, background: EY_M.color.saffron, color: '#fff', fontFamily: EY_M.font.display, fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer' }}>
          پرداخت کن
          <Icon name="chev-l" size={16} color="#fff" stroke={2.4} />
        </button>
      </div>
    </ScreenPad>
  );
}

// ── SUCCESS ──
function SuccessV2() {
  const { goTab } = useEY();
  return (
    <ScreenPad bg={EY_M.color.plumDeep} dark>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(232,135,59,0.35), transparent 70%)' }}/>
      <div style={{ position: 'absolute', top: '20%', left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ width: 100, height: 100, margin: '0 auto 24px', borderRadius: 999, background: EY_M.color.saffron, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Icon name="check" size={48} color="#fff" stroke={3} />
        </div>
        <div style={{ fontFamily: EY_M.font.display, fontSize: 36, fontWeight: 900, color: EY_M.color.paper, letterSpacing: -1}}>
          ای وای!
        </div>
        <div style={{ fontFamily: EY_M.font.body, fontSize: 14, color: 'rgba(246,239,228,0.7)', marginTop: 8}}>
          چه ارزون خریدی 🎉
        </div>
      </div>

      <div style={{ position: 'absolute', top: '52%', left: 24, right: 24, padding: 20, background: 'rgba(246,239,228,0.06)', borderRadius: 22, border: '1px dashed rgba(246,239,228,0.2)'}}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontFamily: EY_M.font.body, fontSize: 12, color: 'rgba(246,239,228,0.6)' }}>کد سفارش</span>
          <span style={{ fontFamily: EY_M.font.mono, fontSize: 12, color: EY_M.color.paper, letterSpacing: 1.5 }}>EY-۸۲۴۵۱</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: EY_M.font.body, fontSize: 12, color: 'rgba(246,239,228,0.6)' }}>برای دریافت</span>
          <span style={{ fontFamily: EY_M.font.display, fontSize: 13, color: EY_M.color.paper, fontWeight: 700 }}>این کد را نشون بده</span>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 20, right: 20, bottom: 36, display: 'flex', gap: 10 }}>
        <button onClick={() => goTab('home')} style={{ flex: 1, height: 52, border: `1px solid rgba(246,239,228,0.25)`, borderRadius: 14, background: 'transparent', color: EY_M.color.paper, fontFamily: EY_M.font.display, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          برگشت به فید
        </button>
        <button onClick={() => goTab('user')} style={{ flex: 1, height: 52, border: 'none', borderRadius: 14, background: EY_M.color.saffron, color: '#fff', fontFamily: EY_M.font.display, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          دیدن کوپن
        </button>
      </div>
    </ScreenPad>
  );
}

Object.assign(window, { SavedV2, ProfileV2, NotificationsV2, CartV2, CheckoutV2, SuccessV2 });
