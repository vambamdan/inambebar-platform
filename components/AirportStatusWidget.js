'use client'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

// ── ATC color palette ──────────────────────────────────────────────────────
const C = {
  bg:          '#030c16',
  panel:       '#040d1a',
  green:       '#00e87a',
  greenDim:    'rgba(0,232,122,0.35)',
  greenFaint:  'rgba(0,232,122,0.07)',
  amber:       '#f59e0b',
  gray:        '#374151',
  border:      'rgba(0,232,122,0.12)',
  borderBright:'rgba(0,232,122,0.28)',
}

const STATUS_COLOR = {
  active:      C.green,
  iran_routes: C.green,
  domestic:    C.amber,
  quiet:       C.gray,
  unknown:     '#1f2937',
}

// ── Per-language UI strings ────────────────────────────────────────────────
const LABELS = {
  fa: {
    title:      'وضعیت فرودگاه‌ها',
    subtitle:   'پایش زنده · OpenSky',
    live:       'زنده',
    updating:   'در حال بروزرسانی...',
    loading:    'در حال بارگذاری...',
    lastUpdate: 'بروزرسانی:',
    noData:     'داده‌ای در دسترس نیست',
    source:     'OpenSky Network · هر ۵ دقیقه',
    flights:    'پرواز',
    noFlights:  'بدون پرواز',
    carriers:   '✈ خطوط ترکیه به ایران',
    dir:        'rtl',
    mono:       "'Vazirmatn', monospace",
  },
  en: {
    title:      'ATC Status',
    subtitle:   'Live Monitor · OpenSky',
    live:       'LIVE',
    updating:   'Updating...',
    loading:    'Loading...',
    lastUpdate: 'Updated:',
    noData:     'No data available',
    source:     'OpenSky Network · 5 min refresh',
    flights:    'Iran routes',
    noFlights:  '— no direct',
    carriers:   null,
    dir:        'ltr',
    mono:       'monospace',
  },
  tr: {
    title:      'Havalimanı Durumu',
    subtitle:   'Canlı Takip · OpenSky',
    live:       'CANLI',
    updating:   'Güncelleniyor...',
    loading:    'Yükleniyor...',
    lastUpdate: 'Güncellendi:',
    noData:     'Veri yok',
    source:     'OpenSky Network · 5 dk',
    flights:    'İran hattı',
    noFlights:  '— direkt yok',
    carriers:   null,
    dir:        'ltr',
    mono:       'monospace',
  },
}

// ── SVG mini-map ───────────────────────────────────────────────────────────
const MAP_BOUNDS = {
  fa: { minLon: 43, maxLon: 65, minLat: 23, maxLat: 43 },
  en: { minLon: -95, maxLon: 158, minLat: -38, maxLat: 62 },
  tr: { minLon: 23, maxLon: 47, minLat: 35, maxLat: 46 },
}

