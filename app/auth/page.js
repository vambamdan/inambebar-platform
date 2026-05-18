'use client'
import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { LogoStacked } from '@/components/Logo'
import { useLanguage } from '@/lib/LanguageContext'

const CARD_BG  = '#16203A'
const HAIRLINE = 'rgba(255,255,255,0.07)'
const FG2      = '#A6B0CC'
const FG3      = '#6E7A99'

function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab')
  const { t, isFa } = useLanguage()
  const fontStyle = isFa ? { fontFamily: "'Vazirmatn', sans-serif" } : {}

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
    <div className="w-full max-w-md" style={fontStyle}>
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <LogoStacked dark={true} markSize={64} nameSize={20} />
        </div>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {tab === 'signup' ? (t?.signUpDesc || 'Create your free account') : (t?.signInDesc || 'Welcome back')}
        </p>
      </div>

      <div className="rounded-2xl p-8" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}`, boxShadow: '0 24px 64px rgba(0,0,0,0.50)' }}>
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
                  defaultButtonBackground: 'rgba(255,255,255,0.04)',
                  defaultButtonBackgroundHover: 'rgba(255,255,255,0.08)',
                  defaultButtonBorder: HAIRLINE,
                  defaultButtonText: FG2,
                  dividerBackground: HAIRLINE,
                  inputBackground: '#0F1730',
                  inputBorder: HAIRLINE,
                  inputBorderHover: 'rgba(224,123,41,0.40)',
                  inputBorderFocus: 'rgba(224,123,41,0.60)',
                  inputText: '#F1F4FB',
                  inputLabelText: FG3,
                  inputPlaceholder: FG3,
                  messageText: FG2,
                  anchorTextColor: '#E07B29',
                  anchorTextHoverColor: '#C86A1A',
                },
                radii: {
                  borderRadiusButton: '10px',
                  inputBorderRadius: '10px',
                },
                space: {
                  inputPadding: '12px',
                  buttonPadding: '12px',
                },
              }
            },
            style: {
              button: { fontWeight: '600', fontSize: '15px', padding: '12px' },
              input: { fontSize: '14px', padding: '12px' },
              label: { fontWeight: '500', color: FG3 },
              container: { color: FG2 },
              message: { color: FG2 },
            }
          }}
          providers={['google']}
          view={tab === 'signup' ? 'sign_up' : 'sign_in'}
          redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/auth/callback`}
        />
      </div>

      <p className="text-center text-xs mt-6" style={{ color: 'rgba(255,255,255,0.25)' }}>
        {t?.authTerms || 'By continuing, you agree to our Terms of Service and Privacy Policy.'}
      </p>
    </div>
  )
}

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
         style={{ background: '#0B1220' }}>
      <Suspense fallback={
        <div className="text-sm" style={{ color: 'rgba(255,255,255,0.30)' }}>Loading…</div>
      }>
        <AuthForm />
      </Suspense>
    </div>
  )
}
