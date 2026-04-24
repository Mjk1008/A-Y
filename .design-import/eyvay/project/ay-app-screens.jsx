// A-Y — App screens (phone frame, 390×844)
const AY_S = window.AY;

// ─────────────────────────────────────────────────────────────
// Shared mobile shell — status bar + home indicator + scene bg
// ─────────────────────────────────────────────────────────────
function Phone({ children, sceneVariant, hue = 'emerald', depth = 1, status = '۹:۴۱', light = true }) {
  return (
    <div style={{
      width: 390, height: 844, position: 'relative', overflow: 'hidden',
      borderRadius: 48,
      fontFamily: AY_S.font.body, color: AY_S.color.text,
      direction: 'rtl',
      boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(110,231,183,0.14), 0 0 0 8px #0a0e0c, 0 0 0 9px #1a1d1b',
      background: '#020306',
    }}>
      {sceneVariant && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <Scene variant={sceneVariant} hue={hue} depth={depth}/>
        </div>
      )}

      {/* Status bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 54, zIndex: 40,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 32px 0',
        direction: 'ltr',
      }}>
        <span style={{ fontFamily: '-apple-system, system-ui', fontWeight: 600, fontSize: 16, color: light ? '#fff' : '#000' }}>
          {status}
        </span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <svg width="17" height="11" viewBox="0 0 17 11"><path fill={light ? '#fff' : '#000'} d="M1 7h2v3H1zm4-2h2v5H5zm4-2h2v7H9zm4-2h2v9h-2z"/></svg>
          <svg width="22" height="11" viewBox="0 0 22 11"><rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke={light ? '#fff' : '#000'} fill="none" opacity="0.4"/><rect x="2" y="2" width="15" height="7" rx="1.2" fill={light ? '#fff' : '#000'}/></svg>
        </div>
      </div>

      {/* Dynamic island */}
      <div style={{
        position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
        width: 126, height: 37, borderRadius: 24, background: '#000', zIndex: 50,
      }}/>

      {children}

      {/* Home indicator */}
      <div style={{
        position: 'absolute', bottom: 8, left: 0, right: 0, zIndex: 60,
        display: 'flex', justifyContent: 'center', pointerEvents: 'none',
      }}>
        <div style={{ width: 139, height: 5, borderRadius: 3, background: 'rgba(232,239,234,0.55)' }}/>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 1 — Onboarding (profile input)
// Robot stands waiting on the horizon
// ─────────────────────────────────────────────────────────────
function OnboardingScreen() {
  return (
    <Phone sceneVariant="stand" hue="emerald">
      {/* nav */}
      <div style={{ position: 'absolute', top: 60, left: 20, right: 20, zIndex: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'rgba(5,9,10,0.6)', backdropFilter: 'blur(14px)',
          border: '1px solid rgba(110,231,183,0.14)',
          display: 'grid', placeItems: 'center',
        }}>
          <AYIcon name="chev-r" size={18} color="#e8efea"/>
        </div>
        <div style={{ fontFamily: AY_S.font.mono, fontSize: 10, letterSpacing: 2, color: 'rgba(110,231,183,0.7)' }}>
          {AY_FA('۰۱')} / {AY_FA('۰۳')}
        </div>
        <div style={{ width: 40 }}/>
      </div>

      {/* content */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20 }}>
        <div style={{
          padding: '32px 20px 100px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(2,3,6,0.85) 20%, #020306 50%)',
        }}>
          <AYKicker tone="emerald" style={{ marginBottom: 14 }}>
            <AYIcon name="sparkle" size={10} color="#6ee7b7"/>
            قدم اول
          </AYKicker>
          <h1 style={{
            fontFamily: AY_S.font.display, fontWeight: 900, fontSize: 32,
            lineHeight: 1, letterSpacing: -1.2, margin: '0 0 10px',
          }}>
            از کجا شروع می‌کنیم؟
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(232,239,234,0.65)', margin: '0 0 22px', maxWidth: 300 }}>
            شغلت رو بگو. همین کافیه تا ای‌وای بفهمه کجای مسیر ایستادی.
          </p>

          <Glass style={{ padding: 18, marginBottom: 12 }}>
            <label style={{ fontFamily: AY_S.font.mono, fontSize: 10, letterSpacing: 2, color: 'rgba(110,231,183,0.7)', textTransform: 'uppercase' }}>
              عنوان شغلی
            </label>
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
              <AYIcon name="user" size={18} color="#6ee7b7" stroke={1.6}/>
              <span style={{ fontFamily: AY_S.font.display, fontWeight: 700, fontSize: 18, color: '#e8efea' }}>
                طراح محصول ارشد
              </span>
              <div style={{ marginInlineStart: 'auto', width: 2, height: 22, background: '#34d399', animation: 'ay-caret 1s steps(2) infinite' }}/>
            </div>
          </Glass>

          <Glass style={{ padding: 18, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <label style={{ fontFamily: AY_S.font.mono, fontSize: 10, letterSpacing: 2, color: 'rgba(110,231,183,0.7)', textTransform: 'uppercase' }}>
                مهارت‌ها
              </label>
              <span style={{ fontSize: 11, color: 'rgba(232,239,234,0.5)' }}>+ اضافه کن</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['فیگما', 'پژوهش کاربر', 'سیستم طراحی', 'پروتوتایپ'].map((s, i) => (
                <span key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  height: 30, padding: '0 12px', borderRadius: 999,
                  background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(110,231,183,0.22)',
                  color: '#6ee7b7', fontSize: 12, fontWeight: 600,
                }}>
                  {s}
                  <AYIcon name="x" size={11} color="rgba(110,231,183,0.6)"/>
                </span>
              ))}
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                height: 30, padding: '0 12px', borderRadius: 999,
                background: 'rgba(255,255,255,0.04)',
                border: '1px dashed rgba(232,239,234,0.2)',
                color: 'rgba(232,239,234,0.6)', fontSize: 12,
              }}>
                <AYIcon name="plus" size={12} color="rgba(232,239,234,0.5)"/>
                بیشتر
              </span>
            </div>
          </Glass>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: 16, borderRadius: 18,
            background: 'rgba(255,255,255,0.02)',
            border: '1px dashed rgba(110,231,183,0.18)',
            marginBottom: 24,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'rgba(16,185,129,0.12)', display: 'grid', placeItems: 'center',
            }}>
              <AYIcon name="upload" size={18} color="#6ee7b7" stroke={1.6}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: AY_S.font.display, fontWeight: 700, fontSize: 14 }}>رزومه‌ت رو بذار</div>
              <div style={{ fontSize: 11, color: 'rgba(232,239,234,0.5)', marginTop: 2 }}>اختیاری • PDF تا ۵ مگابایت</div>
            </div>
          </div>

          <AYButton variant="primary" size="lg" full iconEnd={<AYIcon name="arrow-l" size={18} color="#04110a"/>}>
            تحلیل رو شروع کن
          </AYButton>
        </div>
      </div>
    </Phone>
  );
}

