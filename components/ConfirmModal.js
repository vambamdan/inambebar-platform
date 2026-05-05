'use client'
import { useEffect } from 'react'
import { X, AlertTriangle } from 'lucide-react'

const CARD_BG  = '#16203A'
const HAIRLINE = 'rgba(255,255,255,0.07)'
const FG1      = '#F1F4FB'
const FG2      = '#A6B0CC'
const FG3      = '#6E7A99'

/**
 * ConfirmModal — centred overlay modal for irreversible status changes.
 *
 * Props
 *  open          boolean
 *  title         string
 *  description   string — action-specific copy
 *  confirmLabel  string — label on the confirm button
 *  confirmColor  string — hex colour for confirm button (default amber)
 *  loading       boolean
 *  onConfirm     () => void
 *  onClose       () => void
 *  children      ReactNode — optional slot (e.g. price input for accept flow)
 */
export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  confirmColor = '#E07B29',
  loading = false,
  onConfirm,
  onClose,
  children,
}) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(4,9,20,0.75)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl"
        style={{
          background: CARD_BG,
          border: `1px solid ${HAIRLINE}`,
          boxShadow: '0 32px 80px rgba(0,0,0,0.55)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-0">
          <h2 className="text-base font-bold leading-snug pr-4" style={{ color: FG1 }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full transition-colors -mt-0.5"
            style={{ background: 'rgba(255,255,255,0.06)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.10)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
            aria-label="Close"
          >
            <X size={16} color={FG3} />
          </button>
        </div>

        <div className="px-6 pt-4 pb-6 space-y-4">
          {description && (
            <p className="text-sm leading-relaxed" style={{ color: FG2 }}>{description}</p>
          )}

          {children && <div>{children}</div>}

          {/* Warning banner */}
          <div
            className="flex items-start gap-2.5 rounded-xl p-3.5"
            style={{ background: 'rgba(224,123,41,0.06)', border: '1px solid rgba(224,123,41,0.22)' }}
          >
            <AlertTriangle size={14} color="#E07B29" className="flex-shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed" style={{ color: '#FAD2B0' }}>
              <span className="font-semibold">This action cannot be reversed.</span>
              {' '}If you believe this was made in error, please contact our support team through the in-app chat.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors"
              style={{ border: `1px solid ${HAIRLINE}`, color: FG2, background: 'transparent' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Go Back
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-3 rounded-xl text-white text-sm font-bold disabled:opacity-50 transition-opacity hover:opacity-90 active:scale-[0.98]"
              style={{ background: confirmColor }}
            >
              {loading ? 'Please wait…' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
