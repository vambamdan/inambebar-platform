'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plane, Package } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [myTrips, setMyTrips] = useState([])
  const [myRequests, setMyRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      setUser(user)

      const [profileRes, tripsRes, requestsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('trips').select('*').eq('traveler_id', user.id).order('created_at', { ascending: false }),
        supabase.from('shipment_requests').select('*').eq('sender_id', user.id).order('created_at', { ascending: false }),
      ])
      setProfile(profileRes.data)
      setMyTrips(tripsRes.data || [])
      setMyRequests(requestsRes.data || [])
      setLoading(false)
    }
    load()
  }, [router])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="text-4xl mb-3">📦</div>
        <div className="text-gray-400">Loading your dashboard...</div>
      </div>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black" style={{color: '#1A2744'}}>
            Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}! 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
        </div>
        <div className="flex gap-2">
          {profile?.is_verified ? (
            <span className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full"
              style={{background: 'rgba(46,189,122,0.1)', color: '#2EBD7A', border: '1px solid rgba(46,189,122,0.25)'}}>
              ✓ Verified
            </span>
          ) : (
            <span className="text-xs font-bold px-3 py-1.5 rounded-full"
              style={{background: 'rgba(224,123,41,0.1)', color: '#E07B29', border: '1px solid rgba(224,123,41,0.25)'}}>
              Complete verification →
            </span>
          )}
        </div>
      </div>

      {/* Action cards */}
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        <Link href="/trips/new" className="group block bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-0.5">
          <div className="mb-3"><Plane size={28} color="#1A2744" strokeWidth={1.6} /></div>
          <h3 className="font-bold text-base mb-1" style={{color: '#1A2744'}}>Post a Trip</h3>
          <p className="text-gray-400 text-sm">Flying soon? Offer your spare luggage space and earn money.</p>
          <div className="mt-4 text-sm font-bold" style={{color: '#E07B29'}}>Post now →</div>
        </Link>
        <Link href="/requests/new" className="group block bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-0.5">
          <div className="mb-3"><Package size={28} color="#1A2744" strokeWidth={1.6} /></div>
          <h3 className="font-bold text-base mb-1" style={{color: '#1A2744'}}>Send a Package</h3>
          <p className="text-gray-400 text-sm">Need to send something? Post a request and find a traveler.</p>
          <div className="mt-4 text-sm font-bold" style={{color: '#E07B29'}}>Post now →</div>
        </Link>
      </div>

      {/* My Trips */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg" style={{color: '#1A2744'}}>My Trips</h2>
          <Link href="/trips/new" className="text-sm font-semibold" style={{color: '#E07B29'}}>+ Add trip</Link>
        </div>
        {myTrips.length === 0 ? (
          <div className="bg-white rounded-xl p-8 border border-gray-100 text-center text-gray-400 text-sm">
            No trips posted yet. <Link href="/trips/new" className="font-semibold" style={{color: '#E07B29'}}>Post your first trip →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myTrips.map(trip => (
              <div key={trip.id} className="bg-white rounded-xl p-5 border border-gray-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm" style={{color: '#1A2744'}}>
                    {trip.origin_city} → {trip.destination_city}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {new Date(trip.departure_date).toLocaleDateString('en-GB', {day:'numeric',month:'short',year:'numeric'})} · {trip.available_weight_kg}kg · ${trip.price_per_kg}/kg
                  </div>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${trip.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  {trip.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg" style={{color: '#1A2744'}}>My Shipment Requests</h2>
          <Link href="/requests/new" className="text-sm font-semibold" style={{color: '#E07B29'}}>+ Add request</Link>
        </div>
        {myRequests.length === 0 ? (
          <div className="bg-white rounded-xl p-8 border border-gray-100 text-center text-gray-400 text-sm">
            No requests posted yet. <Link href="/requests/new" className="font-semibold" style={{color: '#E07B29'}}>Post a shipment request →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myRequests.map(req => (
              <div key={req.id} className="bg-white rounded-xl p-5 border border-gray-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm" style={{color: '#1A2744'}}>
                    {req.origin_city} → {req.destination_city}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {req.item_description} · {req.weight_kg}kg
                  </div>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${req.status === 'open' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
