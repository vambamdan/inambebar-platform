'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xl"
               style={{background: '#E07B29'}}>📦</div>
          <div className="leading-tight">
            <div className="font-bold text-sm" style={{color: '#1A2744'}}>Inambebar</div>
            <div className="text-xs font-medium" style={{color: '#E07B29', fontFamily: 'sans-serif'}}>اینم ببر</div>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/trips" className="text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors">
            Find Travelers
          </Link>
          <Link href="/requests" className="text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors">
            Send a Package
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors">
                Dashboard
              </Link>
              <Link href="/matches" className="text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors">
                My Matches
              </Link>
              <Link href={`/profile/${user?.id}`} className="text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors">
                My Profile
              </Link>
              <button onClick={handleSignOut}
                className="text-sm font-semibold px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth" className="text-sm font-medium text-gray-600 hover:text-amber-600">Sign In</Link>
              <Link href="/auth?tab=signup"
                className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-colors"
                style={{background: '#1A2744'}}>
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
          <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
          <div className="w-5 h-0.5 bg-gray-600"></div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4">
          <Link href="/trips" className="text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>Find Travelers</Link>
          <Link href="/requests" className="text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>Send a Package</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button onClick={handleSignOut} className="text-sm font-semibold text-left text-red-500">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/auth" className="text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link href="/auth?tab=signup" className="text-sm font-semibold text-white px-4 py-2 rounded-lg text-center"
                style={{background: '#1A2744'}} onClick={() => setMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
