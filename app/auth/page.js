'use client'
import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.push('/dashboard')
    })
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') router.push('/dashboard')
    })
    return () => listener.subscription.unsubscribe()
  }, [router])

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
               style={{background: '#E07B29'}}>📦</div>
          <div className="text-left">
            <div className="font-black text-xl text-white">Inambebar</div>
            <div className="text-sm font-medium" style={{color: '#F5A04A'}}>اینم ببر</div>
          </div>
        </div>
        <p className="text-white/50 text-sm">
          {tab === 'signup' ? 'Create your free account' : 'Welcome back'}
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-2xl">
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#E07B29',
                  brandAccent: '#C86A1A',
                  brandButtonText: 'white',
                },
                radii: {
                  borderRadiusButton: '10px',
                  inputBorderRadius: '10px',
                }
              }
            },
            style: {
              button: { fontWeight: '600', fontSize: '15px', padding: '12px' },
              input: { fontSize: '14px', padding: '12px' },
              label: { fontWeight: '500', color: '#1A2744' },
            }
          }}
          providers={['google']}
          view={tab === 'signup' ? 'sign_up' : 'sign_in'}
          redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/auth/callback`}
        />
      </div>

      <p className="text-center text-white/30 text-xs mt-6">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  )
}

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
         style={{background: '#1A2744'}}>
      <Suspense fallback={
        <div className="text-white/40 text-sm">Loading...</div>
      }>
        <AuthForm />
      </Suspense>
    </div>
  )
}
