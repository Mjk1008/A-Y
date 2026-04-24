// A-Y — Chat (مسیریاب) — 5 states in a shared layout
const AY_C = window.AY;

function ChatBubble({ role = 'ai', children, style = {} }) {
  const isUser = role === 'user';
  return (
    <div style={{
      display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 10, ...style,
    }}>
      <div style={{
        maxWidth: '80%',
        padding: '10px 14px',
        borderRadius: 18,
        background: isUser
          ? 'linear-gradient(180deg, #34d399, #10b981)'
          : 'rgba(31,46,40,0.65)',
        color: isUser ? '#04110a' : '#e8efea',
        border: isUser ? 'none' : '1px solid rgba(110,231,183,0.12)',
        backdropFilter: isUser ? 'none' : 'blur(10px)',
        fontSize: 14, lineHeight: 1.55,
        fontFamily: AY_C.font.body,
        boxShadow: isUser
          ? '0 6px 20px rgba(16,185,129,0.3)'
          : '0 6px 20px rgba(0,0,0,0.25)',
        borderBottomRightRadius: isUser ? 6 : 18,
        borderBottomLeftRadius: isUser ? 18 : 6,
        fontWeight: isUser ? 600 : 400,
      }}>{children}</div>
    </div>
  );
}

function ChatHeader({ title = 'مسیریاب' }) {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30,
      paddingTop: 54, paddingBottom: 14,
      background: 'linear-gradient(180deg, rgba(2,3,6,0.9) 0%, rgba(2,3,6,0.75) 70%, transparent 100%)',
      backdropFilter: 'blur(14px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, marginTop: 10 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 12,
          background: 'rgba(5,9,10,0.6)',
          border: '1px solid rgba(110,231,183,0.14)',
          display: 'grid', placeItems: 'center',
        }}>
          <AYIcon name="chev-r" size={16} color="#e8efea"/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: AY_C.font.display, fontWeight: 800, fontSize: 16, letterSpacing: -0.3 }}>{title}</div>
          <div style={{ fontSize: 10.5, color: 'rgba(110,231,183,0.75)', display: 'flex', alignItems: 'center', gap: 5, fontFamily: AY_C.font.mono, letterSpacing: 0.5 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#34d399',
              animation: 'ay-pulse-dot 1.3s ease-in-out infinite' }}/>
            مسیریاب ای‌وای آنلاین
          </div>
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: 12,
          background: 'rgba(5,9,10,0.6)',
          border: '1px solid rgba(110,231,183,0.14)',
          display: 'grid', placeItems: 'center',
        }}>
          <AYIcon name="plus" size={16} color="#e8efea"/>
        </div>
      </div>
    </div>
  );
}

function ChatComposer({ value = '', placeholder = 'از ابزارت بپرس...', active }) {
  return (
    <div style={{
      position: 'absolute', bottom: 24, left: 12, right: 12, zIndex: 30,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: 6,
        borderRadius: 999,
        background: 'rgba(5,9,10,0.7)',
        backdropFilter: 'blur(18px) saturate(160%)',
        border: `1px solid ${active ? 'rgba(110,231,183,0.35)' : 'rgba(110,231,183,0.14)'}`,
        boxShadow: '0 10px 40px rgba(0,0,0,0.45)',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
          display: 'grid', placeItems: 'center',
        }}>
          <AYIcon name="plus" size={18} color="rgba(232,239,234,0.55)"/>
        </div>
        <div style={{ flex: 1, fontSize: 14, color: value ? '#e8efea' : 'rgba(232,239,234,0.4)', display: 'flex', alignItems: 'center', gap: 4, minHeight: 36 }}>
          {value || placeholder}
          {active && <span style={{ width: 2, height: 18, background: '#34d399', animation: 'ay-caret 1s steps(2) infinite' }}/>}
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: value ? 'linear-gradient(180deg, #34d399, #10b981)' : 'rgba(255,255,255,0.04)',
          display: 'grid', placeItems: 'center',
          boxShadow: value ? '0 4px 18px rgba(16,185,129,0.5)' : 'none',
        }}>
          {value
            ? <AYIcon name="send" size={16} color="#04110a" stroke={2}/>
            : <AYIcon name="mic" size={16} color="rgba(232,239,234,0.7)"/>}
        </div>
      </div>
    </div>
  );
}

