'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/LanguageContext';
import { COUNTRIES, IRANIAN_CITIES } from '@/lib/translations';

export default function CompanionRequestPage() {
  const { isFa } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    origin_city: '', origin_country: '', destination_city: '',
    needed_by_date: '', needs: '', details: '', budget: '',
  });

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/auth?redirect=/companion/request'); return; }
    const { error: err } = await supabase.from('companion_requests').insert({
      sender_id: user.id,
      origin_city: form.origin_city, origin_country: form.origin_country,
      destination_city: form.destination_city, destination_country: 'Iran',
      needed_by_date: form.needed_by_date || null,
      needs: form.needs, details: form.details,
      budget: form.budget ? parseFloat(form.budget) : null,
    });
    if (err) { setError(err.message); setLoading(false); }
    else { router.push('/companion?tab=requests'); }
  }

  const needsOptions = [
    { key: 'airport', en: 'Airport pickup/drop-off', fa: 'رفت‌وآمد فرودگاهی' },
    { key: 'customs', en: 'Customs guidance', fa: 'راهنمایی گمرک' },
    { key: 'translation', en: 'Translation help', fa: 'کمک ترجمه' },
    { key: 'errands', en: 'Local errands', fa: 'کارهای محلی' },
    { key: 'packages', en: 'Carry packages', fa: 'حمل بسته' },
    { key: 'navigation', en: 'City navigation', fa: 'راهنمای شهری' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isFa ? 'درخواست همراه سفر' : 'Request a Travel Companion'}
        </h1>
        <p className="text-gray-500 mb-8">
          {isFa ? 'به کمک نیاز دارید؟ درخواست خود را ثبت کنید تا مسافران با تجربه با شما تماس بگیرند.'
            : 'Need help with your trip to Iran? Post your request and experienced travelers will reach out.'}
        </p>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">{error}</div>}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{isFa ? 'شهر شما' : 'Your City'} *</label>
              <input name="origin_city" required value={form.origin_city} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder={isFa ? 'مثلاً ونکوور' : 'e.g. Vancouver'} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{isFa ? 'کشور شما' : 'Your Country'} *</label>
              <select name="origin_country" required value={form.origin_country} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="">{isFa ? 'انتخاب کنید' : 'Select country'}</option>
                {COUNTRIES.map((c) => <option key={c.code} value={isFa ? c.fa : c.en}>{isFa ? c.fa : c.en}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{isFa ? 'شهر مقصد در ایران' : 'Destination in Iran'} *</label>
              <select name="destination_city" required value={form.destination_city} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="">{isFa ? 'انتخاب کنید' : 'Select city'}</option>
                {IRANIAN_CITIES.map((city) => <option key={city.en} value={isFa ? city.fa : city.en}>{isFa ? city.fa : city.en}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{isFa ? 'تاریخ نیاز' : 'Needed By'}</label>
              <input type="date" name="needed_by_date" value={form.needed_by_date} onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{isFa ? 'به چه کمکی نیاز دارید؟' : 'What kind of help do you need?'}</label>
            <div className="grid grid-cols-2 gap-2">
              {needsOptions.map((opt) => (
                <label key={opt.key} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" value={isFa ? opt.fa : opt.en} className="rounded"
                    onChange={(e) => {
                      const curr = form.needs ? form.needs.split(', ') : [];
                      const val = e.target.value;
                      setForm({ ...form, needs: e.target.checked ? [...curr, val].join(', ') : curr.filter(s => s !== val).join(', ') });
                    }} />
                  {isFa ? opt.fa : opt.en}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{isFa ? 'توضیحات بیشتر' : 'Additional Details'}</label>
            <textarea name="details" rows={4} value={form.details} onChange={handleChange}
              placeholder={isFa ? 'هر اطلاعات مفیدی را بنویسید: تعداد چمدان، شماره پرواز...' : 'Any helpful details: number of bags, flight number, preferred language...'}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{isFa ? 'بودجه پیشنهادی ($، اختیاری)' : 'Budget (USD, optional)'}</label>
            <input type="number" name="budget" value={form.budget} onChange={handleChange} min="0" step="5" placeholder="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 rounded-lg font-semibold text-white transition" style={{ backgroundColor: '#1e3a5f' }}>
            {loading ? (isFa ? 'در حال ثبت...' : 'Posting...') : (isFa ? 'ثبت درخواست' : 'Post Request')}
          </button>
        </form>
      </div>
    </div>
  );
}
