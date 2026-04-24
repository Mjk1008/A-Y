// A-Y — Pixel Universe Scene (v2: minimal + cute round robot)
// The cinematic backdrop: a minimal pixel world.
// Robot is a round melancholy blob viewed from behind.

const { useEffect, useRef, useState } = React;

// Grain (kept subtle)
function GrainLayer({ opacity = 0.04 }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='5'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.7 0'/></filter><rect width='180' height='180' filter='url(%23n)' opacity='1'/></svg>")`,
      opacity, mixBlendMode: 'overlay', zIndex: 100,
    }}/>
  );
}

// Aurora — softer, more restrained
function Aurora({ hue = 'emerald', intensity = 1 }) {
  const map = {
    emerald: ['rgba(16,185,129,0.22)', 'rgba(52,211,153,0.14)', 'rgba(4,120,87,0.20)'],
    teal:    ['rgba(20,184,166,0.22)', 'rgba(45,212,191,0.14)', 'rgba(15,118,110,0.20)'],
    cyan:    ['rgba(6,182,212,0.22)',  'rgba(34,211,238,0.14)', 'rgba(14,116,144,0.20)'],
    lime:    ['rgba(132,204,22,0.22)', 'rgba(163,230,53,0.14)', 'rgba(77,124,15,0.20)'],
  };
  const [a, b, c] = map[hue] || map.emerald;
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 60% 40% at 30% 20%, ${a}, transparent 65%)`, opacity: intensity }}/>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 50% 35% at 80% 10%, ${b}, transparent 60%)`, opacity: intensity }}/>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 70% 40% at 50% 110%, ${c}, transparent 60%)`, opacity: intensity }}/>
    </>
  );
}

// Starfield — tiny pixel dots (no blur, crisp)
function Starfield({ count = 24, seed = 1 }) {
  const stars = React.useMemo(() => {
    const r = (i) => { let x = Math.sin(i * 9301 + seed * 49297) * 233280; return x - Math.floor(x); };
    return Array.from({ length: count }, (_, i) => ({
      x: r(i * 3) * 100, y: r(i * 3 + 1) * 70,
      s: r(i * 3 + 2) > 0.7 ? 2 : 1,
      o: 0.3 + r(i * 3 + 4) * 0.5,
      d: 2 + r(i * 3 + 5) * 4,
    }));
  }, [count, seed]);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {stars.map((st, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${st.x}%`, top: `${st.y}%`,
          width: st.s, height: st.s, background: '#6ee7b7', opacity: st.o,
          animation: `ay-twinkle ${st.d}s ease-in-out ${i * 0.11}s infinite`,
        }}/>
      ))}
    </div>
  );
}

// Horizon — dashed pixel grid, crisp + minimal
function Horizon({ y = 62 }) {
  return (
    <svg viewBox="0 0 400 600" preserveAspectRatio="none" style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      pointerEvents: 'none', opacity: 0.55, shapeRendering: 'crispEdges',
    }}>
      <line x1="0" y1={`${y}%`} x2="400" y2={`${y}%`} stroke="rgba(110,231,183,0.35)" strokeWidth="1" strokeDasharray="3 3"/>
      {[-3, -2, -1, 0, 1, 2, 3].map(i => (
        <line key={i} x1={200 + i * 55} y1="100%" x2="200" y2={`${y}%`}
          stroke="rgba(110,231,183,0.12)" strokeWidth="1" strokeDasharray="2 3"/>
      ))}
      {[0.18, 0.4, 0.7].map((t, i) => (
        <line key={i} x1="0" y1={`${y + (100 - y) * t}%`} x2="400" y2={`${y + (100 - y) * t}%`}
          stroke="rgba(110,231,183,0.08)" strokeWidth="1"/>
      ))}
    </svg>
  );
}

