import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen" style={{background: '#1A2744'}}>
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8"
             style={{background: 'rgba(224,123,41,0.15)', color: '#F5A04A', border: '1px solid rgba(224,123,41,0.3)'}}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{background: '#F5A04A'}}></span>
          Now accepting early members
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight tracking-tight">
          Send it home with someone<br/>
          <span style={{color: '#F5A04A'}}>who&apos;s already going.</span>
        </h1>

        <p className="text-xl text-white/60 mb-4" style={{fontFamily: 'sans-serif'}}>
          اینم ببر — با مسافر ارسال کن
        </p>

        <p className="text-lg text-white/50 mb-12 max-w-xl mx-auto leading-relaxed">
          Connect with verified Iranian travelers flying your route. Send packages safely, affordably, and with full accountability.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/trips"
            className="px-8 py-4 rounded-xl text-white font-bold text-base transition-all hover:-translate-y-0.5"
            style={{background: '#E07B29'}}>
            Find a Traveler →
          </Link>
          <Link href="/requests"
            className="px-8 py-4 rounded-xl font-bold text-base transition-all hover:-translate-y-0.5"
            style={{background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.15)'}}>
            Post a Shipment
          </Link>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-12">
          {[
            {num: '4', label: 'Active Routes'},
            {num: '100%', label: 'ID Verified'},
            {num: 'Free', label: 'To Join'},
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-black text-white">{s.num}</div>
              <div className="text-xs text-white/40 font-medium mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{background: '#FAFAF7'}} className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-center mb-2" style={{color: '#1A2744'}}>How it works</h2>
          <p className="text-center text-gray-400 mb-12">Three steps for senders. Three steps for travelers.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {icon: '🔍', title: 'Find a traveler', desc: 'Search by route and date. Browse verified travelers with ratings, reviews, and available space.'},
              {icon: '💬', title: 'Chat in-platform', desc: 'Agree on price and details entirely inside Inambebar. Every message is logged for your protection.'},
              {icon: '✅', title: 'Pay & confirm', desc: 'Pay into secure escrow. Released only when your recipient confirms delivery. Both parties photograph the handoff.'},
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="font-bold text-lg mb-2" style={{color: '#1A2744'}}>{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 text-center" style={{background: '#E07B29'}}>
        <h2 className="text-3xl font-black text-white mb-4">Ready to get started?</h2>
        <p className="text-white/80 mb-8">Join for free. No commitment.</p>
        <Link href="/auth?tab=signup"
          className="inline-block px-10 py-4 rounded-xl font-bold text-base bg-white transition-all hover:-translate-y-0.5"
          style={{color: '#E07B29'}}>
          Create Your Account →
        </Link>
      </div>
    </div>
  )
}
