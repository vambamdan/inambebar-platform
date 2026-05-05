'use client'
import { useEffect, useState, useRef } from 'react'
import { Bell } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const HAIRLINE = 'rgba(255,255,255,0.07)'
const FG1      = '#F1F4FB'
const FG2      = '#A6B0CC'
const FG3      = '#6E7A99'

const STATUS_LABELS = {
  pending:    { label: 'New match request',  color: '#E07B29' },
  accepted:   { label: 'Match accepted',     color: '#2EBD7A' },
  in_transit: { label: 'Package in transit', color: '#6366f1' },
  delivered:  { label: 'Delivery confirmed', color: '#2EBD7A' },
  cancelled:  { label: 'Match cancelled',    color: '#6E7A99' },
}

export default function NotificationBell({ userId }) {
  const [open, setOpen]       = useState(false)
  const [items, setItems]     = useState([])
  const [unread, setUnread]   = useState(0)
  const [loading, setLoading] = useState(true)
  const ref                   = useRef(null)

  useEffect(() => {
    if (!userId) return

    async function loadActivity() {
      const [matchesRes, reviewsRes] = await Promise.all([
        supabase
          .from('matches')
          .select(`
            id, status, updated_at,
            trips(origin_city, destination_city),
            shipment_requests(item_description, origin_city, destination_city),
            traveler:profiles!matches_traveler_id_fkey(full_name),
            sender:profiles!matches_sender_id_fkey(full_name)
          `)
          .or(`traveler_id.eq.${userId},sender_id.eq.${userId}`)
          .order('updated_at', { ascending: false })
          .limit(8),
        supabase
          .from('reviews')
          .select('id, rating, created_at, reviewer:profiles!reviews_reviewer_id_fkey(full_name)')
          .eq('reviewee_id', userId)
          .order('created_at', { ascending: false })
          .limit(4),
      ])

      const matchItems = (matchesRes.data || []).map(m => {
        const isTravel = m.traveler_id === userId
        const other = isTravel ? m.sender : m.traveler
        const route = m.trips
          ? `${m.trips.origin_city} → ${m.trips.destination_city}`
          : m.shipment_requests
            ? `${m.shipment_requests.origin_city} → ${m.shipment_requests.destination_city}`
            : 'Unknown route'
        const st = STATUS_LABELS[m.status] || STATUS_LABELS.pending
        return {
          id: `match-${m.id}`,
          href: `/matches/${m.id}`,
          icon: '✈',
          title: st.label,
          subtitle: `${other?.full_name || 'User'} · ${route}`,
          color: st.color,
          time: m.updated_at,
        }
      })

      const reviewItems = (reviewsRes.data || []).map(r => ({
        id: `review-${r.id}`,
        href: `/profile/${userId}`,
        icon: '⭐',
        title: `${r.reviewer?.full_name || 'Someone'} left you a ${r.rating}-star review`,
        subtitle: '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating),
        color: '#E07B29',
        time: r.created_at,
      }))

      const all = [...matchItems, ...reviewItems]
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 10)

      setItems(all)
      const yesterday = Date.now() - 86400000
      setUnread(all.filter(i => new Date(i.time) > yesterday).length)
      setLoading(false)
    }

    loadActivity()

    const channel = supabase
      .channel('notif-bell')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, loadActivity)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'reviews',
        filter: `reviewee_id=eq.${userId}`,
      }, loadActivity)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [userId])

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleOpen() {
    setOpen(o => !o)
    if (!open) setUnread(0)
  }

  function timeAgo(iso) {
    const diff = Date.now() - new Date(iso)
    const mins = Math.floor(diff / 60000)
    if (mins < 1)  return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24)  return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative w-9 h-9 rounded-full flex items-center justify-center transition-colors active:scale-95"
        style={{ border: `1px solid ${HAIRLINE}`, color: FG3, background: 'rgba(255,255,255,0.04)' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(224,123,41,0.40)'; e.currentTarget.style.color = '#E07B29' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = HAIRLINE; e.currentTarget.style.color = FG3 }}
        aria-label="Notifications"
      >
        <Bell size={17} />
        {unread > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white flex items-center justify-center text-[9px] font-bold"
            style={{ background: '#E07B29', border: '1.5px solid #0B1220' }}
          >
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-12 w-80 rounded-2xl overflow-hidden z-50"
          style={{
            background: '#16203A',
            border: `1px solid ${HAIRLINE}`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
          }}
        >
          {/* Header */}
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
            <span className="text-sm font-bold" style={{ color: FG1 }}>Notifications</span>
            {items.length > 0 && (
              <Link
                href="/matches"
                onClick={() => setOpen(false)}
                className="text-xs font-semibold transition-opacity hover:opacity-80"
                style={{ color: '#E07B29' }}
              >
                View all →
              </Link>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-6 text-center text-sm" style={{ color: FG3 }}>Loading…</div>
            ) : items.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <div className="text-2xl mb-2">🔔</div>
                <p className="text-sm" style={{ color: FG3 }}>No activity yet</p>
                <p className="text-xs mt-1" style={{ color: FG3 }}>Matches and reviews will appear here</p>
              </div>
            ) : (
              items.map(item => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 px-4 py-3 transition-colors"
                  style={{ borderBottom: `1px solid ${HAIRLINE}` }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                    style={{ background: `${item.color}20` }}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-tight" style={{ color: FG1 }}>{item.title}</p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: FG3 }}>{item.subtitle}</p>
                  </div>
                  <span className="text-xs flex-shrink-0 mt-0.5" style={{ color: FG3 }}>{timeAgo(item.time)}</span>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
