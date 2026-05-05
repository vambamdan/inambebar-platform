'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Star, ShieldCheck, Users, Calendar, ArrowRight, Plus, X, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'

const CARD_BG  = '#16203A'
const HAIRLINE = 'rgba(255,255,255,0.07)'
const FG1      = '#F1F4FB'
const FG2      = '#A6B0CC'
const FG3      = '#6E7A99'

export default function CompanionPage() {
  const { isFa } = useLanguage()
  const [companions, setCompanions] = useState([])
  const [requests,   setRequests]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [tab,        setTab]        = useState('offers')
  const [filters,    setFilters]    = useState({ origin: '', destination: '' })
  const fontStyle = isFa ? { fontFamily: "'Vazirmatn', sans-serif" } : {}

  useEffect(() => { fetchAll() }, []) // eslint-disable-line

  async function fetchAll() {
    setLoading(true)
    let offersQ = supabase
      .from('companion_offers')
      .select('*, profiles(full_name, rating_avg, rating_count, is_verified)')
      .eq('status', 'active')
      .order('travel_date', { ascending: true })
    let requestsQ = supabase
      .from('companion_requests')
      .select('*, profiles(full_name, rating_avg, rating_count, is_verified)')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
    if (filters.origin) {
      offersQ   = offersQ.ilike('origin_city',  `%${filters.origin}%`)
      requestsQ = requestsQ.ilike('origin_city', `%${filters.origin}%`)
    }
    if (filters.destination) {
      offersQ   = offersQ.ilike('destination_city',  `%${filters.destination}%`)
      requestsQ = requestsQ.ilike('destination_city', `%${filters.destination}%`)
    }
    const [offersRes, requestsRes] = await Promise.all([offersQ, requestsQ])
    setCompanions(offersRes.data  || [])
    setRequests(requestsRes.data  || [])
    setLoading(false)
  }

  const items = tab === 'offers' ? companions : requests

  return (
    <div className="min-h-screen" style={{ background: '#0B1220', paddingTop: 72, ...fontStyle }}>
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* ── Page header ── */}
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1.5" style={{ color: FG1, letterSpacing: '-0.025em' }}>
              {isFa ? 'همراه سفر' : 'Travel Companion'}
            </h1>
            <p className="text-sm leading-relaxed max-w-md" style={{ color: FG3 }}>
              {isFa
                ? 'مسافرانی که می‌توانند همراه شما باشند یا نیاز به همراه دارند را پیدا کنید.'
                : 'Find travelers who can accompany you, or offer to travel alongside someone who needs support.'}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Link href="/companion/offer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold text-sm active:scale-95 transition-all"
              style={{ background: '#E07B29' }}>
              <Plus size={14} />
              {isFa ? 'ارائه همراهی' : 'Offer Companionship'}
            </Link>
            <Link href="/companion/request"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm active:scale-95 transition-all"
              style={{ color: FG2, background: 'rgba(255,255,255,0.05)', border: `1px solid ${HAIRLINE}` }}>
              <Plus size={14} />
              {isFa ? 'درخواست همراه' : 'Request a Companion'}
            </Link>
          </div>
        </div>

        {/* ── Info banner ── */}
        <div className="rounded-2xl p-5 mb-7 flex gap-4"
          style={{ background: 'rgba(46,189,122,0.05)', border: '1px solid rgba(46,189,122,0.15)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(46,189,122,0.12)' }}>
            <Users size={18} style={{ color: '#56CD93' }} strokeWidth={1.6} />
          </div>
          <div>
            <div className="font-semibold text-sm mb-1" style={{ color: '#56CD93' }}>
              {isFa ? 'همراه سفر چیست؟' : 'What is Travel Companion?'}
            </div>
            <p className="text-sm leading-relaxed" style={{ color: FG2 }}>
              {isFa
                ? 'گاهی سفر به یک همراه نیاز دارد — یک بزرگسال مسن که اولین بار تنها پرواز می‌کند، یک دانشجو که به کمک نیاز دارد. این سرویس برای همین موارد است.'
                : 'Sometimes travel requires a companion — an elderly parent flying alone, a student needing guidance, or someone who wants company on the journey. This service connects travelers making the same trip.'}
            </p>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex mb-6" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
          {[
            { key: 'offers',   en: 'Companion Offers',   fa: 'ارائه همراهی' },
            { key: 'requests', en: 'Companion Requests',  fa: 'درخواست همراه' },
          ].map(tb => (
            <button key={tb.key} onClick={() => setTab(tb.key)}
              className="relative px-5 py-3 text-sm font-semibold transition-colors"
              style={{ color: tab === tb.key ? FG1 : FG3 }}>
              {isFa ? tb.fa : tb.en}
              {tab === tb.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                  style={{ background: '#E07B29' }} />
              )}
            </button>
          ))}
        </div>

        {/* ── Search form ── */}
        <form onSubmit={e => { e.preventDefault(); fetchAll() }}
          className="rounded-2xl p-5 mb-7"
          style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { key: 'origin',      label: isFa ? 'از (شهر)' : 'From', ph: isFa ? 'مثلاً تهران'   : 'e.g. Tehran' },
              { key: 'destination', label: isFa ? 'به (شهر)' : 'To',   ph: isFa ? 'مثلاً تورنتو' : 'e.g. Toronto' },
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
            <div className="flex items-end gap-2">
              <button type="submit"
                className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-95"
                style={{ background: '#E07B29' }}>
                <Search size={14} />
                {isFa ? 'جستجو' : 'Search'}
              </button>
              {(filters.origin || filters.destination) && (
                <button type="button"
                  onClick={() => { setFilters({ origin: '', destination: '' }); fetchAll() }}
                  className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${HAIRLINE}`, color: FG3 }}>
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </form>

        {/* ── Results ── */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl p-6 animate-pulse" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }} />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 rounded w-32" style={{ background: 'rgba(255,255,255,0.07)' }} />
                    <div className="h-3 rounded w-20" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  </div>
                </div>
                <div className="h-4 rounded w-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(26,39,68,0.5)', border: `1px solid ${HAIRLINE}` }}>
              <Users size={28} style={{ color: FG2 }} strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-lg mb-2" style={{ color: FG1 }}>
              {isFa ? 'موردی یافت نشد' : 'Nothing found yet'}
            </h3>
            <p className="text-sm mb-6 max-w-xs mx-auto leading-relaxed" style={{ color: FG3 }}>
              {isFa ? 'اولین نفری باشید که یک پیشنهاد یا درخواست ثبت می‌کند.' : 'Be the first to post an offer or request.'}
            </p>
            <Link href={tab === 'offers' ? '/companion/offer' : '/companion/request'}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold text-sm"
              style={{ background: '#E07B29' }}>
              <Plus size={14} />
              {tab === 'offers' ? (isFa ? 'ارائه همراهی' : 'Offer Companionship') : (isFa ? 'درخواست همراه' : 'Request a Companion')}
            </Link>
          </div>
        ) : (
          <>
            <p className="text-xs mb-4 font-medium" style={{ color: FG3 }}>
              {items.length} {isFa ? 'مورد یافت شد' : `result${items.length !== 1 ? 's' : ''} found`}
            </p>
            <div className="space-y-3">
              {items.map(item => {
                const name    = item.profiles?.full_name || (isFa ? 'ناشناس' : 'Anonymous')
                const initial = name[0]?.toUpperCase() || '?'
                return (
                  <div key={item.id} className="card-hover rounded-2xl overflow-hidden"
                    style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #1A2744, #2E4068)' }}>
                            {initial}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-sm" style={{ color: FG1 }}>{name}</span>
                              {item.profiles?.is_verified && (
                                <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                                  style={{ background: 'rgba(46,189,122,0.10)', color: '#56CD93' }}>
                                  <ShieldCheck size={10} />
                                  {isFa ? 'تأیید شده' : 'Verified'}
                                </span>
                              )}
                            </div>
                            {item.profiles?.rating_count > 0 ? (
                              <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: FG3 }}>
                                <Star size={10} color="#E07B29" fill="#E07B29" />
                                <span>{item.profiles.rating_avg?.toFixed(1)}</span>
                                <span>· {item.profiles.rating_count} {isFa ? 'نظر' : 'reviews'}</span>
                              </div>
                            ) : (
                              <div className="text-xs mt-0.5" style={{ color: FG3 }}>{isFa ? 'جدید' : 'New member'}</div>
                            )}
                          </div>
                        </div>
                        {item.fee && (
                          <div className="text-right flex-shrink-0">
                            <div className="font-bold text-lg" style={{ color: '#E07B29', letterSpacing: '-0.015em' }}>${item.fee}</div>
                            <div className="text-xs" style={{ color: FG3 }}>{isFa ? 'پیشنهاد' : 'offer'}</div>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 flex items-center justify-between gap-4"
                        style={{ borderTop: `1px solid ${HAIRLINE}` }}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm" style={{ color: FG1 }}>{item.origin_city}</span>
                            <ArrowRight size={13} style={{ color: FG3, flexShrink: 0 }} />
                            <span className="font-semibold text-sm" style={{ color: FG1 }}>{item.destination_city}</span>
                          </div>
                          {item.travel_date && (
                            <div className="flex items-center gap-1.5 mt-1 text-xs" style={{ color: FG3 }}>
                              <Calendar size={11} />
                              {new Date(item.travel_date).toLocaleDateString(isFa ? 'fa-IR' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                          )}
                          {item.description && (
                            <p className="text-sm mt-2 leading-relaxed line-clamp-2" style={{ color: FG2 }}>
                              {item.description}
                            </p>
                          )}
                        </div>
                        <span className="flex items-center gap-1 text-xs font-semibold flex-shrink-0" style={{ color: '#E07B29' }}>
                          {isFa ? 'مشاهده' : 'View'}
                          <ArrowRight size={12} />
                        </span>
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
