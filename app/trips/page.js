'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function TripsPage() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ origin: '', destination: '' })

  useEffect(() => { fetchTrips() }, [])

  async function fetchTrips() {
    setLoading(true)
    let query = supabase
      .from('trips')
      .select('*, profiles(full_name, rating_avg, rating_count, is_verified, avatar_url)')
      .eq('status', 'active')
      .gte('departure_date', new Date().toISOString().split('T')[0])
      .order('departure_date', { ascending: true })

    if (filters.origin) query = query.ilike('origin_city', `%${filters.origin}%`)
    if (filters.destination) query = query.ilike('destination_city', `%${filters.destination}%`)

    const { data } = await query
    setTrips(data || [])
    setLoading(false)
  }

  function handleSearch(e) {
    e.preventDefault()
    fetchTrips()
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2" style={{color: '#1A2744'}}>Find a Traveler</h1>
        <p className="text-gray-400">Browse verified travelers offering spare luggage space on your route.</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">From</label>
            <input
              type="text" placeholder="e.g. Toronto"
              value={filters.origin}
              onChange={e => setFilters(f => ({...f, origin: e.target.value}))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">To</label>
            <input
              type="text" placeholder="e.g. Tehran"
              value={filters.destination}
              onChange={e => setFilters(f => ({...f, destination: e.target.value}))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"
            />
          </div>
          <div className="flex items-end">
            <button type="submit"
              className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90"
              style={{background: '#E07B29'}}>
              Search Travelers
            </button>
          </div>
        </div>
      </form>

      {/* Results */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading travelers...</div>
      ) : trips.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">✈️</div>
          <h3 className="font-bold text-lg mb-2" style={{color: '#1A2744'}}>No trips found</h3>
          <p className="text-gray-400 text-sm">Try different cities or check back soon.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {trips.map(trip => (
            <div key={trip.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                       style={{background: '#1A2744'}}>
                    {trip.profiles?.full_name?.[0] || '?'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base" style={{color: '#1A2744'}}>
                        {trip.profiles?.full_name || 'Anonymous'}
                      </span>
                      {trip.profiles?.is_verified && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{background: 'rgba(46,189,122,0.1)', color: '#2EBD7A'}}>✓ Verified</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      ⭐ {trip.profiles?.rating_avg?.toFixed(1) || 'New'} · {trip.profiles?.rating_count || 0} reviews
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-black text-xl" style={{color: '#E07B29'}}>${trip.price_per_kg}<span className="text-sm font-medium text-gray-400">/kg</span></div>
                  <div className="text-xs text-gray-400">{trip.available_weight_kg}kg available</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm" style={{color: '#1A2744'}}>
                    {trip.origin_city}, {trip.origin_country} → {trip.destination_city}, {trip.destination_country}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Departing {new Date(trip.departure_date).toLocaleDateString('en-GB', {weekday:'short', day:'numeric', month:'short', year:'numeric'})}
                  </div>
                </div>
                <Link href={`/trips/${trip.id}`}
                  className="px-5 py-2 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90"
                  style={{background: '#1A2744'}}>
                  View & Contact
                </Link>
              </div>

              {trip.notes && (
                <div className="mt-3 text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
                  💬 &quot;{trip.notes}&quot;
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
