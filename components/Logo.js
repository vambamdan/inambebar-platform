'use client'
// Inambebar Logo Kit — generated from design handoff
// Mark: symmetric two-wing suitcase, no halo
// viewBox "-24 -4 152 136"

const NAVY  = '#1A2744'
const AMBER = '#E07B29'
const WHITE = '#FFFFFF'

/* ── Wing primitives ── */
function WingRight({ fill }) {
  return (
    <>
      <path d="M78,86 C97,72 108,52 100,32 C91,50 82,68 78,80 Z" fill={fill} opacity="0.35"/>
      <path d="M78,72 C100,53 110,27 102,10 C91,28 83,52 78,65 Z" fill={fill} opacity="0.65"/>
      <path d="M78,56 C102,32 112,6 106,2 C95,14 84,38 78,50 Z"  fill={fill}/>
    </>
  )
}
function WingLeft({ fill }) {
  return (
    <g transform="scale(-1,1) translate(-90,0)">
      <WingRight fill={fill}/>
    </g>
  )
}

/* ── Suitcase primitive ── */
function Suitcase({ fill = NAVY, stripe = AMBER, wheelColor }) {
  const w = wheelColor || fill
  return (
    <>
      {/* Handle */}
      <line x1="31" y1="5"  x2="31" y2="24" stroke={fill} strokeWidth="3.5" strokeLinecap="round"/>
      <line x1="55" y1="5"  x2="55" y2="24" stroke={fill} strokeWidth="3.5" strokeLinecap="round"/>
      <line x1="31" y1="5"  x2="55" y2="5"  stroke={fill} strokeWidth="3.5" strokeLinecap="round"/>
      {/* Handle base */}
      <rect x="24" y="20" width="38" height="8" rx="4" fill={fill}/>
      {/* Body */}
      <rect x="12" y="26" width="66" height="76" rx="9" fill={fill}/>
      {/* Amber stripe */}
      {stripe && <rect x="12" y="54" width="66" height="3.5" fill={stripe}/>}
      {/* Wheels */}
      <circle cx="25" cy="108" r="5.5" fill={w}/>
      <circle cx="65" cy="108" r="5.5" fill={w}/>
    </>
  )
}

/* ── Mark variants ── */
export function MarkLight({ size = 120 }) {
  const h = size * (120 / 152)
  return (
    <svg width={size} height={h} viewBox="-24 -4 152 136" fill="none">
      <WingLeft  fill={AMBER}/>
      <WingRight fill={AMBER}/>
      <Suitcase fill={NAVY} stripe={AMBER}/>
    </svg>
  )
}

export function MarkDark({ size = 120 }) {
  const h = size * (120 / 152)
  return (
    <svg width={size} height={h} viewBox="-24 -4 152 136" fill="none">
      <WingLeft  fill={AMBER}/>
      <WingRight fill={AMBER}/>
      <Suitcase fill={WHITE} stripe="rgba(255,255,255,0.25)" wheelColor={WHITE}/>
    </svg>
  )
}

/* ── Favicon mark (32×32, with background) ── */
export function FavMark({ size = 32, radius = 6 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <rect width="32" height="32" rx={radius} fill={AMBER}/>
      {/* Tiny wings */}
      <path d="M10,20 C6,17 4,12 6,8 C8,12 9,16 10,18 Z"  fill={NAVY} opacity="0.6"/>
      <path d="M10,17 C5,14 3,9 5,5 C7,9 9,14 10,15 Z"    fill={NAVY}/>
      <path d="M22,20 C26,17 28,12 26,8 C24,12 23,16 22,18 Z" fill={NAVY} opacity="0.6"/>
      <path d="M22,17 C27,14 29,9 27,5 C25,9 23,14 22,15 Z"   fill={NAVY}/>
      {/* Suitcase body */}
      <rect x="9"  y="11" width="14" height="14" rx="2" fill={WHITE}/>
      <rect x="9"  y="17" width="14" height="1.5" fill={AMBER}/>
      {/* Handle base */}
      <rect x="12" y="8.5" width="8" height="3.5" rx="1.5" fill={WHITE}/>
      {/* Handle struts */}
      <line x1="13.5" y1="6" x2="13.5" y2="8.5" stroke={WHITE} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="18.5" y1="6" x2="18.5" y2="8.5" stroke={WHITE} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="13.5" y1="6" x2="18.5" y2="6"   stroke={WHITE} strokeWidth="1.5" strokeLinecap="round"/>
      {/* Wheels */}
      <circle cx="12" cy="27" r="1.5" fill={WHITE}/>
      <circle cx="20" cy="27" r="1.5" fill={WHITE}/>
    </svg>
  )
}

/* ── Horizontal lockup (navbar) ── */
export function LogoHorizontal({ dark = false, markSize = 38 }) {
  const Mark      = dark ? MarkDark : MarkLight
  const nameColor = dark ? WHITE : NAVY
  const subColor  = dark ? 'rgba(255,255,255,0.42)' : 'rgba(26,40,68,0.42)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Mark size={markSize}/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, lineHeight: 1 }}>
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          fontSize: 17,
          letterSpacing: '-0.025em',
          color: nameColor,
        }}>Inambebar</span>
        <span style={{
          fontFamily: "'Vazirmatn', sans-serif",
          fontWeight: 400,
          fontSize: 11,
          color: subColor,
          direction: 'rtl',
        }}>اینم ببر</span>
      </div>
    </div>
  )
}

/* ── Vertical / stacked lockup (hero, footer) ── */
export function LogoStacked({ dark = false, markSize = 80, nameSize = 22 }) {
  const Mark      = dark ? MarkDark : MarkLight
  const nameColor = dark ? WHITE : NAVY
  const subColor  = dark ? 'rgba(255,255,255,0.42)' : 'rgba(26,40,68,0.42)'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <Mark size={markSize}/>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          fontSize: nameSize,
          letterSpacing: '-0.025em',
          color: nameColor,
          lineHeight: 1,
        }}>Inambebar</span>
        <span style={{
          fontFamily: "'Vazirmatn', sans-serif",
          fontWeight: 400,
          fontSize: nameSize * 0.55,
          color: subColor,
          direction: 'rtl',
        }}>اینم ببر</span>
      </div>
    </div>
  )
}
