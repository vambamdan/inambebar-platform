'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Star, Users, ShieldCheck, Plane, Package, GitMerge, CheckCircle, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const CARD_BG  = '#16203A'
const HAIRLINE = 'rgba(255,255,255,0.07)'
const FG1      = '#F1F4FB'
const FG2      = '#A6B0CC'
const FG3      = '#6E7A99'

export default function AdminPanel() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [pendingUsers, setPendingUsers] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState(null)
  const [tab, setTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [docUrls, setDocUrls] = useState({})

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
        pendingRes,
        allUsersRes,
        reviewsRes,
        tripsRes,
        requestsRes,
        matchesRes,
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('verification_level', 'id').eq('is_verified', false).order('created_at', { ascending: true }),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('reviews').select('*, reviewer:profiles!reviews_reviewer_id_fkey(full_name), reviewee:profiles!reviews_reviewee_id_fkey(full_name)').order('created_at', { ascending: false }),
        supabase.from('trips').select('id, status', { count: 'exact', head: false }),
        supabase.from('shipment_requests').select('id, status', { count: 'exact', head: false }),
        supabase.from('matches').select('id, status', { count: 'exact', head: false }),
      ])

      const allUsersData = allUsersRes.data || []
      const tripsData = tripsRes.data || []
      const requestsData = requestsRes.data || []
      const matchesData = matchesRes.data || []

      setPendingUsers(pendingRes.data || [])
      setAllUsers(allUsersData)
      setReviews(reviewsRes.data || [])

      setStats({
        totalUsers: allUsersData.length,
        verifiedUsers: allUsersData.filter(u => u.is_verified).length,
        pendingKYC: (pendingRes.data || []).length,
        activeTrips: tripsData.filter(t => t.status === 'active').length,
        openRequests: requestsData.filter(r => r.status === 'open').length,
        totalMatches: matchesData.length,
        deliveredMatches: matchesData.filter(m => m.status === 'delivered').length,
        totalReviews: (reviewsRes.data || []).length,
      })

      setLoading(false)
    }
    load()
  }, [router])

  async function loadDocs(userId) {
    if (docUrls[userId]) return
    const { data: files } = await supabase.storage
      .from('kyc-documents')
      .list(`kyc/${userId}`)

    if (!files?.length) return

    const urls = {}
    for (const file of files) {
      const { data } = await supabase.storage
        .from('kyc-documents')
        .createSignedUrl(`kyc/${userId}/${file.name}`, 3600)
      if (data?.signedUrl) {
        const type = file.name.includes('id_') ? 'id' : 'selfie'
        urls[type] = data.signedUrl
      }
    }
    setDocUrls(prev => ({...prev, [userId]: urls}))
  }

  async function approveUser(userId) {
    await supabase.from('profiles').update({ is_verified: true, verification_level: 'full' }).eq('id', userId)
    fetch('/api/notify/kyc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'approved', userId }) }).catch(() => {})
    setPendingUsers(prev => prev.filter(u => u.id !== userId))
    setAllUsers(prev => prev.map(u => u.id === userId ? {...u, is_verified: true, verification_level: 'full'} : u))
    setStats(s => ({ ...s, pendingKYC: s.pendingKYC - 1, verifiedUsers: s.verifiedUsers + 1 }))
  }

  async function rejectUser(userId) {
    await supabase.from('profiles').update({ verification_level: 'none' }).eq('id', userId)
    fetch('/api/notify/kyc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'rejected', userId }) }).catch(() => {})
    setPendingUsers(prev => prev.filter(u => u.id !== userId))
    setStats(s => ({ ...s, pendingKYC: s.pendingKYC - 1 }))
  }

  async function revokeUser(userId) {
    await supabase.from('profiles').update({ is_verified: false, verification_level: 'none' }).eq('id', userId)
    setAllUsers(prev => prev.map(u => u.id === userId ? {...u, is_verified: false, verification_level: 'none'} : u))
    setStats(s => ({ ...s, verifiedUsers: Math.max(0, s.verifiedUsers - 1) }))
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: '#0B1220' }}>
      <div className="text-sm" style={{ color: FG3 }}>Loading admin panel...</div>
    </div>
  )

  const TABS = [
    { key: 'overview', label: 'Overview' },
    { key: 'pending', label: `Pending KYC${stats?.pendingKYC ? ` (${stats.pendingKYC})` : ''}` },
    { key: 'users', label: 'All Users' },
    { key: 'reviews', label: 'Reviews' },
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Users,       label: 'Total Users',    value: stats.totalUsers,       color: FG1 },
              { icon: ShieldCheck, label: 'Verified',       value: stats.verifiedUsers,    color: '#2EBD7A' },
              { icon: Clock,       label: 'Pending KYC',    value: stats.pendingKYC,       color: '#E07B29' },
              { icon: Plane,       label: 'Active Trips',   value: stats.activeTrips,      color: '#A78BF8' },
              { icon: Package,     label: 'Open Requests',  value: stats.openRequests,     color: '#E07B29' },
              { icon: GitMerge,    label: 'Total Matches',  value: stats.totalMatches,     color: FG2 },
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

          <div className="rounded-2xl p-6" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
            <h3 className="font-bold text-sm mb-1" style={{ color: FG1 }}>Recent Activity</h3>
            <p className="text-xs" style={{ color: FG3 }}>
              {stats.verifiedUsers} of {stats.totalUsers} users verified ({stats.totalUsers > 0 ? Math.round(stats.verifiedUsers / stats.totalUsers * 100) : 0}%) ·{' '}
              {stats.deliveredMatches} of {stats.totalMatches} matches delivered ({stats.totalMatches > 0 ? Math.round(stats.deliveredMatches / stats.totalMatches * 100) : 0}%)
            </p>
          </div>
        </div>
      )}

      {/* ── PENDING KYC ── */}
      {tab === 'pending' && (
        <div>
          {/* Didit migration notice */}
          <div className="rounded-2xl p-5 mb-6 flex items-start gap-4"
            style={{ background: 'rgba(224,123,41,0.06)', border: '1px solid rgba(224,123,41,0.22)' }}>
            <div className="text-2xl">🔄</div>
            <div>
              <p className="font-bold text-sm" style={{ color: '#E07B29' }}>KYC transitioning to Didit</p>
              <p className="text-xs mt-0.5" style={{ color: FG3 }}>
                Manual document review is a temporary solution. This section will be replaced by automated Didit identity verification.
                Future submissions will be handled entirely by Didit — no documents will be stored here.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {pendingUsers.length === 0 ? (
              <div className="rounded-xl p-10 text-center text-sm" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}`, color: FG3 }}>
                No pending verification requests
              </div>
            ) : pendingUsers.map(u => (
              <div key={u.id} className="rounded-2xl p-6" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="font-bold" style={{ color: FG1 }}>{u.full_name || 'No name set'}</div>
                    <div className="text-xs mt-0.5" style={{ color: FG3 }}>ID: {u.id}</div>
                    <div className="text-xs" style={{ color: FG3 }}>
                      Joined: {new Date(u.created_at).toLocaleDateString('en-GB', {day:'numeric',month:'short',year:'numeric'})}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => approveUser(u.id)}
                      className="px-4 py-2 rounded-xl text-white text-sm font-bold transition-opacity hover:opacity-90"
                      style={{ background: '#2EBD7A' }}>
                      ✓ Approve
                    </button>
                    <button onClick={() => rejectUser(u.id)}
                      className="px-4 py-2 rounded-xl text-white text-sm font-bold transition-opacity hover:opacity-90"
                      style={{ background: '#EF4444' }}>
                      ✗ Reject
                    </button>
                  </div>
                </div>

                {!docUrls[u.id] ? (
                  <button onClick={() => loadDocs(u.id)}
                    className="text-sm font-semibold underline transition-opacity hover:opacity-80"
                    style={{ color: '#E07B29' }}>
                    Load Documents
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {docUrls[u.id]?.id && (
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: FG3 }}>ID Document</div>
                        <img src={docUrls[u.id].id} alt="ID" className="w-full rounded-xl object-contain max-h-48"
                          style={{ border: `1px solid ${HAIRLINE}` }} />
                      </div>
                    )}
                    {docUrls[u.id]?.selfie && (
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: FG3 }}>Selfie</div>
                        <img src={docUrls[u.id].selfie} alt="Selfie" className="w-full rounded-xl object-contain max-h-48"
                          style={{ border: `1px solid ${HAIRLINE}` }} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ALL USERS ── */}
      {tab === 'users' && (
        <div className="rounded-2xl overflow-hidden" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${HAIRLINE}` }}>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: FG3 }}>User</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: FG3 }}>Status</th>
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
                    {u.is_verified ? (
                      <span className="text-xs font-bold px-2 py-1 rounded-full"
                        style={{ background: 'rgba(46,189,122,0.10)', color: '#56CD93' }}>✓ Verified</span>
                    ) : u.verification_level === 'id' ? (
                      <span className="text-xs font-bold px-2 py-1 rounded-full"
                        style={{ background: 'rgba(224,123,41,0.10)', color: '#E07B29' }}>Pending Review</span>
                    ) : (
                      <span className="text-xs font-bold px-2 py-1 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.06)', color: FG3 }}>Unverified</span>
                    )}
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
                    {u.is_verified ? (
                      <button onClick={() => revokeUser(u.id)}
                        className="text-xs font-bold transition-colors"
                        style={{ color: '#EF4444' }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                        Revoke
                      </button>
                    ) : u.verification_level === 'id' ? (
                      <button onClick={() => approveUser(u.id)}
                        className="text-xs font-bold transition-opacity hover:opacity-80"
                        style={{ color: '#2EBD7A' }}>
                        Approve
                      </button>
                    ) : <span style={{ color: FG3 }}>—</span>}
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
