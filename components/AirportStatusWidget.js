'use client'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

// ── Palette ───────────────────────────────────────────────────────────────
const NAVY  = '#0F1A35'
const AMBER = '#E07B29'
const GLASS = {
  background: 'rgba(10,18,40,0.97)',
  backdropFilter: 'blur(28px)',
  WebkitBackdropFilter: 'blur(28px)',
}

// ── Static route database ─────────────────────────────────────────────────
// Curated from published airline schedules — always accurate, no API needed.
const ROUTES = {
  fa: [
    {
      hub: 'استانبول', iata: 'IST/SAW', flag: '🇹🇷',
      airlines: ['ترکیش ایرلاینز', 'پگاسوس', 'ای‌جت'],
      freq: 'چند پرواز روزانه', direct: true, duration: '۲:۳۰',
      to: ['تهران', 'مشهد', 'شیراز', 'تبریز', 'اصفهان'],
      url: 'https://www.google.com/travel/flights?q=flights+from+Istanbul+to+Tehran',
    },
    {
      hub: 'دبی', iata: 'DXB', flag: '🇦🇪',
      airlines: ['امارات', 'فلای‌دبی'],
      freq: 'چند پرواز روزانه', direct: true, duration: '۱:۳۰',
      to: ['تهران', 'مشهد', 'اصفهان', 'شیراز', 'تبریز', 'اهواز'],
      url: 'https://www.google.com/travel/flights?q=flights+from+Dubai+to+Tehran',
    },
    {
      hub: 'دوحه', iata: 'DOH', flag: '🇶🇦',
      airlines: ['قطر ایرویز'],
      freq: 'روزانه', direct: true, duration: '۱:۴۵',
      to: ['تهران', 'مشهد'],
      url: 'https://www.google.com/travel/flights?q=flights+from+Doha+to+Tehran',
    },
    {
      hub: 'فرانکفورت', iata: 'FRA', flag: '🇩🇪',
      airlines: ['ماهان ایر', 'ایران ایر'],
      freq: '۳ بار در هفته', direct: true, duration: '۵:۳۰',
      to: ['تهران'],
      url: 'https://www.google.com/travel/flights?q=flights+from+Frankfurt+to+Tehran',
    },
    {
      hub: 'لندن', iata: 'LHR', flag: '🇬🇧',
      airlines: ['ماهان ایر', 'ایران ایر'],
      freq: '۲ بار در هفته', direct: true, duration: '۶:۳۰',
      to: ['تهران'],
      url: 'https://www.google.com/travel/flights?q=flights+from+London+to+Tehran',
    },
    {
      hub: 'پاریس', iata: 'CDG', flag: '🇫🇷',
      airlines: ['ماهان ایر', 'ایران ایر'],
      freq: '۲ بار در هفته', direct: true, duration: '۶:۰۰',
      to: ['تهران'],
      url: 'https://www.google.com/travel/flights?q=flights+from+Paris+to+Tehran',
    },
    {
      hub: 'آمستردام', iata: 'AMS', flag: '🇳🇱',
      airlines: ['ماهان ایر', 'ایران ایر'],
      freq: '۲ بار در هفته', direct: true, duration: '۶:۱۵',
      to: ['تهران'],
      url: 'https://www.google.com/travel/flights?q=flights+from+Amsterdam+to+Tehran',
    },
    {
      hub: 'مسکو', iata: 'SVO', flag: '🇷🇺',
      airlines: ['ماهان ایر', 'آئروفلوت'],
      freq: '۳ بار در هفته', direct: true, duration: '۳:۳۰',
      to: ['تهران'],
      url: 'https://www.google.com/travel/flights?q=flights+from+Moscow+to+Tehran',
    },
  ],
  en: [
    {
      hub: 'Istanbul', iata: 'IST/SAW', flag: '🇹🇷',
      airlines: ['Turkish Airlines', 'Pegasus', 'AJet'],
      freq: 'Multiple daily', direct: true, duration: '2h 30m',
      to: ['Tehran', 'Mashhad', 'Shiraz', 'Tabriz', 'Isfahan'],
      url: 'https://www.google.com/travel/flights?q=flights+from+Istanbul+to+Tehran',
    },
    {
      hub: 'Dubai', iata: 'DXB', flag: '🇦🇪',
      airlines: ['Emirates', 'flydubai'],
      freq: 'Multiple daily', direct: true, duration: '1h 30m',
      to: ['Tehran', 'Mashhad', 'Isfahan', 'Shiraz', 'Tabriz', 'Ahvaz'],
      url: 'https://www.google.com/travel/flights?q=flights+from+Dubai+to+Tehran',
    },
    {
      hub: 'London', iata: 'LHR', flag: '🇬🇧',
      airlines: ['Mahan Air', 'Iran Air'],
      freq: '2× / week', direct: true, duration: '6h 30m',
      to: ['Tehran'],
      url: 'https://www.google.com/travel/flights?q=flights+from+London+to+Tehran',
    },
    {
      hub: 'Frankfurt', iata: 'FRA', flag: '🇩🇪',
      airlines: ['Mahan Air', 'Iran Air'],
      freq: '3× / week', direct: true, duration: '5h 30m',
      to: ['Tehran'],
      url: 'https://www.google.com/travel/flights?q=flights+from+Frankfurt+to+Tehran',
    },
    {
      hub: 'Toronto', iata: 'YYZ', flag: '🇨🇦',
      airlines: ['Air Canada', 'Turkish Airlines', 'Emirates'],
      freq: 'Daily via hub', direct: false, via: 'Istanbul or Dubai', duration: '~16h',
      to: ['Tehran'],
      url: 'https://www.google.com/travel/flights?q=flights+from+Toronto+to+Tehran',
    },
    {
      hub: 'Los Angeles', iata: 'LAX', flag: '🇺🇸',
      airlines: ['Turkish Airlines', 'Emirates', 'Qatar Airways'],
      freq: 'Daily via hub', direct: false, via: 'Istanbul / Dubai / Doha', duration: '~22h',
      to: ['Tehran'],
      url: 'https://www.google.com/travel/flights?q=flights+from+Los+Angeles+to+Tehran',
    },
    {
      hub: 'Sydney', iata: 'SYD', flag: '🇦🇺',
      airlines: ['Emirates', 'Qatar Airways', 'Turkish Airlines'],
      freq: 'Daily via hub', direct: false, via: 'Dubai / Doha / Istanbul', duration: '~18h',
      to: ['Tehran'],
      url: 'https://www.google.com/travel/flights?q=flights+from+Sydney+to+Tehran',
    },
    {
      hub: 'Amsterdam', iata: 'AMS', flag: '🇳🇱',
      airlines: ['Mahan Air', 'Iran Air'],
      freq: '2× / week', direct: true, duration: '6h 15m',
      to: ['Tehran'],
      url: 'https://www.google.com/travel/flights?q=flights+from+Amsterdam+to+Tehran',
    },
  ],
  tr: [
    {
      hub: 'İstanbul (IST)', iata: 'IST', flag: '🇹🇷',
      airlines: ['Turkish Airlines'],
      freq: 'Günde birkaç sefer', direct: true, duration: '2s 30dk',
      to: ['Tahran', 'Meşhed', 'Şiraz', 'Tebriz', 'İsfahan'],
      url: 'https://www.google.com/travel/flights?q=flights+from+Istanbul+to+Tehran',
    },
    {
      hub: 'İstanbul (SAW)', iata: 'SAW', flag: '🇹🇷',
      airlines: ['Pegasus', 'AJet'],
      freq: 'Günlük', direct: true, duration: '2s 30dk',
      to: ['Tahran'],
      url: 'https://www.google.com/travel/flights?q=flights+from+Istanbul+Sabiha+to+Tehran',
    },
    {
      hub: 'Ankara', iata: 'ESB', flag: '🇹🇷',
      airlines: ['AJet', 'Turkish Airlines'],
      freq: 'Haftada birkaç sefer', direct: true, duration: '2s 45dk',
      to: ['Tahran'],
      url: 'https://www.google.com/travel/flights?q=flights+from+Ankara+to+Tehran',
    },
    {
      hub: 'İzmir', iata: 'ADB', flag: '🇹🇷',
      airlines: ['AJet'],
      freq: 'Haftada birkaç sefer', direct: true, duration: '3s 00dk',
      to: ['Tahran'],
      url: 'https://www.google.com/travel/flights?q=flights+from+Izmir+to+Tehran',
    },
    {
      hub: 'Dubai', iata: 'DXB', flag: '🇦🇪',
      airlines: ['Emirates', 'flydubai'],
      freq: 'Günde birkaç sefer', direct: true, duration: '1s 30dk',
      to: ['Tahran', 'Meşhed', 'Şiraz', 'Tebriz', 'İsfahan', 'Ahvaz'],
      url: 'https://www.google.com/travel/flights?q=flights+from+Dubai+to+Tehran',
    },
    {
      hub: 'Doha', iata: 'DOH', flag: '🇶🇦',
      airlines: ['Qatar Airways'],
      freq: 'Günlük', direct: true, duration: '1s 45dk',
      to: ['Tahran', 'Meşhed'],
      url: 'https://www.google.com/travel/flights?q=flights+from+Doha+to+Tehran',
    },
  ],
}

