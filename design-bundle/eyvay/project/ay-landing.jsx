// A-Y — Landing page (mobile-first)
const AY_L = window.AY;

function LandingPage() {
  return (
    <div style={{
      width: 448, minHeight: 1400, position: 'relative',
      background: '#020306', overflow: 'hidden',
      fontFamily: AY_L.font.body, color: AY_L.color.text,
      direction: 'rtl',
    }}>
      {/* The scene lives behind everything */}
      <div style={{ position: 'absolute', inset: 0, height: 900 }}>
        <Scene variant="hero" hue="emerald" depth={1}/>
      </div>

      {/* Nav */}
      <div style={{ position: 'absolute', top: 16, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 20 }}>
        <GlassPill>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 7,
              background: 'linear-gradient(135deg, #34d399, #047857)',
              display: 'grid', placeItems: 'center',
              boxShadow: '0 0 16px rgba(16,185,129,0.6)',
            }}>
              <span style={{ color: '#04110a', fontFamily: AY_L.font.display, fontWeight: 900, fontSize: 11, letterSpacing: -0.5 }}>AY</span>
            </div>
            <span style={{ fontFamily: AY_L.font.display, fontWeight: 800, fontSize: 15, letterSpacing: -0.3 }}>ای‌وای</span>
          </div>
          <div style={{ width: 1, height: 18, background: 'rgba(110,231,183,0.18)' }}/>
          <span style={{ fontSize: 12, color: 'rgba(232,239,234,0.7)', fontFamily: AY_L.font.display, fontWeight: 500 }}>مسیر</span>
          <span style={{ fontSize: 12, color: 'rgba(232,239,234,0.7)', fontFamily: AY_L.font.display, fontWeight: 500 }}>قیمت</span>
          <span style={{ fontSize: 12, color: 'rgba(232,239,234,0.7)', fontFamily: AY_L.font.display, fontWeight: 500 }}>ورود</span>
        </GlassPill>
      </div>

      {/* HERO */}
      <section style={{ position: 'relative', zIndex: 10, padding: '120px 24px 80px', textAlign: 'center' }}>
        <AYKicker tone="emerald" style={{ marginBottom: 24 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 10px #34d399' }}/>
          نسخهٔ بتا • فقط برای متخصصان ایرانی
        </AYKicker>

        <h1 style={{
          fontFamily: AY_L.font.display, fontWeight: 900,
          fontSize: 54, lineHeight: 0.95, letterSpacing: -2,
          margin: '0 0 20px', color: AY_L.color.text,
          textWrap: 'balance',
        }}>
          از AI نترس.
          <br/>
          <span style={{
            background: 'linear-gradient(180deg, #6ee7b7 0%, #10b981 70%, #047857 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>ازش استفاده کن.</span>
        </h1>

        <p style={{
          fontFamily: AY_L.font.body, fontSize: 16, lineHeight: 1.65,
          color: 'rgba(232,239,234,0.72)',
          maxWidth: 360, margin: '0 auto 32px', textWrap: 'pretty',
          fontWeight: 400,
        }}>
          شغلت رو بگو. ای‌وای دقیقاً می‌گه کدوم ابزارهای هوش مصنوعی رو
          یاد بگیری تا جایگزین نشی — با یه نقشهٔ چهار هفته‌ای.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 320, margin: '0 auto' }}>
          <AYButton variant="primary" size="lg" full iconEnd={<AYIcon name="arrow-l" size={18} color="#04110a"/>}>
            شروع تحلیل رایگان
          </AYButton>
          <AYButton variant="secondary" size="lg" full>
            ببین چطور کار می‌کنه
          </AYButton>
        </div>

        {/* trust row */}
        <div style={{ marginTop: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, opacity: 0.6 }}>
          <div style={{ display: 'flex' }}>
            {['ع','س','م','ن'].map((c, i) => (
              <div key={i} style={{ marginInlineStart: i ? -8 : 0 }}>
                <Avatar initials={c} tone={['emerald','gold','cyan','violet'][i]} size={28}/>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, fontFamily: AY_L.font.display, color: 'rgba(232,239,234,0.7)' }}>
            +<span style={{ fontFamily: AY_L.font.mono }}>{AY_FA('۲٬۴۰۰')}</span> متخصص ایرانی
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ position: 'relative', zIndex: 10, padding: '40px 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <AYKicker tone="ink" style={{ marginBottom: 16 }}>چطور کار می‌کنه</AYKicker>
          <h2 style={{
            fontFamily: AY_L.font.display, fontWeight: 900, fontSize: 34,
            lineHeight: 1, letterSpacing: -1.3, margin: 0,
          }}>سه قدم تا مسیرت.</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { n: '۰۱', t: 'شغلت رو بگو', d: 'عنوان شغلی، مهارت‌ها و رزومه (اختیاری). ۶۰ ثانیه وقت می‌بره.', icon: 'user' },
            { n: '۰۲', t: 'AI تحلیل می‌کنه', d: 'کارهای روزانه‌ت رو با قابلیت‌های ابزارهای روز تطبیق می‌ده.', icon: 'brain' },
            { n: '۰۳', t: 'نقشه رو بگیر', d: 'چه ابزاری، برای چه کاری، با نمونه از کارهای خودت. چهار هفته.', icon: 'compass' },
          ].map((s, i) => (
            <Glass key={i} style={{ padding: 20 }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: 'linear-gradient(135deg, rgba(52,211,153,0.18), rgba(16,185,129,0.08))',
                  border: '1px solid rgba(110,231,183,0.25)',
                  display: 'grid', placeItems: 'center',
                  flexShrink: 0,
                }}>
                  <AYIcon name={s.icon} size={22} color="#6ee7b7" stroke={1.6}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: AY_L.font.mono, fontSize: 11, color: 'rgba(110,231,183,0.7)', letterSpacing: 1 }}>{AY_FA(s.n)}</span>
                    <h3 style={{ margin: 0, fontFamily: AY_L.font.display, fontWeight: 800, fontSize: 18, letterSpacing: -0.5 }}>{s.t}</h3>
                  </div>
                  <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: 'rgba(232,239,234,0.65)' }}>{s.d}</p>
                </div>
              </div>
            </Glass>
          ))}
        </div>

        {/* small pixel scene inline */}
        <div style={{ position: 'relative', height: 220, marginTop: 36, borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(110,231,183,0.10)' }}>
          <Scene variant="orbit" hue="emerald" depth={0.85}/>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            padding: '20px 16px',
          }}>
            <div style={{
              fontFamily: AY_L.font.mono, fontSize: 10, letterSpacing: 2,
              color: 'rgba(110,231,183,0.75)', textTransform: 'uppercase',
              background: 'rgba(2,3,6,0.6)', padding: '6px 12px', borderRadius: 999,
              border: '1px solid rgba(110,231,183,0.18)',
            }}>
              ANALYZING · {AY_FA('۴۵')}s
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ position: 'relative', zIndex: 10, padding: '40px 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <AYKicker tone="gold" style={{ marginBottom: 16 }}>
            <AYIcon name="crown" size={12} color="#fde68a" stroke={2}/>
            سه پلن
          </AYKicker>
          <h2 style={{
            fontFamily: AY_L.font.display, fontWeight: 900, fontSize: 34,
            lineHeight: 1, letterSpacing: -1.3, margin: 0,
          }}>پلنی که بهت می‌خوره.</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <PricingCard tier="free"/>
          <PricingCard tier="pro" featured/>
          <PricingCard tier="max"/>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ position: 'relative', zIndex: 10, padding: '40px 24px 60px', borderTop: '1px solid rgba(110,231,183,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: 'linear-gradient(135deg, #34d399, #047857)',
            display: 'grid', placeItems: 'center',
            boxShadow: '0 0 18px rgba(16,185,129,0.5)',
          }}>
            <span style={{ color: '#04110a', fontFamily: AY_L.font.display, fontWeight: 900, fontSize: 13, letterSpacing: -0.5 }}>AY</span>
          </div>
          <div>
            <div style={{ fontFamily: AY_L.font.display, fontWeight: 800, fontSize: 16 }}>ای‌وای</div>
            <div style={{ fontFamily: AY_L.font.mono, fontSize: 10, color: 'rgba(110,231,183,0.6)', letterSpacing: 1 }}>A-Y / v{AY_FA('۰.۹')}</div>
          </div>
        </div>
        <p style={{ fontSize: 13, color: 'rgba(232,239,234,0.5)', lineHeight: 1.7, margin: '0 0 20px', maxWidth: 320 }}>
          راهنمای شغلی هوش مصنوعی برای متخصصان فارسی‌زبان. ساخته شده در تهران.
        </p>
        <div style={{ display: 'flex', gap: 18, fontSize: 12, color: 'rgba(232,239,234,0.6)' }}>
          <span>حریم خصوصی</span>
          <span>قوانین</span>
          <span>تماس</span>
        </div>
        <div style={{ marginTop: 30, fontFamily: AY_L.font.mono, fontSize: 10, letterSpacing: 1.5, color: 'rgba(110,231,183,0.4)' }}>
          ©{AY_FA('۱۴۰۵')} A-Y LABS — TEHRAN
        </div>
      </footer>
    </div>
  );
}

