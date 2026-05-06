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
import NotificationBell from '@/components/NotificationBell'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [isVerified, setIsVerified] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const router = useRouter()
  const { t, toggleLang, lang, isFa } = useLanguage()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user)
      if (data.user) {
        const [profileRes, matchesRes] = await Promise.all([
          supabase.from('profiles').select('is_verified').eq('id', data.user.id).single(),
          supabase
            .from('matches')
            .select('id', { count: 'exact', head: true })
            .or(`traveler_id.eq.${data.user.id},sender_id.eq.${data.user.id}`)
            .in('status', ['pending', 'accepted', 'in_transit']),
        ])
        setIsVerified(profileRes.data?.is_verified ?? false)
        setPendingCount(matchesRes.count || 0)
      }
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) setIsVerified(false)
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
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(11,18,32,0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        height: 72,
        direction: 'ltr',
        ...fontStyle,
      }}
    >
      <div className="px-5 lg:px-8 h-full flex items-center gap-8 w-full">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0 transition-opacity hover:opacity-80">
          <LogoHorizontal dark={true} markSize={36} />
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6 flex-1">
          <Link href="/trips"
            className="nav-link text-sm font-medium transition-colors whitespace-nowrap"
            style={{ color: '#A6B0CC' }}
            onMouseEnter={e => e.target.style.color = '#F1F4FB'}
            onMouseLeave={e => e.target.style.color = '#A6B0CC'}>
            {t.findTravelers}
          </Link>
          <Link href="/requests"
            className="nav-link text-sm font-medium transition-colors whitespace-nowrap"
            style={{ color: '#A6B0CC' }}
            onMouseEnter={e => e.target.style.color = '#F1F4FB'}
            onMouseLeave={e => e.target.style.color = '#A6B0CC'}>
            {t.sendPackage}
          </Link>
          <Link href="/companion"
            className="nav-link text-sm font-medium transition-colors whitespace-nowrap"
            style={{ color: '#A6B0CC' }}
            onMouseEnter={e => e.target.style.color = '#F1F4FB'}
            onMouseLeave={e => e.target.style.color = '#A6B0CC'}>
            {t.travelCompanion}
          </Link>
          <Link href="/about"
            className="nav-link text-sm font-medium transition-colors whitespace-nowrap"
            style={{ color: '#A6B0CC' }}
            onMouseEnter={e => e.target.style.color = '#F1F4FB'}
            onMouseLeave={e => e.target.style.color = '#A6B0CC'}>
            {t.about || 'About'}
          </Link>
        </div>

        {/* Right-side actions */}
        <div className="hidden md:flex items-center gap-3 ml-auto flex-shrink-0">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(o => !o)}
                className="relative w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #E07B29, #F5A04A)',
                  transition: 'transform 0.15s ease, box-shadow 0.2s ease',
                  boxShadow: dropdownOpen ? '0 0 0 3px rgba(224,123,41,0.35)' : '0 2px 8px rgba(224,123,41,0.3)',
                }}>
                {userInitial}
                {pendingCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white flex items-center justify-center text-[9px] font-bold"
                    style={{ background: '#E07B29', border: '1.5px solid #0B1220' }}>
                    {pendingCount > 9 ? '9+' : pendingCount}
                  </span>
                )}
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 top-12 w-52 rounded-2xl py-1.5 z-50"
                  style={{
                    background: '#16203A',
                    border: '1px solid rgba(255,255,255,0.10)',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.50)',
                  }}>
                  <Link href="/dashboard" onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
                    style={{ color: '#A6B0CC' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#F1F4FB' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#A6B0CC' }}>
                    <LayoutDashboard size={15} style={{ color: '#6E7A99' }} /> {t.dashboard}
                  </Link>
                  <Link href="/matches" onClick={() => setDropdownOpen(false)}
                    className="flex items-center justify-between px-4 py-2.5 text-sm transition-colors"
                    style={{ color: '#A6B0CC' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#F1F4FB' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#A6B0CC' }}>
                    <span className="flex items-center gap-2.5">
                      <MessageSquare size={15} style={{ color: '#6E7A99' }} /> Conversations
                    </span>
                    {pendingCount > 0 && (
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded-full text-white min-w-[18px] text-center"
                        style={{ background: '#E07B29' }}>
                        {pendingCount}
                      </span>
                    )}
                  </Link>
                  <Link href={`/profile/${user?.id}`} onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
                    style={{ color: '#A6B0CC' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#F1F4FB' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#A6B0CC' }}>
                    <User size={15} style={{ color: '#6E7A99' }} /> {t.myProfile}
                  </Link>
                  {isVerified ? (
                    <div className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold"
                      style={{ color: '#2EBD7A' }}>
                      <ShieldCheck size={15} /> {t.verified || 'Verified'}
                    </div>
                  ) : (
                    <Link href="/verify" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold transition-colors"
                      style={{ color: '#E07B29' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(224,123,41,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <ShieldCheck size={15} /> {t.getVerified}
                    </Link>
                  )}
                  <div className="my-1" style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />
                  <button onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
                    style={{ color: '#E04B4B' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(224,75,75,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <LogOut size={15} /> {t.signOut}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth"
                className="text-sm font-medium transition-colors"
                style={{ color: '#A6B0CC' }}
                onMouseEnter={e => e.target.style.color = '#F1F4FB'}
                onMouseLeave={e => e.target.style.color = '#A6B0CC'}>
                {t.signIn}
              </Link>
              <Link href="/auth?tab=signup"
                className="btn-shimmer text-sm font-semibold px-4 py-2 rounded-lg text-white whitespace-nowrap"
                style={{ background: '#233355', border: '1px solid rgba(255,255,255,0.12)' }}>
                {t.getStarted}
              </Link>
            </>
          )}

          {user && <NotificationBell userId={user.id} />}

          {/* Language toggle */}
          <div className="pl-3" style={{ borderLeft: '1px solid rgba(255,255,255,0.10)' }}>
            <button onClick={toggleLang}
              className="text-xs font-bold px-2.5 py-1.5 rounded-lg active:scale-95"
              style={{
                color: '#A6B0CC',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.10)',
                minWidth: '36px',
                textAlign: 'center',
                transition: 'color 0.2s ease, border-color 0.2s ease, transform 0.15s ease',
              }}
              onMouseEnter={e => { e.target.style.color = '#F1F4FB'; e.target.style.borderColor = 'rgba(224,123,41,0.5)' }}
              onMouseLeave={e => { e.target.style.color = '#A6B0CC'; e.target.style.borderColor = 'rgba(255,255,255,0.10)' }}>
              {lang === 'fa' ? 'فا' : lang.toUpperCase()}
            </button>
          </div>
        </div>

        {/* Mobile: lang + hamburger */}
        <div className="md:hidden flex items-center gap-2 ml-auto">
          <button onClick={toggleLang}
            className="text-xs font-bold px-2 py-1 rounded active:scale-95"
            style={{
              minWidth: '32px', textAlign: 'center',
              color: '#A6B0CC', background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.10)',
              transition: 'transform 0.15s ease',
            }}>
            {lang === 'fa' ? 'فا' : lang.toUpperCase()}
          </button>
          <button className="p-2 active:scale-95" style={{ transition: 'transform 0.15s ease', color: '#A6B0CC' }}
            onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-6 py-5 flex flex-col gap-4"
          style={{
            background: 'rgba(11,18,32,0.97)',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            ...fontStyle,
          }}>
          <Link href="/trips" className="text-sm font-medium" style={{ color: '#A6B0CC' }} onClick={() => setMenuOpen(false)}>{t.findTravelers}</Link>
          <Link href="/requests" className="text-sm font-medium" style={{ color: '#A6B0CC' }} onClick={() => setMenuOpen(false)}>{t.sendPackage}</Link>
          <Link href="/companion" className="text-sm font-medium" style={{ color: '#A6B0CC' }} onClick={() => setMenuOpen(false)}>{t.travelCompanion}</Link>
          <Link href="/about" className="text-sm font-medium" style={{ color: '#A6B0CC' }} onClick={() => setMenuOpen(false)}>{t.about || 'About'}</Link>
          {user ? (
            <div className="pt-3 flex flex-col gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <Link href="/dashboard" className="text-sm font-medium" style={{ color: '#A6B0CC' }} onClick={() => setMenuOpen(false)}>{t.dashboard}</Link>
              <Link href="/matches" className="text-sm font-medium" style={{ color: '#A6B0CC' }} onClick={() => setMenuOpen(false)}>Conversations</Link>
              <Link href={`/profile/${user?.id}`} className="text-sm font-medium" style={{ color: '#A6B0CC' }} onClick={() => setMenuOpen(false)}>{t.myProfile}</Link>
              {isVerified ? (
                <span className="text-sm font-semibold" style={{ color: '#2EBD7A' }}>✓ {t.verified || 'Verified'}</span>
              ) : (
                <Link href="/verify" className="text-sm font-medium" style={{ color: '#E07B29' }} onClick={() => setMenuOpen(false)}>{t.getVerified}</Link>
              )}
              <button onClick={handleSignOut} className="text-sm font-semibold text-left" style={{ color: '#E04B4B' }}>{t.signOut}</button>
            </div>
          ) : (
            <>
              <Link href="/auth" className="text-sm font-medium" style={{ color: '#A6B0CC' }} onClick={() => setMenuOpen(false)}>{t.signIn}</Link>
              <Link href="/auth?tab=signup"
                className="text-sm font-semibold text-white px-4 py-2.5 rounded-lg text-center"
                style={{ background: '#E07B29' }} onClick={() => setMenuOpen(false)}>
                {t.getStarted}
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