function MiniMap({ airports, lang }) {
  const W = 292, H = 118
  const b = MAP_BOUNDS[lang] || MAP_BOUNDS.fa

  function proj(lat, lon) {
    const x = ((lon - b.minLon) / (b.maxLon - b.minLon)) * (W - 20) + 10
    const y = ((b.maxLat - lat) / (b.maxLat - b.minLat)) * (H - 20) + 10
    return [Math.max(10, Math.min(W - 10, x)), Math.max(10, Math.min(H - 12, y))]
  }

  const lonStep = lang === 'en' ? 40 : 5
  const latStep = lang === 'en' ? 20 : 5
  const gridLons = [], gridLats = []
  for (let l = Math.ceil(b.minLon / lonStep) * lonStep; l <= b.maxLon; l += lonStep) gridLons.push(l)
  for (let l = Math.ceil(b.minLat / latStep) * latStep; l <= b.maxLat; l += latStep) gridLats.push(l)

  const valid = (airports || []).filter((ap) => ap.lat != null && ap.lon != null)

  // Equator line (useful reference for EN view)
  const showEquator = lang === 'en'
  const [, eqY] = proj(0, b.minLon)

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', borderRadius: '6px' }}>
      <defs>
        <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0,232,122,0.06)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <pattern id="scanline" width="1" height="3" patternUnits="userSpaceOnUse">
          <rect width="1" height="1" y="1" fill="rgba(0,0,0,0.18)" />
        </pattern>
      </defs>

      {/* Background */}
      <rect width={W} height={H} fill="#020a11" />
      <rect width={W} height={H} fill="url(#mapGlow)" />

      {/* Grid */}
      {gridLons.map((lon) => {
        const [x] = proj(b.minLat, lon)
        return <line key={`v${lon}`} x1={x} y1={0} x2={x} y2={H} stroke="rgba(0,232,122,0.07)" strokeWidth={0.5} />
      })}
      {gridLats.map((lat) => {
        const [, y] = proj(lat, b.minLon)
        return <line key={`h${lat}`} x1={0} y1={y} x2={W} y2={y} stroke="rgba(0,232,122,0.07)" strokeWidth={0.5} />
      })}

      {/* Equator highlight */}
      {showEquator && (
        <line x1={0} y1={eqY} x2={W} y2={eqY} stroke="rgba(0,232,122,0.16)" strokeWidth={0.8} strokeDasharray="4,4" />
      )}

      {/* Route arcs — faint lines connecting airports to suggest connectivity */}
      {valid.length > 1 &&
        valid.slice(1).map((ap, i) => {
          const [x1, y1] = proj(valid[0].lat, valid[0].lon)
          const [x2, y2] = proj(ap.lat, ap.lon)
          const mx = (x1 + x2) / 2
          const my = Math.min(y1, y2) - 18
          return (
            <path
              key={`arc${i}`}
              d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
              fill="none"
              stroke="rgba(0,232,122,0.06)"
              strokeWidth={0.8}
              strokeDasharray="3,4"
            />
          )
        })}

      {/* Airport dots */}
      {valid.map((ap) => {
        const [x, y] = proj(ap.lat, ap.lon)
        const color = STATUS_COLOR[ap.status] || C.gray
        const active = ap.status === 'active' || ap.status === 'iran_routes'
        return (
          <g key={ap.iata}>
            {/* Pulsing ring — SVG native animation */}
            {active && (
              <circle cx={x} cy={y} r={3} fill={color} opacity={0}>
                <animate attributeName="r" values="3;11;3" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.25;0;0.25" dur="3s" repeatCount="indefinite" />
              </circle>
            )}
            <circle cx={x} cy={y} r={2.8} fill={color} opacity={0.92} />
            <text x={x + 5} y={y + 4} fontSize={6.5} fill={color} fontFamily="monospace" opacity={0.88}>
              {ap.iata}
            </text>
          </g>
        )
      })}

      {/* Scanline overlay */}
      <rect width={W} height={H} fill="url(#scanline)" opacity={0.6} />

      {/* Corner label */}
      <text x={4} y={H - 3} fontSize={5.5} fill="rgba(0,232,122,0.18)" fontFamily="monospace" letterSpacing="0.08em">
        OPENSKY·NET
      </text>
    </svg>
  )
}