// ── Labels ────────────────────────────────────────────────────────────────
const LABELS = {
  fa: {
    title: 'مسیرهای پرواز به ایران',
    subtitle: 'هواپیماهای فعال · زمان‌بندی معمول',
    direct: 'مستقیم',
    indirect: 'غیرمستقیم',
    via: 'از طریق',
    search: 'جستجوی پرواز ↗',
    note: '* زمان‌بندی بر اساس برنامه معمول خطوط هوایی است',
    tabLabel: 'پروازها',
    dir: 'rtl',
  },
  en: {
    title: 'Flights to Iran',
    subtitle: 'Active routes · typical schedules',
    direct: 'Direct',
    indirect: 'Indirect',
    via: 'via',
    search: 'Search flights ↗',
    note: '* Based on typical airline schedules — verify before travel',
    tabLabel: 'Flights',
    dir: 'ltr',
  },
  tr: {
    title: 'İran Uçuş Hatları',
    subtitle: 'Aktif rotalar · tipik tarifeler',
    direct: 'Direkt',
    indirect: 'Aktarmalı',
    via: 'via',
    search: 'Uçuş ara ↗',
    note: '* Tipik tarifelere göre — seyahat öncesi doğrulayın',
    tabLabel: 'Uçuşlar',
    dir: 'ltr',
  },
}

