'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function TripDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [trip, setTrip] = useState(null)
  const [traveler, setTraveler] = useState(null)
  const [reviews, setReviews] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [contacting, setContacting] = useState(false)
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      const { data: tripData } = await supabase
        .from('trips')
        .select('*, profiles(*)')
        .eq('id', id)
        .single()

      if (!tripData) { router.push('/trips'); return }
      setTrip(tripData)
      setTraveler(tripData.profiles)

      const { data: reviewData } = await supabase
        .from('reviews')
        .select('*, profiles!reviews_reviewer_id_fkey(full_name)')
        .eq('reviewee_id', tripData.traveler_id)
        .order('created_at', { ascending: false })
        .limit(5)

      setReviews(reviewData || [])
      setLoading(false)
    }
    load()
  }, [id, router])

  async function handleContact(e) {
    e.preventDefault()
    if (!user) { router.push('/auth'); return }
    if (user.id === trip.traveler_id) return
    setContacting(true)

    // Create a match
    const { data: match, error } = await supabase
      .from('matches')
      .insert({
        trip_id: trip.id,
        traveler_id: trip.traveler_id,
        sender_id: user.id,
        status: 'pending'
      })
      .select()
      .single()

    if (!error && match) {
      // Send first message
      await supabase.from('messages').insert({
        match_id: match.id,
        sender_id: user.id,
        content: message
      })
      router.push(`/matches/${match.id}`)
    }
    setContacting(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen text-gray-400">Loading...</div>
  )

  const isOwnTrip = user?.id === trip.traveler_id
  const departureDate = new Date(trip.departure_date).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link href="/trips" className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-flex items-center gap-1">
        ← Back to travelers
      </Link>

      <div className="grid md:grid-cols-3 gap-6 mt-4">

        {/* Left — Traveler profile */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4"
                 style={{background: '#1A2744'}}>
              {traveler?.full_name?.[0] || '?'}
            </div>
            <h2 className="font-bold text-lg" style={{color: '#1A2744'}}>{traveler?.full_name || 'Traveler'}</h2>
            {traveler?.is_verified && (
              <div className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full mt-2"
                   style={{background: 'rgba(46,189,122,0.1)', color: '#2EBD7A'}}>
                ✓ ID Verified
              </div>
            )}
            <div className="mt-3 text-sm text-gray-500">
              ⭐ {traveler?.rating_avg?.toFixed(1) || 'New'} · {traveler?.rating_count || 0} reviews
            </div>
            {traveler?.bio && (
              <p className="mt-3 text-xs text-gray-400 leading-relaxed">{traveler.bio}</p>
            )}
          </div>

          {/* Reviews */}
          {reviews.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-sm mb-4" style={{color: '#1A2744'}}>Recent Reviews</h3>
              <div className="space-y-3">
                {reviews.map(r => (
                  <div key={r.id} className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-gray-600">
                        {r.profiles?.full_name || 'User'}
                      </span>
                      <span className="text-xs text-amber-500">{'★'.repeat(r.rating)}</span>
                    </div>
                    {r.comment && <p className="text-xs text-gray-400 leading-relaxed">{r.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — Trip details + contact */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-black mb-1" style={{color: '#1A2744'}}>
                  {trip.origin_city} → {trip.destination_city}
                </h1>
                <p className="text-gray-400 text-sm">{trip.origin_country} → {trip.destination_country}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black" style={{color: '#E07B29'}}>${trip.price_per_kg}</div>
                <div className="text-xs text-gray-400">per kg</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                {label: 'Departure', value: departureDate, icon: '📅'},
                {label: 'Available space', value: `${trip.available_weight_kg} kg`, icon: '⚖️'},
                {label: 'Price', value: `$${trip.price_per_kg}/kg`, icon: '💰'},
                {label: 'Status', value: trip.status, icon: '✅'},
              ].map(item => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-4">
                  <div className="text-lg mb-1">{item.icon}</div>
                  <div className="text-xs text-gray-400 font-medium mb-0.5">{item.label}</div>
                  <div className="text-sm font-bold" style={{color: '#1A2744'}}>{item.value}</div>
                </div>
              ))}
            </div>

            {trip.notes && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-6">
                <p className="text-sm text-amber-700">💬 &quot;{trip.notes}&quot;</p>
              </div>
            )}

            {/* Contact form */}
            {isOwnTrip ? (
              <div className="bg-gray-50 rounded-xl p-4 text-center text-sm text-gray-400">
                This is your trip listing.
              </div>
            ) : !user ? (
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-3">Sign in to contact this traveler</p>
                <Link href="/auth" className="inline-block px-6 py-3 rounded-xl text-white font-bold text-sm"
                  style={{background: '#E07B29'}}>Sign In to Contact</Link>
              </div>
            ) : (
              <form onSubmit={handleContact}>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                  Introduce yourself and describe what you need to send
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Hi, I need to send a sealed package of clothing (approx 3kg) from Toronto to Tehran. Is this something you can help with?"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 resize-none mb-3"
                />
                <button type="submit" disabled={contacting}
                  className="w-full py-4 rounded-xl text-white font-bold text-base disabled:opacity-50"
                  style={{background: '#E07B29'}}>
                  {contacting ? 'Opening chat...' : 'Contact Traveler & Start Chat →'}
                </button>
                <p className="text-xs text-gray-400 text-center mt-2">
                  This creates a private chat between you and the traveler. All messages are logged.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
