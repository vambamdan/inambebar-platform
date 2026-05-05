'use client'
import { useState, useRef } from 'react'
import { Mic, Square, Play, Pause, RotateCcw, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const CARD_BG  = '#16203A'
const HAIRLINE = 'rgba(255,255,255,0.07)'
const FG1      = '#F1F4FB'
const FG2      = '#A6B0CC'
const FG3      = '#6E7A99'

const MAX_SECONDS = 60

function formatTime(s) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

function SoundBars({ active, count = 6 }) {
  return (
    <div className="flex items-end gap-0.5" style={{ height: '18px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            width: '3px',
            borderRadius: '2px',
            background: '#E07B29',
            height: active ? undefined : '3px',
            animation: active
              ? `vbar ${0.35 + (i % 3) * 0.15}s ease-in-out infinite alternate`
              : 'none',
            animationDelay: `${i * 0.06}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes vbar {
          from { height: 3px; }
          to   { height: 16px; }
        }
      `}</style>
    </div>
  )
}

function CircleTimer({ progress, size = 88 }) {
  const r = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - Math.min(progress, 1))
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={5} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="#E07B29" strokeWidth={5}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s linear' }}
      />
    </svg>
  )
}

export default function VoicePitch({ profileId, isOwnProfile, existingUrl, onSaved }) {
  const [phase, setPhase] = useState('idle') // idle | countdown | recording | preview | uploading
  const [countdown, setCountdown] = useState(3)
  const [elapsed, setElapsed] = useState(0)
  const [blobUrl, setBlobUrl] = useState(null)
  const [liveUrl, setLiveUrl] = useState(existingUrl || null)
  const [playing, setPlaying] = useState(false)
  const [playPos, setPlayPos] = useState(0)
  const [totalDur, setTotalDur] = useState(0)
  const [error, setError] = useState('')

  const recorderRef = useRef(null)
  const chunksRef = useRef([])
  const intervalRef = useRef(null)
  const audioRef = useRef(null)
  const blobRef = useRef(null)

  function clearTimer() {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  async function startRecording() {
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setPhase('countdown')
      setCountdown(3)

      let count = 3
      const cd = setInterval(() => {
        count--
        setCountdown(count)
        if (count <= 0) { clearInterval(cd); beginCapture(stream) }
      }, 1000)
    } catch {
      setError('Microphone access denied. Allow mic permissions and try again.')
    }
  }

  function beginCapture(stream) {
    chunksRef.current = []
    const mimeType =
      MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' :
      MediaRecorder.isTypeSupported('audio/webm')             ? 'audio/webm' :
      MediaRecorder.isTypeSupported('audio/mp4')              ? 'audio/mp4' : ''

    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {})
    recorderRef.current = recorder

    recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    recorder.onstop = () => {
      stream.getTracks().forEach(t => t.stop())
      const blob = new Blob(chunksRef.current, { type: mimeType || 'audio/webm' })
      blobRef.current = blob
      setBlobUrl(URL.createObjectURL(blob))
      setPhase('preview')
    }

    recorder.start(250)
    setElapsed(0)
    setPhase('recording')

    intervalRef.current = setInterval(() => {
      setElapsed(e => {
        const next = e + 1
        if (next >= MAX_SECONDS) { clearTimer(); stopRecording(); return MAX_SECONDS }
        return next
      })
    }, 1000)
  }

  function stopRecording() {
    clearTimer()
    if (recorderRef.current?.state !== 'inactive') recorderRef.current.stop()
  }

  function discard() {
    if (blobUrl) URL.revokeObjectURL(blobUrl)
    setBlobUrl(null)
    blobRef.current = null
    setElapsed(0)
    setPlaying(false)
    setPhase('idle')
  }

  async function uploadPitch() {
    if (!blobRef.current) return
    setPhase('uploading')

    const ext = blobRef.current.type.includes('mp4') ? 'mp4'
              : blobRef.current.type.includes('ogg') ? 'ogg' : 'webm'
    const path = `${profileId}/pitch.${ext}`

    const { error: upErr } = await supabase.storage
      .from('voice-pitches')
      .upload(path, blobRef.current, { contentType: blobRef.current.type, upsert: true })

    if (upErr) {
      setError('Upload failed — please try again.')
      setPhase('preview')
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('voice-pitches').getPublicUrl(path)
    await supabase.from('profiles').update({ voice_pitch_url: publicUrl }).eq('id', profileId)

    if (blobUrl) URL.revokeObjectURL(blobUrl)
    setBlobUrl(null)
    blobRef.current = null
    setLiveUrl(publicUrl)
    setPlaying(false)
    setPhase('idle')
    if (onSaved) onSaved(publicUrl)
  }

  function togglePlay() {
    if (!audioRef.current) return
    if (playing) { audioRef.current.pause(); setPlaying(false) }
    else          { audioRef.current.play();  setPlaying(true) }
  }

  const playUrl = blobUrl || liveUrl

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
      {/* Header band */}
      <div className="px-5 py-4" style={{ background: 'linear-gradient(135deg, #1A2744 0%, #2d3f6b 100%)' }}>
        <div className="flex items-center gap-2 mb-0.5">
          <Mic size={13} color="#E07B29" />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Hear Me Out
          </span>
        </div>
        <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
          Your 60-second pitch to the world
        </p>
      </div>

      <div className="p-5">
        {error && (
          <p className="text-xs rounded-lg px-3 py-2 mb-3"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#FCA5A5' }}>
            {error}
          </p>
        )}

        {/* ── IDLE + no audio + own profile ── */}
        {phase === 'idle' && !playUrl && isOwnProfile && (
          <div className="text-center py-3">
            <p className="text-sm mb-4 leading-relaxed" style={{ color: FG3 }}>
              Tell senders who you are in 60 seconds. The best travelers have one.
            </p>
            <button onClick={startRecording}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-opacity hover:opacity-90"
              style={{ background: '#E07B29' }}>
              <Mic size={15} /> Record Now
            </button>
          </div>
        )}

        {/* ── IDLE + no audio + visitor ── */}
        {phase === 'idle' && !playUrl && !isOwnProfile && (
          <p className="text-sm text-center py-2 italic" style={{ color: FG3 }}>No voice pitch recorded yet.</p>
        )}

        {/* ── COUNTDOWN ── */}
        {phase === 'countdown' && (
          <div className="flex flex-col items-center gap-2 py-4">
            <div className="text-6xl font-black" style={{ color: '#E07B29' }}>{countdown}</div>
            <p className="text-sm" style={{ color: FG3 }}>Get ready…</p>
          </div>
        )}

        {/* ── RECORDING ── */}
        {phase === 'recording' && (
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="relative flex items-center justify-center">
              <CircleTimer progress={elapsed / MAX_SECONDS} />
              <div className="absolute flex flex-col items-center gap-0.5">
                <span className="text-base font-black" style={{ color: FG1 }}>{formatTime(elapsed)}</span>
                <span className="text-xs" style={{ color: FG3 }}>/ 1:00</span>
              </div>
            </div>
            <SoundBars active={true} count={7} />
            <button onClick={stopRecording}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-colors"
              style={{ background: '#ef4444' }}>
              <Square size={13} fill="white" /> Stop Recording
            </button>
          </div>
        )}

        {/* ── PREVIEW ── */}
        {phase === 'preview' && blobUrl && (
          <div className="flex flex-col items-center gap-4 py-2">
            <audio
              ref={audioRef} src={blobUrl}
              onEnded={() => { setPlaying(false); setPlayPos(0) }}
              onTimeUpdate={() => setPlayPos(audioRef.current?.currentTime || 0)}
              onLoadedMetadata={() => setTotalDur(audioRef.current?.duration || 0)}
            />
            <p className="text-xs font-bold uppercase tracking-wide" style={{ color: FG3 }}>Preview</p>
            <div className="flex items-center gap-4 w-full">
              <button onClick={togglePlay}
                className="w-11 h-11 rounded-full flex items-center justify-center text-white flex-shrink-0"
                style={{ background: '#E07B29' }}>
                {playing
                  ? <Pause size={16} fill="white" />
                  : <Play size={16} fill="white" style={{ marginLeft: '2px' }} />}
              </button>
              <div className="flex-1 flex flex-col gap-1.5">
                <SoundBars active={playing} count={8} />
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: totalDur ? `${(playPos / totalDur) * 100}%` : '0%', background: '#E07B29' }} />
                </div>
                <span className="text-xs" style={{ color: FG3 }}>
                  {formatTime(playPos)} / {formatTime(totalDur || elapsed)}
                </span>
              </div>
            </div>
            <div className="flex gap-2 w-full pt-1">
              <button onClick={uploadPitch}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-bold"
                style={{ background: '#2EBD7A' }}>
                <Check size={14} /> Use This
              </button>
              <button onClick={discard}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-colors"
                style={{ border: `1px solid ${HAIRLINE}`, color: FG2, background: 'transparent' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <RotateCcw size={14} /> Re-record
              </button>
            </div>
          </div>
        )}

        {/* ── UPLOADING ── */}
        {phase === 'uploading' && (
          <div className="flex flex-col items-center gap-2 py-6">
            <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#E07B29', borderTopColor: 'transparent' }} />
            <p className="text-sm" style={{ color: FG3 }}>Saving your pitch…</p>
          </div>
        )}

        {/* ── SAVED / PLAYBACK ── */}
        {phase === 'idle' && playUrl && (
          <div>
            <audio
              ref={audioRef} src={playUrl}
              onEnded={() => { setPlaying(false); setPlayPos(0) }}
              onTimeUpdate={() => setPlayPos(audioRef.current?.currentTime || 0)}
              onLoadedMetadata={() => setTotalDur(audioRef.current?.duration || 0)}
            />
            <div className="flex items-center gap-4">
              <button onClick={togglePlay}
                className="w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0 active:scale-95 transition-transform"
                style={{ background: 'linear-gradient(135deg, #E07B29, #c96820)', boxShadow: '0 4px 14px rgba(224,123,41,0.35)' }}>
                {playing
                  ? <Pause size={18} fill="white" />
                  : <Play size={18} fill="white" style={{ marginLeft: '2px' }} />}
              </button>
              <div className="flex-1 flex flex-col gap-1.5">
                <SoundBars active={playing} count={9} />
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: totalDur ? `${(playPos / totalDur) * 100}%` : '0%', background: '#E07B29' }} />
                </div>
                <span className="text-xs" style={{ color: FG3 }}>
                  {formatTime(playPos)}{totalDur ? ` / ${formatTime(totalDur)}` : ''}
                </span>
              </div>
            </div>
            {isOwnProfile && (
              <button onClick={startRecording}
                className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-colors"
                style={{ border: `1px solid ${HAIRLINE}`, color: FG3, background: 'transparent' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(224,123,41,0.40)'; e.currentTarget.style.color = '#E07B29' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = HAIRLINE; e.currentTarget.style.color = FG3 }}>
                <RotateCcw size={13} /> Re-record
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
