'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'
import { CATEGORIES, COUNTRIES } from '@/lib/translations'

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

export default function NewRequest() {
  const router = useRouter()
  const { t, isFa } = useLanguage()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    origin_city: '', origin_country: 'Canada',
    destination_city: '', destination_country: 'Iran',
    needed_by_date: '', weight_kg: '', item_description: '',
    item_category: 'other', budget: ''
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
    const { error } = await supabase.from('shipment_requests').insert({
      ...form,
      sender_id: user.id,
      weight_kg: parseFloat(form.weight_kg),
      budget: form.budget ? parseFloat(form.budget) : null,
    })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen" style={{ background: '#0B1220', paddingTop: 72 }}>
    <div className="max-w-xl mx-auto px-4 py-10" style={fontStyle}>

      <Link href="/requests" className="inline-flex items-center gap-1.5 text-sm mb-8 transition-colors"
        style={{ color: FG3 }}
        onMouseEnter={e => e.currentTarget.style.color = FG2}
        onMouseLeave={e => e.currentTarget.style.color = FG3}>
        <ArrowLeft size={15} /> {t?.backToRequests || 'Back to requests'}
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2" style={{ color: FG1, letterSpacing: '-0.025em' }}>
          {t?.postRequestTitle || 'Post a Request'}
        </h1>
        <p className="text-sm" style={{ color: FG3 }}>{t?.postRequestDesc || 'Tell travelers what you need carried and where.'}</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl p-8 space-y-5"
        style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>

        <div>
          <label style={labelStyle}>{t?.whatSending || 'What are you sending?'}</label>
          <input required type="text"
            placeholder={isFa ? 'مثلاً جعبه لباس، حدود ۳ کیلو' : 'e.g. Sealed box of clothing, approx 3kg'}
            value={form.item_description} onChange={e => set('item_description', e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
            style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>{t?.category || 'Category'}</label>
            <select value={form.item_category} onChange={e => set('item_category', e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder}>
              {CATEGORIES.map(c => (
                <option key={c.key} value={c.key}>{c.icon} {isFa ? c.fa : c.en}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>{t?.weight || 'Weight'} (kg)</label>
            <input required type="number" step="0.1" min="0.1" placeholder="2.5"
              value={form.weight_kg} onChange={e => set('weight_kg', e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
          </div>
        </div>

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
            <input required type="text" placeholder={isFa ? 'تهران' : 'Tehran'}
              value={form.destination_city} onChange={e => set('destination_city', e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>
              {t?.yourBudget || 'Budget ($)'}{' '}
              <span style={{ textTransform: 'none', fontWeight: 400 }}>({t?.optional || 'optional'})</span>
            </label>
            <input type="number" step="1" min="1" placeholder="30"
              value={form.budget} onChange={e => set('budget', e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
          </div>
          <div>
            <label style={labelStyle}>
              {t?.neededByDate || 'Needed By'}{' '}
              <span style={{ textTransform: 'none', fontWeight: 400 }}>({t?.optional || 'optional'})</span>
            </label>
            <input type="date" min={new Date().toISOString().split('T')[0]}
              value={form.needed_by_date} onChange={e => set('needed_by_date', e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
          </div>
        </div>

        {/* Declaration notice */}
        <div className="rounded-xl px-4 py-3"
          style={{ background: 'rgba(224,123,41,0.06)', border: '1px solid rgba(224,123,41,0.18)' }}>
          <p className="text-xs leading-relaxed" style={{ color: '#FAD2B0' }}>
            <strong>📋 {isFa ? 'اعلامیه ارسال:' : 'Shipment Declaration:'}</strong>{' '}
            {t?.declarationText || 'By posting, you declare this is an accurate description. This is logged as a legal record.'}
          </p>
        </div>

        {error && (
          <div className="rounded-xl px-4 py-3 text-sm"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#FCA5A5' }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full py-4 rounded-xl text-white font-bold text-base disabled:opacity-50 transition-opacity hover:opacity-90"
          style={{ background: '#E07B29' }}>
          {loading ? (t?.posting || 'Posting…') : (t?.postRequest2 || 'Post Request')}
        </button>
      </form>
    </div>
    </div>
  )
}
