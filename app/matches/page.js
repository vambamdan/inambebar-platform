'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const STATUS_STYLES = {
  pending:    { bg: 'bg-yellow-50',  text: 'text-yellow-600',  label: 'Pending' },
  accepted:   { bg: 'bg-blue-50',    text: 'text-blue-600',    label: 'Accepted' },
  in_transit: { bg: 'bg-purple-50',  text: 'text-purple-600',  label: 'In Transit' },
  delivered:  { bg: 'bg-green-50',   text: 'text-green-600',   label: 'Delivered' },
  cancelled:  { bg: 'bg-gray-100',   text: 'text-gray-400',    label: 'Cancelled' },
  disputed:   { bg: 'bg-red-50',     text: 'text-red-500',     label: 'Disputed' },
}

export default function MatchesPage() {
  const [user, setUser] = useState(null)
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      setUser(user)
      const { data } = await supabase
        .from('matches')
        .select(`*, 
          trips(origin_city, destination_city, departure_date),
          shipment_requests(item_description, weight_kg),
          traveler:profiles!matches_traveler_id_fkey(full_name, is_verified),
          sender:profiles!matches_sender_id_fkey(full_name, is_verified)
        `)
        .or(`traveler_id.eq.${user.id},sender_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
      setMatches(data || [])
      setLoading(false)
    }
    load()
  }, [router])

  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-400">Loading matches...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black mb-2" style={{color: '#1A2744'}}>My Matches</h1>
      <p className="text-gray-400 mb-8">All your active and past connections with travelers and senders.</p>

      {matches.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🤝</div>
          <h3 className="font-bold text-lg mb-2" style={{color: '#1A2744'}}>No matches yet</h3>
          <p className="text-gray-400 text-sm mb-6">Browse travelers or post a trip to get started.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/trips" className="px-5 py-2.5 rounded-xl text-white font-bold text-sm" style={{background: '#1A2744'}}>Find Travelers</Link>
            <Link href="/trips/new" className="px-5 py-2.5 rounded-xl text-white font-bold text-sm" style={{background: '#E07B29'}}>Post a Trip</Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map(match => {
            const isTravel = match.traveler_id === user?.id
            const other = isTravel ? match.sender : match.traveler
            const st = STATUS_STYLES[match.status] || STATUS_STYLES.pending
            return (
              <Link key={match.id} href={`/matches/${match.id}`}
                className="block bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold"
                         style={{background: '#1A2744'}}>
                      {other?.full_name?.[0] || '?'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm" style={{color: '#1A2744'}}>{other?.full_name || 'User'}</span>
                        {other?.is_verified && <span className="text-xs text-green-500 font-bold">✓</span>}
                        <span className="text-xs text-gray-400">{isTravel ? '(Sender)' : '(Traveler)'}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {match.trips?.origin_city} → {match.trips?.destination_city}
                        {match.trips?.departure_date && ` · ${new Date(match.trips.departure_date).toLocaleDateString('en-GB', {day:'numeric',month:'short'})}`}
                      </div>
                      {match.shipment_requests?.item_description && (
                        <div className="text-xs text-gray-400">📦 {match.shipment_requests.item_description}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${st.bg} ${st.text}`}>{st.label}</span>
                    {match.agreed_price && (
                      <span className="text-sm font-black" style={{color: '#E07B29'}}>${match.agreed_price}</span>
                    )}
                    <span className="text-xs text-gray-300">Open chat →</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
