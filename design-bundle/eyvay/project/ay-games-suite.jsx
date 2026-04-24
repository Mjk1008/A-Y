// Games Suite — 4 games × 4 screens (Intro, Gameplay chrome, Result, Leaderboard)
// Matches real repo games: Snake, 2048, Flappy, Memory
// Mobile 448×900, RTL, dark theme with emerald accents. Chrome only — canvas stays untouched.

const AYG = window.AY;

// ─── Shared game meta ──────────────────────────────────────
const GAMES = [
  {
    id: 'snake',
    label: 'مار',
    emoji: '🐍',
    tag: 'کلاسیک',
    tagline: 'غذا بخور، بزرگ شو، به دیوار نخور.',
    accent: '#34d399',
    accentDeep: '#10b981',
    bestScore: 47,
    plays: 128,
    playtime: '۲ د',
    difficulty: 2,
    mascotState: 'idle',
    howTo: ['سوایپ برای تغییر مسیر', 'تو سیب رو بگیر', 'به دیوار یا خودت نخور'],
  },
  {
    id: '2048',
    label: '۲۰۴۸',
    emoji: '🔢',
    tag: 'معمایی',
    tagline: 'کاشی‌ها رو ترکیب کن تا به ۲۰۴۸ برسی.',
    accent: '#fcd34d',
    accentDeep: '#f59e0b',
    bestScore: 4728,
    plays: 64,
    playtime: '۵ د',
    difficulty: 3,
    mascotState: 'thinking',
    howTo: ['سوایپ برای حرکت کاشی‌ها', 'کاشی‌های هم‌عدد ترکیب می‌شن', 'تا آخرین حرکتت ادامه بده'],
  },
  {
    id: 'flappy',
    label: 'فلپی',
    emoji: '🐦',
    tag: 'واکنشی',
    tagline: 'بال بزن، از لوله‌ها رد شو.',
    accent: '#60a5fa',
    accentDeep: '#3b82f6',
    bestScore: 23,
    plays: 212,
    playtime: '۱ د',
    difficulty: 4,
    mascotState: 'surprise',
    howTo: ['لمس کن تا بال بزنی', 'بین لوله‌ها رد شو', 'به زمین یا سقف نخور'],
  },
  {
    id: 'memory',
    label: 'حافظه',
    emoji: '🃏',
    tag: 'حافظه',
    tagline: 'جفت‌های مثل هم رو پیدا کن.',
    accent: '#c4b5fd',
    accentDeep: '#8b5cf6',
    bestScore: 42,
    plays: 31,
    playtime: '۳ د',
    difficulty: 1,
    mascotState: 'wave',
    howTo: ['رو کارت بزن تا برگرده', 'دو کارت یکسان پیدا کن', 'سعی کن حرکات کمتر بزنی'],
  },
];

// ─── Shared: Top chrome with back to hub ───────────────────
function GameTopChrome({ title, emoji, subtitle, right }) {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30,
      padding: '22px 20px 14px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
      background: 'linear-gradient(180deg, rgba(2,3,6,0.92) 0%, rgba(2,3,6,0) 100%)',
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 11,
        background: 'rgba(31,46,40,0.6)',
        border: '1px solid rgba(110,231,183,0.14)',
        display: 'grid', placeItems: 'center',
      }}>
        <AYIcon name="chev-r" size={16} color="#e8efea"/>
      </div>
      <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <span style={{ fontSize: 16 }}>{emoji}</span>
          <span style={{ fontWeight: 800, fontSize: 14, color: '#e8efea' }}>{title}</span>
        </div>
        {subtitle && (
          <div style={{ fontSize: 10, color: 'rgba(232,239,234,0.55)', marginTop: 2, fontFamily: AYG.font.mono, letterSpacing: 1 }}>
            {subtitle}
          </div>
        )}
      </div>
      <div style={{ minWidth: 38 }}>{right}</div>
    </div>
  );
}

