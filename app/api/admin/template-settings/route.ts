import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

type AdminSession = {
  status: number
  error: string | null
  supabase: Awaited<ReturnType<typeof createClient>> | null
}

async function requireAdmin(): Promise<AdminSession> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { status: 401, error: 'Unauthorised', supabase: null }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin') return { status: 403, error: 'Forbidden', supabase: null }
  return { status: 200, error: null, supabase }
}

// POST — save music and/or image metadata after browser uploads directly to Supabase Storage
export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (session.error || !session.supabase) {
    return NextResponse.json({ error: session.error }, { status: session.status })
  }

  const body = (await req.json()) as {
    templateId?: string
    musicUrl?: string; musicName?: string
    imageUrl?: string; imageName?: string
  }
  const { templateId, musicUrl, musicName, imageUrl, imageName } = body

  if (!templateId) {
    return NextResponse.json({ error: 'Missing templateId' }, { status: 400 })
  }
  if (musicUrl === undefined && imageUrl === undefined) {
    return NextResponse.json({ error: 'Provide at least musicUrl or imageUrl' }, { status: 400 })
  }

  const update: Record<string, string> = { template_id: templateId, updated_at: new Date().toISOString() }
  if (musicUrl !== undefined) { update.music_url = musicUrl; update.music_name = musicName ?? '' }
  if (imageUrl !== undefined) { update.image_url = imageUrl; update.image_name = imageName ?? '' }

  const { error: settingsError } = await session.supabase.from('template_settings').upsert(update)

  if (settingsError) {
    console.error('Template settings upsert error:', settingsError)
    return NextResponse.json({ error: 'Could not save template settings' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const session = await requireAdmin()
  if (session.error || !session.supabase) {
    return NextResponse.json({ error: session.error }, { status: session.status })
  }

  const { templateId } = (await req.json()) as { templateId?: string }
  if (!templateId) return NextResponse.json({ error: 'Missing templateId' }, { status: 400 })

  const { error: settingsError } = await session.supabase.from('template_settings').upsert({
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
