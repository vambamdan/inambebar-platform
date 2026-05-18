'use client'
import { useEffect, useState, useRef, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Star, ShieldCheck, ChevronLeft, CheckCircle2, Truck, XCircle, ImagePlus, Mic } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'
import ConfirmModal from '@/components/ConfirmModal'

const CARD_BG  = '#16203A'
const HAIRLINE = 'rgba(255,255,255,0.07)'
const FG1      = '#F1F4FB'
const FG2      = '#A6B0CC'
const FG3      = '#6E7A99'

const MODAL_CONFIG = {
  accepted: {
    title: 'Accept this match?',
    description: 'You are confirming that you will carry this package on your trip. By accepting, you commit to the arrangement as discussed in chat.',
    confirmLabel: 'Accept Match',
    confirmColor: '#2EBD7A',
  },
  in_transit: {
    title: 'Mark as In Transit?',
    description: 'This confirms the package is now physically on the move with you. The sender will be notified immediately.',
    confirmLabel: 'Confirm In Transit',
    confirmColor: '#6366f1',
  },
  delivered: {
    title: 'Confirm Delivery?',
    description: 'This confirms the package has been successfully handed over. The chat will close and both parties will be invited to leave a review.',
    confirmLabel: 'Confirm Delivery',
    confirmColor: '#2EBD7A',
  },
  cancelled: {
    title: 'Cancel this match?',
    description: 'This will cancel the arrangement. Both parties will be notified and the conversation will be closed.',
    confirmLabel: 'Yes, Cancel Match',
    confirmColor: '#EF4444',
  },
}

const QUICK_REPLIES = {
  pending_traveler: [
    'Happy to carry it! What are the exact dimensions?',
    'Can we agree on a price?',
    'I depart soon — does the timing work for you?',
  ],
  pending_sender: [
    'The package is sealed and ready.',
    'Let me know if you have any questions!',
    'I can meet at the airport.',
  ],
  accepted: [
    'How should we coordinate the handover?',
    'Looking forward to working with you!',
    'What\'s the best way to stay in touch?',
  ],
  in_transit_traveler: [
    'Package is safely en route.',
    'I\'ve landed — let\'s arrange delivery.',
    'Everything is going well!',
  ],
  in_transit_sender: [
    'Looking forward to receiving it!',
    'Please let me know when you arrive.',
    'Is everything going well on your end?',
  ],
}

const STATUS_ACTIONS = {
  pending_traveler: [{
    key: 'accepted',
    label: (t) => t?.acceptMatch || 'Accept Match',
    style: { background: '#2EBD7A' },
    icon: CheckCircle2,
    needsPrice: true,
  }],
  accepted_traveler: [{
    key: 'in_transit',
    label: (t) => t?.markInTransit || 'Mark In Transit',
    style: { background: '#6366f1' },
    icon: Truck,
    needsPrice: false,
  }],
  in_transit_sender: [{
    key: 'delivered',
    label: (t) => t?.confirmDelivery || 'Confirm Delivery',
    style: { background: '#2EBD7A' },
    icon: CheckCircle2,
    needsPrice: false,
  }],
}

const STATUS_BADGE = {
  pending:    { bg: 'rgba(224,169,41,0.12)',  text: '#E0A929', label: 'Pending'    },
  accepted:   { bg: 'rgba(46,189,122,0.10)',  text: '#56CD93', label: 'Accepted'   },
  in_transit: { bg: 'rgba(131,109,200,0.12)', text: '#A78BF8', label: 'In Transit' },
  delivered:  { bg: 'rgba(46,189,122,0.10)',  text: '#56CD93', label: 'Delivered'  },
  cancelled:  { bg: 'rgba(255,255,255,0.06)', text: '#6E7A99', label: 'Cancelled'  },
}