// ─────────────────────────────────────────────────────────────
// 2 — Analysis loader
// Robot surrounded by orbiting pixel glyphs
// ─────────────────────────────────────────────────────────────
function LoaderScreen() {
  const lines = [
    'reading profile...',
    'mapping daily tasks...',
    'matching to ۱٬۲۴۰ ai tools...',
    'scoring relevance...',
    'building 4-week plan...',
  ];
  return (
    <Phone sceneVariant="orbit" hue="emerald" depth={1.2}>
      {/* Top bar */}
      <div style={{ position: 'absolute', top: 60, left: 0, right: 0, zIndex: 20, textAlign: 'center' }}>
        <AYKicker tone="emerald">
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399',
            animation: 'ay-pulse-dot 1.2s ease-in-out infinite' }}/>
          در حال تحلیل
        </AYKicker>
      </div>

      {/* Bottom stack */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20, padding: '0 20px 60px' }}>
        {/* Progress ring */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            fontFamily: AY_S.font.display, fontWeight: 900, fontSize: 64,
            letterSpacing: -3, lineHeight: 1,
            background: 'linear-gradient(180deg, #6ee7b7, #10b981)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            {AY_FA('۶۸')}<span style={{ fontSize: 28, opacity: 0.6 }}>٪</span>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(232,239,234,0.6)', marginTop: 4 }}>
            ۲۰ ثانیه دیگه تموم می‌شه
          </div>
        </div>

        {/* Terminal-style log */}
        <Glass style={{ padding: 18, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399' }}/>
            <span style={{ fontFamily: AY_S.font.mono, fontSize: 10, letterSpacing: 2, color: 'rgba(110,231,183,0.8)', textTransform: 'uppercase' }}>
              A-Y / ANALYSIS
            </span>
          </div>
          <div style={{ fontFamily: AY_S.font.mono, fontSize: 11, lineHeight: 1.9 }}>
            {lines.map((l, i) => (
              <div key={i} style={{
                color: i < 3 ? 'rgba(110,231,183,0.85)' : 'rgba(232,239,234,0.4)',
                display: 'flex', gap: 8, alignItems: 'center',
              }}>
                <span style={{ color: i < 3 ? '#34d399' : 'rgba(110,231,183,0.3)' }}>{i < 3 ? '✓' : i === 3 ? '▸' : '·'}</span>
                <span>{l}</span>
                {i === 3 && <span style={{ marginInlineStart: 'auto', color: 'rgba(110,231,183,0.5)' }}>{AY_FA('۳۸')}%</span>}
              </div>
            ))}
          </div>
        </Glass>

        <div style={{
          textAlign: 'center', fontSize: 12, color: 'rgba(232,239,234,0.45)',
          fontFamily: AY_S.font.body,
        }}>
          می‌تونی صفحه رو ببندی. پیامک می‌دیم وقتی آماده شد.
        </div>
      </div>
    </Phone>
  );
}

