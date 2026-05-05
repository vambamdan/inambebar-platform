'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/lib/LanguageContext'
import { Search, MessageSquare, CheckCircle, Lock, ArrowRight, Plane, Package, Users, Shield } from 'lucide-react'

const STEPS = [
  { Icon: Search,        titleKey: 'step1Title', descKey: 'step1Desc' },
  { Icon: MessageSquare, titleKey: 'step2Title', descKey: 'step2Desc' },
  { Icon: CheckCircle,   titleKey: 'step3Title', descKey: 'step3Desc' },
]

const ROUTES = [
  { from: 'Tehran', to: 'Toronto', code: 'IKA→YYZ' },
  { from: 'Tehran', to: 'Frankfurt', code: 'IKA→FRA' },
  { from: 'Tehran', to: 'London', code: 'IKA→LHR' },
  { from: 'Tehran', to: 'Dubai', code: 'IKA→DXB' },
  { from: 'Tehran', to: 'Stockholm', code: 'IKA→ARN' },
  { from: 'Tehran', to: 'Amsterdam', code: 'IKA→AMS' },
  { from: 'Tehran', to: 'Paris', code: 'IKA→CDG' },
  { from: 'Tehran', to: 'Istanbul', code: 'IKA→IST' },
]

export default function Home() {
  const { t, isFa } = useLanguage()
  const fontStyle = isFa ? { fontFamily: "'Vazirmatn', sans-serif" } : {}

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

        <div className="max-w-7xl mx-auto px-8 py-16 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* LEFT — Copy */}
            <div className={`text-center ${isFa ? 'md:text-right' : 'md:text-left'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 animate-fade-up"
                style={{ background: 'rgba(224,123,41,0.12)', color: '#F5B380', border: '1px solid rgba(224,123,41,0.28)' }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#E07B29' }} />
                {t.earlyMembers}
              </div>

              <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight animate-fade-up delay-1"
                style={{ color: '#F1F4FB', letterSpacing: '-0.025em' }}>
                {t.heroTitle1}<br />
                <span style={{
                  background: 'linear-gradient(90deg, #E07B29, #F5A04A)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  {t.heroTitle2}
                </span>
              </h1>

              <p className="text-xl mb-4 animate-fade-up delay-2"
                style={{ color: 'rgba(166,176,204,0.8)', fontFamily: isFa ? 'inherit' : "'Vazirmatn', sans-serif" }}>
                {t.heroSubFa}
              </p>

              <p className="text-lg mb-10 leading-relaxed animate-fade-up delay-2"
                style={{ color: '#6E7A99' }}>
                {t.heroDesc}
              </p>

              <div className={`flex flex-col sm:flex-row gap-3 mb-10 animate-fade-up delay-3 ${isFa ? 'justify-center md:justify-end' : 'justify-center md:justify-start'}`}>
                <Link href="/trips"
                  className="btn-primary px-7 py-3.5 rounded-xl text-white font-semibold text-sm text-center flex items-center justify-center gap-2"
                  style={{ background: '#E07B29', letterSpacing: '-0.005em' }}>
                  {t.findTravelerBtn} <ArrowRight size={15} />
                </Link>
                <Link href="/requests"
                  className="btn-secondary px-7 py-3.5 rounded-xl font-semibold text-sm text-center"
                  style={{ background: 'rgba(255,255,255,0.08)', color: '#F1F4FB', border: '1px solid rgba(255,255,255,0.12)' }}>
                  {t.postShipmentBtn}
                </Link>
              </div>
            </div>

            {/* RIGHT — Floating cards */}
            <div className="hidden md:flex flex-col items-end gap-4 animate-fade-up delay-3" dir="ltr">

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold self-end"
                style={{ background: 'rgba(46,189,122,0.10)', color: '#56CD93', border: '1px solid rgba(46,189,122,0.20)' }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#2EBD7A' }} />
                {t.newMatchFound}
              </div>

              {/* Card 1 */}
              <div className="animate-float w-full max-w-xs rounded-2xl p-5"
                style={{ background: '#16203A', border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 16px 40px rgba(0,0,0,0.40)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-bold flex items-center gap-2" style={{ color: '#F1F4FB' }}>
                    <span>IKA</span>
                    <ArrowRight size={12} style={{ color: '#6E7A99' }} />
                    <span>YYZ</span>
                    <span className="ml-1 text-xs font-normal" style={{ color: '#6E7A99' }}>Tehran → Toronto</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: 'rgba(46,189,122,0.12)', color: '#56CD93' }}>Verified</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-lg text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #1A2744, #2E4068)' }}>A</div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: '#F1F4FB' }}>Ali H.</div>
                    <div className="text-xs" style={{ color: '#6E7A99' }}>4.9 · 23 trips</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="text-xs mb-1" style={{ color: '#6E7A99' }}>Departs</div>
                    <div className="text-sm font-semibold" style={{ color: '#F1F4FB' }}>May 3</div>
                  </div>
                  <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="text-xs mb-1" style={{ color: '#6E7A99' }}>Available</div>
                    <div className="text-sm font-semibold" style={{ color: '#F1F4FB' }}>8 kg · $6/kg</div>
                  </div>
                </div>
                <Link href="/trips"
                  className="btn-primary block w-full py-2.5 rounded-xl text-sm font-semibold text-white text-center"
                  style={{ background: '#E07B29' }}>
                  {t.contactTraveler}
                </Link>
              </div>

              {/* Card 2: Chat */}
              <div className="animate-float-2 w-full max-w-xs rounded-2xl p-4"
                style={{ background: '#16203A', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 12px 32px rgba(0,0,0,0.30)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare size={13} style={{ color: '#A6B0CC' }} />
                    <span className="text-xs font-bold" style={{ color: '#F1F4FB' }}>{t.chatLabel}</span>
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
                      style={{ background: 'rgba(255,255,255,0.08)', color: '#F1F4FB', maxWidth: '80%' }}>
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

              {/* Card 3: Delivery */}
              <div className="animate-float-3 w-full max-w-[280px] rounded-2xl p-4"
                style={{ background: '#16203A', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 12px 32px rgba(0,0,0,0.30)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(46,189,122,0.12)' }}>
                    <CheckCircle size={18} style={{ color: '#2EBD7A' }} />
                  </div>
                  <div>
                    <div className="text-xs font-bold" style={{ color: '#F1F4FB' }}>{t.packageDelivered}</div>
                    <div className="text-xs" style={{ color: '#6E7A99' }}>$42 → Ali H.</div>
                  </div>
                </div>
                <div className="h-1.5 rounded-full mb-1.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full w-full rounded-full" style={{ background: 'linear-gradient(90deg, #2EBD7A, #56CD93)' }} />
                </div>
                <div className="flex justify-between">
                  <span className="text-xs" style={{ color: '#6E7A99' }}>Escrow</span>
                  <span className="text-xs font-semibold" style={{ color: '#2EBD7A' }}>{t.escrowReleased}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-3 right-4 pointer-events-none"
          style={{ color: 'rgba(255,255,255,0.20)', fontSize: '10px', letterSpacing: '0.03em' }}>
          Photo: Hasan Almasi / Unsplash
        </div>
      </div>

      {/* ── POPULAR ROUTES RAIL ───────────────────────────────── */}
      <div style={{ background: '#0B1220', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center gap-3 py-5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            <span className="text-xs font-semibold flex-shrink-0 mr-2" style={{ color: '#6E7A99', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Routes</span>
            {ROUTES.map((r, i) => (
              <Link key={i} href={`/trips?from=${r.from}&to=${r.to}`}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#A6B0CC' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(224,123,41,0.08)'; e.currentTarget.style.borderColor = 'rgba(224,123,41,0.30)'; e.currentTarget.style.color = '#F5B380' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#A6B0CC' }}>
                <Plane size={12} />
                {r.from} → {r.to}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <div className="py-24" style={{ background: '#0B1220' }}>
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#E07B29' }}>How it works</p>
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#F1F4FB', letterSpacing: '-0.025em' }}>{t.howItWorks}</h2>
            <p style={{ color: '#6E7A99', fontSize: 15 }}>{t.howItWorksDesc}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {STEPS.map(({ Icon, titleKey, descKey }, i) => (
              <div key={i}
                className="card-hover rounded-2xl p-7 cursor-default"
                style={{ background: '#16203A', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm mb-5"
                  style={{ background: 'rgba(224,123,41,0.12)', color: '#E07B29', border: '1px solid rgba(224,123,41,0.20)' }}>
                  {i + 1}
                </div>
                <div className="mb-3">
                  <Icon size={24} strokeWidth={1.6} style={{ color: '#A6B0CC' }} />
                </div>
                <h3 className="font-semibold text-base mb-2" style={{ color: '#F1F4FB', letterSpacing: '-0.015em' }}>{t[titleKey]}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6E7A99' }}>{t[descKey]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES STRIP ───────────────────────────────────── */}
      <div style={{ background: '#111A2E', borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-7xl mx-auto px-8 py-14">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { Icon: Plane, title: isFa ? 'یافتن مسافر' : 'Find a Traveler', desc: isFa ? 'مسافرانی را پیدا کنید که پروازهای تهران-دیاسپورا دارند و فضای بار خالی دارند.' : 'Browse travelers flying Tehran–diaspora routes with spare luggage space.' },
              { Icon: Package, title: isFa ? 'ارسال بسته' : 'Send a Package', desc: isFa ? 'درخواست ارسال بسته پست کنید و با مسافر مناسب هماهنگ کنید.' : 'Post a package request and coordinate with a traveler headed your way.' },
              { Icon: Users, title: isFa ? 'همراه سفر' : 'Travel Companion', desc: isFa ? 'کمک در فرودگاه برای سالمندان و مسافران تنها.' : 'Airport assistance for elderly or solo travelers needing a companion.' },
            ].map(({ Icon, title, desc }, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(224,123,41,0.08)', border: '1px solid rgba(224,123,41,0.15)' }}>
                  <Icon size={20} style={{ color: '#E07B29' }} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: '#F1F4FB' }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6E7A99' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TRUST STRIP ──────────────────────────────────────── */}
      <div className="py-10" style={{ background: '#0B1220' }}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { label: 'Government ID verified', color: '#2EBD7A' },
              { label: 'Funds held in escrow', color: '#2EBD7A' },
              { label: 'In-app coordination', color: '#2EBD7A' },
              { label: 'Dispute resolution', color: '#2EBD7A' },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-2 text-sm" style={{ color: '#A6B0CC' }}>
                <Shield size={14} style={{ color }} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <div className="py-20 text-center relative overflow-hidden"
        style={{ background: '#111A2E', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(224,123,41,0.07) 0%, transparent 55%), radial-gradient(circle at 80% 50%, rgba(224,123,41,0.04) 0%, transparent 55%)' }} />
        <div className="relative max-w-2xl mx-auto px-8">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#E07B29' }}>Join Inambebar</p>
          <h2 className="text-3xl font-bold mb-3" style={{ color: '#F1F4FB', letterSpacing: '-0.025em' }}>{t.readyToStart}</h2>
          <p className="mb-8 text-base" style={{ color: '#6E7A99' }}>{t.joinFree}</p>
          <Link href="/auth?tab=signup"
            className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm text-white"
            style={{ background: '#E07B29' }}>
            {t.createAccount} <ArrowRight size={15} />
          </Link>
        </div>
      </div>

    </div>
  )
}
