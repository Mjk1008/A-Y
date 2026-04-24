// A-Y — New / redesigned screens (mascot-driven, repo-palette aligned)
// Exposes:
//   LandingV3       — full landing with PixelMascot hero
//   ChatV2          — active conversation + mascot avatar + tool result + typing
//   GamesScreen     — pixel-game gallery (career game, AI tool game, interview sim)
//   AdminConsole    — internal admin dashboard
//   CoursesV2       — redesigned courses with mascot empty-state
//   JobsV2          — redesigned jobs feed with match gauges

const AYN = window.AY;

// ─── Mini Scene backdrop (reusable) ─────────────────────────
function MiniScene({ intensity = 1 }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `radial-gradient(ellipse 70% 45% at 50% 20%, rgba(16,185,129,${0.22 * intensity}), transparent 60%),
                   radial-gradient(ellipse 60% 40% at 85% 10%, rgba(52,211,153,${0.14 * intensity}), transparent 55%),
                   #020306`,
      overflow: 'hidden',
    }}>
      {/* Horizon */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: '68%',
        height: 1, background: 'linear-gradient(90deg, transparent, rgba(110,231,183,0.5), transparent)',
      }}/>
      {/* Dashed perspective */}
      <svg style={{ position: 'absolute', inset: 0 }} width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="none">
        {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map(i => (
          <line key={i}
            x1={200 + i * 50} y1="800"
            x2="200" y2={800 * 0.68}
            stroke="rgba(110,231,183,0.10)" strokeWidth="1" strokeDasharray="2 4"/>
        ))}
      </svg>
      {/* Scattered pixel stars */}
      {[[8, 12], [85, 8], [18, 22], [72, 18], [35, 9], [55, 32], [92, 28]].map(([x, y], i) => (
        <div key={i} style={{
          position: 'absolute', left: `${x}%`, top: `${y}%`,
          width: 2, height: 2, background: '#6ee7b7', boxShadow: '0 0 4px #6ee7b7',
          opacity: 0.7,
          animation: `ay-twinkle ${2 + i * 0.4}s ease-in-out ${i * 0.2}s infinite`,
        }}/>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// 1. Landing v3 — mascot hero
// ──────────────────────────────────────────────────────────
function LandingV3() {
  return (
    <div style={{
      width: 448, minHeight: 1800, position: 'relative',
      background: '#020306', color: '#e8efea',
      fontFamily: AYN.font.display,
      borderRadius: 28, overflow: 'hidden',
      border: '1px solid rgba(110,231,183,0.06)',
    }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: 720 }}>
        <MiniScene intensity={1.2}/>

        {/* Status bar */}
        <div style={{
          position: 'relative', zIndex: 5, padding: '16px 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: AYN.font.mono, fontSize: 11, color: 'rgba(232,239,234,0.55)',
        }}>
          <span>۱۰:۳۰</span>
          <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <span style={{ width: 14, height: 7, borderRadius: 2, border: '1px solid rgba(232,239,234,0.55)', position: 'relative' }}>
              <span style={{ position: 'absolute', inset: 1, width: '80%', background: '#6ee7b7', borderRadius: 1 }}/>
            </span>
          </span>
        </div>

        {/* Logo + menu */}
        <div style={{
          position: 'relative', zIndex: 5,
          padding: '8px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(16,185,129,0.14)', border: '1px solid rgba(110,231,183,0.32)',
              display: 'grid', placeItems: 'center',
              boxShadow: '0 0 20px rgba(52,211,153,0.25)',
            }}>
              <span style={{ fontWeight: 900, fontSize: 13, color: '#6ee7b7', letterSpacing: -0.5 }}>A-Y</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: -0.3 }}>ای‌وای</span>
          </div>
          <AYButton variant="ghost" size="sm">ورود</AYButton>
        </div>

        {/* Kicker + mascot */}
        <div style={{
          position: 'absolute', inset: 0, top: 90,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '0 24px',
        }}>
          <div style={{
            padding: '5px 12px', borderRadius: 999,
            background: 'rgba(16,185,129,0.14)', border: '1px solid rgba(110,231,183,0.3)',
            fontFamily: AYN.font.mono, fontSize: 10, letterSpacing: 2, color: '#6ee7b7',
            textTransform: 'uppercase', fontWeight: 700,
            marginBottom: 18,
          }}>
            راهنمای هوش مصنوعی شغلی
          </div>

          {/* Mascot with bubble */}
          <div style={{ position: 'relative', marginBottom: 28 }}>
            <PixelMascot scale={8} defaultState="idle" autoCycle={true} bubble="سلام! بزن روم 👋"/>
          </div>

          {/* Pixel ground */}
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 150,
            height: 12, background:
              `repeating-linear-gradient(90deg, rgba(52,211,153,0.35) 0 6px, transparent 6px 14px)`,
            opacity: 0.4,
          }}/>

          {/* Headline */}
          <h1 style={{
            margin: 0,
            fontFamily: AYN.font.display, fontWeight: 900,
            fontSize: 40, lineHeight: 1.05, letterSpacing: -1.2,
            textAlign: 'center',
            marginTop: 22,
          }}>
            از <span style={{ color: '#6ee7b7' }}>AI</span> نترس،<br/>
            ازش <span style={{
              background: 'linear-gradient(120deg, #6ee7b7 0%, #34d399 50%, #fcd34d 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>استفاده کن.</span>
          </h1>
          <p style={{
            margin: '14px 0 0', textAlign: 'center',
            fontSize: 14, color: 'rgba(232,239,234,0.65)', lineHeight: 1.7,
            maxWidth: 300,
          }}>
            یک دستیار پیکسلی و مهربون که می‌گه کدوم ابزار AI رو <strong style={{ color: '#e8efea' }}>برای شغل خودت</strong> یاد بگیری — قدم به قدم.
          </p>
        </div>

        {/* CTA */}
        <div style={{
          position: 'absolute', bottom: 30, left: 24, right: 24, zIndex: 5,
          display: 'flex', gap: 10,
        }}>
          <div style={{ flex: 1 }}>
            <AYButton variant="primary" size="lg" full iconEnd={<AYIcon name="arrow-l" size={16} color="#04110a"/>}>
              شروع رایگان
            </AYButton>
          </div>
          <AYButton variant="ghost" size="lg" iconStart={<AYIcon name="play" size={14} color="#6ee7b7"/>}>
            ۹۰ ثانیه
          </AYButton>
        </div>
      </div>

      {/* ── Section 2: How it works (3 steps with mini mascot beats) */}
      <div style={{ padding: '56px 24px 40px', background: 'linear-gradient(180deg, #020306, #05090a)' }}>
        <div style={{ fontFamily: AYN.font.mono, fontSize: 10, letterSpacing: 2, color: '#6ee7b7', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>
          چطور کار می‌کنه
        </div>
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 900, letterSpacing: -0.6, lineHeight: 1.15, marginBottom: 28 }}>
          سه قدم تا نقشهٔ<br/><span style={{ color: '#6ee7b7' }}>مسیر شخصی</span>.
        </h2>
        {[
          { n: '۰۱', title: 'معرفی کن', desc: 'شغل، صنعت، تجربه، چند تا مهارت. فقط ۳۰ ثانیه.', state: 'wave' },
          { n: '۰۲', title: 'تحلیل می‌شه', desc: 'موتور ما ابزارهای AI مرتبط با شغلت رو فیلتر می‌کنه.', state: 'sparkle' },
          { n: '۰۳', title: 'شروع کن', desc: 'یه نقشه‌راه ۴ هفته‌ای، دوره‌های فارسی، شغل‌های پیشنهادی.', state: 'bounce' },
        ].map((s, i) => (
          <div key={i} style={{
            display: 'flex', gap: 14, alignItems: 'flex-start',
            marginBottom: 18,
            padding: 16,
            background: 'linear-gradient(180deg, rgba(31,46,40,0.5) 0%, rgba(18,30,24,0.4) 100%)',
            border: '1px solid rgba(110,231,183,0.12)',
            borderRadius: 18,
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(110,231,183,0.22)',
              display: 'grid', placeItems: 'center', flexShrink: 0,
              position: 'relative', overflow: 'hidden',
            }}>
              <MascotArt state={s.state} frame={i * 2} blink={false} scale={2}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: AYN.font.mono, fontSize: 11, color: 'rgba(110,231,183,0.7)', fontWeight: 700 }}>{s.n}</span>
                <span style={{ fontWeight: 800, fontSize: 15 }}>{s.title}</span>
              </div>
              <div style={{ fontSize: 12.5, color: 'rgba(232,239,234,0.65)', lineHeight: 1.65 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Section 3: Social proof */}
      <div style={{ padding: '40px 24px 56px' }}>
        <div style={{
          padding: 20, borderRadius: 20,
          background: 'linear-gradient(180deg, rgba(245,158,11,0.08) 0%, rgba(18,30,24,0.5) 100%)',
          border: '1px solid rgba(251,191,36,0.25)',
        }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
            <div style={{
              padding: '4px 10px', borderRadius: 999,
              background: 'rgba(251,191,36,0.18)', border: '1px solid rgba(251,191,36,0.35)',
              fontFamily: AYN.font.mono, fontSize: 10, letterSpacing: 1.5, color: '#fcd34d', fontWeight: 700,
            }}>
              ۱۲٫۴ هزار کاربر فعال
            </div>
            <AYIcon name="star" size={16} color="#fcd34d" stroke={2}/>
            <span style={{ fontFamily: AYN.font.mono, fontSize: 12, color: '#fcd34d', fontWeight: 700 }}>۴٫۸</span>
          </div>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: '#e8efea' }}>
            «توی یه هفته از صفر با Claude بریف نوشتم، با v0 لندینگ ساختم. ای‌وای منو از <strong style={{ color: '#fcd34d' }}>ترس AI</strong> دراورد.»
          </p>
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #fcd34d, #f59e0b)',
              display: 'grid', placeItems: 'center',
              fontWeight: 900, fontSize: 13, color: '#451a03',
            }}>ن</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 12.5 }}>نگار رفیعی</div>
              <div style={{ fontSize: 10.5, color: 'rgba(232,239,234,0.5)' }}>طراح محصول · اسنپ</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div style={{ padding: '40px 24px 56px', borderTop: '1px solid rgba(110,231,183,0.08)', textAlign: 'center' }}>
        <MascotArt state="sparkle" frame={0} blink={false} scale={3}/>
        <div style={{ fontSize: 20, fontWeight: 800, marginTop: 14, letterSpacing: -0.3 }}>
          آماده‌ای؟
        </div>
        <div style={{ fontSize: 12.5, color: 'rgba(232,239,234,0.55)', marginTop: 6, marginBottom: 20 }}>
          بدون کارت اعتباری. تحلیل اولیه رایگانه.
        </div>
        <AYButton variant="primary" size="lg" full iconEnd={<AYIcon name="arrow-l" size={16} color="#04110a"/>}>
          شروع کن
        </AYButton>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// 2. ChatV2 — mascot avatar, active conversation, tool result
