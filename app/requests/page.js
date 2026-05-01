'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'
import { CATEGORIES } from '@/lib/translations'

export default function RequestsPage() {
  const { t, isFa } = useLanguage()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', category: '' })
  const fontStyle = isFa ? { fontFamily: "'Vazirmatn', sans-serif" } : {}

  useEffect(() => { fetchRequests() }, [])

  async function fetchRequests() {
    setLoading(true)
    let query = supabase
      .from('shipment_requests')
      .select(`*, profiles:sender_id(full_name, avatar_url, rating_avg, rating_count, is_verified)`)
      .eq('status', 'open')
      .order('created_at', { ascending: false })

    if (filters.category) query = query.eq('item_category', filters.category)

    const { data } = await query
    setRequests(data || [])
    setLoading(false)
  }

  function handleSearch(e) { e.preventDefault(); fetchRequests() }

  // Client-side text search (origin, destination, description)
  const visible = filters.search
    ? requests.filter(r =>
        r.origin_city?.toLowerCase().includes(filters.search.toLowerCase()) ||
        r.destination_city?.toLowerCase().includes(filters.search.toLowerCase()) ||
        r.item_description?.toLowerCase().includes(filters.search.toLowerCase())
      )
    : requests

  return (
    <div className="max-w-5xl mx-auto px-4 py-10" style={fontStyle}>
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black mb-2" style={{color:'#1A2744'}}>{t.browseRequests}</h1>
          <p className="text-gray-400 text-sm">{t.findPackages}</p>
        </div>
        <Link href="/requests/new"
          className="flex-shrink-0 px-5 py-2.5 rounded-xl text-white font-bold text-sm whitespace-nowrap"
          style={{background:'#E07B29'}}>
          {t.postRequest}
        </Link>
      </div>

      {/* Category filter chips */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() => { setFilters(f => ({...f, category: ''})); }}
          className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${!filters.category ? 'text-white border-transparent' : 'bg-white border-gray-200 text-gray-500'}`}
          style={!filters.category ? {background:'#1A2744'} : {}}>
          {isFa ? 'همه' : 'All'}
        </button>
        {CATEGORIES.map(cat => (
          <button key={cat.key}
            onClick={() => setFilters(f => ({...f, category: f.category === cat.key ? '' : cat.key}))}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${filters.category === cat.key ? 'text-white border-transparent' : 'bg-white border-gray-200 text-gray-500'}`}
            style={filters.category === cat.key ? {background:'#E07B29'} : {}}>
            {cat.icon} {isFa ? cat.fa : cat.en}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
              {isFa ? 'جستجو بر اساس شهر یا توضیحات' : 'Search by city or description'}
            </label>
            <input
              type="text"
              placeholder={isFa ? 'مثلاً تهران، لپتاپ...' : 'e.g. Tehran, laptop...'}
              value={filters.search}
              onChange={e => setFilters(f => ({...f, search: e.target.value}))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"
            />
          </div>
          <div className="flex items-end">
            <button type="submit"
              className="w-full py-3 rounded-xl text-white font-bold text-sm"
              style={{background:'#E07B29'}}>
              {t.searchTravelers || (isFa ? 'جستجو' : 'Search')}
            </button>
          </div>
        </div>
      </form>

      {/* Results */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">
          {isFa ? 'در حال بارگذاری...' : 'Loading requests...'}
        </div>
      ) : visible.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="font-bold text-lg mb-2" style={{color:'#1A2744'}}>
            {isFa ? 'درخواستی یافت نشد' : 'No requests found'}
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            {isFa ? 'اولین نفری باشید که درخواست ارسال ثبت می‌کند.' : 'Be the first to post a shipment request.'}
          </p>
          <Link href="/requests/new"
            className="inline-block px-6 py-3 rounded-xl text-white font-bold text-sm"
            style={{background:'#E07B29'}}>
            {t.postRequest}
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {visible.map(req => (
            <RequestCard key={req.id} req={req} t={t} isFa={isFa} />
          ))}
        </div>
      )}
    </div>
  )
}

function RequestCard({ req, t, isFa }) {
  const categoryInfo = CATEGORIES.find(c => c.key === req.item_category)
  const categoryLabel = categoryInfo ? (isFa ? categoryInfo.fa : categoryInfo.en) : req.item_category

  return (
    <Link href={`/requests/${req.id}`} className="block">
      <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all h-full">

        {/* Sender row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden"
               style={{background:'#1A2744'}}>
            {req.profiles?.avatar_url
              ? <img src={req.profiles.avatar_url} alt="" className="w-full h-full object-cover"/>
              : (req.profiles?.full_name?.charAt(0)?.toUpperCase() || '?')
            }
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm truncate" style={{color:'#1A2744'}}>
                {req.profiles?.full_name || (isFa ? 'ناشناس' : 'Anonymous')}
              </span>
              {req.profiles?.is_verified && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{background:'rgba(46,189,122,0.1)', color:'#2EBD7A'}}>
                  ✓ {t.verified || 'Verified'}
                </span>
              )}
            </div>
            {req.profiles?.rating_count > 0 && (
              <div className="text-xs text-gray-400 mt-0.5">
                ⭐ {req.profiles.rating_avg?.toFixed(1)} · {req.profiles.rating_count} {t.reviews || 'reviews'}
              </div>
            )}
          </div>
        </div>

        {/* Route */}
        <div className="font-semibold text-sm mb-2" style={{color:'#1A2744'}}>
          {req.origin_city}{req.origin_country ? `, ${req.origin_country}` : ''}
          <span className="mx-2 text-gray-300">→</span>
          {req.destination_city}{req.destination_country ? `, ${req.destination_country}` : ''}
        </div>

        {/* Description */}
        {req.item_description && (
          <p className="text-gray-500 text-sm mb-3 line-clamp-2 leading-relaxed">
            {req.item_description}
          </p>
        )}

        {/* Tags row */}
        <div className="flex flex-wrap gap-2 mb-3">
          {categoryInfo && (
            <span className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{background:'rgba(224,123,41,0.08)', color:'#E07B29', border:'1px solid rgba(224,123,41,0.2)'}}>
              {categoryInfo.icon} {categoryLabel}
            </span>
          )}
          <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">
            ⚖️ {req.weight_kg} kg
          </span>
          {req.needed_by_date && (
            <span className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{background:'rgba(26,39,68,0.06)', color:'#1A2744'}}>
              📅 {new Date(req.needed_by_date).toLocaleDateString('en-GB', {day:'numeric',month:'short'})}
            </span>
          )}
        </div>

        {/* Budget */}
        {req.budget && (
          <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
            <span className="text-xs text-gray-400">{t.budget || 'Budget'}</span>
            <span className="font-black" style={{color:'#E07B29'}}>${req.budget}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