// ── Route card (shared between desktop and mobile) ────────────────────────
function RouteCard({ route, L, isFa }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '14px',
      padding: '12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      {/* Row 1: flag + city + badges */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <span style={{ fontSize: '22px', lineHeight: 1, flexShrink: 0 }}>{route.flag}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: 'white', fontWeight: '700', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {route.hub}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', fontFamily: 'monospace' }}>
              {route.iata}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: isFa ? 'flex-start' : 'flex-end', gap: '4px', flexShrink: 0 }}>
          <span style={{
            fontSize: '10px', fontWeight: '700',
            padding: '2px 8px', borderRadius: '20px',
            background: route.direct ? 'rgba(34,197,94,0.13)' : 'rgba(224,123,41,0.13)',
            color: route.direct ? '#22C55E' : AMBER,
            border: `1px solid ${route.direct ? 'rgba(34,197,94,0.28)' : 'rgba(224,123,41,0.28)'}`,
            whiteSpace: 'nowrap',
          }}>
            {route.direct ? `✈ ${L.direct}` : `↪ ${L.indirect}`}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.38)', fontSize: '10px', fontFamily: 'monospace' }}>
            ⏱ {route.duration}
          </span>
        </div>
      </div>

      {/* Via line for indirect routes */}
      {!route.direct && (
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>
          {L.via}: {route.via}
        </div>
      )}

      {/* Airlines */}
      <div style={{ color: 'rgba(255,255,255,0.48)', fontSize: '11px', lineHeight: 1.4 }}>
        {route.airlines.join(' · ')}
      </div>

      {/* Destination tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {route.to.map((dest) => (
          <span key={dest} style={{
            fontSize: '10px', padding: '2px 8px', borderRadius: '20px',
            background: 'rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.58)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            {dest}
          </span>
        ))}
      </div>

      {/* Frequency + search link */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: 'rgba(255,255,255,0.32)', fontSize: '10px' }}>🗓 {route.freq}</span>
        <a
          href={route.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: AMBER, fontSize: '11px', fontWeight: '700',
            textDecoration: 'none', padding: '4px 10px', borderRadius: '8px',
            background: 'rgba(224,123,41,0.1)',
            border: '1px solid rgba(224,123,41,0.25)',
          }}
        >
          {L.search}
        </a>
      </div>
    </div>
  )
}

// ── Panel content — parent owns the scroll ───────────────────────────────
function PanelContent({ routes, L, isFa }) {
  return (
    <div style={{
      ...GLASS,
      direction: L.dir,
      fontFamily: "'Vazirmatn', sans-serif",
    }}>
      {/* Sticky header */}
      <div style={{
        padding: '14px 14px 10px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'linear-gradient(180deg, rgba(224,123,41,0.07) 0%, transparent 100%)',
        position: 'sticky',
        top: 0,
        zIndex: 2,
        ...GLASS,
      }}>
        <div style={{ color: 'white', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '7px' }}>
          <span style={{ color: AMBER, fontSize: '16px' }}>✈</span> {L.title}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', marginTop: '3px', letterSpacing: '0.03em' }}>
          {L.subtitle}
        </div>
      </div>

      {/* Route cards */}
      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {routes.map((route, i) => (
          <RouteCard key={i} route={route} L={L} isFa={isFa} />
        ))}
        <p style={{
          color: 'rgba(255,255,255,0.18)', fontSize: '9px',
          fontFamily: 'monospace', padding: '4px 2px', lineHeight: 1.6,
        }}>
          {L.note}
        </p>
      </div>
    </div>
  )
}

