'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import { CATEGORIES } from '@/lib/translations';

export default function RequestsPage() {
  const { t, isFa } = useLanguage();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    setLoading(true);
    const { data, error } = await supabase
      .from('shipment_requests')
      .select(`
        *,
        profiles:sender_id (
          full_name,
          avatar_url,
          rating_avg,
          rating_count,
          is_verified
        )
      `)
      .eq('status', 'open')
      .order('created_at', { ascending: false });

    if (!error) setRequests(data || []);
    setLoading(false);
  }

  const allCategories = [
    { key: 'all', en: 'All Categories', fa: 'همه دسته‌بندی‌ها', icon: '📦' },
    ...CATEGORIES,
  ];

  const filtered = requests.filter((r) => {
    const matchesSearch =
      search === '' ||
      r.origin_city?.toLowerCase().includes(search.toLowerCase()) ||
      r.destination_city?.toLowerCase().includes(search.toLowerCase()) ||
      r.item_description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || r.item_category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t.browseRequests}</h1>
              <p className="text-gray-500 mt-1">{t.findPackages}</p>
            </div>
            <Link
              href="/requests/new"
              className="bg-navy-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-navy-800 transition text-center"
              style={{ backgroundColor: '#1e3a5f' }}
            >
              {t.postRequest}
            </Link>
          </div>
          <div className="mt-6">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {allCategories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium border transition ${
                  selectedCategory === cat.key
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{isFa ? cat.fa : cat.en}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-16 text-gray-400">{t.loading}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">{t.noResults}</p>
            <Link href="/requests/new" className="mt-4 inline-block text-blue-600 underline">
              {t.postRequest}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((req) => (
              <RequestCard key={req.id} req={req} t={t} isFa={isFa} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RequestCard({ req, t, isFa }) {
  const categoryInfo = CATEGORIES.find((c) => c.key === req.item_category);
  const categoryLabel = categoryInfo ? (isFa ? categoryInfo.fa : categoryInfo.en) : req.item_category;

  return (
    <Link href={`/requests/${req.id}`} className="block">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition cursor-pointer h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg overflow-hidden">
            {req.profiles?.avatar_url ? (
              <img src={req.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              req.profiles?.full_name?.charAt(0)?.toUpperCase() || '?'
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-800">{req.profiles?.full_name || t.anonymous}</span>
              {req.profiles?.is_verified && (
                <span className="text-blue-500 text-sm" title={t.verified}>✓</span>
              )}
            </div>
            {req.profiles?.rating_count > 0 && (
              <div className="text-yellow-500 text-sm">
                {'★'.repeat(Math.round(req.profiles.rating_avg))}
                {'☆'.repeat(5 - Math.round(req.profiles.rating_avg))}
                <span className="text-gray-500 ml-1">({req.profiles.rating_count})</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
          <span>{req.origin_city}, {req.origin_country}</span>
          <span className="text-blue-400">→</span>
          <span>{req.destination_city}, {req.destination_country}</span>
        </div>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{req.item_description}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {categoryInfo && (
            <span className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full">
              {categoryInfo.icon} {categoryLabel}
            </span>
          )}
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">⚖️ {req.weight_kg} kg</span>
          {req.needed_by_date && (
            <span className="bg-orange-50 text-orange-600 text-xs px-2 py-1 rounded-full">
              📅 {new Date(req.needed_by_date).toLocaleDateString()}
            </span>
          )}
        </div>
        {req.budget && (
          <div className="text-right">
            <span className="text-green-600 font-bold text-lg">${req.budget}</span>
            <span className="text-gray-500 text-sm ml-1">{t.budget}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
