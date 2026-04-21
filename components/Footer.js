'use client'
import Link from 'next/link'
import { Package, Instagram, Linkedin, Phone } from 'lucide-react'

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

function TelegramIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.085 14.4l-2.954-.924c-.642-.204-.657-.642.136-.953l11.57-4.461c.537-.194 1.006.131.725.186z"/>
    </svg>
  )
}

function DiscordIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.055 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  )
}

const SOCIALS = [
  { component: <Instagram size={16} color="rgba(255,255,255,0.6)" />, href: 'https://www.instagram.com/vambamdan/', label: 'Instagram' },
  { component: <Linkedin size={16} color="rgba(255,255,255,0.6)" />, href: 'https://www.linkedin.com/in/amirdaniyalmohammadi/', label: 'LinkedIn' },
  { component: <TelegramIcon size={16} color="rgba(255,255,255,0.6)" />, href: 'https://t.me/proffesor', label: 'Telegram' },
  { component: <DiscordIcon size={16} color="rgba(255,255,255,0.6)" />, href: 'https://discord.gg/DnVWSXdt', label: 'Discord' },
]

export default function Footer() {
  return (
    <footer style={{background: '#0F1A35', borderTop: '1px solid rgba(255,255,255,0.06)'}}>

      {/* Main grid */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand column */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                   style={{background: '#E07B29'}}>
                <Package size={18} color="white" strokeWidth={2.5} />
              </div>
              <div className="leading-tight">
                <div className="font-bold text-sm text-white">Inambebar</div>
                <div className="text-xs font-medium" style={{color: '#E07B29', fontFamily: "'Vazirmatn', sans-serif"}}>اینم ببر</div>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-5" style={{color: 'rgba(255,255,255,0.45)'}}>
              Connecting trusted travelers with people who need to send packages home — safely and affordably.
            </p>

            {/* Phone */}
            <a href="tel:+4915735800543"
               className="flex items-center gap-2 mb-5 text-sm transition-colors hover:text-white"
               style={{color: 'rgba(255,255,255,0.5)'}}>
              <Phone size={14} />
              +49 157 358 00543
            </a>

            {/* Social icons */}
            <div className="flex items-center gap-2.5">
              {SOCIALS.map(({ component, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                   className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                   style={{
                     background: 'rgba(255,255,255,0.07)',
                     border: '1px solid rgba(255,255,255,0.1)',
                   }}>
                  {component}
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
