'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'
import { CATEGORIES, COUNTRIES } from '@/lib/translations'

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

  const set = (k, v) => setForm(f => ({...f, [k]: v}))

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
    <div className="max-w-xl mx-auto px-4 py-10" style={fontStyle}>
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2" style={{color:'#1A2744'}}>{t.postRequestTitle}</h1>
        <p className="text-gray-400 text-sm">{t.postRequestDesc}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-5">

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">{t.whatSending}</label>
          <input required type="text" placeholder={isFa ? 'مثلاً جعبه لباس، حدود ۳ کیلو' : 'e.g. Sealed box of clothing, approx 3kg'}
            value={form.item_description} onChange={e => set('item_description', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"/>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">{t.category}</label>
            <select value={form.item_category} onChange={e => set('item_category', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400">
              {CATEGORIES.map(c => (
                <option key={c.key} value={c.key}>{c.icon} {isFa ? c.fa : c.en}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">{t.weight} (kg)</label>
            <input required type="number" step="0.1" min="0.1" placeholder="2.5"
              value={form.weight_kg} onChange={e => set('weight_kg', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"/>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">{t.fromCity}</label>
            <input required type="text" placeholder={isFa ? 'تورنتو' : 'Toronto'}
              value={form.origin_city} onChange={e => set('origin_city', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">{t.country}</label>
            <select value={form.origin_country} onChange={e => set('origin_country', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400">
              {COUNTRIES.map(c => <option key={c.en} value={c.en}>{isFa ? c.fa : c.en}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">{t.toCity}</label>
            <input required type="text" placeholder={isFa ? 'تهران' : 'Tehran'}
              value={form.destination_city} onChange={e => set('destination_city', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">{t.country}</label>
            <select value={form.destination_country} onChange={e => set('destination_country', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400">
              {COUNTRIES.map(c => <option key={c.en} value={c.en}>{isFa ? c.fa : c.en}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
              {t.yourBudget} <span className="normal-case font-normal">({t.optional})</span>
            </label>
            <input type="number" step="1" min="1" placeholder="30"
              value={form.budget} onChange={e => set('budget', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
              {t.neededByDate} <span className="normal-case font-normal">({t.optional})</span>
            </label>
            <input type="date" min={new Date().toISOString().split('T')[0]}
              value={form.needed_by_date} onChange={e => set('needed_by_date', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"/>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          <p className="text-xs text-amber-700 leading-relaxed">
            <strong>📋 {isFa ? 'اعلامیه ارسال:' : 'Shipment Declaration:'}</strong> {t.declarationText}
          </p>
        </div>

        {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg px-4 py-3">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full py-4 rounded-xl text-white font-bold text-base disabled:opacity-50"
          style={{background:'#E07B29'}}>
          {loading ? t.posting : t.postRequest2}
        </button>
      </form>
    </div>
  )
}