function PricingCard({ tier = 'free', featured = false }) {
  const tiers = {
    free: {
      name: 'رایگان',
      sub: 'برای شروع',
      price: '۰',
      unit: 'تومان',
      feats: ['تحلیل اولیهٔ شغل', 'نقشهٔ ۴ هفته‌ای خلاصه', '۳ پرسش از مسیریاب'],
      cta: 'شروع رایگان',
      variant: 'secondary',
      tone: 'ink',
    },
    pro: {
      name: 'پرو',
      sub: 'پیشنهاد ای‌وای',
      price: AY_FA('۲۹۸٬۰۰۰'),
      unit: 'تومان / ماهانه',
      feats: ['تحلیل عمیق با رزومه', 'نقشهٔ کامل + تمرین عملی', 'مسیریاب نامحدود', 'به‌روزرسانی هفتگی ابزارها'],
      cta: 'فعال‌سازی پرو',
      variant: 'primary',
      tone: 'emerald',
    },
    max: {
      name: 'مکس',
      sub: 'برای حرفه‌ای‌ها',
      price: AY_FA('۱٬۹۸۰٬۰۰۰'),
      unit: 'تومان / سالانه',
      feats: ['هر چیزی در پرو', 'جلسهٔ یک‌به‌یک با مربی', 'بررسی دستی نقشه', 'دسترسی زودهنگام به ابزارها'],
      cta: 'ارتقا به مکس',
      variant: 'gold',
      tone: 'gold',
    },
  };
  const t = tiers[tier];
  const isGold = tier === 'max';
  const isPro = tier === 'pro';

  return (
    <div style={{ position: 'relative' }}>
      {featured && (
        <div style={{
          position: 'absolute', top: -12, insetInlineStart: 20, zIndex: 2,
          background: 'linear-gradient(180deg, #34d399, #10b981)',
          color: '#04110a', fontFamily: AY_L.font.display, fontWeight: 800,
          fontSize: 11, padding: '5px 12px', borderRadius: 999,
          boxShadow: '0 8px 20px rgba(16,185,129,0.5)',
          letterSpacing: 0.2,
        }}>پیشنهاد ای‌وای</div>
      )}
      <Glass style={{
        padding: 24, position: 'relative', overflow: 'hidden',
        border: isPro ? '1px solid rgba(110,231,183,0.35)' :
                isGold ? '1px solid rgba(250,204,21,0.30)' :
                '1px solid rgba(110,231,183,0.10)',
        background: isGold
          ? 'linear-gradient(180deg, rgba(42,29,3,0.7) 0%, rgba(18,12,1,0.6) 100%)'
          : undefined,
      }}>
        {isGold && (
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 80% 60% at 100% 0%, rgba(250,204,21,0.18), transparent 60%)',
          }}/>
        )}
        {isPro && (
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 80% 60% at 100% 0%, rgba(52,211,153,0.14), transparent 60%)',
          }}/>
        )}

        <div style={{ position: 'relative', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{
              fontFamily: AY_L.font.display, fontWeight: 900, fontSize: 22, letterSpacing: -0.5,
              color: isGold ? '#fde68a' : isPro ? '#6ee7b7' : '#e8efea',
            }}>{t.name}</div>
            <div style={{ fontSize: 12, color: 'rgba(232,239,234,0.55)', marginTop: 2 }}>{t.sub}</div>
          </div>
          {isGold && <AYIcon name="crown" size={22} color="#fde68a" stroke={1.8}/>}
          {isPro && <AYIcon name="bolt" size={22} color="#6ee7b7" stroke={1.8}/>}
          {tier === 'free' && <AYIcon name="sparkle" size={22} color="rgba(232,239,234,0.5)" stroke={1.8}/>}
        </div>

        <div style={{ position: 'relative', display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 20 }}>
          <span style={{
            fontFamily: AY_L.font.display, fontWeight: 900,
            fontSize: 40, letterSpacing: -2, lineHeight: 1,
            color: isGold ? '#fde68a' : '#e8efea',
          }}>{t.price}</span>
          <span style={{ fontSize: 12, color: 'rgba(232,239,234,0.55)' }}>{t.unit}</span>
        </div>

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
          {t.feats.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'rgba(232,239,234,0.82)' }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                background: isGold ? 'rgba(250,204,21,0.15)' : 'rgba(16,185,129,0.15)',
                display: 'grid', placeItems: 'center', flexShrink: 0,
              }}>
                <AYIcon name="check" size={11} color={isGold ? '#fde68a' : '#6ee7b7'} stroke={2.5}/>
              </div>
              <span>{f}</span>
            </div>
          ))}
        </div>

        <AYButton variant={t.variant} size="md" full iconEnd={<AYIcon name="arrow-l" size={16} color={t.variant === 'primary' ? '#04110a' : t.variant === 'gold' ? '#2a1d03' : '#e8efea'}/>}>
          {t.cta}
        </AYButton>
      </Glass>
    </div>
  );
}

Object.assign(window, { LandingPage, PricingCard });
