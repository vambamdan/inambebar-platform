'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Star, ShieldCheck, Scale, Calendar, Package,
  FileText, Shirt, Laptop, Sparkles, Wind, Pill, UtensilsCrossed,
  ArrowRight, Plus, Search,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'
import { CATEGORIES } from '@/lib/translations'

const CATEGORY_ICONS = {
  documents: FileText, clothing: Shirt, electronics: Laptop,
  cosmetics: Sparkles, cigarettes: Wind, medicine: Pill,
  food: UtensilsCrossed, other: Package,
}

const CARD_BG  = '#16203A'
const HAIRLINE = 'rgba(255,255,255,0.07)'
const FG1      = '#F1F4FB'
const FG2      = '#A6B0CC'
const FG3      = '#6E7A99'

export default function RequestsPage() {
  const { t, isFa, lang } = useLanguage()
  const [requests, setRequests] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filters, setFilters]   = useState({ search: '', category: '' })
  const fontStyle = isFa ? { fontFamily: "'Vazirmatn', sans-serif" } : {}

  useEffect(() => { fetchRequests() }, []) // eslint-disable-line

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

  const visible = filters.search
    ? requests.filter(r =>
        r.origin_city?.toLowerCase().includes(filters.search.toLowerCase()) ||
        r.destination_city?.toLowerCase().includes(filters.search.toLowerCase()) ||
        r.item_description?.toLowerCase().includes(filters.search.toLowerCase())
      )
    : requests

  return (
    <div className="min-h-screen" style={{ background: '#0B1220', paddingTop: 72, ...fontStyle }}>
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* ── Page header ── */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1.5" style={{ color: FG1, letterSpacing: '-0.025em' }}>
              {t.browseRequests || 'Browse Requests'}
            </h1>
            <p className="text-sm leading-relaxed max-w-md" style={{ color: FG3 }}>
              {t.findPackages || 'Find senders who need a package carried on your route.'}
            </p>
          </div>
          <Link href="/requests/new"
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold text-sm active:scale-95 transition-all"
            style={{ background: '#E07B29' }}>
            <Plus size={14} />
            {t.postRequest || 'Post a Request'}
          </Link>
        </div>

        {/* ── Category filter pills ── */}
        <div className="flex gap-2 flex-wrap mb-5">
          <button
            onClick={() => setFilters(f => ({ ...f, category: '' }))}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={!filters.category
              ? { background: '#E07B29', color: '#fff', border: '1px solid transparent' }
              : { background: 'rgba(255,255,255,0.05)', color: FG2, border: `1px solid ${HAIRLINE}` }}>
            {isFa ? 'همه' : 'All'}
          </button>
          {CATEGORIES.map(cat => {
            const Icon   = CATEGORY_ICONS[cat.key] || Package
            const active = filters.category === cat.key
            return (
              <button key={cat.key}
                onClick={() => setFilters(f => ({ ...f, category: active ? '' : cat.key }))}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={active
                  ? { background: '#E07B29', color: '#fff', border: '1px solid transparent' }
                  : { background: 'rgba(255,255,255,0.05)', color: FG2, border: `1px solid ${HAIRLINE}` }}>
                <Icon size={12} />
                {isFa ? cat.fa : cat.en}
              </button>
            )
          })}
        </div>

        {/* ── Search ── */}
        <form onSubmit={e => { e.preventDefault(); fetchRequests() }}
          className="rounded-2xl p-5 mb-7"
          style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: FG3, letterSpacing: '0.07em' }}>
                {isFa ? 'جستجو بر اساس شهر یا توضیحات' : 'Search by city or description'}
              </label>
              <input type="text"
                placeholder={isFa ? 'مثلاً تهران، لپتاپ...' : 'e.g. Tehran, laptop...'}
                value={filters.search}
                onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors"
                style={{ background: '#0F1730', border: `1px solid ${HAIRLINE}`, color: FG1 }} />
            </div>
            <div className="flex items-end">
              <button type="submit"
                className="w-full py-2.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
                style={{ background: '#E07B29' }}>
                <Search size={14} />
                {t.searchTravelers || (isFa ? 'جستجو' : 'Search')}
              </button>
            </div>
          </div>
        </form>

        {/* ── Results ── */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="rounded-2xl p-5 animate-pulse" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }} />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 rounded w-28" style={{ background: 'rgba(255,255,255,0.07)' }} />
                    <div className="h-3 rounded w-16" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 rounded" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  <div className="h-3 rounded w-3/4" style={{ background: 'rgba(255,255,255,0.04)' }} />
                </div>
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(224,123,41,0.08)', border: '1px solid rgba(224,123,41,0.15)' }}>
              <Package size={28} style={{ color: '#E07B29' }} strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-lg mb-2" style={{ color: FG1 }}>
              {isFa ? 'درخواستی یافت نشد' : 'No requests found'}
            </h3>
            <p className="text-sm mb-6 max-w-xs mx-auto leading-relaxed" style={{ color: FG3 }}>
              {isFa ? 'اولین نفری باشید که درخواست ارسال ثبت می‌کند.' : 'Be the first to post a shipment request.'}
            </p>
            <Link href="/requests/new"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold text-sm"
              style={{ background: '#E07B29' }}>
              <Plus size={14} />
              {t.postRequest || 'Post a Request'}
            </Link>
          </div>
        ) : (
          <>
            <p className="text-xs mb-4 font-medium" style={{ color: FG3 }}>
              {visible.length} {isFa ? 'درخواست یافت شد' : `request${visible.length !== 1 ? 's' : ''} found`}
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              {visible.map(req => (
                <RequestCard key={req.id} req={req} t={t} isFa={isFa} lang={lang} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function RequestCard({ req, t, isFa, lang }) {
  const categoryInfo  = CATEGORIES.find(c => c.key === req.item_category)
  const categoryLabel = categoryInfo ? (isFa ? categoryInfo.fa : categoryInfo.en) : req.item_category
  const CategoryIcon  = CATEGORY_ICONS[req.item_category] || Package
  const locale        = lang === 'fa' ? 'fa-IR' : 'en-GB'
  const name          = req.profiles?.full_name || (isFa ? 'ناشناس' : 'Anonymous')
  const initial       = name[0]?.toUpperCase() || '?'

  return (
    <Link href={`/requests/${req.id}`} className="block group">
      <div className="rounded-2xl h-full overflow-hidden card-hover"
        style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
        <div className="p-5">
          {/* Sender row */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #1A2744, #2E4068)' }}>
              {req.profiles?.avatar_url
                ? <img src={req.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                : initial}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm truncate" style={{ color: FG1 }}>{name}</span>
                {req.profiles?.is_verified && (
                  <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: 'rgba(46,189,122,0.10)', color: '#56CD93' }}>
                    <ShieldCheck size={10} />
                    {t.verified || 'Verified'}
                  </span>
                )}
              </div>
              {req.profiles?.rating_count > 0 && (
                <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: FG3 }}>
                  <Star size={10} color="#E07B29" fill="#E07B29" />
                  <span>{req.profiles.rating_avg?.toFixed(1)}</span>
                  <span>· {req.profiles.rating_count} {t.reviews || 'reviews'}</span>
                </div>
              )}
            </div>
            {req.budget && (
              <div className="flex-shrink-0 text-right">
                <div className="font-bold text-base" style={{ color: '#E07B29', letterSpacing: '-0.015em' }}>
                  ${req.budget}
                </div>
                <div className="text-xs" style={{ color: FG3 }}>{t.budget || 'budget'}</div>
              </div>
            )}
          </div>

          {/* Route */}
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="font-semibold text-sm" style={{ color: FG1 }}>
              {req.origin_city}{req.origin_country ? `, ${req.origin_country}` : ''}
            </span>
            <ArrowRight size={13} style={{ color: FG3, flexShrink: 0 }} />
            <span className="font-semibold text-sm" style={{ color: FG1 }}>
              {req.destination_city}{req.destination_country ? `, ${req.destination_country}` : ''}
            </span>
          </div>

          {req.item_description && (
            <p className="text-sm mb-3 line-clamp-2 leading-relaxed" style={{ color: FG2 }}>
              {req.item_description}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {categoryInfo && (
              <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: 'rgba(224,123,41,0.08)', color: '#E07B29', border: '1px solid rgba(224,123,41,0.18)' }}>
                <CategoryIcon size={11} />
                {categoryLabel}
              </span>
            )}
            {req.weight_kg && (
              <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: 'rgba(255,255,255,0.05)', color: FG2, border: `1px solid ${HAIRLINE}` }}>
                <Scale size={11} />
                {req.weight_kg} kg
              </span>
            )}
            {req.needed_by_date && (
              <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: 'rgba(255,255,255,0.05)', color: FG2, border: `1px solid ${HAIRLINE}` }}>
                <Calendar size={11} />
                {new Date(req.needed_by_date).toLocaleDateString(locale, { day: 'numeric', month: 'short' })}
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 flex items-center justify-between"
          style={{ borderTop: `1px solid ${HAIRLINE}`, background: 'rgba(255,255,255,0.02)' }}>
          <span className="text-xs" style={{ color: FG3 }}>
            {new Date(req.created_at).toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-GB', { day: 'numeric', month: 'short' })}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold group-hover:gap-2 transition-all" style={{ color: '#E07B29' }}>
            {t.viewContact || 'View & Offer'}
            <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  )
}
