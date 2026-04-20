import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden"
           style={{background: 'linear-gradient(135deg, #0F1A35 0%, #1A2744 50%, #1D2B4F 100%)'}}>

        {/* Ambient glow orbs — pure CSS, zero cost */}
        <div className="absolute top-16 left-1/4 w-96 h-96 rounded-full pointer-events-none"
             style={{background: 'radial-gradient(circle, rgba(224,123,41,0.18) 0%, transparent 70%)', filter: 'blur(60px)'}} />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 rounded-full pointer-events-none"
             style={{background: 'radial-gradient(circle, rgba(245,160,74,0.1) 0%, transparent 70%)', filter: 'blur(40px)'}} />

        <div className="max-w-6xl mx-auto px-4 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* LEFT — Copy */}
            <div className="text-center md:text-left">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 animate-fade-up"
                   style={{
                     background: 'rgba(224,123,41,0.15)',
                     color: '#F5A04A',
                     border: '1px solid rgba(224,123,41,0.35)',
                     boxShadow: '0 0 20px rgba(224,123,41,0.15)',
                   }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{background: '#F5A04A'}} />
                Now accepting early members
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight tracking-tight animate-fade-up delay-1">
                Send it home with someone<br />
                <span style={{
                  background: 'linear-gradient(90deg, #E07B29, #F5A04A)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  who&apos;s already going.
                </span>
              </h1>

              {/* Persian sub-headline */}
              <p className="text-xl mb-4 animate-fade-up delay-2"
                 style={{color: 'rgba(255,255,255,0.55)', fontFamily: "'Vazirmatn', sans-serif"}}>
                اینم ببر — با مسافر ارسال کن
              </p>

              <p className="text-lg mb-10 leading-relaxed animate-fade-up delay-2"
                 style={{color: 'rgba(255,255,255,0.45)'}}>
                Connect with verified Iranian travelers flying your route. Send packages safely, affordably, and with full accountability.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start mb-10 animate-fade-up delay-3">
                <Link href="/trips"
                  className="btn-primary px-8 py-4 rounded-xl text-white font-bold text-base text-center"
                  style={{background: '#E07B29'}}>
                  Find a Traveler →
                </Link>
                <Link href="/requests"
                  className="btn-secondary px-8 py-4 rounded-xl font-bold text-base text-center"
                  style={{background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.15)'}}>
                  Post a Shipment
                </Link>
              </div>

              {/* Stat pills */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3 animate-fade-up delay-4">
                {[
                  {icon: '🛫', num: '4',     label: 'Active Routes'},
                  {icon: '✅', num: '100%',  label: 'ID Verified'},
                  {icon: '🎁', num: 'Free',  label: 'To Join'},
                ].map(s => (
                  <div key={s.label}
                       className="flex items-center gap-2 px-4 py-2 rounded-full"
                       style={{background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)'}}>
                    <span className="text-sm">{s.icon}</span>
                    <span className="text-white font-bold text-sm">{s.num}</span>
                    <span className="text-sm" style={{color: 'rgba(255,255,255,0.45)'}}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Floating sample match card (desktop only) */}
            <div className="hidden md:flex flex-col items-end animate-fade-up delay-3">

              {/* Notification chip */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-3"
                   style={{background: 'rgba(110,231,183,0.12)', color: '#6EE7B7', border: '1px solid rgba(110,231,183,0.25)'}}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                New match found
              </div>

              {/* Card */}
              <div className="animate-float w-full max-w-xs rounded-2xl p-5 shadow-2xl"
                   style={{
                     background: 'rgba(255,255,255,0.06)',
                     border: '1px solid rgba(255,255,255,0.1)',
                     backdropFilter: 'blur(20px)',
                   }}>

                {/* Route header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>🇮🇷</span>
                    <span style={{color: 'rgba(255,255,255,0.35)'}}>→</span>
                    <span>🇨🇦</span>
                    <span className="ml-1">Tehran → Toronto</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{background: 'rgba(110,231,183,0.15)', color: '#6EE7B7'}}>
                    ✓ Verified
                  </span>
                </div>

                {/* Traveler info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-lg text-white flex-shrink-0"
                       style={{background: 'linear-gradient(135deg, #E07B29, #F5A04A)'}}>
                    A
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">Ali H.</div>
                    <div className="text-xs" style={{color: 'rgba(255,255,255,0.45)'}}>⭐ 4.9 · 23 trips</div>
                  </div>
                </div>

                {/* Detail chips */}
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

                {/* Card CTA */}
                <Link href="/trips"
                  className="btn-primary block w-full py-2.5 rounded-xl text-sm font-bold text-white text-center"
                  style={{background: '#E07B29'}}>
                  Contact Traveler →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <div className="py-24" style={{background: '#FFF5E6'}}>
        <div className="max-w-5xl mx-auto px-4">

          <div className="text-center mb-14">
            <h2 className="text-3xl font-black mb-3" style={{color: '#1A2744'}}>How it works</h2>
            <p style={{color: '#9CA3AF'}}>Three steps for senders. Three steps for travelers.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {icon: '🔍', title: 'Find a traveler', desc: 'Search by route and date. Browse verified travelers with ratings, reviews, and available space.'},
              {icon: '💬', title: 'Chat in-platform', desc: 'Agree on price and details entirely inside Inambebar. Every message is logged for your protection.'},
              {icon: '✅', title: 'Pay & confirm', desc: 'Pay into secure escrow. Released only when your recipient confirms delivery. Both parties photograph the handoff.'},
            ].map((step, i) => (
              <div key={i}
                   className="bg-white rounded-2xl p-8 card-hover cursor-default"
                   style={{border: '1px solid rgba(26,39,68,0.06)', boxShadow: '0 2px 8px rgba(26,39,68,0.04)'}}>
                {/* Numbered circle */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-lg mb-5 flex-shrink-0"
                     style={{background: 'linear-gradient(135deg, #E07B29, #F5A04A)'}}>
                  {i + 1}
                </div>
                <div className="text-3xl mb-3">{step.icon}</div>
                <h3 className="font-bold text-lg mb-2" style={{color: '#1A2744'}}>{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <div className="py-20 text-center relative overflow-hidden" style={{background: '#E07B29'}}>
        {/* Texture overlays */}
        <div className="absolute inset-0 pointer-events-none"
             style={{backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)'}} />
        <div className="relative">
          <h2 className="text-3xl font-black text-white mb-3">Ready to get started?</h2>
          <p className="mb-8" style={{color: 'rgba(255,255,255,0.75)'}}>Join for free. No commitment.</p>
          <Link href="/auth?tab=signup"
            className="btn-secondary inline-block px-10 py-4 rounded-xl font-bold text-base bg-white"
            style={{color: '#E07B29', boxShadow: '0 8px 30px rgba(0,0,0,0.15)'}}>
            Create Your Account →
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
