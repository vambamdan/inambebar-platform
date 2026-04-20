'use client'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

const STATUS = {
  active:   { color: '#22C55E', label: 'بین‌المللی فعال' },
  domestic: { color: '#F59E0B', label: 'فقط داخلی' },
  quiet:    { color: '#6B7280', label: 'بدون پرواز' },
  unknown:  { color: '#374151', label: 'نامشخص' },
}

const GLASS = {
  background: 'rgba(10, 18, 40, 0.97)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.08)',
  fontFamily: "'Vazirmatn', sans-serif",
}

export default function AirportStatusWidget() {
  const { isFa } = useLanguage()
  const [open, setOpen] = useState(false)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [updatedAt, setUpdatedAt] = useState(null)

  useEffect(() => {
    if (!isFa) return
    load()
    const id = setInterval(load, 5 * 60 * 1000)
    return () => clearInterval(id)
  }, [isFa])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/airport-status')
      if (!res.ok) throw new Error()
      const json = await res.json()
      setData(json)
      setUpdatedAt(new Date())
    } catch {
      // fail silently — widget stays in last known state
    } finally {
      setLoading(false)
    }
  }

  if (!isFa) return null

  const timeStr = updatedAt
    ? updatedAt.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <div
      className="fixed left-0 z-50"
      style={{ top: '50%', transform: 'translateY(-50%)' }}
    >
      {/* Sliding panel */}
      <div
        style={{
          ...GLASS,
          width: '272px',
          maxHeight: '72vh',
          overflowY: 'auto',
          borderLeft: 'none',
          borderRadius: '0 0 0 0',
          boxShadow: '6px 0 32px rgba(0,0,0,0.4)',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
          direction: 'rtl',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div>
            <div className="text-white font-bold text-sm flex items-center gap-1.5">
              ✈ فرودگاه‌های ایران
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>
              {loading
                ? 'در حال بروزرسانی...'
                : timeStr
                ? `آخرین بروزرسانی: ${timeStr}`
                : 'در حال بارگذاری...'}
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: '#22C55E' }}
            />
            <span className="text-xs font-bold" style={{ color: '#22C55E' }}>
              زنده
            </span>
          </div>
        </div>

        {/* Airport rows */}
        <div className="p-3 space-y-2">
          {data?.airports?.map((ap) => {
            const s = STATUS[ap.status] || STATUS.unknown
            return (
              <div
                key={ap.icao}
                className="rounded-xl px-3 py-2.5 flex items-center justify-between"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {/* Right — name + city */}
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      background: s.color,
                      boxShadow: `0 0 7px ${s.color}`,
                    }}
                  />
                  <div>
                    <div className="text-white text-xs font-bold">{ap.name}</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>
                      {ap.city}
                    </div>
                  </div>
                </div>

                {/* Left — IATA + status */}
                <div className="text-left flex-shrink-0">
                  <div
                    className="text-xs font-bold"
                    style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace', letterSpacing: '0.05em' }}
                  >
                    {ap.iata}
                  </div>
                  <div className="text-xs" style={{ color: s.color }}>
                    {ap.status === 'active'
                      ? `${ap.intlCount} پرواز`
                      : s.label}
                  </div>
                </div>
              </div>
            )
          })}

          {!data && !loading && (
            <div
              className="text-center py-6 text-xs"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              داده‌ای در دسترس نیست
            </div>
          )}

          {loading && !data && (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-xl h-12 animate-pulse"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-4 pb-3 pt-1 text-xs"
          style={{
            color: 'rgba(255,255,255,0.25)',
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          منبع: OpenSky Network · ۱۲ ساعت گذشته · هر ۵ دقیقه بروز می‌شود
        </div>
      </div>

      {/* Tab — always visible, anchored to right edge of panel */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="absolute"
        style={{
          top: '50%',
          right: open ? '-36px' : '-36px',
          transform: 'translateY(-50%)',
          background: open ? '#253560' : '#E07B29',
          color: 'white',
          width: '36px',
          padding: '14px 0',
          borderRadius: '0 10px 10px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '5px',
          boxShadow: '3px 0 14px rgba(0,0,0,0.25)',
          transition: 'background 0.2s ease',
          cursor: 'pointer',
          border: 'none',
          outline: 'none',
        }}
        title="وضعیت فرودگاه‌های ایران"
      >
        <span style={{ fontSize: '14px' }}>✈</span>
        <span
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            fontSize: '9px',
            fontWeight: '800',
            letterSpacing: '0.08em',
            fontFamily: "'Vazirmatn', sans-serif",
            lineHeight: 1,
          }}
        >
          فرودگاه
        </span>
      </button>
    </div>
  )
}