// ── Widget ─────────────────────────────────────────────────────────────────
export default function AirportStatusWidget() {
  const { lang } = useLanguage()
  const [open, setOpen] = useState(false)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [updatedAt, setUpdatedAt] = useState(null)

  useEffect(() => {
    load()
    const id = setInterval(load, 5 * 60 * 1000)
    return () => clearInterval(id)
  }, [lang]) // eslint-disable-line react-hooks/exhaustive-deps

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`/api/airport-status?lang=${lang}`)
      if (!res.ok) throw new Error()
      setData(await res.json())
      setUpdatedAt(new Date())
    } catch {
      // fail silently — widget stays in last-known state
    } finally {
      setLoading(false)
    }
  }

  const L = LABELS[lang] || LABELS.en
  const isFa = lang === 'fa'

  const timeStr = updatedAt
    ? updatedAt.toLocaleTimeString(isFa ? 'fa-IR' : 'en-US', { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <div className="fixed left-0 z-50" style={{ top: '50%', transform: 'translateY(-50%)' }}>

      {/* ── Sliding panel ─────────────────────────────────── */}
      <div
        style={{
          width: '316px',
          maxHeight: '82vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          background: C.panel,
          border: `1px solid ${C.border}`,
          borderLeft: 'none',
          borderRadius: '0 14px 14px 0',
          boxShadow: `0 0 0 1px rgba(0,232,122,0.04), 8px 0 32px rgba(0,0,0,0.55), 0 0 60px rgba(0,232,122,0.06)`,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: open
            ? 'transform 0.42s cubic-bezier(0.34, 1.56, 0.64, 1)'
            : 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
          direction: L.dir,
          fontFamily: L.mono,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '12px 14px 10px',
            borderBottom: `1px solid ${C.border}`,
            background: 'linear-gradient(180deg, rgba(0,232,122,0.06) 0%, transparent 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div
                style={{
                  color: C.green,
                  fontSize: '13px',
                  fontWeight: '700',
                  fontFamily: 'monospace',
                  letterSpacing: '0.06em',
                }}
              >
                ✈ {L.title}
              </div>
              <div
                style={{
                  color: C.greenDim,
                  fontSize: '9.5px',
                  fontFamily: 'monospace',
                  letterSpacing: '0.1em',
                  marginTop: '2px',
                }}
              >
                {L.subtitle}
              </div>
            </div>

            {/* Live badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', paddingTop: '2px' }}>
              <span
                className="animate-pulse"
                style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: C.green,
                  boxShadow: `0 0 8px ${C.green}`,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  color: C.green,
                  fontSize: '10px',
                  fontWeight: '800',
                  fontFamily: 'monospace',
                  letterSpacing: '0.12em',
                }}
              >
                {L.live}
              </span>
            </div>
          </div>

          {/* Timestamp */}
          <div
            style={{
              color: 'rgba(0,232,122,0.25)',
              fontSize: '9px',
              fontFamily: 'monospace',
              marginTop: '6px',
              letterSpacing: '0.06em',
            }}
          >
            {loading
              ? L.updating
              : timeStr
              ? `${L.lastUpdate} ${timeStr}`
              : L.loading}
          </div>
        </div>

        {/* Mini map */}
        <div
          style={{
            padding: '10px 12px 8px',
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <MiniMap airports={data?.airports} lang={lang} />
        </div>

        {/* Airport rows */}
        <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {data?.airports?.map((ap) => {
            const color = STATUS_COLOR[ap.status] || C.gray
            const isActive = ap.status === 'active' || ap.status === 'iran_routes'
            const count = isFa ? ap.intlCount : ap.iranCount
            const countLabel =
              count > 0
                ? `${count} ${L.flights}`
                : ap.status === 'quiet'
                ? L.noFlights
                : isActive
                ? L.noFlights
                : '—'

            return (
              <div
                key={ap.icao}
                style={{
                  background: C.greenFaint,
                  border: `1px solid ${C.border}`,
                  borderRadius: '8px',
                  padding: '7px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                  <div
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: color,
                      boxShadow: isActive ? `0 0 7px ${color}` : 'none',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        color: 'rgba(255,255,255,0.82)',
                        fontSize: '12px',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {ap.name}
                    </div>
                    <div style={{ color: C.greenDim, fontSize: '10px', fontFamily: 'monospace' }}>
                      {ap.city}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: isFa ? 'left' : 'right', flexShrink: 0 }}>
                  <div
                    style={{
                      color: 'rgba(0,232,122,0.6)',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      fontWeight: '700',
                      letterSpacing: '0.07em',
                    }}
                  >
                    {ap.iata}
                  </div>
                  <div style={{ color, fontSize: '10px', fontFamily: 'monospace' }}>{countLabel}</div>
                </div>
              </div>
            )
          })}

          {/* Loading skeletons */}
          {loading && !data &&
            [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="animate-pulse"
                style={{
                  height: '44px',
                  background: C.greenFaint,
                  border: `1px solid ${C.border}`,
                  borderRadius: '8px',
                }}
              />
            ))}

          {!data && !loading && (
            <div
              style={{
                textAlign: 'center',
                padding: '24px 0',
                color: C.greenDim,
                fontSize: '11px',
                fontFamily: 'monospace',
              }}
            >
              {L.noData}
            </div>
          )}
        </div>

        {/* Turkish carriers — FA only */}
        {isFa && data?.airlines?.length > 0 && (
          <>
            <div
              style={{
                padding: '8px 14px 5px',
                borderTop: `1px solid ${C.border}`,
                color: C.greenDim,
                fontSize: '9.5px',
                fontFamily: 'monospace',
                letterSpacing: '0.08em',
              }}
            >
              {L.carriers}
            </div>
            <div style={{ padding: '4px 10px 10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {data.airlines.map((airline) => {
                const color = airline.status === 'active' ? C.green : C.gray
                const isActive = airline.status === 'active'
                return (
                  <div
                    key={airline.iata}
                    style={{
                      background: C.greenFaint,
                      border: `1px solid ${C.border}`,
                      borderRadius: '8px',
                      padding: '7px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          background: color,
                          boxShadow: isActive ? `0 0 7px ${color}` : 'none',
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <div style={{ color: 'rgba(255,255,255,0.82)', fontSize: '12px', fontWeight: '600' }}>
                          {airline.nameFa}
                        </div>
                        <div style={{ color: C.greenDim, fontSize: '10px', fontFamily: 'monospace' }}>
                          {airline.name}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'left', flexShrink: 0 }}>
                      <div
                        style={{
                          color: 'rgba(0,232,122,0.6)',
                          fontSize: '11px',
                          fontFamily: 'monospace',
                          fontWeight: '700',
                        }}
                      >
                        {airline.iata}
                      </div>
                      <div style={{ color, fontSize: '10px', fontFamily: 'monospace' }}>
                        {isActive ? `${airline.flightsToIran} پرواز` : L.noFlights}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Footer */}
        <div
          style={{
            padding: '7px 14px 10px',
            borderTop: `1px solid ${C.border}`,
            color: 'rgba(0,232,122,0.18)',
            fontSize: '8.5px',
            fontFamily: 'monospace',
            letterSpacing: '0.07em',
          }}
        >
          {L.source}
        </div>
      </div>

      {/* ── Pull tab (always visible) ──────────────────────── */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          position: 'absolute',
          top: '50%',
          right: '-40px',
          transform: 'translateY(-50%)',
          width: '40px',
          padding: '20px 0',
          background: open ? 'rgba(0,232,122,0.08)' : '#040d1a',
          border: `1px solid ${open ? C.borderBright : C.border}`,
          borderLeft: 'none',
          borderRadius: '0 12px 12px 0',
          color: C.green,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '7px',
          boxShadow: open
            ? `4px 0 24px rgba(0,0,0,0.4), 0 0 20px rgba(0,232,122,0.12)`
            : `4px 0 20px rgba(0,0,0,0.5)`,
          transition: 'background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
          outline: 'none',
        }}
        title="Airport Status"
        aria-label="Toggle airport status panel"
      >
        {/* ✈ icon */}
        <span style={{ fontSize: '14px', lineHeight: 1 }}>✈</span>

        {/* Vertical ATC label */}
        <span
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            fontSize: '8px',
            fontWeight: '800',
            letterSpacing: '0.14em',
            fontFamily: 'monospace',
            lineHeight: 1,
            color: C.green,
            opacity: 0.75,
          }}
        >
          ATC
        </span>

        {/* Live pulse dot */}
        <span
          className="animate-pulse"
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: C.green,
            boxShadow: `0 0 7px ${C.green}`,
          }}
        />
      </button>
    </div>
  )
}