// ────────────────────────────────────────────────
// PixelRobot — round cute melancholy blob, from behind
// 14×14 grid, single rounded body shape, tiny ear-antennae,
// glowing heart dot on back. Chunky visible pixels.
// ────────────────────────────────────────────────
function PixelRobot({ pose = 'stand', scale = 5, accent = '#34d399' }) {
  // Palette — just 3 tones for minimal look
  const body  = '#e8efea';       // near-white body
  const shade = '#8aa99b';       // single shadow tone
  const dark  = '#0a1a14';

  const px = (x, y, c, w = 1, h = 1, k) =>
    <rect key={k || `${x}-${y}-${c}-${w}-${h}`} x={x} y={y} width={w} height={h} fill={c} shapeRendering="crispEdges"/>;

  // Pose variables: lift = vertical offset, legGap = feet stance
  let lift = 0, earTilt = 0;
  if (pose === 'run')    { lift = -1; }
  if (pose === 'look-up'){ lift = 0; earTilt = -0.5; }
  if (pose === 'sit')    { lift = 2; }
  if (pose === 'climb')  { lift = -1; }

  return (
    <svg width={14 * scale} height={16 * scale} viewBox="0 0 14 16"
      style={{ imageRendering: 'pixelated', overflow: 'visible' }}>
      <g transform={`translate(0, ${lift})`}>
        {/* tiny ear/antenna nubs (rounded pill shape) */}
        {px(3, 1 + earTilt, body, 1, 1, 'earL')}
        {px(10, 1 - earTilt, body, 1, 1, 'earR')}

        {/* head/body — one rounded blob (like a chubby egg from behind)
            Row 2 (top, rounded): cols 4-9
            Row 3: cols 3-10
            Rows 4-9 (widest): cols 2-11
            Row 10: cols 3-10
            Row 11 (rounded bottom): cols 4-9 */}
        {px(4, 2, body, 6, 1)}
        {px(3, 3, body, 8, 1)}
        {px(2, 4, body, 10, 1)}
        {px(2, 5, body, 10, 1)}
        {px(2, 6, body, 10, 1)}
        {px(2, 7, body, 10, 1)}
        {px(2, 8, body, 10, 1)}
        {px(2, 9, body, 10, 1)}
        {px(3, 10, body, 8, 1)}
        {px(4, 11, body, 6, 1)}

        {/* bottom shadow (belly/underside curve) — just under belly */}
        {px(3, 10, shade, 8, 1)}
        {px(4, 11, shade, 6, 1)}

        {/* side shade (left edge, makes it look 3D-round) */}
        {px(2, 4, shade, 1, 6)}

        {/* center seam (back spine) — 1px vertical */}
        {px(6, 4, shade, 1, 6, 'seam')}

        {/* glowing heart — a single bright pixel on the back */}
        {px(6, 6, accent, 2, 2, 'heart')}
        {px(7, 6, '#ffffff', 1, 1, 'heartHL')}

        {/* feet — two tiny dark squares poking out, positioned by pose */}
        {pose === 'sit' ? (
          <>
            {px(3, 11, dark, 2, 1, 'footL')}
            {px(9, 11, dark, 2, 1, 'footR')}
          </>
        ) : pose === 'run' ? (
          <>
            {px(3, 12, dark, 2, 1, 'footL')}
            {px(9, 12, dark, 2, 1, 'footR')}
          </>
        ) : pose === 'climb' ? (
          <>
            {px(3, 12, dark, 2, 1, 'footL')}
            {px(9, 11, dark, 2, 1, 'footR')}
          </>
        ) : (
          <>
            {px(4, 12, dark, 2, 1, 'footL')}
            {px(8, 12, dark, 2, 1, 'footR')}
          </>
        )}
      </g>
    </svg>
  );
}

// ────────────────────────────────────────────────
// Pixel glyphs — minimal (smaller, fewer)
// ────────────────────────────────────────────────
function PixelGlyph({ kind = 'cube', size = 4, accent = '#34d399' }) {
  const body = '#e8efea';
  const gold = '#facc15';
  const px = (x, y, c, w = 1, h = 1) =>
    <rect key={`g-${x}-${y}-${c}-${w}-${h}`} x={x} y={y} width={w} height={h} fill={c} shapeRendering="crispEdges"/>;

  const glyphs = {
    cube: [
      px(2, 2, body, 4, 4),
      px(3, 3, accent, 2, 2),
    ],
    diamond: [
      px(3, 1, accent, 2, 1),
      px(2, 2, accent, 4, 1),
      px(1, 3, accent, 6, 2),
      px(2, 5, accent, 4, 1),
      px(3, 6, accent, 2, 1),
    ],
    orb: [
      px(2, 1, body, 4, 1),
      px(1, 2, body, 6, 4),
      px(2, 6, body, 4, 1),
    ],
    star: [
      px(3, 1, gold, 2, 1),
      px(1, 3, gold, 6, 2),
      px(3, 5, gold, 2, 1),
    ],
    chip: [
      px(2, 2, body, 4, 4),
      px(0, 3, accent, 1, 1), px(7, 3, accent, 1, 1),
      px(0, 4, accent, 1, 1), px(7, 4, accent, 1, 1),
      px(3, 0, accent, 1, 1), px(4, 0, accent, 1, 1),
      px(3, 7, accent, 1, 1), px(4, 7, accent, 1, 1),
    ],
    ring: [
      px(2, 1, accent, 4, 1),
      px(1, 2, accent, 1, 4),
      px(6, 2, accent, 1, 4),
      px(2, 6, accent, 4, 1),
    ],
    plus: [
      px(3, 1, accent, 2, 6),
      px(1, 3, accent, 6, 2),
    ],
  };
  return (
    <svg width={8 * size} height={8 * size} viewBox="0 0 8 8" style={{ imageRendering: 'pixelated', overflow: 'visible' }}>
      {glyphs[kind] || glyphs.cube}
    </svg>
  );
}

