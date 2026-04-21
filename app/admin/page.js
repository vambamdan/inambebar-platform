'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const ADMIN_EMAIL = 'amirdaniyalm@gmail.com'

export default function AdminPanel() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [pendingUsers, setPendingUsers] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [tab, setTab] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [docUrls, setDocUrls] = useState({})

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.email !== ADMIN_EMAIL) {
        router.push('/'); return
      }
      setUser(user)

      const { data: pending } = await supabase
        .from('profiles')
        .select('*')
        .eq('verification_level', 'id')
        .eq('is_verified', false)
        .order('created_at', { ascending: true })

      const { data: all } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      setPendingUsers(pending || [])
      setAllUsers(all || [])
      setLoading(false)
    }
    load()
  }, [router])

  async function loadDocs(userId) {
    if (docUrls[userId]) return
    const { data: files } = await supabase.storage
      .from('kyc-documents')
      .list(`kyc/${userId}`)

    if (!files?.length) return

    const urls = {}
    for (const file of files) {
      const { data } = await supabase.storage
        .from('kyc-documents')
        .createSignedUrl(`kyc/${userId}/${file.name}`, 3600)
      if (data?.signedUrl) {
        const type = file.name.includes('id_') ? 'id' : 'selfie'
        urls[type] = data.signedUrl
      }
    }
    setDocUrls(prev => ({...prev, [userId]: urls}))
  }

  async function approveUser(userId) {
    await supabase.from('profiles').update({
      is_verified: true,
      verification_level: 'full'
    }).eq('id', userId)
    fetch('/api/notify/kyc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'approved', userId }),
    }).catch(() => {})
    setPendingUsers(prev => prev.filter(u => u.id !== userId))
    setAllUsers(prev => prev.map(u => u.id === userId ? {...u, is_verified: true, verification_level: 'full'} : u))
  }

  async function rejectUser(userId) {
    await supabase.from('profiles').update({
      verification_level: 'none'
    }).eq('id', userId)
    fetch('/api/notify/kyc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'rejected', userId }),
    }).catch(() => {})
    setPendingUsers(prev => prev.filter(u => u.id !== userId))
  }

  async function revokeUser(userId) {
    await supabase.from('profiles').update({
      is_verified: false,
      verification_level: 'none'
    }).eq('id', userId)
    setAllUsers(prev => prev.map(u => u.id === userId ? {...u, is_verified: false, verification_level: 'none'} : u))
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-400">Loading admin panel...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black" style={{color:'#1A2744'}}>Admin Panel</h1>
          <p className="text-gray-400 text-sm">Inambebar platform management</p>
        </div>
        <div className="flex gap-3 text-sm">
          <div className="bg-amber-50 px-4 py-2 rounded-xl">
            <span className="font-bold" style={{color:'#E07B29'}}>{pendingUsers.length}</span>
            <span className="text-gray-400 ml-1">pending KYC</span>
          </div>
          <div className="bg-gray-50 px-4 py-2 rounded-xl">
            <span className="font-bold" style={{color:'#1A2744'}}>{allUsers.length}</span>
            <span className="text-gray-400 ml-1">total users</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[{key:'pending', label:`Pending KYC (${pendingUsers.length})`}, {key:'users', label:'All Users'}].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${tab === t.key ? 'text-white' : 'bg-gray-100 text-gray-500'}`}
            style={tab === t.key ? {background:'#1A2744'} : {}}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Pending KYC */}
      {tab === 'pending' && (
        <div className="space-y-4">
          {pendingUsers.length === 0 ? (
            <div className="bg-white rounded-xl p-10 border border-gray-100 text-center text-gray-400">
              No pending verification requests 🎉
            </div>
          ) : pendingUsers.map(u => (
            <div key={u.id} className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="font-bold" style={{color:'#1A2744'}}>{u.full_name || 'No name set'}</div>
                  <div className="text-xs text-gray-400 mt-0.5">ID: {u.id}</div>
                  <div className="text-xs text-gray-400">
                    Joined: {new Date(u.created_at).toLocaleDateString('en-GB', {day:'numeric',month:'short',year:'numeric'})}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => approveUser(u.id)}
                    className="px-4 py-2 rounded-xl text-white text-sm font-bold" style={{background:'#2EBD7A'}}>
                    ✓ Approve
                  </button>
                  <button onClick={() => rejectUser(u.id)}
                    className="px-4 py-2 rounded-xl text-white text-sm font-bold bg-red-400">
                    ✗ Reject
                  </button>
                </div>
              </div>

              {/* Load documents */}
              {!docUrls[u.id] ? (
                <button onClick={() => loadDocs(u.id)}
                  className="text-sm font-semibold underline" style={{color:'#E07B29'}}>
                  Load Documents
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {docUrls[u.id]?.id && (
                    <div>
                      <div className="text-xs font-bold text-gray-400 mb-2">ID DOCUMENT</div>
                      <img src={docUrls[u.id].id} alt="ID" className="w-full rounded-xl border border-gray-100 object-contain max-h-48"/>
                    </div>
                  )}
                  {docUrls[u.id]?.selfie && (
                    <div>
                      <div className="text-xs font-bold text-gray-400 mb-2">SELFIE</div>
                      <img src={docUrls[u.id].selfie} alt="Selfie" className="w-full rounded-xl border border-gray-100 object-contain max-h-48"/>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* All Users */}
      {tab === 'users' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase">User</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase">Rating</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase">Joined</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map(u => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="font-semibold" style={{color:'#1A2744'}}>{u.full_name || 'No name'}</div>
                    <div className="text-xs text-gray-400">{u.id.slice(0,8)}...</div>
                  </td>
                  <td className="px-5 py-3">
                    {u.is_verified ? (
                      <span className="text-xs font-bold px-2 py-1 rounded-full" style={{background:'rgba(46,189,122,0.1)', color:'#2EBD7A'}}>✓ Verified</span>
                    ) : u.verification_level === 'id' ? (
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-500">Pending Review</span>
                    ) : (
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-400">Unverified</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {u.rating_avg ? `${u.rating_avg} ⭐ (${u.rating_count})` : 'No ratings'}
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs">
                    {new Date(u.created_at).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-5 py-3">
                    {u.is_verified ? (
                      <button onClick={() => revokeUser(u.id)}
                        className="text-xs font-bold text-red-400 hover:text-red-600">
                        Revoke
                      </button>
                    ) : u.verification_level === 'id' ? (
                      <button onClick={() => approveUser(u.id)}
                        className="text-xs font-bold" style={{color:'#2EBD7A'}}>
                        Approve
                      </button>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
