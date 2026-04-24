// A-Y — additional screens (login, dashboard, jobs, courses, tools, week detail,
// profile, success, notifications, settings, resume upload, loader error)

const AY_M = window.AY;

// ── Tab bar (4 items, glass pill, active gets emerald dot) ─────────
function TabBar({ active = 'home' }) {
  const items = [
    { k: 'home',    label: 'خانه',     icon: 'home' },
    { k: 'roadmap', label: 'نقشه',     icon: 'compass' },
    { k: 'chat',    label: 'مسیریاب',  icon: 'message' },
    { k: 'profile', label: 'پروفایل',  icon: 'user' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 28, left: 16, right: 16, zIndex: 30,
      height: 62, padding: '0 8px', borderRadius: 999,
      background: 'rgba(5,9,10,0.78)',
      backdropFilter: 'blur(18px) saturate(160%)',
      border: '1px solid rgba(110,231,183,0.14)',
      boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04) inset',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
    }}>
      {items.map(it => {
        const on = it.k === active;
        return (
          <div key={it.k} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            padding: '4px 12px',
          }}>
            <AYIcon name={it.icon} size={20} color={on ? '#34d399' : 'rgba(232,239,234,0.55)'} stroke={on ? 2 : 1.6}/>
            <span style={{
              fontFamily: AY_M.font.display, fontSize: 10, fontWeight: on ? 800 : 500,
              color: on ? '#e8efea' : 'rgba(232,239,234,0.55)',
            }}>{it.label}</span>
            {on && <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#34d399', marginTop: 1, boxShadow: '0 0 8px #34d399' }}/>}
          </div>
        );
      })}
    </div>
  );
}

// ── 1. Login / OTP ────────────────────────────────────────────────
function LoginPhoneScreen() {
  return (
    <Phone sceneVariant="wave" hue="emerald">
      <div style={{ position: 'absolute', top: 60, left: 20, right: 20, zIndex: 20, display: 'flex', justifyContent: 'center' }}>
        <AYKicker tone="emerald">ورود به ای‌وای</AYKicker>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20 }}>
        <div style={{ padding: '40px 20px 80px', background: 'linear-gradient(180deg, transparent 0%, rgba(2,3,6,0.9) 25%, #020306 50%)' }}>
          <h1 style={{ fontFamily: AY_M.font.display, fontWeight: 900, fontSize: 28, lineHeight: 1.05, letterSpacing: -1, margin: '0 0 8px' }}>
            شمارهٔ موبایلت<br/><span style={{ color: '#6ee7b7' }}>رو وارد کن.</span>
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(232,239,234,0.6)', margin: '0 0 22px' }}>
            کد تأیید رو برات می‌فرستیم. فقط شماره‌های ایرانی.
          </p>
          <Glass style={{ padding: 18, marginBottom: 12 }}>
            <label style={{ fontFamily: AY_M.font.mono, fontSize: 10, letterSpacing: 2, color: 'rgba(110,231,183,0.7)', textTransform: 'uppercase' }}>
              شمارهٔ موبایل
            </label>
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10, direction: 'ltr' }}>
              <span style={{ fontFamily: AY_M.font.mono, fontSize: 16, color: 'rgba(232,239,234,0.55)' }}>+98</span>
              <div style={{ width: 1, height: 20, background: 'rgba(110,231,183,0.22)' }}/>
              <span style={{ fontFamily: AY_M.font.display, fontWeight: 700, fontSize: 20, color: '#e8efea', letterSpacing: 0.5 }}>
                912 345 6789
              </span>
              <div style={{ marginInlineStart: 'auto', width: 2, height: 22, background: '#34d399', animation: 'ay-caret 1s steps(2) infinite' }}/>
            </div>
          </Glass>
          <AYButton variant="primary" size="lg" full iconEnd={<AYIcon name="arrow-l" size={16} color="#04110a"/>}>
            ارسال کد تأیید
          </AYButton>
          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: 'rgba(232,239,234,0.45)' }}>
            با ورود، قوانین و حریم خصوصی رو می‌پذیری.
          </div>
        </div>
      </div>
    </Phone>
  );
}

function LoginOTPScreen() {
  const digits = ['۸', '۴', '۲', '۹', '_', '_'];
  return (
    <Phone sceneVariant="wave" hue="emerald">
      <div style={{ position: 'absolute', top: 60, left: 20, right: 20, zIndex: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(5,9,10,0.6)', border: '1px solid rgba(110,231,183,0.14)', display: 'grid', placeItems: 'center' }}>
          <AYIcon name="chev-r" size={18} color="#e8efea"/>
        </div>
        <AYKicker tone="emerald">کد تأیید</AYKicker>
        <div style={{ width: 40 }}/>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20 }}>
        <div style={{ padding: '40px 20px 80px', background: 'linear-gradient(180deg, transparent 0%, rgba(2,3,6,0.9) 25%, #020306 50%)' }}>
          <h1 style={{ fontFamily: AY_M.font.display, fontWeight: 900, fontSize: 26, lineHeight: 1.1, letterSpacing: -0.8, margin: '0 0 6px' }}>
            کد رو چک کن.
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(232,239,234,0.6)', margin: '0 0 24px' }}>
            پیامک به <span style={{ color: '#6ee7b7', fontFamily: AY_M.font.mono }}>+98 912 *** 6789</span> رفت.
          </p>
          <div style={{ display: 'flex', gap: 8, direction: 'ltr', justifyContent: 'center', marginBottom: 20 }}>
            {digits.map((d, i) => (
              <div key={i} style={{
                width: 48, height: 56, borderRadius: 12,
                background: 'rgba(31,46,40,0.65)',
                border: `1px solid ${i < 4 ? 'rgba(110,231,183,0.35)' : i === 4 ? 'rgba(110,231,183,0.6)' : 'rgba(110,231,183,0.12)'}`,
                boxShadow: i === 4 ? '0 0 16px rgba(52,211,153,0.35)' : 'none',
                display: 'grid', placeItems: 'center',
                fontFamily: AY_M.font.display, fontWeight: 800, fontSize: 24,
                color: d === '_' ? 'rgba(110,231,183,0.3)' : '#e8efea',
              }}>{d === '_' ? '' : d}</div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, marginBottom: 24 }}>
            <span style={{ color: 'rgba(232,239,234,0.55)' }}>ارسال مجدد در</span>
            <span style={{ fontFamily: AY_M.font.mono, color: '#6ee7b7' }}>{AY_FA('۱:۳۰')}</span>
          </div>
          <AYButton variant="primary" size="lg" full>تأیید و ورود</AYButton>
          <div style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: 'rgba(110,231,183,0.6)', fontWeight: 600 }}>
            شمارهٔ موبایلم رو عوض کنم
          </div>
        </div>
      </div>
    </Phone>
  );
}

