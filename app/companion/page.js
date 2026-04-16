'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

export default function CompanionPage() {
  const { isFa } = useLanguage()
  const [companions, setCompanions] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('offers')
  const [filters, setFilters] = useState({ origin: '', destination: '' })
  const fontStyle = isFa ? { fontFamily: "'Vazirmatn', sans-serif" } : {}

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const [offersRes, requestsRes] = await Promise.all([
      supabase.from('companion_offers').select('*, profiles(full_name, rating_avg, rating_count, is_verified)')
        .eq('status', 'active').order('travel_date', { ascending: true }),
      supabase.from('companion_requests').select('*, profiles(full_name, rating_avg, rating_count, is_verified)')
        .eq('status', 'open').order('created_at', { ascending: false })
    ])
    setCompanions(offersRes.data || [])
    setRequests(requestsRes.data || [])
    setLoading(false)
  }

  const title = isFa ? 'همراه سفر' : 'Travel Companion'
  const subtitle = isFa
    ? 'مسافرانی که می‌توانند همراه شما باشند یا نیاز به همراه دارند را پیدا کنید.'
    : 'Find travelers who can accompany you, or offer to travel alongside someone who needs support.'

  return (
    <div className="max-w-5xl mx-auto px-4 py-10" style={fontStyle}>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black mb-2" style={{color:'#1A2744'}}>{title} 🤝</h1>
          <p className="text-gray-400 text-sm max-w-xl">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/companion/offer"
            className="px-4 py-2.5 rounded-xl text-white font-bold text-sm whitespace-nowrap"
            style={{background:'#E07B29'}}>
            {isFa ? '+ ارائه همراهی' : '+ Offer Companionship'}
          </Link>
          <Link href="/companion/request"
            className="px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap border border-gray-200 text-gray-600">
            {isFa ? '+ درخواست همراه' : '+ Request a Companion'}
          </Link>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-8">
        <div className="flex gap-4">
          <div className="text-2xl">🤝</div>
          <div>
            <div className="font-bold text-sm mb-1" style={{color:'#1A2744'}}>
              {isFa ? 'همراه سفر چیست؟' : 'What is Travel Companion?'}
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              {isFa
                ? 'گاهی سفر به یک همراه نیاز دارد — یک بزرگسال مسن که اولین بار تنها پرواز می‌کند، یک دانشجو که به کمک نیاز دارد، یا کسی که می‌خواهد در مسیر رفت‌وبرگشت همراهی داشته باشد. این سرویس برای همین موارد است.'
                : 'Sometimes travel requires a companion — an elderly parent flying alone for the first time, a student needing guidance, or someone who simply wants company on the journey. This service connects travelers making the same trip who can support each other.'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          {key:'offers', en:'Companion Offers', fa:'ارائه همراهی'},
          {key:'requests', en:'Companion Requests', fa:'درخواست همراه'},
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === t.key ? 'text-white' : 'bg-gray-100 text-gray-500'}`}
            style={tab === t.key ? {background:'#1A2744'} : {}}>
            {isFa ? t.fa : t.en}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-6">
        <div className="grid md:grid-cols-3 gap-4">
          <input type="text" placeholder={isFa ? 'از (شهر)' : 'From (city)'}
            value={filters.origin} onChange={e => setFilters(f => ({...f, origin: e.target.value}))}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400"/>
          <input type="text" placeholder={isFa ? 'به (شهر)' : 'To (city)'}
            value={filters.destination} onChange={e => setFilters(f => ({...f, destination: e.target.value}))}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400"/>
          <button onClick={fetchAll} className="py-2.5 rounded-xl text-white font-bold text-sm" style={{background:'#E07B29'}}>
            {isFa ? 'جستجو' : 'Search'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">{isFa ? 'در حال بارگذاری...' : 'Loading...'}</div>
      ) : (
        <div className="space-y-4">
          {(tab === 'offers' ? companions : requests).length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="font-bold text-lg mb-2" style={{color:'#1A2744'}}>
                {isFa ? 'موردی یافت نشد' : 'Nothing found yet'}
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                {isFa ? 'اولین نفری باشید که یک پیشنهاد یا درخواست ثبت می‌کند.' : 'Be the first to post an offer or request.'}
              </p>
              <Link href={tab === 'offers' ? '/companion/offer' : '/companion/request'}
                className="inline-block px-6 py-3 rounded-xl text-white font-bold text-sm" style={{background:'#E07B29'}}>
                {tab === 'offers' ? (isFa ? '+ ارائه همراهی' : '+ Offer Companionship') : (isFa ? '+ درخواست همراه' : '+ Request a Companion')}
              </Link>
            </div>
          ) : (tab === 'offers' ? companions : requests).map(item => (
            <div key={item.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                       style={{background:'#1A2744'}}>
                    {item.profiles?.full_name?.[0] || '?'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base" style={{color:'#1A2744'}}>{item.profiles?.full_name || 'Anonymous'}</span>
                      {item.profiles?.is_verified && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{background:'rgba(46,189,122,0.1)', color:'#2EBD7A'}}>✓</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">⭐ {item.profiles?.rating_avg?.toFixed(1) || 'New'} · {item.profiles?.rating_count || 0} {isFa ? 'نظر' : 'reviews'}</div>
                  </div>
                </div>
                {item.fee && (
                  <div className="text-right">
                    <div className="font-black text-xl" style={{color:'#E07B29'}}>${item.fee}</div>
                    <div className="text-xs text-gray-400">{isFa ? 'پیشنهاد' : 'offer'}</div>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50">
                <div className="font-semibold text-sm mb-1" style={{color:'#1A2744'}}>
                  {item.origin_city} → {item.destination_city}
                </div>
                {item.travel_date && (
                  <div className="text-xs text-gray-400">
                    {new Date(item.travel_date).toLocaleDateString('en-GB', {day:'numeric',month:'short',year:'numeric'})}
                  </div>
                )}
                {item.description && (
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