export default function MatchChat() {
  const { id }    = useParams()
  const router    = useRouter()
  const { t, lang, isFa } = useLanguage()

  const [user, setUser]         = useState(null)
  const [match, setMatch]       = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending]             = useState(false)
  const [loading, setLoading]             = useState(true)
  const [imageUploading, setImageUploading] = useState(false)
  const [otherIsTyping, setOtherIsTyping] = useState(false)
  const [reactions, setReactions]       = useState({})
  const [pickerMsgId, setPickerMsgId]   = useState(null)

  // Voice recording (Telegram-style inline)
  const [isRecording,   setIsRecording]   = useState(false)
  const [recElapsed,    setRecElapsed]    = useState(0)
  const [sendingVoice,  setSendingVoice]  = useState(false)
  const [voiceError,    setVoiceError]    = useState('')
  const mediaRecRef   = useRef(null)
  const chunksRef     = useRef([])
  const audioBlobRef  = useRef(null)
  const recTimerRef   = useRef(null)

  const longPressRef = useRef(null)
  const fileInputRef    = useRef(null)
  const typingChannelRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  const [alreadyReviewed, setAlreadyReviewed]   = useState(false)
  const [reviewRating, setReviewRating]         = useState(0)
  const [hoverRating, setHoverRating]           = useState(0)
  const [reviewText, setReviewText]             = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewSubmitted, setReviewSubmitted]   = useState(false)

  const [pendingConfirm, setPendingConfirm] = useState(null)
  const [priceInput, setPriceInput]         = useState('')
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const bottomRef = useRef(null)
  const fontStyle = isFa ? { fontFamily: "'Vazirmatn', sans-serif" } : {}

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      setUser(user)

      const { data: matchData } = await supabase
        .from('matches')
        .select(`*,
          trips(origin_city, destination_city, departure_date),
          shipment_requests(item_description, weight_kg, item_category, origin_city, destination_city),
          traveler:profiles!matches_traveler_id_fkey(full_name, is_verified, rating_avg),
          sender:profiles!matches_sender_id_fkey(full_name, is_verified, rating_avg)
        `)
        .eq('id', id)
        .single()

      if (!matchData || (matchData.traveler_id !== user.id && matchData.sender_id !== user.id)) {
        router.push('/dashboard'); return
      }
      setMatch(matchData)

      const { data: msgs } = await supabase
        .from('messages')
        .select('*, profiles(full_name)')
        .eq('match_id', id)
        .order('created_at', { ascending: true })
      setMessages(msgs || [])

      if (msgs?.length) {
        const { data: rxData } = await supabase
          .from('message_reactions')
          .select('message_id, emoji, user_id')
          .in('message_id', msgs.map(m => m.id))
        if (rxData) setReactions(buildReactionMap(rxData, user.id))
      }

      if (matchData.status === 'delivered') {
        const { data: existing } = await supabase
          .from('reviews')
          .select('id')
          .eq('reviewer_id', user.id)
          .eq('match_id', id)
          .maybeSingle()
        if (existing) setAlreadyReviewed(true)
      }

      setLoading(false)
    }
    load()
  }, [id, router])

  useEffect(() => {
    if (!id || !user) return

    async function markRead() {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('match_id', id)
        .neq('sender_id', user.id)
        .is('read_at', null)
    }
    markRead()

    const channel = supabase
      .channel(`match-${id}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `match_id=eq.${id}`,
      }, async payload => {
        const { data } = await supabase
          .from('messages')
          .select('*, profiles(full_name)')
          .eq('id', payload.new.id)
          .single()
        if (data) {
          setMessages(prev => [...prev, data])
          if (data.sender_id !== user.id) {
            supabase.from('messages')
              .update({ read_at: new Date().toISOString() })
              .eq('id', data.id)
              .then(() => {})
          }
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'messages',
        filter: `match_id=eq.${id}`,
      }, payload => {
        if (payload.new.read_at) {
          setMessages(prev =>
            prev.map(m => m.id === payload.new.id ? { ...m, read_at: payload.new.read_at } : m)
          )
        }
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [id, user])

  useEffect(() => {
    if (!id || !user) return
    const channel = supabase.channel(`typing-${id}`, {
      config: { presence: { key: user.id } },
    })
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const otherTyping = Object.entries(state).some(
          ([uid, presences]) => uid !== user.id && presences.some(p => p.typing)
        )
        setOtherIsTyping(otherTyping)
      })
      .subscribe()
    typingChannelRef.current = channel
    return () => {
      supabase.removeChannel(channel)
      typingChannelRef.current = null
    }
  }, [id, user])

  function broadcastTyping() {
    if (!typingChannelRef.current) return
    typingChannelRef.current.track({ typing: true })
    clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      typingChannelRef.current?.track({ typing: false })
    }, 2000)
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(e) {
    e.preventDefault()
    if (!newMessage.trim() || !user) return
    setSending(true)
    const content = newMessage.trim()
    setNewMessage('')
    await supabase.from('messages').insert({ match_id: id, sender_id: user.id, content })
    fetch('/api/notify/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId: id, senderId: user.id, preview: content }),
    }).catch(() => {})
    setSending(false)
  }

  async function handleImageSelect(e) {
    const file = e.target.files?.[0]
    if (!file || !user) return
    if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB'); return }
    setImageUploading(true)
    const form = new FormData()
    form.append('file',          file)
    form.append('matchId',       id)
    form.append('userId',        user.id)
    form.append('insertMessage', 'true')
    const res = await fetch('/api/upload-chat-file', { method: 'POST', body: form })
    const { error: uploadErr } = await res.json()
    if (uploadErr) { setImageUploading(false); return }
    if (fileInputRef.current) fileInputRef.current.value = ''
    setImageUploading(false)
  }

  /* ── Voice recording (Telegram-style) ── */
  async function startRecording() {
    setVoiceError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      chunksRef.current = []
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = () => {
        audioBlobRef.current = new Blob(chunksRef.current, { type: 'audio/webm' })
        stream.getTracks().forEach(t => t.stop())
      }
      mr.start()
      mediaRecRef.current = mr
      setRecElapsed(0)
      setIsRecording(true)
      recTimerRef.current = setInterval(() => setRecElapsed(s => s + 1), 1000)
    } catch {
      setVoiceError('Microphone access denied.')
    }
  }

  function cancelRecording() {
    clearInterval(recTimerRef.current)
    if (mediaRecRef.current?.state !== 'inactive') mediaRecRef.current?.stop()
    mediaRecRef.current = null
    chunksRef.current   = []
    audioBlobRef.current = null
    setIsRecording(false)
    setRecElapsed(0)
    setVoiceError('')
  }

  async function stopAndSendVoice() {
    clearInterval(recTimerRef.current)
    setIsRecording(false)
    setSendingVoice(true)
    setVoiceError('')

    try {
      // Stop the recorder and wait for the blob to be assembled
      const blob = await new Promise((resolve, reject) => {
        const mr = mediaRecRef.current
        if (!mr || mr.state === 'inactive') {
          // Already stopped — use whatever chunks we have
          resolve(new Blob(chunksRef.current, { type: 'audio/webm' }))
          return
        }
        mr.onstop = () => {
          const b = new Blob(chunksRef.current, { type: 'audio/webm' })
          // Stop mic tracks
          try { mr.stream?.getTracks().forEach(t => t.stop()) } catch {}
          resolve(b)
        }
        mr.onerror = (err) => reject(err)
        mr.stop()
      })

      if (!blob || blob.size === 0) {
        setVoiceError('Recording was empty — please try again')
        setSendingVoice(false)
        return
      }

      const form = new FormData()
      form.append('file',          new File([blob], 'voice.webm', { type: 'audio/webm' }))
      form.append('matchId',       id)
      form.append('userId',        user.id)
      form.append('insertMessage', 'true')

      const res = await fetch('/api/upload-chat-file', { method: 'POST', body: form })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const { error: uploadErr } = await res.json()
      if (uploadErr) throw new Error(uploadErr)

    } catch (err) {
      console.error('[voice send]', err)
      setVoiceError('Failed to send — please try again')
    }

    audioBlobRef.current = null
    chunksRef.current    = []
    mediaRecRef.current  = null
    setSendingVoice(false)
  }

  async function handleConfirmStatus() {
    if (!pendingConfirm || updatingStatus) return
    setUpdatingStatus(true)
    const updates = { status: pendingConfirm }
    if (pendingConfirm === 'accepted' && priceInput && parseFloat(priceInput) > 0) {
      updates.agreed_price = parseFloat(priceInput)
    }
    await supabase.from('matches').update(updates).eq('id', id)
    setMatch(m => ({ ...m, ...updates }))
    fetch('/api/notify/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId: id, status: pendingConfirm }),
    }).catch(() => {})
    setPendingConfirm(null)
    setPriceInput('')
    setUpdatingStatus(false)
  }

  async function submitReview(e) {
    e.preventDefault()
    if (!reviewRating || submittingReview) return
    setSubmittingReview(true)
    const revieweeId = match.traveler_id === user.id ? match.sender_id : match.traveler_id
    const { error } = await supabase.from('reviews').insert({
      reviewer_id: user.id, reviewee_id: revieweeId, match_id: id,
      rating: reviewRating, comment: reviewText.trim() || null,
    })
    if (error) { setSubmittingReview(false); return }
    const { data: allReviews } = await supabase
      .from('reviews').select('rating').eq('reviewee_id', revieweeId)
    if (allReviews?.length) {
      const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length
      await supabase.from('profiles').update({
        rating_avg: Math.round(avg * 10) / 10,
        rating_count: allReviews.length,
      }).eq('id', revieweeId)
    }
    fetch('/api/notify/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ revieweeId, reviewerId: user.id, rating: reviewRating, comment: reviewText.trim() || null }),
    }).catch(() => {})
    setSubmittingReview(false)
    setAlreadyReviewed(true)
    setReviewSubmitted(true)
  }

  function buildReactionMap(rows, myUserId) {
    const map = {}
    rows.forEach(r => {
      if (!map[r.message_id]) map[r.message_id] = {}
      if (!map[r.message_id][r.emoji]) map[r.message_id][r.emoji] = { count: 0, mine: false }
      map[r.message_id][r.emoji].count++
      if (r.user_id === myUserId) map[r.message_id][r.emoji].mine = true
    })
    return Object.fromEntries(
      Object.entries(map).map(([msgId, emojis]) => [
        msgId,
        Object.entries(emojis).map(([emoji, d]) => ({ emoji, ...d }))
      ])
    )
  }

  const REACTION_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏']

  async function toggleReaction(msgId, emoji) {
    if (!user || isClosed) return
    const msgRxs = reactions[msgId] || []
    const existing = msgRxs.find(r => r.emoji === emoji)
    const alreadyMine = existing?.mine

    setReactions(prev => {
      const curr = prev[msgId] || []
      if (alreadyMine) {
        return { ...prev, [msgId]: curr.map(r => r.emoji === emoji ? { ...r, count: r.count - 1, mine: false } : r).filter(r => r.count > 0) }
      } else if (existing) {
        return { ...prev, [msgId]: curr.map(r => r.emoji === emoji ? { ...r, count: r.count + 1, mine: true } : r) }
      } else {
        return { ...prev, [msgId]: [...curr, { emoji, count: 1, mine: true }] }
      }
    })
    setPickerMsgId(null)

    if (alreadyMine) {
      await supabase.from('message_reactions').delete()
        .eq('message_id', msgId).eq('user_id', user.id).eq('emoji', emoji)
    } else {
      await supabase.from('message_reactions')
        .upsert({ message_id: msgId, match_id: id, user_id: user.id, emoji }, { onConflict: 'message_id,user_id,emoji' })
    }
  }

  const quickReplies = useMemo(() => {
    if (!match || !user) return []
    const _isClosed = match.status === 'delivered' || match.status === 'cancelled'
    if (_isClosed) return []
    const _isTravel = match.traveler_id === user.id
    const key = match.status === 'pending' ? `pending_${_isTravel ? 'traveler' : 'sender'}`
      : match.status === 'accepted' ? 'accepted'
      : match.status === 'in_transit' ? `in_transit_${_isTravel ? 'traveler' : 'sender'}`
      : null
    return key ? (QUICK_REPLIES[key] || []) : []
  }, [match, user])

  if (loading) return (
    <div className="flex items-center justify-center h-full text-sm" style={{ color: FG3 }}>
      {t?.loading || 'Loading…'}
    </div>
  )

  const isTravel = match.traveler_id === user?.id
  const other    = isTravel ? match.sender : match.traveler
  const isClosed = match.status === 'delivered' || match.status === 'cancelled'

  const route = match.trips
    ? `${match.trips.origin_city} → ${match.trips.destination_city}`
    : match.shipment_requests
      ? `${match.shipment_requests.origin_city} → ${match.shipment_requests.destination_city}`
      : null

  const contextKey = `${match.status}_${isTravel ? 'traveler' : 'sender'}`
  const primaryActions = STATUS_ACTIONS[contextKey] || []
  const showCancel = match.status === 'pending' || match.status === 'accepted'

  const st = STATUS_BADGE[match.status] || STATUS_BADGE.pending

  return (
    <>
    <div className="flex flex-col h-full" style={{ ...fontStyle, background: '#0B1220' }}>

      {/* ══ Header ══ */}
      <div className="flex-shrink-0" style={{ background: CARD_BG, borderBottom: `1px solid ${HAIRLINE}` }}>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">

            {/* Left: back + avatar + info */}
            <div className="flex items-center gap-3">
              <Link
                href="/matches"
                className="md:hidden flex items-center justify-center w-8 h-8 rounded-full transition-colors flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.05)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.09)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                <ChevronLeft size={18} color={FG3} />
              </Link>

              <Link href={`/profile/${isTravel ? match.sender_id : match.traveler_id}`}>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0 hover:opacity-80 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, #1A2744, #2E4068)' }}
                >
                  {other?.full_name?.[0]?.toUpperCase() || '?'}
                </div>
              </Link>

              <div>
                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/profile/${isTravel ? match.sender_id : match.traveler_id}`}
                    className="font-bold text-sm hover:opacity-80 transition-opacity"
                    style={{ color: FG1 }}
                  >
                    {other?.full_name || 'User'}
                  </Link>
                  {other?.is_verified && <ShieldCheck size={12} color="#2EBD7A" />}
                </div>
                <div className="text-xs" style={{ color: FG3 }}>
                  {route}
                  {match.trips?.departure_date && (
                    <span> · {new Date(match.trips.departure_date).toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-GB', { day: 'numeric', month: 'short' })}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: price + status badge */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {match.agreed_price ? (
                <span className="text-sm font-black" style={{ color: '#E07B29' }}>
                  ${match.agreed_price}
                </span>
              ) : null}
              <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: st.bg, color: st.text }}>
                {st.label}
              </span>
            </div>
          </div>

          {/* Package info row */}
          {match.shipment_requests && (
            <div className="mt-2 text-xs flex items-center gap-1.5 pt-2" style={{ color: FG3, borderTop: `1px solid ${HAIRLINE}` }}>
              <span className="font-medium" style={{ color: FG2 }}>{t?.packageDeclared || 'Package'}:</span>
              {match.shipment_requests.item_description}
              {match.shipment_requests.weight_kg ? ` · ${match.shipment_requests.weight_kg}kg` : ''}
            </div>
          )}
        </div>

        {/* Status action buttons */}
        {(primaryActions.length > 0 || showCancel) && (
          <div className="px-4 pb-3 flex gap-2 flex-wrap">
            {primaryActions.map(action => {
              const Icon = action.icon
              return (
                <button
                  key={action.key}
                  onClick={() => setPendingConfirm(action.key)}
                  className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90 active:scale-95"
                  style={action.style}
                >
                  <Icon size={13} />
                  {action.label(t)}
                </button>
              )
            })}
            {showCancel && (
              <button
                onClick={() => setPendingConfirm('cancelled')}
                className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                style={{ color: FG3, border: `1px solid ${HAIRLINE}`, background: 'transparent' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <XCircle size={13} />
                {t?.cancelMatch || 'Cancel'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* ══ Deal banner ══ */}
      {match.agreed_price && match.status !== 'cancelled' && (
        <div
          className="flex-shrink-0 mx-4 mt-3 px-4 py-2.5 rounded-xl flex items-center justify-between"
          style={{ background: 'rgba(46,189,122,0.07)', border: '1px solid rgba(46,189,122,0.18)' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold" style={{ color: '#2EBD7A' }}>
              ✓ {t?.dealAgreed || 'Deal agreed'}
            </span>
            {route && <span className="text-xs" style={{ color: FG3 }}>{route}</span>}
          </div>
          <span className="text-sm font-black" style={{ color: '#E07B29' }}>
            ${match.agreed_price}
          </span>
        </div>
      )}

      {/* ══ Messages ══ */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" onClick={() => setPickerMsgId(null)}>
        {messages.length === 0 && (
          <div className="text-center py-10 text-sm" style={{ color: FG3 }}>
            {t?.noMessagesYet || 'No messages yet. Say hello!'}
          </div>
        )}
        {messages.map(msg => {
          const isMe = msg.sender_id === user?.id
          const timeStr = new Date(msg.created_at).toLocaleTimeString(
            lang === 'fa' ? 'fa-IR' : 'en-GB',
            { hour: '2-digit', minute: '2-digit' }
          )
          const msgReactions = reactions[msg.id] || []

          const readTick = isMe && (
            <span style={{ fontSize: '10px', letterSpacing: '-2px', color: msg.read_at ? '#56CD93' : 'rgba(255,255,255,0.30)' }}>
              {msg.read_at ? '✓✓' : '✓'}
            </span>
          )

          const bubbleContent = msg.image_url && msg.content === '🎤 Voice message' ? (
            <div className="px-3 py-2">
              <audio controls src={msg.image_url} className="max-w-xs rounded-lg" style={{ height: '40px', minWidth: '200px' }} />
              <div className="text-xs mt-1.5 flex items-center justify-end gap-1" style={{ color: isMe ? 'rgba(255,255,255,0.35)' : FG3 }}>
                {timeStr}{readTick}
              </div>
            </div>
          ) : msg.image_url ? (
            <div>
              <a href={msg.image_url} target="_blank" rel="noopener noreferrer">
                <img src={msg.image_url} alt="Photo" className="max-w-full rounded-t-2xl object-cover" style={{ maxHeight: '240px' }} />
              </a>
              <div className="px-3 pb-2 pt-1 text-xs flex items-center justify-end gap-1" style={{ color: isMe ? 'rgba(255,255,255,0.35)' : FG3 }}>
                {timeStr}{readTick}
              </div>
            </div>
          ) : (
            <div className="px-4 py-3">
              <div style={{ color: isMe ? '#fff' : FG1 }}>{msg.content}</div>
              <div className="text-xs mt-1.5 flex items-center justify-end gap-1" style={{ color: isMe ? 'rgba(255,255,255,0.35)' : FG3 }}>
                {timeStr}{readTick}
              </div>
            </div>
          )

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-1.5 group ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {/* Reaction trigger button */}
              {!isClosed && (
                <button
                  type="button"
                  onMouseDown={e => e.stopPropagation()}
                  onClick={e => { e.stopPropagation(); setPickerMsgId(p => p === msg.id ? null : msg.id) }}
                  onTouchStart={() => { longPressRef.current = setTimeout(() => setPickerMsgId(msg.id), 500) }}
                  onTouchEnd={() => clearTimeout(longPressRef.current)}
                  className={`opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-base leading-none ${isMe ? 'order-first' : 'order-last'}`}
                  style={{ background: 'rgba(255,255,255,0.06)', fontSize: '14px' }}
                >
                  🙂
                </button>
              )}

              <div className="relative">
                {/* Emoji picker popup */}
                {pickerMsgId === msg.id && (
                  <div
                    className={`absolute bottom-full mb-1.5 z-20 flex gap-0.5 rounded-2xl px-2 py-1.5 ${isMe ? 'right-0' : 'left-0'}`}
                    style={{ background: '#1E2D4A', border: `1px solid ${HAIRLINE}`, boxShadow: '0 12px 32px rgba(0,0,0,0.5)' }}
                    onClick={e => e.stopPropagation()}
                  >
                    {REACTION_EMOJIS.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => toggleReaction(msg.id, emoji)}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-lg transition-transform hover:scale-125 active:scale-95"
                        style={{
                          background: msgReactions.find(r => r.emoji === emoji && r.mine)
                            ? 'rgba(224,123,41,0.20)' : 'transparent'
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                {/* Message bubble */}
                <div
                  className="max-w-xs md:max-w-md rounded-2xl text-sm overflow-hidden"
                  style={isMe
                    ? { background: '#E07B29', borderBottomRightRadius: 4 }
                    : { background: CARD_BG, border: `1px solid ${HAIRLINE}`, borderBottomLeftRadius: 4 }
                  }
                >
                  {bubbleContent}
                </div>

                {/* Reaction badges */}
                {msgReactions.length > 0 && (
                  <div className={`flex flex-wrap gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    {msgReactions.map(({ emoji, count, mine }) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={e => { e.stopPropagation(); toggleReaction(msg.id, emoji) }}
                        className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full transition-colors active:scale-95"
                        style={{
                          background: mine ? 'rgba(224,123,41,0.15)' : 'rgba(255,255,255,0.05)',
                          border: mine ? '1px solid rgba(224,123,41,0.40)' : `1px solid ${HAIRLINE}`,
                          color: mine ? '#E07B29' : FG2,
                        }}
                      >
                        {emoji}{count > 1 ? <span className="ml-0.5">{count}</span> : null}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* ══ Review section (when delivered) ══ */}
      {match.status === 'delivered' && (
        <div className="flex-shrink-0 mx-4 mb-3 rounded-2xl p-4" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
          {reviewSubmitted ? (
            <div className="text-center py-2">
              <div className="flex justify-center mb-2">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={18} fill={i <= reviewRating ? '#E07B29' : 'none'} color={i <= reviewRating ? '#E07B29' : '#3D5180'} strokeWidth={1.5} />
                ))}
              </div>
              <p className="font-semibold text-sm" style={{ color: '#56CD93' }}>
                {t?.reviewDone || 'Review submitted — thank you!'}
              </p>
            </div>
          ) : alreadyReviewed ? (
            <p className="text-center text-sm py-2" style={{ color: FG3 }}>
              You already reviewed {other?.full_name?.split(' ')[0] || 'this user'}.
            </p>
          ) : (
            <form onSubmit={submitReview}>
              <p className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: FG3, letterSpacing: '0.07em' }}>
                {t?.rateExperience || 'Rate your experience'} · {other?.full_name?.split(' ')[0] || 'User'}
              </p>
              <div className="flex gap-1 mb-2">
                {[1,2,3,4,5].map(i => (
                  <button key={i} type="button"
                    onClick={() => setReviewRating(i)}
                    onMouseEnter={() => setHoverRating(i)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-0.5 transition-transform hover:scale-110">
                    <Star size={24}
                      fill={(hoverRating || reviewRating) >= i ? '#E07B29' : 'none'}
                      color={(hoverRating || reviewRating) >= i ? '#E07B29' : '#3D5180'}
                      strokeWidth={1.5}
                    />
                  </button>
                ))}
                {reviewRating > 0 && (
                  <span className="ml-2 text-sm self-center" style={{ color: FG3 }}>
                    {['','Poor','Fair','Good','Great','Excellent'][reviewRating]}
                  </span>
                )}
              </div>
              <textarea
                placeholder="Add a comment (optional)"
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                rows={2}
                maxLength={300}
                className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none resize-none mb-2"
                style={{ background: '#0F1730', border: `1px solid ${HAIRLINE}`, color: FG1 }}
              />
              <button type="submit" disabled={!reviewRating || submittingReview}
                className="w-full py-2 rounded-xl text-white text-sm font-bold disabled:opacity-40 transition-opacity hover:opacity-90"
                style={{ background: '#E07B29' }}>
                {submittingReview ? '…' : (t?.submitReview || 'Submit Review')}
              </button>
            </form>
          )}
        </div>
      )}

      {/* ══ Input area ══ */}
      <div className="flex-shrink-0 px-4 pt-3 pb-4" style={{ background: CARD_BG, borderTop: `1px solid ${HAIRLINE}` }}>

        {/* Typing indicator */}
        {otherIsTyping && (
          <div className="flex items-center gap-2 mb-2 px-1">
            <div className="flex gap-1 items-center px-3 py-2 rounded-2xl rounded-bl-sm"
              style={{ background: '#0F1730', border: `1px solid ${HAIRLINE}` }}>
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: FG3, animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: FG3, animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: FG3, animationDelay: '300ms' }} />
            </div>
            <span className="text-xs" style={{ color: FG3 }}>{other?.full_name?.split(' ')[0] || 'User'} is typing…</span>
          </div>
        )}

        {/* Quick replies */}
        {quickReplies.length > 0 && !isClosed && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-hide">
            {quickReplies.map(reply => (
              <button
                key={reply}
                type="button"
                onClick={() => setNewMessage(reply)}
                className="flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-colors"
                style={{ border: `1px solid ${HAIRLINE}`, color: FG2, background: 'rgba(255,255,255,0.04)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(224,123,41,0.40)'; e.currentTarget.style.color = '#E07B29' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = HAIRLINE; e.currentTarget.style.color = FG2 }}
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {/* Voice error */}
        {voiceError && (
          <p className="text-xs px-3 py-2 mb-2 rounded-xl"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#FCA5A5' }}>
            {voiceError}
          </p>
        )}

        {/* Message input row */}
        {isClosed ? (
          <p className="text-xs text-center py-2" style={{ color: FG3 }}>
            {t?.chatClosedMsg || 'Chat closed'} · {st.label}
          </p>
        ) : (
          <form
            onSubmit={e => {
              e.preventDefault()
              if (isRecording) { stopAndSendVoice(); return }
              sendMessage(e)
            }}
            className="flex gap-2 items-center"
          >
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />

            {/* Photo button — hidden while recording */}
            {!isRecording && !sendingVoice && (
              <button
                type="button"
                disabled={imageUploading}
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl disabled:opacity-40 transition-colors"
                style={{ border: `1px solid ${HAIRLINE}`, color: FG3, background: 'rgba(255,255,255,0.03)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(224,123,41,0.40)'; e.currentTarget.style.color = '#E07B29' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = HAIRLINE; e.currentTarget.style.color = FG3 }}
                title={t?.attachPhoto || 'Attach photo'}
              >
                {imageUploading ? <span className="text-xs animate-pulse" style={{ color: FG3 }}>…</span> : <ImagePlus size={18} />}
              </button>
            )}

            {/* Mic button / recording indicator */}
            {isRecording ? (
              /* Cancel recording */
              <button
                type="button"
                onClick={cancelRecording}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl transition-colors"
                style={{ border: '1px solid rgba(239,68,68,0.40)', color: '#EF4444', background: 'rgba(239,68,68,0.08)' }}
                title="Cancel"
              >
                <XCircle size={18} />
              </button>
            ) : !sendingVoice ? (
              /* Start recording */
              <button
                type="button"
                onClick={startRecording}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl transition-colors"
                style={{ border: `1px solid ${HAIRLINE}`, color: FG3, background: 'rgba(255,255,255,0.03)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(224,123,41,0.40)'; e.currentTarget.style.color = '#E07B29' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = HAIRLINE; e.currentTarget.style.color = FG3 }}
                title="Voice message"
              >
                <Mic size={18} />
              </button>
            ) : null}

            {/* Middle area: text input OR recording UI OR uploading */}
            {isRecording ? (
              /* Inline recording display */
              <div className="flex-1 flex items-center gap-3 rounded-xl px-4 py-2.5"
                style={{ background: '#0F1730', border: '1px solid rgba(239,68,68,0.30)' }}>
                <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 animate-pulse" />
                <span className="text-sm font-mono tabular-nums flex-shrink-0" style={{ color: '#FCA5A5' }}>
                  {Math.floor(recElapsed / 60)}:{String(recElapsed % 60).padStart(2, '0')}
                </span>
                {/* Animated waveform bars */}
                <div className="flex items-end gap-0.5 flex-shrink-0" style={{ height: 16 }}>
                  {[0.35, 0.55, 0.45, 0.65, 0.40].map((dur, i) => (
                    <div key={i} style={{
                      width: 3, borderRadius: 2, background: '#EF4444',
                      animation: `vbar ${dur}s ease-in-out infinite alternate`,
                      animationDelay: `${i * 0.07}s`,
                    }} />
                  ))}
                  <style>{`@keyframes vbar { from { height: 3px } to { height: 14px } }`}</style>
                </div>
                <span className="text-xs flex-1" style={{ color: '#6E7A99' }}>Recording… tap Send to finish</span>
              </div>
            ) : sendingVoice ? (
              /* Uploading state */
              <div className="flex-1 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm animate-pulse"
                style={{ background: '#0F1730', border: `1px solid ${HAIRLINE}`, color: FG3 }}>
                <Mic size={14} />
                Sending voice message…
              </div>
            ) : (
              /* Normal text input */
              <input
                type="text"
                placeholder={t?.typeMessage || 'Type a message…'}
                value={newMessage}
                onChange={e => { setNewMessage(e.target.value); broadcastTyping() }}
                className="flex-1 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors"
                style={{ background: '#0F1730', border: `1px solid ${HAIRLINE}`, color: FG1 }}
                onFocus={e => e.target.style.borderColor = 'rgba(224,123,41,0.40)'}
                onBlur={e => e.target.style.borderColor = HAIRLINE}
              />
            )}

            {/* Single Send button — handles both text and voice */}
            <button
              type="submit"
              disabled={(sendingVoice) || (!isRecording && sending) || (!isRecording && !sendingVoice && !newMessage.trim())}
              className="px-5 py-2.5 rounded-xl text-white font-bold text-sm disabled:opacity-40 transition-opacity hover:opacity-90 active:scale-95 flex-shrink-0"
              style={{ background: isRecording ? '#EF4444' : '#E07B29' }}
            >
              {t?.sendBtn || 'Send'}
            </button>
          </form>
        )}
      </div>

    </div>

    {/* ══ Confirm modal ══ */}
    <ConfirmModal
      open={!!pendingConfirm}
      title={MODAL_CONFIG[pendingConfirm]?.title}
      description={MODAL_CONFIG[pendingConfirm]?.description}
      confirmLabel={MODAL_CONFIG[pendingConfirm]?.confirmLabel}
      confirmColor={MODAL_CONFIG[pendingConfirm]?.confirmColor}
      loading={updatingStatus}
      onConfirm={handleConfirmStatus}
      onClose={() => { setPendingConfirm(null); setPriceInput('') }}
    >
      {pendingConfirm === 'accepted' && (
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: FG3 }}>
            {t?.setPriceLabel || 'Agreed price (optional)'}
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold" style={{ color: FG3 }}>$</span>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder={t?.setPricePlaceholder || 'e.g. 20 — or leave blank to negotiate'}
              value={priceInput}
              onChange={e => setPriceInput(e.target.value)}
              className="flex-1 rounded-lg px-3 py-2.5 text-sm focus:outline-none"
              style={{ background: '#0F1730', border: `1px solid ${HAIRLINE}`, color: FG1 }}
              onFocus={e => e.target.style.borderColor = 'rgba(224,123,41,0.40)'}
              onBlur={e => e.target.style.borderColor = HAIRLINE}
              autoFocus
            />
          </div>
        </div>
      )}
    </ConfirmModal>
    </>
  )
}
