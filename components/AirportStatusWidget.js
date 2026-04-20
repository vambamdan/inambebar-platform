'use client'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

// ── Site palette ──────────────────────────────────────────────────────────
const NAVY    = '#0F1A35'
const NAVY2   = '#1A2744'
const AMBER   = '#E07B29'
const GLASS = {
  background: 'rgba(10, 18, 40, 0.97)',
  backdropFilter: 'blur(28px)',
  WebkitBackdropFilter: 'blur(28px)',
}

// Flight status dot colours — universally understood
const STATUS_COLOR = {
  active:      '#22C55E',
  iran_routes: '#22C55E',
  domestic:    '#F59E0B',
  quiet:       '#4B5563',
  unknown:     '#374151',
}

// ── Per-language strings ──────────────────────────────────────────────────
const LABELS = {
  fa: {
    title:      'وضعیت فرودگاه‌ها',
    subtitle:   'پایش زنده پروازها',
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
    locale:     'fa-IR',
  },
  en: {
    title:      'Flight Status',
    subtitle:   'Live airport monitor',
    live:       'LIVE',
    updating:   'Updating…',
    loading:    'Loading…',
    lastUpdate: 'Updated:',
    noData:     'No data available',
    source:     'OpenSky Network · 5 min refresh',
    flights:    'Iran routes',
    noFlights:  'No direct',
    carriers:   null,
    dir:        'ltr',
    locale:     'en-US',
  },
  tr: {
    title:      'Havalimanı Durumu',
    subtitle:   'Canlı uçuş takibi',
    live:       'CANLI',
    updating:   'Güncelleniyor…',
    loading:    'Yükleniyor…',
    lastUpdate: 'Güncellendi:',
    noData:     'Veri yok',
    source:     'OpenSky Network · 5 dk',
    flights:    'İran hattı',
    noFlights:  'Direkt yok',
    carriers:   null,
    dir:        'ltr',
    locale:     'tr-TR',
  },
}

// ── Mini map ──────────────────────────────────────────────────────────────
const MAP_BOUNDS = {
  fa: { minLon: 43, maxLon: 65, minLat: 23, maxLat: 43 },
  en: { minLon: -95, maxLon: 158, minLat: -38, maxLat: 62 },
  tr: { minLon: 23, maxLon: 47, minLat: 35, maxLat: 46 },
}

function MiniMap({ airports, lang }) {
  const W = 280, H = 108
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
  const [, eqY] = proj(0, b.minLon)

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', borderRadius: '6px' }}>
      <defs>
        <radialGradient id="mg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(224,123,41,0.07)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <pattern id="sl" width="1" height="3" patternUnits="userSpaceOnUse">
          <rect width="1" height="1" y="1" fill="rgba(0,0,0,0.2)" />
        </pattern>
      </defs>

      <rect width={W} height={H} fill="#050e1e" />
      <rect width={W} height={H} fill="url(#mg)" />

      {/* Grid */}
      {gridLons.map((lon) => {
        const [x] = proj(b.minLat, lon)
        return <line key={`v${lon}`} x1={x} y1={0} x2={x} y2={H} stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />
      })}
      {gridLats.map((lat) => {
        const [, y] = proj(lat, b.minLon)
        return <line key={`h${lat}`} x1={0} y1={y} x2={W} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />
      })}

      {/* Equator */}
      {lang === 'en' && (
        <line x1={0} y1={eqY} x2={W} y2={eqY} stroke="rgba(224,123,41,0.18)" strokeWidth={0.8} strokeDasharray="4,4" />
      )}

      {/* Arcs between airports */}
      {valid.length > 1 &&
        valid.slice(1).map((ap, i) => {
          const [x1, y1] = proj(valid[0].lat, valid[0].lon)
          const [x2, y2] = proj(ap.lat, ap.lon)
          const mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 16
          return (
            <path key={`a${i}`} d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
              fill="none" stroke="rgba(224,123,41,0.08)" strokeWidth={0.8} strokeDasharray="3,4" />
          )
        })}

      {/* Airport dots */}
      {valid.map((ap) => {
        const [x, y] = proj(ap.lat, ap.lon)
        const color = STATUS_COLOR[ap.status] || '#374151'
        const active = ap.status === 'active' || ap.status === 'iran_routes'
        return (
          <g key={ap.iata}>
            {active && (
              <circle cx={x} cy={y} r={3} fill={color} opacity={0}>
                <animate attributeName="r" values="3;11;3" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.22;0;0.22" dur="3s" repeatCount="indefinite" />
              </circle>
            )}
            <circle cx={x} cy={y} r={2.6} fill={color} opacity={0.9} />
            <text x={x + 4} y={y + 4} fontSize={6} fill={color} fontFamily="monospace" opacity={0.8}>{ap.iata}</text>
          </g>
        )
      })}

      <rect width={W} height={H} fill="url(#sl)" opacity={0.5} />
      <text x={4} y={H - 3} fontSize={5} fill="rgba(255,255,255,0.12)" fontFamily="monospace" letterSpacing="0.1em">
        OPENSKY·NET
      </text>
    </svg>
  )
}

