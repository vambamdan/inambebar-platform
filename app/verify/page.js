'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, Clock, XCircle, ArrowRight, RefreshCw } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const CARD_BG  = '#16203A'
const HAIRLINE = 'rgba(255,255,255,0.07)'
const FG1      = '#F1F4FB'
const FG2      = '#A6B0CC'
const FG3      = '#6E7A99'

export default function VerifyPage() {
  const router  = useRouter()
  const [user, setUser]       = useState(null)
  const [status, setStatus]   = useState(null)   // null | 'not_started' | 'in_progress' | 'approved' | 'rejected'
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)
  const [err, setErr]         = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      setUser(user)

      const { data } = await supabase
        .from('profiles')
        .select('kyc_status, is_verified')
        .eq('id', user.id)
        .single()

      // Fallback: if kyc_status column doesn't exist yet, derive from is_verified
      const kycStatus = data?.kyc_status ?? (data?.is_verified ? 'approved' : 'not_started')
      setStatus(kycStatus)
      setLoading(false)
    }
    load()
  }, [router])

  // Real-time: update status when webhook fires and profile row changes
  useEffect(() => {
    if (!user) return
    const channel = supabase
      .channel(`kyc-status-${user.id}`)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'profiles',
        filter: `id=eq.${user.id}`,
      }, payload => {
        if (payload.new?.kyc_status) setStatus(payload.new.kyc_status)
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [user])

  async function startVerification() {
    if (!user) return
    setStarting(true)
    setErr('')
    try {
      const res = await fetch('/api/didit/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })
      const data = await res.json()
      if (!res.ok || !data.url) {
        setErr(data.error || 'Could not start verification. Please try again.')
        setStarting(false)
        return
      }
      // Optimistically show in_progress before the redirect
      setStatus('in_progress')
      window.location.href = data.url
    } catch {
      setErr('Network error. Please try again.')
      setStarting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B1220', paddingTop: 72 }}>
      <div className="text-sm animate-pulse" style={{ color: FG3 }}>Loading…</div>
    </div>
  )

  // ── Approved ──
  if (status === 'approved') return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B1220', paddingTop: 72 }}>
      <div className="max-w-md w-full mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: 'rgba(46,189,122,0.10)', border: '1px solid rgba(46,189,122,0.20)' }}>
          <ShieldCheck size={28} style={{ color: '#2EBD7A' }} strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: FG1, letterSpacing: '-0.025em' }}>
          You&apos;re Verified
        </h1>
        <p className="mb-6 text-sm" style={{ color: FG3 }}>
          Your identity has been verified. You have full access to Inambebar.
        </p>
        <button onClick={() => router.push('/dashboard')}
          className="px-6 py-3 rounded-xl text-white font-semibold text-sm" style={{ background: '#E07B29' }}>
          Go to Dashboard
        </button>
      </div>
    </div>
  )

  // ── In Progress ──
  if (status === 'in_progress') return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B1220', paddingTop: 72 }}>
      <div className="max-w-md w-full mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: 'rgba(224,123,41,0.08)', border: '1px solid rgba(224,123,41,0.20)' }}>
          <Clock size={28} style={{ color: '#E07B29' }} strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: FG1, letterSpacing: '-0.025em' }}>
          Verification In Progress
        </h1>
        <p className="mb-2 text-sm" style={{ color: FG2 }}>
          Your documents are being reviewed by Didit&apos;s automated system. This usually takes just a few minutes.
        </p>
        <p className="text-xs mb-8" style={{ color: FG3 }}>
          You&apos;ll receive an email when it&apos;s done. This page will update automatically.
        </p>
        <div className="flex flex-col gap-3">
          <button onClick={() => router.push('/dashboard')}
            className="px-6 py-3 rounded-xl text-white font-semibold text-sm" style={{ background: '#E07B29' }}>
            Back to Dashboard
          </button>
          <button
            onClick={startVerification}
            disabled={starting}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium disabled:opacity-40"
            style={{ color: FG3, background: 'rgba(255,255,255,0.04)', border: `1px solid ${HAIRLINE}` }}>
            <RefreshCw size={14} /> Restart verification
          </button>
        </div>
      </div>
    </div>
  )

  // ── Rejected ──
  if (status === 'rejected') return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B1220', paddingTop: 72 }}>
      <div className="max-w-md w-full mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.20)' }}>
          <XCircle size={28} style={{ color: '#EF4444' }} strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: FG1, letterSpacing: '-0.025em' }}>
          Verification Unsuccessful
        </h1>
        <p className="mb-2 text-sm" style={{ color: FG2 }}>
          Your identity could not be verified. This can happen if the document was unclear, expired, or didn&apos;t match.
        </p>
        <p className="text-xs mb-8" style={{ color: FG3 }}>
          You can try again with a clearer photo or a different document. If you believe this is a mistake,{' '}
          <Link href="mailto:support@inambebar.com" className="underline" style={{ color: '#E07B29' }}>
            contact support
          </Link>.
        </p>
        {err && <p className="text-sm mb-4" style={{ color: '#EF4444' }}>{err}</p>}
        <button
          onClick={startVerification}
          disabled={starting}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white font-semibold text-sm disabled:opacity-50"
          style={{ background: '#E07B29' }}>
          {starting ? 'Starting…' : <><ArrowRight size={15} /> Try Again</>}
        </button>
      </div>
    </div>
  )

  // ── Not started (default) ──
  return (
    <div className="min-h-screen" style={{ background: '#0B1220', paddingTop: 72 }}>
    <div className="max-w-lg mx-auto px-6 py-12">

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
          style={{ background: 'rgba(46,189,122,0.10)', color: '#56CD93', border: '1px solid rgba(46,189,122,0.20)' }}>
          <ShieldCheck size={12} /> Powered by Didit · Takes ~2 minutes
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: FG1, letterSpacing: '-0.025em' }}>
          Verify Your Identity
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: FG3 }}>
          Inambebar requires identity verification before you can send or carry packages.
          We use Didit, a certified identity verification service, to handle this securely.
        </p>
      </div>

      {/* What to expect */}
      <div className="rounded-2xl p-6 mb-4" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
        <h2 className="font-semibold text-sm mb-4" style={{ color: FG1 }}>What you&apos;ll need</h2>
        <div className="space-y-3">
          {[
            {
              label: 'Government-issued ID',
              desc: 'Passport, national ID (کارت ملی), or driver\'s licence. Must show your full name and photo.',
            },
            {
              label: 'A selfie',
              desc: 'Didit will ask you to take a quick selfie to match against your ID. No app needed.',
            },
            {
              label: '~2 minutes',
              desc: 'The process is fully automated. Results are usually instant or within minutes.',
            },
          ].map(({ label, desc }) => (
            <div key={label} className="flex items-start gap-3 p-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${HAIRLINE}` }}>
              <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: '#E07B29' }} />
              <div>
                <div className="text-sm font-medium" style={{ color: FG1 }}>{label}</div>
                <div className="text-xs mt-0.5" style={{ color: FG3 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why */}
      <div className="rounded-xl p-4 mb-6"
        style={{ background: 'rgba(224,123,41,0.06)', border: '1px solid rgba(224,123,41,0.18)' }}>
        <p className="text-xs leading-relaxed" style={{ color: '#FAD2B0' }}>
          <span className="font-semibold" style={{ color: '#F5B380' }}>Why we verify everyone — </span>
          Every verified user&apos;s identity is permanently on file. If a package is stolen or fraud occurs,
          the responsible party&apos;s real identity is on record and will be reported to authorities.
          This makes Inambebar one of the safest peer-to-peer platforms available.
        </p>
      </div>

      {/* Consent */}
      <p className="text-xs mb-6" style={{ color: FG3 }}>
        By starting verification you confirm your documents are genuine and you have read our{' '}
        <Link href="/privacy" target="_blank" className="underline" style={{ color: '#E07B29' }}>
          Privacy Policy
        </Link>
        . Your data is processed by Didit in accordance with GDPR.
      </p>

      {err && <p className="text-sm mb-4 text-center" style={{ color: '#EF4444' }}>{err}</p>}

      <button
        onClick={startVerification}
        disabled={starting}
        className="flex items-center justify-center gap-2 w-full py-4 rounded-xl text-white font-bold text-sm disabled:opacity-50 transition-opacity hover:opacity-90"
        style={{ background: '#E07B29' }}>
        {starting
          ? 'Starting…'
          : <><ShieldCheck size={16} /> Start Identity Verification</>}
      </button>

      <p className="text-xs text-center mt-3" style={{ color: FG3 }}>
        You will be taken to Didit&apos;s secure verification page.
      </p>

    </div>
    </div>
  )
}
