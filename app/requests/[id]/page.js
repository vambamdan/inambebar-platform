'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const CATEGORY_ICONS = {
  documents: '📄', electronics: '💻', clothing: '👕',
  food: '🍱', medicine: '💊', cosmetics: '💄', other: '📦'
}

export default function RequestDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [request, setRequest] = useState(null)
  const [sender, setSender] = useState(null)
  const [reviews, setReviews] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [contacting, setContacting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      const { data: reqData } = await supabase
        .from('shipment_requests')
        .select('*, profiles(*)')
        .eq('id', id)
        .single()

      if (!reqData) { router.push('/requests'); return }
      setRequest(reqData)
      setSender(reqData.profiles)

      const { data: reviewData } = await supabase
        .from('reviews')
        .select('*, profiles!reviews_reviewer_id_fkey(full_name)')
        .eq('reviewee_id', reqData.sender_id)
        .order('created_at', { ascending: false })
        .limit(5)

      setReviews(reviewData || [])
      setLoading(false)
    }
    load()
  }, [id, router])

  async function handleOffer(e) {
    e.preventDefault()
    if (!user) { router.push('/auth'); return }
    if (user.id === request.sender_id) return
    setContacting(true)

    const { data: match, error } = await supabase
      .from('matches')
      .insert({
        shipment_request_id: request.id,
        traveler_id: user.id,
        sender_id: request.sender_id,
        status: 'pending'
      })
      .select()
      .single()

    if (!error && match) {
      await supabase.from('messages').insert({
        match_id: match.id,
        sender_id: user.id,
        content: message
      })
      // Notify the sender (request owner)
      fetch('/api/notify/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId: match.id, recipientId: request.sender_id }),
      }).catch(() => {})
      router.push(`/matches/${match.id}`)
    }
    setContacting(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen text-gray-400">Loading...</div>
  )

  const isOwnRequest = user?.id === request.sender_id

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link href="/requests" className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-flex items-center gap-1">
        ← Back to requests
      </Link>

      <div className="grid md:grid-cols-3 gap-6 mt-4">

        {/* Left — Sender profile */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4"
                 style={{background: '#1A2744'}}>
              {sender?.full_name?.[0] || '?'}
            </div>
            <h2 className="font-bold text-lg" style={{color: '#1A2744'}}>{sender?.full_name || 'Sender'}</h2>
            {sender?.is_verified && (
              <div className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full mt-2"
                   style={{background: 'rgba(46,189,122,0.1)', color: '#2EBD7A'}}>
                ✓ ID Verified
              </div>
            )}
            <div className="mt-3 text-sm text-gray-500">
              ⭐ {sender?.rating_avg?.toFixed(1) || 'New'} · {sender?.rating_count || 0} reviews
            </div>
          </div>

          {reviews.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-sm mb-4" style={{color: '#1A2744'}}>Reviews</h3>
              <div className="space-y-3">
                {reviews.map(r => (
                  <div key={r.id} className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-gray-600">{r.profiles?.full_name || 'User'}</span>
                      <span className="text-xs text-amber-500">{'★'.repeat(r.rating)}</span>
                    </div>
                    {r.comment && <p className="text-xs text-gray-400">{r.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — Request details + offer form */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{CATEGORY_ICONS[request.item_category] || '📦'}</div>
                <div>
                  <h1 className="text-xl font-black" style={{color: '#1A2744'}}>{request.item_description}</h1>
                  <p className="text-gray-400 text-sm capitalize">{request.item_category}</p>
                </div>
              </div>
              {request.budget && (
                <div className="text-right">
                  <div className="text-3xl font-black" style={{color: '#E07B29'}}>${request.budget}</div>
                  <div className="text-xs text-gray-400">budget</div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                {label: 'From', value: `${request.origin_city}, ${request.origin_country}`, icon: '📍'},
                {label: 'To', value: `${request.destination_city}, ${request.destination_country}`, icon: '🏁'},
                {label: 'Weight', value: `${request.weight_kg} kg`, icon: '⚖️'},
                {label: 'Needed by', value: request.needed_by_date
                  ? new Date(request.needed_by_date).toLocaleDateString('en-GB', {day:'numeric',month:'short',year:'numeric'})
                  : 'Flexible', icon: '📅'},
              ].map(item => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-4">
                  <div className="text-lg mb-1">{item.icon}</div>
                  <div className="text-xs text-gray-400 font-medium mb-0.5">{item.label}</div>
                  <div className="text-sm font-bold" style={{color: '#1A2744'}}>{item.value}</div>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-6">
              <p className="text-xs text-amber-700 leading-relaxed">
                <strong>📋 Declared shipment:</strong> The sender has declared the above as an accurate description of the package. This is stored as a legal record.
              </p>
            </div>

            {isOwnRequest ? (
              <div className="bg-gray-50 rounded-xl p-4 text-center text-sm text-gray-400">
                This is your shipment request.
              </div>
            ) : !user ? (
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-3">Sign in to offer to carry this package</p>
                <Link href="/auth" className="inline-block px-6 py-3 rounded-xl text-white font-bold text-sm"
                  style={{background: '#E07B29'}}>Sign In to Offer</Link>
              </div>
            ) : (
              <form onSubmit={handleOffer}>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                  Introduce yourself as a traveler on this route
                </label>
                <textarea
                  required rows={4}
                  placeholder="Hi, I'm flying from Toronto to Tehran on April 28th and have 5kg available. I'd be happy to carry your package. My price is $10/kg."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 resize-none mb-3"
                />
                <button type="submit" disabled={contacting}
                  className="w-full py-4 rounded-xl text-white font-bold text-base disabled:opacity-50"
                  style={{background: '#E07B29'}}>
                  {contacting ? 'Opening chat...' : 'Offer to Carry & Start Chat →'}
                </button>
                <p className="text-xs text-gray-400 text-center mt-2">
                  This creates a private chat. All messages are logged for safety.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