// ── Widget ────────────────────────────────────────────────────────────────
const TAB_W = 40   // px — width of the always-visible pull tab
const PANEL_W = 308 // px — width of the sliding panel

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
      // fail silently
    } finally {
      setLoading(false)
    }
  }

  const L = LABELS[lang] || LABELS.en
  const isFa = lang === 'fa'

  const timeStr = updatedAt
    ? updatedAt.toLocaleTimeString(L.locale, { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <>
      {/* ── Tab: two separate fixed elements so the tab is ALWAYS at left:0 ── */}
      {/* Tab button — permanently anchored to the left viewport edge */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed left-0 z-50"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          width: `${TAB_W}px`,
          ...GLASS,
          background: open ? 'rgba(224,123,41,0.18)' : NAVY,
          border: '1px solid rgba(255,255,255,0.1)',
          borderLeft: 'none',
          borderRadius: '0 12px 12px 0',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '7px',
          padding: '18px 0',
          boxShadow: '4px 0 24px rgba(0,0,0,0.45)',
          transition: 'background 0.25s ease',
          outline: 'none',
        }}
        title="Flight Status"
        aria-label="Toggle flight status panel"
      >
        <span style={{ fontSize: '14px', lineHeight: 1 }}>✈</span>
        <span style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          fontSize: '8px',
          fontWeight: '800',
          letterSpacing: '0.14em',
          fontFamily: 'monospace',
          color: 'rgba(255,255,255,0.65)',
          lineHeight: 1,
        }}>ATC</span>
        <span
          className="animate-pulse"
          style={{
            width: '5px', height: '5px',
            borderRadius: '50%',
            background: AMBER,
            boxShadow: `0 0 7px ${AMBER}`,
          }}
        />
      </button>

      {/* Panel — slides in from left, stops beside the tab */}
      <div
        className="fixed left-0 z-40"
        style={{
          top: '50%',
          // closed → fully off-screen (-100% = -PANEL_W px); open → sits right beside the tab
          transform: `translateY(-50%) translateX(${open ? `${TAB_W}px` : '-100%'})`,
          transition: open
            ? 'transform 0.42s cubic-bezier(0.34, 1.56, 0.64, 1)'
            : 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
          width: `${PANEL_W}px`,
        }}
      >

        {/* Panel inner scroll container */}
        <div
          style={{
            width: '100%',
            maxHeight: '82vh',
            overflowY: 'auto',
            overflowX: 'hidden',
            ...GLASS,
            border: '1px solid rgba(255,255,255,0.08)',
            borderLeft: 'none',
            borderRadius: '0 14px 14px 0',
            direction: L.dir,
            fontFamily: "'Vazirmatn', sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 14px 10px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              background: 'linear-gradient(180deg, rgba(224,123,41,0.07) 0%, transparent 100%)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: 'white', fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: AMBER }}>✈</span> {L.title}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', marginTop: '2px', letterSpacing: '0.04em' }}>
                  {L.subtitle}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', paddingTop: '2px', flexShrink: 0 }}>
                <span
                  className="animate-pulse"
                  style={{
                    display: 'inline-block',
                    width: '6px', height: '6px',
                    borderRadius: '50%',
                    background: '#22C55E',
                    boxShadow: '0 0 8px #22C55E',
                  }}
                />
                <span style={{ color: '#22C55E', fontSize: '10px', fontWeight: '800', letterSpacing: '0.1em' }}>
                  {L.live}
                </span>
              </div>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.22)', fontSize: '9px', marginTop: '6px', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
              {loading ? L.updating : timeStr ? `${L.lastUpdate} ${timeStr}` : L.loading}
            </div>
          </div>

          {/* Mini map */}
          <div style={{ padding: '10px 12px 8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <MiniMap airports={data?.airports} lang={lang} />
          </div>

          {/* Airport list */}
          <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {data?.airports?.map((ap) => {
              const color = STATUS_COLOR[ap.status] || '#374151'
              const isActive = ap.status === 'active' || ap.status === 'iran_routes'
              const count = isFa ? ap.intlCount : ap.iranCount
              const countLabel =
                count > 0 ? `${count} ${L.flights}`
                : isActive  ? L.noFlights
                : ap.status === 'quiet' ? L.noFlights
                : '—'

              return (
                <div
                  key={ap.icao}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '10px',
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
                        width: '7px', height: '7px',
                        borderRadius: '50%',
                        background: color,
                        boxShadow: isActive ? `0 0 7px ${color}` : 'none',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ap.name}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.32)', fontSize: '10px' }}>{ap.city}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: isFa ? 'left' : 'right', flexShrink: 0 }}>
                    <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', fontFamily: 'monospace', fontWeight: '700', letterSpacing: '0.07em' }}>
                      {ap.iata}
                    </div>
                    <div style={{ color, fontSize: '10px', fontFamily: 'monospace' }}>{countLabel}</div>
                  </div>
                </div>
              )
            })}

            {loading && !data && [1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse" style={{
                height: '44px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '10px',
              }} />
            ))}

            {!data && !loading && (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'rgba(255,255,255,0.28)', fontSize: '11px', fontFamily: 'monospace' }}>
                {L.noData}
              </div>
            )}
          </div>

          {/* Turkish carriers — FA only */}
          {isFa && data?.airlines?.length > 0 && (
            <>
              <div style={{
                padding: '7px 14px 5px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.35)',
                fontSize: '10px',
                letterSpacing: '0.05em',
              }}>
                {L.carriers}
              </div>
              <div style={{ padding: '4px 10px 10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {data.airlines.map((airline) => {
                  const color = airline.status === 'active' ? '#22C55E' : '#4B5563'
                  return (
                    <div key={airline.iata} style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '10px',
                      padding: '7px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '7px', height: '7px', borderRadius: '50%',
                          background: color,
                          boxShadow: airline.status === 'active' ? `0 0 7px ${color}` : 'none',
                          flexShrink: 0,
                        }} />
                        <div>
                          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: '600' }}>{airline.nameFa}</div>
                          <div style={{ color: 'rgba(255,255,255,0.32)', fontSize: '10px' }}>{airline.name}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'left', flexShrink: 0 }}>
                        <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', fontFamily: 'monospace', fontWeight: '700' }}>{airline.iata}</div>
                        <div style={{ color, fontSize: '10px', fontFamily: 'monospace' }}>
                          {airline.status === 'active' ? `${airline.flightsToIran} ${L.flights}` : L.noFlights}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* Footer */}
          <div style={{
            padding: '7px 14px 10px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            color: 'rgba(255,255,255,0.18)',
            fontSize: '9px',
            fontFamily: 'monospace',
            letterSpacing: '0.06em',
          }}>
            {L.source}
          </div>
        </div>

      </div>
    </>
  )
}
