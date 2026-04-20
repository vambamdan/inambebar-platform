'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

const STEPS = [
  { icon: '🔍', titleKey: 'step1Title', descKey: 'step1Desc' },
  { icon: '💬', titleKey: 'step2Title', descKey: 'step2Desc' },
  { icon: '✅', titleKey: 'step3Title', descKey: 'step3Desc' },
]

export default function Home() {
  const { t, isFa } = useLanguage()
  const vasFont = { fontFamily: "'Vazirmatn', sans-serif" }

  return (
    <div className="min-h-screen" style={isFa ? vasFont : {}}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden"
           style={{background: 'linear-gradient(135deg, #0F1A35 0%, #1A2744 50%, #1D2B4F 100%)'}}>

        {/* Ambient glow orbs */}
        <div className="absolute top-16 left-1/4 w-96 h-96 rounded-full pointer-events-none"
             style={{background: 'radial-gradient(circle, rgba(224,123,41,0.18) 0%, transparent 70%)', filter: 'blur(60px)'}} />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 rounded-full pointer-events-none"
             style={{background: 'radial-gradient(circle, rgba(245,160,74,0.1) 0%, transparent 70%)', filter: 'blur(40px)'}} />

        <div className="max-w-6xl mx-auto px-4 py-24 md:py-32">
          <div className={`grid md:grid-cols-2 items-center ${isFa ? 'gap-20' : 'gap-12'}`}>

            {/* LEFT — Copy (becomes RIGHT in RTL via grid flip) */}
            <div className={`text-center ${isFa ? 'md:text-right' : 'md:text-left'}`}>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 animate-fade-up"
                   style={{
                     background: 'rgba(224,123,41,0.15)',
                     color: '#F5A04A',
                     border: '1px solid rgba(224,123,41,0.35)',
                     boxShadow: '0 0 20px rgba(224,123,41,0.15)',
                   }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{background: '#F5A04A'}} />
                {t.earlyMembers}
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight tracking-tight animate-fade-up delay-1">
                {t.heroTitle1}<br />
                <span style={{
                  background: 'linear-gradient(90deg, #E07B29, #F5A04A)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  {t.heroTitle2}
                </span>
              </h1>

              {/* Bilingual sub-line */}
              <p className="text-xl mb-4 animate-fade-up delay-2"
                 style={{
                   color: 'rgba(255,255,255,0.55)',
                   fontFamily: isFa ? 'inherit' : "'Vazirmatn', sans-serif",
                 }}>
                {t.heroSubFa}
              </p>

              <p className="text-lg mb-10 leading-relaxed animate-fade-up delay-2"
                 style={{color: 'rgba(255,255,255,0.45)'}}>
                {t.heroDesc}
              </p>

              {/* CTAs — justify-start adapts automatically to RTL flex direction */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start mb-10 animate-fade-up delay-3">
                <Link href="/trips"
                  className="btn-primary px-8 py-4 rounded-xl text-white font-bold text-base text-center"
                  style={{background: '#E07B29'}}>
                  {t.findTravelerBtn}
                </Link>
                <Link href="/requests"
                  className="btn-secondary px-8 py-4 rounded-xl font-bold text-base text-center"
                  style={{background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.15)'}}>
                  {t.postShipmentBtn}
                </Link>
              </div>

              {/* Stat pills */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start animate-fade-up delay-4">
                {[
                  {icon: '🛫', label: `4 ${t.activeRoutes}`},
                  {icon: '✅', label: `100% ${t.idVerified}`},
                  {icon: '🎁', label: t.freeToJoin},
                ].map(s => (
                  <div key={s.label}
                       className="flex items-center gap-2 px-4 py-2 rounded-full"
                       style={{background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)'}}>
                    <span className="text-sm">{s.icon}</span>
                    <span className="text-white text-sm">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Three floating feature cards (desktop only) */}
            <div className="hidden md:flex flex-col items-end gap-4 animate-fade-up delay-3" dir="ltr">

              {/* ── CARD 1: Match ──────────────────────────────── */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold self-end"
                   style={{background: 'rgba(110,231,183,0.12)', color: '#6EE7B7', border: '1px solid rgba(110,231,183,0.25)'}}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                {t.newMatchFound}
              </div>

              <div className="animate-float w-full max-w-xs rounded-2xl p-5 shadow-2xl"
                   style={{background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)'}}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>🇮🇷</span>
                    <span style={{color: 'rgba(255,255,255,0.35)'}}>→</span>
                    <span>🇨🇦</span>
                    <span className="ml-1">Tehran → Toronto</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{background: 'rgba(110,231,183,0.15)', color: '#6EE7B7'}}>✓ Verified</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-lg text-white flex-shrink-0"
                       style={{background: 'linear-gradient(135deg, #E07B29, #F5A04A)'}}>A</div>
                  <div>
                    <div className="font-semibold text-white text-sm">Ali H.</div>
                    <div className="text-xs" style={{color: 'rgba(255,255,255,0.45)'}}>⭐ 4.9 · 23 trips</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="rounded-xl p-3" style={{background: 'rgba(255,255,255,0.05)'}}>
                    <div className="text-xs mb-1" style={{color: 'rgba(255,255,255,0.4)'}}>Departs</div>
                    <div className="text-white text-sm font-semibold">May 3</div>
                  </div>
                  <div className="rounded-xl p-3" style={{background: 'rgba(255,255,255,0.05)'}}>
                    <div className="text-xs mb-1" style={{color: 'rgba(255,255,255,0.4)'}}>Available</div>
                    <div className="text-white text-sm font-semibold">8 kg · $6/kg</div>
                  </div>
                </div>
                <Link href="/trips"
                  className="btn-primary block w-full py-2.5 rounded-xl text-sm font-bold text-white text-center"
                  style={{background: '#E07B29'}}>
                  {t.contactTraveler}
                </Link>
              </div>

              {/* ── CARD 2: Chat preview ───────────────────────── */}
              <div className="animate-float-2 w-full max-w-xs rounded-2xl p-4 shadow-xl"
                   style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)'}}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">💬</span>
                    <span className="text-white text-xs font-bold">{t.chatLabel}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{background: 'rgba(110,231,183,0.12)', color: '#6EE7B7'}}>
                    🔒 {t.chatEncrypted}
                  </span>
                </div>
                <div className="space-y-2">
                  {/* Sender bubble */}
                  <div className="flex justify-end">
                    <div className="text-xs px-3 py-2 rounded-xl rounded-br-sm"
                         style={{background: '#E07B29', color: 'white', maxWidth: '85%'}}>
                      {t.chatMsg1}
                    </div>
                  </div>
                  {/* Traveler reply */}
                  <div className="flex justify-start items-end gap-1.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                         style={{background: 'linear-gradient(135deg, #E07B29, #F5A04A)'}}>A</div>
                    <div className="text-xs px-3 py-2 rounded-xl rounded-bl-sm"
                         style={{background: 'rgba(255,255,255,0.1)', color: 'white', maxWidth: '80%'}}>
                      {t.chatMsg2}
                    </div>
                  </div>
                  {/* Sender follow-up */}
                  <div className="flex justify-end">
                    <div className="text-xs px-3 py-2 rounded-xl rounded-br-sm"
                         style={{background: '#E07B29', color: 'white', maxWidth: '85%'}}>
                      {t.chatMsg3}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── CARD 3: Escrow / delivery confirmed ────────── */}
              <div className="animate-float-3 w-full max-w-[280px] rounded-2xl p-4 shadow-xl"
                   style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)'}}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                       style={{background: 'rgba(110,231,183,0.15)'}}>✅</div>
                  <div>
                    <div className="text-white text-xs font-bold">{t.packageDelivered}</div>
                    <div className="text-xs" style={{color: 'rgba(255,255,255,0.45)'}}>$42 → Ali H.</div>
                  </div>
                </div>
                <div className="h-1.5 rounded-full mb-1.5" style={{background: 'rgba(255,255,255,0.08)'}}>
                  <div className="h-full w-full rounded-full"
                       style={{background: 'linear-gradient(90deg, #6EE7B7, #34D399)'}} />
                </div>
                <div className="flex justify-between">
                  <span className="text-xs" style={{color: 'rgba(255,255,255,0.35)'}}>Escrow</span>
                  <span className="text-xs font-semibold" style={{color: '#6EE7B7'}}>{t.escrowReleased}</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <div className="py-24" style={{background: '#FFF5E6'}}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black mb-3" style={{color: '#1A2744'}}>{t.howItWorks}</h2>
            <p style={{color: '#9CA3AF'}}>{t.howItWorksDesc}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <div key={i}
                   className="bg-white rounded-2xl p-8 card-hover cursor-default"
                   style={{border: '1px solid rgba(26,39,68,0.06)', boxShadow: '0 2px 8px rgba(26,39,68,0.04)'}}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-lg mb-5"
                     style={{background: 'linear-gradient(135deg, #E07B29, #F5A04A)'}}>
                  {i + 1}
                </div>
                <div className="text-3xl mb-3">{step.icon}</div>
                <h3 className="font-bold text-lg mb-2" style={{color: '#1A2744'}}>{t[step.titleKey]}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{t[step.descKey]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <div className="py-20 text-center relative overflow-hidden" style={{background: '#E07B29'}}>
        <div className="absolute inset-0 pointer-events-none"
             style={{backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)'}} />
        <div className="relative">
          <h2 className="text-3xl font-black text-white mb-3">{t.readyToStart}</h2>
          <p className="mb-8" style={{color: 'rgba(255,255,255,0.75)'}}>{t.joinFree}</p>
          <Link href="/auth?tab=signup"
            className="btn-secondary inline-block px-10 py-4 rounded-xl font-bold text-base bg-white"
            style={{color: '#E07B29', boxShadow: '0 8px 30px rgba(0,0,0,0.15)'}}>
            {t.createAccount}
          </Link>
        </div>
      </div>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <div className="py-6 text-center" style={{background: '#1A2744'}}>
        <div className="flex justify-center gap-6 text-xs" style={{color: 'rgba(255,255,255,0.35)'}}>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <span>© 2026 Inambebar</span>
        </div>
      </div>

    </div>
  )
}
