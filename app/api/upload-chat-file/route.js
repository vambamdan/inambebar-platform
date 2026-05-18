import { NextResponse } from 'next/server'
import getSupabaseAdmin from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'

/**
 * POST /api/upload-chat-file
 * Accepts multipart/form-data with fields:
 *   file     — the File/Blob to upload
 *   matchId  — UUID
 *   userId   — UUID
 * Returns { url } on success or { error } on failure.
 *
 * Uses the admin client so Supabase Storage RLS is bypassed.
 */
export async function POST(req) {
  try {
    const form     = await req.formData()
    const file     = form.get('file')
    const matchId  = form.get('matchId')
    const userId   = form.get('userId')

    if (!file || !matchId || !userId) {
      return NextResponse.json({ error: 'Missing file, matchId or userId' }, { status: 400 })
    }

    const isAudio = file.type?.startsWith('audio/') || file.name?.endsWith('.webm')
    const ext     = isAudio ? 'webm' : (file.name?.split('.').pop() || 'bin')
    const path    = `${matchId}/${userId}/${Date.now()}.${ext}`
    const ct      = file.type || (isAudio ? 'audio/webm' : 'application/octet-stream')

    const arrayBuffer = await file.arrayBuffer()
    const buffer      = Buffer.from(arrayBuffer)

    const admin = getSupabaseAdmin()

    const { error: uploadErr } = await admin.storage
      .from('chat-images')
      .upload(path, buffer, { contentType: ct, upsert: false })

    if (uploadErr) {
      console.error('[upload-chat-file] upload error:', uploadErr)
      return NextResponse.json({ error: uploadErr.message }, { status: 500 })
    }

    // 1-year signed URL (private bucket)
    const { data: signed, error: signErr } = await admin.storage
      .from('chat-images')
      .createSignedUrl(path, 365 * 24 * 3600)

    if (signErr || !signed?.signedUrl) {
      console.error('[upload-chat-file] sign error:', signErr)
      return NextResponse.json({ error: 'Could not generate signed URL' }, { status: 500 })
    }

    return NextResponse.json({ url: signed.signedUrl })
  } catch (err) {
    console.error('[upload-chat-file] unexpected:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