// ────────────────────────────────────────────────
// Scene — minimal & pixel-forward
// ────────────────────────────────────────────────
function Scene({ variant = 'run', hue = 'emerald', depth = 1, children }) {
  const variants = {
    'run':    { pose: 'run',     robotY: '62%' },
    'hero':   { pose: 'look-up', robotY: '70%' },
    'stand':  { pose: 'stand',   robotY: '66%' },
    'sit':    { pose: 'sit',     robotY: '70%' },
    'climb':  { pose: 'climb',   robotY: '55%' },
    'orbit':  { pose: 'stand',   robotY: '68%' },
    'wave':   { pose: 'stand',   robotY: '66%' },
  };
  const v = variants[variant] || variants.run;

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      background: 'radial-gradient(ellipse 120% 80% at 50% 0%, #07120d 0%, #040807 55%, #020306 100%)',
    }}>
      <Aurora hue={hue} intensity={depth}/>
      <Starfield count={28} seed={variant.length}/>
      <Horizon y={58}/>

      {/* floating glyphs — fewer, smaller, pixel-crisp */}
      {variant === 'hero' && (
        <>
          <div style={{ position: 'absolute', top: '20%', left: '18%', animation: 'ay-float 7s ease-in-out infinite' }}>
            <PixelGlyph kind="plus" size={2}/>
          </div>
          <div style={{ position: 'absolute', top: '14%', right: '22%', animation: 'ay-float 8s ease-in-out 1s infinite' }}>
            <PixelGlyph kind="diamond" size={2}/>
          </div>
          <div style={{ position: 'absolute', top: '34%', left: '72%', animation: 'ay-float 6s ease-in-out 2s infinite' }}>
            <PixelGlyph kind="cube" size={1.8}/>
          </div>
          <div style={{ position: 'absolute', top: '38%', left: '12%', animation: 'ay-float 9s ease-in-out 0.5s infinite' }}>
            <PixelGlyph kind="ring" size={1.8}/>
          </div>
        </>
      )}

      {variant === 'orbit' && (
        <div style={{
          position: 'absolute', top: '34%', left: '50%', width: 200, height: 200,
          transform: 'translate(-50%, 0)', animation: 'ay-spin 22s linear infinite',
        }}>
          {[0, 72, 144, 216, 288].map((deg, i) => {
            const kinds = ['cube', 'chip', 'diamond', 'ring', 'plus'];
            return (
              <div key={i} style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: `rotate(${deg}deg) translate(90px) rotate(-${deg}deg)`,
              }}>
                <PixelGlyph kind={kinds[i]} size={1.8}/>
              </div>
            );
          })}
        </div>
      )}

      {variant === 'climb' && (
        <svg viewBox="0 0 400 400" preserveAspectRatio="none" style={{
          position: 'absolute', left: 0, right: 0, bottom: '20%', width: '100%', height: '60%',
          opacity: 0.8, shapeRendering: 'crispEdges',
        }}>
          {[0, 1, 2, 3, 4].map(i => (
            <g key={i} opacity={1 - i * 0.16}>
              <rect x={160 - i * 6} y={300 - i * 38} width={80 + i * 12} height={6}
                fill="rgba(52,211,153,0.35)"/>
              <rect x={160 - i * 6} y={306 - i * 38} width={80 + i * 12} height={2}
                fill="rgba(110,231,183,0.85)"/>
            </g>
          ))}
        </svg>
      )}

      {/* robot */}
      <div style={{
        position: 'absolute', top: v.robotY, left: '50%',
        transform: 'translate(-50%, -100%)',
        animation: variant === 'run' ? 'ay-run-bob 0.28s steps(2) infinite'
                 : 'ay-breathe 3.5s ease-in-out infinite',
        filter: 'drop-shadow(0 0 14px rgba(16,185,129,0.35))',
      }}>
        <PixelRobot pose={v.pose} scale={4}/>
      </div>

      {/* pixel shadow under robot — 3 crisp squares, no blur */}
      <div style={{
        position: 'absolute', top: v.robotY, left: '50%',
        transform: 'translate(-50%, 4px)',
        display: 'flex', gap: 2,
      }}>
        <div style={{ width: 6, height: 2, background: 'rgba(0,0,0,0.4)' }}/>
        <div style={{ width: 18, height: 2, background: 'rgba(0,0,0,0.55)' }}/>
        <div style={{ width: 6, height: 2, background: 'rgba(0,0,0,0.4)' }}/>
      </div>

      <GrainLayer opacity={0.04}/>
      {children}
    </div>
  );
}

Object.assign(window, { Scene, PixelRobot, PixelGlyph, Aurora, Starfield, Horizon, GrainLayer });
