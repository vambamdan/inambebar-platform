'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Star, ShieldCheck, MapPin, Flag, Scale, Calendar, Package, ArrowLeft, FileText, Shirt, Laptop, Sparkles, Wind, Pill, UtensilsCrossed } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import VoicePitch from '@/components/VoicePitch'
import { useLanguage } from '@/lib/LanguageContext'

const CARD_BG  = '#16203A'
const HAIRLINE = 'rgba(255,255,255,0.07)'
const FG1      = '#F1F4FB'
const FG2      = '#A6B0CC'
const FG3      = '#6E7A99'

const CATEGORY_ICONS = {
  documents: FileText, clothing: Shirt, electronics: Laptop,
  cosmetics: Sparkles, cigarettes: Wind, medicine: Pill,
  food: UtensilsCrossed, other: Package,
}

export default function RequestDetail() {
  const { id } = useParams()
  const router  = useRouter()
  const [request, setRequest]         = useState(null)
  const [sender, setSender]           = useState(null)
  const [reviews, setReviews]         = useState([])
  const [user, setUser]               = useState(null)
  const [existingMatch, setExistingMatch] = useState(null)
  const [loading, setLoading]         = useState(true)
  const [contacting, setContacting]   = useState(false)
  const [message, setMessage]         = useState('')
  const { t, isFa } = useLanguage()
  const fontStyle = isFa ? { fontFamily: "'Vazirmatn', sans-serif" } : {}

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      const { data: reqData } = await supabase.from('shipment_requests').select('*, profiles(*)').eq('id', id).single()
      if (!reqData) { router.push('/requests'); return }
      setRequest(reqData)
      setSender(reqData.profiles)
      const [reviewRes, matchRes] = await Promise.all([
        supabase.from('reviews').select('*, profiles!reviews_reviewer_id_fkey(full_name)').eq('reviewee_id', reqData.sender_id).order('created_at', { ascending: false }).limit(5),
        user ? supabase.from('matches').select('id, status').eq('shipment_request_id', id).eq('traveler_id', user.id).maybeSingle() : Promise.resolve({ data: null }),
      ])
      setReviews(reviewRes.data || [])
      setExistingMatch(matchRes.data || null)
      setLoading(false)
    }
    load()
  }, [id, router])

  async function handleOffer(e) {
    e.preventDefault()
    if (!user) { router.push('/auth'); return }
    if (user.id === request.sender_id) return
    setContacting(true)
    const { data: match, error } = await supabase.from('matches').insert({
      shipment_request_id: request.id, traveler_id: user.id, sender_id: request.sender_id, status: 'pending',
    }).select().single()
    if (!error && match) {
      await supabase.from('messages').insert({ match_id: match.id, sender_id: user.id, content: message })
      fetch('/api/notify/match', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ matchId: match.id, recipientId: request.sender_id }) }).catch(() => {})
      router.push(`/matches/${match.id}`)
    }
    setContacting(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: '#0B1220' }}>
      <div className="text-sm" style={{ color: FG3 }}>{t?.loading || 'Loading…'}</div>
    </div>
  )

  const isOwnRequest = user?.id === request.sender_id
  const CatIcon      = CATEGORY_ICONS[request.item_category] || Package

  return (
    <div className="min-h-screen" style={{ background: '#0B1220', paddingTop: 72 }}>
    <div className="max-w-4xl mx-auto px-6 py-10" style={fontStyle}>

      <Link href="/requests" className="inline-flex items-center gap-1.5 text-sm mb-6 transition-colors"
        style={{ color: FG3 }}
        onMouseEnter={e => e.currentTarget.style.color = FG2}
        onMouseLeave={e => e.currentTarget.style.color = FG3}>
        <ArrowLeft size={15} /> {t?.backToRequests || 'Back to requests'}
      </Link>

      <div className="grid md:grid-cols-3 gap-5 mt-2">

        {/* ── Left — Sender card ── */}
        <div className="md:col-span-1 space-y-4">
          <div className="rounded-2xl p-6 text-center" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
            <Link href={`/profile/${request.sender_id}`}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 transition-opacity hover:opacity-80"
                style={{ background: 'linear-gradient(135deg, #1A2744, #2E4068)' }}>
                {sender?.full_name?.[0]?.toUpperCase() || '?'}
              </div>
            </Link>
            <Link href={`/profile/${request.sender_id}`}
              className="font-bold text-lg hover:opacity-80 transition-opacity"
              style={{ color: FG1 }}>
              {sender?.full_name || 'Sender'}
            </Link>
            {sender?.is_verified && (
              <div className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full mt-2 mb-1"
                style={{ background: 'rgba(46,189,122,0.10)', color: '#56CD93' }}>
                <ShieldCheck size={11} /> {t?.verified || 'ID Verified'}
              </div>
            )}
            {sender?.rating_count > 0 ? (
              <div className="flex items-center justify-center gap-1.5 text-sm mt-2 mb-3" style={{ color: FG2 }}>
                <Star size={13} fill="#E07B29" color="#E07B29" />
                <span className="font-semibold" style={{ color: FG1 }}>{sender.rating_avg?.toFixed(1)}</span>
                <span style={{ color: FG3 }}>· {sender.rating_count} {t?.reviews || 'reviews'}</span>
              </div>
            ) : (
              <p className="text-xs mt-2 mb-3" style={{ color: FG3 }}>{t?.newMember || 'New member'}</p>
            )}
            {sender?.bio && (
              <p className="text-xs leading-relaxed pt-3" style={{ color: FG2, borderTop: `1px solid ${HAIRLINE}` }}>
                {sender.bio}
              </p>
            )}
          </div>

          {sender?.voice_pitch_url && (
            <VoicePitch profileId={request.sender_id} isOwnProfile={false} existingUrl={sender.voice_pitch_url} />
          )}

          {reviews.length > 0 && (
            <div className="rounded-2xl p-5" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
              <h3 className="font-semibold text-sm mb-4" style={{ color: FG1 }}>{t?.recentReviews || 'Reviews'}</h3>
              <div className="space-y-3">
                {reviews.map(r => (
                  <div key={r.id} className="pb-3 last:pb-0" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold" style={{ color: FG2 }}>{r.profiles?.full_name || 'User'}</span>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} size={10} fill={i <= r.rating ? '#E07B29' : 'none'} color={i <= r.rating ? '#E07B29' : '#3D5180'} strokeWidth={1.5} />
                        ))}
                      </div>
                    </div>
                    {r.comment && <p className="text-xs leading-relaxed" style={{ color: FG3 }}>{r.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right — Request details + offer ── */}
        <div className="md:col-span-2 space-y-4">
          <div className="rounded-2xl p-6" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(224,123,41,0.08)', border: '1px solid rgba(224,123,41,0.15)' }}>
                  <CatIcon size={22} style={{ color: '#E07B29' }} strokeWidth={1.5} />
                </div>
                <div>
                  <h1 className="text-xl font-bold" style={{ color: FG1, letterSpacing: '-0.02em' }}>{request.item_description}</h1>
                  <p className="text-sm capitalize" style={{ color: FG3 }}>{request.item_category}</p>
                </div>
              </div>
              {request.budget && (
                <div className="text-right flex-shrink-0">
                  <div className="text-3xl font-bold" style={{ color: '#E07B29', letterSpacing: '-0.025em' }}>${request.budget}</div>
                  <div className="text-xs" style={{ color: FG3 }}>budget</div>
                </div>
              )}
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { icon: MapPin,   label: t?.from || 'From',      value: `${request.origin_city}, ${request.origin_country}` },
                { icon: Flag,     label: t?.to || 'To',          value: `${request.destination_city}, ${request.destination_country}` },
                { icon: Scale,    label: t?.weight || 'Weight',  value: `${request.weight_kg} kg` },
                { icon: Calendar, label: t?.neededBy || 'Needed by', value: request.needed_by_date
                    ? new Date(request.needed_by_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                    : (t?.flexible || 'Flexible') },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${HAIRLINE}` }}>
                  <Icon size={15} style={{ color: '#E07B29', marginBottom: 6 }} strokeWidth={1.8} />
                  <div className="text-xs font-medium mb-0.5" style={{ color: FG3 }}>{label}</div>
                  <div className="text-sm font-semibold" style={{ color: FG1 }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Legal notice */}
            <div className="rounded-xl px-4 py-3 mb-6 flex items-start gap-2"
              style={{ background: 'rgba(224,123,41,0.06)', border: '1px solid rgba(224,123,41,0.18)' }}>
              <Package size={14} style={{ color: '#F5B380', marginTop: 2, flexShrink: 0 }} />
              <p className="text-xs leading-relaxed" style={{ color: '#FAD2B0' }}>
                <strong>{t?.declaredShipmentTitle || 'Declared shipment'}:</strong>{' '}
                {t?.declaredShipmentDesc || 'The sender has declared the above as an accurate description. This is stored as a legal record.'}
              </p>
            </div>

            {/* CTA */}
            {isOwnRequest ? (
              <div className="rounded-xl p-4 text-center text-sm" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${HAIRLINE}`, color: FG3 }}>
                {t?.ownRequest || 'This is your shipment request.'}
              </div>
            ) : !user ? (
              <div className="text-center py-2">
                <p className="text-sm mb-3" style={{ color: FG3 }}>{t?.signInToOffer || 'Sign in to offer to carry this package'}</p>
                <Link href="/auth"
                  className="inline-block px-6 py-3 rounded-xl text-white font-semibold text-sm"
                  style={{ background: '#E07B29' }}>
                  {t?.signInToOffer || 'Sign In to Offer'}
                </Link>
              </div>
            ) : existingMatch ? (
              <div className="rounded-xl p-5 text-center" style={{ background: 'rgba(46,189,122,0.05)', border: '1px solid rgba(46,189,122,0.20)' }}>
                <p className="text-sm font-semibold mb-1" style={{ color: '#56CD93' }}>
                  {t?.alreadyOffered || 'You already offered to carry this package'}
                </p>
                <p className="text-xs mb-4 capitalize" style={{ color: FG3 }}>{t?.status || 'Status'}: {existingMatch.status}</p>
                <Link href={`/matches/${existingMatch.id}`}
                  className="inline-block px-6 py-3 rounded-xl text-white font-semibold text-sm"
                  style={{ background: '#1A2744', border: `1px solid rgba(255,255,255,0.12)` }}>
                  {t?.continueChat || 'Continue Chat'} →
                </Link>
              </div>
            ) : (
              <form onSubmit={handleOffer}>
                <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: FG3, letterSpacing: '0.07em' }}>
                  {t?.introTraveler || 'Introduce yourself as a traveler on this route'}
                </label>
                <textarea required rows={4}
                  placeholder="Hi, I'm flying from Toronto to Tehran on April 28th and have 5kg available. I'd be happy to carry your package. My price is $10/kg."
                  value={message} onChange={e => setMessage(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none resize-none mb-3 transition-colors"
                  style={{ background: '#0F1730', border: `1px solid ${HAIRLINE}`, color: FG1 }} />
                <button type="submit" disabled={contacting}
                  className="w-full py-3.5 rounded-xl text-white font-semibold text-sm disabled:opacity-50 transition-opacity hover:opacity-90"
                  style={{ background: '#E07B29' }}>
                  {contacting ? (t?.openingChat || 'Opening chat…') : (t?.offerToCarry || 'Offer to Carry & Start Chat →')}
                </button>
                <p className="text-xs text-center mt-2" style={{ color: FG3 }}>
                  {t?.privateChat || 'This creates a private chat. All messages are logged for safety.'}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
