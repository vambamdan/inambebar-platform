'use client'

import { useState } from 'react'
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

export default function CompanionRequestPage() {
  const { isFa } = useLanguage()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    origin_city: '', origin_country: '', destination_city: '',
    needed_by_date: '', needs: '', details: '', budget: '',
  })

  const fontStyle = isFa ? { fontFamily: "'Vazirmatn', sans-serif" } : {}

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }) }
  function focusBorder(e) { e.target.style.borderColor = 'rgba(224,123,41,0.40)' }
  function blurBorder(e)  { e.target.style.borderColor = HAIRLINE }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth?redirect=/companion/request'); return }
    const { error: err } = await supabase.from('companion_requests').insert({
      sender_id: user.id,
      origin_city: form.origin_city, origin_country: form.origin_country,
      destination_city: form.destination_city, destination_country: 'Iran',
      needed_by_date: form.needed_by_date || null,
      needs: form.needs, details: form.details,
      budget: form.budget ? parseFloat(form.budget) : null,
    })
    if (err) { setError(err.message); setLoading(false) }
    else { router.push('/companion?tab=requests') }
  }

  const needsOptions = [
    { key: 'airport',     en: 'Airport pickup/drop-off', fa: 'رفت‌وآمد فرودگاهی' },
    { key: 'customs',     en: 'Customs guidance',         fa: 'راهنمایی گمرک' },
    { key: 'translation', en: 'Translation help',         fa: 'کمک ترجمه' },
    { key: 'errands',     en: 'Local errands',            fa: 'کارهای محلی' },
    { key: 'packages',    en: 'Carry packages',           fa: 'حمل بسته' },
    { key: 'navigation',  en: 'City navigation',          fa: 'راهنمای شهری' },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#0B1220', paddingTop: 72 }}>
    <div className="max-w-2xl mx-auto px-4 py-10" style={fontStyle}>

      <Link href="/companion" className="inline-flex items-center gap-1.5 text-sm mb-8 transition-colors"
        style={{ color: FG3 }}
        onMouseEnter={e => e.currentTarget.style.color = FG2}
        onMouseLeave={e => e.currentTarget.style.color = FG3}>
        <ArrowLeft size={15} /> {isFa ? 'بازگشت' : 'Back to Companion'}
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2" style={{ color: FG1, letterSpacing: '-0.025em' }}>
          {isFa ? 'درخواست همراه سفر' : 'Request a Travel Companion'}
        </h1>
        <p className="text-sm" style={{ color: FG3 }}>
          {isFa
            ? 'به کمک نیاز دارید؟ درخواست خود را ثبت کنید تا مسافران با تجربه با شما تماس بگیرند.'
            : 'Need help with your trip to Iran? Post your request and experienced travelers will reach out.'}
        </p>
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 mb-6 text-sm"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#FCA5A5' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl p-8 space-y-6"
        style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>{isFa ? 'شهر شما' : 'Your City'} *</label>
            <input name="origin_city" required value={form.origin_city} onChange={handleChange}
              className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder}
              placeholder={isFa ? 'مثلاً ونکوور' : 'e.g. Vancouver'} />
          </div>
          <div>
            <label style={labelStyle}>{isFa ? 'کشور شما' : 'Your Country'} *</label>
            <select name="origin_country" required value={form.origin_country} onChange={handleChange}
              className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder}>
              <option value="">{isFa ? 'انتخاب کنید' : 'Select country'}</option>
              {COUNTRIES.map((c) => <option key={c.code} value={isFa ? c.fa : c.en}>{isFa ? c.fa : c.en}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>{isFa ? 'شهر مقصد در ایران' : 'Destination in Iran'} *</label>
            <select name="destination_city" required value={form.destination_city} onChange={handleChange}
              className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder}>
              <option value="">{isFa ? 'انتخاب کنید' : 'Select city'}</option>
              {IRANIAN_CITIES.map((city) => <option key={city.en} value={isFa ? city.fa : city.en}>{isFa ? city.fa : city.en}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>
              {isFa ? 'تاریخ نیاز' : 'Needed By'}{' '}
              <span style={{ textTransform: 'none', fontWeight: 400 }}>({isFa ? 'اختیاری' : 'optional'})</span>
            </label>
            <input type="date" name="needed_by_date" value={form.needed_by_date} onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none"
              style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>{isFa ? 'به چه کمکی نیاز دارید؟' : 'What kind of help do you need?'}</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {needsOptions.map((opt) => {
              const val = isFa ? opt.fa : opt.en
              const curr = form.needs ? form.needs.split(', ') : []
              const checked = curr.includes(val)
              return (
                <label key={opt.key}
                  className="flex items-center gap-2.5 text-sm cursor-pointer px-3 py-2 rounded-xl transition-colors"
                  style={{
                    background: checked ? 'rgba(224,123,41,0.08)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${checked ? 'rgba(224,123,41,0.30)' : HAIRLINE}`,
                    color: checked ? '#E07B29' : FG2,
                  }}>
                  <input type="checkbox" value={val} checked={checked} className="rounded"
                    style={{ accentColor: '#E07B29' }}
                    onChange={(e) => {
                      const newCurr = form.needs ? form.needs.split(', ') : []
                      setForm({ ...form, needs: e.target.checked
                        ? [...newCurr, val].join(', ')
                        : newCurr.filter(s => s !== val).join(', ') })
                    }} />
                  {isFa ? opt.fa : opt.en}
                </label>
              )
            })}
          </div>
        </div>

        <div>
          <label style={labelStyle}>{isFa ? 'توضیحات بیشتر' : 'Additional Details'}</label>
          <textarea name="details" rows={4} value={form.details} onChange={handleChange}
            placeholder={isFa
              ? 'هر اطلاعات مفیدی را بنویسید: تعداد چمدان، شماره پرواز...'
              : 'Any helpful details: number of bags, flight number, preferred language...'}
            className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none resize-none"
            style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
        </div>

        <div>
          <label style={labelStyle}>
            {isFa ? 'بودجه پیشنهادی ($، اختیاری)' : 'Budget (USD, optional)'}
          </label>
          <input type="number" name="budget" value={form.budget} onChange={handleChange} min="0" step="5" placeholder="0"
            className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none"
            style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-3.5 rounded-xl font-semibold text-white transition-opacity disabled:opacity-50 hover:opacity-90"
          style={{ background: '#E07B29' }}>
          {loading
            ? (isFa ? 'در حال ثبت...' : 'Posting…')
            : (isFa ? 'ثبت درخواست' : 'Post Request')}
        </button>
      </form>
    </div>
    </div>
  )
}
