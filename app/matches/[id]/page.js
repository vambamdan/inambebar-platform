'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function MatchChat() {
  const { id } = useParams()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [match, setMatch] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      setUser(user)

      // Load match details
      const { data: matchData } = await supabase
        .from('matches')
        .select(`*,
          trips(origin_city, destination_city, departure_date),
          shipment_requests(item_description, weight_kg, item_category),
          traveler:profiles!matches_traveler_id_fkey(full_name, is_verified, rating_avg),
          sender:profiles!matches_sender_id_fkey(full_name, is_verified, rating_avg)
        `)
        .eq('id', id)
        .single()

      if (!matchData || (matchData.traveler_id !== user.id && matchData.sender_id !== user.id)) {
        router.push('/dashboard'); return
      }
      setMatch(matchData)

      // Load existing messages
      const { data: msgs } = await supabase
        .from('messages')
        .select('*, profiles(full_name)')
        .eq('match_id', id)
        .order('created_at', { ascending: true })
      setMessages(msgs || [])
      setLoading(false)
    }
    load()
  }, [id, router])

  // Real-time subscription — new messages appear instantly
  useEffect(() => {
    if (!id) return
    const channel = supabase
      .channel(`match-${id}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `match_id=eq.${id}`
      }, async (payload) => {
        const { data } = await supabase
          .from('messages')
          .select('*, profiles(full_name)')
          .eq('id', payload.new.id)
          .single()
        if (data) setMessages(prev => [...prev, data])
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [id])

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(e) {
    e.preventDefault()
    if (!newMessage.trim() || !user) return
    setSending(true)
    const content = newMessage.trim()
    await supabase.from('messages').insert({
      match_id: id,
      sender_id: user.id,
      content,
    })
    // Notify the other party (fire-and-forget)
    fetch('/api/notify/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId: id, senderId: user.id, preview: content }),
    }).catch(() => {})
    setNewMessage('')
    setSending(false)
  }

  async function updateStatus(status) {
    await supabase.from('matches').update({ status }).eq('id', id)
    setMatch(m => ({...m, status}))
    // Notify both parties of the status change
    fetch('/api/notify/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId: id, status }),
    }).catch(() => {})
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-400">Loading conversation...</div>

  const other = match.traveler_id === user?.id ? match.sender : match.traveler
  const isTravel = match.traveler_id === user?.id

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-64px)]">

      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{background:'#1A2744'}}>
              {other?.full_name?.[0] || '?'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold" style={{color:'#1A2744'}}>{other?.full_name}</span>
                {other?.is_verified && <span className="text-xs text-green-500 font-bold">✓ Verified</span>}
              </div>
              <div className="text-xs text-gray-400">
                {match.trips?.origin_city} → {match.trips?.destination_city}
                {match.trips?.departure_date && ` · ${new Date(match.trips.departure_date).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}`}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              match.status === 'delivered' ? 'bg-green-50 text-green-600' :
              match.status === 'in_transit' ? 'bg-purple-50 text-purple-600' :
              match.status === 'accepted' ? 'bg-blue-50 text-blue-600' :
              'bg-yellow-50 text-yellow-600'
            }`}>{match.status?.replace('_',' ').replace(/^\w/,c=>c.toUpperCase())}</span>
            {match.agreed_price && <span className="text-sm font-black" style={{color:'#E07B29'}}>${match.agreed_price}</span>}
          </div>
        </div>

        {/* Package info */}
        {match.shipment_requests && (
          <div className="mt-3 pt-3 border-t border-gray-50 text-xs text-gray-500">
            <span className="font-semibold">Package declared:</span> {match.shipment_requests.item_description} · {match.shipment_requests.weight_kg}kg
          </div>
        )}

        {/* Status actions */}
        <div className="mt-3 pt-3 border-t border-gray-50 flex gap-2 flex-wrap">
          {match.status === 'pending' && isTravel && (
            <button onClick={() => updateStatus('accepted')}
              className="text-xs font-bold px-3 py-1.5 rounded-lg text-white" style={{background:'#2EBD7A'}}>
              ✓ Accept Match
            </button>
          )}
          {match.status === 'accepted' && isTravel && (
            <button onClick={() => updateStatus('in_transit')}
              className="text-xs font-bold px-3 py-1.5 rounded-lg text-white" style={{background:'#6366f1'}}>
              ✈️ Mark In Transit
            </button>
          )}
          {match.status === 'in_transit' && !isTravel && (
            <button onClick={() => updateStatus('delivered')}
              className="text-xs font-bold px-3 py-1.5 rounded-lg text-white" style={{background:'#2EBD7A'}}>
              ✅ Confirm Delivery
            </button>
          )}
          {(match.status === 'pending' || match.status === 'accepted') && (
            <button onClick={() => updateStatus('cancelled')}
              className="text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-400">
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 px-1">
        {messages.length === 0 && (
          <div className="text-center py-10 text-gray-300 text-sm">
            No messages yet. Say hello and agree on the details!
          </div>
        )}
        {messages.map(msg => {
          const isMe = msg.sender_id === user?.id
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl text-sm ${
                isMe ? 'text-white rounded-br-sm' : 'bg-white border border-gray-100 text-gray-700 rounded-bl-sm'
              }`} style={isMe ? {background:'#1A2744'} : {}}>
                <div>{msg.content}</div>
                <div className={`text-xs mt-1 ${isMe ? 'text-white/40' : 'text-gray-300'}`}>
                  {new Date(msg.created_at).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef}/>
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex gap-3">
        <input
          type="text"
          placeholder="Type a message... (all messages are logged for safety)"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"
          disabled={match.status === 'delivered' || match.status === 'cancelled'}
        />
        <button type="submit" disabled={sending || !newMessage.trim()}
          className="px-5 py-3 rounded-xl text-white font-bold text-sm disabled:opacity-40 transition-opacity"
          style={{background:'#E07B29'}}>
          Send
        </button>
      </form>
      {(match.status === 'delivered' || match.status === 'cancelled') && (
        <p className="text-xs text-gray-300 text-center mt-2">This match is {match.status}. Chat is now closed.</p>
      )}
    </div>
  )
}
