import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { name, status, plusOne, invitationId } = await req.json() as {
      name: string
      status: 'accept' | 'maybe' | 'decline'
      plusOne: boolean
      invitationId?: string
    }

    if (!name?.trim() || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!invitationId) {
      return NextResponse.json({ error: 'No invitation ID' }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify invitation exists and is published
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
      guest_name: name.trim(),
      attending: status !== 'decline',
      guests_count: plusOne ? 2 : 1,
      message: status === 'maybe' ? 'maybe' : null,
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
