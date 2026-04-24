// A-Y — Spec v2 screens (per /login, /onboarding, /dashboard, /profile,
// /billing, /billing/checkout, /billing/success, /billing/failed, /settings, /help)
// Mobile-first, max-width 448, dark #020306, glass, RTL Persian.

const AYV = window.AY;

// ─────────────────────────────────────────────────────────────
// Shared shell — flat dark page (no scene), 448 max width
// ─────────────────────────────────────────────────────────────
function PageV2({ children, title, back = true, action, scroll = true, padBottom = 110 }) {
  return (
    <div style={{
      width: 448, height: 900, position: 'relative',
      background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(16,185,129,0.06), transparent 60%), #020306',
      color: '#e8efea', fontFamily: AYV.font.display,
      overflow: 'hidden', borderRadius: 28,
      border: '1px solid rgba(110,231,183,0.06)',
    }}>
      {/* top bar */}
      {(title || back || action) && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30,
          padding: '22px 20px 12px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'linear-gradient(180deg, rgba(2,3,6,0.92) 0%, rgba(2,3,6,0.0) 100%)',
        }}>
          <div style={{ width: 38 }}>
            {back && (
              <div style={{
                width: 38, height: 38, borderRadius: 11,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(110,231,183,0.12)',
                display: 'grid', placeItems: 'center',
              }}>
                <AYIcon name="chev-r" size={16} color="#e8efea"/>
              </div>
            )}
          </div>
          {title && <div style={{ fontFamily: AYV.font.display, fontWeight: 800, fontSize: 15, letterSpacing: -0.2 }}>{title}</div>}
          <div style={{ width: 38, display: 'flex', justifyContent: 'flex-end' }}>{action || null}</div>
        </div>
      )}
      <div style={{
        position: 'absolute', top: title ? 70 : 0, bottom: 0, left: 0, right: 0,
        overflow: scroll ? 'auto' : 'hidden',
      }}>
        <div style={{ padding: `12px 20px ${padBottom}px`, maxWidth: 448, margin: '0 auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BottomNav (4 tabs)
// ─────────────────────────────────────────────────────────────
function BottomNav4({ active = 'home' }) {
  const items = [
    { k: 'home',     icon: 'home',     label: 'خانه' },
    { k: 'profile',  icon: 'user',     label: 'پروفایل' },
    { k: 'billing',  icon: 'crown',    label: 'اشتراک' },
    { k: 'settings', icon: 'settings', label: 'تنظیمات' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 18, left: 16, right: 16, zIndex: 40,
      height: 64, padding: '0 6px', borderRadius: 22,
      background: 'rgba(7,12,11,0.86)',
      backdropFilter: 'blur(20px) saturate(160%)',
      border: '1px solid rgba(110,231,183,0.14)',
      boxShadow: '0 12px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
    }}>
      {items.map(it => {
        const on = it.k === active;
        return (
          <div key={it.k} style={{
            position: 'relative', flex: 1,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            padding: '8px 0',
          }}>
            {on && <span style={{
              position: 'absolute', top: 4, width: 28, height: 3, borderRadius: 2,
              background: '#34d399', boxShadow: '0 0 10px #34d399',
            }}/>}
            <AYIcon name={it.icon} size={20} color={on ? '#34d399' : 'rgba(232,239,234,0.5)'} stroke={on ? 2.1 : 1.7}/>
            <span style={{
              fontFamily: AYV.font.display, fontSize: 10, fontWeight: on ? 800 : 500,
              color: on ? '#e8efea' : 'rgba(232,239,234,0.5)',
            }}>{it.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// Generic input
function FieldV2({ label, value, placeholder, dir = 'rtl', icon, suffix, hint, error }) {
  return (
    <label style={{ display: 'block', marginBottom: 14 }}>
      <div style={{ fontFamily: AYV.font.mono, fontSize: 10, letterSpacing: 1.5, color: 'rgba(110,231,183,0.7)', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '13px 14px', borderRadius: 12,
        background: 'rgba(31,46,40,0.55)',
        border: `1px solid ${error ? 'rgba(248,113,113,0.4)' : 'rgba(110,231,183,0.16)'}`,
        backdropFilter: 'blur(10px)', direction: dir,
      }}>
        {icon && <AYIcon name={icon} size={16} color="rgba(110,231,183,0.7)" stroke={1.7}/>}
        <span style={{ flex: 1, fontFamily: AYV.font.display, fontWeight: value ? 700 : 400, fontSize: 15, color: value ? '#e8efea' : 'rgba(232,239,234,0.35)' }}>
          {value || placeholder}
        </span>
        {suffix && <span style={{ fontFamily: AYV.font.mono, fontSize: 12, color: 'rgba(232,239,234,0.5)' }}>{suffix}</span>}
      </div>
      {(hint || error) && (
        <div style={{ marginTop: 6, fontSize: 11, color: error ? '#fca5a5' : 'rgba(232,239,234,0.5)' }}>{error || hint}</div>
      )}
    </label>
  );
}

// Section header
function SectionHeadV2({ kicker, title, sub }) {
  return (
    <div style={{ marginBottom: 18 }}>
      {kicker && <div style={{ fontFamily: AYV.font.mono, fontSize: 10, letterSpacing: 2, color: 'rgba(110,231,183,0.7)', textTransform: 'uppercase', marginBottom: 6 }}>{kicker}</div>}
      <h1 style={{ margin: 0, fontFamily: AYV.font.display, fontWeight: 900, fontSize: 26, lineHeight: 1.1, letterSpacing: -0.8 }}>{title}</h1>
      {sub && <p style={{ margin: '6px 0 0', fontSize: 13, color: 'rgba(232,239,234,0.6)', lineHeight: 1.6 }}>{sub}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 1A. /login — phone step
// ─────────────────────────────────────────────────────────────
function LoginPhoneV2() {
  return (
    <PageV2 back={false} padBottom={20}>
      <div style={{ marginTop: 30, marginBottom: 32, textAlign: 'center' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
          background: 'linear-gradient(180deg, rgba(16,185,129,0.18), rgba(16,185,129,0.06))',
          border: '1px solid rgba(110,231,183,0.3)',
          display: 'grid', placeItems: 'center',
          boxShadow: '0 0 24px rgba(52,211,153,0.18)',
        }}>
          <span style={{ fontFamily: AYV.font.display, fontWeight: 900, fontSize: 22, color: '#6ee7b7', letterSpacing: -0.5 }}>A-Y</span>
        </div>
        <AYKicker tone="emerald">ورود به ای‌وای</AYKicker>
      </div>
      <SectionHeadV2
        title={<>شمارهٔ موبایلت<br/><span style={{ color: '#6ee7b7' }}>رو وارد کن.</span></>}
        sub="کد تأیید رو با پیامک برات می‌فرستیم. فقط شماره‌های ایرانی."
      />
      <div style={{ marginTop: 24 }}>
        <div style={{ fontFamily: AYV.font.mono, fontSize: 10, letterSpacing: 1.5, color: 'rgba(110,231,183,0.7)', textTransform: 'uppercase', marginBottom: 8 }}>
          شمارهٔ موبایل
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, direction: 'ltr',
          padding: '14px 16px', borderRadius: 14,
          background: 'rgba(31,46,40,0.55)',
          border: '1px solid rgba(110,231,183,0.28)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 0 0 4px rgba(16,185,129,0.06)',
        }}>
          <span style={{ fontFamily: AYV.font.mono, fontSize: 15, color: 'rgba(232,239,234,0.55)' }}>+98</span>
          <div style={{ width: 1, height: 22, background: 'rgba(110,231,183,0.22)' }}/>
          <span style={{ fontFamily: AYV.font.display, fontWeight: 700, fontSize: 19, color: '#e8efea', letterSpacing: 0.4 }}>
            912 345 6789
          </span>
          <div style={{ marginInlineStart: 'auto', width: 2, height: 22, background: '#34d399', animation: 'ay-caret 1s steps(2) infinite' }}/>
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: 'rgba(232,239,234,0.45)' }}>
          مثل: ۹۱۲۳۴۵۶۷۸۹ — بدون صفر اول
        </div>
      </div>

      <div style={{ marginTop: 28 }}>
        <AYButton variant="primary" size="lg" full iconEnd={<AYIcon name="arrow-l" size={16} color="#04110a"/>}>
          ارسال کد تأیید
        </AYButton>
      </div>

      <div style={{ marginTop: 24, padding: 14, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(110,231,183,0.08)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <AYIcon name="shield" size={16} color="rgba(110,231,183,0.7)" stroke={1.6}/>
        <div style={{ flex: 1, fontSize: 11.5, color: 'rgba(232,239,234,0.6)', lineHeight: 1.7 }}>
          شمارهٔ تو فقط برای ورود استفاده می‌شه. هیچ‌وقت پیامک تبلیغاتی برات نمی‌فرستیم.
        </div>
      </div>

      <div style={{ marginTop: 30, textAlign: 'center', fontSize: 11, color: 'rgba(232,239,234,0.45)' }}>
        با ادامه دادن، <span style={{ color: '#6ee7b7' }}>قوانین</span> و <span style={{ color: '#6ee7b7' }}>حریم خصوصی</span> رو می‌پذیری.
      </div>
    </PageV2>
  );
}

// ─────────────────────────────────────────────────────────────
// 1B. /login — OTP step (6 boxes + resend timer)
// ─────────────────────────────────────────────────────────────
function LoginOTPV2() {
  const digits = ['۸', '۴', '۲', '۹', '_', '_'];
  return (
    <PageV2 title="کد تأیید" padBottom={20}>
      <div style={{ marginTop: 14 }}>
        <SectionHeadV2
          title="کد رو چک کن."
          sub={<>پیامک به <span style={{ color: '#6ee7b7', fontFamily: AYV.font.mono, direction: 'ltr', display: 'inline-block' }}>+98 912 *** 6789</span> رفت.</>}
        />
      </div>

      <div style={{ marginTop: 32, display: 'flex', gap: 9, direction: 'ltr', justifyContent: 'center' }}>
        {digits.map((d, i) => {
          const filled = d !== '_';
          const focused = i === 4;
          return (
            <div key={i} style={{
              width: 54, height: 64, borderRadius: 14,
              background: filled ? 'rgba(16,185,129,0.10)' : 'rgba(31,46,40,0.6)',
              border: `1px solid ${focused ? 'rgba(110,231,183,0.6)' : filled ? 'rgba(110,231,183,0.32)' : 'rgba(110,231,183,0.12)'}`,
              boxShadow: focused ? '0 0 0 4px rgba(16,185,129,0.12), 0 0 16px rgba(52,211,153,0.3)' : 'none',
              display: 'grid', placeItems: 'center',
              fontFamily: AYV.font.display, fontWeight: 900, fontSize: 28,
              color: filled ? '#e8efea' : 'rgba(110,231,183,0.3)',
              position: 'relative',
            }}>
              {filled ? d : ''}
              {focused && <div style={{ position: 'absolute', width: 2, height: 28, background: '#34d399', animation: 'ay-caret 1s steps(2) infinite' }}/>}
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: 24, padding: '12px 16px', borderRadius: 12,
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(110,231,183,0.10)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AYIcon name="clock" size={14} color="rgba(110,231,183,0.7)"/>
          <span style={{ fontSize: 12.5, color: 'rgba(232,239,234,0.6)' }}>ارسال مجدد در</span>
        </div>
        <span style={{ fontFamily: AYV.font.mono, fontSize: 14, color: '#6ee7b7', fontWeight: 700 }}>۰۱:۲۹</span>
      </div>

      <div style={{ marginTop: 22 }}>
        <AYButton variant="primary" size="lg" full>تأیید و ورود</AYButton>
      </div>

      <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center', gap: 16, fontSize: 12.5 }}>
        <span style={{ color: 'rgba(232,239,234,0.55)' }}>کد نرسید؟</span>
        <span style={{ color: '#6ee7b7', fontWeight: 700 }}>تغییر شماره</span>
      </div>
    </PageV2>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. /onboarding — 4-step wizard (renders all 4 stacked vertically)
// ─────────────────────────────────────────────────────────────
function OnboardingWizardV2({ step = 1 }) {
  return (
    <PageV2 title={`قدم ${AY_FA(String(step))} از ${AY_FA('۴')}`} padBottom={120} action={<span style={{ fontSize: 12, color: 'rgba(232,239,234,0.55)', fontWeight: 600 }}>رد کن</span>}>
      {/* Progress bar */}
      <div style={{ marginBottom: 22, marginTop: 4 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[1, 2, 3, 4].map(n => (
            <div key={n} style={{
              flex: 1, height: 5, borderRadius: 3,
              background: n <= step ? 'linear-gradient(90deg, #34d399, #10b981)' : 'rgba(110,231,183,0.14)',
              boxShadow: n <= step ? '0 0 8px rgba(52,211,153,0.4)' : 'none',
            }}/>
          ))}
        </div>
        <div style={{ marginTop: 10, fontFamily: AYV.font.mono, fontSize: 10.5, letterSpacing: 1, color: 'rgba(232,239,234,0.5)' }}>
          {step === 1 && 'اطلاعات پایه'}
          {step === 2 && 'شغل و صنعت'}
          {step === 3 && 'مهارت‌ها'}
          {step === 4 && 'رزومه'}
        </div>
      </div>

      {step === 1 && <OnbStep1/>}
      {step === 2 && <OnbStep2/>}
      {step === 3 && <OnbStep3/>}
      {step === 4 && <OnbStep4/>}

      <div style={{ position: 'absolute', bottom: 22, left: 20, right: 20, display: 'flex', gap: 10 }}>
        {step > 1 && (
          <div style={{ width: 80 }}>
            <AYButton variant="ghost" size="lg" full>قبل</AYButton>
          </div>
        )}
        <div style={{ flex: 1 }}>
          <AYButton variant="primary" size="lg" full iconEnd={step < 4 ? <AYIcon name="arrow-l" size={16} color="#04110a"/> : <AYIcon name="sparkle" size={16} color="#04110a"/>}>
            {step < 4 ? 'بعد' : 'تحلیل کن'}
          </AYButton>
        </div>
      </div>
    </PageV2>
  );
}

function OnbStep1() {
  return (
    <>
      <SectionHeadV2 title="خودت رو معرفی کن." sub="این‌ها کمکمون می‌کنه نقشه‌ت رو شخصی‌تر بسازیم."/>
      <div style={{ marginTop: 24 }}>
        <FieldV2 label="نام و نام‌خانوادگی" value="عرفان نیاکی" icon="user"/>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FieldV2 label="سن" value={AY_FA('۲۸')} suffix="سال"/>
          <FieldV2 label="سال تجربه" value={AY_FA('۵')} suffix="سال"/>
        </div>
      </div>
    </>
  );
}

function OnbStep2() {
  return (
    <>
      <SectionHeadV2 title="کارت چیه؟" sub="عنوان شغلی و صنعتت رو دقیق وارد کن — تحلیل بر همین پایه‌ست."/>
      <div style={{ marginTop: 24 }}>
        <FieldV2 label="عنوان شغلی" value="طراح محصول ارشد" icon="user"/>
        <div>
          <div style={{ fontFamily: AYV.font.mono, fontSize: 10, letterSpacing: 1.5, color: 'rgba(110,231,183,0.7)', textTransform: 'uppercase', marginBottom: 8 }}>صنعت</div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '13px 14px', borderRadius: 12,
            background: 'rgba(31,46,40,0.55)', border: '1px solid rgba(110,231,183,0.16)',
          }}>
            <span style={{ flex: 1, fontFamily: AYV.font.display, fontWeight: 700, fontSize: 15 }}>فناوری اطلاعات و نرم‌افزار</span>
            <AYIcon name="chev-d" size={16} color="rgba(110,231,183,0.7)"/>
          </div>
        </div>
        <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(110,231,183,0.16)', display: 'flex', gap: 10 }}>
          <AYIcon name="bolt" size={16} color="#6ee7b7" stroke={1.8}/>
          <div style={{ flex: 1, fontSize: 12, color: 'rgba(232,239,234,0.7)', lineHeight: 1.6 }}>
            <strong style={{ color: '#6ee7b7' }}>نکته:</strong> صنعت دقیق، تحلیل دقیق‌تر. مثلاً "فین‌تک" بهتر از "فناوری".
          </div>
        </div>
      </div>
    </>
  );
}

function OnbStep3() {
  const skills = ['فیگما', 'پژوهش کاربر', 'سیستم طراحی', 'پروتوتایپ', 'Claude', 'v0'];
  return (
    <>
      <SectionHeadV2 title="چی بلدی؟" sub="مهارت‌هات رو تایپ کن و Enter بزن. هر چی بیشتر، بهتر."/>
      <div style={{ marginTop: 24 }}>
        <div style={{ fontFamily: AYV.font.mono, fontSize: 10, letterSpacing: 1.5, color: 'rgba(110,231,183,0.7)', textTransform: 'uppercase', marginBottom: 8 }}>
          مهارت‌ها · {AY_FA(String(skills.length))} انتخاب شده
        </div>
        <div style={{
          padding: 12, borderRadius: 14,
          background: 'rgba(31,46,40,0.55)', border: '1px solid rgba(110,231,183,0.28)',
          minHeight: 100,
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            {skills.map((s, i) => (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                height: 30, padding: '0 12px', borderRadius: 999,
                background: 'rgba(16,185,129,0.14)', border: '1px solid rgba(110,231,183,0.3)',
                color: '#6ee7b7', fontSize: 12, fontWeight: 600,
              }}>
                {s}
                <AYIcon name="x" size={11} color="rgba(110,231,183,0.7)" stroke={2.2}/>
              </span>
            ))}
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              height: 30, padding: '0 12px',
              fontFamily: AYV.font.display, fontSize: 13, color: 'rgba(232,239,234,0.5)',
            }}>
              تایپ کن…
              <span style={{ width: 2, height: 14, background: '#34d399', animation: 'ay-caret 1s steps(2) infinite' }}/>
            </span>
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 11, color: 'rgba(232,239,234,0.5)', marginBottom: 8 }}>پیشنهاد:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['ChatGPT', 'مدیریت تیم', 'A/B تست', 'SQL', 'Notion'].map((s, i) => (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                height: 28, padding: '0 10px', borderRadius: 999,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(110,231,183,0.14)',
                color: 'rgba(232,239,234,0.75)', fontSize: 11.5, fontWeight: 500,
              }}>
                <AYIcon name="plus-s" size={11} color="rgba(110,231,183,0.6)" stroke={2.2}/>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function OnbStep4() {
  return (
    <>
      <SectionHeadV2 title="رزومه‌ت رو بنداز اینجا." sub="اختیاریه. اگه باشه، تحلیل ۳ برابر دقیق‌تر می‌شه."/>
      <div style={{ marginTop: 24 }}>
        <div style={{
          padding: '34px 20px', borderRadius: 18,
          background: 'rgba(16,185,129,0.05)',
          border: '2px dashed rgba(110,231,183,0.32)',
          textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(52,211,153,0.10), transparent 70%)', pointerEvents: 'none' }}/>
          <div style={{
            width: 60, height: 60, borderRadius: 16, margin: '0 auto 14px',
            background: 'rgba(16,185,129,0.18)', border: '1px solid rgba(110,231,183,0.32)',
            display: 'grid', placeItems: 'center', position: 'relative',
          }}>
            <AYIcon name="upload" size={26} color="#6ee7b7" stroke={1.7}/>
          </div>
          <div style={{ fontFamily: AYV.font.display, fontWeight: 800, fontSize: 16, marginBottom: 4 }}>
            بکش و اینجا بنداز
          </div>
          <div style={{ fontSize: 11.5, color: 'rgba(232,239,234,0.55)', marginBottom: 14 }}>
            یا از گوشی انتخاب کن · PDF، DOCX تا ۵ مگابایت
          </div>
          <AYButton variant="secondary" size="sm">انتخاب فایل</AYButton>
        </div>
        <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(110,231,183,0.10)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 44, borderRadius: 6, background: 'rgba(16,185,129,0.14)', border: '1px solid rgba(110,231,183,0.22)', display: 'grid', placeItems: 'center' }}>
            <AYIcon name="file" size={18} color="#6ee7b7" stroke={1.8}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: AYV.font.display, fontWeight: 700, fontSize: 13 }}>resume-erfan-1404.pdf</div>
            <div style={{ fontSize: 10.5, color: 'rgba(232,239,234,0.5)', fontFamily: AYV.font.mono, marginTop: 2 }}>۲٫۴ مگابایت · آپلود شد</div>
          </div>
          <AYIcon name="check" size={16} color="#34d399" stroke={2.4}/>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. /dashboard — AI summary + tools + roadmap + usage
// ─────────────────────────────────────────────────────────────
function DashboardV2() {
  const tools = [
    { n: 'Claude', tag: 'کل', tone: 'emerald', diff: 'مبتدی', time: '۴ ساعت', desc: 'برای پژوهش، نوشتن بریف و خلاصه‌سازی جلسات' },
    { n: 'v0',     tag: 'ویز', tone: 'cyan', diff: 'متوسط', time: '۶ ساعت', desc: 'تبدیل وایرفریم به کد React تمیز' },
    { n: 'Cursor', tag: 'کر', tone: 'gold', diff: 'متوسط', time: '۸ ساعت', desc: 'بررسی PR و زبون مشترک با توسعه‌دهنده‌ها' },
  ];
  const roadmap = [
    { w: 'هفتهٔ ۱', t: 'پایه‌ریزی با Claude', done: true },
    { w: 'هفتهٔ ۲', t: 'ساخت با v0', active: true },
    { w: 'هفتهٔ ۳', t: 'دیپ دایو در Cursor', done: false },
    { w: 'هفتهٔ ۴', t: 'پروژهٔ پایانی', done: false },
  ];
  return (
    <PageV2 title="داشبورد" back={false} action={
      <div style={{ position: 'relative' }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(110,231,183,0.12)', display: 'grid', placeItems: 'center' }}>
          <AYIcon name="bell" size={16} color="#e8efea"/>
        </div>
        <span style={{ position: 'absolute', top: -2, insetInlineEnd: -2, width: 14, height: 14, borderRadius: '50%', background: '#34d399', border: '2px solid #020306', fontSize: 8, fontWeight: 800, color: '#04110a', display: 'grid', placeItems: 'center' }}>۳</span>
      </div>
    }>
      {/* AI summary card */}
      <div style={{
        padding: 18, borderRadius: 20, marginBottom: 16,
        background: 'linear-gradient(180deg, rgba(16,185,129,0.10), rgba(16,185,129,0.02))',
        border: '1px solid rgba(110,231,183,0.22)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 100% 0%, rgba(52,211,153,0.18), transparent 65%)', pointerEvents: 'none' }}/>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <AYKicker tone="emerald"><AYIcon name="sparkle" size={10} color="#6ee7b7"/>تحلیل ای‌وای</AYKicker>
          {/* risk badge */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 11px', borderRadius: 999,
            background: 'rgba(234,179,8,0.14)', border: '1px solid rgba(250,204,21,0.35)',
            fontFamily: AYV.font.display, fontSize: 11, fontWeight: 800, color: '#fde68a',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fde68a', boxShadow: '0 0 6px #fde68a' }}/>
            ریسک متوسط
          </span>
        </div>
        <div style={{ position: 'relative', fontFamily: AYV.font.display, fontWeight: 900, fontSize: 22, lineHeight: 1.3, letterSpacing: -0.6 }}>
          ۳۸٪ از کارهای روزانه‌ت<br/>
          <span style={{ color: '#6ee7b7' }}>قابل خودکارسازیه.</span>
        </div>
        <p style={{ position: 'relative', margin: '10px 0 0', fontSize: 12.5, color: 'rgba(232,239,234,0.7)', lineHeight: 1.7 }}>
          خبر خوب: AI رقیبت نیست، مولتی‌پلایره. با ۳ ابزار درست، کارت ۲ برابر سریع‌تر می‌شه.
        </p>
        <div style={{ position: 'relative', marginTop: 14, display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(110,231,183,0.10)' }}>
            <div style={{ fontSize: 10, color: 'rgba(232,239,234,0.55)' }}>قابل اتومات</div>
            <div style={{ fontFamily: AYV.font.display, fontWeight: 800, fontSize: 16, color: '#fde68a', marginTop: 2 }}>{AY_FA('۳۸')}٪</div>
          </div>
          <div style={{ flex: 1, padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(110,231,183,0.10)' }}>
            <div style={{ fontSize: 10, color: 'rgba(232,239,234,0.55)' }}>ابزار پیشنهادی</div>
            <div style={{ fontFamily: AYV.font.display, fontWeight: 800, fontSize: 16, color: '#6ee7b7', marginTop: 2 }}>{AY_FA('۳')} ابزار</div>
          </div>
        </div>
      </div>

      {/* Tools list */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <h3 style={{ margin: 0, fontFamily: AYV.font.display, fontWeight: 800, fontSize: 16 }}>ابزارهای پیشنهادی</h3>
        <span style={{ fontSize: 12, color: '#6ee7b7', fontWeight: 700 }}>{AY_FA(String(tools.length))} ابزار</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
        {tools.map((t, i) => (
          <div key={i} style={{
            padding: 13, borderRadius: 14,
            background: 'rgba(31,46,40,0.55)', border: '1px solid rgba(110,231,183,0.10)',
            display: 'flex', gap: 12, alignItems: 'center',
          }}>
            <ToolGlyph name={t.tag} tone={t.tone} size={42}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontFamily: AYV.font.display, fontWeight: 800, fontSize: 14 }}>{t.n}</span>
                <span style={{
                  fontFamily: AYV.font.mono, fontSize: 9.5, padding: '1px 6px', borderRadius: 4,
                  background: t.diff === 'مبتدی' ? 'rgba(16,185,129,0.14)' : 'rgba(234,179,8,0.14)',
                  color: t.diff === 'مبتدی' ? '#6ee7b7' : '#fde68a', fontWeight: 700,
                }}>{t.diff}</span>
              </div>
              <div style={{ fontSize: 11.5, color: 'rgba(232,239,234,0.6)', marginTop: 2, lineHeight: 1.5 }}>{t.desc}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                <AYIcon name="clock" size={11} color="rgba(232,239,234,0.45)"/>
                <span style={{ fontFamily: AYV.font.mono, fontSize: 10.5, color: 'rgba(232,239,234,0.5)' }}>{AY_FA(t.time)} یادگیری</span>
              </div>
            </div>
            <AYIcon name="chev-l" size={14} color="rgba(232,239,234,0.4)"/>
          </div>
        ))}
      </div>

      {/* Weekly roadmap */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <h3 style={{ margin: 0, fontFamily: AYV.font.display, fontWeight: 800, fontSize: 16 }}>نقشهٔ ۴ هفته</h3>
        <span style={{ fontSize: 12, color: 'rgba(232,239,234,0.5)' }}>{AY_FA('۲۵')}٪ کامل</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
        {roadmap.map((w, i) => (
          <div key={i} style={{
            padding: '12px 14px', borderRadius: 12,
            background: w.active ? 'rgba(16,185,129,0.10)' : 'rgba(31,46,40,0.45)',
            border: `1px solid ${w.active ? 'rgba(110,231,183,0.4)' : 'rgba(110,231,183,0.08)'}`,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 7,
              background: w.done ? '#34d399' : 'transparent',
              border: w.done ? 'none' : `2px solid ${w.active ? '#34d399' : 'rgba(110,231,183,0.3)'}`,
              display: 'grid', placeItems: 'center', flexShrink: 0,
            }}>
              {w.done && <AYIcon name="check" size={12} color="#04110a" stroke={3}/>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: AYV.font.display, fontSize: 11, color: w.active ? '#6ee7b7' : 'rgba(232,239,234,0.6)', fontWeight: 700 }}>{w.w}</div>
              <div style={{ fontSize: 13, marginTop: 1, color: w.done ? 'rgba(232,239,234,0.5)' : '#e8efea', textDecoration: w.done ? 'line-through' : 'none' }}>{w.t}</div>
            </div>
            {w.active && <span style={{ fontFamily: AYV.font.mono, fontSize: 10, color: '#6ee7b7', fontWeight: 700 }}>الان</span>}
          </div>
        ))}
      </div>

      {/* Usage */}
      <div style={{
        padding: 14, borderRadius: 16,
        background: 'rgba(31,46,40,0.55)', border: '1px solid rgba(110,231,183,0.10)',
        marginBottom: 8,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div>
            <div style={{ fontFamily: AYV.font.display, fontWeight: 800, fontSize: 13 }}>تحلیل این هفته</div>
            <div style={{ fontSize: 10.5, color: 'rgba(232,239,234,0.5)', marginTop: 2 }}>تا شنبه ریست می‌شه</div>
          </div>
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontFamily: AYV.font.display, fontWeight: 900, fontSize: 18, color: '#6ee7b7' }}>{AY_FA('۲')}</span>
            <span style={{ fontFamily: AYV.font.mono, fontSize: 12, color: 'rgba(232,239,234,0.5)' }}> از {AY_FA('۵')}</span>
          </div>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: 'rgba(110,231,183,0.10)', overflow: 'hidden' }}>
          <div style={{ width: '40%', height: '100%', background: 'linear-gradient(90deg, #34d399, #10b981)', boxShadow: '0 0 8px rgba(52,211,153,0.4)' }}/>
        </div>
        <div style={{ marginTop: 10, fontSize: 11, color: 'rgba(232,239,234,0.55)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{AY_FA('۳')} تحلیل باقی مونده</span>
          <span style={{ color: '#fde68a', fontWeight: 700 }}>ارتقا به نامحدود</span>
        </div>
      </div>
      <BottomNav4 active="home"/>
    </PageV2>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. /profile — edit form
// ─────────────────────────────────────────────────────────────
function ProfileEditV2() {
  const skills = ['فیگما', 'پژوهش کاربر', 'سیستم طراحی', 'پروتوتایپ', 'Claude', 'v0', 'مدیریت تیم'];
  return (
    <PageV2 title="پروفایل" padBottom={170}>
      {/* Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '4px 0 22px', borderBottom: '1px solid rgba(110,231,183,0.08)' }}>
        <Avatar initials="ع" tone="emerald" size={64}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: AYV.font.display, fontWeight: 900, fontSize: 18, letterSpacing: -0.4 }}>عرفان نیاکی</div>
          <div style={{ fontSize: 12, color: 'rgba(232,239,234,0.55)', marginTop: 2 }}>طراح محصول ارشد</div>
        </div>
        <span style={{ fontSize: 12, color: '#6ee7b7', fontWeight: 700 }}>تغییر</span>
      </div>

      <div style={{ marginTop: 22 }}>
        <FieldV2 label="نام و نام‌خانوادگی" value="عرفان نیاکی" icon="user"/>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <FieldV2 label="سن" value={AY_FA('۲۸')} suffix="سال"/>
          <FieldV2 label="سال تجربه" value={AY_FA('۵')} suffix="سال"/>
        </div>
        <FieldV2 label="عنوان شغلی" value="طراح محصول ارشد" icon="user"/>
        <FieldV2 label="صنعت" value="فناوری اطلاعات" suffix="▾"/>

        {/* Skills with removable chips */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <span style={{ fontFamily: AYV.font.mono, fontSize: 10, letterSpacing: 1.5, color: 'rgba(110,231,183,0.7)', textTransform: 'uppercase' }}>مهارت‌ها</span>
            <span style={{ fontSize: 11.5, color: '#6ee7b7', fontWeight: 700 }}>+ افزودن</span>
          </div>
          <div style={{
            padding: 12, borderRadius: 14,
            background: 'rgba(31,46,40,0.55)', border: '1px solid rgba(110,231,183,0.16)',
            display: 'flex', flexWrap: 'wrap', gap: 6,
          }}>
            {skills.map((s, i) => (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                height: 30, padding: '0 10px 0 6px', borderRadius: 999,
                background: 'rgba(16,185,129,0.14)', border: '1px solid rgba(110,231,183,0.3)',
                color: '#6ee7b7', fontSize: 12, fontWeight: 600,
              }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(110,231,183,0.18)', display: 'grid', placeItems: 'center' }}>
                  <AYIcon name="x" size={10} color="#6ee7b7" stroke={2.4}/>
                </span>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Bio textarea */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: AYV.font.mono, fontSize: 10, letterSpacing: 1.5, color: 'rgba(110,231,183,0.7)', textTransform: 'uppercase', marginBottom: 8 }}>
            دربارهٔ من
          </div>
          <div style={{
            padding: 14, borderRadius: 14, minHeight: 110,
            background: 'rgba(31,46,40,0.55)', border: '1px solid rgba(110,231,183,0.16)',
            fontFamily: AYV.font.body, fontSize: 13.5, lineHeight: 1.7, color: '#e8efea',
          }}>
            ۵ سال تجربهٔ طراحی محصول، اخیراً تمرکزم رو ابزارهای AI گذاشتم. دنبال تیمی هستم که با هوش مصنوعی سرعت کارش بیشتر بشه.
            <span style={{ display: 'inline-block', width: 2, height: 14, background: '#34d399', verticalAlign: 'middle', marginInlineStart: 2, animation: 'ay-caret 1s steps(2) infinite' }}/>
          </div>
          <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'rgba(232,239,234,0.45)', fontFamily: AYV.font.mono }}>
            <span>پیشنهاد: کوتاه و دقیق</span>
            <span>{AY_FA('۹۲')} / {AY_FA('۲۰۰')}</span>
          </div>
        </div>
      </div>

      {/* Bottom action bar (sticky) */}
      <div style={{
        position: 'absolute', bottom: 18, left: 16, right: 16, zIndex: 40,
        padding: 12, borderRadius: 20,
        background: 'rgba(7,12,11,0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(110,231,183,0.14)',
        boxShadow: '0 12px 48px rgba(0,0,0,0.55)',
        display: 'flex', gap: 8,
      }}>
        <div style={{ flex: 1 }}>
          <AYButton variant="ghost" size="lg" full>ذخیره</AYButton>
        </div>
        <div style={{ flex: 1.4 }}>
          <AYButton variant="primary" size="lg" full iconStart={<AYIcon name="sparkle" size={15} color="#04110a"/>}>
            ذخیره و تحلیل مجدد
          </AYButton>
        </div>
      </div>
    </PageV2>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. /billing — current plan + comparison + history
// ─────────────────────────────────────────────────────────────
function BillingV2() {
  const plans = [
    { k: 'free', n: 'رایگان', p: '۰', interval: '', features: ['۲ تحلیل در هفته', 'مسیریاب محدود', 'ابزارهای پایه'], cta: 'پلن فعلی', current: false, tone: 'ink' },
    { k: 'pro',  n: 'پرو',    p: '۲۹۸٬۰۰۰', interval: '/ماه', features: ['تحلیل نامحدود', 'مسیریاب کامل', '۳ ابزار جدید هر هفته', 'بررسی دستی نقشه'], cta: 'پلن فعلی', current: true,  tone: 'emerald' },
    { k: 'max',  n: 'مکس',    p: '۱٬۹۸۰٬۰۰۰', interval: '/سال', features: ['همه چیز پرو', 'جلسهٔ ۱:۱ با مشاور', 'دسترسی زودهنگام به ابزارها', 'ساپورت اختصاصی'], cta: 'ارتقا به مکس', current: false, tone: 'gold' },
  ];
  const history = [
    { d: '۱ آبان ۱۴۰۴', plan: 'پرو · ماهانه', amt: '۲۹۸٬۰۰۰', s: 'موفق' },
    { d: '۱ مهر ۱۴۰۴',  plan: 'پرو · ماهانه', amt: '۲۹۸٬۰۰۰', s: 'موفق' },
    { d: '۱ شهریور ۱۴۰۴', plan: 'پرو · ماهانه', amt: '۲۹۸٬۰۰۰', s: 'موفق' },
  ];
  return (
    <PageV2 title="اشتراک" back={false}>
      {/* Current plan */}
      <div style={{
        padding: 18, borderRadius: 20, marginBottom: 22,
        background: 'linear-gradient(180deg, rgba(16,185,129,0.12), rgba(16,185,129,0.03))',
        border: '1px solid rgba(110,231,183,0.3)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 100% 0%, rgba(52,211,153,0.18), transparent 65%)', pointerEvents: 'none' }}/>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <AYKicker tone="emerald">پلن فعلی</AYKicker>
            <div style={{ fontFamily: AYV.font.display, fontWeight: 900, fontSize: 26, letterSpacing: -0.6, marginTop: 6 }}>پرو · ماهانه</div>
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 11px', borderRadius: 999,
            background: 'rgba(52,211,153,0.18)', border: '1px solid rgba(110,231,183,0.4)',
            fontSize: 11, fontWeight: 800, color: '#6ee7b7',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399' }}/>
            فعال
          </div>
        </div>
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
          <div>
            <div style={{ fontSize: 10.5, color: 'rgba(232,239,234,0.55)' }}>تمدید بعدی</div>
            <div style={{ fontFamily: AYV.font.mono, fontSize: 13, color: '#e8efea', marginTop: 3 }}>{AY_FA('۲۴ اردیبهشت ۱۴۰۵')}</div>
          </div>
          <div>
            <div style={{ fontSize: 10.5, color: 'rgba(232,239,234,0.55)' }}>مبلغ ماهانه</div>
            <div style={{ fontFamily: AYV.font.display, fontWeight: 800, fontSize: 13, color: '#e8efea', marginTop: 3 }}>{AY_FA('۲۹۸٬۰۰۰')} تومان</div>
          </div>
        </div>
        <div style={{ position: 'relative', marginTop: 14, display: 'flex', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <AYButton variant="ghost" size="sm" full>مدیریت</AYButton>
          </div>
          <div style={{ flex: 1 }}>
            <AYButton variant="gold" size="sm" full iconStart={<AYIcon name="crown" size={13} color="#2a1d03"/>}>ارتقا</AYButton>
          </div>
        </div>
      </div>

      {/* Plan comparison */}
      <h3 style={{ margin: '0 0 12px', fontFamily: AYV.font.display, fontWeight: 800, fontSize: 16 }}>مقایسهٔ پلن‌ها</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {plans.map(p => {
          const isPro = p.tone === 'emerald';
          const isMax = p.tone === 'gold';
          return (
            <div key={p.k} style={{
              padding: 16, borderRadius: 18,
              background: isMax
                ? 'linear-gradient(180deg, rgba(42,29,3,0.7), rgba(18,12,1,0.55))'
                : isPro
                ? 'rgba(16,185,129,0.06)'
                : 'rgba(31,46,40,0.45)',
              border: `1px solid ${isMax ? 'rgba(250,204,21,0.3)' : isPro ? 'rgba(110,231,183,0.32)' : 'rgba(110,231,183,0.08)'}`,
              position: 'relative', overflow: 'hidden',
            }}>
              {p.current && (
                <span style={{
                  position: 'absolute', top: 12, insetInlineEnd: 12,
                  fontSize: 9.5, padding: '3px 8px', borderRadius: 999,
                  background: 'rgba(52,211,153,0.2)', color: '#6ee7b7', fontWeight: 800, letterSpacing: 0.5,
                }}>فعلی</span>
              )}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                {isMax && <AYIcon name="crown" size={14} color="#fde68a" stroke={2}/>}
                <span style={{ fontFamily: AYV.font.display, fontWeight: 900, fontSize: 18, color: isMax ? '#fde68a' : isPro ? '#6ee7b7' : '#e8efea', letterSpacing: -0.4 }}>{p.n}</span>
              </div>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontFamily: AYV.font.display, fontWeight: 900, fontSize: 24, letterSpacing: -0.6, color: '#e8efea' }}>{AY_FA(p.p)}</span>
                <span style={{ fontFamily: AYV.font.mono, fontSize: 11, color: 'rgba(232,239,234,0.5)' }}>{p.p === '۰' ? 'تومان' : `تومان${p.interval}`}</span>
              </div>
              <ul style={{ margin: '14px 0 12px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {p.features.map((f, i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12.5, color: 'rgba(232,239,234,0.78)' }}>
                    <AYIcon name="check" size={13} color={isMax ? '#fde68a' : '#6ee7b7'} stroke={2.6}/>
                    {f}
                  </li>
                ))}
              </ul>
              {p.current ? (
                <div style={{
                  padding: '10px 12px', borderRadius: 10, textAlign: 'center',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(110,231,183,0.18)',
                  fontSize: 12, fontWeight: 700, color: 'rgba(232,239,234,0.6)',
                }}>پلن فعلی</div>
              ) : (
                <AYButton variant={isMax ? 'gold' : isPro ? 'primary' : 'ghost'} size="md" full>
                  {p.cta}
                </AYButton>
              )}
            </div>
          );
        })}
      </div>

      {/* Payment history */}
      <h3 style={{ margin: '0 0 12px', fontFamily: AYV.font.display, fontWeight: 800, fontSize: 16 }}>تاریخچهٔ پرداخت‌ها</h3>
      <div style={{
        borderRadius: 16, overflow: 'hidden',
        background: 'rgba(31,46,40,0.55)', border: '1px solid rgba(110,231,183,0.10)',
      }}>
        <div style={{
          padding: '10px 14px', display: 'grid', gridTemplateColumns: '1.1fr 1fr 0.8fr',
          fontFamily: AYV.font.mono, fontSize: 10, letterSpacing: 1, color: 'rgba(110,231,183,0.65)', textTransform: 'uppercase',
          background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(110,231,183,0.08)',
        }}>
          <span>تاریخ</span><span>پلن</span><span style={{ textAlign: 'left' }}>مبلغ</span>
        </div>
        {history.map((h, i) => (
          <div key={i} style={{
            padding: '12px 14px', display: 'grid', gridTemplateColumns: '1.1fr 1fr 0.8fr', alignItems: 'center',
            borderBottom: i < history.length - 1 ? '1px solid rgba(110,231,183,0.06)' : 'none', gap: 8,
          }}>
            <div>
              <div style={{ fontSize: 12, color: '#e8efea', fontFamily: AYV.font.mono }}>{h.d}</div>
              <div style={{ fontSize: 10, color: '#6ee7b7', marginTop: 2 }}>· {h.s}</div>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(232,239,234,0.7)' }}>{h.plan}</div>
            <div style={{ textAlign: 'left', fontFamily: AYV.font.display, fontWeight: 800, fontSize: 12.5 }}>{AY_FA(h.amt)}</div>
          </div>
        ))}
      </div>
      <BottomNav4 active="billing"/>
    </PageV2>
  );
}

// ─────────────────────────────────────────────────────────────
// 6. /billing/checkout
// ─────────────────────────────────────────────────────────────
function CheckoutV2() {
  return (
    <PageV2 title="پرداخت">
      <SectionHeadV2 kicker="آخرین قدم" title="ارتقا به پلن پرو." sub="پرداخت با کارت بانکی از طریق درگاه زرین‌پال — امن و سریع."/>

      {/* Plan summary */}
      <div style={{
        marginTop: 16, padding: 18, borderRadius: 20,
        background: 'linear-gradient(180deg, rgba(16,185,129,0.10), rgba(16,185,129,0.02))',
        border: '1px solid rgba(110,231,183,0.28)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 100% 0%, rgba(52,211,153,0.16), transparent 65%)', pointerEvents: 'none' }}/>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'linear-gradient(180deg, #34d399, #10b981)',
            display: 'grid', placeItems: 'center',
            boxShadow: '0 0 20px rgba(52,211,153,0.4)',
          }}>
            <AYIcon name="bolt" size={22} color="#04110a" stroke={2.4}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: AYV.font.mono, fontSize: 10, letterSpacing: 1.5, color: '#6ee7b7' }}>پلن انتخاب شده</div>
            <div style={{ fontFamily: AYV.font.display, fontWeight: 900, fontSize: 20, letterSpacing: -0.4, marginTop: 2 }}>پرو · ماهانه</div>
          </div>
        </div>
        {/* Line items */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10, padding: '14px 0', borderTop: '1px solid rgba(110,231,183,0.14)' }}>
          {[
            ['اشتراک ماهانه', '۲۹۸٬۰۰۰'],
            ['تخفیف اولین خرید', '−۰'],
            ['مالیات بر ارزش افزوده', '۰'],
          ].map(([k, v], i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
              <span style={{ color: 'rgba(232,239,234,0.6)' }}>{k}</span>
              <span style={{ fontFamily: AYV.font.mono, color: '#e8efea' }}>{AY_FA(v)} تومان</span>
            </div>
          ))}
        </div>
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 14, borderTop: '1px dashed rgba(110,231,183,0.2)' }}>
          <span style={{ fontFamily: AYV.font.display, fontWeight: 800, fontSize: 13, color: 'rgba(232,239,234,0.7)' }}>مبلغ نهایی</span>
          <div>
            <span style={{ fontFamily: AYV.font.display, fontWeight: 900, fontSize: 26, color: '#6ee7b7', letterSpacing: -0.6 }}>{AY_FA('۲۹۸٬۰۰۰')}</span>
            <span style={{ fontFamily: AYV.font.mono, fontSize: 12, color: 'rgba(232,239,234,0.5)', marginInlineStart: 6 }}>تومان / ماه</span>
          </div>
        </div>
      </div>

      {/* Coupon */}
      <div style={{
        marginTop: 14, padding: '12px 14px', borderRadius: 12,
        background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(110,231,183,0.22)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <AYIcon name="bolt" size={14} color="rgba(110,231,183,0.7)"/>
        <span style={{ flex: 1, fontSize: 12.5, color: 'rgba(232,239,234,0.55)' }}>کد تخفیف داری؟</span>
        <span style={{ fontSize: 12, color: '#6ee7b7', fontWeight: 700 }}>وارد کن</span>
      </div>

      {/* Pay button */}
      <div style={{ marginTop: 22 }}>
        <AYButton variant="primary" size="lg" full iconStart={
          <span style={{ width: 22, height: 22, borderRadius: 6, background: '#04110a', display: 'grid', placeItems: 'center', fontFamily: AYV.font.mono, fontSize: 9, fontWeight: 800, color: '#fde68a' }}>Z</span>
        }>
          پرداخت با زرین‌پال — {AY_FA('۲۹۸٬۰۰۰')} تومان
        </AYButton>
      </div>

      {/* Note */}
      <div style={{
        marginTop: 16, padding: 14, borderRadius: 14,
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(110,231,183,0.10)',
        display: 'flex', gap: 12, alignItems: 'flex-start',
      }}>
        <AYIcon name="shield" size={16} color="rgba(110,231,183,0.7)" stroke={1.6}/>
        <div style={{ flex: 1, fontSize: 12, color: 'rgba(232,239,234,0.65)', lineHeight: 1.7 }}>
          <strong style={{ color: '#6ee7b7' }}>بعد از پرداخت برمی‌گردی به اپ.</strong> اشتراکت بلافاصله فعال می‌شه. تا ۷ روز بعد می‌تونی بدون سؤال کنسل کنی.
        </div>
      </div>

      {/* Payment logos */}
      <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, opacity: 0.6 }}>
        {['SHETAB', 'ZARINPAL', 'SSL'].map((l, i) => (
          <div key={i} style={{
            padding: '6px 12px', borderRadius: 6,
            border: '1px solid rgba(110,231,183,0.18)',
            fontFamily: AYV.font.mono, fontSize: 10, letterSpacing: 1.5, color: 'rgba(232,239,234,0.55)',
          }}>{l}</div>
        ))}
      </div>
    </PageV2>
  );
}

// ─────────────────────────────────────────────────────────────
// 7A. /billing/success
// ─────────────────────────────────────────────────────────────
function BillingSuccessV2() {
  return (
    <PageV2 back={false}>
      <div style={{ height: 700, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 12px', position: 'relative' }}>
        {/* confetti */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => {
            const x = (i * 37 + 13) % 100;
            const y = 8 + (i * 23) % 60;
            const c = i % 3 === 0 ? '#34d399' : i % 3 === 1 ? '#6ee7b7' : '#e8efea';
            const s = i % 2 === 0 ? 4 : 3;
            return (
              <div key={i} style={{
                position: 'absolute', left: `${x}%`, top: `${y}%`,
                width: s, height: s, background: c, opacity: 0.7,
                animation: `ay-float ${3 + (i % 3)}s ease-in-out ${i * 0.13}s infinite`,
              }}/>
            );
          })}
        </div>
        {/* check circle */}
        <div style={{
          width: 96, height: 96, borderRadius: '50%', marginBottom: 28,
          background: 'linear-gradient(180deg, #34d399, #10b981)',
          display: 'grid', placeItems: 'center',
          boxShadow: '0 0 60px rgba(52,211,153,0.5), 0 0 0 12px rgba(52,211,153,0.10)',
          position: 'relative', zIndex: 5,
        }}>
          <AYIcon name="check" size={44} color="#04110a" stroke={3.2}/>
        </div>
        <AYKicker tone="emerald">پرداخت موفق</AYKicker>
        <h1 style={{ margin: '14px 0 10px', fontFamily: AYV.font.display, fontWeight: 900, fontSize: 30, letterSpacing: -1, lineHeight: 1.05, position: 'relative' }}>
          اشتراکت<br/>
          <span style={{ color: '#6ee7b7' }}>فعال شد.</span>
        </h1>
        <p style={{ margin: '0 0 28px', fontSize: 13.5, color: 'rgba(232,239,234,0.65)', maxWidth: 320, lineHeight: 1.7, position: 'relative' }}>
          از الان تحلیل نامحدود، مسیریاب کامل و هر هفته ۳ ابزار تازه. وقتشه شروع کنیم.
        </p>
        <div style={{ width: '100%', maxWidth: 320, position: 'relative' }}>
          <div style={{
            padding: 14, borderRadius: 14, marginBottom: 14,
            background: 'rgba(31,46,40,0.55)', border: '1px solid rgba(110,231,183,0.16)', textAlign: 'right',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
              <span style={{ color: 'rgba(232,239,234,0.55)' }}>کد پیگیری</span>
              <span style={{ fontFamily: AYV.font.mono, color: '#e8efea' }}>AY-{AY_FA('۸۴۲۹۱۷۳')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: 'rgba(232,239,234,0.55)' }}>اعتبار تا</span>
              <span style={{ fontFamily: AYV.font.mono, color: '#6ee7b7' }}>{AY_FA('۲۴ اردیبهشت ۱۴۰۵')}</span>
            </div>
          </div>
          <AYButton variant="primary" size="lg" full iconEnd={<AYIcon name="arrow-l" size={16} color="#04110a"/>}>
            رفتن به داشبورد
          </AYButton>
          <div style={{ marginTop: 12, fontSize: 12, color: 'rgba(232,239,234,0.5)', fontWeight: 500 }}>
            دانلود فاکتور
          </div>
        </div>
      </div>
    </PageV2>
  );
}

// ─────────────────────────────────────────────────────────────
// 7B. /billing/failed
// ─────────────────────────────────────────────────────────────
function BillingFailedV2() {
  return (
    <PageV2 back={false}>
      <div style={{ height: 700, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 12px' }}>
        <div style={{
          width: 96, height: 96, borderRadius: '50%', marginBottom: 28,
          background: 'linear-gradient(180deg, #ef4444, #b91c1c)',
          display: 'grid', placeItems: 'center',
          boxShadow: '0 0 60px rgba(239,68,68,0.4), 0 0 0 12px rgba(239,68,68,0.10)',
        }}>
          <AYIcon name="x" size={42} color="#fff" stroke={3.2}/>
        </div>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          height: 26, padding: '0 12px', borderRadius: 999,
          background: 'rgba(220,38,38,0.14)', border: '1px solid rgba(248,113,113,0.32)',
          color: '#fca5a5', fontFamily: AYV.font.display, fontSize: 11, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fca5a5' }}/>
          ناموفق
        </span>
        <h1 style={{ margin: '14px 0 10px', fontFamily: AYV.font.display, fontWeight: 900, fontSize: 30, letterSpacing: -1, lineHeight: 1.05 }}>
          پرداخت<br/><span style={{ color: '#fca5a5' }}>ناموفق بود.</span>
        </h1>
        <p style={{ margin: '0 0 22px', fontSize: 13.5, color: 'rgba(232,239,234,0.65)', maxWidth: 320, lineHeight: 1.7 }}>
          مبلغی از حسابت کم نشد. ممکنه موجودی کافی نباشه یا اتصال قطع شده باشه.
        </p>
        <div style={{ width: '100%', maxWidth: 320 }}>
          <div style={{
            padding: 14, borderRadius: 14, marginBottom: 16, textAlign: 'right',
            background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(248,113,113,0.22)',
          }}>
            <div style={{ fontFamily: AYV.font.mono, fontSize: 11, color: '#fca5a5', marginBottom: 6 }}>دلیل خطا</div>
            <div style={{ fontSize: 13, color: '#e8efea', lineHeight: 1.6 }}>تراکنش توسط بانک رد شد — کد ۹۲۱</div>
          </div>
          <AYButton variant="primary" size="lg" full iconStart={<AYIcon name="bolt" size={15} color="#04110a"/>}>
            تلاش مجدد
          </AYButton>
          <div style={{ marginTop: 12 }}>
            <AYButton variant="ghost" size="md" full>برگشت به پلن‌ها</AYButton>
          </div>
          <div style={{ marginTop: 16, fontSize: 12, color: 'rgba(232,239,234,0.5)' }}>
            مشکل ادامه داره؟ <span style={{ color: '#6ee7b7', fontWeight: 700 }}>پشتیبانی</span>
          </div>
        </div>
      </div>
    </PageV2>
  );
}

// ─────────────────────────────────────────────────────────────
// 8. /settings — accordion sections
// ─────────────────────────────────────────────────────────────
function ToggleRow({ label, sub, on = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: 'rgba(232,239,234,0.5)', marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{
        width: 42, height: 24, borderRadius: 999, position: 'relative',
        background: on ? 'linear-gradient(90deg, #34d399, #10b981)' : 'rgba(110,231,183,0.14)',
        border: `1px solid ${on ? 'rgba(110,231,183,0.4)' : 'rgba(110,231,183,0.18)'}`,
        boxShadow: on ? '0 0 12px rgba(52,211,153,0.4)' : 'none',
      }}>
        <div style={{
          position: 'absolute', top: 1, insetInlineStart: on ? 19 : 1,
          width: 20, height: 20, borderRadius: '50%',
          background: on ? '#04110a' : '#e8efea',
          transition: 'inset-inline-start 0.2s',
        }}/>
      </div>
    </div>
  );
}

function AccordionV2({ icon, title, sub, open, danger, children }) {
  return (
    <div style={{
      borderRadius: 16, marginBottom: 10, overflow: 'hidden',
      background: 'rgba(31,46,40,0.55)',
      border: `1px solid ${danger ? 'rgba(248,113,113,0.22)' : 'rgba(110,231,183,0.10)'}`,
    }}>
      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: danger ? 'rgba(239,68,68,0.14)' : 'rgba(16,185,129,0.14)',
          display: 'grid', placeItems: 'center',
        }}>
          <AYIcon name={icon} size={16} color={danger ? '#fca5a5' : '#6ee7b7'} stroke={1.7}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: AYV.font.display, fontWeight: 800, fontSize: 14, color: danger ? '#fca5a5' : '#e8efea' }}>{title}</div>
          {sub && <div style={{ fontSize: 11, color: 'rgba(232,239,234,0.5)', marginTop: 2 }}>{sub}</div>}
        </div>
        <AYIcon name={open ? 'chev-d' : 'chev-l'} size={14} color="rgba(232,239,234,0.4)"/>
      </div>
      {open && (
        <div style={{ padding: '4px 16px 14px', borderTop: '1px solid rgba(110,231,183,0.08)' }}>
          {children}
        </div>
      )}
    </div>
  );
}

function SettingsV2() {
  return (
    <PageV2 title="تنظیمات" back={false}>
      <AccordionV2 icon="bell" title="نوتیفیکیشن‌ها" sub="پیامک، اعلان درون‌اپ، ایمیل" open>
        <ToggleRow label="نوتیفیکیشن درون‌اپ" sub="ابزار جدید، پیشرفت نقشه" on/>
        <div style={{ height: 1, background: 'rgba(110,231,183,0.06)' }}/>
        <ToggleRow label="ایمیل خلاصهٔ هفتگی" sub="هر شنبه صبح" on/>
        <div style={{ height: 1, background: 'rgba(110,231,183,0.06)' }}/>
        <ToggleRow label="پیامک یادآور" sub="فقط برای کارهای مهم"/>
        <div style={{ height: 1, background: 'rgba(110,231,183,0.06)' }}/>
        <ToggleRow label="اعلان شغل‌های جدید" sub="مطابق پروفایل تو" on/>
      </AccordionV2>

      <AccordionV2 icon="shield" title="امنیت حساب" sub="شماره موبایل، کلمه عبور" open>
        <div style={{ padding: '14px 0', borderBottom: '1px solid rgba(110,231,183,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>شمارهٔ موبایل</div>
            <div style={{ fontFamily: AYV.font.mono, fontSize: 12, color: 'rgba(232,239,234,0.55)', marginTop: 3, direction: 'ltr' }}>+98 912 *** 6789</div>
          </div>
          <span style={{ fontSize: 12, color: '#6ee7b7', fontWeight: 700 }}>تغییر</span>
        </div>
        <div style={{ padding: '14px 0', borderBottom: '1px solid rgba(110,231,183,0.06)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>دستگاه‌های فعال</div>
            <div style={{ fontSize: 11, color: 'rgba(232,239,234,0.55)', marginTop: 2 }}>۲ دستگاه واردند</div>
          </div>
          <AYIcon name="chev-l" size={14} color="rgba(232,239,234,0.4)"/>
        </div>
        <ToggleRow label="ورود دومرحله‌ای" sub="کد تأیید برای ورود از دستگاه جدید" on/>
      </AccordionV2>

      <AccordionV2 icon="user" title="زبان و منطقه" sub="فارسی، تقویم شمسی"/>
      <AccordionV2 icon="message" title="حریم خصوصی" sub="مدیریت داده‌ها و کوکی‌ها"/>

      {/* Danger zone */}
      <AccordionV2 icon="x" title="منطقهٔ خطر" sub="حذف حساب کاربری" open danger>
        <div style={{ padding: '14px 0' }}>
          <p style={{ margin: '0 0 12px', fontSize: 12, color: 'rgba(232,239,234,0.65)', lineHeight: 1.7 }}>
            با حذف حساب، تمام داده‌ها، نقشه‌ها و سوابق پرداختت پاک می‌شه. این عمل برگشت‌پذیر نیست.
          </p>

          {/* Mock confirm dialog inline */}
          <div style={{
            padding: 14, borderRadius: 14,
            background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(248,113,113,0.28)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(239,68,68,0.18)', display: 'grid', placeItems: 'center' }}>
                <AYIcon name="x" size={14} color="#fca5a5" stroke={2.4}/>
              </div>
              <span style={{ fontFamily: AYV.font.display, fontWeight: 800, fontSize: 13, color: '#fca5a5' }}>مطمئنی؟</span>
            </div>
            <p style={{ margin: '0 0 10px', fontSize: 11.5, color: 'rgba(232,239,234,0.65)', lineHeight: 1.6 }}>
              برای تأیید، عبارت <span style={{ fontFamily: AYV.font.mono, color: '#fca5a5' }}>حذف حساب</span> رو بنویس.
            </p>
            <div style={{
              padding: '10px 12px', borderRadius: 10, marginBottom: 10,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(248,113,113,0.22)',
              fontFamily: AYV.font.mono, fontSize: 13, color: 'rgba(232,239,234,0.4)',
            }}>
              حذف حساب<span style={{ display: 'inline-block', width: 2, height: 14, background: '#fca5a5', verticalAlign: 'middle', marginInlineStart: 2, animation: 'ay-caret 1s steps(2) infinite' }}/>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <AYButton variant="ghost" size="sm" full>انصراف</AYButton>
              </div>
              <div style={{ flex: 1 }}>
                <button style={{
                  width: '100%', height: 38, borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(180deg, #ef4444, #b91c1c)', color: '#fff',
                  fontFamily: AYV.font.display, fontWeight: 800, fontSize: 13,
                  boxShadow: '0 6px 20px rgba(239,68,68,0.35)',
                }}>حذف برای همیشه</button>
              </div>
            </div>
          </div>
        </div>
      </AccordionV2>

      <div style={{ marginTop: 20, padding: 14, borderRadius: 12, background: 'rgba(255,255,255,0.02)', textAlign: 'center', border: '1px solid rgba(110,231,183,0.08)' }}>
        <div style={{ fontSize: 11, color: 'rgba(232,239,234,0.45)', fontFamily: AYV.font.mono }}>
          A-Y · نسخهٔ {AY_FA('۲٫۴٫۱')} · {AY_FA('۱۴۰۴')}
        </div>
      </div>

      <BottomNav4 active="settings"/>
    </PageV2>
  );
}

// ─────────────────────────────────────────────────────────────
// 9. /help — FAQ + contact
// ─────────────────────────────────────────────────────────────
function FAQItem({ q, open, a }) {
  return (
    <div style={{
      borderRadius: 14, marginBottom: 8, overflow: 'hidden',
      background: 'rgba(31,46,40,0.55)', border: '1px solid rgba(110,231,183,0.10)',
    }}>
      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1, fontFamily: AYV.font.display, fontWeight: open ? 800 : 600, fontSize: 13.5, color: open ? '#6ee7b7' : '#e8efea', lineHeight: 1.4 }}>{q}</div>
        <div style={{
          width: 24, height: 24, borderRadius: 7,
          background: open ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.04)',
          display: 'grid', placeItems: 'center',
        }}>
          <AYIcon name={open ? 'chev-d' : 'plus-s'} size={12} color={open ? '#6ee7b7' : 'rgba(232,239,234,0.55)'} stroke={2.2}/>
        </div>
      </div>
      {open && a && (
        <div style={{ padding: '0 16px 14px', borderTop: '1px solid rgba(110,231,183,0.08)' }}>
          <p style={{ margin: '12px 0 0', fontSize: 12.5, color: 'rgba(232,239,234,0.7)', lineHeight: 1.8 }}>{a}</p>
        </div>
      )}
    </div>
  );
}

function HelpV2() {
  const faqs = [
    { q: 'A-Y چطور کار می‌کنه؟', open: true, a: 'شغل و مهارت‌هات رو می‌گیره، با مدل‌های زبانی تحلیل می‌کنه و دقیقاً می‌گه کدوم ابزار AI رو، با چه ترتیبی، توی چه زمانی یاد بگیری تا توی شغلت جا نمونی.' },
    { q: 'تحلیل چند دقیقه طول می‌کشه؟' },
    { q: 'آیا داده‌هام پیش شما امنه؟' },
    { q: 'چطور پلنم رو ارتقا بدم یا کنسل کنم؟' },
    { q: 'چه ابزارهایی رو پوشش می‌دید؟' },
    { q: 'بدون پرداخت چقدر می‌تونم استفاده کنم؟' },
    { q: 'فاکتور پرداخت رو از کجا بگیرم؟' },
    { q: 'برای تیم‌ها هم پلن دارید؟' },
  ];
  return (
    <PageV2 title="راهنما" back={false}>
      {/* search */}
      <div style={{
        padding: '12px 14px', borderRadius: 14, marginBottom: 18,
        background: 'rgba(31,46,40,0.55)', border: '1px solid rgba(110,231,183,0.16)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <AYIcon name="search" size={16} color="rgba(110,231,183,0.7)"/>
        <span style={{ flex: 1, fontSize: 13, color: 'rgba(232,239,234,0.45)' }}>جست‌وجو در سؤال‌های متداول…</span>
      </div>

      <div style={{ fontFamily: AYV.font.mono, fontSize: 10, letterSpacing: 2, color: 'rgba(110,231,183,0.7)', textTransform: 'uppercase', marginBottom: 8 }}>
        سؤال‌های متداول · {AY_FA(String(faqs.length))}
      </div>
      {faqs.map((f, i) => <FAQItem key={i} {...f}/>)}

      {/* Contact */}
      <h3 style={{ margin: '24px 0 12px', fontFamily: AYV.font.display, fontWeight: 800, fontSize: 16 }}>هنوز سؤال داری؟</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        <div style={{
          padding: 16, borderRadius: 16, textAlign: 'center',
          background: 'linear-gradient(180deg, rgba(56,189,248,0.10), rgba(56,189,248,0.02))',
          border: '1px solid rgba(56,189,248,0.28)',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, margin: '0 auto 10px',
            background: 'rgba(56,189,248,0.18)', display: 'grid', placeItems: 'center',
          }}>
            <AYIcon name="send" size={20} color="#67e8f9" stroke={1.8}/>
          </div>
          <div style={{ fontFamily: AYV.font.display, fontWeight: 800, fontSize: 13, color: '#67e8f9' }}>تلگرام</div>
          <div style={{ fontFamily: AYV.font.mono, fontSize: 10.5, color: 'rgba(232,239,234,0.55)', marginTop: 4 }}>@ay_support</div>
          <div style={{ marginTop: 10 }}>
            <AYButton variant="ghost" size="sm" full>پیام بده</AYButton>
          </div>
        </div>
        <div style={{
          padding: 16, borderRadius: 16, textAlign: 'center',
          background: 'linear-gradient(180deg, rgba(16,185,129,0.10), rgba(16,185,129,0.02))',
          border: '1px solid rgba(110,231,183,0.28)',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, margin: '0 auto 10px',
            background: 'rgba(16,185,129,0.18)', display: 'grid', placeItems: 'center',
          }}>
            <AYIcon name="message" size={20} color="#6ee7b7" stroke={1.8}/>
          </div>
          <div style={{ fontFamily: AYV.font.display, fontWeight: 800, fontSize: 13, color: '#6ee7b7' }}>ایمیل</div>
          <div style={{ fontFamily: AYV.font.mono, fontSize: 10.5, color: 'rgba(232,239,234,0.55)', marginTop: 4 }}>hi@a-y.app</div>
          <div style={{ marginTop: 10 }}>
            <AYButton variant="ghost" size="sm" full>بفرست</AYButton>
          </div>
        </div>
      </div>

      <div style={{
        padding: 14, borderRadius: 14, marginBottom: 8,
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(110,231,183,0.08)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <AYIcon name="clock" size={14} color="rgba(110,231,183,0.7)"/>
        <span style={{ flex: 1, fontSize: 11.5, color: 'rgba(232,239,234,0.6)' }}>ساعت پاسخ‌گویی: شنبه تا چهارشنبه، ۹ صبح تا ۶ عصر</span>
      </div>

      <BottomNav4 active="settings"/>
    </PageV2>
  );
}

Object.assign(window, {
  PageV2, BottomNav4, FieldV2, SectionHeadV2,
  LoginPhoneV2, LoginOTPV2,
  OnboardingWizardV2,
  DashboardV2, ProfileEditV2,
  BillingV2, CheckoutV2, BillingSuccessV2, BillingFailedV2,
  SettingsV2, HelpV2,
});
