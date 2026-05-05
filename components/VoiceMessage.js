'use client'
import { useState, useRef, useEffect } from 'react'
import { Mic, Square, Send, X, Play, Pause } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const CARD_BG  = '#16203A'
const HAIRLINE = 'rgba(255,255,255,0.07)'
const FG1      = '#F1F4FB'
const FG2      = '#A6B0CC'
const FG3      = '#6E7A99'

const MAX_SECONDS = 30

function formatTime(s) {
  const sec = Math.floor(s % 60)
  return `0:${sec.toString().padStart(2, '0')}`
}

/**
 * VoiceMessage — compact inline recorder for chat
 * Props:
 *   matchId    — match UUID (used for storage path)
 *   userId     — sender UUID
 *   onCancel   — called when user dismisses
 *   onSent     — called after successful send (no args)
 */
export default function VoiceMessage({ matchId, userId, onCancel, onSent }) {
  const [phase, setPhase]         = useState('idle')    // idle | recording | preview | uploading
  const [elapsed, setElapsed]     = useState(0)
  const [audioUrl, setAudioUrl]   = useState(null)
  const [playing, setPlaying]     = useState(false)
  const [playElapsed, setPlayElapsed] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)

  const mediaRef    = useRef(null)
  const chunksRef   = useRef([])
  const blobRef     = useRef(null)
  const timerRef    = useRef(null)
  const audioRef    = useRef(null)
  const playTimerRef = useRef(null)

  /* ── Start recording ── */
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      chunksRef.current = []
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        blobRef.current = blob
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        setPhase('preview')
        stream.getTracks().forEach(t => t.stop())
      }
      mr.start()
      mediaRef.current = mr
      setElapsed(0)
      setPhase('recording')

      timerRef.current = setInterval(() => {
        setElapsed(s => {
          if (s + 1 >= MAX_SECONDS) { stopRecording(); return MAX_SECONDS }
          return s + 1
        })
      }, 1000)
    } catch {
      alert('Microphone access denied.')
    }
  }

  function stopRecording() {
    clearInterval(timerRef.current)
    if (mediaRef.current?.state !== 'inactive') {
      mediaRef.current.stop()
    }
  }

  /* ── Preview playback ── */
  function togglePlay() {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      clearInterval(playTimerRef.current)
      setPlaying(false)
    } else {
      audioRef.current.play()
      setPlaying(true)
      playTimerRef.current = setInterval(() => {
        setPlayElapsed(audioRef.current?.currentTime ?? 0)
      }, 200)
    }
  }

  useEffect(() => {
    if (!audioUrl) return
    const a = new Audio(audioUrl)
    a.onloadedmetadata = () => setAudioDuration(a.duration || 0)
    a.onended = () => {
      clearInterval(playTimerRef.current)
      setPlaying(false)
      setPlayElapsed(0)
    }
    audioRef.current = a
    return () => { a.pause(); clearInterval(playTimerRef.current) }
  }, [audioUrl])

  /* ── Send ── */
  async function handleSend() {
    if (!blobRef.current) return
    setPhase('uploading')
    const path = `${matchId}/${userId}/${Date.now()}.webm`
    const { error } = await supabase.storage
      .from('chat-images')  // reuse same bucket, audio is small
      .upload(path, blobRef.current, { contentType: 'audio/webm' })
    if (error) { setPhase('preview'); return }
    const { data: { publicUrl } } = supabase.storage.from('chat-images').getPublicUrl(path)
    await supabase.from('messages').insert({
      match_id: matchId,
      sender_id: userId,
      content: '🎤 Voice message',
      image_url: publicUrl,   // repurpose image_url for audio too; we detect by content
    })
    onSent?.()
  }

  function reset() {
    clearInterval(timerRef.current)
    clearInterval(playTimerRef.current)
    audioRef.current?.pause()
    setPhase('idle')
    setElapsed(0)
    setAudioUrl(null)
    setPlaying(false)
    setPlayElapsed(0)
    blobRef.current = null
  }

  /* ── Render ── */
  if (phase === 'idle') return (
    <div className="flex items-center gap-2 rounded-2xl px-4 py-3"
      style={{ background: CARD_BG, border: `1px solid rgba(224,123,41,0.22)` }}>
      <button
        onClick={startRecording}
        className="flex items-center gap-2 text-sm font-semibold"
        style={{ color: '#E07B29' }}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(224,123,41,0.12)' }}>
          <Mic size={16} color="#E07B29" />
        </div>
        Tap to record voice message
      </button>
      <button onClick={onCancel} className="ml-auto transition-colors"
        style={{ color: FG3 }}
        onMouseEnter={e => e.currentTarget.style.color = FG2}
        onMouseLeave={e => e.currentTarget.style.color = FG3}>
        <X size={16} />
      </button>
    </div>
  )

  if (phase === 'recording') return (
    <div className="flex items-center gap-3 rounded-2xl px-4 py-3"
      style={{ background: CARD_BG, border: '1px solid rgba(239,68,68,0.25)' }}>
      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      <div className="flex items-end gap-0.5" style={{ height: '16px' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{
            width: '3px',
            borderRadius: '2px',
            background: '#EF4444',
            animation: `vbar ${0.35 + (i % 3) * 0.15}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.07}s`,
          }} />
        ))}
        <style>{`@keyframes vbar { from { height: 3px } to { height: 14px } }`}</style>
      </div>
      <span className="text-sm font-mono tabular-nums" style={{ color: '#FCA5A5' }}>{formatTime(elapsed)}</span>
      <span className="text-xs" style={{ color: FG3 }}>/ {formatTime(MAX_SECONDS)}</span>
      <button
        onClick={stopRecording}
        className="ml-auto flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg text-white"
        style={{ background: '#EF4444' }}
      >
        <Square size={11} /> Stop
      </button>
    </div>
  )

  if (phase === 'preview') {
    const prog = audioDuration > 0 ? (playElapsed / audioDuration) * 100 : 0
    return (
      <div className="flex items-center gap-3 rounded-2xl px-4 py-3"
        style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
        <button
          onClick={togglePlay}
          className="w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0"
          style={{ background: '#E07B29' }}
        >
          {playing ? <Pause size={15} /> : <Play size={15} />}
        </button>
        <div className="flex-1">
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${prog}%`, background: '#E07B29' }} />
          </div>
          <span className="text-xs mt-1 block" style={{ color: FG3 }}>
            {formatTime(playElapsed)} / {formatTime(audioDuration)}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={reset} className="p-1 transition-colors"
            style={{ color: FG3 }}
            onMouseEnter={e => e.currentTarget.style.color = FG2}
            onMouseLeave={e => e.currentTarget.style.color = FG3}>
            <X size={15} />
          </button>
          <button
            onClick={handleSend}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90"
            style={{ background: '#E07B29' }}
          >
            <Send size={12} /> Send
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm animate-pulse"
      style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}`, color: FG3 }}>
      Sending voice message…
    </div>
  )
}
