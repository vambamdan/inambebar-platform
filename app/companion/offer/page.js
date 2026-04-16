'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/LanguageContext';
import { COUNTRIES, IRANIAN_CITIES } from '@/lib/translations';

export default function CompanionOfferPage() {
  const { isFa } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    origin_city: '', origin_country: '', destination_city: '',
    travel_date: '', return_date: '', languages: '', services: '', bio: '', price: '',
  });

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/auth?redirect=/companion/offer'); return; }
    const { error: err } = await supabase.from('companion_offers').insert({
      traveler_id: user.id,
      origin_city: form.origin_city, origin_country: form.origin_country,
      destination_city: form.destination_city, destination_country: 'Iran',
      travel_date: form.travel_date, return_date: form.return_date || null,
      languages: form.languages, services: form.services, bio: form.bio,
      price: form.price ? parseFloat(form.price) : null,
    });
    if (err) { setError(err.message); setLoading(false); }
    else { router.push('/companion?tab=offers'); }
  }

  const svcOptions = [
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
          {isFa ? 'ارائه همراه سفر' : 'Offer Travel Companionship'}
        </h1>
        <p className="text-gray-500 mb-8">
          {isFa ? 'اگر به ایران سفر می‌کنید و می‌خواهید به دیگران کمک کنید، اطلاعات خود را وارد کنید.'
            : 'Traveling to Iran? Help others navigate airports, customs, and more.'}
        </p>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">{error}</div>}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{isFa ? 'شهر مبدأ' : 'Origin City'} *</label>
              <input name="origin_city" required value={form.origin_city} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder={isFa ? 'مثلاً تورنتو' : 'e.g. Toronto'} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{isFa ? 'کشور مبدأ' : 'Origin Country'} *</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">{isFa ? 'تاریخ سفر' : 'Travel Date'} *</label>
              <input type="date" name="travel_date" required value={form.travel_date} onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{isFa ? 'زبان‌هایی که صحبت می‌کنید' : 'Languages You Speak'} *</label>
            <input name="languages" required value={form.languages} onChange={handleChange}
              placeholder={isFa ? 'مثلاً: فارسی، انگلیسی' : 'e.g. Persian, English'}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{isFa ? 'خدماتی که ارائه می‌دهید' : 'Services You Offer'}</label>
            <div className="grid grid-cols-2 gap-2">
              {svcOptions.map((svc) => (
                <label key={svc.key} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" value={isFa ? svc.fa : svc.en} className="rounded"
                    onChange={(e) => {
                      const curr = form.services ? form.services.split(', ') : [];
                      const val = e.target.value;
                      setForm({ ...form, services: e.target.checked ? [...curr, val].join(', ') : curr.filter(s => s !== val).join(', ') });
                    }} />
                  {isFa ? svc.fa : svc.en}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{isFa ? 'معرفی خودتان' : 'About You'}</label>
            <textarea name="bio" rows={3} value={form.bio} onChange={handleChange}
              placeholder={isFa ? 'کمی درباره خود و تجربه‌تان بنویسید...' : 'Tell senders about yourself and your experience...'}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{isFa ? 'قیمت پیشنهادی ($، اختیاری)' : 'Suggested Price (USD, optional)'}</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} min="0" step="5" placeholder="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <p className="text-xs text-gray-400 mt-1">{isFa ? 'می‌توانید به‌صورت رایگان هم ارائه دهید' : 'You can offer this for free too'}</p>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 rounded-lg font-semibold text-white transition" style={{ backgroundColor: '#1e3a5f' }}>
            {loading ? (isFa ? 'در حال ثبت...' : 'Posting...') : (isFa ? 'ثبت پیشنهاد' : 'Post Offer')}
          </button>
        </form>
      </div>
    </div>
  );
}
