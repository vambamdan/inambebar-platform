'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/lib/LanguageContext'
import {
  Search, MessageSquare, CheckCircle, Lock, ArrowRight,
  Plane, Package, Users, Shield, ShieldCheck, DollarSign,
} from 'lucide-react'

const HAIRLINE = 'rgba(255,255,255,0.07)'
const FG1      = '#F1F4FB'
const FG2      = '#A6B0CC'
const FG3      = '#6E7A99'

const ROUTES = [
  { from: 'Tehran', to: 'Toronto',   code: 'IKA→YYZ' },
  { from: 'Tehran', to: 'Frankfurt', code: 'IKA→FRA' },
  { from: 'Tehran', to: 'London',    code: 'IKA→LHR' },
  { from: 'Tehran', to: 'Dubai',     code: 'IKA→DXB' },
  { from: 'Tehran', to: 'Stockholm', code: 'IKA→ARN' },
  { from: 'Tehran', to: 'Amsterdam', code: 'IKA→AMS' },
  { from: 'Tehran', to: 'Paris',     code: 'IKA→CDG' },
  { from: 'Tehran', to: 'Istanbul',  code: 'IKA→IST' },
]

const ROLE_STEPS = {
  sender: [
    {
      Icon: Package,
      title: 'Post your package',
      desc: 'Describe your item, route, weight, and when it needs to arrive. Senders browsing your request can reach out.',
    },
    {
      Icon: MessageSquare,
      title: 'Chat in-platform',
      desc: 'Agree on price and details entirely inside Inambebar. Every message is logged for your protection.',
    },
    {
      Icon: CheckCircle,
      title: 'Confirm delivery',
      desc: 'Pay into secure escrow. Funds are released only when your recipient confirms the handoff.',
    },
  ],
  traveler: [
    {
      Icon: Plane,
      title: 'Post your trip',
      desc: 'Add your route, departure date, and how many kg of luggage space you have available.',
    },
    {
      Icon: Search,
      title: 'Accept a request',
      desc: 'Browse package requests along your route. Accept the ones that fit your schedule and capacity.',
    },
    {
      Icon: DollarSign,
      title: 'Deliver & get paid',
      desc: 'Hand over the package. Both parties confirm delivery and your payment is released instantly.',
    },
  ],
}

const WHY = [
  {
    Icon: ShieldCheck,
    color: '#2EBD7A',
    bg: 'rgba(46,189,122,0.08)',
    border: 'rgba(46,189,122,0.18)',
    title: 'Government ID verified',
    desc: 'Every user goes through biometric identity verification via Didit before sending or carrying anything.',
  },
  {
    Icon: Lock,
    color: '#A78BF8',
    bg: 'rgba(167,139,248,0.08)',
    border: 'rgba(167,139,248,0.18)',
    title: 'Escrow protection',
    desc: 'Funds are held until delivery is confirmed by the recipient. No delivery, no payment — simple.',
  },
  {
    Icon: MessageSquare,
    color: '#E07B29',
    bg: 'rgba(224,123,41,0.08)',
    border: 'rgba(224,123,41,0.18)',
    title: 'All coordination in-app',
    desc: 'Every message, agreement, and photo is logged inside Inambebar for dispute resolution.',
  },
  {
    Icon: Users,
    color: '#56CD93',
    bg: 'rgba(86,205,147,0.08)',
    border: 'rgba(86,205,147,0.18)',
    title: 'Built for the diaspora',
    desc: 'Designed specifically for Tehran–Europe, Tehran–Canada, and other diaspora routes. EN, FA, TR supported.',
  },
]

