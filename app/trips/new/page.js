'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'
import { COUNTRIES, IRANIAN_CITIES } from '@/lib/translations'

const CARD_BG  = '#16203A'
const HAIRLINE = 'rgba(255,255,255,0.07)'
const FG1      = '#F1F4FB'
const FG2      = '#A6B0CC'
const FG3      = '#6E7A99'

const inputStyle = {
  background: '#0F1730',
  border: `1px solid ${HAIRLINE}`,
  color: FG1,
}
const labelStyle = {
  color: FG3,
  fontSize: '0.7rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  display: 'block',
  marginBottom: '6px',
}

export default function NewTrip() {
  const router = useRouter()
  const { t, isFa } = useLanguage()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    origin_city: '', origin_country: 'Germany',
    destination_city: 'Tehran', destination_country: 'Iran',
    departure_date: '', available_weight_kg: '', price_per_kg: '', notes: ''
  })
  const fontStyle = isFa ? { fontFamily: "'Vazirmatn', sans-serif" } : {}

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/auth')
      else setUser(data.user)
    })
  }, [router])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function focusBorder(e) { e.target.style.borderColor = 'rgba(224,123,41,0.40)' }
  function blurBorder(e)  { e.target.style.borderColor = HAIRLINE }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.from('trips').insert({
      ...form,
      traveler_id: user.id,
      available_weight_kg: parseFloat(form.available_weight_kg),
      price_per_kg: parseFloat(form.price_per_kg),
    })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen" style={{ background: '#0B1220', paddingTop: 72 }}>
    <div className="max-w-xl mx-auto px-4 py-10" style={fontStyle}>

      <Link href="/trips" className="inline-flex items-center gap-1.5 text-sm mb-8 transition-colors"
        style={{ color: FG3 }}
        onMouseEnter={e => e.currentTarget.style.color = FG2}
        onMouseLeave={e => e.currentTarget.style.color = FG3}>
        <ArrowLeft size={15} /> {t?.backToTravelers || 'Back to travelers'}
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2" style={{ color: FG1, letterSpacing: '-0.025em' }}>
          {t?.postTripTitle || 'Post a Trip'}
        </h1>
        <p className="text-sm" style={{ color: FG3 }}>{t?.postTripDesc || 'List your available luggage space and earn by helping senders.'}</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl p-8 space-y-5"
        style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>{t?.fromCity || 'From City'}</label>
            <input required type="text" placeholder={isFa ? 'تورنتو' : 'Toronto'}
              value={form.origin_city} onChange={e => set('origin_city', e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
          </div>
          <div>
            <label style={labelStyle}>{t?.country || 'Country'}</label>
            <select value={form.origin_country} onChange={e => set('origin_country', e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder}>
              {COUNTRIES.map(c => <option key={c.en} value={c.en}>{isFa ? c.fa : c.en}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>{t?.toCity || 'To City'}</label>
            <select value={form.destination_city} onChange={e => set('destination_city', e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder}>
              <option value="">{isFa ? 'انتخاب شهر...' : 'Select city...'}</option>
              <optgroup label={isFa ? 'شهرهای ایران' : 'Iranian Cities'}>
                {IRANIAN_CITIES.map(city => <option key={city.en} value={city.en}>{isFa ? city.fa : city.en}</option>)}
              </optgroup>
              <optgroup label={isFa ? 'سایر شهرها' : 'Other Cities'}>
                {['Toronto','London','Dubai','Stockholm','Frankfurt','Amsterdam','Los Angeles','Paris','Rome','Muscat','Doha','Kuala Lumpur','Seoul','Sydney'].map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </optgroup>
            </select>
          </div>
          <div>
            <label style={labelStyle}>{t?.country || 'Country'}</label>
            <select value={form.destination_country} onChange={e => set('destination_country', e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder}>
              {COUNTRIES.map(c => <option key={c.en} value={c.en}>{isFa ? c.fa : c.en}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>{t?.departureDate || 'Departure Date'}</label>
          <input required type="date" min={new Date().toISOString().split('T')[0]}
            value={form.departure_date} onChange={e => set('departure_date', e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
            style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>{t?.availableWeight || 'Available Weight (kg)'}</label>
            <input required type="number" step="0.1" min="0.1" placeholder="5"
              value={form.available_weight_kg} onChange={e => set('available_weight_kg', e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
          </div>
          <div>
            <label style={labelStyle}>{t?.pricePerKg || 'Price per kg ($)'}</label>
            <input required type="number" step="0.5" min="1" placeholder="10"
              value={form.price_per_kg} onChange={e => set('price_per_kg', e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>{t?.notes || 'Notes'}</label>
          <textarea
            placeholder={isFa ? 'مثلاً: فقط بسته‌های درزبندی شده. بدون مایعات.' : 'e.g. Only sealed packages. No liquids.'}
            value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none resize-none"
            style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
        </div>

        {error && (
          <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#FCA5A5' }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full py-4 rounded-xl text-white font-bold text-base disabled:opacity-50 transition-opacity hover:opacity-90"
          style={{ background: '#E07B29' }}>
          {loading ? (t?.posting || 'Posting…') : (t?.postTrip || 'Post Trip')}
        </button>
      </form>
    </div>
    </div>
  )
}
