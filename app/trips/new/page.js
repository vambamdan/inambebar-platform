'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/lib/LanguageContext'
import { COUNTRIES, IRANIAN_CITIES } from '@/lib/translations'

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

  const set = (k, v) => setForm(f => ({...f, [k]: v}))

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
    <div className="max-w-xl mx-auto px-4 py-10" style={fontStyle}>
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2" style={{color:'#1A2744'}}>{t.postTripTitle}</h1>
        <p className="text-gray-400 text-sm">{t.postTripDesc}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-5">

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
            <select value={form.destination_city} onChange={e => set('destination_city', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400">
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
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">{t.country}</label>
            <select value={form.destination_country} onChange={e => set('destination_country', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400">
              {COUNTRIES.map(c => <option key={c.en} value={c.en}>{isFa ? c.fa : c.en}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">{t.departureDate}</label>
          <input required type="date" min={new Date().toISOString().split('T')[0]}
            value={form.departure_date} onChange={e => set('departure_date', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"/>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">{t.availableWeight}</label>
            <input required type="number" step="0.1" min="0.1" placeholder="5"
              value={form.available_weight_kg} onChange={e => set('available_weight_kg', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">{t.pricePerKg}</label>
            <input required type="number" step="0.5" min="1" placeholder="10"
              value={form.price_per_kg} onChange={e => set('price_per_kg', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"/>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">{t.notes}</label>
          <textarea placeholder={isFa ? 'مثلاً: فقط بسته‌های درزبندی شده. بدون مایعات.' : 'e.g. Only sealed packages. No liquids.'}
            value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 resize-none"/>
        </div>

        {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg px-4 py-3">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full py-4 rounded-xl text-white font-bold text-base disabled:opacity-50"
          style={{background:'#E07B29'}}>
          {loading ? t.posting : t.postTrip}
        </button>
      </form>
    </div>
  )
}
