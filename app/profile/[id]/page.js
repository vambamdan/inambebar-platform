'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Star, ShieldCheck, Plane, PackageCheck, Globe } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import VoicePitch from '@/components/VoicePitch'
import { useLanguage } from '@/lib/LanguageContext'

const CARD_BG  = '#16203A'
const HAIRLINE = 'rgba(255,255,255,0.07)'
const FG1      = '#F1F4FB'
const FG2      = '#A6B0CC'
const FG3      = '#6E7A99'

const BIO_MAX = 200

export default function ProfilePage() {
  const { id } = useParams()
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [trips, setTrips] = useState([])
  const [reviews, setReviews] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [deliveriesCount, setDeliveriesCount] = useState(0)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ full_name: '', bio: '', origin_country: '' })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const { t, isFa } = useLanguage()
  const fontStyle = isFa ? { fontFamily: "'Vazirmatn', sans-serif" } : {}

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)

      const { data: profileData } = await supabase
        .from('profiles').select('*').eq('id', id).single()

      if (!profileData) { router.push('/'); return }
      setProfile(profileData)
      setForm({
        full_name: profileData.full_name || '',
        bio: profileData.bio || '',
        origin_country: profileData.origin_country || '',
      })

      const [tripsRes, reviewsRes, deliveriesRes] = await Promise.all([
        supabase.from('trips').select('*').eq('traveler_id', id)
          .eq('status', 'active').gte('departure_date', new Date().toISOString().split('T')[0])
          .order('departure_date', { ascending: true }).limit(5),
        supabase.from('reviews')
          .select('*, profiles!reviews_reviewer_id_fkey(full_name)')
          .eq('reviewee_id', id).order('created_at', { ascending: false }).limit(10),
        supabase.from('matches')
          .select('id', { count: 'exact', head: true })
          .eq('traveler_id', id).eq('status', 'delivered'),
      ])

      setTrips(tripsRes.data || [])
      setReviews(reviewsRes.data || [])
      setDeliveriesCount(deliveriesRes.count || 0)
      setLoading(false)
    }
    load()
  }, [id, router])

  async function handleSave() {
    setSaving(true)
    const update = {
      full_name: form.full_name.trim(),
      bio: form.bio.trim().slice(0, BIO_MAX),
      origin_country: form.origin_country.trim() || null,
    }
    await supabase.from('profiles').update(update).eq('id', currentUser.id)
    setProfile(p => ({ ...p, ...update }))
    setEditing(false)
    setSaving(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: '#0B1220' }}>
      <div className="text-sm" style={{ color: FG3 }}>{t?.loading || 'Loading…'}</div>
    </div>
  )

  const isOwnProfile = currentUser?.id === id
  const bioCharsLeft = BIO_MAX - form.bio.length

  return (
    <div className="min-h-screen" style={{ background: '#0B1220', paddingTop: 72 }}>
    <div className="max-w-4xl mx-auto px-4 py-10" style={fontStyle}>
      <div className="grid md:grid-cols-3 gap-6">

        {/* ── Left column ── */}
        <div className="md:col-span-1 space-y-4">
          <div className="rounded-2xl p-6" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>

            {/* Avatar + name */}
            <div className="flex flex-col items-center mb-5">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl mb-3"
                style={{ background: 'linear-gradient(135deg, #1A2744, #2E4068)' }}>
                {profile?.full_name?.[0]?.toUpperCase() || '?'}
              </div>

              {!editing && (
                <>
                  <h1 className="font-bold text-xl text-center mb-1" style={{ color: FG1 }}>
                    {profile?.full_name || 'Anonymous'}
                  </h1>

                  {profile?.is_verified ? (
                    <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full mb-2"
                      style={{ background: 'rgba(46,189,122,0.10)', color: '#56CD93' }}>
                      <ShieldCheck size={12} /> {t?.verified || 'ID Verified'}
                    </span>
                  ) : (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full mb-2"
                      style={{ background: 'rgba(255,255,255,0.06)', color: FG3 }}>
                      {t?.unverified || 'Unverified'}
                    </span>
                  )}

                  {profile?.origin_country && (
                    <div className="flex items-center gap-1 text-xs mb-1" style={{ color: FG3 }}>
                      <Globe size={11} />
                      <span>{profile.origin_country}</span>
                    </div>
                  )}

                  {profile?.rating_count > 0 ? (
                    <div className="flex items-center gap-1.5 text-sm mb-4" style={{ color: FG2 }}>
                      <Star size={13} fill="#E07B29" color="#E07B29" />
                      <span className="font-semibold" style={{ color: FG1 }}>{profile.rating_avg?.toFixed(1)}</span>
                      <span style={{ color: FG3 }}>· {profile.rating_count} {t?.reviews || 'reviews'}</span>
                    </div>
                  ) : (
                    <p className="text-xs mb-4" style={{ color: FG3 }}>{t?.newMember || 'New member'}</p>
                  )}
                </>
              )}
            </div>

            {/* Edit form */}
            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: FG3 }}>
                    {t?.fullName || 'Full Name'}
                  </label>
                  <input type="text" value={form.full_name}
                    onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                    className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                    style={{ background: '#0F1730', border: `1px solid ${HAIRLINE}`, color: FG1 }}
                    onFocus={e => e.target.style.borderColor = 'rgba(224,123,41,0.40)'}
                    onBlur={e => e.target.style.borderColor = HAIRLINE}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wide" style={{ color: FG3 }}>
                      {t?.aboutMe || 'About me'}
                    </label>
                    <span className="text-xs font-medium" style={{ color: bioCharsLeft < 20 ? '#E07B29' : FG3 }}>
                      {bioCharsLeft} {t?.charsLeft || 'left'}
                    </span>
                  </div>
                  <textarea
                    value={form.bio}
                    rows={4}
                    maxLength={BIO_MAX}
                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                    placeholder="e.g. Frequent flyer between Frankfurt and Tehran. Happy to carry sealed packages — no liquids."
                    className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none resize-none leading-relaxed"
                    style={{ background: '#0F1730', border: `1px solid ${HAIRLINE}`, color: FG1 }}
                    onFocus={e => e.target.style.borderColor = 'rgba(224,123,41,0.40)'}
                    onBlur={e => e.target.style.borderColor = HAIRLINE}
                  />
                  <p className="text-xs mt-1" style={{ color: FG3 }}>
                    {t?.bioHelp || 'Visible to everyone. Help senders trust you.'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: FG3 }}>
                    {t?.originCountry || 'Origin Country'}
                  </label>
                  <input
                    type="text"
                    value={form.origin_country}
                    onChange={e => setForm(f => ({ ...f, origin_country: e.target.value }))}
                    placeholder="e.g. Iran, Germany, Canada…"
                    className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                    style={{ background: '#0F1730', border: `1px solid ${HAIRLINE}`, color: FG1 }}
                    onFocus={e => e.target.style.borderColor = 'rgba(224,123,41,0.40)'}
                    onBlur={e => e.target.style.borderColor = HAIRLINE}
                  />
                  <p className="text-xs mt-1" style={{ color: FG3 }}>
                    {t?.originCountryHelp || 'Helps senders find travelers from their background.'}
                  </p>
                </div>

                <div className="flex gap-2 pt-1">
                  <button onClick={handleSave} disabled={saving}
                    className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-50 transition-opacity hover:opacity-90"
                    style={{ background: '#E07B29' }}>
                    {saving ? (t?.saving || 'Saving…') : (t?.saveChanges || 'Save Changes')}
                  </button>
                  <button
                    onClick={() => { setEditing(false); setForm({ full_name: profile.full_name || '', bio: profile.bio || '', origin_country: profile.origin_country || '' }) }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors"
                    style={{ border: `1px solid ${HAIRLINE}`, color: FG2, background: 'transparent' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {t?.cancel || 'Cancel'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {profile?.bio ? (
                  <div className="mb-4">
                    <p className="text-sm leading-relaxed" style={{ color: FG2 }}>{profile.bio}</p>
                  </div>
                ) : isOwnProfile ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="w-full mb-4 py-3 rounded-xl border border-dashed text-sm transition-colors"
                    style={{ borderColor: HAIRLINE, color: FG3 }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(224,123,41,0.40)'; e.currentTarget.style.color = '#E07B29' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = HAIRLINE; e.currentTarget.style.color = FG3 }}
                  >
                    + {t?.addBioPrompt || 'Add a bio so senders trust you'}
                  </button>
                ) : (
                  <p className="text-sm italic mb-4" style={{ color: FG3 }}>{t?.noBioYet || 'No bio yet.'}</p>
                )}

                {isOwnProfile && (
                  <button onClick={() => setEditing(true)}
                    className="w-full py-2 rounded-xl text-sm font-bold transition-colors"
                    style={{ border: `1px solid ${HAIRLINE}`, color: FG2, background: 'transparent' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {t?.editProfile || 'Edit Profile'}
                  </button>
                )}
              </>
            )}
          </div>

          {/* Stats card */}
          <div className="rounded-2xl p-5" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
            <h3 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: FG3, letterSpacing: '0.07em' }}>
              {t?.stats || 'Stats'}
            </h3>
            <div className="space-y-2.5">
              {[
                { label: t?.reviewsReceived || 'Reviews received', value: profile?.rating_count || 0 },
                {
                  label: t?.avgRating || 'Average rating',
                  value: profile?.rating_avg
                    ? <span className="flex items-center gap-1"><Star size={12} fill="#E07B29" color="#E07B29" />{profile.rating_avg.toFixed(1)}</span>
                    : 'N/A',
                },
                {
                  label: t?.activeTrips || 'Active trips',
                  value: <span className="flex items-center gap-1"><Plane size={12} />{trips.length}</span>,
                },
                {
                  label: t?.deliveries || 'Deliveries completed',
                  value: <span className="flex items-center gap-1"><PackageCheck size={12} />{deliveriesCount}</span>,
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center text-sm">
                  <span style={{ color: FG3 }}>{label}</span>
                  <span className="font-bold" style={{ color: FG1 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="md:col-span-2 space-y-6">

          {/* Voice pitch */}
          {(profile?.voice_pitch_url || isOwnProfile) && (
            <VoicePitch
              profileId={id}
              isOwnProfile={isOwnProfile}
              existingUrl={profile?.voice_pitch_url || null}
              onSaved={url => setProfile(p => ({ ...p, voice_pitch_url: url }))}
            />
          )}

          {/* Active trips */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-lg" style={{ color: FG1, letterSpacing: '-0.015em' }}>
                {t?.activeTripsHeading || 'Active Trips'}
              </h2>
              {isOwnProfile && (
                <Link href="/trips/new" className="text-sm font-semibold transition-opacity hover:opacity-80"
                  style={{ color: '#E07B29' }}>
                  + {t?.postATrip || 'Add trip'}
                </Link>
              )}
            </div>
            {trips.length === 0 ? (
              <div className="rounded-xl p-6 text-center text-sm" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}`, color: FG3 }}>
                {isOwnProfile ? (
                  <>{t?.noActiveTripsOwn || 'No active trips.'}{' '}
                    <Link href="/trips/new" className="font-semibold transition-opacity hover:opacity-80"
                      style={{ color: '#E07B29' }}>
                      {t?.flyingSoon || 'Post your first trip'} →
                    </Link>
                  </>
                ) : (t?.noActiveTrips || 'No active trips at the moment.')}
              </div>
            ) : (
              <div className="space-y-3">
                {trips.map(trip => (
                  <Link key={trip.id} href={`/trips/${trip.id}`}
                    className="block rounded-xl p-5 card-hover transition-all"
                    style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm" style={{ color: FG1 }}>
                          {trip.origin_city} → {trip.destination_city}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: FG3 }}>
                          {new Date(trip.departure_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          {' · '}{trip.available_weight_kg}kg available
                        </div>
                      </div>
                      <div className="font-black text-lg" style={{ color: '#E07B29' }}>
                        ${trip.price_per_kg}<span className="text-xs font-medium" style={{ color: FG3 }}>/kg</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Reviews */}
          <div>
            <h2 className="font-bold text-lg mb-3" style={{ color: FG1, letterSpacing: '-0.015em' }}>
              {t?.recentReviews || 'Reviews'}{' '}
              <span className="font-medium text-base" style={{ color: FG3 }}>({reviews.length})</span>
            </h2>
            {reviews.length === 0 ? (
              <div className="rounded-xl p-6 text-center text-sm" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}`, color: FG3 }}>
                {t?.noReviewsYet || 'No reviews yet.'}
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map(r => (
                  <div key={r.id} className="rounded-xl p-5" style={{ background: CARD_BG, border: `1px solid ${HAIRLINE}` }}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, #1A2744, #2E4068)' }}>
                          {r.profiles?.full_name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span className="font-semibold text-sm" style={{ color: FG1 }}>
                          {r.profiles?.full_name || 'User'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} size={13}
                              fill={i <= r.rating ? '#E07B29' : 'none'}
                              color={i <= r.rating ? '#E07B29' : '#3D5180'}
                              strokeWidth={1.5} />
                          ))}
                        </div>
                        <span className="text-xs" style={{ color: FG3 }}>
                          {new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    {r.comment && (
                      <p className="text-sm leading-relaxed ml-10" style={{ color: FG2 }}>{r.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
    </div>
  )
}
