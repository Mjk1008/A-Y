// A-Y — Pixel Mascot (interactive)
// • Idle blink every ~3.5s
// • Click to cycle reactions: wave → bounce → surprise → sparkle
// • Optional mini-chat bubble with typewriter
// Pure SVG pixels; scale via prop. Colors pulled from AY.

const AYM = window.AY;

// Pixel primitive — integer-snapped rect
function MPx({ x, y, w = 1, h = 1, c }) {
  return <rect x={x} y={y} width={w} height={h} fill={c} shapeRendering="crispEdges"/>;
}

// ── Mascot SVG (blob-ish, from-behind) ──────────────────────
// Returns the 24×22 pixel art at the given scale, with all state-driven frames.
function MascotArt({ state = 'idle', frame = 0, blink = false, scale = 6, accent = '#34d399' }) {
  // Palette — Cream-era fur with emerald heart
  const body    = '#cfe8dc';
  const bodyHi  = '#e6f4ec';
  const bodySh  = '#8cb5a2';
  const dark    = '#0a1a14';
  const blush   = '#fca5a5';

  // From-behind blob: big rounded body, two ear nubs, emerald heart on back
  // Grid: 24×22

  // Base anchors
  let bobY = 0;
  let armTilt = 0;      // for wave
  let scaleJump = 1;    // for bounce (applied via transform)
  let sparkleOn = false;
  let heartBeat = 1;

  if (state === 'idle') {
    bobY = (frame % 2 === 0) ? 0 : -0.5;
  }
  if (state === 'wave') {
    armTilt = [0, -3, -5, -3, 0][frame % 5];
  }
  if (state === 'bounce') {
    const f = frame % 6;
    bobY = [0, -1.2, -2, -1.2, 0, 0.3][f];
    scaleJump = [1, 1.01, 1.02, 1.01, 1, 0.99][f];
  }
  if (state === 'surprise') {
    bobY = (frame % 2 === 0) ? -0.5 : -0.3;
    heartBeat = (frame % 2 === 0) ? 1.2 : 1;
  }
  if (state === 'sparkle') {
    sparkleOn = true;
    heartBeat = 1 + 0.15 * Math.sin(frame * 0.8);
  }

  const svgW = 24 * scale;
  const svgH = 24 * scale;

  return (
    <svg
      width={svgW}
      height={svgH}
      viewBox="0 0 24 24"
      style={{ imageRendering: 'pixelated', overflow: 'visible', display: 'block' }}
    >
      <g transform={`translate(0, ${bobY}) scale(${scaleJump}) translate(${(1 - scaleJump) * 12}, ${(1 - scaleJump) * 12})`}>
        {/* Ears (two nubs, tiny) */}
        <MPx x={7}  y={5} c={bodySh}/>
        <MPx x={7}  y={6} c={body}/>
        <MPx x={16} y={5} c={bodySh}/>
        <MPx x={16} y={6} c={body}/>

        {/* Head+body — single egg/blob */}
        {/* Top of head */}
        <MPx x={9}  y={5} w={6} c={body}/>
        <MPx x={8}  y={6} w={8} c={body}/>
        <MPx x={7}  y={7} w={10} c={body}/>
        {/* Highlight on top */}
        <MPx x={9}  y={6} w={3}  c={bodyHi}/>

        {/* Body rows */}
        <MPx x={6}  y={8}  w={12} c={body}/>
        <MPx x={5}  y={9}  w={14} c={body}/>
        <MPx x={5}  y={10} w={14} c={body}/>
        <MPx x={5}  y={11} w={14} c={body}/>
        <MPx x={5}  y={12} w={14} c={body}/>
        <MPx x={5}  y={13} w={14} c={body}/>
        <MPx x={6}  y={14} w={12} c={body}/>
        <MPx x={6}  y={15} w={12} c={body}/>
        <MPx x={7}  y={16} w={10} c={bodySh}/>

        {/* Side shading (right) */}
        <MPx x={18} y={9}  c={bodySh}/>
        <MPx x={18} y={10} c={bodySh}/>
        <MPx x={18} y={11} c={bodySh}/>
        <MPx x={18} y={12} c={bodySh}/>
        <MPx x={18} y={13} c={bodySh}/>

        {/* Emerald heart on back (glows with heartBeat via filter stroke) */}
        {/* Heart: 4×3 compact pixel heart */}
        <g transform={`translate(${11 + (1 - heartBeat) * 1}, ${10 + (1 - heartBeat) * 1}) scale(${heartBeat})`}>
          <MPx x={0} y={0} c={accent}/>
          <MPx x={2} y={0} c={accent}/>
          <MPx x={0} y={1} w={3} c={accent}/>
          <MPx x={1} y={2} c={accent}/>
        </g>
        {/* Heart halo when idle/sparkle */}
        {(state === 'idle' || state === 'sparkle' || state === 'surprise') && (
          <circle cx={12.5} cy={11.5} r={2.5} fill="none" stroke={accent} strokeWidth={0.18} opacity={0.5}/>
        )}

        {/* Feet — 2 tiny pixels */}
        <MPx x={9}  y={17} c={dark}/>
        <MPx x={14} y={17} c={dark}/>

        {/* Blush (visible only on surprise/sparkle — tiny side-dots) */}
        {(state === 'surprise' || state === 'sparkle') && (
          <>
            <MPx x={5}  y={11} c={blush}/>
            <MPx x={18} y={11} c={blush}/>
          </>
        )}

        {/* Wave arm (right side, tilts up) */}
        {state === 'wave' && (
          <g transform={`translate(19, ${9 + armTilt})`}>
            <MPx x={0} y={0} c={body}/>
            <MPx x={0} y={1} c={body}/>
            <MPx x={1} y={0} c={body}/>
          </g>
        )}

        {/* Shadow — 3 pixel squares, crisp (no blur) */}
        <g opacity={0.55}>
          <MPx x={8}  y={19} w={8} c={'#030806'}/>
          <MPx x={9}  y={20} w={6} c={'#030806'}/>
        </g>
      </g>

      {/* Blink (a tiny dark line near top — just a hint since we're from behind) */}
      {blink && (
        <g>
          <MPx x={10} y={7} c={dark}/>
          <MPx x={13} y={7} c={dark}/>
        </g>
      )}

      {/* Sparkles (orbit around head) */}
      {sparkleOn && (
        <g>
          {[0, 1, 2, 3].map(i => {
            const ang = (frame * 0.4 + i * Math.PI / 2);
            const cx = 12 + Math.cos(ang) * 9;
            const cy = 11 + Math.sin(ang) * 6;
            return (
              <g key={i}>
                <MPx x={cx}     y={cy - 0.5} c={accent}/>
                <MPx x={cx - 0.5} y={cy}     c={accent}/>
                <MPx x={cx + 0.5} y={cy}     c={accent}/>
                <MPx x={cx}     y={cy + 0.5} c={accent}/>
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
}

// ── Chat bubble (pixel-edged, with typewriter) ─────────────
function MascotBubble({ text, visible = true, side = 'right' }) {
  const [shown, setShown] = useState('');
  useEffect(() => {
    if (!visible || !text) { setShown(''); return; }
    let i = 0;
    setShown('');
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, [text, visible]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'relative',
      maxWidth: 220,
      padding: '10px 14px',
      background: 'linear-gradient(180deg, rgba(31,46,40,0.92) 0%, rgba(18,30,24,0.88) 100%)',
      border: '1px solid rgba(110,231,183,0.28)',
      borderRadius: 14,
      boxShadow: '0 8px 28px rgba(0,0,0,0.45), 0 0 0 1px rgba(52,211,153,0.06)',
      fontFamily: AYM.font.display,
      fontSize: 12.5,
      fontWeight: 600,
      lineHeight: 1.55,
      color: '#e8efea',
      direction: 'rtl',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
    }}>
      {shown}
      <span style={{ display: 'inline-block', width: 2, height: 14, background: '#34d399', marginInlineStart: 2, verticalAlign: 'middle', animation: 'ay-caret 1s steps(2) infinite' }}/>
      {/* Tail */}
      <div style={{
        position: 'absolute',
        bottom: -6,
        [side === 'right' ? 'right' : 'left']: 22,
        width: 10, height: 10,
        background: 'rgba(31,46,40,0.92)',
        borderLeft: side === 'left'  ? '1px solid rgba(110,231,183,0.28)' : 'none',
        borderBottom: '1px solid rgba(110,231,183,0.28)',
        borderRight: side === 'right' ? '1px solid rgba(110,231,183,0.28)' : 'none',
        transform: 'rotate(-45deg)',
      }}/>
    </div>
  );
}

// ── PixelMascot — full interactive mascot ──────────────────
// Props: scale, defaultState, bubble, autoCycle, onReact
function PixelMascot({
  scale = 6,
  defaultState = 'idle',
  bubble = null,
  autoCycle = false,
  accent = '#34d399',
  onReact,
}) {
  const [state, setState] = useState(defaultState);
  const [frame, setFrame] = useState(0);
  const [blink, setBlink] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(!!bubble);

  // Frame ticker — 10fps
  useEffect(() => {
    const id = setInterval(() => setFrame(f => (f + 1) % 60), 100);
    return () => clearInterval(id);
  }, []);

  // Blink loop (idle only) — every ~3.5s, blink for 140ms
  useEffect(() => {
    if (state !== 'idle') return;
    const id = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 140);
    }, 3500);
    return () => clearInterval(id);
  }, [state]);

  // Auto return to idle after non-idle states
  useEffect(() => {
    if (state === 'idle') return;
    const ms = state === 'bounce' ? 900 : state === 'surprise' ? 1100 : state === 'wave' ? 1500 : state === 'sparkle' ? 2200 : 1200;
    const id = setTimeout(() => setState('idle'), ms);
    return () => clearTimeout(id);
  }, [state]);

  // Auto cycle states for demo
  useEffect(() => {
    if (!autoCycle) return;
    const seq = ['wave', 'bounce', 'sparkle', 'surprise'];
    let i = 0;
    const id = setInterval(() => {
      setState(seq[i % seq.length]);
      i++;
    }, 3000);
    return () => clearInterval(id);
  }, [autoCycle]);

  const handleClick = () => {
    const cycle = ['wave', 'bounce', 'surprise', 'sparkle'];
    const cur = cycle.indexOf(state);
    const next = cycle[(cur + 1) % cycle.length];
    setState(next);
    setBubbleVisible(true);
    if (onReact) onReact(next);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Bubble above */}
      {bubble && bubbleVisible && (
        <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translate(-50%, -8px)', zIndex: 10 }}>
          <MascotBubble text={bubble} visible={true}/>
        </div>
      )}
      {/* Clickable mascot */}
      <button
        onClick={handleClick}
        aria-label="mascot"
        style={{
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          display: 'inline-block',
          outline: 'none',
        }}
      >
        <MascotArt state={state} frame={frame} blink={blink} scale={scale} accent={accent}/>
      </button>
    </div>
  );
}

// Export
window.PixelMascot = PixelMascot;
window.MascotArt = MascotArt;
window.MascotBubble = MascotBubble;
