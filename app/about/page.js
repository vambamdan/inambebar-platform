'use client'
import Link from 'next/link'
import { Plane, Package, Users, ShieldCheck, MapPin, Mail, Info, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'

const CARD_BG  = '#16203A'
const HAIRLINE = 'rgba(255,255,255,0.07)'
const FG1      = '#F1F4FB'
const FG2      = '#A6B0CC'
const FG3      = '#6E7A99'

export default function AboutPage() {
  const { t, isFa, lang } = useLanguage()
  const fontStyle = isFa ? { fontFamily: "'Vazirmatn', sans-serif" } : {}

  const services = [
    { Icon: Plane,   title: t?.aboutSvc1Title, desc: t?.aboutSvc1Desc },
    { Icon: Package, title: t?.aboutSvc2Title, desc: t?.aboutSvc2Desc },
    { Icon: Users,   title: t?.aboutSvc3Title, desc: t?.aboutSvc3Desc },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#0B1220', paddingTop: 72, ...fontStyle }} dir={isFa ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── Header ── */}
        <div className="mb-12">
          <p className="text-xs font-semibold mb-3 tracking-widest uppercase" style={{ color: '#E07B29' }}>
            {t?.aboutUs || 'About Us'}
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-4" style={{ color: FG1, letterSpacing: '-0.025em' }}>
            {t?.aboutHeading || 'Inambebar — اینم ببر'}
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: FG2 }}>
            {t?.aboutSubheading || '"Take This Too" — Connecting the Iranian diaspora through trusted peer-to-peer delivery.'}
          </p>
        </div>

        {/* ── Important note banner ── */}
        <div className="rounded-2xl p-5 mb-10 flex gap-4"
          style={{ background: 'rgba(224,123,41,0.06)', border: '1px solid rgba(224,123,41,0.18)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: 'rgba(224,123,41,0.12)' }}>
            <Info size={16} style={{ color: '#E07B29' }} strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-sm font-semibold mb-1.5" style={{ color: '#F5B380' }}>
              {t?.aboutNoteTitle || 'Important Note'}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#FAD2B0' }}>
              {t?.aboutNoteText || 'Inambebar was created to help the Iranian diaspora community. During our first year of operation, this service is provided completely free of charge. Our primary goal is to help people.'}
            </p>
          </div>
        </div>

        {/* ── Body sections ── */}
        <div className="space-y-5">

          {/* Why section */}
          <section className="rounded-2xl p-7" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: FG1, letterSpacing: '-0.015em' }}>
              {t?.aboutWhyTitle || 'Why Inambebar?'}
            </h2>
            <p className="leading-relaxed text-sm" style={{ color: FG2 }}>
              {t?.aboutWhyText || 'Every member of the Iranian diaspora knows the story: a bag full of saffron, pistachios, or medicine that needs to get to Iran. Or a laptop that needs to come back. International shipping is expensive, slow, and sometimes impossible through official channels. Inambebar was built to solve exactly this problem.'}
            </p>
          </section>

          {/* Services */}
          <section>
            <h2 className="text-lg font-semibold mb-4 px-1" style={{ color: FG1, letterSpacing: '-0.015em' }}>
              {t?.aboutWhatWeOffer || 'What We Offer'}
            </h2>
            <div className="space-y-3">
              {services.map(({ Icon, title, desc }) => (
                <div key={title} className="rounded-2xl p-5 flex gap-4" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(224,123,41,0.08)', border: '1px solid rgba(224,123,41,0.15)' }}>
                    <Icon size={18} style={{ color: '#E07B29' }} strokeWidth={1.6} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm mb-1.5" style={{ color: FG1 }}>{title}</div>
                    <p className="text-sm leading-relaxed" style={{ color: FG2 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Safety */}
          <section className="rounded-2xl p-7" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={18} style={{ color: '#2EBD7A' }} strokeWidth={1.8} />
              <h2 className="text-lg font-semibold" style={{ color: FG1, letterSpacing: '-0.015em' }}>
                {t?.aboutSafetyTitle || 'Safety & Trust'}
              </h2>
            </div>
            <p className="leading-relaxed text-sm" style={{ color: FG2 }}>
              {t?.aboutSafetyText || "Every user must verify their identity with a government-issued ID and a live selfie before transacting. All messages are logged on our platform. Packages are photographed at handoff. These aren't just features — they're the reason you can trust a stranger with your package."}
            </p>
          </section>

          {/* Routes */}
          <section className="rounded-2xl p-7" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={18} style={{ color: '#E07B29' }} strokeWidth={1.8} />
              <h2 className="text-lg font-semibold" style={{ color: FG1, letterSpacing: '-0.015em' }}>
                {t?.aboutRoutesTitle || 'Our Routes'}
              </h2>
            </div>
            <p className="leading-relaxed text-sm" style={{ color: FG2 }}>
              {t?.aboutRoutesText || 'We serve the most important corridors for the Iranian diaspora: Tehran, Mashhad, Shiraz, Isfahan connected to Toronto, Dubai, London, Stockholm, Frankfurt, Amsterdam, Los Angeles, Paris, and beyond. If Iranians fly it, we serve it.'}
            </p>
          </section>

          {/* Contact */}
          <section className="rounded-2xl p-7" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2 mb-4">
              <Mail size={18} style={{ color: FG2 }} strokeWidth={1.8} />
              <h2 className="text-lg font-semibold" style={{ color: FG1, letterSpacing: '-0.015em' }}>
                {t?.aboutContactTitle || 'Contact'}
              </h2>
            </div>
            <p className="text-sm" style={{ color: FG2 }}>
              {t?.aboutContactText || 'Questions? Reach us at'}{' '}
              <a href="mailto:info@inambebar.com" className="font-semibold transition-colors hover:opacity-80"
                style={{ color: '#E07B29' }}>
                info@inambebar.com
              </a>
            </p>
          </section>
        </div>

        {/* ── CTA ── */}
        <div className="mt-12 text-center">
          <Link href="/auth?tab=signup"
            className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold text-sm"
            style={{ background: '#E07B29' }}>
            {t?.aboutJoinBtn || 'Join Inambebar Free'}
            <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </div>
  )
}