// ─── Empty / welcome ───
function ChatEmpty() {
  return (
    <Phone sceneVariant="sit" hue="emerald">
      <ChatHeader/>
      <div style={{ position: 'absolute', top: 130, bottom: 100, left: 0, right: 0, zIndex: 20, padding: '0 20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <div style={{
          padding: '40px 20px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(2,3,6,0.85) 40%, #020306 100%)',
          borderRadius: 24,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, #34d399, #047857)',
            display: 'grid', placeItems: 'center', marginBottom: 16,
            boxShadow: '0 0 30px rgba(16,185,129,0.5)',
          }}>
            <AYIcon name="compass" size={26} color="#04110a" stroke={2}/>
          </div>
          <h2 style={{
            fontFamily: AY_C.font.display, fontWeight: 900, fontSize: 26,
            lineHeight: 1.05, letterSpacing: -0.8, margin: '0 0 8px',
          }}>سلام عرفان،<br/>امروز چی یاد بگیریم؟</h2>
          <p style={{ fontSize: 13, color: 'rgba(232,239,234,0.6)', margin: '0 0 18px', lineHeight: 1.5 }}>
            من مسیریاب ای‌وایم. از کارهای امروزت بپرس.
          </p>

          <div style={{ fontFamily: AY_C.font.mono, fontSize: 10, letterSpacing: 2, color: 'rgba(110,231,183,0.55)', textTransform: 'uppercase', marginBottom: 10 }}>
            شروع کن با
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { i: 'bolt', t: 'چطور با Claude بریف بنویسم؟' },
              { i: 'target', t: 'برای کار امروزم چه ابزاری بهتره؟' },
              { i: 'book', t: 'هفتهٔ ۱ رو از کجا شروع کنم؟' },
            ].map((p, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(110,231,183,0.12)',
                borderRadius: 14,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: 'rgba(16,185,129,0.14)',
                  display: 'grid', placeItems: 'center', flexShrink: 0,
                }}>
                  <AYIcon name={p.i} size={14} color="#6ee7b7" stroke={1.8}/>
                </div>
                <span style={{ fontSize: 13, color: 'rgba(232,239,234,0.85)', flex: 1 }}>{p.t}</span>
                <AYIcon name="chev-l" size={14} color="rgba(232,239,234,0.35)"/>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ChatComposer/>
    </Phone>
  );
}

