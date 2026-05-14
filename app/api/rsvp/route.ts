import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      invitationId?: string
      name?: string
      status?: 'accept' | 'maybe' | 'decline'
      plusOne?: boolean
      message?: string
      attending?: boolean
      guests?: number
      notes?: string
    }

    const name = body.name?.trim()
    const invitationId = body.invitationId
    const attending = typeof body.attending === 'boolean'
      ? body.attending
      : body.status
        ? body.status !== 'decline'
        : undefined
    const guests = Number.isFinite(body.guests)
      ? Math.max(1, Math.floor(body.guests as number))
      : body.plusOne
        ? 2
        : 1
    const notes = body.notes?.trim() || body.message?.trim() || (body.status === 'maybe' ? 'maybe' : '')

    if (!name || typeof attending !== 'boolean') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!invitationId) {
      return NextResponse.json({ error: 'No invitation ID' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: invitation } = await supabase
      .from('invitations')
      .select('id')
      .eq('id', invitationId)
      .eq('status', 'published')
      .maybeSingle()

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found or not published' }, { status: 404 })
    }

    const { error } = await supabase.from('rsvp_responses').insert({
      invitation_id: invitationId,
      guest_name: name,
      attending,
      guests_count: guests,
      message: notes || null,
    })

    if (error) {
      console.error('RSVP insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('RSVP route error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