export default function Home() {
  const { t, isFa } = useLanguage()
  const fontStyle = isFa ? { fontFamily: "'Vazirmatn', sans-serif" } : {}
  const [role, setRole] = useState('sender')
  const steps = ROLE_STEPS[role]

  return (
    <div className="min-h-screen" style={{ background: '#0B1220', ...fontStyle }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden flex items-center"
        style={{ minHeight: 'calc(100vh - 72px)', marginTop: 72, background: '#0F1A35' }}>

        <Image
          src="/persepolis.jpg"
          alt="Persepolis, Iran"
          fill priority quality={80} sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center right', pointerEvents: 'none' }}
        />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #0B1220 0%, #0B1220 25%, rgba(11,18,32,0.85) 55%, rgba(11,18,32,0.35) 80%, rgba(11,18,32,0.1) 100%)' }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 72% 55%, rgba(224,123,41,0.10) 0%, transparent 45%)' }} />

        <div className="px-6 lg:px-12 py-16 w-full" style={{ position: 'relative', zIndex: 1 }}>
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-screen-2xl mx-auto">

            {/* LEFT */}
            <div className={`text-center ${isFa ? 'md:text-right' : 'md:text-left'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8"
                style={{ background: 'rgba(224,123,41,0.12)', color: '#F5B380', border: '1px solid rgba(224,123,41,0.28)' }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#E07B29' }} />
                {t.earlyMembers}
              </div>

              <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight"
                style={{ color: FG1, letterSpacing: '-0.025em' }}>
                {t.heroTitle1}<br />
                <span style={{
                  background: 'linear-gradient(90deg, #E07B29, #F5A04A)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  {t.heroTitle2}
                </span>
              </h1>

              <p className="text-xl mb-4"
                style={{ color: 'rgba(166,176,204,0.8)', fontFamily: isFa ? 'inherit' : "'Vazirmatn', sans-serif" }}>
                {t.heroSubFa}
              </p>

              <p className="text-lg mb-10 leading-relaxed" style={{ color: FG3 }}>
                {t.heroDesc}
              </p>

              <div className={`flex flex-col sm:flex-row gap-3 mb-10 ${isFa ? 'justify-center md:justify-end' : 'justify-center md:justify-start'}`}>
                <Link href="/trips"
                  className="px-7 py-3.5 rounded-xl text-white font-semibold text-sm text-center flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                  style={{ background: '#E07B29', letterSpacing: '-0.005em' }}>
                  {t.findTravelerBtn} <ArrowRight size={15} />
                </Link>
                <Link href="/requests"
                  className="px-7 py-3.5 rounded-xl font-semibold text-sm text-center transition-colors"
                  style={{ background: 'rgba(255,255,255,0.08)', color: FG1, border: '1px solid rgba(255,255,255,0.12)' }}>
                  {t.postShipmentBtn}
                </Link>
              </div>
            </div>

            {/* RIGHT — Floating cards */}
            <div className="hidden md:flex flex-col items-end gap-4" dir="ltr">

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold self-end"
                style={{ background: 'rgba(46,189,122,0.10)', color: '#56CD93', border: '1px solid rgba(46,189,122,0.20)' }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#2EBD7A' }} />
                {t.newMatchFound}
              </div>

              {/* Trip card */}
              <div className="animate-float w-full max-w-xs rounded-2xl p-5"
                style={{ background: '#16203A', border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 16px 40px rgba(0,0,0,0.40)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-bold flex items-center gap-2" style={{ color: FG1 }}>
                    <span>IKA</span>
                    <ArrowRight size={12} style={{ color: FG3 }} />
                    <span>YYZ</span>
                    <span className="ml-1 text-xs font-normal" style={{ color: FG3 }}>Tehran → Toronto</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: 'rgba(46,189,122,0.12)', color: '#56CD93' }}>Verified</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-lg text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #1A2744, #2E4068)' }}>A</div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: FG1 }}>Ali H.</div>
                    <div className="text-xs" style={{ color: FG3 }}>4.9 · 23 trips</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="text-xs mb-1" style={{ color: FG3 }}>Departs</div>
                    <div className="text-sm font-semibold" style={{ color: FG1 }}>May 3</div>
                  </div>
                  <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="text-xs mb-1" style={{ color: FG3 }}>Available</div>
                    <div className="text-sm font-semibold" style={{ color: FG1 }}>8 kg · $6/kg</div>
                  </div>
                </div>
                <Link href="/trips"
                  className="block w-full py-2.5 rounded-xl text-sm font-semibold text-white text-center transition-opacity hover:opacity-90"
                  style={{ background: '#E07B29' }}>
                  {t.contactTraveler}
                </Link>
              </div>

              {/* Chat card */}
              <div className="animate-float-2 w-full max-w-xs rounded-2xl p-4"
                style={{ background: '#16203A', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 12px 32px rgba(0,0,0,0.30)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare size={13} style={{ color: FG2 }} />
                    <span className="text-xs font-bold" style={{ color: FG1 }}>{t.chatLabel}</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: 'rgba(46,189,122,0.10)', color: '#56CD93' }}>
                    <Lock size={10} /> {t.chatEncrypted}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-end">
                    <div className="text-xs px-3 py-2 rounded-xl rounded-br-sm"
                      style={{ background: '#E07B29', color: 'white', maxWidth: '85%' }}>
                      {t.chatMsg1}
                    </div>
                  </div>
                  <div className="flex justify-start items-end gap-1.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #1A2744, #2E4068)' }}>A</div>
                    <div className="text-xs px-3 py-2 rounded-xl rounded-bl-sm"
                      style={{ background: 'rgba(255,255,255,0.08)', color: FG1, maxWidth: '80%' }}>
                      {t.chatMsg2}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="text-xs px-3 py-2 rounded-xl rounded-br-sm"
                      style={{ background: '#E07B29', color: 'white', maxWidth: '85%' }}>
                      {t.chatMsg3}
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery card */}
              <div className="animate-float-3 w-full max-w-[280px] rounded-2xl p-4"
                style={{ background: '#16203A', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 12px 32px rgba(0,0,0,0.30)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(46,189,122,0.12)' }}>
                    <CheckCircle size={18} style={{ color: '#2EBD7A' }} />
                  </div>
                  <div>
                    <div className="text-xs font-bold" style={{ color: FG1 }}>{t.packageDelivered}</div>
                    <div className="text-xs" style={{ color: FG3 }}>$42 → Ali H.</div>
                  </div>
                </div>
                <div className="h-1.5 rounded-full mb-1.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full w-full rounded-full" style={{ background: 'linear-gradient(90deg, #2EBD7A, #56CD93)' }} />
                </div>
                <div className="flex justify-between">
                  <span className="text-xs" style={{ color: FG3 }}>Escrow</span>
                  <span className="text-xs font-semibold" style={{ color: '#2EBD7A' }}>{t.escrowReleased}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-3 right-4 pointer-events-none"
          style={{ color: 'rgba(255,255,255,0.20)', fontSize: '10px', letterSpacing: '0.03em', zIndex: 2 }}>
          Photo: Hasan Almasi / Unsplash
        </div>
      </div>

      {/* ── POPULAR ROUTES RAIL ───────────────────────────────── */}
      <div style={{ background: '#0B1220', borderBottom: `1px solid ${HAIRLINE}` }}>
        <div className="px-6 lg:px-12">
          <div className="flex items-center gap-3 py-5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            <span className="text-xs font-semibold flex-shrink-0 mr-2"
              style={{ color: FG3, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Routes</span>
            {ROUTES.map((r, i) => (
              <Link key={i} href={`/trips?from=${r.from}&to=${r.to}`}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(255,255,255,0.08)`, color: FG2 }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(224,123,41,0.08)'; e.currentTarget.style.borderColor = 'rgba(224,123,41,0.30)'; e.currentTarget.style.color = '#F5B380' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = FG2 }}>
                <Plane size={12} />
                {r.from} → {r.to}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS — tabbed ─────────────────────────────── */}
      <div className="py-24" style={{ background: '#0B1220' }}>
        <div className="px-6 lg:px-12 max-w-screen-xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#E07B29' }}>How it works</p>
            <h2 className="text-3xl font-bold mb-3" style={{ color: FG1, letterSpacing: '-0.025em' }}>{t.howItWorks}</h2>
            <p style={{ color: FG3, fontSize: 15 }}>Three steps, whether you&apos;re sending or carrying.</p>
          </div>

          {/* Role toggle */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex p-1 rounded-2xl gap-1"
              style={{ background: '#111A2E', border: `1px solid ${HAIRLINE}` }}>
              {[
                { key: 'sender',   label: '📦  I\'m sending a package' },
                { key: 'traveler', label: '✈️  I\'m a traveler' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setRole(key)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={role === key
                    ? { background: '#E07B29', color: 'white', boxShadow: '0 4px 12px rgba(224,123,41,0.30)' }
                    : { color: FG3, background: 'transparent' }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-5">
            {steps.map(({ Icon, title, desc }, i) => (
              <div key={`${role}-${i}`}
                className="rounded-2xl p-7 transition-all"
                style={{ background: '#16203A', border: `1px solid ${HAIRLINE}` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm mb-5"
                  style={{ background: 'rgba(224,123,41,0.12)', color: '#E07B29', border: '1px solid rgba(224,123,41,0.20)' }}>
                  {i + 1}
                </div>
                <div className="mb-3">
                  <Icon size={24} strokeWidth={1.6} style={{ color: FG2 }} />
                </div>
                <h3 className="font-semibold text-base mb-2" style={{ color: FG1, letterSpacing: '-0.015em' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: FG3 }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* Role-specific CTA */}
          <div className="flex justify-center mt-8">
            <Link
              href={role === 'sender' ? '/trips' : '/trips/new'}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: '#E07B29' }}>
              {role === 'sender' ? 'Find a traveler now' : 'Post your trip'} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── WHY INAMBEBAR ─────────────────────────────────────── */}
      <div style={{ background: '#111A2E', borderTop: `1px solid ${HAIRLINE}`, borderBottom: `1px solid ${HAIRLINE}` }}>
        <div className="px-6 lg:px-12 py-20 max-w-screen-xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#E07B29' }}>Why Inambebar</p>
            <h2 className="text-2xl font-bold" style={{ color: FG1, letterSpacing: '-0.025em' }}>Built differently. Built for trust.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY.map(({ Icon, color, bg, border, title, desc }) => (
              <div key={title} className="rounded-2xl p-6"
                style={{ background: '#16203A', border: `1px solid ${HAIRLINE}` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: bg, border: `1px solid ${border}` }}>
                  <Icon size={18} style={{ color }} strokeWidth={1.6} />
                </div>
                <h3 className="font-semibold text-sm mb-2" style={{ color: FG1 }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: FG3 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <div className="py-24 text-center relative overflow-hidden"
        style={{ background: '#111A2E', borderTop: `1px solid ${HAIRLINE}` }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(224,123,41,0.07) 0%, transparent 55%), radial-gradient(circle at 80% 50%, rgba(224,123,41,0.04) 0%, transparent 55%)' }} />
        <div className="relative px-6 lg:px-12 max-w-2xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#E07B29' }}>Join Inambebar</p>
          <h2 className="text-3xl font-bold mb-3" style={{ color: FG1, letterSpacing: '-0.025em' }}>{t.readyToStart}</h2>
          <p className="mb-8 text-base" style={{ color: FG3 }}>{t.joinFree}</p>
          <Link href="/auth?tab=signup"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90"
            style={{ background: '#E07B29' }}>
            {t.createAccount} <ArrowRight size={15} />
          </Link>
        </div>
      </div>

    </div>
  )
}