// ─── Active conversation with tool-result card + follow-ups ───
function ChatActive() {
  return (
    <Phone sceneVariant="sit" hue="emerald">
      <ChatHeader/>
      <div style={{ position: 'absolute', top: 120, bottom: 95, left: 0, right: 0, zIndex: 20, overflow: 'auto' }}>
        <div style={{
          padding: '30px 16px 20px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(2,3,6,0.85) 15%, #020306 30%)',
          minHeight: '100%',
        }}>
          {/* Day divider */}
          <div style={{ textAlign: 'center', margin: '0 0 16px' }}>
            <span style={{
              fontFamily: AY_C.font.mono, fontSize: 10, letterSpacing: 2,
              color: 'rgba(232,239,234,0.4)', textTransform: 'uppercase',
              background: 'rgba(255,255,255,0.03)', padding: '4px 12px', borderRadius: 999,
            }}>امروز · {AY_FA('۱۴:۲۳')}</span>
          </div>

          <ChatBubble role="user">
            برای طراحی onboarding یه اپ بانکی، از کجا شروع کنم؟
          </ChatBubble>

          <ChatBubble role="ai">
            سؤال خوبیه عرفان. قبل از اسکچ، دو تا کار پیشنهاد می‌کنم. اول یه ۳۰ دقیقه با کلود بریف رو بازتر کن — من براتون template ساختم.
          </ChatBubble>

          {/* Tool-result card */}
          <div style={{
            margin: '2px 0 10px',
            background: 'linear-gradient(180deg, rgba(31,46,40,0.75), rgba(18,30,24,0.65))',
            border: '1px solid rgba(110,231,183,0.22)',
            borderRadius: 18, overflow: 'hidden',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          }}>
            <div style={{ padding: '14px 16px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
              <ToolGlyph name="کل" tone="emerald" size={32}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: AY_C.font.display, fontWeight: 800, fontSize: 14 }}>Claude · بریف onboarding</div>
                <div style={{ fontSize: 11, color: 'rgba(232,239,234,0.5)' }}>پرامپت آماده برای استفاده</div>
              </div>
              <span style={{
                fontFamily: AY_C.font.mono, fontSize: 9.5, padding: '3px 8px', borderRadius: 6,
                background: 'rgba(234,179,8,0.12)', color: '#fde68a', letterSpacing: 0.5,
              }}>PRO</span>
            </div>
            <div style={{
              margin: '12px 12px 12px',
              padding: '12px 14px',
              background: 'rgba(2,3,6,0.55)',
              borderRadius: 12,
              fontFamily: AY_C.font.mono, fontSize: 11, lineHeight: 1.7,
              color: 'rgba(232,239,234,0.8)',
              direction: 'ltr', textAlign: 'left',
              border: '1px solid rgba(110,231,183,0.10)',
            }}>
              <span style={{ color: 'rgba(110,231,183,0.6)' }}>// role</span>
              <br/>You are a senior onboarding designer...
              <br/><span style={{ color: 'rgba(110,231,183,0.6)' }}>// goal</span>
              <br/>Define 3 jobs-to-be-done for a
              <br/>banking app's first-time user...
            </div>
            <div style={{ padding: '0 12px 14px', display: 'flex', gap: 8 }}>
              <AYButton variant="primary" size="sm" style={{ flex: 1 }}>
                باز کردن در کلود
              </AYButton>
              <AYButton variant="secondary" size="sm" style={{ flex: 1 }}>
                کپی
              </AYButton>
            </div>
          </div>

          <ChatBubble role="ai">
            بعدش با v0 اسکلت صفحه‌ها رو در ۱۰ دقیقه بساز. قدم بعدی چیه؟
          </ChatBubble>

          {/* Follow-up suggestions */}
          <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['پرامپت v0 رو بده', 'چه سوالی از کاربر بپرسم؟', 'نمونهٔ کار مشابه'].map((s, i) => (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '7px 12px', borderRadius: 999,
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(110,231,183,0.22)',
                color: '#6ee7b7', fontSize: 12, fontWeight: 500,
              }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
      <ChatComposer value="پرامپت v0 رو بده" active/>
    </Phone>
  );
}

// ─── Typing indicator state ───
function ChatTyping() {
  return (
    <Phone sceneVariant="sit" hue="emerald">
      <ChatHeader/>
      <div style={{ position: 'absolute', top: 120, bottom: 95, left: 0, right: 0, zIndex: 20, overflow: 'auto' }}>
        <div style={{
          padding: '40px 16px 20px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(2,3,6,0.85) 15%, #020306 30%)',
          minHeight: '100%',
        }}>
          <ChatBubble role="user">پرامپت v0 رو بده</ChatBubble>
          <ChatBubble role="ai">
            الان می‌سازم. چند ثانیه...
          </ChatBubble>

          {/* typing dots */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 10 }}>
            <div style={{
              padding: '12px 16px', borderRadius: 18, borderBottomLeftRadius: 6,
              background: 'rgba(31,46,40,0.65)',
              border: '1px solid rgba(110,231,183,0.14)',
              backdropFilter: 'blur(10px)',
              display: 'flex', gap: 5,
            }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: '#6ee7b7',
                  animation: `ay-typing 1.2s ease-in-out ${i * 0.16}s infinite`,
                }}/>
              ))}
            </div>
          </div>

          <div style={{
            marginTop: 8,
            fontFamily: AY_C.font.mono, fontSize: 10, letterSpacing: 2,
            color: 'rgba(110,231,183,0.55)', textAlign: 'center', textTransform: 'uppercase',
          }}>
            · در حال نوشتن پاسخ ·
          </div>
        </div>
      </div>
      <ChatComposer/>
    </Phone>
  );
}

Object.assign(window, { ChatEmpty, ChatActive, ChatTyping });
