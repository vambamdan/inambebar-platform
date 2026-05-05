'use client'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'

const FG1 = '#F1F4FB'
const FG3 = '#6E7A99'

export default function MatchesIndexPage() {
  const { t } = useLanguage()

  return (
    <div className="flex-1 h-full flex items-center justify-center" style={{ background: '#0B1220' }}>
      <div className="text-center px-6">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(224,123,41,0.08)', border: '1px solid rgba(224,123,41,0.15)' }}
        >
          <MessageCircle size={28} color="#E07B29" strokeWidth={1.5} />
        </div>
        <h3 className="font-bold text-lg mb-2" style={{ color: FG1 }}>
          {t?.selectConversation || 'Select a conversation'}
        </h3>
        <p className="text-sm max-w-xs" style={{ color: FG3 }}>
          {t?.selectConversationDesc || 'Choose from your conversations on the left to continue chatting'}
        </p>
        <div className="flex justify-center gap-3 mt-6">
          <Link
            href="/trips"
            className="text-xs font-bold px-4 py-2.5 rounded-xl text-white transition-opacity hover:opacity-80"
            style={{ background: '#16203A', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {t?.findTravelers || 'Find Travelers'}
          </Link>
          <Link
            href="/requests/new"
            className="text-xs font-bold px-4 py-2.5 rounded-xl text-white transition-opacity hover:opacity-90"
            style={{ background: '#E07B29' }}
          >
            {t?.postRequest || 'Post a Request'}
          </Link>
        </div>
      </div>
    </div>
  )
}
