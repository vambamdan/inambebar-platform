'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const CATEGORY_ICONS = {
  documents: '📄', electronics: '💻', clothing: '👕',
  food: '🍱', medicine: '💊', cosmetics: '💄', other: '📦'
}

export default function RequestsPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ origin: '', destination: '' })

  useEffect(() => { fetchRequests() }, [])

  async function fetchRequests() {
    setLoading(true)
    let query = supabase
      .from('shipment_requests')
      .select('*, profiles(full_name, rating_avg, rating_count, is_verified)')
      .eq('status', 'open')
      .order('created_at', { ascending: false })

    if (filters.origin) query = query.ilike('origin_city', `%${filters.origin}%`)
    if (filters.destination) query = query.ilike('destination_city', `%${filters.destination}%`)

    const { data } = await query
    setRequests(data || [])
    setLoading(false)
  }

  function handleSearch(e) { e.preventDefault(); fetchRequests() }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black mb-2" style={{color: '#1A2744'}}>Shipment Requests</h1>
          <p className="text-gray-400">Travelers: browse open requests matching your route and earn money.</p>
        </div>
        <Link href="/requests/new"
          className="px-5 py-2.5 rounded-xl text-white font-bold text-sm whitespace-nowrap"
          style={{background: '#E07B29'}}>
          + Post Request
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">From</label>
            <input type="text" placeholder="e.g. Toronto"
              value={filters.origin} onChange={e => setFilters(f => ({...f, origin: e.target.value}))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">To</label>
            <input type="text" placeholder="e.g. Tehran"
              value={filters.destination} onChange={e => setFilters(f => ({...f, destination: e.target.value}))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"/>
          </div>
          <div className="flex items-end">
            <button type="submit"
              className="w-full py-3 rounded-xl text-white font-bold text-sm"
              style={{background: '#1A2744'}}>
              Search Requests
            </button>
          </div>
        </div>
      </form>

      {/* Results */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="font-bold text-lg mb-2" style={{color: '#1A2744'}}>No requests found</h3>
          <p className="text-gray-400 text-sm mb-6">Be the first to post a shipment request on this route.</p>
          <Link href="/requests/new" className="px-6 py-3 rounded-xl text-white font-bold text-sm" style={{background: '#E07B29'}}>
            Post a Request
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{CATEGORY_ICONS[req.item_category] || '📦'}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base" style={{color: '#1A2744'}}>{req.item_description}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      by {req.profiles?.full_name || 'Anonymous'}
                      {req.profiles?.is_verified && <span className="ml-1 text-green-500">✓</span>}
                      · ⭐ {req.profiles?.rating_avg?.toFixed(1) || 'New'}
                    </div>
                  </div>
                </div>
                {req.budget && (
                  <div className="text-right flex-shrink-0">
                    <div className="font-black text-xl" style={{color: '#E07B29'}}>${req.budget}</div>
                    <div className="text-xs text-gray-400">budget</div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm" style={{color: '#1A2744'}}>
                    {req.origin_city}, {req.origin_country} → {req.destination_city}, {req.destination_country}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {req.weight_kg}kg
                    {req.needed_by_date && ` · Needed by ${new Date(req.needed_by_date).toLocaleDateString('en-GB', {day:'numeric',month:'short'})}`}
                  </div>
                </div>
                <Link href={`/requests/${req.id}`}
                  className="px-5 py-2 rounded-xl text-white font-bold text-sm"
                  style={{background: '#E07B29'}}>
                  I can carry this
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
