'use client'
import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Plane, Package, MessageCircle, ChevronRight, ShieldCheck, Bell, Smartphone, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'
import { registerPush, unregisterPush, isPushSubscribed, isPushSupported } from '@/lib/pushClient'

const CARD_BG  = '#16203A'
const HAIRLINE = 'rgba(255,255,255,0.07)'
const FG1      = '#F1F4FB'
const FG2      = '#A6B0CC'
const FG3      = '#6E7A99'

const STATUS_STYLES = {
  pending:    { bg: 'rgba(224,169,41,0.12)',  text: '#E0A929', label: 'Pending'    },
  accepted:   { bg: 'rgba(46,189,122,0.10)',  text: '#56CD93', label: 'Accepted'   },
  in_transit: { bg: 'rgba(131,109,200,0.12)', text: '#A78BF8', label: 'In Transit' },
  delivered:  { bg: 'rgba(46,189,122,0.10)',  text: '#56CD93', label: 'Delivered'  },
  cancelled:  { bg: 'rgba(255,255,255,0.06)', text: '#6E7A99', label: 'Cancelled'  },
}

function DashboardInner() {
  const [user, setUser]             = useState(null)
  const [profile, setProfile]       = useState(null)
  const [myTrips, setMyTrips]       = useState([])
  const [myRequests, setMyRequests] = useState([])
  const [myMatches, setMyMatches]   = useState([])
  const [loading, setLoading]       = useState(true)
  const [savingPref, setSavingPref]       = useState(false)
  const [pushSupported, setPushSupported] = useState(false)
  const [pushEnabled, setPushEnabled]     = useState(false)
  const [togglingPush, setTogglingPush]   = useState(false)
  const router       = useRouter()
  const searchParams = useSearchParams()
  const { t, isFa } = useLanguage()
  const fontStyle    = isFa ? { fontFamily: "'Vazirmatn', sans-serif" } : {}
  const [tab, setTab] = useState(() => {
    const p = searchParams?.get('tab')
    return p === 'matches' || p === 'requests' ? p : 'trips'
  })

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      setUser(user)
      const [profileRes, tripsRes, requestsRes, matchesRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('trips').select('*').eq('traveler_id', user.id).order('created_at', { ascending: false }),
        supabase.from('shipment_requests').select('*').eq('sender_id', user.id).order('created_at', { ascending: false }),
        supabase.from('matches').select(`
          id, status, agreed_price, created_at, traveler_id, sender_id,
          trips(origin_city, destination_city),
          shipment_requests(origin_city, destination_city, item_description),
          traveler:profiles!matches_traveler_id_fkey(full_name),
          sender:profiles!matches_sender_id_fkey(full_name)
        `).or(`traveler_id.eq.${user.id},sender_id.eq.${user.id}`).order('created_at', { ascending: false }),
      ])
      setProfile(profileRes.data)
      setMyTrips(tripsRes.data || [])
      setMyRequests(requestsRes.data || [])
      setMyMatches(matchesRes.data || [])
      setLoading(false)
    }
    load()
  }, [router])

  useEffect(() => {
    async function checkPush() {
      const supported = await isPushSupported()
      setPushSupported(supported)
      if (supported) setPushEnabled(await isPushSubscribed())
    }
    checkPush()
  }, [])

  async function handlePushToggle() {
    if (!user || togglingPush) return
    setTogglingPush(true)
    if (pushEnabled) { await unregisterPush(user.id); setPushEnabled(false) }
    else { const ok = await registerPush(user.id); setPushEnabled(ok) }
    setTogglingPush(false)
  }

  async function togglePref(key) {
    if (!profile || savingPref) return
    const current = profile.notification_preferences ?? {}
    const updated = { ...current, [key]: current[key] === false ? true : false }
    setProfile(p => ({ ...p, notification_preferences: updated }))
    setSavingPref(true)
    await supabase.from('profiles').update({ notification_preferences: updated }).eq('id', user.id)
    setSavingPref(false)
  }

  async function toggleTripStatus(tripId, currentStatus) {
    const next = currentStatus === 'active' ? 'full' : 'active'
    await supabase.from('trips').update({ status: next }).eq('id', tripId)
    setMyTrips(prev => prev.map(tr => tr.id === tripId ? { ...tr, status: next } : tr))
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: '#0B1220' }}>
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
          style={{ background: 'rgba(224,123,41,0.08)', border: `1px solid rgba(224,123,41,0.15)` }}>
          <Package size={22} style={{ color: '#E07B29' }} strokeWidth={1.5} />
        </div>
        <div className="text-sm" style={{ color: FG3 }}>Loading your dashboard...</div>
      </div>
    </div>
  )

  const activeMatches = myMatches.filter(m => m.status !== 'cancelled' && m.status !== 'delivered')

  return (
    <div className="min-h-screen" style={{ background: '#0B1220', paddingTop: 72 }}>
    <div className="max-w-5xl mx-auto px-6 py-10" style={fontStyle}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: FG1, letterSpacing: '-0.025em' }}>
            {t?.welcomeBack || 'Welcome back'}{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-sm mt-1" style={{ color: FG3 }}>{user?.email}</p>
        </div>
        <div className="flex gap-2 items-center">
          {profile?.is_verified ? (
            <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(46,189,122,0.10)', color: '#56CD93', border: '1px solid rgba(46,189,122,0.20)' }}>
              <ShieldCheck size={12} /> {t?.verified || 'Verified'}
            </span>
          ) : (
            <Link href="/verify"
              className="text-xs font-semibold px-3 py-1.5 rounded-full transition-opacity hover:opacity-80"
              style={{ background: 'rgba(224,123,41,0.10)', color: '#E07B29', border: '1px solid rgba(224,123,41,0.22)' }}>
              {t?.getVerified || 'Get verified'} →
            </Link>
          )}
          <Link href={`/profile/${user?.id}`}
            className="text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
            style={{ color: FG2, border: `1px solid ${HAIRLINE}`, background: 'rgba(255,255,255,0.04)' }}>
            {t?.myProfile || 'My profile'}
          </Link>
        </div>
      </div>

      {/* ── Action cards ── */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {[
          { href: '/trips/new',    Icon: Plane,   titleKey: 'postATrip',    descKey: 'flyingSoon',  fallbackT: 'Post a Trip',     fallbackD: 'Flying soon? Offer your spare luggage space.' },
          { href: '/requests/new', Icon: Package, titleKey: 'sendAPackage', descKey: 'needToSend',  fallbackT: 'Send a Package',  fallbackD: 'Need to send something? Find a traveler.' },
        ].map(({ href, Icon, titleKey, descKey, fallbackT, fallbackD }) => (
          <Link key={href} href={href}
            className="card-hover block rounded-2xl p-6"
            style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-4 w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(224,123,41,0.08)', border: '1px solid rgba(224,123,41,0.15)' }}>
              <Icon size={20} style={{ color: '#E07B29' }} strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-base mb-1.5" style={{ color: FG1 }}>{t?.[titleKey] || fallbackT}</h3>
            <p className="text-sm leading-relaxed" style={{ color: FG3 }}>{t?.[descKey] || fallbackD}</p>
            <div className="mt-4 text-sm font-semibold flex items-center gap-1" style={{ color: '#E07B29' }}>
              {t?.postNow || 'Post now'} <ArrowRight size={13} />
            </div>
          </Link>
        ))}
      </div>

      {/* ── Tab bar ── */}
      <div className="flex mb-6" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
        {[
          { key: 'trips',    label: t?.myTrips || 'My Trips',            count: myTrips.length,         highlight: false },
          { key: 'requests', label: t?.myRequests || 'My Requests',       count: myRequests.length,      highlight: false },
          { key: 'matches',  label: t?.conversations || 'Conversations',   count: activeMatches.length,   highlight: activeMatches.length > 0 },
        ].map(tb => (
          <button key={tb.key} onClick={() => setTab(tb.key)}
            className="relative px-5 py-3 text-sm font-semibold transition-colors"
            style={{ color: tab === tb.key ? FG1 : FG3 }}>
            {tb.label}
            {tb.count > 0 && (
              <span className="ml-1.5 text-xs font-bold px-1.5 py-0.5 rounded-full"
                style={tb.highlight
                  ? { background: 'rgba(224,123,41,0.15)', color: '#E07B29' }
                  : { background: 'rgba(255,255,255,0.06)', color: FG3 }}>
                {tb.count}
              </span>
            )}
            {tab === tb.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full" style={{ background: '#E07B29' }} />
            )}
          </button>
        ))}
      </div>

      {/* ── My Trips ── */}
      {tab === 'trips' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-base" style={{ color: FG1 }}>{t?.myTrips || 'My Trips'}</h2>
            <Link href="/trips/new" className="text-sm font-semibold" style={{ color: '#E07B29' }}>{t?.addTrip || '+ Add trip'}</Link>
          </div>
          {myTrips.length === 0 ? (
            <div className="rounded-xl p-10 text-center text-sm" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}`, color: FG3 }}>
              {t?.noTrips || 'No trips posted yet.'}{' '}
              <Link href="/trips/new" className="font-semibold" style={{ color: '#E07B29' }}>{t?.postFirstTrip || 'Post your first trip →'}</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {myTrips.map(trip => (
                <div key={trip.id} className="rounded-xl p-4 transition-all" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
                  <div className="flex items-center justify-between">
                    <Link href={`/trips/${trip.id}`} className="flex-1 group flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm" style={{ color: FG1 }}>
                          {trip.origin_city} → {trip.destination_city}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: FG3 }}>
                          {new Date(trip.departure_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {' · '}{trip.available_weight_kg}kg · ${trip.price_per_kg}/kg
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mr-2">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={trip.status === 'active'
                            ? { background: 'rgba(46,189,122,0.10)', color: '#56CD93' }
                            : trip.status === 'full'
                            ? { background: 'rgba(224,123,41,0.10)', color: '#E07B29' }
                            : { background: 'rgba(255,255,255,0.05)', color: FG3 }}>
                          {trip.status === 'active' ? (t?.statusActive || 'Active')
                           : trip.status === 'full' ? (t?.statusFull || 'Full')
                           : trip.status}
                        </span>
                        <ChevronRight size={15} style={{ color: FG3 }} />
                      </div>
                    </Link>
                    <button
                      onClick={() => toggleTripStatus(trip.id, trip.status)}
                      className="ml-2 text-xs font-semibold px-2.5 py-1.5 rounded-lg flex-shrink-0 transition-colors"
                      style={{ color: FG3, background: 'rgba(255,255,255,0.04)', border: `1px solid ${HAIRLINE}` }}
                      title={trip.status === 'active' ? 'Mark as Full' : 'Mark as Active'}>
                      {trip.status === 'active' ? 'Mark Full' : 'Mark Active'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── My Requests ── */}
      {tab === 'requests' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-base" style={{ color: FG1 }}>{t?.myRequests || 'My Shipment Requests'}</h2>
            <Link href="/requests/new" className="text-sm font-semibold" style={{ color: '#E07B29' }}>{t?.addRequest || '+ Add request'}</Link>
          </div>
          {myRequests.length === 0 ? (
            <div className="rounded-xl p-10 text-center text-sm" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}`, color: FG3 }}>
              {t?.noRequests || 'No requests posted yet.'}{' '}
              <Link href="/requests/new" className="font-semibold" style={{ color: '#E07B29' }}>{t?.postShipmentRequest || 'Post a shipment request →'}</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {myRequests.map(req => (
                <Link key={req.id} href={`/requests/${req.id}`}
                  className="flex items-center justify-between rounded-xl p-4 transition-all"
                  style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}`, display: 'flex' }}>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: FG1 }}>
                      {req.origin_city} → {req.destination_city}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: FG3 }}>
                      {req.item_description} · {req.weight_kg}kg
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={req.status === 'open'
                        ? { background: 'rgba(46,189,122,0.10)', color: '#56CD93' }
                        : { background: 'rgba(255,255,255,0.05)', color: FG3 }}>
                      {req.status === 'open' ? (t?.statusOpen || 'Open') : req.status}
                    </span>
                    <ChevronRight size={15} style={{ color: FG3 }} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Conversations ── */}
      {tab === 'matches' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-base" style={{ color: FG1 }}>{t?.conversations || 'Conversations'}</h2>
            {activeMatches.length > 0 && (
              <span className="text-xs" style={{ color: FG3 }}>{activeMatches.length} {t?.activeConversations || 'active'}</span>
            )}
          </div>

          {myMatches.length === 0 ? (
            <div className="rounded-xl p-10 text-center" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
              <MessageCircle size={32} style={{ color: FG3 }} className="mx-auto mb-3" />
              <p className="text-sm mb-4" style={{ color: FG3 }}>No conversations yet.</p>
              <div className="flex justify-center gap-3">
                <Link href="/trips"
                  className="text-xs font-semibold px-4 py-2 rounded-xl text-white"
                  style={{ background: '#233355', border: `1px solid ${HAIRLINE}` }}>
                  Browse travelers
                </Link>
                <Link href="/requests/new"
                  className="text-xs font-semibold px-4 py-2 rounded-xl text-white"
                  style={{ background: '#E07B29' }}>
                  Post a request
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {myMatches.map(match => {
                const isTraveler = match.traveler_id === user?.id
                const other      = isTraveler ? match.sender : match.traveler
                const st         = STATUS_STYLES[match.status] || STATUS_STYLES.pending
                const route      = match.trips
                  ? `${match.trips.origin_city} → ${match.trips.destination_city}`
                  : match.shipment_requests
                    ? `${match.shipment_requests.origin_city} → ${match.shipment_requests.destination_city}`
                    : null

                return (
                  <Link key={match.id} href={`/matches/${match.id}`}
                    className="flex items-center justify-between rounded-xl p-4 transition-all card-hover"
                    style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}`, display: 'flex' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #1A2744, #2E4068)' }}>
                        {other?.full_name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <div className="font-semibold text-sm" style={{ color: FG1 }}>{other?.full_name || 'User'}</div>
                        {route && <div className="text-xs mt-0.5" style={{ color: FG3 }}>{route}</div>}
                        {match.shipment_requests?.item_description && (
                          <div className="text-xs mt-0.5" style={{ color: FG3 }}>{match.shipment_requests.item_description}</div>
                        )}
                        <div className="text-xs mt-0.5" style={{ color: FG3 }}>
                          {new Date(match.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {match.agreed_price && (
                        <span className="text-sm font-bold" style={{ color: '#E07B29' }}>${match.agreed_price}</span>
                      )}
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: st.bg, color: st.text }}>
                        {st.label}
                      </span>
                      <ChevronRight size={15} style={{ color: FG3 }} />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Notification Preferences ── */}
      <div className="mt-10 rounded-2xl p-6" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2 mb-5">
          <Bell size={18} style={{ color: FG2 }} />
          <h2 className="font-semibold text-base" style={{ color: FG1 }}>Notifications</h2>
        </div>

        {pushSupported && (
          <div className="mb-6 pb-5" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${HAIRLINE}` }}>
                  <Smartphone size={16} style={{ color: FG2 }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: FG1 }}>Push notifications</p>
                  <p className="text-xs mt-0.5" style={{ color: FG3 }}>Instant alerts on this device, even when the tab is closed</p>
                </div>
              </div>
              <button type="button" onClick={handlePushToggle} disabled={togglingPush}
                className="relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-60"
                style={{ background: pushEnabled ? '#1A2744' : 'rgba(255,255,255,0.10)' }}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${pushEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        )}

        <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: FG3, letterSpacing: '0.07em' }}>Email</p>
        <div className="space-y-4">
          {[
            { key: 'email_new_message',   label: 'New messages',       desc: 'Get notified when someone sends you a message' },
            { key: 'email_new_match',     label: 'New match requests',  desc: 'Get notified when someone matches with your trip or request' },
            { key: 'email_status_change', label: 'Status updates',      desc: 'Notified when a match status changes (accepted, in transit, delivered)' },
            { key: 'email_review',        label: 'New reviews',         desc: 'Get notified when someone leaves you a review' },
          ].map(({ key, label, desc }) => {
            const prefs = profile?.notification_preferences ?? {}
            const isOn  = prefs[key] !== false
            return (
              <div key={key} className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: FG1 }}>{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: FG3 }}>{desc}</p>
                </div>
                <button type="button" onClick={() => togglePref(key)} disabled={savingPref}
                  className="relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-60"
                  style={{ background: isOn ? '#E07B29' : 'rgba(255,255,255,0.10)' }}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${isOn ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            )
          })}
        </div>
      </div>

    </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: '#0B1220' }}><span style={{ color: '#6E7A99', fontSize: '0.875rem' }}>Loading…</span></div>}>
      <DashboardInner />
    </Suspense>
  )
}
