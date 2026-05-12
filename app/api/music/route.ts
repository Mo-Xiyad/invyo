import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

const MAX_SIZE_MB = 15
const ALLOWED_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/x-m4a']

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const templateId = formData.get('templateId') as string | null
  const trackName = (formData.get('name') as string | null) ?? file?.name ?? 'Untitled'

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  if (!ALLOWED_TYPES.includes(file.type))
    return NextResponse.json({ error: 'Only MP3, WAV, OGG, AAC files are allowed' }, { status: 400 })
  if (file.size > MAX_SIZE_MB * 1024 * 1024)
    return NextResponse.json({ error: `File must be under ${MAX_SIZE_MB}MB` }, { status: 400 })

  // Upload to Supabase Storage bucket: music/{userId}/{timestamp}-{filename}
  const ext = file.name.split('.').pop() ?? 'mp3'
  const storagePath = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const bytes = await file.arrayBuffer()

  const { error: uploadError } = await supabase.storage
    .from('Music')
    .upload(storagePath, bytes, { contentType: file.type, upsert: false })

  if (uploadError) {
    console.error('Storage upload error:', uploadError)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage.from('Music').getPublicUrl(storagePath)

  // Save track record to DB
  const { data: track, error: dbError } = await supabase
    .from('music_tracks')
    .insert({
      name: trackName,
      storage_path: storagePath,
      public_url: publicUrl,
      uploaded_by: user.id,
      template_id: templateId ?? null,
      is_public: false, // private by default; admin can make public later
    })
    .select()
    .single()

  if (dbError) {
    console.error('DB insert error:', dbError)
    // Still return the URL even if DB record failed
    return NextResponse.json({ url: publicUrl, trackId: null })
  }

  return NextResponse.json({ url: publicUrl, trackId: track.id })
}

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  // Return: user's own tracks + public tracks (community library)
  const { data: tracks } = await supabase
    .from('music_tracks')
    .select('id, name, public_url, uploaded_by, template_id, is_public, created_at')
    .or(`uploaded_by.eq.${user.id},is_public.eq.true`)
    .order('created_at', { ascending: false })

  return NextResponse.json({ tracks: tracks ?? [] })
}
