import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

const MAX_SIZE_MB = 15
const ALLOWED_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/x-m4a']

type AdminSession = {
  status: number
  error: string | null
  supabase: Awaited<ReturnType<typeof createClient>> | null
}

async function requireAdmin(): Promise<AdminSession> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { status: 401, error: 'Unauthorised', supabase: null }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.role !== 'admin') {
    return { status: 403, error: 'Forbidden', supabase: null }
  }

  return { status: 200, error: null, supabase }
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (session.error || !session.supabase) {
    return NextResponse.json({ error: session.error }, { status: session.status })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const templateId = formData.get('templateId') as string | null
  const trackName = (formData.get('name') as string | null) ?? file?.name ?? 'Untitled'

  if (!file || !templateId) {
    return NextResponse.json({ error: 'Missing file or templateId' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Only MP3, WAV, OGG, AAC files are allowed' }, { status: 400 })
  }

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return NextResponse.json({ error: `File must be under ${MAX_SIZE_MB}MB` }, { status: 400 })
  }

  const extension = file.name.split('.').pop() ?? 'mp3'
  const storagePath = `template/${templateId}/${Date.now()}.${extension}`
  const bytes = await file.arrayBuffer()

  const { error: uploadError } = await session.supabase.storage
    .from('music')
    .upload(storagePath, bytes, { contentType: file.type, upsert: true })

  if (uploadError) {
    console.error('Template music upload error:', uploadError)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }

  const { data: { publicUrl } } = session.supabase.storage.from('music').getPublicUrl(storagePath)
  const { error: settingsError } = await session.supabase
    .from('template_settings')
    .upsert({
      template_id: templateId,
      music_url: publicUrl,
      music_name: trackName,
      updated_at: new Date().toISOString(),
    })

  if (settingsError) {
    console.error('Template settings upsert error:', settingsError)
    return NextResponse.json({ error: 'Could not save template settings' }, { status: 500 })
  }

  return NextResponse.json({ musicUrl: publicUrl, musicName: trackName })
}

export async function DELETE(req: NextRequest) {
  const session = await requireAdmin()
  if (session.error || !session.supabase) {
    return NextResponse.json({ error: session.error }, { status: session.status })
  }

  const { templateId } = (await req.json()) as { templateId?: string }

  if (!templateId) {
    return NextResponse.json({ error: 'Missing templateId' }, { status: 400 })
  }

  const { error: settingsError } = await session.supabase
    .from('template_settings')
    .upsert({
      template_id: templateId,
      music_url: '',
      music_name: '',
      updated_at: new Date().toISOString(),
    })

  if (settingsError) {
    console.error('Template settings clear error:', settingsError)
    return NextResponse.json({ error: 'Could not clear template settings' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
