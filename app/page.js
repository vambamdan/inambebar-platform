'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { Search, MessageSquare, CheckCircle, Plane, ShieldCheck, Gift, Lock } from 'lucide-react'

const STEPS = [
  { Icon: Search,        titleKey: 'step1Title', descKey: 'step1Desc' },
  { Icon: MessageSquare, titleKey: 'step2Title', descKey: 'step2Desc' },
  { Icon: CheckCircle,   titleKey: 'step3Title', descKey: 'step3Desc' },
]

const STAT_PILLS = (t) => [
  { Icon: Plane,        label: `4 ${t.activeRoutes}` },
  { Icon: ShieldCheck,  label: `100% ${t.idVerified}` },
  { Icon: Gift,         label: t.freeToJoin },
]

export default function Home() {
  const { t, isFa } = useLanguage()
  const vasFont = { fontFamily: "'Vazirmatn', sans-serif" }

  return (
    <div className="min-h-screen" style={isFa ? vasFont : {}}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden flex items-center"
           style={{ minHeight: 'calc(100vh - 4rem)', background: '#0F1A35' }}>

        {/* Persepolis photo */}
        <div className="absolute inset-0 pointer-events-none"
             style={{
               backgroundImage: 'url(/persepolis.jpg)',
               backgroundSize: 'cover',
               backgroundPosition: 'center right',
               backgroundRepeat: 'no-repeat',
             }} />

        {/* Navy gradient overlay */}
        <div className="absolute inset-0 pointer-events-none"
             style={{
               background: 'linear-gradient(to right, #0F1A35 0%, #0F1A35 30%, rgba(15,26,53,0.85) 55%, rgba(15,26,53,0.4) 75%, rgba(15,26,53,0.15) 100%)',
             }} />

        {/* Amber doorway glow */}
        <div className="absolute inset-0 pointer-events-none"
             style={{
               background: 'radial-gradient(ellipse at 72% 55%, rgba(224,123,41,0.12) 0%, transparent 45%)',
             }} />

        <div className="max-w-6xl mx-auto px-4 py-16 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* LEFT — Copy */}
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

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start mb-10 animate-fade-up delay-3">
                <Link href="/trips"
                  className="btn-primary px-8 py-4 rounded-xl text-white font-bold text-base text-center"
                  style={{background: '#E07B29'}}>
                  {t.findTravelerBtn}
                </Link>
                <Link href="/requests"
                  className="btn-secondary px-8 py-4 rounded-xl font-bold text-base text-center"
                  style={{background: 'white', color: '#1A2744', border: '1px solid rgba(255,255,255,0.9)'}}>
                  {t.postShipmentBtn}
                </Link>
              </div>

              {/* Stat pills */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start animate-fade-up delay-4">
                {STAT_PILLS(t).map(({ Icon, label }) => (
                  <div key={label}
                       className="flex items-center gap-2 px-4 py-2 rounded-full"
                       style={{background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)'}}>
                    <Icon size={14} color="#F5A04A" />
                    <span className="text-white text-sm">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Floating cards */}
            <div className="hidden md:flex flex-col items-end gap-4 animate-fade-up delay-3" dir="ltr">

              {/* Match pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold self-end"
                   style={{background: 'rgba(110,231,183,0.12)', color: '#6EE7B7', border: '1px solid rgba(110,231,183,0.25)'}}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                {t.newMatchFound}
              </div>

              {/* Card 1: Match */}
              <div className="animate-float w-full max-w-xs rounded-2xl p-5 shadow-2xl"
                   style={{background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)'}}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>IKA</span>
                    <span style={{color: 'rgba(255,255,255,0.35)'}}>→</span>
                    <span>YYZ</span>
                    <span className="ml-1 text-xs font-normal" style={{color: 'rgba(255,255,255,0.6)'}}>Tehran → Toronto</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{background: 'rgba(110,231,183,0.15)', color: '#6EE7B7'}}>Verified</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-lg text-white flex-shrink-0"
                       style={{background: 'linear-gradient(135deg, #E07B29, #F5A04A)'}}>A</div>
                  <div>
                    <div className="font-semibold text-white text-sm">Ali H.</div>
                    <div className="text-xs" style={{color: 'rgba(255,255,255,0.45)'}}>4.9 · 23 trips</div>
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

              {/* Card 2: Chat */}
              <div className="animate-float-2 w-full max-w-xs rounded-2xl p-4 shadow-xl"
                   style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)'}}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare size={13} color="white" />
                    <span className="text-white text-xs font-bold">{t.chatLabel}</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{background: 'rgba(110,231,183,0.12)', color: '#6EE7B7'}}>
                    <Lock size={10} /> {t.chatEncrypted}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-end">
                    <div className="text-xs px-3 py-2 rounded-xl rounded-br-sm"
                         style={{background: '#E07B29', color: 'white', maxWidth: '85%'}}>
                      {t.chatMsg1}
                    </div>
                  </div>
                  <div className="flex justify-start items-end gap-1.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                         style={{background: 'linear-gradient(135deg, #E07B29, #F5A04A)'}}>A</div>
                    <div className="text-xs px-3 py-2 rounded-xl rounded-bl-sm"
                         style={{background: 'rgba(255,255,255,0.1)', color: 'white', maxWidth: '80%'}}>
                      {t.chatMsg2}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="text-xs px-3 py-2 rounded-xl rounded-br-sm"
                         style={{background: '#E07B29', color: 'white', maxWidth: '85%'}}>
                      {t.chatMsg3}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Delivery */}
              <div className="animate-float-3 w-full max-w-[280px] rounded-2xl p-4 shadow-xl"
                   style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)'}}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                       style={{background: 'rgba(110,231,183,0.15)'}}>
                    <CheckCircle size={18} color="#6EE7B7" />
                  </div>
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

        {/* Photo credit */}
        <div className="absolute bottom-3 right-4 pointer-events-none"
             style={{color: 'rgba(255,255,255,0.28)', fontSize: '10px', letterSpacing: '0.03em'}}>
          Photo: Hasan Almasi / Unsplash
        </div>
      </div>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <div className="py-24" style={{background: '#F8FAFC'}}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black mb-3" style={{color: '#1A2744'}}>{t.howItWorks}</h2>
            <p style={{color: '#9CA3AF'}}>{t.howItWorksDesc}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map(({ Icon, titleKey, descKey }, i) => (
              <div key={i}
                   className="bg-white rounded-2xl p-8 card-hover cursor-default"
                   style={{border: '1px solid rgba(26,39,68,0.08)', boxShadow: '0 4px 16px rgba(26,39,68,0.07)'}}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-lg mb-5"
                     style={{background: 'linear-gradient(135deg, #E07B29, #F5A04A)'}}>
                  {i + 1}
                </div>
                <div className="mb-3">
                  <Icon size={28} color="#E07B29" strokeWidth={1.8} />
                </div>
                <h3 className="font-bold text-lg mb-2" style={{color: '#1A2744'}}>{t[titleKey]}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{t[descKey]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <div className="py-20 text-center relative overflow-hidden" style={{background: '#1A2744'}}>
        <div className="absolute inset-0 pointer-events-none"
             style={{backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(224,123,41,0.1) 0%, transparent 55%), radial-gradient(circle at 80% 50%, rgba(224,123,41,0.06) 0%, transparent 55%)'}} />
        <div className="relative">
          <h2 className="text-3xl font-black text-white mb-3">{t.readyToStart}</h2>
          <p className="mb-8" style={{color: 'rgba(255,255,255,0.55)'}}>{t.joinFree}</p>
          <Link href="/auth?tab=signup"
            className="btn-primary inline-block px-10 py-4 rounded-xl font-bold text-base text-white"
            style={{background: '#E07B29', boxShadow: '0 8px 30px rgba(224,123,41,0.35)'}}>
            {t.createAccount}
          </Link>
        </div>
      </div>

    </div>
  )
}
