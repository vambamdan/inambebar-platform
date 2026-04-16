'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const { id } = useParams()
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [trips, setTrips] = useState([])
  const [reviews, setReviews] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ full_name: '', bio: '' })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (!profileData) { router.push('/'); return }
      setProfile(profileData)
      setForm({ full_name: profileData.full_name || '', bio: profileData.bio || '' })

      const [tripsRes, reviewsRes] = await Promise.all([
        supabase.from('trips').select('*').eq('traveler_id', id)
          .eq('status', 'active').gte('departure_date', new Date().toISOString().split('T')[0])
          .order('departure_date', { ascending: true }).limit(5),
        supabase.from('reviews')
          .select('*, profiles!reviews_reviewer_id_fkey(full_name)')
          .eq('reviewee_id', id).order('created_at', { ascending: false }).limit(10)
      ])

      setTrips(tripsRes.data || [])
      setReviews(reviewsRes.data || [])
      setLoading(false)
    }
    load()
  }, [id, router])

  async function handleSave() {
    setSaving(true)
    await supabase.from('profiles').update(form).eq('id', currentUser.id)
    setProfile(p => ({ ...p, ...form }))
    setEditing(false)
    setSaving(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen text-gray-400">Loading profile...</div>
  )

  const isOwnProfile = currentUser?.id === id

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-3 gap-6">

        {/* Left — Profile card */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4"
                 style={{background: '#1A2744'}}>
              {profile?.full_name?.[0]?.toUpperCase() || '?'}
            </div>

            {editing ? (
              <div className="space-y-3 text-left">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Full Name</label>
                  <input type="text" value={form.full_name}
                    onChange={e => setForm(f => ({...f, full_name: e.target.value}))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Bio</label>
                  <textarea value={form.bio} rows={3}
                    onChange={e => setForm(f => ({...f, bio: e.target.value}))}
                    placeholder="Tell senders a bit about yourself..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 resize-none"/>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSave} disabled={saving}
                    className="flex-1 py-2 rounded-lg text-white text-sm font-bold disabled:opacity-50"
                    style={{background: '#E07B29'}}>
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={() => setEditing(false)}
                    className="flex-1 py-2 rounded-lg text-gray-500 text-sm font-bold border border-gray-200">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="font-bold text-xl mb-1" style={{color: '#1A2744'}}>
                  {profile?.full_name || 'Anonymous'}
                </h1>
                <div className="flex items-center justify-center gap-2 flex-wrap mb-3">
                  {profile?.is_verified ? (
                    <span className="text-xs font-bold px-2 py-1 rounded-full"
                      style={{background: 'rgba(46,189,122,0.1)', color: '#2EBD7A'}}>✓ ID Verified</span>
                  ) : (
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-400">Unverified</span>
                  )}
                </div>
                <div className="text-sm text-gray-500 mb-3">
                  ⭐ {profile?.rating_avg?.toFixed(1) || 'No ratings'} · {profile?.rating_count || 0} reviews
                </div>
                {profile?.bio && (
                  <p className="text-sm text-gray-400 leading-relaxed">{profile.bio}</p>
                )}
                {isOwnProfile && (
                  <button onClick={() => setEditing(true)}
                    className="mt-4 w-full py-2 rounded-lg text-sm font-bold border border-gray-200 text-gray-500 hover:bg-gray-50">
                    Edit Profile
                  </button>
                )}
              </>
            )}
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Reviews received</span>
                <span className="font-bold" style={{color:'#1A2744'}}>{profile?.rating_count || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Average rating</span>
                <span className="font-bold" style={{color:'#1A2744'}}>
                  {profile?.rating_avg ? `${profile.rating_avg.toFixed(1)} ⭐` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Active trips</span>
                <span className="font-bold" style={{color:'#1A2744'}}>{trips.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Trips + Reviews */}
        <div className="md:col-span-2 space-y-6">

          {/* Active trips */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-lg" style={{color:'#1A2744'}}>Active Trips</h2>
              {isOwnProfile && (
                <Link href="/trips/new" className="text-sm font-semibold" style={{color:'#E07B29'}}>+ Add trip</Link>
              )}
            </div>
            {trips.length === 0 ? (
              <div className="bg-white rounded-xl p-6 border border-gray-100 text-center text-sm text-gray-400">
                {isOwnProfile ? (
                  <>No active trips. <Link href="/trips/new" className="font-semibold" style={{color:'#E07B29'}}>Post your first trip →</Link></>
                ) : 'No active trips at the moment.'}
              </div>
            ) : (
              <div className="space-y-3">
                {trips.map(trip => (
                  <Link key={trip.id} href={`/trips/${trip.id}`}
                    className="block bg-white rounded-xl p-5 border border-gray-100 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm" style={{color:'#1A2744'}}>
                          {trip.origin_city} → {trip.destination_city}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {new Date(trip.departure_date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}
                          · {trip.available_weight_kg}kg available
                        </div>
                      </div>
                      <div className="font-black" style={{color:'#E07B29'}}>${trip.price_per_kg}/kg</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Reviews */}
          <div>
            <h2 className="font-bold text-lg mb-3" style={{color:'#1A2744'}}>
              Reviews ({reviews.length})
            </h2>
            {reviews.length === 0 ? (
              <div className="bg-white rounded-xl p-6 border border-gray-100 text-center text-sm text-gray-400">
                No reviews yet.
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map(r => (
                  <div key={r.id} className="bg-white rounded-xl p-5 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm" style={{color:'#1A2744'}}>
                        {r.profiles?.full_name || 'User'}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
                        <span className="text-xs text-gray-300">
                          {new Date(r.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}
                        </span>
                      </div>
                    </div>
                    {r.comment && <p className="text-sm text-gray-500 leading-relaxed">{r.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
