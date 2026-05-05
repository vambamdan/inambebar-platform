'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Star, ShieldCheck, Plane, Calendar,
  FileText, Shirt, Laptop, Sparkles, Wind, Pill, UtensilsCrossed,
  Package, MessageSquare, ArrowRight, Plus, Search,
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

export default function TripsPage() {
  const { t, isFa, lang } = useLanguage()
  const [trips, setTrips]     = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ origin: '', destination: '', category: '' })
  const fontStyle = isFa ? { fontFamily: "'Vazirmatn', sans-serif" } : {}
  const locale    = lang === 'fa' ? 'fa-IR' : 'en-GB'

  useEffect(() => { fetchTrips() }, []) // eslint-disable-line

  async function fetchTrips() {
    setLoading(true)
    let query = supabase
      .from('trips')
      .select('*, profiles(full_name, rating_avg, rating_count, is_verified)')
      .eq('status', 'active')
      .gte('departure_date', new Date().toISOString().split('T')[0])
      .order('departure_date', { ascending: true })
    if (filters.origin)      query = query.ilike('origin_city',      `%${filters.origin}%`)
    if (filters.destination) query = query.ilike('destination_city', `%${filters.destination}%`)
    const { data } = await query
    setTrips(data || [])
    setLoading(false)
  }

  return (
    <div className="min-h-screen" style={{ background: '#0B1220', paddingTop: 72, ...fontStyle }}>
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* ── Page header ── */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1.5" style={{ color: FG1, letterSpacing: '-0.025em' }}>
              {t.findTravelerTitle || 'Find a Traveler'}
            </h1>
            <p className="text-sm leading-relaxed max-w-md" style={{ color: FG3 }}>
              {t.findTravelerSubtitle || 'Browse travelers heading your way and send your package with them.'}
            </p>
          </div>
          <Link href="/trips/new"
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold text-sm active:scale-95 transition-all"
            style={{ background: '#233355', border: `1px solid ${HAIRLINE}` }}>
            <Plus size={14} />
            {t.postTrip || 'Post a Trip'}
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

        {/* ── Search form ── */}
        <form onSubmit={e => { e.preventDefault(); fetchTrips() }}
          className="rounded-2xl p-5 mb-7"
          style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { key: 'origin',      label: t.from || 'From',   ph: isFa ? 'مثلاً تهران' : 'e.g. Tehran' },
              { key: 'destination', label: t.to   || 'To',     ph: isFa ? 'مثلاً تورنتو' : 'e.g. Toronto' },
            ].map(({ key, label, ph }) => (
              <div key={key}>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: FG3, letterSpacing: '0.07em' }}>
                  {label}
                </label>
                <input type="text" placeholder={ph}
                  value={filters[key]}
                  onChange={e => setFilters(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors"
                  style={{ background: '#0F1730', border: `1px solid ${HAIRLINE}`, color: FG1 }} />
              </div>
            ))}
            <div className="flex items-end">
              <button type="submit"
                className="w-full py-2.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
                style={{ background: '#E07B29' }}>
                <Search size={14} />
                {t.searchTravelers || 'Search'}
              </button>
            </div>
          </div>
        </form>

        {/* ── Results ── */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl p-6 animate-pulse" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }} />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 rounded w-32" style={{ background: 'rgba(255,255,255,0.07)' }} />
                    <div className="h-3 rounded w-20" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  </div>
                  <div className="h-7 rounded-lg w-16" style={{ background: 'rgba(255,255,255,0.07)' }} />
                </div>
                <div className="h-4 rounded w-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
              </div>
            ))}
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(26,39,68,0.5)', border: `1px solid ${HAIRLINE}` }}>
              <Plane size={28} style={{ color: FG2 }} strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-lg mb-2" style={{ color: FG1 }}>
              {t.noTripsFound || 'No trips found'}
            </h3>
            <p className="text-sm mb-6 max-w-xs mx-auto leading-relaxed" style={{ color: FG3 }}>
              {t.noTripsDesc || 'No travelers match your route right now.'}
            </p>
            <Link href="/trips/new"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold text-sm"
              style={{ background: '#E07B29' }}>
              <Plus size={14} />
              {t.postTrip || 'Post a Trip'}
            </Link>
          </div>
        ) : (
          <>
            <p className="text-xs mb-4 font-medium" style={{ color: FG3 }}>
              {trips.length} {isFa ? 'مسافر یافت شد' : `traveler${trips.length !== 1 ? 's' : ''} found`}
            </p>
            <div className="space-y-3">
              {trips.map(trip => {
                const name    = trip.profiles?.full_name || (isFa ? 'ناشناس' : 'Anonymous')
                const initial = name[0]?.toUpperCase() || '?'
                const depDate = new Date(trip.departure_date).toLocaleDateString(locale, {
                  weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
                })
                return (
                  <div key={trip.id} className="card-hover rounded-2xl overflow-hidden"
                    style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <Link href={`/profile/${trip.traveler_id}`}>
                            <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0 hover:opacity-80 transition-opacity"
                              style={{ background: 'linear-gradient(135deg, #1A2744, #2E4068)' }}>
                              {initial}
                            </div>
                          </Link>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Link href={`/profile/${trip.traveler_id}`}
                                className="font-semibold text-sm hover:opacity-80 transition-opacity"
                                style={{ color: FG1 }}>
                                {name}
                              </Link>
                              {trip.profiles?.is_verified && (
                                <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                                  style={{ background: 'rgba(46,189,122,0.10)', color: '#56CD93' }}>
                                  <ShieldCheck size={10} />
                                  {t.verified || 'Verified'}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: FG3 }}>
                              <Star size={11} color="#E07B29" fill="#E07B29" />
                              <span>{trip.profiles?.rating_avg?.toFixed(1) || (isFa ? 'جدید' : t.newUser || 'New')}</span>
                              {trip.profiles?.rating_count > 0 && (
                                <span>· {trip.profiles.rating_count} {t.reviews || 'reviews'}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className="text-lg font-bold" style={{ color: '#E07B29', letterSpacing: '-0.015em' }}>
                            ${trip.price_per_kg}
                            <span className="text-xs font-normal ml-0.5" style={{ color: FG3 }}>{t.perKg || '/kg'}</span>
                          </div>
                          <div className="text-xs mt-0.5" style={{ color: FG3 }}>
                            {trip.available_weight_kg}kg {t.available || 'available'}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 flex items-center justify-between gap-4"
                        style={{ borderTop: `1px solid ${HAIRLINE}` }}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm" style={{ color: FG1 }}>
                              {trip.origin_city}{trip.origin_country ? `, ${trip.origin_country}` : ''}
                            </span>
                            <ArrowRight size={13} style={{ color: FG3, flexShrink: 0 }} />
                            <span className="font-semibold text-sm" style={{ color: FG1 }}>
                              {trip.destination_city}{trip.destination_country ? `, ${trip.destination_country}` : ''}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 text-xs" style={{ color: FG3 }}>
                            <Calendar size={11} />
                            <span>{t.departing || 'Departing'} {depDate}</span>
                          </div>
                          {trip.notes && (
                            <div className="flex items-start gap-1.5 mt-2">
                              <MessageSquare size={11} style={{ color: FG3, flexShrink: 0, marginTop: 2 }} />
                              <p className="text-xs leading-relaxed line-clamp-2 italic" style={{ color: FG3 }}>
                                &ldquo;{trip.notes}&rdquo;
                              </p>
                            </div>
                          )}
                        </div>

                        <Link href={`/trips/${trip.id}`}
                          className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-white font-semibold text-sm active:scale-95 transition-all"
                          style={{ background: '#E07B29' }}>
                          {t.viewContact || 'View'}
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
