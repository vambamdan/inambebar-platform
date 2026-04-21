import Link from 'next/link'
import { Package, Instagram, Twitter, Linkedin } from 'lucide-react'

const NAV = [
  {
    heading: 'Platform',
    links: [
      { label: 'Find a Traveler', href: '/trips' },
      { label: 'Post a Shipment', href: '/requests' },
      { label: 'Travel Companion', href: '/companion' },
      { label: 'How It Works', href: '/#how-it-works' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { label: 'Sign Up', href: '/auth?tab=signup' },
      { label: 'Sign In', href: '/auth' },
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Verify Identity', href: '/verify' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
]

const SOCIALS = [
  { Icon: Instagram, href: '#', label: 'Instagram' },
  { Icon: Twitter,   href: '#', label: 'X / Twitter' },
  { Icon: Linkedin,  href: '#', label: 'LinkedIn' },
]

export default function Footer() {
  return (
    <footer style={{background: '#0F1A35', borderTop: '1px solid rgba(255,255,255,0.06)'}}>

      {/* Main grid */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand column */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                   style={{background: '#E07B29'}}>
                <Package size={18} color="white" strokeWidth={2.5} />
              </div>
              <div className="leading-tight">
                <div className="font-bold text-sm text-white">Inambebar</div>
                <div className="text-xs font-medium" style={{color: '#E07B29', fontFamily: "'Vazirmatn', sans-serif"}}>اینم ببر</div>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{color: 'rgba(255,255,255,0.45)'}}>
              Connecting trusted travelers with people who need to send packages home — safely and affordably.
            </p>
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                   className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                   style={{
                     background: 'rgba(255,255,255,0.07)',
                     border: '1px solid rgba(255,255,255,0.1)',
                   }}>
                  <Icon size={16} color="rgba(255,255,255,0.6)" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {NAV.map(col => (
            <div key={col.heading}>
              <div className="text-xs font-bold uppercase tracking-widest mb-4"
                   style={{color: 'rgba(255,255,255,0.3)'}}>
                {col.heading}
              </div>
              <ul className="space-y-3">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link href={link.href}
                      className="text-sm transition-colors hover:text-white"
                      style={{color: 'rgba(255,255,255,0.55)'}}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>
      </div>

      {/* Bottom bar */}
      <div style={{borderTop: '1px solid rgba(255,255,255,0.06)'}}>
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{color: 'rgba(255,255,255,0.3)'}}>
            © 2026 Inambebar. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {[['Privacy Policy', '/privacy'], ['Terms of Service', '/terms']].map(([label, href]) => (
              <Link key={label} href={href}
                className="text-xs transition-colors hover:text-white"
                style={{color: 'rgba(255,255,255,0.35)'}}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </footer>
  )
}
