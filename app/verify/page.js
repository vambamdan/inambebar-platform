'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const STEPS = ['intro', 'id_upload', 'selfie_upload', 'submitted']

export default function VerifyPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [step, setStep] = useState('intro')
  const [idFile, setIdFile] = useState(null)
  const [selfieFile, setSelfieFile] = useState(null)
  const [idPreview, setIdPreview] = useState(null)
  const [selfiePreview, setSelfiePreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [consentGiven, setConsentGiven] = useState(false)
  const idRef = useRef()
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
    setSubmitting(true)
    setError('')

    try {
      const idPath = `kyc/${user.id}/id_${Date.now()}.${idFile.name.split('.').pop()}`
      const selfiePath = `kyc/${user.id}/selfie_${Date.now()}.${selfieFile.name.split('.').pop()}`

      const [idUpload, selfieUpload] = await Promise.all([
        supabase.storage.from('kyc-documents').upload(idPath, idFile, { upsert: true }),
        supabase.storage.from('kyc-documents').upload(selfiePath, selfieFile, { upsert: true })
      ])

      if (idUpload.error) throw idUpload.error
      if (selfieUpload.error) throw selfieUpload.error

      await supabase.from('profiles').update({
        verification_level: 'id'
      }).eq('id', user.id)

      // Alert admin
      fetch('/api/notify/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'submitted', userId: user.id }),
      }).catch(() => {})

      setStep('submitted')
    } catch (err) {
      setError('Upload failed. Please try again. ' + err.message)
    }
    setSubmitting(false)
  }

  if (profile?.verification_level === 'full' || profile?.is_verified) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-black mb-2" style={{color:'#1A2744'}}>You&apos;re Verified</h1>
        <p className="text-gray-400 mb-6">Your identity has been verified. You have full access to Inambebar.</p>
        <button onClick={() => router.push('/dashboard')}
          className="px-6 py-3 rounded-xl text-white font-bold" style={{background:'#E07B29'}}>
          Go to Dashboard
        </button>
      </div>
    )
  }

  if (step === 'submitted') {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-black mb-2" style={{color:'#1A2744'}}>Documents Submitted</h1>
        <p className="text-gray-400 mb-2">Your ID and selfie have been received. Our team will review them within 24 hours.</p>
        <p className="text-gray-400 text-sm mb-6">You&apos;ll receive an email once your account is verified.</p>
        <button onClick={() => router.push('/dashboard')}
          className="px-6 py-3 rounded-xl text-white font-bold" style={{background:'#E07B29'}}>
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2" style={{color:'#1A2744'}}>Verify Your Identity 🪪</h1>
        <p className="text-gray-400 text-sm leading-relaxed">
          Inambebar requires all users to verify their identity before sending or carrying packages.
          This protects everyone on the platform and makes theft nearly impossible — your real identity is on file.
        </p>
      </div>

      {step === 'intro' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="font-bold text-base mb-4" style={{color:'#1A2744'}}>What you&apos;ll need</h2>
            <div className="space-y-3">
              {[
                {icon: '🪪', title: 'Government-issued ID', desc: 'Passport, national ID card, or driver\'s license — must show your full name and photo clearly'},
                {icon: '🤳', title: 'A selfie photo', desc: 'A clear photo of your face taken right now — must match your ID photo'},
              ].map(item => (
                <div key={item.title} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="text-2xl">{item.icon}</div>
                  <div>
                    <div className="font-semibold text-sm" style={{color:'#1A2744'}}>{item.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
            <h3 className="font-bold text-sm mb-2" style={{color:'#1A2744'}}>Why we verify everyone</h3>
            <p className="text-xs text-amber-700 leading-relaxed">
              Every verified user&apos;s identity is permanently on file. If a package is stolen or a user commits fraud,
              we have their real identity and will report it to authorities. This makes Inambebar one of the safest
              peer-to-peer shipping platforms available — bad actors have nowhere to hide.
            </p>
          </div>

          <button onClick={() => setStep('id_upload')}
            className="w-full py-4 rounded-xl text-white font-bold text-base" style={{background:'#E07B29'}}>
            Start Verification →
          </button>
        </div>
      )}

      {step === 'id_upload' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="font-bold text-base mb-1" style={{color:'#1A2744'}}>Step 1 of 2 — Upload your ID</h2>
            <p className="text-gray-400 text-sm mb-5">Take a clear photo of your passport or national ID. All four corners must be visible. No glare.</p>

            <div
              onClick={() => idRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-amber-400 transition-colors">
              {idPreview ? (
                <img src={idPreview} alt="ID preview" className="max-h-48 mx-auto rounded-lg object-contain"/>
              ) : (
                <>
                  <div className="text-4xl mb-2">🪪</div>
                  <div className="text-sm font-medium text-gray-500">Click to upload your ID document</div>
                  <div className="text-xs text-gray-300 mt-1">JPG, PNG or PDF · Max 10MB</div>
                </>
              )}
            </div>
            <input ref={idRef} type="file" accept="image/*,.pdf" className="hidden"
              onChange={e => handleFileChange(e.target.files?.[0], 'id')}/>

            {idFile && (
              <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                <span>✓</span><span>{idFile.name}</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep('intro')}
              className="flex-1 py-3 rounded-xl font-bold border border-gray-200 text-gray-500">
              Back
            </button>
            <button onClick={() => { if (idFile) setStep('selfie_upload'); else setError('Please upload your ID first.') }}
              className="flex-1 py-3 rounded-xl text-white font-bold" style={{background:'#1A2744'}}>
              Next →
            </button>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>
      )}

      {step === 'selfie_upload' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="font-bold text-base mb-1" style={{color:'#1A2744'}}>Step 2 of 2 — Take a selfie</h2>
            <p className="text-gray-400 text-sm mb-5">Take a clear photo of your face right now. Good lighting, no sunglasses, face clearly visible. Must match your ID photo.</p>

            <div
              onClick={() => selfieRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-amber-400 transition-colors">
              {selfiePreview ? (
                <img src={selfiePreview} alt="Selfie preview" className="max-h-48 mx-auto rounded-lg object-contain"/>
              ) : (
                <>
                  <div className="text-4xl mb-2">🤳</div>
                  <div className="text-sm font-medium text-gray-500">Click to upload your selfie</div>
                  <div className="text-xs text-gray-300 mt-1">JPG or PNG · Max 10MB</div>
                </>
              )}
            </div>
            <input ref={selfieRef} type="file" accept="image/*" className="hidden"
              onChange={e => handleFileChange(e.target.files?.[0], 'selfie')}/>

            {selfieFile && (
              <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                <span>✓</span><span>{selfieFile.name}</span>
              </div>
            )}
          </div>

          {/* GDPR-compliant explicit consent checkbox */}
          <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer select-none">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={e => setConsentGiven(e.target.checked)}
              className="mt-0.5 h-4 w-4 flex-shrink-0 accent-amber-500"
            />
            <span className="text-xs text-gray-500 leading-relaxed">
              I confirm that the documents I am submitting are genuine and belong to me. I have read and understood the{' '}
              <Link href="/privacy" target="_blank" className="underline font-medium" style={{color:'#E07B29'}}>
                Privacy Policy
              </Link>
              {' '}and understand that my ID and selfie will be stored securely by Inambebar for identity verification and legal compliance purposes for up to 3 years after account deletion, and may be disclosed to law enforcement upon a valid legal request.
            </span>
          </label>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="flex gap-3">
            <button onClick={() => setStep('id_upload')}
              className="flex-1 py-3 rounded-xl font-bold border border-gray-200 text-gray-500">
              Back
            </button>
            <button onClick={handleSubmit} disabled={submitting || !selfieFile || !consentGiven}
              className="flex-1 py-3 rounded-xl text-white font-bold disabled:opacity-50" style={{background:'#E07B29'}}>
              {submitting ? 'Submitting...' : 'Submit for Review →'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