// ── 2b. Resume upload step ─────────────────────────────────────────
function ResumeUploadScreen() {
  return (
    <Phone sceneVariant="stand" hue="emerald">
      <div style={{ position: 'absolute', top: 60, left: 20, right: 20, zIndex: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(5,9,10,0.6)', border: '1px solid rgba(110,231,183,0.14)', display: 'grid', placeItems: 'center' }}>
          <AYIcon name="chev-r" size={18} color="#e8efea"/>
        </div>
        <div style={{ fontFamily: AY_M.font.mono, fontSize: 10, letterSpacing: 2, color: 'rgba(110,231,183,0.7)' }}>{AY_FA('۰۲')} / {AY_FA('۰۳')}</div>
        <div style={{ fontSize: 13, color: 'rgba(232,239,234,0.55)', fontWeight: 600 }}>رد کن</div>
      </div>
      {/* progress dots */}
      <div style={{ position: 'absolute', top: 110, left: 0, right: 0, zIndex: 20, display: 'flex', justifyContent: 'center', gap: 6 }}>
        <span style={{ width: 18, height: 4, borderRadius: 2, background: '#34d399' }}/>
        <span style={{ width: 18, height: 4, borderRadius: 2, background: '#34d399' }}/>
        <span style={{ width: 18, height: 4, borderRadius: 2, background: 'rgba(110,231,183,0.2)' }}/>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20 }}>
        <div style={{ padding: '40px 20px 80px', background: 'linear-gradient(180deg, transparent 0%, rgba(2,3,6,0.9) 22%, #020306 45%)' }}>
          <AYKicker tone="emerald" style={{ marginBottom: 12 }}>قدم دوم</AYKicker>
          <h1 style={{ fontFamily: AY_M.font.display, fontWeight: 900, fontSize: 28, lineHeight: 1.05, letterSpacing: -1, margin: '0 0 8px' }}>
            رزومه‌ات؟
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(232,239,234,0.6)', margin: '0 0 22px', lineHeight: 1.6 }}>
            اگه داری، تحلیل ۳ برابر دقیق‌تر می‌شه. نداری؟ باشه، رد کن.
          </p>
          <div style={{
            padding: '30px 20px', borderRadius: 18,
            background: 'rgba(16,185,129,0.05)',
            border: '2px dashed rgba(110,231,183,0.28)',
            textAlign: 'center', marginBottom: 14,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14, margin: '0 auto 12px',
              background: 'rgba(16,185,129,0.15)',
              display: 'grid', placeItems: 'center',
            }}>
              <AYIcon name="upload" size={24} color="#6ee7b7" stroke={1.6}/>
            </div>
            <div style={{ fontFamily: AY_M.font.display, fontWeight: 800, fontSize: 16, marginBottom: 4 }}>
              رزومه‌ات رو اینجا بنداز
            </div>
            <div style={{ fontSize: 11.5, color: 'rgba(232,239,234,0.5)' }}>
              PDF یا DOCX تا ۵ مگابایت
            </div>
            <AYButton variant="secondary" size="sm" style={{ marginTop: 14 }}>از گوشی انتخاب کن</AYButton>
          </div>
          <AYButton variant="primary" size="lg" full iconEnd={<AYIcon name="arrow-l" size={16} color="#04110a"/>}>
            ادامه
          </AYButton>
        </div>
      </div>
    </Phone>
  );
}

// ── 3b. Loader error state ─────────────────────────────────────────
function LoaderErrorScreen() {
  return (
    <Phone sceneVariant="sit" hue="emerald" depth={0.7}>
      <div style={{ position: 'absolute', top: 60, left: 0, right: 0, zIndex: 20, textAlign: 'center' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          height: 28, padding: '0 12px', borderRadius: 999,
          background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(248,113,113,0.3)',
          color: '#fca5a5', fontFamily: AY_M.font.display, fontSize: 11, fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fca5a5' }}/>
          خطا
        </span>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20 }}>
        <div style={{ padding: '40px 20px 80px', background: 'linear-gradient(180deg, transparent 0%, rgba(2,3,6,0.9) 22%, #020306 45%)' }}>
          <h1 style={{ fontFamily: AY_M.font.display, fontWeight: 900, fontSize: 26, lineHeight: 1.1, letterSpacing: -0.8, margin: '0 0 8px', textAlign: 'center' }}>
            مشکلی پیش اومد.
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(232,239,234,0.6)', textAlign: 'center', margin: '0 0 24px', lineHeight: 1.6 }}>
            اتصال به سرور قطع شد. چند لحظه دیگه دوباره تلاش کن.
          </p>
          <Glass style={{ padding: 14, marginBottom: 16 }}>
            <div style={{ fontFamily: AY_M.font.mono, fontSize: 11, color: 'rgba(248,113,113,0.8)', lineHeight: 1.7 }}>
              <div>✗ timeout after 45s</div>
              <div style={{ color: 'rgba(232,239,234,0.4)' }}>· retry 1/3</div>
            </div>
          </Glass>
          <AYButton variant="primary" size="lg" full iconStart={<AYIcon name="sparkle" size={16} color="#04110a"/>}>
            دوباره تلاش کن
          </AYButton>
          <AYButton variant="ghost" size="md" full style={{ marginTop: 8 }}>
            بعداً امتحان می‌کنم
          </AYButton>
        </div>
      </div>
    </Phone>
  );
}

