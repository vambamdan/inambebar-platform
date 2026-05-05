'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, ShieldCheck } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const FG1 = '#F1F4FB'
const FG3 = '#6E7A99'

/**
 * User lands here after completing (or closing) the Didit flow.
 * Didit's webhook fires asynchronously — we subscribe in real-time
 * and redirect automatically when kyc_status changes.
 */
export default function VerifyCompletePage() {
  const router = useRouter()
  const [userId, setUserId] = useState(null)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      setUserId(user.id)

      const { data } = await supabase
        .from('profiles')
        .select('kyc_status')
        .eq('id', user.id)
        .single()

      const s = data?.kyc_status || 'in_progress'
      setStatus(s)

      // If already resolved, redirect now
      if (s === 'approved' || s === 'rejected') {
        router.replace('/verify')
      }
    }
    load()
  }, [router])

  // Subscribe to real-time profile update from webhook
  useEffect(() => {
    if (!userId) return
    const channel = supabase
      .channel(`verify-complete-${userId}`)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'profiles',
        filter: `id=eq.${userId}`,
      }, payload => {
        const newStatus = payload.new?.kyc_status
        if (newStatus && newStatus !== 'in_progress') {
          router.replace('/verify')
        }
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [userId, router])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B1220', paddingTop: 72 }}>
      <div className="max-w-md w-full mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: 'rgba(224,123,41,0.08)', border: '1px solid rgba(224,123,41,0.20)' }}>
          {status === 'approved'
            ? <ShieldCheck size={28} style={{ color: '#2EBD7A' }} strokeWidth={1.5} />
            : <Clock size={28} style={{ color: '#E07B29' }} strokeWidth={1.5} />
          }
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: FG1, letterSpacing: '-0.025em' }}>
          Documents Submitted
        </h1>
        <p className="text-sm mb-2" style={{ color: '#A6B0CC' }}>
          Didit is processing your verification. This page will redirect automatically when it&apos;s done.
        </p>
        <p className="text-xs" style={{ color: FG3 }}>
          Usually takes a few seconds to a few minutes. You&apos;ll also receive an email.
        </p>
        <div className="mt-8 flex items-center justify-center gap-1.5">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{
              background: '#E07B29', animationDelay: `${i * 0.15}s`,
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}