// ─── Shared: Game tabs row ────────────────────────────────
function GameTabs({ active }) {
  return (
    <div style={{
      position: 'absolute', top: 70, left: 0, right: 0, zIndex: 29,
      padding: '10px 16px 14px',
      display: 'flex', gap: 8, overflowX: 'hidden',
      background: 'rgba(2,3,6,0.72)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(110,231,183,0.06)',
    }}>
      {GAMES.map(g => {
        const on = g.id === active;
        return (
          <div key={g.id} style={{
            flex: '0 0 auto',
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px',
            borderRadius: 12,
            background: on ? `${g.accent}22` : 'rgba(255,255,255,0.03)',
            border: `1px solid ${on ? `${g.accent}66` : 'rgba(255,255,255,0.06)'}`,
            boxShadow: on ? `0 4px 16px ${g.accent}22` : 'none',
          }}>
            <span style={{ fontSize: 13 }}>{g.emoji}</span>
            <span style={{
              fontSize: 12, fontWeight: on ? 800 : 500,
              color: on ? g.accent : 'rgba(232,239,234,0.55)',
            }}>{g.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Shared: pixel sparkle background ──────────────────────
function GameBackdrop({ accent }) {
  return (
    <>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${accent}1a, transparent 60%), #020306`,
      }}/>
      {[[10, 18], [88, 12], [18, 78], [82, 72], [50, 8], [92, 40], [6, 44], [60, 86]].map(([x, y], i) => (
        <div key={i} style={{
          position: 'absolute', left: `${x}%`, top: `${y}%`,
          width: 2, height: 2, background: accent, boxShadow: `0 0 6px ${accent}`,
          opacity: 0.6,
          animation: `ay-twinkle ${2 + (i * 0.3) % 2}s ease-in-out ${(i * 0.2) % 1.5}s infinite`,
          pointerEvents: 'none', zIndex: 1,
        }}/>
      ))}
    </>
  );
}

// ─── Shared: frame wrapper ────────────────────────────────
function GameFrame({ children, accent = '#34d399' }) {
  return (
    <div style={{
      width: 448, height: 900, position: 'relative',
      background: '#020306',
      color: '#e8efea',
      fontFamily: AYG.font.display,
      overflow: 'hidden',
      borderRadius: 28,
      border: '1px solid rgba(110,231,183,0.06)',
    }}>
      <GameBackdrop accent={accent}/>
      <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 5 }}>
        {children}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  GAMES HUB — the gallery
// ═══════════════════════════════════════════════════════════
function GamesHub() {
  return (
    <GameFrame accent="#34d399">
      {/* Header */}
      <div style={{ padding: '22px 20px 0', position: 'relative', zIndex: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 11,
            background: 'rgba(31,46,40,0.6)', border: '1px solid rgba(110,231,183,0.14)',
            display: 'grid', placeItems: 'center',
          }}>
            <AYIcon name="chev-r" size={16} color="#e8efea"/>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#34d399' }}>
            <AYIcon name="bolt" size={16} color="#34d399"/>
            <span style={{ fontWeight: 800, fontSize: 14 }}>بازی‌ها</span>
          </div>
          <div style={{ width: 38 }}/>
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ fontFamily: AYG.font.mono, fontSize: 10, letterSpacing: 2, color: '#6ee7b7', textTransform: 'uppercase', fontWeight: 700 }}>
            یه وقفهٔ کوتاه
          </div>
          <h1 style={{ margin: '6px 0 0', fontSize: 28, fontWeight: 900, letterSpacing: -0.7, lineHeight: 1.1 }}>
            ذهنت رو <span style={{ color: '#6ee7b7' }}>استراحت</span> بده.
          </h1>
          <p style={{ margin: '8px 0 0', fontSize: 12.5, color: 'rgba(232,239,234,0.55)', lineHeight: 1.6 }}>
            چهار بازی کوتاه و خوش‌مزه برای وقتی که فکرت خسته شده.
          </p>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ padding: '18px 20px 0' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8,
          padding: '14px',
          borderRadius: 16,
          background: 'linear-gradient(180deg, rgba(31,46,40,0.55) 0%, rgba(18,30,24,0.45) 100%)',
          border: '1px solid rgba(110,231,183,0.16)',
        }}>
          {[
            { label: 'کل بازی‌ها', val: AY_FA('۴۳۵'), icon: 'bolt' },
            { label: 'بهترین سری', val: AY_FA('۷'), icon: 'trending' },
            { label: 'این هفته', val: AY_FA('۱۸'), icon: 'clock' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', borderInlineEnd: i < 2 ? '1px solid rgba(110,231,183,0.08)' : 'none', paddingInlineEnd: i < 2 ? 4 : 0 }}>
              <div style={{ fontFamily: AYG.font.mono, fontSize: 20, fontWeight: 900, color: '#6ee7b7', lineHeight: 1 }}>
                {s.val}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(232,239,234,0.55)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Game cards grid 2×2 */}
      <div style={{ padding: '18px 16px 100px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {GAMES.map((g, i) => (
          <GameCard key={g.id} game={g} featured={i === 0}/>
        ))}
      </div>

      {/* BottomNav */}
      <BottomNav4 active="home"/>
    </GameFrame>
  );
}

function GameCard({ game, featured }) {
  const g = game;
  return (
    <div style={{
      position: 'relative',
      padding: 12,
      borderRadius: 18,
      background: `linear-gradient(180deg, ${g.accent}12 0%, rgba(18,30,24,0.6) 100%)`,
      border: `1px solid ${g.accent}33`,
      overflow: 'hidden',
    }}>
      {/* Mini scene preview */}
      <div style={{
        position: 'relative',
        height: 100,
        borderRadius: 12,
        background: `linear-gradient(180deg, ${g.accent}22 0%, rgba(2,3,6,0.9) 100%)`,
        border: `1px solid ${g.accent}44`,
        marginBottom: 10,
        overflow: 'hidden',
      }}>
        {/* Pixel dots */}
        {[[15, 25], [82, 18], [30, 65], [72, 55]].map(([x, y], k) => (
          <div key={k} style={{
            position: 'absolute', left: `${x}%`, top: `${y}%`,
            width: 2, height: 2, background: g.accent, boxShadow: `0 0 4px ${g.accent}`, opacity: 0.7,
          }}/>
        ))}
        {/* Horizon */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 14,
          height: 1, background: `linear-gradient(90deg, transparent, ${g.accent}, transparent)`, opacity: 0.5,
        }}/>
        {/* Ground pattern */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, height: 14,
          background: `repeating-linear-gradient(90deg, ${g.accent}33 0 6px, transparent 6px 14px)`,
        }}/>
        {/* Emoji glyph big */}
        <div style={{
          position: 'absolute', left: '50%', top: '45%', transform: 'translate(-50%, -50%)',
          fontSize: 38, filter: `drop-shadow(0 0 8px ${g.accent}66)`,
        }}>
          {g.emoji}
        </div>
        {/* Tag */}
        <div style={{
          position: 'absolute', top: 6, insetInlineStart: 6,
          padding: '2px 8px', borderRadius: 999,
          background: 'rgba(0,0,0,0.4)', border: `1px solid ${g.accent}55`,
          fontFamily: AYG.font.mono, fontSize: 8.5, letterSpacing: 1, color: g.accent, fontWeight: 700, textTransform: 'uppercase',
        }}>
          {g.tag}
        </div>
        {/* Best score badge */}
        <div style={{
          position: 'absolute', top: 6, insetInlineEnd: 6,
          padding: '2px 7px', borderRadius: 6,
          background: 'rgba(0,0,0,0.5)',
          fontFamily: AYG.font.mono, fontSize: 9, color: '#e8efea', fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: 3,
        }}>
          <AYIcon name="crown" size={9} color={g.accent} stroke={2}/>
          {AY_FA(g.bestScore.toLocaleString('fa-IR'))}
        </div>
      </div>

      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: '#e8efea' }}>{g.label}</div>
        <div style={{ fontFamily: AYG.font.mono, fontSize: 9.5, color: 'rgba(232,239,234,0.45)' }}>
          {AY_FA(g.playtime)}
        </div>
      </div>

      {/* Tagline */}
      <div style={{ fontSize: 10.5, color: 'rgba(232,239,234,0.55)', lineHeight: 1.5, marginBottom: 10, minHeight: 30 }}>
        {g.tagline}
      </div>

      {/* Play pill */}
      <div style={{
        padding: '8px 10px', borderRadius: 11,
        background: g.accent,
        color: '#04110a', fontWeight: 800, fontSize: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
        boxShadow: `0 4px 14px ${g.accent}55`,
      }}>
        <AYIcon name="play" size={11} color="#04110a" stroke={2.4}/>
        شروع
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  INTRO SCREEN — per game
// ═══════════════════════════════════════════════════════════
function GameIntro({ gameId }) {
  const g = GAMES.find(x => x.id === gameId) || GAMES[0];
  return (
    <GameFrame accent={g.accent}>
      <GameTopChrome
        title={g.label}
        emoji={g.emoji}
        subtitle={g.tag.toUpperCase()}
        right={(
          <div style={{
            width: 38, height: 38, borderRadius: 11,
            background: 'rgba(31,46,40,0.6)', border: '1px solid rgba(110,231,183,0.14)',
            display: 'grid', placeItems: 'center',
          }}>
            <AYIcon name="crown" size={14} color={g.accent}/>
          </div>
        )}
      />

      <GameTabs active={g.id}/>

      <div style={{ position: 'absolute', top: 130, bottom: 0, left: 0, right: 0, overflow: 'auto' }}>
        <div style={{ padding: '8px 20px 40px' }}>
          {/* Hero mascot + emoji */}
          <div style={{
            position: 'relative',
            height: 230,
            borderRadius: 22,
            background: `linear-gradient(180deg, ${g.accent}1a 0%, rgba(2,3,6,0.9) 100%)`,
            border: `1px solid ${g.accent}33`,
            overflow: 'hidden',
            marginBottom: 20,
          }}>
            {/* Pixel field */}
            <svg style={{ position: 'absolute', inset: 0 }} width="100%" height="100%" viewBox="0 0 400 230" preserveAspectRatio="none">
              {[-3, -2, -1, 0, 1, 2, 3].map(i => (
                <line key={i}
                  x1={200 + i * 60} y1={230}
                  x2={200} y2={140}
                  stroke={`${g.accent}26`} strokeWidth="1" strokeDasharray="2 4"/>
              ))}
            </svg>
            {/* Big emoji glow */}
            <div style={{
              position: 'absolute', left: '50%', top: '38%', transform: 'translate(-50%, -50%)',
              fontSize: 90, filter: `drop-shadow(0 0 20px ${g.accent}88)`,
            }}>
              {g.emoji}
            </div>
            {/* Mascot peek */}
            <div style={{ position: 'absolute', insetInlineEnd: 22, bottom: 18 }}>
              <MascotArt state={g.mascotState} frame={0} blink={false} scale={3} accent={g.accent}/>
            </div>
            {/* Mascot speech */}
            <div style={{
              position: 'absolute', insetInlineEnd: 86, bottom: 56,
              padding: '6px 10px', borderRadius: 10,
              background: 'rgba(31,46,40,0.9)', border: `1px solid ${g.accent}55`,
              fontSize: 11, color: '#e8efea', fontWeight: 600,
              whiteSpace: 'nowrap',
            }}>
              یه دست بزنیم؟
              <div style={{
                position: 'absolute', top: '50%', insetInlineEnd: -6, transform: 'translateY(-50%) rotate(45deg)',
                width: 8, height: 8, background: 'rgba(31,46,40,0.9)',
                borderInlineEnd: `1px solid ${g.accent}55`, borderBlockStart: `1px solid ${g.accent}55`,
                borderBottom: 'none', borderInlineStart: 'none',
              }}/>
            </div>
          </div>

          {/* Tagline */}
          <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 900, letterSpacing: -0.5, color: '#e8efea' }}>
            {g.tagline}
          </h2>
          <div style={{ fontSize: 12, color: 'rgba(232,239,234,0.55)', lineHeight: 1.65, marginBottom: 18 }}>
            سریع یاد می‌گیری، سخت‌تر می‌شی. رکوردت رو بشکن.
          </div>

          {/* How-to grid */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontFamily: AYG.font.mono, fontSize: 10, letterSpacing: 2, color: g.accent, textTransform: 'uppercase', marginBottom: 10, fontWeight: 700 }}>
              چطوری بازی کنم
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {g.howTo.map((h, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px',
                  borderRadius: 12,
                  background: 'rgba(31,46,40,0.5)',
                  border: '1px solid rgba(110,231,183,0.08)',
                }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: 8,
                    background: `${g.accent}22`, border: `1px solid ${g.accent}55`,
                    display: 'grid', placeItems: 'center',
                    fontFamily: AYG.font.mono, fontWeight: 900, fontSize: 12, color: g.accent,
                  }}>
                    {AY_FA(i + 1)}
                  </div>
                  <div style={{ flex: 1, fontSize: 12.5, color: 'rgba(232,239,234,0.85)', lineHeight: 1.5 }}>
                    {h}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty + best */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            <div style={{
              padding: 14, borderRadius: 14,
              background: 'rgba(31,46,40,0.5)',
              border: '1px solid rgba(110,231,183,0.1)',
            }}>
              <div style={{ fontSize: 10, fontFamily: AYG.font.mono, letterSpacing: 1.5, color: 'rgba(232,239,234,0.5)', marginBottom: 6 }}>
                سختی
              </div>
              <div style={{ display: 'flex', gap: 3 }}>
                {[1, 2, 3, 4, 5].map(d => (
                  <div key={d} style={{
                    width: 20, height: 8, borderRadius: 2,
                    background: d <= g.difficulty ? g.accent : 'rgba(255,255,255,0.08)',
                    boxShadow: d <= g.difficulty ? `0 0 6px ${g.accent}88` : 'none',
                  }}/>
                ))}
              </div>
            </div>
            <div style={{
              padding: 14, borderRadius: 14,
              background: 'rgba(31,46,40,0.5)',
              border: '1px solid rgba(110,231,183,0.1)',
            }}>
              <div style={{ fontSize: 10, fontFamily: AYG.font.mono, letterSpacing: 1.5, color: 'rgba(232,239,234,0.5)', marginBottom: 6 }}>
                رکورد تو
              </div>
              <div style={{ fontFamily: AYG.font.mono, fontSize: 20, fontWeight: 900, color: g.accent, lineHeight: 1 }}>
                {AY_FA(g.bestScore.toLocaleString('fa-IR'))}
              </div>
            </div>
          </div>

          {/* Start button */}
          <div style={{
            padding: '16px',
            borderRadius: 16,
            background: g.accent,
            color: '#04110a', fontWeight: 900, fontSize: 15,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: `0 8px 24px ${g.accent}66`,
          }}>
            <AYIcon name="play" size={16} color="#04110a" stroke={2.4}/>
            شروع بازی
          </div>

          <div style={{ marginTop: 12, textAlign: 'center', fontSize: 11, color: 'rgba(232,239,234,0.4)', fontFamily: AYG.font.mono }}>
            {AY_FA(g.plays)} بازی انجام شده
          </div>
        </div>
      </div>
    </GameFrame>
  );
}

