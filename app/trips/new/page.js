'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const COUNTRIES = ['Iran', 'Canada', 'UAE', 'United Kingdom', 'Sweden', 'Germany', 'USA', 'Turkey', 'Other']

export default function NewTrip() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    origin_city: '', origin_country: 'Canada',
    destination_city: '', destination_country: 'Iran',
    departure_date: '', available_weight_kg: '', price_per_kg: '', notes: ''
  })

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
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2" style={{color: '#1A2744'}}>Post Your Trip ✈️</h1>
        <p className="text-gray-400 text-sm">Let senders know you have space available. You only take on what you agree to.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-5">

        {/* Origin */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">From — City</label>
            <input required type="text" placeholder="Toronto"
              value={form.origin_city} onChange={e => set('origin_city', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Country</label>
            <select value={form.origin_country} onChange={e => set('origin_country', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400">
              {COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Destination */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">To — City</label>
            <input required type="text" placeholder="Tehran"
              value={form.destination_city} onChange={e => set('destination_city', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Country</label>
            <select value={form.destination_country} onChange={e => set('destination_country', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400">
              {COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Departure Date</label>
          <input required type="date" min={new Date().toISOString().split('T')[0]}
            value={form.departure_date} onChange={e => set('departure_date', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"/>
        </div>

        {/* Weight & Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Available Weight (kg)</label>
            <input required type="number" step="any" min="0.1" placeholder="5"
              value={form.available_weight_kg} onChange={e => set('available_weight_kg', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Price per kg ($)</label>
            <input required type="number" step="0.5" min="1" placeholder="10"
              value={form.price_per_kg} onChange={e => set('price_per_kg', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"/>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Notes (optional)</label>
          <textarea placeholder="e.g. Only accepting sealed packages. No liquids."
            value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 resize-none"/>
        </div>

        {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg px-4 py-3">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full py-4 rounded-xl text-white font-bold text-base transition-all hover:opacity-90 disabled:opacity-50"
          style={{background: '#E07B29'}}>
          {loading ? 'Posting...' : 'Post My Trip →'}
        </button>
      </form>
    </div>
  )
}
