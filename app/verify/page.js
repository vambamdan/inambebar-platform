'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, Upload, User } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const CARD_BG  = '#16203A'
const HAIRLINE = 'rgba(255,255,255,0.07)'
const FG1      = '#F1F4FB'
const FG2      = '#A6B0CC'
const FG3      = '#6E7A99'

export default function VerifyPage() {
  const router = useRouter()
  const [user, setUser]         = useState(null)
  const [profile, setProfile]   = useState(null)
  const [step, setStep]         = useState('intro')
  const [idFile, setIdFile]     = useState(null)
  const [selfieFile, setSelfieFile] = useState(null)
  const [idPreview, setIdPreview]   = useState(null)
  const [selfiePreview, setSelfiePreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState('')
  const [consentGiven, setConsentGiven] = useState(false)
  const idRef     = useRef()
  const selfieRef = useRef()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      setUser(user)
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      if (data?.verification_level === 'full') setStep('submitted')
    }
    load()
  }, [router])

  function handleFileChange(file, type) {
    if (!file) return
    const preview = URL.createObjectURL(file)
    if (type === 'id') { setIdFile(file); setIdPreview(preview) }
    else { setSelfieFile(file); setSelfiePreview(preview) }
  }

  async function handleSubmit() {
    if (!idFile || !selfieFile) { setError('Please upload both your ID and selfie.'); return }
    setSubmitting(true); setError('')
    try {
      const idPath     = `kyc/${user.id}/id_${Date.now()}.${idFile.name.split('.').pop()}`
      const selfiePath = `kyc/${user.id}/selfie_${Date.now()}.${selfieFile.name.split('.').pop()}`
      const [idUpload, selfieUpload] = await Promise.all([
        supabase.storage.from('kyc-documents').upload(idPath, idFile, { upsert: true }),
        supabase.storage.from('kyc-documents').upload(selfiePath, selfieFile, { upsert: true }),
      ])
      if (idUpload.error)     throw idUpload.error
      if (selfieUpload.error) throw selfieUpload.error
      await supabase.from('profiles').update({ verification_level: 'id' }).eq('id', user.id)
      fetch('/api/notify/kyc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'submitted', userId: user.id }) }).catch(() => {})
      setStep('submitted')
    } catch (err) {
      setError('Upload failed. Please try again. ' + err.message)
    }
    setSubmitting(false)
  }

  // ── Already verified ──
  if (profile?.verification_level === 'full' || profile?.is_verified) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B1220', paddingTop: 72 }}>
        <div className="max-w-md mx-auto px-6 py-20 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(46,189,122,0.10)', border: '1px solid rgba(46,189,122,0.20)' }}>
            <ShieldCheck size={28} style={{ color: '#2EBD7A' }} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: FG1, letterSpacing: '-0.025em' }}>You&apos;re Verified</h1>
          <p className="mb-6" style={{ color: FG3 }}>Your identity has been verified. You have full access to Inambebar.</p>
          <button onClick={() => router.push('/dashboard')}
            className="px-6 py-3 rounded-xl text-white font-semibold" style={{ background: '#E07B29' }}>
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // ── Submitted ──
  if (step === 'submitted') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B1220', paddingTop: 72 }}>
        <div className="max-w-md mx-auto px-6 py-20 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(224,123,41,0.08)', border: '1px solid rgba(224,123,41,0.20)' }}>
            <Upload size={28} style={{ color: '#E07B29' }} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: FG1, letterSpacing: '-0.025em' }}>Documents Submitted</h1>
          <p className="mb-2" style={{ color: FG2 }}>Your ID and selfie have been received. Our team will review them within 24 hours.</p>
          <p className="text-sm mb-6" style={{ color: FG3 }}>You&apos;ll receive an email once your account is verified.</p>
          <button onClick={() => router.push('/dashboard')}
            className="px-6 py-3 rounded-xl text-white font-semibold" style={{ background: '#E07B29' }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // ── Main flow ──
  return (
    <div className="min-h-screen" style={{ background: '#0B1220', paddingTop: 72 }}>
    <div className="max-w-2xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
          style={{ background: 'rgba(46,189,122,0.10)', color: '#56CD93', border: '1px solid rgba(46,189,122,0.20)' }}>
          <ShieldCheck size={12} /> One-time, takes 2 minutes
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: FG1, letterSpacing: '-0.025em' }}>Verify Your Identity</h1>
        <p className="text-sm leading-relaxed" style={{ color: FG3 }}>
          Inambebar requires all users to verify their identity before sending or carrying packages.
          This protects everyone and makes theft nearly impossible — your real identity is on file.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        {[
          { key: 'intro', n: '01', label: 'Overview' },
          { key: 'id_upload', n: '02', label: 'ID Upload' },
          { key: 'selfie_upload', n: '03', label: 'Selfie' },
        ].map((s, i) => {
          const steps = ['intro', 'id_upload', 'selfie_upload']
          const idx = steps.indexOf(step)
          const si  = steps.indexOf(s.key)
          const active = si === idx
          const done   = si < idx
          return (
            <div key={s.key} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold" style={{ fontFamily: 'JetBrains Mono, monospace',
                  color: active ? '#E07B29' : done ? '#56CD93' : FG3 }}>
                  {s.n}
                </span>
                <span className="text-xs font-medium" style={{ color: active ? FG1 : done ? '#56CD93' : FG3 }}>
                  {s.label}
                </span>
              </div>
              {i < 2 && <span className="text-xs mx-1" style={{ color: FG3 }}>·</span>}
            </div>
          )
        })}
      </div>

      {/* ── Step: Intro ── */}
      {step === 'intro' && (
        <div className="space-y-4">
          <div className="rounded-2xl p-6" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
            <h2 className="font-semibold text-base mb-4" style={{ color: FG1 }}>What you&apos;ll need</h2>
            <div className="space-y-3">
              {[
                { Icon: null, title: 'Government-issued ID', desc: "Passport, national ID card (کارت ملی), or driver's license — must show your full name and photo clearly." },
                { Icon: User, title: 'A selfie photo', desc: 'A clear photo of your face taken right now — must match your ID photo.' },
              ].map(({ title, desc, Icon }) => (
                <div key={title} className="flex items-start gap-3 p-3.5 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${HAIRLINE}` }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(224,123,41,0.08)', border: '1px solid rgba(224,123,41,0.15)' }}>
                    {Icon
                      ? <Icon size={16} style={{ color: '#E07B29' }} strokeWidth={1.5} />
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E07B29" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M15 8h2M15 12h2M7 16h10"/></svg>
                    }
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: FG1 }}>{title}</div>
                    <div className="text-xs mt-0.5" style={{ color: FG3 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-5" style={{ background: 'rgba(224,123,41,0.06)', border: '1px solid rgba(224,123,41,0.18)' }}>
            <h3 className="font-semibold text-sm mb-2" style={{ color: '#F5B380' }}>Why we verify everyone</h3>
            <p className="text-xs leading-relaxed" style={{ color: '#FAD2B0' }}>
              Every verified user&apos;s identity is permanently on file. If a package is stolen or fraud occurs,
              we have their real identity and will report it to authorities. This makes Inambebar one of the safest
              peer-to-peer shipping platforms available.
            </p>
          </div>

          <button onClick={() => setStep('id_upload')}
            className="w-full py-3.5 rounded-xl text-white font-semibold text-sm" style={{ background: '#E07B29' }}>
            Start Verification →
          </button>
        </div>
      )}

      {/* ── Step: ID Upload ── */}
      {step === 'id_upload' && (
        <div className="space-y-4">
          <div className="rounded-2xl p-6" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
            <h2 className="font-semibold text-base mb-1" style={{ color: FG1 }}>Step 1 of 2 — Upload your ID</h2>
            <p className="text-sm mb-5" style={{ color: FG3 }}>Take a clear photo of your passport or national ID. All four corners must be visible. No glare.</p>

            <div onClick={() => idRef.current?.click()}
              className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors"
              style={{ borderColor: idPreview ? 'rgba(46,189,122,0.40)' : HAIRLINE }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(224,123,41,0.40)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = idPreview ? 'rgba(46,189,122,0.40)' : HAIRLINE}>
              {idPreview ? (
                <img src={idPreview} alt="ID preview" className="max-h-48 mx-auto rounded-lg object-contain" />
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: 'rgba(224,123,41,0.08)', border: '1px solid rgba(224,123,41,0.15)' }}>
                    <Upload size={20} style={{ color: '#E07B29' }} strokeWidth={1.5} />
                  </div>
                  <div className="text-sm font-medium" style={{ color: FG2 }}>Click to upload your ID document</div>
                  <div className="text-xs mt-1" style={{ color: FG3 }}>JPG, PNG or PDF · Max 10MB</div>
                </>
              )}
            </div>
            <input ref={idRef} type="file" accept="image/*,.pdf" className="hidden"
              onChange={e => handleFileChange(e.target.files?.[0], 'id')} />
            {idFile && (
              <div className="mt-3 flex items-center gap-2 text-sm" style={{ color: '#56CD93' }}>
                <ShieldCheck size={14} />{idFile.name}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep('intro')}
              className="flex-1 py-3 rounded-xl font-semibold text-sm transition-colors"
              style={{ color: FG2, background: 'rgba(255,255,255,0.05)', border: `1px solid ${HAIRLINE}` }}>
              Back
            </button>
            <button onClick={() => { if (idFile) setStep('selfie_upload'); else setError('Please upload your ID first.') }}
              className="flex-1 py-3 rounded-xl text-white font-semibold text-sm"
              style={{ background: '#1A2744', border: `1px solid rgba(255,255,255,0.12)` }}>
              Next →
            </button>
          </div>
          {error && <p className="text-sm text-center" style={{ color: '#E04B4B' }}>{error}</p>}
        </div>
      )}

      {/* ── Step: Selfie Upload ── */}
      {step === 'selfie_upload' && (
        <div className="space-y-4">
          <div className="rounded-2xl p-6" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
            <h2 className="font-semibold text-base mb-1" style={{ color: FG1 }}>Step 2 of 2 — Take a selfie</h2>
            <p className="text-sm mb-5" style={{ color: FG3 }}>Clear photo of your face right now. Good lighting, no sunglasses. Must match your ID photo.</p>

            <div onClick={() => selfieRef.current?.click()}
              className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors"
              style={{ borderColor: selfiePreview ? 'rgba(46,189,122,0.40)' : HAIRLINE }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(224,123,41,0.40)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = selfiePreview ? 'rgba(46,189,122,0.40)' : HAIRLINE}>
              {selfiePreview ? (
                <img src={selfiePreview} alt="Selfie preview" className="max-h-48 mx-auto rounded-lg object-contain" />
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: 'rgba(224,123,41,0.08)', border: '1px solid rgba(224,123,41,0.15)' }}>
                    <User size={20} style={{ color: '#E07B29' }} strokeWidth={1.5} />
                  </div>
                  <div className="text-sm font-medium" style={{ color: FG2 }}>Click to upload your selfie</div>
                  <div className="text-xs mt-1" style={{ color: FG3 }}>JPG or PNG · Max 10MB</div>
                </>
              )}
            </div>
            <input ref={selfieRef} type="file" accept="image/*" className="hidden"
              onChange={e => handleFileChange(e.target.files?.[0], 'selfie')} />
            {selfieFile && (
              <div className="mt-3 flex items-center gap-2 text-sm" style={{ color: '#56CD93' }}>
                <ShieldCheck size={14} />{selfieFile.name}
              </div>
            )}
          </div>

          {/* Consent */}
          <label className="flex items-start gap-3 p-4 rounded-xl cursor-pointer select-none"
            style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${HAIRLINE}` }}>
            <input type="checkbox" checked={consentGiven} onChange={e => setConsentGiven(e.target.checked)}
              className="mt-0.5 h-4 w-4 flex-shrink-0 accent-amber-500" />
            <span className="text-xs leading-relaxed" style={{ color: FG3 }}>
              I confirm that the documents I am submitting are genuine and belong to me. I have read the{' '}
              <Link href="/privacy" target="_blank" className="underline font-medium" style={{ color: '#E07B29' }}>
                Privacy Policy
              </Link>
              {' '}and understand my ID and selfie will be stored securely for identity verification and legal compliance.
            </span>
          </label>

          {error && <p className="text-sm text-center" style={{ color: '#E04B4B' }}>{error}</p>}

          <div className="flex gap-3">
            <button onClick={() => setStep('id_upload')}
              className="flex-1 py-3 rounded-xl font-semibold text-sm"
              style={{ color: FG2, background: 'rgba(255,255,255,0.05)', border: `1px solid ${HAIRLINE}` }}>
              Back
            </button>
            <button onClick={handleSubmit} disabled={submitting || !selfieFile || !consentGiven}
              className="flex-1 py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-40"
              style={{ background: '#E07B29' }}>
              {submitting ? 'Submitting...' : 'Submit for Review →'}
            </button>
          </div>
        </div>
      )}

    </div>
    </div>
  )
}