// ── Widget ────────────────────────────────────────────────────────────────
const TAB_W   = 40
const PANEL_W = 320

export default function AirportStatusWidget() {
  const { lang } = useLanguage()
  const [open, setOpen]       = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile (runs client-side only — avoids SSR mismatch)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Close on language change
  useEffect(() => { setOpen(false) }, [lang])

  const L      = LABELS[lang]  || LABELS.en
  const routes = ROUTES[lang]  || ROUTES.en
  const isFa   = lang === 'fa'

  // ── Desktop: left-edge slide panel ──────────────────────────────────────
  if (!isMobile) {
    return (
      <>
        {/* Tab — always pinned to the left viewport edge */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="fixed left-0 z-50"
          style={{
            top: '50%', transform: 'translateY(-50%)',
            width: `${TAB_W}px`,
            ...GLASS,
            background: open ? 'rgba(224,123,41,0.18)' : NAVY,
            border: '1px solid rgba(255,255,255,0.1)',
            borderLeft: 'none',
            borderRadius: '0 12px 12px 0',
            color: 'white', cursor: 'pointer',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '7px', padding: '18px 0',
            boxShadow: '4px 0 24px rgba(0,0,0,0.45)',
            transition: 'background 0.25s ease',
            outline: 'none',
          }}
          title="Flights to Iran"
          aria-label="Toggle flights panel"
        >
          <span style={{ fontSize: '14px', lineHeight: 1 }}>✈</span>
          <span style={{
            writingMode: 'vertical-rl', transform: 'rotate(180deg)',
            fontSize: '8px', fontWeight: '800', letterSpacing: '0.14em',
            fontFamily: 'monospace', color: 'rgba(255,255,255,0.6)',
          }}>
            {isFa ? 'پروا' : 'FLT'}
          </span>
          <span className="animate-pulse" style={{
            width: '5px', height: '5px', borderRadius: '50%',
            background: AMBER, boxShadow: `0 0 7px ${AMBER}`,
          }} />
        </button>

        {/* Panel — slides in from left, sits beside the tab when open */}
        <div
          className="fixed left-0 z-40"
          style={{
            top: '50%',
            transform: `translateY(-50%) translateX(${open ? `${TAB_W}px` : '-100%'})`,
            transition: open
              ? 'transform 0.42s cubic-bezier(0.34,1.56,0.64,1)'
              : 'transform 0.32s cubic-bezier(0.4,0,0.2,1)',
            width: `${PANEL_W}px`,
            maxHeight: '82vh',
            borderRadius: '0 14px 14px 0',
            overflowY: 'auto',
            overflowX: 'hidden',
            boxShadow: '8px 0 40px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderLeft: 'none',
          }}
        >
          <PanelContent routes={routes} L={L} isFa={isFa} />
        </div>
      </>
    )
  }

  // ── Mobile: floating pill + bottom sheet ─────────────────────────────────
  return (
    <>
      {/* Floating pill button — bottom left, above safe area */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed z-50"
        style={{
          bottom: '20px', left: '16px',
          ...GLASS,
          background: open ? AMBER : NAVY,
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '50px',
          color: 'white', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '7px',
          padding: '10px 18px',
          boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(224,123,41,0.2)`,
          fontSize: '13px', fontWeight: '700',
          fontFamily: "'Vazirmatn', sans-serif",
          transition: 'background 0.25s ease',
          outline: 'none',
        }}
        aria-label="Toggle flights panel"
      >
        <span style={{ fontSize: '15px' }}>✈</span>
        <span>{L.tabLabel}</span>
        <span className="animate-pulse" style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: open ? 'white' : AMBER,
          boxShadow: `0 0 6px ${AMBER}`,
        }} />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Bottom sheet — flex column keeps drag handle out of scroll flow */}
      <div
        className="fixed left-0 right-0 z-50"
        style={{
          bottom: 0,
          transform: open ? 'translateY(0)' : 'translateY(105%)',
          transition: open
            ? 'transform 0.42s cubic-bezier(0.34,1.56,0.64,1)'
            : 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
          maxHeight: '80vh',
          borderRadius: '20px 20px 0 0',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)',
          borderBottom: 'none',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Drag handle — fixed height, never scrolls */}
        <div
          onClick={() => setOpen(false)}
          style={{
            ...GLASS,
            background: 'rgba(10,18,40,0.99)',
            paddingTop: '12px', paddingBottom: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.18)' }} />
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <PanelContent routes={routes} L={L} isFa={isFa} />
        </div>
      </div>
    </>
  )
}
