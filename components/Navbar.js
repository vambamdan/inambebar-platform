'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'
import {
  LayoutDashboard, MessageSquare, User,
  ShieldCheck, LogOut, Menu, X,
} from 'lucide-react'
import { LogoHorizontal } from '@/components/Logo'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const router = useRouter()
  const { t, toggleLang, lang, isFa } = useLanguage()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    setDropdownOpen(false)
    await supabase.auth.signOut()
    router.push('/')
  }

  const fontStyle = isFa ? { fontFamily: "'Vazirmatn', sans-serif" } : {}
  const userInitial = user?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100/80"
      style={{
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 1px 0 rgba(0,0,0,0.06)',
        direction: 'ltr',
        ...fontStyle,
      }}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-6">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0 transition-opacity hover:opacity-80">
          <LogoHorizontal dark={false} markSize={36} />
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-5 flex-1">
          <Link href="/trips" className="nav-link text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors whitespace-nowrap">
            {t.findTravelers}
          </Link>
          <Link href="/requests" className="nav-link text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors whitespace-nowrap">
            {t.sendPackage}
          </Link>
          <Link href="/companion" className="nav-link text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors whitespace-nowrap">
            {t.travelCompanion}
          </Link>
        </div>

        {/* Right-side actions */}
        <div className="hidden md:flex items-center gap-3 ml-auto flex-shrink-0">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(o => !o)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #E07B29, #F5A04A)',
                  transition: 'transform 0.15s ease, box-shadow 0.2s ease',
                  boxShadow: dropdownOpen ? '0 0 0 3px rgba(224,123,41,0.25)' : '0 2px 8px rgba(224,123,41,0.3)',
                }}>
                {userInitial}
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 top-12 w-52 rounded-2xl py-1.5 z-50"
                  style={{
                    background: 'rgba(255,255,255,0.97)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(0,0,0,0.08)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                  }}>
                  <Link href="/dashboard" onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <LayoutDashboard size={15} className="text-gray-400" /> {t.dashboard}
                  </Link>
                  <Link href="/matches" onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <MessageSquare size={15} className="text-gray-400" /> {t.myMatches}
                  </Link>
                  <Link href={`/profile/${user?.id}`} onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <User size={15} className="text-gray-400" /> {t.myProfile}
                  </Link>
                  <Link href="/verify" onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold hover:bg-orange-50 transition-colors"
                    style={{color: '#E07B29'}}>
                    <ShieldCheck size={15} /> {t.getVerified}
                  </Link>
                  <div className="my-1 border-t border-gray-100" />
                  <button onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut size={15} /> {t.signOut}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth" className="nav-link text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors">
                {t.signIn}
              </Link>
              <Link href="/auth?tab=signup"
                className="btn-shimmer text-sm font-semibold px-4 py-2 rounded-lg text-white whitespace-nowrap"
                style={{background: '#1A2744'}}>
                {t.getStarted}
              </Link>
            </>
          )}

          {/* Language toggle */}
          <div className="pl-3 border-l border-gray-200">
            <button onClick={toggleLang}
              className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-amber-400 hover:text-amber-600 active:scale-95"
              style={{
                color: '#1A2744',
                minWidth: '36px',
                textAlign: 'center',
                transition: 'color 0.2s ease, border-color 0.2s ease, transform 0.15s ease',
              }}>
              {lang === 'fa' ? 'فا' : lang.toUpperCase()}
            </button>
          </div>
        </div>

        {/* Mobile: lang + hamburger */}
        <div className="md:hidden flex items-center gap-2 ml-auto">
          <button onClick={toggleLang}
            className="text-xs font-bold px-2 py-1 rounded border border-gray-200 active:scale-95"
            style={{minWidth: '32px', textAlign: 'center', transition: 'transform 0.15s ease'}}>
            {lang === 'fa' ? 'فا' : lang.toUpperCase()}
          </button>
          <button className="p-2 active:scale-95" style={{transition: 'transform 0.15s ease'}}
            onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} className="text-gray-600" /> : <Menu size={20} className="text-gray-600" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 px-4 py-4 flex flex-col gap-4"
             style={{background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', ...fontStyle}}>
          <Link href="/trips" className="text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>{t.findTravelers}</Link>
          <Link href="/requests" className="text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>{t.sendPackage}</Link>
          <Link href="/companion" className="text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>{t.travelCompanion}</Link>
          {user ? (
            <div className="border-t border-gray-100 pt-3 flex flex-col gap-3">
              <Link href="/dashboard" className="text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>{t.dashboard}</Link>
              <Link href="/matches" className="text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>{t.myMatches}</Link>
              <Link href={`/profile/${user?.id}`} className="text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>{t.myProfile}</Link>
              <Link href="/verify" className="text-sm font-medium" style={{color: '#E07B29'}} onClick={() => setMenuOpen(false)}>{t.getVerified}</Link>
              <button onClick={handleSignOut} className="text-sm font-semibold text-left text-red-500">{t.signOut}</button>
            </div>
          ) : (
            <>
              <Link href="/auth" className="text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>{t.signIn}</Link>
              <Link href="/auth?tab=signup"
                className="text-sm font-semibold text-white px-4 py-2 rounded-lg text-center"
                style={{background: '#1A2744'}} onClick={() => setMenuOpen(false)}>
                {t.getStarted}
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
