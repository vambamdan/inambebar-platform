'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const COUNTRIES = ['Iran', 'Canada', 'UAE', 'United Kingdom', 'Sweden', 'Germany', 'USA', 'Turkey', 'Other']
const CATEGORIES = ['documents', 'electronics', 'clothing', 'food', 'medicine', 'cosmetics', 'other']

export default function NewRequest() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    origin_city: '', origin_country: 'Canada',
    destination_city: '', destination_country: 'Iran',
    needed_by_date: '', weight_kg: '', item_description: '',
    item_category: 'other', budget: '', declared_value: ''
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
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2" style={{color: '#1A2744'}}>Post a Shipment 📦</h1>
        <p className="text-gray-400 text-sm">Describe what you need sent. Travelers on your route will see this and can offer to carry it.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-5">

        {/* Item details */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">What are you sending?</label>
          <input required type="text" placeholder="e.g. Sealed box of clothing, approx 3kg"
            value={form.item_description} onChange={e => set('item_description', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"/>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Category</label>
            <select value={form.item_category} onChange={e => set('item_category', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400">
              {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Weight (kg)</label>
            <input required type="number" step="0.5" min="0.1" placeholder="2.5"
              value={form.weight_kg} onChange={e => set('weight_kg', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"/>
          </div>
        </div>

        {/* Route */}
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

        {/* Budget & Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Your Budget ($) <span className="normal-case font-normal">optional</span></label>
            <input type="number" step="1" min="1" placeholder="30"
              value={form.budget} onChange={e => set('budget', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Needed by <span className="normal-case font-normal">optional</span></label>
            <input type="date" min={new Date().toISOString().split('T')[0]}
              value={form.needed_by_date} onChange={e => set('needed_by_date', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"/>
          </div>
        </div>

        {/* Declaration notice */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          <p className="text-xs text-amber-700 leading-relaxed">
            <strong>📋 Shipment Declaration:</strong> By posting this request, you confirm the item description above is accurate and complete. This declaration is stored and may be used in case of any dispute.
          </p>
        </div>

        {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg px-4 py-3">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full py-4 rounded-xl text-white font-bold text-base transition-all hover:opacity-90 disabled:opacity-50"
          style={{background: '#E07B29'}}>
          {loading ? 'Posting...' : 'Post My Request →'}
        </button>
      </form>
    </div>
  )
}