// ─────────────────────────────────────────────────────────────
// 3 — Roadmap result
// Robot climbing a pixel staircase
// ─────────────────────────────────────────────────────────────
function RoadmapScreen({ variant = 'a' }) {
  const tools = [
    { name: 'Claude',  tag: 'کلود', tone: 'emerald', use: 'نوشتن بریف و پژوهش ثانویه',   week: '۱', hrs: '۳' },
    { name: 'v0',      tag: 'ویزرو', tone: 'cyan',    use: 'تبدیل وایرفریم به کد React',  week: '۲', hrs: '۵' },
    { name: 'Figma AI',tag: 'فیگما', tone: 'violet', use: 'auto-layout و بازسازی پترن',  week: '۲', hrs: '۲' },
    { name: 'Midjourney', tag: 'ام‌جی', tone: 'rose', use: 'مود بُرد و ایده‌پردازی تصویری', week: '۳', hrs: '۴' },
    { name: 'Cursor',  tag: 'کرسر', tone: 'gold',    use: 'بررسی کد با توسعه‌دهنده‌ها',     week: '۴', hrs: '۶' },
  ];

  if (variant === 'b') return <RoadmapScreenB tools={tools}/>;

  return (
    <Phone sceneVariant="climb" hue="emerald">
      {/* Nav */}
      <div style={{ position: 'absolute', top: 60, left: 20, right: 20, zIndex: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'rgba(5,9,10,0.6)', backdropFilter: 'blur(14px)',
          border: '1px solid rgba(110,231,183,0.14)',
          display: 'grid', placeItems: 'center',
        }}>
          <AYIcon name="chev-r" size={18} color="#e8efea"/>
        </div>
        <AYKicker tone="emerald">نقشهٔ تو</AYKicker>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'rgba(5,9,10,0.6)', backdropFilter: 'blur(14px)',
          border: '1px solid rgba(110,231,183,0.14)',
          display: 'grid', placeItems: 'center',
        }}>
          <AYIcon name="settings" size={16} color="#e8efea"/>
        </div>
      </div>

      {/* Content */}
      <div style={{ position: 'absolute', top: 120, bottom: 0, left: 0, right: 0, overflow: 'auto', zIndex: 20 }}>
        <div style={{ padding: '220px 20px 100px' }}>

          <div style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(2,3,6,0.92) 18%, #020306 32%)',
            padding: '40px 0 0',
            marginTop: -40,
          }}>
            <h1 style={{
              fontFamily: AY_S.font.display, fontWeight: 900, fontSize: 30,
              lineHeight: 1.05, letterSpacing: -1.1, margin: '0 0 10px',
            }}>
              نقشه‌ات حاضره،
              <br/>
              <span style={{ color: '#6ee7b7' }}>۵ ابزار در ۴ هفته.</span>
            </h1>
            <p style={{ fontSize: 13.5, color: 'rgba(232,239,234,0.65)', lineHeight: 1.6, margin: '0 0 20px' }}>
              برای یه طراح محصول ارشد، این‌ها بیشترین تأثیر رو می‌ذارن.
            </p>

            {/* Stat row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 24 }}>
              {[
                { k: '۲۰', l: 'ساعت کل' },
                { k: '٪۳۸', l: 'صرفه‌جویی' },
                { k: '۵', l: 'ابزار' },
              ].map((s, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(110,231,183,0.10)',
                  borderRadius: 14, padding: '10px 12px',
                }}>
                  <div style={{ fontFamily: AY_S.font.display, fontWeight: 900, fontSize: 20, color: '#e8efea', letterSpacing: -0.8 }}>
                    {AY_FA(s.k)}
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(232,239,234,0.5)', marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Tool list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {tools.map((t, i) => (
                <Glass key={i} style={{ padding: 14 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <ToolGlyph name={t.tag.slice(0, 2)} tone={t.tone} size={44}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontFamily: AY_S.font.display, fontWeight: 800, fontSize: 15 }}>{t.name}</span>
                        <span style={{ fontFamily: AY_S.font.mono, fontSize: 10, color: 'rgba(110,231,183,0.6)' }}>
                          · هفتهٔ {AY_FA(t.week)}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(232,239,234,0.65)', marginTop: 3, lineHeight: 1.5 }}>
                        {t.use}
                      </div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                        <span style={{
                          fontFamily: AY_S.font.mono, fontSize: 10, padding: '2px 7px', borderRadius: 4,
                          background: 'rgba(16,185,129,0.12)', color: '#6ee7b7',
                        }}>{AY_FA(t.hrs)} ساعت</span>
                        <span style={{
                          fontFamily: AY_S.font.mono, fontSize: 10, padding: '2px 7px', borderRadius: 4,
                          background: 'rgba(255,255,255,0.04)', color: 'rgba(232,239,234,0.55)',
                        }}>مبتدی تا متوسط</span>
                      </div>
                    </div>
                    <AYIcon name="chev-l" size={16} color="rgba(232,239,234,0.4)"/>
                  </div>
                </Glass>
              ))}
            </div>

            <AYButton variant="primary" size="lg" full style={{ marginTop: 24 }} iconEnd={<AYIcon name="arrow-l" size={16} color="#04110a"/>}>
              هفتهٔ ۱ رو شروع کن
            </AYButton>
          </div>
        </div>
      </div>
    </Phone>
  );
}

// Variant B — week-grouped timeline
function RoadmapScreenB({ tools }) {
  const weeks = [1, 2, 3, 4];
  return (
    <Phone sceneVariant="climb" hue="emerald">
      <div style={{ position: 'absolute', top: 60, left: 20, right: 20, zIndex: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'rgba(5,9,10,0.6)', backdropFilter: 'blur(14px)',
          border: '1px solid rgba(110,231,183,0.14)',
          display: 'grid', placeItems: 'center',
        }}>
          <AYIcon name="chev-r" size={18} color="#e8efea"/>
        </div>
        <AYKicker tone="emerald">نقشهٔ تو</AYKicker>
        <div style={{ width: 40 }}/>
      </div>

      <div style={{ position: 'absolute', top: 120, bottom: 0, left: 0, right: 0, overflow: 'auto', zIndex: 20 }}>
        <div style={{
          padding: '220px 20px 100px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(2,3,6,0.92) 20%, #020306 34%)',
        }}>
          <h1 style={{
            fontFamily: AY_S.font.display, fontWeight: 900, fontSize: 30,
            lineHeight: 1.05, letterSpacing: -1.1, margin: '0 0 24px',
          }}>
            چهار هفته،<br/>
            <span style={{ color: '#6ee7b7' }}>قدم به قدم.</span>
          </h1>

          {/* Timeline */}
          <div style={{ position: 'relative', paddingInlineStart: 24 }}>
            <div style={{
              position: 'absolute', top: 10, bottom: 10, insetInlineStart: 8, width: 2,
              background: 'linear-gradient(180deg, #34d399 0%, rgba(110,231,183,0.15) 100%)',
            }}/>
            {weeks.map(w => {
              const wkTools = tools.filter(t => t.week === String(w) || t.week === ['۱','۲','۳','۴'][w-1]);
              return (
                <div key={w} style={{ position: 'relative', marginBottom: 24 }}>
                  <div style={{
                    position: 'absolute', insetInlineStart: -24, top: 6,
                    width: 18, height: 18, borderRadius: '50%',
                    background: w === 1 ? '#34d399' : 'rgba(18,30,24,1)',
                    border: '2px solid #34d399',
                    boxShadow: w === 1 ? '0 0 16px rgba(52,211,153,0.7)' : 'none',
                  }}/>
                  <div style={{ fontFamily: AY_S.font.mono, fontSize: 11, color: 'rgba(110,231,183,0.75)', letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase' }}>
                    هفتهٔ {AY_FA(String(w))}
                  </div>
                  {wkTools.length === 0 ? (
                    <div style={{ fontSize: 12, color: 'rgba(232,239,234,0.35)', fontStyle: 'italic', padding: '4px 0 8px' }}>
                      تمرین و تثبیت
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {wkTools.map((t, i) => (
                        <Glass key={i} style={{ padding: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <ToolGlyph name={t.tag.slice(0, 2)} tone={t.tone} size={36}/>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontFamily: AY_S.font.display, fontWeight: 800, fontSize: 14 }}>{t.name}</div>
                              <div style={{ fontSize: 11.5, color: 'rgba(232,239,234,0.6)', marginTop: 2 }}>{t.use}</div>
                            </div>
                            <span style={{ fontFamily: AY_S.font.mono, fontSize: 10, color: 'rgba(110,231,183,0.7)' }}>
                              {AY_FA(t.hrs)}h
                            </span>
                          </div>
                        </Glass>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <AYButton variant="primary" size="lg" full style={{ marginTop: 12 }}>
            شروع هفتهٔ ۱
          </AYButton>
        </div>
      </div>
    </Phone>
  );
}

// ─────────────────────────────────────────────────────────────
// 4 — Pricing screen (in-app, three tiers stacked)
// Robot standing facing three pixel pedestals
// ─────────────────────────────────────────────────────────────
function PricingScreen() {
  return (
    <Phone sceneVariant="stand" hue="emerald">
      <div style={{ position: 'absolute', top: 60, left: 20, right: 20, zIndex: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'rgba(5,9,10,0.6)', backdropFilter: 'blur(14px)',
          border: '1px solid rgba(110,231,183,0.14)',
          display: 'grid', placeItems: 'center',
        }}>
          <AYIcon name="x" size={16} color="#e8efea"/>
        </div>
        <AYKicker tone="gold">
          <AYIcon name="crown" size={11} color="#fde68a" stroke={2}/>
          پلن‌ها
        </AYKicker>
        <div style={{ width: 40 }}/>
      </div>

      <div style={{ position: 'absolute', top: 120, bottom: 0, left: 0, right: 0, overflow: 'auto', zIndex: 20 }}>
        <div style={{
          padding: '180px 16px 100px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(2,3,6,0.9) 22%, #020306 36%)',
        }}>
          <h1 style={{
            fontFamily: AY_S.font.display, fontWeight: 900, fontSize: 28,
            lineHeight: 1.05, letterSpacing: -1, margin: '0 0 6px', textAlign: 'center',
          }}>
            تا کجا باهات بیایم؟
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(232,239,234,0.55)', textAlign: 'center', margin: '0 0 22px' }}>
            هر وقت خواستی پلنت رو عوض کن.
          </p>

          {/* Segmented billing toggle */}
          <div style={{
            display: 'flex', padding: 4, borderRadius: 12,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(110,231,183,0.10)',
            marginBottom: 18, width: 'fit-content', marginInline: 'auto',
          }}>
            <div style={{
              padding: '8px 16px', borderRadius: 8,
              background: 'rgba(16,185,129,0.18)',
              border: '1px solid rgba(110,231,183,0.25)',
              fontFamily: AY_S.font.display, fontSize: 12, fontWeight: 700, color: '#6ee7b7',
            }}>ماهانه</div>
            <div style={{
              padding: '8px 16px', borderRadius: 8,
              fontFamily: AY_S.font.display, fontSize: 12, fontWeight: 600, color: 'rgba(232,239,234,0.55)',
            }}>سالانه <span style={{ fontSize: 10, color: '#6ee7b7' }}>−۱۷٪</span></div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <PricingCard tier="free"/>
            <PricingCard tier="pro" featured/>
            <PricingCard tier="max"/>
          </div>
        </div>
      </div>
    </Phone>
  );
}

Object.assign(window, { Phone, OnboardingScreen, LoaderScreen, RoadmapScreen, PricingScreen });