// ──────────────────────────────────────────────────────────
function ChatV2() {
  return (
    <div style={{
      width: 448, height: 900, position: 'relative',
      background: '#020306', color: '#e8efea',
      fontFamily: AYN.font.display,
      borderRadius: 28, overflow: 'hidden',
      border: '1px solid rgba(110,231,183,0.06)',
    }}>
      <MiniScene intensity={0.5}/>

      {/* Header */}
      <div style={{
        position: 'relative', zIndex: 5,
        padding: '18px 20px 14px',
        display: 'flex', alignItems: 'center', gap: 12,
        background: 'linear-gradient(180deg, rgba(2,3,6,0.9) 0%, rgba(2,3,6,0.0) 100%)',
        borderBottom: '1px solid rgba(110,231,183,0.08)',
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 11,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(110,231,183,0.12)',
          display: 'grid', placeItems: 'center',
        }}>
          <AYIcon name="chev-r" size={16} color="#e8efea"/>
        </div>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: 'rgba(16,185,129,0.14)', border: '1px solid rgba(110,231,183,0.28)',
          display: 'grid', placeItems: 'center',
          boxShadow: '0 0 16px rgba(52,211,153,0.2)',
          position: 'relative', overflow: 'hidden',
        }}>
          <MascotArt state="idle" frame={0} blink={false} scale={1.6}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: -0.2 }}>مسیریاب · ای‌وای</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399' }}/>
            <span style={{ fontFamily: AYN.font.mono, fontSize: 10.5, color: 'rgba(110,231,183,0.7)' }}>آنلاین · Claude Haiku</span>
          </div>
        </div>
        <AYIcon name="search" size={18} color="rgba(232,239,234,0.6)"/>
      </div>

      {/* Messages */}
      <div style={{
        position: 'absolute', top: 84, bottom: 90, left: 0, right: 0,
        overflow: 'auto', padding: '18px 18px 20px',
      }}>
        {/* Date chip */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <span style={{
            display: 'inline-block',
            padding: '3px 10px', borderRadius: 999,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(110,231,183,0.1)',
            fontFamily: AYN.font.mono, fontSize: 10, color: 'rgba(232,239,234,0.45)',
          }}>
            امروز · ۱۰:۳۲
          </span>
        </div>

        {/* User message */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          <div style={{
            maxWidth: '78%', padding: '11px 14px',
            background: 'linear-gradient(180deg, rgba(16,185,129,0.22) 0%, rgba(16,185,129,0.14) 100%)',
            border: '1px solid rgba(110,231,183,0.32)',
            borderRadius: '16px 16px 4px 16px',
            fontSize: 13.5, lineHeight: 1.65, color: '#e8efea',
          }}>
            سلام. طراح محصولم، می‌خوام با AI سریع‌تر پروتوتایپ بسازم. از کجا شروع کنم؟
          </div>
        </div>

        {/* Mascot message */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 14 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'rgba(16,185,129,0.14)', border: '1px solid rgba(110,231,183,0.28)',
            display: 'grid', placeItems: 'center', flexShrink: 0, overflow: 'hidden',
          }}>
            <MascotArt state="idle" frame={4} blink={false} scale={1.2}/>
          </div>
          <div style={{
            maxWidth: '78%', padding: '11px 14px',
            background: 'linear-gradient(180deg, rgba(31,46,40,0.85) 0%, rgba(18,30,24,0.75) 100%)',
            border: '1px solid rgba(110,231,183,0.14)',
            borderRadius: '16px 16px 16px 4px',
            fontSize: 13.5, lineHeight: 1.65,
          }}>
            آوکی! برای طراح محصول، من <strong style={{ color: '#6ee7b7' }}>سه ابزار</strong> رو پیشنهاد می‌کنم. بذار تحلیل کنم…
          </div>
        </div>

        {/* Tool card result */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 14 }}>
          <div style={{ width: 32, flexShrink: 0 }}/>
          <div style={{
            flex: 1,
            padding: 14, borderRadius: 16,
            background: 'linear-gradient(180deg, rgba(139,92,246,0.14) 0%, rgba(21,21,31,0.6) 100%)',
            border: '1px solid rgba(167,139,250,0.3)',
            boxShadow: '0 0 0 1px rgba(167,139,250,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{
                width: 24, height: 24, borderRadius: 7,
                background: 'rgba(167,139,250,0.22)', border: '1px solid rgba(167,139,250,0.4)',
                display: 'grid', placeItems: 'center',
              }}>
                <AYIcon name="bolt" size={12} color="#c4b5fd" stroke={2}/>
              </div>
              <span style={{ fontFamily: AYN.font.mono, fontSize: 10, letterSpacing: 1.5, color: '#c4b5fd', fontWeight: 700, textTransform: 'uppercase' }}>
                ابزار · analyze_profile
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(232,239,234,0.7)', lineHeight: 1.6, marginBottom: 12 }}>
              شغل: طراح محصول · سطح: متوسط · ساعت آزاد: ۶ در هفته
            </div>

            {/* 3 tool cards */}
            {[
              { n: 'Claude', d: 'بریف، پژوهش، خلاصه', level: '۹۵٪', tone: '#6ee7b7' },
              { n: 'v0',     d: 'وایرفریم → کد تمیز', level: '۸۸٪', tone: '#6ee7b7' },
              { n: 'Cursor', d: 'همکاری با توسعه‌دهنده', level: '۷۲٪', tone: '#fcd34d' },
            ].map((t, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 12,
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(110,231,183,0.10)',
                marginBottom: 6,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(110,231,183,0.2)',
                  display: 'grid', placeItems: 'center',
                  fontFamily: AYN.font.display, fontWeight: 900, fontSize: 11, color: '#6ee7b7',
                }}>
                  {t.n.slice(0, 2)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{t.n}</div>
                  <div style={{ fontSize: 10.5, color: 'rgba(232,239,234,0.55)' }}>{t.d}</div>
                </div>
                <div style={{
                  fontFamily: AYN.font.mono, fontSize: 12, fontWeight: 800, color: t.tone,
                  padding: '2px 8px', borderRadius: 999,
                  background: t.tone === '#fcd34d' ? 'rgba(251,191,36,0.12)' : 'rgba(52,211,153,0.14)',
                  border: `1px solid ${t.tone}44`,
                }}>{t.level}</div>
              </div>
            ))}

            <div style={{ marginTop: 10 }}>
              <AYButton variant="secondary" size="sm" iconEnd={<AYIcon name="arrow-l" size={12} color="#e8efea"/>}>
                نقشه‌راه کامل
              </AYButton>
            </div>
          </div>
        </div>

        {/* Typing indicator */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'rgba(16,185,129,0.14)', border: '1px solid rgba(110,231,183,0.28)',
            display: 'grid', placeItems: 'center', flexShrink: 0, overflow: 'hidden',
          }}>
            <MascotArt state="idle" frame={2} blink={false} scale={1.2}/>
          </div>
          <div style={{
            padding: '12px 16px',
            background: 'rgba(31,46,40,0.7)',
            border: '1px solid rgba(110,231,183,0.14)',
            borderRadius: '16px 16px 16px 4px',
            display: 'flex', gap: 4,
          }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                width: 6, height: 6, borderRadius: '50%', background: '#6ee7b7',
                animation: `ay-typing 1.2s ease-in-out ${i * 0.15}s infinite`,
              }}/>
            ))}
          </div>
        </div>
      </div>

      {/* Composer */}
      <div style={{
        position: 'absolute', bottom: 16, left: 14, right: 14,
        padding: 6, borderRadius: 20,
        background: 'linear-gradient(180deg, rgba(31,46,40,0.9) 0%, rgba(18,30,24,0.85) 100%)',
        backdropFilter: 'blur(18px) saturate(160%)',
        border: '1px solid rgba(110,231,183,0.24)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.55)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 14, flexShrink: 0,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(110,231,183,0.12)',
            display: 'grid', placeItems: 'center',
          }}>
            <AYIcon name="plus" size={17} color="rgba(232,239,234,0.7)"/>
          </div>
          <div style={{ flex: 1, padding: '10px 6px', fontSize: 13.5, color: 'rgba(232,239,234,0.4)' }}>
            بپرس…
            <span style={{ display: 'inline-block', width: 2, height: 14, background: '#34d399', marginInlineStart: 4, verticalAlign: 'middle', animation: 'ay-caret 1s steps(2) infinite' }}/>
          </div>
          <div style={{
            width: 40, height: 40, borderRadius: 14,
            background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
            display: 'grid', placeItems: 'center', flexShrink: 0,
            boxShadow: '0 4px 16px rgba(52,211,153,0.35)',
          }}>
            <AYIcon name="send" size={16} color="#04110a" stroke={2.2}/>
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// 3. GamesScreen — pixel-game gallery
// ──────────────────────────────────────────────────────────
function GamesScreen() {
  const games = [
    {
      title: 'ماجراجویی شغلی',
      sub: 'در دنیای پیکسلی، با ابزار‌های AI به ماموریت‌ها برو.',
      badge: 'جدید', badgeTone: '#6ee7b7',
      progress: 0.25,
      level: '۳/۱۲',
      color: '#10b981',
      mascotState: 'wave',
    },
    {
      title: 'مسابقهٔ ابزارها',
      sub: 'سناریو بده، درست‌ترین AI رو انتخاب کن. با ساعت.',
      badge: 'محبوب', badgeTone: '#fcd34d',
      progress: 0.65,
      level: '۸/۱۲',
      color: '#eab308',
      mascotState: 'sparkle',
    },
    {
      title: 'شبیه‌ساز مصاحبه',
      sub: 'مصاحبهٔ شغلی با AI، و می‌بینی کجا گیر می‌کنی.',
      badge: 'حرفه‌ای', badgeTone: '#c4b5fd',
      progress: 0.1,
      level: '۱/۱۰',
      color: '#8b5cf6',
      mascotState: 'surprise',
    },
  ];

  return (
    <div style={{
      width: 448, height: 900, position: 'relative',
      background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(16,185,129,0.10), transparent 60%), #020306',
      color: '#e8efea', fontFamily: AYN.font.display,
      borderRadius: 28, overflow: 'hidden',
      border: '1px solid rgba(110,231,183,0.06)',
    }}>
      {/* Header */}
      <div style={{ padding: '22px 20px 8px', position: 'relative', zIndex: 5 }}>
        <div style={{ fontFamily: AYN.font.mono, fontSize: 10, letterSpacing: 2, color: '#6ee7b7', textTransform: 'uppercase', fontWeight: 700 }}>
          بازی‌ها
        </div>
        <h2 style={{ margin: '6px 0 0', fontSize: 26, fontWeight: 900, letterSpacing: -0.6, lineHeight: 1.1 }}>
          یاد بگیر،<br/><span style={{ color: '#6ee7b7' }}>بازی کن.</span>
        </h2>
      </div>

      {/* Streak banner */}
      <div style={{
        margin: '14px 20px 16px',
        padding: '12px 16px',
        borderRadius: 16,
        background: 'linear-gradient(135deg, rgba(251,191,36,0.16) 0%, rgba(245,158,11,0.08) 100%)',
        border: '1px solid rgba(251,191,36,0.3)',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'rgba(251,191,36,0.22)', border: '1px solid rgba(251,191,36,0.4)',
          display: 'grid', placeItems: 'center',
        }}>
          <div style={{ fontSize: 22 }}>🔥</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: AYN.font.mono, fontSize: 22, fontWeight: 900, color: '#fcd34d' }}>{AY_FA('۷')}</span>
            <span style={{ fontSize: 12.5, color: 'rgba(232,239,234,0.8)', fontWeight: 600 }}>روز پشت سر هم</span>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(232,239,234,0.6)', marginTop: 2 }}>
            امروز ۱۰ دقیقه بازی کن تا استریک نشکنه.
          </div>
        </div>
        <div style={{
          padding: '5px 10px', borderRadius: 999,
          background: 'rgba(251,191,36,0.22)', border: '1px solid rgba(251,191,36,0.4)',
          fontFamily: AYN.font.mono, fontSize: 10, color: '#fcd34d', fontWeight: 700, letterSpacing: 1,
        }}>
          +۵۰ XP
        </div>
      </div>

      {/* Games list */}
      <div style={{ padding: '4px 20px', overflowY: 'auto', maxHeight: 560 }}>
        {games.map((g, i) => (
          <div key={i} style={{
            position: 'relative',
            padding: 16,
            borderRadius: 20,
            background: 'linear-gradient(180deg, rgba(31,46,40,0.6) 0%, rgba(18,30,24,0.5) 100%)',
            border: `1px solid ${g.color}33`,
            marginBottom: 12,
            overflow: 'hidden',
          }}>
            {/* Pixel scene thumb */}
            <div style={{
              position: 'relative',
              height: 96,
              borderRadius: 14,
              background: `linear-gradient(180deg, ${g.color}22 0%, rgba(2,3,6,0.9) 100%)`,
              border: `1px solid ${g.color}44`,
              marginBottom: 12,
              overflow: 'hidden',
            }}>
              {/* Stars */}
              {[[15, 20], [80, 15], [30, 40], [70, 35]].map(([x, y], j) => (
                <div key={j} style={{
                  position: 'absolute', left: `${x}%`, top: `${y}%`,
                  width: 2, height: 2, background: g.color, boxShadow: `0 0 4px ${g.color}`, opacity: 0.7,
                  animation: `ay-twinkle ${2 + j * 0.4}s ease-in-out ${j * 0.2}s infinite`,
                }}/>
              ))}
              {/* Horizon */}
              <div style={{
                position: 'absolute', left: 0, right: 0, bottom: 18,
                height: 1, background: `linear-gradient(90deg, transparent, ${g.color}, transparent)`, opacity: 0.5,
              }}/>
              {/* Ground pattern */}
              <div style={{
                position: 'absolute', left: 0, right: 0, bottom: 0, height: 18,
                background: `repeating-linear-gradient(90deg, ${g.color}33 0 6px, transparent 6px 14px)`,
              }}/>
              {/* Mascot center */}
              <div style={{ position: 'absolute', left: '50%', bottom: 16, transform: 'translateX(-50%)' }}>
                <MascotArt state={g.mascotState} frame={i * 3} blink={false} scale={2.2} accent={g.color}/>
              </div>
              {/* Badge */}
              <div style={{
                position: 'absolute', top: 8, insetInlineStart: 8,
                padding: '3px 8px', borderRadius: 999,
                background: `${g.badgeTone}22`, border: `1px solid ${g.badgeTone}66`,
                fontFamily: AYN.font.mono, fontSize: 9, letterSpacing: 1, color: g.badgeTone, fontWeight: 700, textTransform: 'uppercase',
              }}>
                {g.badge}
              </div>
              {/* Level */}
              <div style={{
                position: 'absolute', top: 8, insetInlineEnd: 8,
                fontFamily: AYN.font.mono, fontSize: 10, color: 'rgba(232,239,234,0.75)', fontWeight: 700,
                padding: '3px 8px', borderRadius: 999, background: 'rgba(0,0,0,0.35)',
              }}>
                {g.level}
              </div>
            </div>

            {/* Title + sub */}
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 3 }}>{g.title}</div>
            <div style={{ fontSize: 12, color: 'rgba(232,239,234,0.6)', lineHeight: 1.55, marginBottom: 10 }}>{g.sub}</div>

            {/* Progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${g.progress * 100}%`,
                  background: `linear-gradient(90deg, ${g.color}, ${g.color}aa)`,
                  boxShadow: `0 0 8px ${g.color}88`,
                }}/>
              </div>
              <div style={{
                padding: '6px 12px', borderRadius: 10,
                background: `${g.color}22`, border: `1px solid ${g.color}66`,
                fontFamily: AYN.font.display, fontSize: 11.5, fontWeight: 800, color: g.color,
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <AYIcon name="play" size={11} color={g.color}/>
                ادامه
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* BottomNav */}
      <BottomNav4 active="home"/>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// 4. AdminConsole — internal dashboard
// ──────────────────────────────────────────────────────────
function AdminConsole() {
  const metrics = [
    { k: 'کاربران فعال', v: AY_FA('۱۲٫۴K'), d: '+۸٫۲٪', tone: '#6ee7b7' },
    { k: 'اشتراک فعال',  v: AY_FA('۲٫۸K'),  d: '+۱۲٪',  tone: '#6ee7b7' },
    { k: 'درآمد ماه',    v: 'T ۲۸۰M',       d: '+۱۹٪',  tone: '#fcd34d' },
    { k: 'نرخ حذف',      v: '۳٫۲٪',          d: '-۰٫۸٪', tone: '#6ee7b7' },
  ];
  const alerts = [
    { sev: 'critical', msg: 'نرخ خطای /chat از ۲٪ رد شد.', t: 'همین الان', src: 'Sentry' },
    { sev: 'warn',     msg: 'مصرف Claude API نزدیک سقف ماه.', t: '۱۸ دقیقه', src: 'Anthropic' },
    { sev: 'info',     msg: 'فایل CSV آپلود ۱۲۲ کاربر تموم شد.', t: '۱ ساعت', src: 'Import' },
  ];
  const sevColors = {
    critical: { bg: 'rgba(248,113,113,0.14)', bd: 'rgba(248,113,113,0.4)', fg: '#fca5a5', dot: '#f87171' },
    warn:     { bg: 'rgba(251,191,36,0.14)',  bd: 'rgba(251,191,36,0.38)', fg: '#fcd34d', dot: '#eab308' },
    info:     { bg: 'rgba(167,139,250,0.14)', bd: 'rgba(167,139,250,0.38)', fg: '#c4b5fd', dot: '#8b5cf6' },
  };

  return (
    <div style={{
      width: 448, height: 900, position: 'relative',
      background: '#020306', color: '#e8efea', fontFamily: AYN.font.display,
      borderRadius: 28, overflow: 'hidden',
      border: '1px solid rgba(110,231,183,0.06)',
    }}>
      {/* Header with admin tag */}
      <div style={{
        padding: '22px 20px 14px', borderBottom: '1px solid rgba(110,231,183,0.08)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          padding: '4px 10px', borderRadius: 8,
          background: 'rgba(248,113,113,0.14)', border: '1px solid rgba(248,113,113,0.36)',
          fontFamily: AYN.font.mono, fontSize: 10, letterSpacing: 1.5, color: '#fca5a5', fontWeight: 700, textTransform: 'uppercase',
        }}>
          ADMIN
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 15 }}>کنسول مدیریت</div>
          <div style={{ fontFamily: AYN.font.mono, fontSize: 10.5, color: 'rgba(232,239,234,0.5)', marginTop: 1 }}>
            e.niaki@a-y.ir
          </div>
        </div>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(110,231,183,0.12)',
          display: 'grid', placeItems: 'center',
        }}>
          <AYIcon name="bell" size={14} color="rgba(232,239,234,0.7)"/>
          <span style={{ position: 'absolute', width: 8, height: 8, borderRadius: '50%', background: '#f87171', boxShadow: '0 0 6px #f87171', transform: 'translate(-10px, -10px)' }}/>
        </div>
      </div>

      {/* Metrics grid */}
      <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{
            padding: 14,
            background: 'linear-gradient(180deg, rgba(31,46,40,0.55) 0%, rgba(18,30,24,0.45) 100%)',
            border: '1px solid rgba(110,231,183,0.12)',
            borderRadius: 14,
          }}>
            <div style={{ fontFamily: AYN.font.mono, fontSize: 10, letterSpacing: 1.2, color: 'rgba(232,239,234,0.55)', textTransform: 'uppercase' }}>
              {m.k}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
              <span style={{ fontFamily: AYN.font.display, fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>{m.v}</span>
              <span style={{ fontFamily: AYN.font.mono, fontSize: 10.5, color: m.tone, fontWeight: 700 }}>{m.d}</span>
            </div>
            {/* Mini sparkline */}
            <svg width="100%" height="18" viewBox="0 0 100 18" style={{ marginTop: 6 }}>
              <polyline
                points={[2, 14, 15, 10, 28, 12, 42, 6, 55, 8, 68, 4, 82, 7, 95, 3].reduce((a, v, j) => j % 2 === 0 ? a + `${v},` : a + `${v} `, '')}
                fill="none" stroke={m.tone} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Activity chart (placeholder bars) */}
      <div style={{ padding: '4px 20px' }}>
        <div style={{
          padding: 14, borderRadius: 14,
          background: 'linear-gradient(180deg, rgba(31,46,40,0.55) 0%, rgba(18,30,24,0.45) 100%)',
          border: '1px solid rgba(110,231,183,0.12)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ fontFamily: AYN.font.mono, fontSize: 10, letterSpacing: 1.2, color: 'rgba(232,239,234,0.55)', textTransform: 'uppercase' }}>
                فعالیت · ۷ روز اخیر
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, marginTop: 3 }}>پیام‌های چت</div>
            </div>
            <div style={{
              padding: '3px 8px', borderRadius: 6,
              background: 'rgba(52,211,153,0.14)', border: '1px solid rgba(52,211,153,0.3)',
              fontFamily: AYN.font.mono, fontSize: 10, color: '#6ee7b7', fontWeight: 700,
            }}>
              +۲۲٪
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
            {[40, 55, 48, 70, 62, 85, 92].map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: '100%', height: `${h}%`, borderRadius: '6px 6px 2px 2px',
                  background: `linear-gradient(180deg, ${i === 6 ? '#34d399' : 'rgba(52,211,153,0.65)'} 0%, rgba(52,211,153,0.15) 100%)`,
                  border: '1px solid rgba(110,231,183,0.24)',
                  boxShadow: i === 6 ? '0 0 12px rgba(52,211,153,0.4)' : 'none',
                }}/>
                <div style={{ fontFamily: AYN.font.mono, fontSize: 9, color: 'rgba(232,239,234,0.4)' }}>
                  {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'][i]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div style={{ padding: '12px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <div style={{ fontFamily: AYN.font.mono, fontSize: 10, letterSpacing: 2, color: '#6ee7b7', textTransform: 'uppercase', fontWeight: 700 }}>
            هشدارها · {AY_FA('۳')}
          </div>
          <span style={{ fontSize: 11, color: '#6ee7b7', fontWeight: 700 }}>همه</span>
        </div>
        {alerts.map((a, i) => {
          const c = sevColors[a.sev];
          return (
            <div key={i} style={{
              display: 'flex', gap: 12, alignItems: 'flex-start',
              padding: '12px 14px',
              background: c.bg, border: `1px solid ${c.bd}`,
              borderRadius: 12, marginBottom: 8,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%', background: c.dot,
                boxShadow: `0 0 8px ${c.dot}`, marginTop: 5, flexShrink: 0,
              }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: '#e8efea', lineHeight: 1.5 }}>{a.msg}</div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 4 }}>
                  <span style={{ fontFamily: AYN.font.mono, fontSize: 10, color: c.fg, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{a.src}</span>
                  <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(232,239,234,0.3)' }}/>
                  <span style={{ fontFamily: AYN.font.mono, fontSize: 10.5, color: 'rgba(232,239,234,0.5)' }}>{a.t}</span>
                </div>
              </div>
              <AYIcon name="chev-l" size={14} color="rgba(232,239,234,0.4)"/>
            </div>
          );
        })}
      </div>

      {/* Admin tabs at bottom */}
      <div style={{
        position: 'absolute', bottom: 16, left: 16, right: 16, zIndex: 40,
        height: 58, padding: '0 4px', borderRadius: 18,
        background: 'rgba(7,12,11,0.9)',
        border: '1px solid rgba(110,231,183,0.14)',
        backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      }}>
        {[
          { icon: 'grid', label: 'داشبورد', on: true },
          { icon: 'user', label: 'کاربران' },
          { icon: 'crown', label: 'اشتراک' },
          { icon: 'file', label: 'گزارش' },
        ].map((it, i) => (
          <div key={i} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            position: 'relative', padding: '6px 0',
          }}>
            {it.on && <span style={{
              position: 'absolute', top: 2, width: 22, height: 2.5, borderRadius: 2,
              background: '#34d399', boxShadow: '0 0 8px #34d399',
            }}/>}
            <AYIcon name={it.icon} size={18} color={it.on ? '#34d399' : 'rgba(232,239,234,0.5)'} stroke={it.on ? 2 : 1.7}/>
            <span style={{ fontSize: 10, fontWeight: it.on ? 800 : 500, color: it.on ? '#e8efea' : 'rgba(232,239,234,0.5)' }}>
              {it.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// 5. CoursesV2 — redesigned courses with mascot empty-hint
// ──────────────────────────────────────────────────────────
function CoursesV2() {
  const courses = [
    { title: 'Claude از صفر تا پروژه', teacher: 'نگار رفیعی', dur: '۲ ساعت ۱۰ د', lvl: 'مبتدی', progress: 0.75, pro: false, color: '#6ee7b7' },
    { title: 'v0 — لندینگ در یک روز', teacher: 'علی صالحی', dur: '۱ ساعت ۴۵ د', lvl: 'متوسط', progress: 0.3, pro: false, color: '#6ee7b7' },
    { title: 'Cursor برای طراح', teacher: 'ارشیا رضایی', dur: '۳ ساعت', lvl: 'متوسط', progress: 0, pro: true, color: '#fcd34d' },
    { title: 'پرومت‌نویسی حرفه‌ای', teacher: 'مریم احمدی', dur: '۱ ساعت ۲۰ د', lvl: 'حرفه‌ای', progress: 0, pro: true, color: '#fcd34d' },
  ];
  return (
    <div style={{
      width: 448, height: 900, position: 'relative',
      background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(16,185,129,0.10), transparent 60%), #020306',
      color: '#e8efea', fontFamily: AYN.font.display,
      borderRadius: 28, overflow: 'hidden',
      border: '1px solid rgba(110,231,183,0.06)',
    }}>
      {/* Header */}
      <div style={{ padding: '22px 20px 10px' }}>
        <div style={{ fontFamily: AYN.font.mono, fontSize: 10, letterSpacing: 2, color: '#6ee7b7', textTransform: 'uppercase', fontWeight: 700 }}>
          دوره‌ها
        </div>
        <h2 style={{ margin: '6px 0 0', fontSize: 26, fontWeight: 900, letterSpacing: -0.6, lineHeight: 1.1 }}>
          یاد بگیر <span style={{ color: '#6ee7b7' }}>به فارسی.</span>
        </h2>
        <p style={{ margin: '6px 0 0', fontSize: 12.5, color: 'rgba(232,239,234,0.6)', lineHeight: 1.65 }}>
          ۴۸ دورهٔ تخصصی، از Claude تا Cursor. هر دوره زیر ۳ ساعت.
        </p>
      </div>

      {/* In-progress banner with mascot */}
      <div style={{
        margin: '14px 20px 10px',
        padding: 14,
        borderRadius: 18,
        background: 'linear-gradient(135deg, rgba(16,185,129,0.14) 0%, rgba(18,30,24,0.6) 100%)',
        border: '1px solid rgba(110,231,183,0.28)',
        display: 'flex', gap: 12, alignItems: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          width: 58, height: 58, borderRadius: 14,
          background: 'rgba(16,185,129,0.22)', border: '1px solid rgba(110,231,183,0.4)',
          display: 'grid', placeItems: 'center', flexShrink: 0, overflow: 'hidden',
        }}>
          <MascotArt state="bounce" frame={2} blink={false} scale={2.2}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: AYN.font.mono, fontSize: 10, letterSpacing: 1.2, color: '#6ee7b7', textTransform: 'uppercase', fontWeight: 700 }}>
            در حال یادگیری
          </div>
          <div style={{ fontWeight: 800, fontSize: 14, marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Claude از صفر تا پروژه
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: '75%', height: '100%', background: 'linear-gradient(90deg, #34d399, #10b981)', boxShadow: '0 0 6px #34d399' }}/>
            </div>
            <span style={{ fontFamily: AYN.font.mono, fontSize: 10.5, color: '#6ee7b7', fontWeight: 700 }}>{AY_FA('۷۵٪')}</span>
          </div>
        </div>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: 'linear-gradient(135deg, #34d399, #10b981)',
          display: 'grid', placeItems: 'center', flexShrink: 0,
          boxShadow: '0 4px 16px rgba(52,211,153,0.4)',
        }}>
          <AYIcon name="play" size={15} color="#04110a" stroke={2}/>
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ padding: '8px 20px', display: 'flex', gap: 7, overflowX: 'auto' }}>
        {['همه', 'مبتدی', 'متوسط', 'حرفه‌ای', 'رایگان', 'ویژه'].map((f, i) => (
          <div key={i} style={{
            flexShrink: 0,
            padding: '6px 12px', borderRadius: 999,
            background: i === 0 ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${i === 0 ? 'rgba(110,231,183,0.4)' : 'rgba(110,231,183,0.12)'}`,
            fontSize: 11.5, fontWeight: 700,
            color: i === 0 ? '#6ee7b7' : 'rgba(232,239,234,0.7)',
          }}>
            {f}
          </div>
        ))}
      </div>

      {/* Course cards */}
      <div style={{ padding: '8px 20px 110px', overflowY: 'auto', maxHeight: 440 }}>
        {courses.map((c, i) => (
          <div key={i} style={{
            display: 'flex', gap: 12,
            padding: 12,
            borderRadius: 16,
            background: 'linear-gradient(180deg, rgba(31,46,40,0.55) 0%, rgba(18,30,24,0.45) 100%)',
            border: c.pro ? '1px solid rgba(251,191,36,0.25)' : '1px solid rgba(110,231,183,0.12)',
            marginBottom: 10, position: 'relative', overflow: 'hidden',
          }}>
            {/* Thumb */}
            <div style={{
              width: 72, height: 72, borderRadius: 12, flexShrink: 0,
              background: `linear-gradient(135deg, ${c.color}33 0%, rgba(2,3,6,0.9) 100%)`,
              border: `1px solid ${c.color}44`,
              position: 'relative', overflow: 'hidden',
              display: 'grid', placeItems: 'center',
            }}>
              <div style={{
                fontFamily: AYN.font.mono, fontSize: 9, letterSpacing: 1, color: c.color, fontWeight: 800,
                textTransform: 'uppercase',
                position: 'absolute', bottom: 6, insetInlineStart: 6,
              }}>
                {c.title.split(' ')[0]}
              </div>
              <AYIcon name={c.pro ? 'crown' : 'book'} size={22} color={c.color} stroke={1.6}/>
              {c.progress > 0 && !c.pro && (
                <div style={{
                  position: 'absolute', left: 0, right: 0, bottom: 0,
                  height: 3, background: 'rgba(0,0,0,0.5)',
                }}>
                  <div style={{
                    width: `${c.progress * 100}%`, height: '100%',
                    background: c.color, boxShadow: `0 0 6px ${c.color}`,
                  }}/>
                </div>
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                {c.pro && (
                  <span style={{
                    padding: '2px 7px', borderRadius: 6,
                    background: 'linear-gradient(90deg, #fcd34d, #eab308)', color: '#451a03',
                    fontFamily: AYN.font.mono, fontSize: 9, letterSpacing: 0.5, fontWeight: 800, textTransform: 'uppercase',
                  }}>
                    PRO
                  </span>
                )}
                <span style={{
                  padding: '2px 7px', borderRadius: 6,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(110,231,183,0.14)',
                  fontFamily: AYN.font.mono, fontSize: 9, color: 'rgba(232,239,234,0.65)', fontWeight: 700,
                }}>
                  {c.lvl}
                </span>
              </div>
              <div style={{ fontWeight: 800, fontSize: 13.5, lineHeight: 1.4 }}>{c.title}</div>
              <div style={{ fontSize: 11, color: 'rgba(232,239,234,0.55)', marginTop: 3, display: 'flex', gap: 8, alignItems: 'center' }}>
                <span>{c.teacher}</span>
                <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(232,239,234,0.3)' }}/>
                <span style={{ fontFamily: AYN.font.mono }}>{c.dur}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNav4 active="home"/>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// 6. JobsV2 — redesigned jobs feed with match gauges
// ──────────────────────────────────────────────────────────
function JobsV2() {
  const jobs = [
    { co: 'اسنپ', role: 'طراح محصول ارشد · AI', loc: 'تهران · دورکاری', salary: '۶۰-۸۵M', match: 92, tags: ['Claude', 'Figma', 'v0'], logo: 'س' },
    { co: 'کافه‌بازار', role: 'Product Designer با AI', loc: 'تهران · حضوری', salary: '۴۵-۶۵M', match: 78, tags: ['Figma', 'Claude'], logo: 'ک' },
    { co: 'دیجی‌کالا', role: 'Senior UX · AI Assist', loc: 'تهران · هیبرید', salary: '۷۰-۹۵M', match: 64, tags: ['Figma', 'v0', 'Framer'], logo: 'د' },
  ];

  return (
    <div style={{
      width: 448, height: 900, position: 'relative',
      background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(16,185,129,0.10), transparent 60%), #020306',
      color: '#e8efea', fontFamily: AYN.font.display,
      borderRadius: 28, overflow: 'hidden',
      border: '1px solid rgba(110,231,183,0.06)',
    }}>
      {/* Header */}
      <div style={{ padding: '22px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: AYN.font.mono, fontSize: 10, letterSpacing: 2, color: '#6ee7b7', textTransform: 'uppercase', fontWeight: 700 }}>
            شغل‌ها
          </div>
          <h2 style={{ margin: '6px 0 0', fontSize: 26, fontWeight: 900, letterSpacing: -0.6, lineHeight: 1.1 }}>
            شغل‌های <span style={{ color: '#6ee7b7' }}>مناسب.</span>
          </h2>
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(110,231,183,0.14)',
          display: 'grid', placeItems: 'center',
        }}>
          <AYIcon name="search" size={16} color="#6ee7b7"/>
        </div>
      </div>

      {/* Stat banner */}
      <div style={{
        margin: '12px 20px 14px',
        padding: '12px 14px',
        borderRadius: 14,
        background: 'rgba(16,185,129,0.08)',
        border: '1px solid rgba(110,231,183,0.22)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <AYIcon name="target" size={18} color="#6ee7b7" stroke={1.8}/>
        <div style={{ flex: 1, fontSize: 12, color: 'rgba(232,239,234,0.8)', lineHeight: 1.55 }}>
          <strong style={{ color: '#6ee7b7' }}>۳۴ شغل</strong> با پروفایلت مچ شدن — بر اساس مهارت، تجربه و شهر.
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ padding: '0 20px', display: 'flex', gap: 7, overflowX: 'auto', marginBottom: 8 }}>
        {['بالاترین تطابق', 'دورکاری', 'ارشد', 'تهران', '۵۰M+'].map((f, i) => (
          <div key={i} style={{
            flexShrink: 0,
            padding: '6px 12px', borderRadius: 999,
            background: i === 0 ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${i === 0 ? 'rgba(110,231,183,0.4)' : 'rgba(110,231,183,0.12)'}`,
            fontSize: 11.5, fontWeight: 700,
            color: i === 0 ? '#6ee7b7' : 'rgba(232,239,234,0.7)',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            {i === 0 && <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#6ee7b7' }}/>}
            {f}
          </div>
        ))}
      </div>

      {/* Job cards */}
      <div style={{ padding: '8px 20px 110px', overflowY: 'auto', maxHeight: 540 }}>
        {jobs.map((j, i) => {
          const matchColor = j.match >= 85 ? '#34d399' : j.match >= 70 ? '#fcd34d' : '#c4b5fd';
          return (
            <div key={i} style={{
              padding: 14, borderRadius: 16,
              background: 'linear-gradient(180deg, rgba(31,46,40,0.6) 0%, rgba(18,30,24,0.5) 100%)',
              border: '1px solid rgba(110,231,183,0.14)',
              marginBottom: 10,
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 12,
                  background: 'linear-gradient(135deg, rgba(52,211,153,0.22), rgba(16,185,129,0.1))',
                  border: '1px solid rgba(110,231,183,0.3)',
                  display: 'grid', placeItems: 'center', flexShrink: 0,
                  fontFamily: AYN.font.display, fontWeight: 900, fontSize: 18, color: '#6ee7b7',
                }}>
                  {j.logo}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 13.5, lineHeight: 1.4 }}>{j.role}</div>
                  <div style={{ fontSize: 11.5, color: 'rgba(232,239,234,0.6)', marginTop: 3, display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ color: '#e8efea', fontWeight: 700 }}>{j.co}</span>
                    <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(232,239,234,0.3)' }}/>
                    <span>{j.loc}</span>
                  </div>
                </div>
                {/* Match gauge */}
                <div style={{
                  position: 'relative', width: 44, height: 44, flexShrink: 0,
                }}>
                  <svg width="44" height="44" viewBox="0 0 44 44">
                    <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4"/>
                    <circle cx="22" cy="22" r="18" fill="none" stroke={matchColor} strokeWidth="4" strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 18}
                      strokeDashoffset={2 * Math.PI * 18 * (1 - j.match / 100)}
                      transform="rotate(-90 22 22)"
                      style={{ filter: `drop-shadow(0 0 4px ${matchColor}88)` }}
                    />
                  </svg>
                  <div style={{
                    position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
                    fontFamily: AYN.font.mono, fontSize: 11, fontWeight: 800, color: matchColor,
                  }}>
                    {AY_FA(String(j.match))}
                  </div>
                </div>
              </div>

              {/* Meta row */}
              <div style={{
                display: 'flex', gap: 8, marginTop: 12, paddingTop: 12,
                borderTop: '1px solid rgba(110,231,183,0.08)',
                alignItems: 'center', flexWrap: 'wrap',
              }}>
                <span style={{
                  padding: '3px 8px', borderRadius: 8,
                  background: 'rgba(52,211,153,0.14)', border: '1px solid rgba(52,211,153,0.3)',
                  fontFamily: AYN.font.mono, fontSize: 10, color: '#6ee7b7', fontWeight: 700,
                }}>
                  {j.salary}T
                </span>
                {j.tags.map((t, k) => (
                  <span key={k} style={{
                    padding: '3px 8px', borderRadius: 8,
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(110,231,183,0.14)',
                    fontFamily: AYN.font.mono, fontSize: 10, color: 'rgba(232,239,234,0.7)', fontWeight: 600,
                  }}>
                    {t}
                  </span>
                ))}
                <div style={{ marginInlineStart: 'auto' }}>
                  <AYIcon name="arrow-l" size={14} color="#6ee7b7"/>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <BottomNav4 active="home"/>
    </div>
  );
}

// Expose
window.LandingV3 = LandingV3;
window.ChatV2 = ChatV2;
window.GamesScreen = GamesScreen;
window.AdminConsole = AdminConsole;
window.CoursesV2 = CoursesV2;
window.JobsV2 = JobsV2;