// ── 4. Dashboard ───────────────────────────────────────────────────
function DashboardScreen() {
  return (
    <Phone sceneVariant="run" hue="emerald">
      <div style={{ position: 'absolute', top: 60, left: 20, right: 20, zIndex: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar initials="ع" tone="emerald" size={38}/>
          <div>
            <div style={{ fontSize: 11, color: 'rgba(232,239,234,0.55)', lineHeight: 1 }}>سلام عرفان</div>
            <div style={{ fontFamily: AY_M.font.display, fontWeight: 800, fontSize: 14, marginTop: 2 }}>صبح بخیر ☀️</div>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(5,9,10,0.6)', border: '1px solid rgba(110,231,183,0.14)', display: 'grid', placeItems: 'center' }}>
            <AYIcon name="bell" size={18} color="#e8efea"/>
          </div>
          <span style={{ position: 'absolute', top: -2, insetInlineEnd: -2, width: 14, height: 14, borderRadius: '50%', background: '#34d399', border: '2px solid #020306', fontSize: 8, fontWeight: 800, color: '#04110a', display: 'grid', placeItems: 'center' }}>۳</span>
        </div>
      </div>

      <div style={{ position: 'absolute', top: 120, bottom: 110, left: 0, right: 0, zIndex: 20, overflow: 'auto' }}>
        <div style={{ padding: '200px 20px 24px', background: 'linear-gradient(180deg, transparent 0%, rgba(2,3,6,0.9) 18%, #020306 32%)' }}>
          {/* greeting card */}
          <Glass style={{ padding: 18, marginBottom: 18, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 100% 0%, rgba(52,211,153,0.14), transparent 60%)', pointerEvents: 'none' }}/>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <AYKicker tone="emerald"><AYIcon name="bolt" size={10} color="#6ee7b7"/>پلن پرو</AYKicker>
              <span style={{ fontSize: 10, color: 'rgba(232,239,234,0.45)', fontFamily: AY_M.font.mono }}>۲۳ روز باقیست</span>
            </div>
            <div style={{ fontFamily: AY_M.font.display, fontWeight: 800, fontSize: 18, letterSpacing: -0.4, lineHeight: 1.3 }}>
              مسیرت آماده‌ست.<br/>
              <span style={{ color: '#6ee7b7' }}>هفتهٔ ۲ از ۴</span>
            </div>
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(110,231,183,0.12)', overflow: 'hidden' }}>
                <div style={{ width: '42%', height: '100%', background: 'linear-gradient(90deg, #34d399, #10b981)', boxShadow: '0 0 10px rgba(52,211,153,0.6)' }}/>
              </div>
              <span style={{ fontFamily: AY_M.font.mono, fontSize: 11, color: '#6ee7b7' }}>{AY_FA('۴۲')}%</span>
            </div>
          </Glass>

          {/* quick actions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 20 }}>
            {[
              { icon: 'sparkle', label: 'تحلیل' },
              { icon: 'compass', label: 'مسیریاب' },
              { icon: 'trending', label: 'شغل‌ها' },
              { icon: 'book', label: 'دوره‌ها' },
            ].map((a, i) => (
              <div key={i} style={{
                padding: '12px 6px', borderRadius: 14,
                background: 'rgba(31,46,40,0.55)',
                border: '1px solid rgba(110,231,183,0.10)',
                textAlign: 'center', backdropFilter: 'blur(10px)',
              }}>
                <AYIcon name={a.icon} size={20} color="#6ee7b7" stroke={1.7}/>
                <div style={{ fontSize: 11, color: 'rgba(232,239,234,0.75)', marginTop: 5, fontWeight: 600 }}>{a.label}</div>
              </div>
            ))}
          </div>

          {/* matched jobs header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <h3 style={{ margin: 0, fontFamily: AY_M.font.display, fontWeight: 800, fontSize: 16 }}>شغل‌های مناسب تو</h3>
            <span style={{ fontSize: 12, color: '#6ee7b7', fontWeight: 600 }}>همه</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { role: 'طراح محصول ارشد', co: 'دیجی‌کالا', loc: 'تهران', m: '۹۴', tone: 'emerald' },
              { role: 'Product Designer', co: 'اسنپ', loc: 'ریموت', m: '۸۷', tone: 'violet' },
            ].map((j, i) => (
              <div key={i} style={{
                padding: 12, borderRadius: 14,
                background: 'rgba(31,46,40,0.55)',
                border: '1px solid rgba(110,231,183,0.10)',
                display: 'flex', alignItems: 'center', gap: 12, backdropFilter: 'blur(10px)',
              }}>
                <ToolGlyph name={j.co.slice(0, 2)} tone={j.tone} size={40}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: AY_M.font.display, fontWeight: 800, fontSize: 13.5, letterSpacing: -0.3 }}>{j.role}</div>
                  <div style={{ fontSize: 11, color: 'rgba(232,239,234,0.55)', marginTop: 2 }}>{j.co} · {j.loc}</div>
                </div>
                <div style={{
                  padding: '4px 10px', borderRadius: 999,
                  background: 'rgba(16,185,129,0.18)', border: '1px solid rgba(110,231,183,0.3)',
                  fontFamily: AY_M.font.mono, fontSize: 11, fontWeight: 700, color: '#6ee7b7',
                }}>{AY_FA(j.m)}٪</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <TabBar active="home"/>
    </Phone>
  );
}

// ── 5. Matched jobs full ───────────────────────────────────────────
function JobsScreen() {
  const filters = ['همه', 'تهران', 'ریموت', 'ارشد'];
  const jobs = [
    { role: 'طراح محصول ارشد',    co: 'دیجی‌کالا', loc: 'تهران',   sal: '۴۵ - ۶۰',   m: '۹۴', tone: 'emerald', saved: true },
    { role: 'Senior Product Designer', co: 'اسنپ', loc: 'ریموت', sal: '۵۰ - ۷۰', m: '۸۷', tone: 'violet' },
    { role: 'UX Lead',              co: 'تپسی',      loc: 'تهران',   sal: '۴۰ - ۵۵',  m: '۸۲', tone: 'cyan' },
    { role: 'طراح محصول ',          co: 'بلد',       loc: 'هیبرید',  sal: '۳۰ - ۴۵',  m: '۷۶', tone: 'gold' },
  ];
  return (
    <Phone sceneVariant="stand" hue="emerald">
      <div style={{ position: 'absolute', top: 60, left: 20, right: 20, zIndex: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(5,9,10,0.6)', border: '1px solid rgba(110,231,183,0.14)', display: 'grid', placeItems: 'center' }}>
          <AYIcon name="search" size={16} color="#e8efea"/>
        </div>
        <AYKicker tone="emerald">شغل‌های مناسب</AYKicker>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(5,9,10,0.6)', border: '1px solid rgba(110,231,183,0.14)', display: 'grid', placeItems: 'center' }}>
          <AYIcon name="settings" size={15} color="#e8efea"/>
        </div>
      </div>

      <div style={{ position: 'absolute', top: 115, bottom: 110, left: 0, right: 0, zIndex: 20, overflow: 'auto' }}>
        <div style={{ padding: '160px 16px 20px', background: 'linear-gradient(180deg, transparent 0%, rgba(2,3,6,0.9) 18%, #020306 32%)' }}>
          {/* filter chips */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto', paddingBottom: 4 }}>
            {filters.map((f, i) => (
              <span key={i} style={{
                height: 32, padding: '0 14px', borderRadius: 999, whiteSpace: 'nowrap',
                display: 'inline-flex', alignItems: 'center',
                background: i === 0 ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${i === 0 ? 'rgba(110,231,183,0.35)' : 'rgba(110,231,183,0.12)'}`,
                color: i === 0 ? '#6ee7b7' : 'rgba(232,239,234,0.72)',
                fontSize: 12, fontWeight: i === 0 ? 700 : 500,
              }}>{f}</span>
            ))}
          </div>

          <div style={{ fontSize: 12, color: 'rgba(232,239,234,0.5)', marginBottom: 10, fontFamily: AY_M.font.mono, letterSpacing: 0.5 }}>
            {AY_FA('۱۲')} شغل مطابق پروفایلت
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {jobs.map((j, i) => (
              <div key={i} style={{
                padding: 14, borderRadius: 16,
                background: 'rgba(31,46,40,0.55)',
                border: '1px solid rgba(110,231,183,0.10)',
                backdropFilter: 'blur(10px)',
                position: 'relative',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <ToolGlyph name={j.co.slice(0, 2)} tone={j.tone} size={44}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: AY_M.font.display, fontWeight: 800, fontSize: 14, letterSpacing: -0.3 }}>{j.role}</div>
                    <div style={{ fontSize: 11.5, color: 'rgba(232,239,234,0.55)', marginTop: 2 }}>{j.co} · {j.loc}</div>
                    <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                      <span style={{ fontFamily: AY_M.font.mono, fontSize: 10.5, padding: '2px 8px', borderRadius: 5, background: 'rgba(255,255,255,0.04)', color: 'rgba(232,239,234,0.75)' }}>
                        {AY_FA(j.sal)} میلیون تومان
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    <div style={{
                      padding: '4px 10px', borderRadius: 999,
                      background: 'rgba(16,185,129,0.18)', border: '1px solid rgba(110,231,183,0.3)',
                      fontFamily: AY_M.font.mono, fontSize: 11, fontWeight: 700, color: '#6ee7b7',
                    }}>{AY_FA(j.m)}٪</div>
                    <AYIcon name="star" size={16} color={j.saved ? '#fde68a' : 'rgba(232,239,234,0.35)'} stroke={j.saved ? 2.2 : 1.6}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <TabBar active="home"/>
    </Phone>
  );
}

// ── 6. Courses ─────────────────────────────────────────────────────
function CoursesScreen() {
  const courses = [
    { t: 'مبانی Claude برای طراحان', pl: 'مکتب‌خونه', plTone: 'emerald', dur: '۴ ساعت', price: 'رایگان', tag: 'هفتهٔ ۱' },
    { t: 'طراحی با v0 و AI', pl: 'فرادرس', plTone: 'cyan', dur: '۶ ساعت', price: '۲۹۰٬۰۰۰', tag: 'هفتهٔ ۲' },
    { t: 'AI Tools for Product Designers', pl: 'Coursera', plTone: 'violet', dur: '۸ ساعت', price: 'رایگان', tag: 'هفتهٔ ۳' },
    { t: 'پرامپت‌نویسی حرفه‌ای', pl: 'Udemy', plTone: 'gold', dur: '۵ ساعت', price: '۱۸۰٬۰۰۰', tag: 'هفتهٔ ۲' },
  ];
  const filters = ['همه', 'رایگان', 'فارسی', 'انگلیسی'];
  return (
    <Phone sceneVariant="sit" hue="emerald">
      <div style={{ position: 'absolute', top: 60, left: 20, right: 20, zIndex: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(5,9,10,0.6)', border: '1px solid rgba(110,231,183,0.14)', display: 'grid', placeItems: 'center' }}>
          <AYIcon name="chev-r" size={18} color="#e8efea"/>
        </div>
        <AYKicker tone="emerald">دوره‌های پیشنهادی</AYKicker>
        <div style={{ width: 40 }}/>
      </div>
      <div style={{ position: 'absolute', top: 115, bottom: 30, left: 0, right: 0, zIndex: 20, overflow: 'auto' }}>
        <div style={{ padding: '160px 16px 40px', background: 'linear-gradient(180deg, transparent 0%, rgba(2,3,6,0.9) 18%, #020306 32%)' }}>
          <div style={{ fontFamily: AY_M.font.mono, fontSize: 10, letterSpacing: 2, color: 'rgba(110,231,183,0.65)', textTransform: 'uppercase', marginBottom: 8 }}>
            بر اساس نقشهٔ تو
          </div>
          <h2 style={{ margin: '0 0 14px', fontFamily: AY_M.font.display, fontWeight: 900, fontSize: 22, letterSpacing: -0.6 }}>
            ۴ دورهٔ انتخاب شده.
          </h2>
          <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto' }}>
            {filters.map((f, i) => (
              <span key={i} style={{
                height: 30, padding: '0 12px', borderRadius: 999, whiteSpace: 'nowrap',
                display: 'inline-flex', alignItems: 'center',
                background: i === 0 ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${i === 0 ? 'rgba(110,231,183,0.35)' : 'rgba(110,231,183,0.12)'}`,
                color: i === 0 ? '#6ee7b7' : 'rgba(232,239,234,0.7)',
                fontSize: 11.5, fontWeight: i === 0 ? 700 : 500,
              }}>{f}</span>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {courses.map((c, i) => (
              <div key={i} style={{
                padding: 12, borderRadius: 16,
                background: 'rgba(31,46,40,0.55)',
                border: '1px solid rgba(110,231,183,0.10)',
                backdropFilter: 'blur(10px)',
                display: 'flex', gap: 12, alignItems: 'center',
              }}>
                {/* pixel thumbnail */}
                <div style={{
                  width: 58, height: 58, borderRadius: 10, flexShrink: 0,
                  background: `linear-gradient(135deg, rgba(16,185,129,0.15), rgba(4,120,87,0.08))`,
                  border: '1px solid rgba(110,231,183,0.22)',
                  display: 'grid', placeItems: 'center',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <PixelGlyph kind={['cube','ring','plus','diamond'][i % 4]} size={1.6}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: AY_M.font.display, fontWeight: 700, fontSize: 13.5, lineHeight: 1.3 }}>{c.t}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: 10, padding: '2px 7px', borderRadius: 4,
                      background: c.plTone === 'emerald' ? 'rgba(16,185,129,0.15)' :
                                  c.plTone === 'cyan'    ? 'rgba(6,182,212,0.15)' :
                                  c.plTone === 'violet'  ? 'rgba(139,92,246,0.15)' :
                                                           'rgba(234,179,8,0.15)',
                      color: c.plTone === 'emerald' ? '#6ee7b7' :
                             c.plTone === 'cyan'    ? '#67e8f9' :
                             c.plTone === 'violet'  ? '#c4b5fd' :
                                                      '#fde68a',
                      fontWeight: 600,
                    }}>{c.pl}</span>
                    <span style={{ fontSize: 10.5, color: 'rgba(232,239,234,0.5)', fontFamily: AY_M.font.mono }}>{AY_FA(c.dur)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                    <span style={{ fontSize: 11, color: 'rgba(110,231,183,0.85)', fontWeight: 700 }}>{c.tag}</span>
                    <span style={{ fontFamily: AY_M.font.display, fontSize: 12, fontWeight: 800, color: c.price === 'رایگان' ? '#6ee7b7' : '#e8efea' }}>
                      {c.price === 'رایگان' ? c.price : `${AY_FA(c.price)} ت`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Phone>
  );
}

// ── 7. AI Tools with lock overlays for free tier ──────────────────
function AIToolsScreen() {
  const tools = [
    { n: 'Cursor', tag: 'کر', tone: 'gold', use: 'بررسی کد با توسعه‌دهنده‌ها', level: 'متوسط', locked: false, hero: true },
    { n: 'Claude', tag: 'کل', tone: 'emerald', use: 'نوشتن بریف و پژوهش ثانویه', level: 'مبتدی', locked: false },
    { n: 'v0',     tag: 'ویز', tone: 'cyan', use: 'تبدیل وایرفریم به کد React', level: 'متوسط', locked: false },
    { n: 'Figma AI', tag: 'فی', tone: 'violet', use: 'auto-layout و بازسازی پترن', level: 'مبتدی', locked: true },
    { n: 'Midjourney', tag: 'ام', tone: 'rose', use: 'مود بُرد و ایده‌پردازی تصویری', level: 'پیشرفته', locked: true },
  ];
  return (
    <Phone sceneVariant="orbit" hue="emerald">
      <div style={{ position: 'absolute', top: 60, left: 20, right: 20, zIndex: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(5,9,10,0.6)', border: '1px solid rgba(110,231,183,0.14)', display: 'grid', placeItems: 'center' }}>
          <AYIcon name="chev-r" size={18} color="#e8efea"/>
        </div>
        <AYKicker tone="emerald">ابزارهای AI من</AYKicker>
        <div style={{ width: 40 }}/>
      </div>

      <div style={{ position: 'absolute', top: 115, bottom: 30, left: 0, right: 0, zIndex: 20, overflow: 'auto' }}>
        <div style={{ padding: '220px 16px 40px', background: 'linear-gradient(180deg, transparent 0%, rgba(2,3,6,0.9) 12%, #020306 28%)' }}>
          {/* Hero tool of the week */}
          <div style={{
            padding: 18, borderRadius: 20,
            background: 'linear-gradient(180deg, rgba(42,29,3,0.75) 0%, rgba(18,12,1,0.6) 100%)',
            border: '1px solid rgba(250,204,21,0.28)',
            position: 'relative', overflow: 'hidden',
            marginBottom: 16,
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 100% 0%, rgba(250,204,21,0.18), transparent 60%)', pointerEvents: 'none' }}/>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
              <ToolGlyph name="کر" tone="gold" size={52}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: AY_M.font.mono, fontSize: 10, letterSpacing: 2, color: '#fde68a', textTransform: 'uppercase' }}>ابزار اول هفته</div>
                <div style={{ fontFamily: AY_M.font.display, fontWeight: 900, fontSize: 22, marginTop: 2, color: '#fde68a' }}>Cursor</div>
              </div>
            </div>
            <p style={{ position: 'relative', fontSize: 12.5, color: 'rgba(232,239,234,0.78)', lineHeight: 1.6, margin: '0 0 12px' }}>
              برای طراح محصول ارشد: کد PRها رو باز کن و با توسعه‌دهنده‌ها زبون مشترک پیدا کن. ۶ ساعت تمرین کافیه.
            </p>
            <AYButton variant="gold" size="sm">شروع کن</AYButton>
          </div>

          {/* Tool list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {tools.filter(t => !t.hero).map((t, i) => (
              <div key={i} style={{
                padding: 12, borderRadius: 14,
                background: 'rgba(31,46,40,0.55)',
                border: '1px solid rgba(110,231,183,0.10)',
                backdropFilter: 'blur(10px)',
                display: 'flex', alignItems: 'center', gap: 12,
                position: 'relative', overflow: 'hidden',
              }}>
                <ToolGlyph name={t.tag} tone={t.tone} size={40}/>
                <div style={{ flex: 1, minWidth: 0, opacity: t.locked ? 0.4 : 1 }}>
                  <div style={{ fontFamily: AY_M.font.display, fontWeight: 800, fontSize: 13.5 }}>{t.n}</div>
                  <div style={{ fontSize: 11.5, color: 'rgba(232,239,234,0.6)', marginTop: 2 }}>{t.use}</div>
                </div>
                {!t.locked && (
                  <span style={{ fontFamily: AY_M.font.mono, fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'rgba(16,185,129,0.14)', color: '#6ee7b7' }}>{t.level}</span>
                )}
                {t.locked && (
                  <>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(5,9,10,0.85) 40%)', pointerEvents: 'none' }}/>
                    <AYIcon name="lock" size={16} color="rgba(250,204,21,0.7)" stroke={1.8}/>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Upgrade CTA */}
          <div style={{
            marginTop: 16, padding: 14, borderRadius: 14,
            background: 'linear-gradient(180deg, rgba(42,29,3,0.55), rgba(18,12,1,0.5))',
            border: '1px solid rgba(250,204,21,0.25)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <AYIcon name="crown" size={22} color="#fde68a" stroke={1.8}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: AY_M.font.display, fontWeight: 800, fontSize: 13 }}>با پرو، همه ابزارها باز می‌شن</div>
              <div style={{ fontSize: 11, color: 'rgba(232,239,234,0.55)' }}>+ هر هفته ۳ ابزار تازه</div>
            </div>
            <AYButton variant="gold" size="sm">ارتقا</AYButton>
          </div>
        </div>
      </div>
    </Phone>
  );
}

// ── 8. Week detail drill-down ─────────────────────────────────────
function WeekDetailScreen() {
  const days = [
    { d: 'شنبه', t: 'نصب Claude و تست اولیه', time: '۳۰ دقیقه', tool: 'Claude', done: true },
    { d: 'یکشنبه', t: 'نوشتن پرامپت پژوهش کاربر', time: '۴۵ دقیقه', tool: 'Claude', done: true },
    { d: 'دوشنبه', t: 'تمرین: یه بریف واقعی بنویس', time: '۱ ساعت', tool: 'Claude', done: false, active: true },
    { d: 'سه‌شنبه', t: 'آشنایی با v0', time: '۳۰ دقیقه', tool: 'v0', done: false },
    { d: 'چهارشنبه', t: 'ساخت یه فرم ساده', time: '۴۵ دقیقه', tool: 'v0', done: false },
    { d: 'پنج‌شنبه', t: 'بازبینی + یادداشت', time: '۳۰ دقیقه', tool: '—', done: false },
    { d: 'جمعه', t: 'استراحت و جمع‌بندی', time: '—', tool: '—', done: false },
  ];
  return (
    <Phone sceneVariant="climb" hue="emerald">
      <div style={{ position: 'absolute', top: 60, left: 20, right: 20, zIndex: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(5,9,10,0.6)', border: '1px solid rgba(110,231,183,0.14)', display: 'grid', placeItems: 'center' }}>
          <AYIcon name="chev-r" size={18} color="#e8efea"/>
        </div>
        <AYKicker tone="emerald">هفتهٔ اول</AYKicker>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(5,9,10,0.6)', border: '1px solid rgba(110,231,183,0.14)', display: 'grid', placeItems: 'center' }}>
          <AYIcon name="send" size={15} color="#e8efea"/>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 115, bottom: 30, left: 0, right: 0, zIndex: 20, overflow: 'auto' }}>
        <div style={{ padding: '180px 16px 40px', background: 'linear-gradient(180deg, transparent 0%, rgba(2,3,6,0.9) 16%, #020306 30%)' }}>
          <div style={{ fontFamily: AY_M.font.mono, fontSize: 10, letterSpacing: 2, color: 'rgba(110,231,183,0.65)', textTransform: 'uppercase', marginBottom: 4 }}>هفتهٔ ۱ از ۴</div>
          <h2 style={{ margin: '0 0 14px', fontFamily: AY_M.font.display, fontWeight: 900, fontSize: 26, letterSpacing: -0.8 }}>پایه‌ریزی.</h2>

          {/* progress */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 6 }}>
              <span style={{ color: 'rgba(232,239,234,0.6)' }}>پیشرفت</span>
              <span style={{ fontFamily: AY_M.font.mono, color: '#6ee7b7', fontWeight: 700 }}>{AY_FA('۲')} از {AY_FA('۷')} روز</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: 'rgba(110,231,183,0.12)', overflow: 'hidden' }}>
              <div style={{ width: '28%', height: '100%', background: 'linear-gradient(90deg, #34d399, #10b981)', boxShadow: '0 0 10px rgba(52,211,153,0.5)' }}/>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {days.map((day, i) => (
              <div key={i} style={{
                padding: '12px 14px', borderRadius: 14,
                background: day.active ? 'rgba(16,185,129,0.10)' : 'rgba(31,46,40,0.50)',
                border: `1px solid ${day.active ? 'rgba(110,231,183,0.4)' : 'rgba(110,231,183,0.08)'}`,
                backdropFilter: 'blur(10px)',
                display: 'flex', alignItems: 'center', gap: 12,
                opacity: day.done ? 0.65 : 1,
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 7, flexShrink: 0,
                  background: day.done ? '#34d399' : 'transparent',
                  border: day.done ? 'none' : `2px solid ${day.active ? '#34d399' : 'rgba(110,231,183,0.3)'}`,
                  display: 'grid', placeItems: 'center',
                }}>
                  {day.done && <AYIcon name="check" size={12} color="#04110a" stroke={3}/>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                    <span style={{ fontFamily: AY_M.font.display, fontWeight: 700, fontSize: 12, color: day.active ? '#6ee7b7' : 'rgba(232,239,234,0.7)' }}>{day.d}</span>
                    {day.tool !== '—' && <span style={{ fontFamily: AY_M.font.mono, fontSize: 10, color: 'rgba(232,239,234,0.4)' }}>· {day.tool}</span>}
                  </div>
                  <div style={{ fontSize: 13, color: day.done ? 'rgba(232,239,234,0.5)' : '#e8efea', marginTop: 2, textDecoration: day.done ? 'line-through' : 'none' }}>{day.t}</div>
                </div>
                <span style={{ fontFamily: AY_M.font.mono, fontSize: 10.5, color: 'rgba(232,239,234,0.5)' }}>{day.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Phone>
  );
}

// ── 9. Profile ─────────────────────────────────────────────────────
function ProfileScreen() {
  return (
    <Phone sceneVariant="wave" hue="emerald" depth={0.85}>
      <div style={{ position: 'absolute', top: 60, left: 20, right: 20, zIndex: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(5,9,10,0.6)', border: '1px solid rgba(110,231,183,0.14)', display: 'grid', placeItems: 'center' }}>
          <AYIcon name="chev-r" size={18} color="#e8efea"/>
        </div>
        <AYKicker tone="emerald">پروفایل</AYKicker>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(5,9,10,0.6)', border: '1px solid rgba(110,231,183,0.14)', display: 'grid', placeItems: 'center' }}>
          <AYIcon name="settings" size={15} color="#e8efea"/>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 115, bottom: 110, left: 0, right: 0, zIndex: 20, overflow: 'auto' }}>
        <div style={{ padding: '190px 16px 30px', background: 'linear-gradient(180deg, transparent 0%, rgba(2,3,6,0.9) 14%, #020306 28%)' }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <Avatar initials="ع" tone="emerald" size={80}/>
            <h2 style={{ margin: '14px 0 4px', fontFamily: AY_M.font.display, fontWeight: 900, fontSize: 22, letterSpacing: -0.5 }}>عرفان نیاکی</h2>
            <div style={{ fontSize: 12.5, color: 'rgba(232,239,234,0.55)' }}>طراح محصول ارشد · تهران</div>
            <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 999, background: 'linear-gradient(180deg, rgba(250,204,21,0.12), rgba(234,179,8,0.08))', border: '1px solid rgba(250,204,21,0.3)' }}>
              <AYIcon name="crown" size={13} color="#fde68a" stroke={2}/>
              <span style={{ fontFamily: AY_M.font.display, fontSize: 12, fontWeight: 800, color: '#fde68a' }}>پلن پرو · فعال</span>
            </div>
          </div>

          {/* stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 18 }}>
            {[
              { k: '۴', l: 'تحلیل' },
              { k: '۲۲', l: 'روز فعال' },
              { k: '۸', l: 'ابزار' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '12px 8px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(110,231,183,0.10)', textAlign: 'center' }}>
                <div style={{ fontFamily: AY_M.font.display, fontWeight: 900, fontSize: 22, color: '#e8efea', letterSpacing: -0.6 }}>{AY_FA(s.k)}</div>
                <div style={{ fontSize: 10.5, color: 'rgba(232,239,234,0.5)', marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* skills */}
          <div style={{ fontFamily: AY_M.font.mono, fontSize: 10, letterSpacing: 2, color: 'rgba(110,231,183,0.65)', textTransform: 'uppercase', marginBottom: 10 }}>مهارت‌ها</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
            {['فیگما', 'پژوهش', 'سیستم طراحی', 'پروتوتایپ', 'Claude', 'v0'].map((s, i) => (
              <span key={i} style={{ height: 28, padding: '0 12px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(110,231,183,0.22)', color: '#6ee7b7', fontSize: 11.5, fontWeight: 600 }}>
                {s}
              </span>
            ))}
          </div>

          {/* sections */}
          <div style={{ borderRadius: 16, overflow: 'hidden', background: 'rgba(31,46,40,0.55)', border: '1px solid rgba(110,231,183,0.10)', backdropFilter: 'blur(10px)', marginBottom: 12 }}>
            {[
              { icon: 'user', label: 'اطلاعات شغلی' },
              { icon: 'sparkle', label: 'تحلیل مجدد' },
              { icon: 'bell', label: 'اعلان‌ها' },
              { icon: 'settings', label: 'تنظیمات' },
            ].map((s, i, arr) => (
              <div key={i} style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: i < arr.length - 1 ? '1px solid rgba(110,231,183,0.08)' : 'none' }}>
                <AYIcon name={s.icon} size={16} color="#6ee7b7" stroke={1.7}/>
                <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>{s.label}</span>
                <AYIcon name="chev-l" size={14} color="rgba(232,239,234,0.4)"/>
              </div>
            ))}
          </div>

          <div style={{ padding: '14px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(110,231,183,0.08)', textAlign: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: 'rgba(232,239,234,0.6)', fontWeight: 600 }}>خروج از حساب</span>
          </div>
          <div style={{ padding: '10px 16px', textAlign: 'center' }}>
            <span style={{ fontSize: 11, color: 'rgba(248,113,113,0.55)', fontWeight: 500 }}>حذف حساب</span>
          </div>
        </div>
      </div>
      <TabBar active="profile"/>
    </Phone>
  );
}

// ── 10b. Payment success ───────────────────────────────────────────
function PaymentSuccessScreen() {
  return (
    <Phone sceneVariant="wave" hue="emerald">
      {/* gold aurora overlay */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(250,204,21,0.25), transparent 60%)' }}/>
      {/* confetti pixels */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
        {[0,1,2,3,4,5,6,7,8,9].map(i => {
          const x = (i * 37) % 100;
          const y = 15 + (i * 17) % 50;
          const c = i % 3 === 0 ? '#fde68a' : i % 3 === 1 ? '#facc15' : '#e8efea';
          const s = i % 2 === 0 ? 4 : 3;
          return (
            <div key={i} style={{
              position: 'absolute', left: `${x}%`, top: `${y}%`,
              width: s, height: s, background: c,
              animation: `ay-float ${3 + (i % 3)}s ease-in-out ${i * 0.13}s infinite`,
            }}/>
          );
        })}
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20 }}>
        <div style={{ padding: '40px 20px 60px', background: 'linear-gradient(180deg, transparent 0%, rgba(2,3,6,0.9) 22%, #020306 45%)', textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18, margin: '0 auto 18px',
            background: 'linear-gradient(180deg, #fde68a, #eab308)',
            display: 'grid', placeItems: 'center',
            boxShadow: '0 0 40px rgba(234,179,8,0.55)',
          }}>
            <AYIcon name="crown" size={28} color="#2a1d03" stroke={2.2}/>
          </div>
          <h1 style={{ margin: '0 0 8px', fontFamily: AY_M.font.display, fontWeight: 900, fontSize: 28, lineHeight: 1.05, letterSpacing: -1 }}>
            پلن پرو فعال شد! 🎉
          </h1>
          <p style={{ margin: '0 0 24px', fontSize: 13.5, color: 'rgba(232,239,234,0.65)', lineHeight: 1.6 }}>
            از الان هر هفته ۳ ابزار تازه، مسیریاب نامحدود و بررسی دستی نقشه‌ت.
          </p>
          <Glass style={{ padding: 14, marginBottom: 20, textAlign: 'right' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
              <span style={{ color: 'rgba(232,239,234,0.6)' }}>پرداخت</span>
              <span style={{ fontFamily: AY_M.font.display, fontWeight: 700 }}>{AY_FA('۲۹۸٬۰۰۰')} تومان</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: 'rgba(232,239,234,0.6)' }}>اعتبار تا</span>
              <span style={{ fontFamily: AY_M.font.mono, color: '#6ee7b7' }}>{AY_FA('۲۴ اردیبهشت ۱۴۰۵')}</span>
            </div>
          </Glass>
          <AYButton variant="primary" size="lg" full iconEnd={<AYIcon name="arrow-l" size={16} color="#04110a"/>}>
            شروع کن
          </AYButton>
        </div>
      </div>
    </Phone>
  );
}

// ── 11. Notifications ──────────────────────────────────────────────
function NotificationsScreen() {
  const items = [
    { group: 'امروز', list: [
      { k: 'tool', t: 'ابزار جدید: Cursor', sub: 'برای هفتهٔ ۴ مسیرت', time: '۲ ساعت پیش' },
      { k: 'job',  t: 'یه شغل مناسب پیدا شد', sub: 'طراح محصول ارشد · دیجی‌کالا · ۹۴٪ مطابقت', time: '۵ ساعت پیش' },
    ]},
    { group: 'دیروز', list: [
      { k: 'chat', t: 'یادآوری مسیریاب', sub: 'از کار امروزت بپرس', time: 'دیروز ۱۸:۳۰' },
      { k: 'sys',  t: 'نقشه‌ات به‌روز شد', sub: 'هفتهٔ ۲ حالا شامل v0 هم می‌شه', time: 'دیروز ۰۹:۰۰' },
    ]},
  ];
  const toneMap = {
    tool: { bg: 'rgba(16,185,129,0.14)', fg: '#6ee7b7', icon: 'sparkle' },
    job:  { bg: 'rgba(139,92,246,0.14)', fg: '#c4b5fd', icon: 'trending' },
    chat: { bg: 'rgba(234,179,8,0.14)',  fg: '#fde68a', icon: 'message' },
    sys:  { bg: 'rgba(255,255,255,0.05)',fg: '#c9d8d0', icon: 'bell' },
  };
  return (
    <Phone sceneVariant="sit" hue="emerald" depth={0.8}>
      <div style={{ position: 'absolute', top: 60, left: 20, right: 20, zIndex: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(5,9,10,0.6)', border: '1px solid rgba(110,231,183,0.14)', display: 'grid', placeItems: 'center' }}>
          <AYIcon name="chev-r" size={18} color="#e8efea"/>
        </div>
        <AYKicker tone="emerald">اعلان‌ها</AYKicker>
        <div style={{ width: 40 }}/>
      </div>
      <div style={{ position: 'absolute', top: 115, bottom: 30, left: 0, right: 0, zIndex: 20, overflow: 'auto' }}>
        <div style={{ padding: '160px 16px 40px', background: 'linear-gradient(180deg, transparent 0%, rgba(2,3,6,0.9) 15%, #020306 30%)' }}>
          {items.map((grp, gi) => (
            <div key={gi} style={{ marginBottom: 18 }}>
              <div style={{ fontFamily: AY_M.font.mono, fontSize: 10, letterSpacing: 2, color: 'rgba(110,231,183,0.6)', textTransform: 'uppercase', marginBottom: 10 }}>{grp.group}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {grp.list.map((n, ni) => {
                  const t = toneMap[n.k];
                  return (
                    <div key={ni} style={{
                      padding: 12, borderRadius: 14,
                      background: 'rgba(31,46,40,0.55)',
                      border: '1px solid rgba(110,231,183,0.10)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                    }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: t.bg, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                        <AYIcon name={t.icon} size={16} color={t.fg} stroke={1.7}/>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: AY_M.font.display, fontWeight: 700, fontSize: 13 }}>{n.t}</div>
                        <div style={{ fontSize: 11.5, color: 'rgba(232,239,234,0.58)', marginTop: 2, lineHeight: 1.5 }}>{n.sub}</div>
                        <div style={{ fontFamily: AY_M.font.mono, fontSize: 10, color: 'rgba(232,239,234,0.35)', marginTop: 6 }}>{n.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Phone>
  );
}

// ── 12. Settings / Edit profile ───────────────────────────────────
function EditProfileScreen() {
  const levels = [
    { k: 'junior', t: 'جونیور', d: '۰–۲ سال' },
    { k: 'mid',    t: 'میدلول', d: '۲–۵ سال', active: true },
    { k: 'senior', t: 'سنیور',  d: '۵–۸ سال' },
    { k: 'lead',   t: 'مدیریت', d: '۸+ سال' },
  ];
  return (
    <Phone sceneVariant="stand" hue="emerald" depth={0.85}>
      <div style={{ position: 'absolute', top: 60, left: 20, right: 20, zIndex: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(5,9,10,0.6)', border: '1px solid rgba(110,231,183,0.14)', display: 'grid', placeItems: 'center' }}>
          <AYIcon name="x" size={16} color="#e8efea"/>
        </div>
        <AYKicker tone="emerald">ویرایش پروفایل</AYKicker>
        <div style={{ width: 40 }}/>
      </div>
      <div style={{ position: 'absolute', top: 115, bottom: 100, left: 0, right: 0, zIndex: 20, overflow: 'auto' }}>
        <div style={{ padding: '160px 16px 30px', background: 'linear-gradient(180deg, transparent 0%, rgba(2,3,6,0.92) 12%, #020306 25%)' }}>
          {/* job title */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontFamily: AY_M.font.mono, fontSize: 10, letterSpacing: 2, color: 'rgba(110,231,183,0.7)', textTransform: 'uppercase', marginBottom: 8 }}>
              عنوان شغلی
            </label>
            <Glass style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <AYIcon name="user" size={16} color="#6ee7b7" stroke={1.6}/>
                <span style={{ fontFamily: AY_M.font.display, fontWeight: 700, fontSize: 15, flex: 1 }}>طراح محصول ارشد</span>
                <div style={{ width: 2, height: 18, background: '#34d399', animation: 'ay-caret 1s steps(2) infinite' }}/>
              </div>
            </Glass>
          </div>

          {/* skills */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <label style={{ fontFamily: AY_M.font.mono, fontSize: 10, letterSpacing: 2, color: 'rgba(110,231,183,0.7)', textTransform: 'uppercase' }}>
                مهارت‌ها
              </label>
              <span style={{ fontSize: 11, color: '#6ee7b7', fontWeight: 700 }}>+ اضافه کن</span>
            </div>
            <Glass style={{ padding: 14 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['فیگما', 'پژوهش', 'سیستم طراحی', 'پروتوتایپ', 'Claude', 'v0'].map((s, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 28, padding: '0 10px', borderRadius: 999, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(110,231,183,0.22)', color: '#6ee7b7', fontSize: 11.5, fontWeight: 600 }}>
                    {s}
                    <AYIcon name="x" size={10} color="rgba(110,231,183,0.6)"/>
                  </span>
                ))}
              </div>
            </Glass>
          </div>

          {/* experience level */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontFamily: AY_M.font.mono, fontSize: 10, letterSpacing: 2, color: 'rgba(110,231,183,0.7)', textTransform: 'uppercase', marginBottom: 8 }}>
              سطح تجربه
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {levels.map((lv, i) => (
                <div key={i} style={{
                  padding: 12, borderRadius: 14,
                  background: lv.active ? 'rgba(16,185,129,0.12)' : 'rgba(31,46,40,0.5)',
                  border: `1px solid ${lv.active ? 'rgba(110,231,183,0.4)' : 'rgba(110,231,183,0.08)'}`,
                  position: 'relative',
                }}>
                  <div style={{ fontFamily: AY_M.font.display, fontWeight: 800, fontSize: 14, color: lv.active ? '#6ee7b7' : '#e8efea' }}>{lv.t}</div>
                  <div style={{ fontSize: 11, color: 'rgba(232,239,234,0.5)', marginTop: 2, fontFamily: AY_M.font.mono }}>{lv.d}</div>
                  {lv.active && (
                    <div style={{ position: 'absolute', top: 10, insetInlineEnd: 10, width: 18, height: 18, borderRadius: '50%', background: '#34d399', display: 'grid', placeItems: 'center' }}>
                      <AYIcon name="check" size={10} color="#04110a" stroke={3}/>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <AYButton variant="primary" size="lg" full iconStart={<AYIcon name="sparkle" size={16} color="#04110a"/>}>
            اجرای مجدد تحلیل
          </AYButton>
        </div>
      </div>
    </Phone>
  );
}

Object.assign(window, {
  TabBar, LoginPhoneScreen, LoginOTPScreen, ResumeUploadScreen, LoaderErrorScreen,
  DashboardScreen, JobsScreen, CoursesScreen, AIToolsScreen, WeekDetailScreen,
  ProfileScreen, PaymentSuccessScreen, NotificationsScreen, EditProfileScreen,
});
