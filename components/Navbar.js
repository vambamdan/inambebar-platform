'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const { t, toggleLang, lang, isFa } = useLanguage()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const fontStyle = isFa ? { fontFamily: "'Vazirmatn', sans-serif" } : {}

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm" style={fontStyle}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xl"
               style={{background: '#E07B29'}}>📦</div>
          <div className="leading-tight">
            <div className="font-bold text-sm" style={{color: '#1A2744'}}>Inambebar</div>
            <div className="text-xs font-medium" style={{color: '#E07B29', fontFamily: "'Vazirmatn', sans-serif"}}>اینم ببر</div>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-5">
          <Link href="/trips" className="text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors">
            {t.findTravelers}
          </Link>
          <Link href="/requests" className="text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors">
            {t.sendPackage}
          </Link>
          <Link href="/companion" className="text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors">
            {t.travelCompanion}
          </Link>

          {user ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors">
                {t.dashboard}
              </Link>
              <Link href="/matches" className="text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors">
                {t.myMatches}
              </Link>
              <Link href={`/profile/${user?.id}`} className="text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors">
                {t.myProfile}
              </Link>
              <Link href="/verify" className="text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors"
                style={{background:'rgba(224,123,41,0.1)', color:'#E07B29'}}>
                {t.getVerified}
              </Link>
              <button onClick={handleSignOut}
                className="text-sm font-semibold px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                {t.signOut}
              </button>
            </>
          ) : (
            <>
              <Link href="/auth" className="text-sm font-medium text-gray-600 hover:text-amber-600">{t.signIn}</Link>
              <Link href="/auth?tab=signup"
                className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-colors"
                style={{background: '#1A2744'}}>
                {t.getStarted}
              </Link>
            </>
          )}

          {/* Language Toggle — far right */}
          <button
            onClick={toggleLang}
            className="text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200 hover:border-amber-400 transition-colors"
            style={{color: '#1A2744', fontFamily: lang === 'en' ? "'Vazirmatn', sans-serif" : 'inherit'}}>
            {lang === 'en' ? 'فارسی' : 'English'}
          </button>
        </div>

        {/* Mobile: lang toggle + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={toggleLang}
            className="text-xs font-bold px-2 py-1 rounded border border-gray-200"
            style={{fontFamily: lang === 'en' ? "'Vazirmatn', sans-serif" : 'inherit'}}>
            {lang === 'en' ? 'فا' : 'EN'}
          </button>
          <button className="p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
            <div className="w-5 h-0.5 bg-gray-600"></div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4" style={fontStyle}>
          <Link href="/trips" className="text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>{t.findTravelers}</Link>
          <Link href="/requests" className="text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>{t.sendPackage}</Link>
          <Link href="/companion" className="text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>{t.travelCompanion}</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>{t.dashboard}</Link>
              <Link href="/matches" className="text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>{t.myMatches}</Link>
              <Link href={`/profile/${user?.id}`} className="text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>{t.myProfile}</Link>
              <Link href="/verify" className="text-sm font-medium" style={{color:'#E07B29'}} onClick={() => setMenuOpen(false)}>{t.getVerified}</Link>
              <button onClick={handleSignOut} className="text-sm font-semibold text-left text-red-500">{t.signOut}</button>
            </>
          ) : (
            <>
              <Link href="/auth" className="text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>{t.signIn}</Link>
              <Link href="/auth?tab=signup" className="text-sm font-semibold text-white px-4 py-2 rounded-lg text-center"
                style={{background: '#1A2744'}} onClick={() => setMenuOpen(false)}>{t.getStarted}</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
