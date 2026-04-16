'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

export default function AboutPage() {
  const { isFa } = useLanguage()
  const fontStyle = isFa ? { fontFamily: "'Vazirmatn', sans-serif" } : {}

  if (isFa) return (
    <div className="max-w-3xl mx-auto px-4 py-12" style={fontStyle} dir="rtl">
      <div className="mb-10">
        <p className="text-sm font-bold mb-3" style={{color:'#E07B29'}}>درباره ما</p>
        <h1 className="text-4xl font-black mb-3" style={{color:'#1A2744'}}>اینم ببر</h1>
        <p className="text-xl text-gray-500 leading-relaxed">پلتفرمی برای ارتباط مسافرین ایرانی با فرستنده‌های بسته در سراسر جهان</p>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-10">
        <p className="text-sm font-bold text-amber-700 mb-2">📌 نکته مهم</p>
        <p className="text-amber-700 text-sm leading-relaxed">
          اینم ببر یک پروژه دانشجویی است که با هدف کمک به جامعه ایرانی ایجاد شده. در سال اول راه‌اندازی، این سرویس کاملاً رایگان ارائه می‌شود. هدف اصلی ما در این مرحله کمک به مردم است، نه کسب سود.
        </p>
      </div>

      <div className="space-y-8 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold mb-3" style={{color:'#1A2744'}}>چرا اینم ببر؟</h2>
          <p>
            هر ایرانی مهاجر این داستان را می‌شناسد: یک کیف پر از پسته، زعفران، یا دارو که باید به ایران برسد. یا یک لپتاپ که باید از ایران بیاید. ارسال از طریق پست بین‌المللی گران، کند، و گاهی غیرممکن است. اینم ببر برای حل همین مشکل ساخته شده.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{color:'#1A2744'}}>چطور کار می‌کند؟</h2>
          <p className="mb-4">پلتفرم ما سه سرویس اصلی ارائه می‌دهد:</p>
          <div className="space-y-3">
            {[
              {icon:'✈️', title:'ظرفیت بار مسافر', desc:'مسافرانی که قرار است به مقصدی پرواز کنند، فضای اضافه چمدان خود را ثبت می‌کنند. فرستنده‌ها می‌توانند آن‌ها را پیدا کنند، قرارداد ببندند، و بسته را بفرستند.'},
              {icon:'📦', title:'درخواست ارسال بسته', desc:'اگر می‌خواهید بسته‌ای بفرستید، درخواستتان را ثبت کنید. مسافرانی که در همان مسیر سفر می‌کنند پیشنهاد حمل می‌دهند.'},
              {icon:'🤝', title:'همراه سفر', desc:'نیاز دارید کسی همراه سفرتان باشد؟ یا می‌خواهید به یک مسافر تنها کمک کنید؟ سرویس همراه سفر ما این ارتباط را ممکن می‌سازد.'},
            ].map(s => (
              <div key={s.title} className="flex gap-4 bg-gray-50 rounded-xl p-4">
                <div className="text-2xl">{s.icon}</div>
                <div>
                  <div className="font-bold text-sm mb-1" style={{color:'#1A2744'}}>{s.title}</div>
                  <div className="text-sm text-gray-500">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{color:'#1A2744'}}>امنیت و اعتماد</h2>
          <p>همه کاربران باید هویتشان را با مدرک معتبر و عکس سلفی تأیید کنند. تمام پیام‌ها در پلتفرم ثبت می‌شوند. عکس بسته هنگام تحویل گرفته می‌شود. این ها همه برای ایجاد یک محیط امن برای هر دو طرف است.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{color:'#1A2744'}}>تماس با ما</h2>
          <p>سوال دارید؟ با ما در تماس باشید: <a href="mailto:info@inambebar.com" className="underline" style={{color:'#E07B29'}}>info@inambebar.com</a></p>
        </section>
      </div>

      <div className="mt-12 text-center">
        <Link href="/auth?tab=signup"
          className="inline-block px-8 py-4 rounded-xl text-white font-bold" style={{background:'#E07B29'}}>
          همین الان عضو شوید ←
        </Link>
      </div>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-10">
        <p className="text-sm font-bold mb-3" style={{color:'#E07B29'}}>About Us</p>
        <h1 className="text-4xl font-black mb-3" style={{color:'#1A2744'}}>Inambebar — اینم ببر</h1>
        <p className="text-xl text-gray-500 leading-relaxed">&quot;Take This Too&quot; — Connecting the Iranian diaspora through trusted peer-to-peer delivery.</p>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-10">
        <p className="text-sm font-bold text-amber-700 mb-2">📌 Important Note</p>
        <p className="text-amber-700 text-sm leading-relaxed">
          Inambebar is a student project created with the purpose of helping the Iranian diaspora community. During our first year of operation, this service is provided completely free of charge. Our primary goal at this stage is to help people, not to generate profit.
        </p>
      </div>

      <div className="space-y-8 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold mb-3" style={{color:'#1A2744'}}>Why Inambebar?</h2>
          <p>Every member of the Iranian diaspora knows the story: a bag full of saffron, pistachios, or medicine that needs to get to Iran. Or a laptop that needs to come back. International shipping is expensive, slow, and sometimes impossible through official channels. Inambebar was built to solve exactly this problem — by connecting people who are already making the trip with people who need something carried.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{color:'#1A2744'}}>What We Offer</h2>
          <div className="space-y-3">
            {[
              {icon:'✈️', title:'Traveler Luggage Space', desc:'Travelers post their upcoming trips and available luggage space. Senders browse, connect, and arrange delivery. Both parties benefit.'},
              {icon:'📦', title:'Shipment Requests', desc:'Need something sent? Post a request describing your package. Travelers on your route see it and offer to carry it.'},
              {icon:'🤝', title:'Travel Companion', desc:'Need someone to travel alongside you or a family member? Or want to offer companionship to a solo traveler? Our Travel Companion service connects people making the same journey.'},
            ].map(s => (
              <div key={s.title} className="flex gap-4 bg-gray-50 rounded-xl p-4">
                <div className="text-2xl">{s.icon}</div>
                <div>
                  <div className="font-bold text-sm mb-1" style={{color:'#1A2744'}}>{s.title}</div>
                  <div className="text-sm text-gray-500">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{color:'#1A2744'}}>Safety & Trust</h2>
          <p>Every user on Inambebar must verify their identity with a government-issued ID and a live selfie before they can transact. All messages are logged on our platform — not on WhatsApp, not over email. Packages are photographed at handoff. These aren&apos;t just features — they&apos;re the reason you can trust a stranger with your package.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{color:'#1A2744'}}>Our Routes</h2>
          <p>We serve the most important corridors for the Iranian diaspora: Tehran, Mashhad, Shiraz, Isfahan, Tabriz, and all major Iranian cities connected to Toronto, Dubai, London, Stockholm, Frankfurt, Amsterdam, Los Angeles, Paris, and beyond. If Iranians fly it, we serve it.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{color:'#1A2744'}}>Contact</h2>
          <p>Questions? Reach us at <a href="mailto:info@inambebar.com" className="underline" style={{color:'#E07B29'}}>info@inambebar.com</a></p>
        </section>
      </div>

      <div className="mt-12 text-center">
        <Link href="/auth?tab=signup"
          className="inline-block px-8 py-4 rounded-xl text-white font-bold" style={{background:'#E07B29'}}>
          Join Inambebar Free →
        </Link>
      </div>
    </div>
  )
}
