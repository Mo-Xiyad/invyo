import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// POST — save a track record after browser uploads directly to Supabase Storage
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { name, storagePath, publicUrl, templateId } = await req.json()
  if (!name || !storagePath || !publicUrl) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data: track, error: dbError } = await supabase
    .from('music_tracks')
    .insert({
      name,
      storage_path: storagePath,
      public_url: publicUrl,
      uploaded_by: user.id,
      template_id: templateId ?? null,
      is_public: false,
    })
    .select()
    .single()

  if (dbError) {
    console.error('DB insert error:', dbError)
    return NextResponse.json({ url: publicUrl, trackId: null })
  }

  return NextResponse.json({ url: publicUrl, trackId: track.id })
}

// GET — user's tracks + public tracks + template's default track
export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const templateId = new URL(req.url).searchParams.get('templateId')

  const [tracksResult, templateResult] = await Promise.all([
    supabase
      .from('music_tracks')
      .select('id, name, public_url, uploaded_by, is_public, created_at')
      .or(`uploaded_by.eq.${user.id},is_public.eq.true`)
      .order('created_at', { ascending: false }),
    templateId
      ? supabase
          .from('template_settings')
          .select('music_url, music_name')
          .eq('template_id', templateId)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ])

  const tracks = tracksResult.data ?? []
  const templateTrack = templateResult.data?.music_url
    ? [{
        id: `template-${templateId}`,
        name: templateResult.data.music_name || 'Template default',
        public_url: templateResult.data.music_url,
        uploaded_by: null,
        is_public: true,
        isTemplateDefault: true,
      }]
    : []

  // Deduplicate: don't show template track if it's already in user's list
  const allTracks = [
    ...templateTrack,
    ...tracks.filter(t => t.public_url !== templateResult.data?.music_url),
  ]

  return NextResponse.json({ tracks: allTracks })
}
