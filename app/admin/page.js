'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Star, Users, ShieldCheck, Plane, Package, GitMerge, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const CARD_BG  = '#16203A'
const HAIRLINE = 'rgba(255,255,255,0.07)'
const FG1      = '#F1F4FB'
const FG2      = '#A6B0CC'
const FG3      = '#6E7A99'

/* ── KYC status badge ─────────────────────────────────────── */
const KYC_BADGE = {
  approved:    { label: '✓ Verified',        bg: 'rgba(46,189,122,0.10)',  color: '#56CD93' },
  in_progress: { label: '⏳ In Progress',    bg: 'rgba(224,123,41,0.10)', color: '#E07B29' },
  rejected:    { label: '✗ Rejected',        bg: 'rgba(239,68,68,0.10)',  color: '#EF4444' },
  not_started: { label: 'Not Verified',      bg: 'rgba(255,255,255,0.06)', color: FG3 },
}

function KycBadge({ status }) {
  const b = KYC_BADGE[status] || KYC_BADGE.not_started
  return (
    <span className="text-xs font-bold px-2.5 py-1 rounded-full"
      style={{ background: b.bg, color: b.color }}>
      {b.label}
    </span>
  )
}

export default function AdminPanel() {
  const router = useRouter()
  const [user, setUser]           = useState(null)
  const [inProgressUsers, setInProgressUsers] = useState([])
  const [allUsers, setAllUsers]   = useState([])
  const [reviews, setReviews]     = useState([])
  const [stats, setStats]         = useState(null)
  const [tab, setTab]             = useState('overview')
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()
      if (!profile?.is_admin) { router.push('/'); return }
      setUser(user)

      const [
        inProgressRes,
        allUsersRes,
        reviewsRes,
        tripsRes,
        requestsRes,
        matchesRes,
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('kyc_status', 'in_progress').order('created_at', { ascending: true }),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('reviews').select('*, reviewer:profiles!reviews_reviewer_id_fkey(full_name), reviewee:profiles!reviews_reviewee_id_fkey(full_name)').order('created_at', { ascending: false }),
        supabase.from('trips').select('id, status'),
        supabase.from('shipment_requests').select('id, status'),
        supabase.from('matches').select('id, status'),
      ])

      const allUsersData  = allUsersRes.data  || []
      const tripsData     = tripsRes.data     || []
      const requestsData  = requestsRes.data  || []
      const matchesData   = matchesRes.data   || []

      setInProgressUsers(inProgressRes.data || [])
      setAllUsers(allUsersData)
      setReviews(reviewsRes.data || [])

      setStats({
        totalUsers:       allUsersData.length,
        approvedKYC:      allUsersData.filter(u => u.kyc_status === 'approved').length,
        inProgressKYC:    allUsersData.filter(u => u.kyc_status === 'in_progress').length,
        rejectedKYC:      allUsersData.filter(u => u.kyc_status === 'rejected').length,
        notStartedKYC:    allUsersData.filter(u => !u.kyc_status || u.kyc_status === 'not_started').length,
        activeTrips:      tripsData.filter(t => t.status === 'active').length,
        openRequests:     requestsData.filter(r => r.status === 'open').length,
        totalMatches:     matchesData.length,
        deliveredMatches: matchesData.filter(m => m.status === 'delivered').length,
        totalReviews:     (reviewsRes.data || []).length,
      })

      setLoading(false)
    }
    load()
  }, [router])

  async function revokeUser(userId) {
    await supabase.from('profiles').update({
      is_verified: false,
      kyc_status: 'not_started',
      didit_session_id: null,
    }).eq('id', userId)
    setAllUsers(prev => prev.map(u => u.id === userId
      ? { ...u, is_verified: false, kyc_status: 'not_started' }
      : u
    ))
    setStats(s => ({ ...s, approvedKYC: Math.max(0, s.approvedKYC - 1), notStartedKYC: s.notStartedKYC + 1 }))
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: '#0B1220' }}>
      <div className="text-sm animate-pulse" style={{ color: FG3 }}>Loading admin panel…</div>
    </div>
  )

  const TABS = [
    { key: 'overview', label: 'Overview' },
    { key: 'kyc',      label: `KYC Status${stats?.inProgressKYC ? ` · ${stats.inProgressKYC} in progress` : ''}` },
    { key: 'users',    label: 'All Users' },
    { key: 'reviews',  label: 'Reviews' },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#0B1220', paddingTop: 72 }}>
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black" style={{ color: FG1 }}>Admin Panel</h1>
          <p className="text-sm mt-0.5" style={{ color: FG3 }}>Inambebar platform management · {user?.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
            style={tab === t.key
              ? { background: '#E07B29', color: 'white' }
              : { background: CARD_BG, color: FG3, border: `1px solid ${HAIRLINE}` }}
            onMouseEnter={e => { if (tab !== t.key) e.currentTarget.style.color = FG2 }}
            onMouseLeave={e => { if (tab !== t.key) e.currentTarget.style.color = FG3 }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'overview' && stats && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { icon: Users,       label: 'Total Users',    value: stats.totalUsers,       color: FG1 },
              { icon: ShieldCheck, label: 'KYC Approved',   value: stats.approvedKYC,      color: '#2EBD7A' },
              { icon: Clock,       label: 'KYC In Progress',value: stats.inProgressKYC,    color: '#E07B29' },
              { icon: XCircle,     label: 'KYC Rejected',   value: stats.rejectedKYC,      color: '#EF4444' },
              { icon: Plane,       label: 'Active Trips',   value: stats.activeTrips,      color: '#A78BF8' },
              { icon: Package,     label: 'Open Requests',  value: stats.openRequests,     color: '#E07B29' },
              { icon: CheckCircle, label: 'Delivered',      value: stats.deliveredMatches, color: '#2EBD7A' },
              { icon: Star,        label: 'Reviews',        value: stats.totalReviews,     color: '#E07B29' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="rounded-2xl p-5" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wide" style={{ color: FG3 }}>{label}</span>
                  <Icon size={16} color={color} />
                </div>
                <div className="text-3xl font-black" style={{ color }}>{value}</div>
              </div>
            ))}
          </div>

          {/* KYC breakdown bar */}
          <div className="rounded-2xl p-6 mb-4" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
            <h3 className="font-bold text-sm mb-3" style={{ color: FG1 }}>KYC Breakdown</h3>
            <div className="flex rounded-full overflow-hidden h-3 mb-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
              {stats.totalUsers > 0 && [
                { val: stats.approvedKYC,   color: '#2EBD7A' },
                { val: stats.inProgressKYC, color: '#E07B29' },
                { val: stats.rejectedKYC,   color: '#EF4444' },
              ].map(({ val, color }, i) => val > 0 && (
                <div key={i} style={{ width: `${(val / stats.totalUsers) * 100}%`, background: color }} />
              ))}
            </div>
            <div className="flex gap-4 flex-wrap text-xs" style={{ color: FG3 }}>
              <span><span style={{ color: '#2EBD7A' }}>●</span> Approved: {stats.approvedKYC}</span>
              <span><span style={{ color: '#E07B29' }}>●</span> In Progress: {stats.inProgressKYC}</span>
              <span><span style={{ color: '#EF4444' }}>●</span> Rejected: {stats.rejectedKYC}</span>
              <span><span style={{ color: FG3 }}>●</span> Not Started: {stats.notStartedKYC}</span>
            </div>
          </div>

          <div className="rounded-2xl p-6" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
            <p className="text-xs" style={{ color: FG3 }}>
              {stats.approvedKYC} of {stats.totalUsers} users verified ({stats.totalUsers > 0 ? Math.round(stats.approvedKYC / stats.totalUsers * 100) : 0}%) ·{' '}
              {stats.deliveredMatches} of {stats.totalMatches} matches delivered ({stats.totalMatches > 0 ? Math.round(stats.deliveredMatches / stats.totalMatches * 100) : 0}%)
            </p>
          </div>
        </div>
      )}

      {/* ── KYC STATUS ── */}
      {tab === 'kyc' && (
        <div>
          {/* Didit info banner */}
          <div className="rounded-2xl p-5 mb-6 flex items-start gap-4"
            style={{ background: 'rgba(46,189,122,0.05)', border: '1px solid rgba(46,189,122,0.18)' }}>
            <ShieldCheck size={20} style={{ color: '#2EBD7A', flexShrink: 0, marginTop: 2 }} strokeWidth={1.5} />
            <div>
              <p className="font-bold text-sm" style={{ color: '#2EBD7A' }}>KYC powered by Didit</p>
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: FG3 }}>
                Identity verification is fully automated. Users are redirected to Didit&apos;s secure flow and
                results are received via webhook — no manual document review needed.
                You can revoke verified status from the All Users tab if fraud is detected.
              </p>
            </div>
          </div>

          {/* In-progress users */}
          <h3 className="font-bold text-sm mb-4" style={{ color: FG2 }}>Currently in progress ({inProgressUsers.length})</h3>
          {inProgressUsers.length === 0 ? (
            <div className="rounded-xl p-10 text-center text-sm" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}`, color: FG3 }}>
              No users currently in verification
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${HAIRLINE}` }}>
                    <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: FG3 }}>User</th>
                    <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: FG3 }}>Session ID</th>
                    <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: FG3 }}>Started</th>
                  </tr>
                </thead>
                <tbody>
                  {inProgressUsers.map((u, idx) => (
                    <tr key={u.id}
                      style={{ borderBottom: `1px solid ${HAIRLINE}`, background: idx % 2 === 1 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                      <td className="px-5 py-3">
                        <div className="font-semibold" style={{ color: FG1 }}>{u.full_name || 'No name'}</div>
                        <div className="text-xs" style={{ color: FG3 }}>{u.id.slice(0,8)}…</div>
                      </td>
                      <td className="px-5 py-3 text-xs font-mono" style={{ color: FG3 }}>
                        {u.didit_session_id ? u.didit_session_id.slice(0, 16) + '…' : '—'}
                      </td>
                      <td className="px-5 py-3 text-xs" style={{ color: FG3 }}>
                        {new Date(u.updated_at || u.created_at).toLocaleDateString('en-GB')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── ALL USERS ── */}
      {tab === 'users' && (
        <div className="rounded-2xl overflow-hidden" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${HAIRLINE}` }}>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: FG3 }}>User</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: FG3 }}>KYC Status</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: FG3 }}>Rating</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: FG3 }}>Joined</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: FG3 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((u, idx) => (
                <tr key={u.id}
                  style={{ borderBottom: `1px solid ${HAIRLINE}`, background: idx % 2 === 1 ? 'rgba(255,255,255,0.02)' : 'transparent' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 1 ? 'rgba(255,255,255,0.02)' : 'transparent'}>
                  <td className="px-5 py-3">
                    <div className="font-semibold" style={{ color: FG1 }}>{u.full_name || 'No name'}</div>
                    <div className="text-xs" style={{ color: FG3 }}>{u.id.slice(0,8)}…</div>
                  </td>
                  <td className="px-5 py-3">
                    <KycBadge status={u.kyc_status || (u.is_verified ? 'approved' : 'not_started')} />
                  </td>
                  <td className="px-5 py-3">
                    {u.rating_avg ? (
                      <div className="flex items-center gap-1">
                        <Star size={12} fill="#E07B29" color="#E07B29" />
                        <span className="text-xs font-semibold" style={{ color: FG1 }}>{u.rating_avg}</span>
                        <span className="text-xs" style={{ color: FG3 }}>({u.rating_count})</span>
                      </div>
                    ) : <span className="text-xs" style={{ color: FG3 }}>—</span>}
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: FG3 }}>
                    {new Date(u.created_at).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-5 py-3">
                    {(u.kyc_status === 'approved' || u.is_verified) ? (
                      <button onClick={() => revokeUser(u.id)}
                        className="text-xs font-bold transition-opacity hover:opacity-70"
                        style={{ color: '#EF4444' }}>
                        Revoke
                      </button>
                    ) : (
                      <span style={{ color: FG3 }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── REVIEWS ── */}
      {tab === 'reviews' && (
        <div>
          {reviews.length === 0 ? (
            <div className="rounded-xl p-10 text-center text-sm" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}`, color: FG3 }}>
              No reviews submitted yet
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map(r => (
                <div key={r.id} className="rounded-2xl p-5" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm" style={{ color: FG1 }}>
                          {r.reviewer?.full_name || 'Anonymous'}
                        </span>
                        <span className="text-xs" style={{ color: FG3 }}>→</span>
                        <span className="font-semibold text-sm" style={{ color: FG1 }}>
                          {r.reviewee?.full_name || 'Anonymous'}
                        </span>
                      </div>
                      {r.comment && (
                        <p className="text-sm mt-1" style={{ color: FG2 }}>&quot;{r.comment}&quot;</p>
                      )}
                      <p className="text-xs mt-1" style={{ color: FG3 }}>
                        {new Date(r.created_at).toLocaleDateString('en-GB', {day:'numeric',month:'short',year:'numeric'})}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={14}
                          fill={i <= r.rating ? '#E07B29' : 'none'}
                          color={i <= r.rating ? '#E07B29' : '#3D5180'}
                          strokeWidth={1.5} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
    </div>
  )
}