// ═══════════════════════════════════════════════════════════
//  GAMEPLAY CHROME — per game
// ═══════════════════════════════════════════════════════════
function GamePlayFrame({ gameId }) {
  const g = GAMES.find(x => x.id === gameId) || GAMES[0];
  return (
    <GameFrame accent={g.accent}>
      <GameTopChrome
        title={g.label}
        emoji={g.emoji}
        right={(
          <div style={{
            width: 38, height: 38, borderRadius: 11,
            background: 'rgba(31,46,40,0.6)', border: '1px solid rgba(110,231,183,0.14)',
            display: 'grid', placeItems: 'center',
          }}>
            <AYIcon name="settings" size={14} color="#e8efea"/>
          </div>
        )}
      />

      <div style={{ position: 'absolute', top: 80, left: 0, right: 0, padding: '0 20px' }}>
        {/* Score strip */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8,
          padding: '12px 14px', borderRadius: 14,
          background: 'rgba(31,46,40,0.55)',
          border: '1px solid rgba(110,231,183,0.1)',
        }}>
          {[
            { label: 'امتیاز', val: g.id === '2048' ? AY_FA('۱۲۴') : g.id === 'memory' ? AY_FA('۳') : AY_FA('۸'), color: g.accent },
            { label: 'بهترین', val: AY_FA(g.bestScore.toLocaleString('fa-IR')), color: '#e8efea' },
            { label: g.id === 'memory' ? 'زمان' : 'سری', val: g.id === 'memory' ? AY_FA('۰۰:۴۲') : AY_FA('۳'), color: '#e8efea' },
          ].map((s, i) => (
            <div key={i} style={{
              textAlign: 'center',
              borderInlineEnd: i < 2 ? '1px solid rgba(110,231,183,0.08)' : 'none',
              paddingInlineEnd: i < 2 ? 4 : 0,
            }}>
              <div style={{ fontFamily: AYG.font.mono, fontSize: 9, letterSpacing: 1.5, color: 'rgba(232,239,234,0.5)', marginBottom: 4 }}>
                {s.label}
              </div>
              <div style={{ fontFamily: AYG.font.mono, fontSize: 18, fontWeight: 900, color: s.color, lineHeight: 1 }}>
                {s.val}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Game canvas placeholder */}
      <div style={{
        position: 'absolute', top: 180, left: 20, right: 20, bottom: 140,
        display: 'grid', placeItems: 'center',
      }}>
        <div style={{
          width: '100%', height: '100%',
          borderRadius: 18,
          background: `linear-gradient(180deg, rgba(10,15,10,0.9) 0%, rgba(2,3,6,0.95) 100%)`,
          border: `1px solid ${g.accent}2a`,
          overflow: 'hidden',
          position: 'relative',
          display: 'grid', placeItems: 'center',
        }}>
          <GameCanvasPlaceholder gameId={g.id}/>
          {/* HUD corner — pause */}
          <div style={{
            position: 'absolute', top: 12, insetInlineEnd: 12,
            width: 34, height: 34, borderRadius: 10,
            background: 'rgba(0,0,0,0.55)', border: `1px solid ${g.accent}33`,
            display: 'grid', placeItems: 'center',
          }}>
            <div style={{ display: 'flex', gap: 3 }}>
              <div style={{ width: 3, height: 12, background: g.accent, borderRadius: 1 }}/>
              <div style={{ width: 3, height: 12, background: g.accent, borderRadius: 1 }}/>
            </div>
          </div>
        </div>
      </div>

      {/* Controls strip */}
      <div style={{ position: 'absolute', bottom: 18, left: 0, right: 0, padding: '0 20px' }}>
        <GameControls gameId={g.id} accent={g.accent}/>
      </div>
    </GameFrame>
  );
}

// Per-game canvas preview (pixel sketch of actual board)
function GameCanvasPlaceholder({ gameId }) {
  if (gameId === 'snake') {
    // 16x16 grid with snake + food
    const cells = [];
    for (let r = 0; r < 12; r++) {
      for (let c = 0; c < 12; c++) {
        cells.push({ r, c });
      }
    }
    const snake = [[6, 5], [6, 6], [6, 7], [7, 7], [8, 7]];
    const food = [8, 3];
    return (
      <div style={{
        width: 260, height: 260,
        display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 1,
        background: '#0a0f0a',
        padding: 6, borderRadius: 10,
        border: '1px solid rgba(52,211,153,0.2)',
      }}>
        {cells.map((cell, i) => {
          const isSnake = snake.some(([r, c]) => r === cell.r && c === cell.c);
          const isHead = snake[snake.length - 1][0] === cell.r && snake[snake.length - 1][1] === cell.c;
          const isFood = food[0] === cell.r && food[1] === cell.c;
          return (
            <div key={i} style={{
              aspectRatio: '1', borderRadius: 3,
              background: isHead ? '#34d399'
                : isSnake ? 'rgba(52,211,153,0.7)'
                : isFood ? '#ef4444'
                : 'transparent',
              boxShadow: isHead ? '0 0 6px #34d399' : isFood ? '0 0 6px #ef4444' : 'none',
            }}/>
          );
        })}
      </div>
    );
  }
  if (gameId === '2048') {
    const board = [
      [2, 4, 8, 16],
      [null, 16, 32, 8],
      [2, 4, 64, 4],
      [null, null, 2, 2],
    ];
    const tileColor = (v) => {
      if (!v) return { bg: 'rgba(255,255,255,0.04)', c: 'transparent' };
      if (v === 2) return { bg: '#374151', c: '#e5e7eb' };
      if (v === 4) return { bg: '#4b5563', c: '#f3f4f6' };
      if (v === 8) return { bg: '#c2410c', c: '#fff' };
      if (v === 16) return { bg: '#b45309', c: '#fff' };
      if (v === 32) return { bg: '#dc2626', c: '#fff' };
      if (v === 64) return { bg: '#b91c1c', c: '#fff' };
      return { bg: '#fcd34d', c: '#04110a' };
    };
    return (
      <div style={{
        padding: 10, borderRadius: 12,
        background: 'rgba(252,211,77,0.06)',
        border: '1px solid rgba(252,211,77,0.2)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {board.flat().map((v, i) => {
            const c = tileColor(v);
            return (
              <div key={i} style={{
                width: 52, height: 52, borderRadius: 8,
                background: c.bg, color: c.c,
                display: 'grid', placeItems: 'center',
                fontWeight: 900, fontSize: v && v >= 100 ? 15 : 18,
                fontFamily: AYG.font.mono,
              }}>
                {v ? AY_FA(v.toString()) : ''}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  if (gameId === 'flappy') {
    return (
      <div style={{
        width: 260, height: 360, position: 'relative',
        borderRadius: 10,
        background: 'linear-gradient(180deg, #020c14 0%, #041824 100%)',
        border: '1px solid rgba(52,211,153,0.2)',
        overflow: 'hidden',
      }}>
        {/* Stars */}
        {[[30, 40], [200, 60], [80, 100], [220, 150], [40, 200]].map(([x, y], i) => (
          <div key={i} style={{ position: 'absolute', left: x, top: y, width: 2, height: 2, background: '#fff', opacity: 0.4 }}/>
        ))}
        {/* Pipes */}
        {[{ x: 110, top: 130 }, { x: 210, top: 180 }].map((p, i) => (
          <React.Fragment key={i}>
            <div style={{ position: 'absolute', left: p.x, top: 0, width: 44, height: p.top,
              background: 'linear-gradient(90deg, #065f46, #34d399, #065f46)',
              borderRadius: '0 0 6px 6px',
            }}/>
            <div style={{ position: 'absolute', left: p.x - 3, top: p.top - 16, width: 50, height: 16, background: '#34d399' }}/>
            <div style={{ position: 'absolute', left: p.x, top: p.top + 100, width: 44, bottom: 18,
              background: 'linear-gradient(90deg, #065f46, #34d399, #065f46)',
              borderRadius: '6px 6px 0 0',
            }}/>
            <div style={{ position: 'absolute', left: p.x - 3, top: p.top + 100, width: 50, height: 16, background: '#34d399' }}/>
          </React.Fragment>
        ))}
        {/* Ground */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 18, background: '#065f46' }}/>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 15, height: 3, background: '#34d399' }}/>
        {/* Bird */}
        <div style={{
          position: 'absolute', left: 60, top: 170,
          width: 28, height: 24, borderRadius: '50%',
          background: '#fbbf24', boxShadow: '0 0 10px #fbbf2488',
        }}>
          <div style={{ position: 'absolute', left: 16, top: 6, width: 6, height: 6, borderRadius: '50%', background: '#fff' }}/>
          <div style={{ position: 'absolute', left: 18, top: 8, width: 3, height: 3, borderRadius: '50%', background: '#111' }}/>
          <div style={{ position: 'absolute', left: 24, top: 10, width: 0, height: 0,
            borderTop: '3px solid transparent', borderBottom: '3px solid transparent',
            borderInlineStart: '7px solid #f97316' }}/>
        </div>
        {/* Score */}
        <div style={{
          position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
          fontFamily: AYG.font.mono, fontSize: 28, fontWeight: 900, color: '#fff',
          textShadow: '0 2px 8px rgba(0,0,0,0.7)',
        }}>
          {AY_FA('۸')}
        </div>
      </div>
    );
  }
  if (gameId === 'memory') {
    const cards = [
      { e: '🤖', m: true }, { e: '?', m: false }, { e: '🎯', f: true }, { e: '?', m: false },
      { e: '?', m: false }, { e: '🚀', m: true }, { e: '?', m: false }, { e: '💡', m: true },
      { e: '?', m: false }, { e: '?', m: false }, { e: '🎯', f: true }, { e: '?', m: false },
      { e: '⚡', m: true }, { e: '?', m: false }, { e: '?', m: false }, { e: '?', m: false },
    ];
    return (
      <div style={{
        padding: 12, borderRadius: 14,
        background: 'rgba(196,181,253,0.05)',
        border: '1px solid rgba(196,181,253,0.18)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {cards.map((card, i) => (
            <div key={i} style={{
              width: 52, height: 52, borderRadius: 10,
              background: card.m ? 'rgba(196,181,253,0.18)' : card.f ? 'rgba(196,181,253,0.12)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${card.m ? 'rgba(196,181,253,0.5)' : card.f ? 'rgba(196,181,253,0.3)' : 'rgba(255,255,255,0.1)'}`,
              display: 'grid', placeItems: 'center',
              fontSize: card.m || card.f ? 22 : 18,
              color: card.m || card.f ? 'inherit' : 'rgba(255,255,255,0.15)',
            }}>
              {card.m || card.f ? card.e : '✦'}
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

// Controls row
function GameControls({ gameId, accent }) {
  if (gameId === 'snake' || gameId === '2048') {
    // D-pad
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px',
        borderRadius: 18,
        background: 'rgba(31,46,40,0.55)',
        border: '1px solid rgba(110,231,183,0.1)',
      }}>
        <div style={{ flex: 1, fontSize: 11, color: 'rgba(232,239,234,0.55)', lineHeight: 1.5 }}>
          سوایپ کن یا با کلیدهای جهت بازی کن.
        </div>
        <div style={{
          position: 'relative', width: 100, height: 100,
        }}>
          {/* Up */}
          <div style={{ position: 'absolute', top: 0, left: 34, width: 32, height: 32, borderRadius: 8, background: `${accent}22`, border: `1px solid ${accent}55`, display: 'grid', placeItems: 'center' }}>
            <div style={{ width: 0, height: 0, borderInlineStart: '5px solid transparent', borderInlineEnd: '5px solid transparent', borderBottom: `6px solid ${accent}` }}/>
          </div>
          {/* Left (in LTR visual sense — but we keep it simple) */}
          <div style={{ position: 'absolute', top: 34, left: 0, width: 32, height: 32, borderRadius: 8, background: `${accent}22`, border: `1px solid ${accent}55`, display: 'grid', placeItems: 'center' }}>
            <div style={{ width: 0, height: 0, borderBlockStart: '5px solid transparent', borderBlockEnd: '5px solid transparent', borderInlineEnd: `6px solid ${accent}` }}/>
          </div>
          {/* Center */}
          <div style={{ position: 'absolute', top: 38, left: 38, width: 24, height: 24, borderRadius: 6, background: `${accent}11` }}/>
          {/* Right */}
          <div style={{ position: 'absolute', top: 34, insetInlineStart: 68, width: 32, height: 32, borderRadius: 8, background: `${accent}22`, border: `1px solid ${accent}55`, display: 'grid', placeItems: 'center' }}>
            <div style={{ width: 0, height: 0, borderBlockStart: '5px solid transparent', borderBlockEnd: '5px solid transparent', borderInlineStart: `6px solid ${accent}` }}/>
          </div>
          {/* Down */}
          <div style={{ position: 'absolute', top: 68, left: 34, width: 32, height: 32, borderRadius: 8, background: `${accent}22`, border: `1px solid ${accent}55`, display: 'grid', placeItems: 'center' }}>
            <div style={{ width: 0, height: 0, borderInlineStart: '5px solid transparent', borderInlineEnd: '5px solid transparent', borderBlockStart: `6px solid ${accent}` }}/>
          </div>
        </div>
      </div>
    );
  }
  if (gameId === 'flappy') {
    return (
      <div style={{
        padding: 14,
        borderRadius: 16,
        background: `${accent}22`,
        border: `1px solid ${accent}55`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        boxShadow: `0 6px 20px ${accent}33`,
      }}>
        <div style={{ fontSize: 22 }}>👆</div>
        <div style={{ fontWeight: 800, fontSize: 14, color: accent }}>
          لمس کن تا بال بزنی
        </div>
      </div>
    );
  }
  // memory
  return (
    <div style={{
      padding: '12px 16px',
      borderRadius: 14,
      background: 'rgba(31,46,40,0.55)',
      border: '1px solid rgba(110,231,183,0.1)',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${accent}22`, border: `1px solid ${accent}55`, display: 'grid', placeItems: 'center' }}>
        <AYIcon name="sparkle" size={16} color={accent}/>
      </div>
      <div style={{ flex: 1, fontSize: 11.5, color: 'rgba(232,239,234,0.7)', lineHeight: 1.5 }}>
        کارت‌ها رو یکی‌یکی برگردون و <strong style={{ color: accent }}>جفت</strong> پیدا کن.
      </div>
      <div style={{
        padding: '6px 10px', borderRadius: 9, background: 'rgba(0,0,0,0.3)',
        fontFamily: AYG.font.mono, fontSize: 11, color: accent, fontWeight: 700,
      }}>
        {AY_FA('۵/۸')}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  RESULT SCREEN — per game
// ═══════════════════════════════════════════════════════════
function GameResult({ gameId, won = false }) {
  const g = GAMES.find(x => x.id === gameId) || GAMES[0];
  const finalScore = won ? g.bestScore + 12 : Math.floor(g.bestScore * 0.6);
  const newBest = won;
  return (
    <GameFrame accent={g.accent}>
      <GameTopChrome
        title={g.label}
        emoji={g.emoji}
        subtitle={won ? 'رکورد جدید' : 'نتیجه'}
        right={<div style={{ width: 38 }}/>}
      />

      <div style={{ position: 'absolute', top: 90, bottom: 0, left: 0, right: 0, overflow: 'auto' }}>
        <div style={{ padding: '20px 20px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Headline */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 54, marginBottom: 4 }}>
              {won ? '🎉' : '😅'}
            </div>
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 900, letterSpacing: -0.6, color: won ? g.accent : '#e8efea' }}>
              {won ? 'رکورد جدید!' : 'بازی تموم شد'}
            </h2>
            <div style={{ marginTop: 6, fontSize: 13, color: 'rgba(232,239,234,0.6)', lineHeight: 1.5 }}>
              {won ? 'بهتر از همیشه بازی کردی.' : 'یه تلاش دیگه و رکوردت رو می‌شکنی.'}
            </div>
          </div>

          {/* Score card */}
          <div style={{
            padding: '22px 18px',
            borderRadius: 22,
            background: won
              ? `linear-gradient(180deg, ${g.accent}2a 0%, rgba(31,46,40,0.6) 100%)`
              : 'linear-gradient(180deg, rgba(31,46,40,0.7) 0%, rgba(18,30,24,0.6) 100%)',
            border: `1px solid ${won ? g.accent + '55' : 'rgba(110,231,183,0.15)'}`,
            textAlign: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            {won && (
              <>
                <div style={{ position: 'absolute', top: 10, left: 20, fontSize: 18 }}>✨</div>
                <div style={{ position: 'absolute', top: 16, insetInlineEnd: 24, fontSize: 14 }}>⭐</div>
                <div style={{ position: 'absolute', bottom: 14, insetInlineEnd: 20, fontSize: 16 }}>✨</div>
              </>
            )}
            <div style={{ fontFamily: AYG.font.mono, fontSize: 10, letterSpacing: 2, color: g.accent, textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>
              امتیاز نهایی
            </div>
            <div style={{ fontFamily: AYG.font.mono, fontSize: 56, fontWeight: 900, color: g.accent, lineHeight: 1, letterSpacing: -2, textShadow: `0 0 24px ${g.accent}88` }}>
              {AY_FA(finalScore.toLocaleString('fa-IR'))}
            </div>
            {newBest && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                marginTop: 14, padding: '6px 12px', borderRadius: 999,
                background: g.accent, color: '#04110a',
                fontFamily: AYG.font.display, fontSize: 11, fontWeight: 800,
                boxShadow: `0 4px 16px ${g.accent}55`,
              }}>
                <AYIcon name="crown" size={11} color="#04110a" stroke={2.5}/>
                رکورد شخصی جدید
              </div>
            )}
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { label: g.id === 'memory' ? 'زمان' : 'بهترین قبلی', val: g.id === 'memory' ? AY_FA('۰۲:۱۴') : AY_FA(g.bestScore.toLocaleString('fa-IR')) },
              { label: g.id === '2048' ? 'حرکات' : g.id === 'memory' ? 'حرکات' : g.id === 'flappy' ? 'لوله‌ها' : 'غذاها', val: AY_FA(g.id === '2048' ? '۸۴' : g.id === 'memory' ? '۱۸' : g.id === 'flappy' ? '۳۵' : '۴۷') },
              { label: 'XP', val: `+${AY_FA(won ? '۵۰' : '۱۵')}` },
            ].map((s, i) => (
              <div key={i} style={{
                padding: '12px 10px', borderRadius: 14,
                background: 'rgba(31,46,40,0.55)',
                border: '1px solid rgba(110,231,183,0.1)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 9.5, color: 'rgba(232,239,234,0.5)', fontFamily: AYG.font.mono, letterSpacing: 1.2, marginBottom: 4 }}>
                  {s.label}
                </div>
                <div style={{ fontFamily: AYG.font.mono, fontSize: 16, fontWeight: 900, color: '#e8efea' }}>
                  {s.val}
                </div>
              </div>
            ))}
          </div>

          {/* Mascot reaction */}
          <div style={{
            padding: 16,
            borderRadius: 16,
            background: 'rgba(31,46,40,0.5)',
            border: '1px solid rgba(110,231,183,0.08)',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <MascotArt state={won ? 'sparkle' : 'idle'} frame={0} blink={false} scale={2.4} accent={g.accent}/>
            <div style={{ flex: 1, fontSize: 12.5, color: 'rgba(232,239,234,0.8)', lineHeight: 1.6 }}>
              {won ? (
                <>
                  <strong style={{ color: g.accent }}>عالی بودی!</strong> حالا بیا یه بازی دیگه امتحان کنیم.
                </>
              ) : (
                <>
                  نگران نباش، دفعهٔ بعد <strong style={{ color: g.accent }}>بهتر میشی</strong>.
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'grid', gap: 8 }}>
            <div style={{
              padding: 14, borderRadius: 14,
              background: g.accent, color: '#04110a',
              fontWeight: 900, fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: `0 6px 20px ${g.accent}55`,
            }}>
              <AYIcon name="play" size={14} color="#04110a" stroke={2.4}/>
              دوباره بازی
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div style={{
                padding: 12, borderRadius: 12,
                background: 'rgba(31,46,40,0.6)',
                border: '1px solid rgba(110,231,183,0.15)',
                color: '#e8efea', fontWeight: 700, fontSize: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <AYIcon name="crown" size={12} color={g.accent}/>
                لیدربورد
              </div>
              <div style={{
                padding: 12, borderRadius: 12,
                background: 'rgba(31,46,40,0.6)',
                border: '1px solid rgba(110,231,183,0.15)',
                color: '#e8efea', fontWeight: 700, fontSize: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <AYIcon name="send" size={12} color={g.accent}/>
                اشتراک
              </div>
            </div>
          </div>
        </div>
      </div>
    </GameFrame>
  );
}

// ═══════════════════════════════════════════════════════════
//  LEADERBOARD — per game
// ═══════════════════════════════════════════════════════════
const LEADERS_BY_GAME = {
  snake:  [{n:'مهدی ک.',   s: 89, u:'م', a:'#34d399'}, {n:'نگار ر.',   s: 76, u:'ن', a:'#fcd34d'}, {n:'پیام ح.',   s: 64, u:'پ', a:'#c4b5fd'}, {n:'تو', s: 47, u:'', a:'#34d399', me:true }, {n:'سارا م.',   s: 42, u:'س', a:'#60a5fa'}, {n:'علی ب.',   s: 38, u:'ع', a:'#f97316'}, {n:'ریحانه',   s: 31, u:'ر', a:'#e879f9'}],
  '2048': [{n:'پیام ح.',   s: 8192, u:'پ', a:'#fcd34d'}, {n:'نگار ر.',   s: 6144, u:'ن', a:'#fcd34d'}, {n:'تو', s: 4728, u:'', a:'#fcd34d', me:true}, {n:'مهدی ک.',   s: 3872, u:'م', a:'#34d399'}, {n:'سارا م.',   s: 3200, u:'س', a:'#60a5fa'}, {n:'علی ب.',   s: 2944, u:'ع', a:'#f97316'}, {n:'ریحانه',   s: 1856, u:'ر', a:'#e879f9'}],
  flappy: [{n:'سارا م.',   s: 47, u:'س', a:'#60a5fa'}, {n:'علی ب.',   s: 38, u:'ع', a:'#f97316'}, {n:'نگار ر.',   s: 29, u:'ن', a:'#fcd34d'}, {n:'تو', s: 23, u:'', a:'#60a5fa', me:true}, {n:'مهدی ک.',   s: 18, u:'م', a:'#34d399'}, {n:'پیام ح.',   s: 14, u:'پ', a:'#c4b5fd'}, {n:'ریحانه',   s: 9, u:'ر', a:'#e879f9'}],
  memory: [{n:'ریحانه',   s: 12, u:'ر', a:'#c4b5fd'}, {n:'نگار ر.',   s: 18, u:'ن', a:'#fcd34d'}, {n:'سارا م.',   s: 22, u:'س', a:'#60a5fa'}, {n:'مهدی ک.',   s: 28, u:'م', a:'#34d399'}, {n:'تو', s: 42, u:'', a:'#c4b5fd', me:true}, {n:'پیام ح.',   s: 48, u:'پ', a:'#c4b5fd'}, {n:'علی ب.',   s: 56, u:'ع', a:'#f97316'}],
};

function GameLeaderboard({ gameId }) {
  const g = GAMES.find(x => x.id === gameId) || GAMES[0];
  const leaders = LEADERS_BY_GAME[g.id] || [];
  const lowerIsBetter = g.id === 'memory'; // moves — fewer is better
  return (
    <GameFrame accent={g.accent}>
      <GameTopChrome
        title={g.label}
        emoji={g.emoji}
        subtitle="لیدربورد"
        right={(
          <div style={{
            width: 38, height: 38, borderRadius: 11,
            background: 'rgba(31,46,40,0.6)', border: '1px solid rgba(110,231,183,0.14)',
            display: 'grid', placeItems: 'center',
          }}>
            <AYIcon name="search" size={14} color="#e8efea"/>
          </div>
        )}
      />

      <div style={{ position: 'absolute', top: 80, bottom: 0, left: 0, right: 0, overflow: 'auto' }}>
        <div style={{ padding: '14px 20px 40px' }}>
          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, padding: 4,
            background: 'rgba(31,46,40,0.5)', border: '1px solid rgba(110,231,183,0.08)',
            borderRadius: 12,
          }}>
            {[
              { k: 'all-time', label: 'همهٔ زمان‌ها', on: true },
              { k: 'week', label: 'این هفته' },
              { k: 'friends', label: 'دوستان' },
            ].map(t => (
              <div key={t.k} style={{
                flex: 1, padding: '8px 0', textAlign: 'center',
                borderRadius: 9, fontSize: 11.5, fontWeight: t.on ? 800 : 500,
                color: t.on ? '#04110a' : 'rgba(232,239,234,0.55)',
                background: t.on ? g.accent : 'transparent',
              }}>{t.label}</div>
            ))}
          </div>

          {/* Top 3 podium */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: 8,
            alignItems: 'end', marginBottom: 18, minHeight: 180,
          }}>
            {[
              { ...leaders[1], rank: 2, h: 100, medal: '🥈' },
              { ...leaders[0], rank: 1, h: 140, medal: '🥇' },
              { ...leaders[2], rank: 3, h: 80, medal: '🥉' },
            ].map((p, i) => (
              <div key={i} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{p.medal}</div>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: p.a, color: '#04110a',
                  display: 'grid', placeItems: 'center',
                  fontFamily: AYG.font.display, fontWeight: 900, fontSize: 18,
                  border: `2px solid ${g.accent}`,
                  boxShadow: `0 0 16px ${g.accent}66`,
                  marginBottom: 6,
                }}>
                  {p.u}
                </div>
                <div style={{ fontWeight: 700, fontSize: 11, color: '#e8efea', marginBottom: 2, textAlign: 'center' }}>{p.n}</div>
                <div style={{ fontFamily: AYG.font.mono, fontSize: 12, fontWeight: 900, color: g.accent, marginBottom: 8 }}>
                  {AY_FA(p.s.toLocaleString('fa-IR'))}
                </div>
                <div style={{
                  width: '100%', height: p.h,
                  borderRadius: '10px 10px 0 0',
                  background: p.rank === 1
                    ? `linear-gradient(180deg, ${g.accent} 0%, ${g.accentDeep} 100%)`
                    : `linear-gradient(180deg, ${g.accent}66 0%, ${g.accent}22 100%)`,
                  display: 'grid', placeItems: 'center', position: 'relative',
                  boxShadow: p.rank === 1 ? `0 0 24px ${g.accent}66` : 'none',
                }}>
                  <div style={{
                    fontFamily: AYG.font.mono, fontSize: 26, fontWeight: 900,
                    color: p.rank === 1 ? '#04110a' : 'rgba(232,239,234,0.9)',
                    lineHeight: 1,
                  }}>
                    {AY_FA(p.rank)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Rest of list */}
          <div style={{ fontFamily: AYG.font.mono, fontSize: 10, letterSpacing: 2, color: g.accent, textTransform: 'uppercase', marginBottom: 8, fontWeight: 700 }}>
            رتبهٔ ۴ به بعد
          </div>
          <div style={{ display: 'grid', gap: 6 }}>
            {leaders.slice(3).map((p, i) => {
              const rank = i + 4;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px',
                  borderRadius: 12,
                  background: p.me
                    ? `linear-gradient(180deg, ${g.accent}22 0%, ${g.accent}0a 100%)`
                    : 'rgba(31,46,40,0.5)',
                  border: `1px solid ${p.me ? g.accent + '66' : 'rgba(110,231,183,0.08)'}`,
                  boxShadow: p.me ? `0 0 12px ${g.accent}33` : 'none',
                }}>
                  <div style={{
                    width: 28, fontFamily: AYG.font.mono, fontSize: 14, fontWeight: 900,
                    color: p.me ? g.accent : 'rgba(232,239,234,0.5)', textAlign: 'center',
                  }}>
                    {AY_FA(rank)}
                  </div>
                  <div style={{
                    width: 34, height: 34, borderRadius: 10,
                    background: p.a, color: '#04110a',
                    display: 'grid', placeItems: 'center',
                    fontWeight: 900, fontSize: 14,
                  }}>
                    {p.u || '🙂'}
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ fontWeight: p.me ? 800 : 600, fontSize: 12.5, color: '#e8efea' }}>
                      {p.n}
                    </div>
                    {p.me && (
                      <div style={{
                        padding: '2px 7px', borderRadius: 999,
                        background: g.accent, color: '#04110a',
                        fontFamily: AYG.font.display, fontSize: 9, fontWeight: 800,
                      }}>
                        تو
                      </div>
                    )}
                  </div>
                  <div style={{ fontFamily: AYG.font.mono, fontSize: 13, fontWeight: 800, color: p.me ? g.accent : '#e8efea' }}>
                    {AY_FA(p.s.toLocaleString('fa-IR'))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Your rank card */}
          <div style={{ marginTop: 18 }}>
            <div style={{
              padding: '14px 16px',
              borderRadius: 14,
              background: `linear-gradient(180deg, ${g.accent}1a 0%, rgba(31,46,40,0.5) 100%)`,
              border: `1px solid ${g.accent}44`,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <MascotArt state="thinking" frame={0} blink={false} scale={2} accent={g.accent}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11.5, color: 'rgba(232,239,234,0.65)', marginBottom: 2 }}>
                  برای رسیدن به رتبهٔ ۳
                </div>
                <div style={{ fontWeight: 800, fontSize: 13, color: '#e8efea' }}>
                  {lowerIsBetter ? (
                    <>۶ حرکت کمتر لازم داری</>
                  ) : (
                    <>{AY_FA('۱۷')} امتیاز بیشتر لازم داری</>
                  )}
                </div>
              </div>
              <div style={{
                padding: '8px 14px', borderRadius: 10,
                background: g.accent, color: '#04110a',
                fontWeight: 800, fontSize: 11,
              }}>
                بازی کن
              </div>
            </div>
          </div>
        </div>
      </div>
    </GameFrame>
  );
}

// Export
Object.assign(window, {
  GamesHub,
  GameIntro,
  GamePlayFrame,
  GameResult,
  GameLeaderboard,
  GAMES_LIST: GAMES,
});
