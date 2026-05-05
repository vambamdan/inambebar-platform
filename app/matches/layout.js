'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const CARD_BG  = '#16203A'
const HAIRLINE = 'rgba(255,255,255,0.07)'
const FG1      = '#F1F4FB'
const FG2      = '#A6B0CC'
const FG3      = '#6E7A99'

const STATUS_DOT = {
  pending:    '#E0A929',
  accepted:   '#6366f1',
  in_transit: '#A78BF8',
  delivered:  '#56CD93',
  cancelled:  '#6E7A99',
}

const STATUS_LABEL = {
  pending:    { en: 'Pending',    fa: 'در انتظار' },
  accepted:   { en: 'Accepted',   fa: 'پذیرفته‌شده' },
  in_transit: { en: 'In Transit', fa: 'در راه' },
  delivered:  { en: 'Delivered',  fa: 'تحویل‌داده‌شده' },
  cancelled:  { en: 'Cancelled',  fa: 'لغو‌شده' },
}

export default function MatchesLayout({ children }) {
  const [user, setUser]       = useState(null)
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const params                = useParams()
  const currentId             = params?.id
  const { t, lang }           = useLanguage()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      setUser(user)

      const { data } = await supabase
        .from('matches')
        .select(`
          id, status, agreed_price, created_at, traveler_id, sender_id,
          trips(origin_city, destination_city),
          shipment_requests(origin_city, destination_city, item_description),
          traveler:profiles!matches_traveler_id_fkey(full_name),
          sender:profiles!matches_sender_id_fkey(full_name)
        `)
        .or(`traveler_id.eq.${user.id},sender_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      setMatches(data || [])
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    if (!user) return
    const channel = supabase
      .channel('sidebar-matches-live')
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'matches',
      }, payload => {
        setMatches(prev =>
          prev.map(m => m.id === payload.new.id ? { ...m, ...payload.new } : m)
        )
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [user])

  const isFa = lang === 'fa'
  const fontStyle = isFa ? { fontFamily: "'Vazirmatn', sans-serif", direction: 'rtl' } : {}

  return (
    <div className="flex overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>

      {/* ── Sidebar ── */}
      <div
        className={`flex-col flex-shrink-0 w-full md:w-72 lg:w-80 ${currentId ? 'hidden md:flex' : 'flex'}`}
        style={{ background: '#111A2E', borderRight: `1px solid ${HAIRLINE}`, ...fontStyle }}
      >
        {/* Sidebar header */}
        <div className="px-4 py-4 flex items-center justify-between flex-shrink-0"
          style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
          <h2 className="font-black text-base" style={{ color: FG1 }}>
            {t?.conversations || 'Conversations'}
          </h2>
          <Link
            href="/dashboard"
            className="text-xs transition-colors"
            style={{ color: FG3 }}
            onMouseEnter={e => e.currentTarget.style.color = FG2}
            onMouseLeave={e => e.currentTarget.style.color = FG3}
          >
            {t?.dashboard || 'Dashboard'}
          </Link>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-sm py-10" style={{ color: FG3 }}>
              {t?.loading || 'Loading…'}
            </div>
          ) : matches.length === 0 ? (
            <div className="p-6 text-center pt-12">
              <MessageCircle size={28} color={FG3} className="mx-auto mb-2" />
              <p className="text-xs" style={{ color: FG3 }}>{t?.noConversationsYet || 'No conversations yet'}</p>
              <Link
                href="/trips"
                className="inline-block mt-3 text-xs font-semibold px-4 py-2 rounded-xl text-white transition-opacity hover:opacity-90"
                style={{ background: '#E07B29' }}
              >
                {t?.findTravelers || 'Find Travelers'}
              </Link>
            </div>
          ) : (
            matches.map(match => {
              const isTraveler = match.traveler_id === user?.id
              const other      = isTraveler ? match.sender : match.traveler
              const isActive   = match.id === currentId
              const dotColor   = STATUS_DOT[match.status] || FG3
              const statusTxt  = STATUS_LABEL[match.status]?.[lang === 'fa' ? 'fa' : 'en'] || match.status

              const route = match.trips
                ? `${match.trips.origin_city} → ${match.trips.destination_city}`
                : match.shipment_requests
                  ? `${match.shipment_requests.origin_city} → ${match.shipment_requests.destination_city}`
                  : '—'

              return (
                <Link
                  key={match.id}
                  href={`/matches/${match.id}`}
                  className="flex items-center gap-3 px-4 py-3.5 transition-colors"
                  style={{
                    borderBottom: `1px solid ${HAIRLINE}`,
                    borderLeft: isActive ? '2px solid #E07B29' : '2px solid transparent',
                    background: isActive ? 'rgba(224,123,41,0.07)' : 'transparent',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                >
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #1A2744, #2d3f6b)' }}
                  >
                    {other?.full_name?.[0]?.toUpperCase() || '?'}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-sm font-semibold truncate" style={{ color: FG1 }}>
                        {other?.full_name || 'User'}
                      </span>
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: dotColor }}
                        title={statusTxt}
                      />
                    </div>
                    <div className="text-xs truncate mt-0.5" style={{ color: FG3 }}>{route}</div>
                    <div className="text-xs mt-0.5" style={{ color: FG3 }}>{statusTxt}</div>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div
        className={`flex-1 flex-col overflow-hidden ${currentId ? 'flex' : 'hidden md:flex'}`}
        style={{ background: '#0B1220' }}
      >
        {children}
      </div>

    </div>
  )
}
