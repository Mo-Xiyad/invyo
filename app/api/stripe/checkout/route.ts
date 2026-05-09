import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/utils/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-04-22.dahlia' })

export async function POST(req: NextRequest) {
  try {
    const { invitationId, slug } = await req.json() as { invitationId: string; slug: string }

    if (!invitationId || !slug) {
      return NextResponse.json({ error: 'Missing invitationId or slug' }, { status: 400 })
    }

    // Verify this invitation belongs to the current user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

    const { data: invitation } = await supabase
      .from('invitations')
      .select('id, status')
      .eq('id', invitationId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (!invitation) return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })

    const origin = req.headers.get('origin') ?? 'https://invyo.uk'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      metadata: {
        invitation_id: invitationId,
        slug,
        user_id: user.id,
      },
      success_url: `${origin}/dashboard/invitation/success?session_id={CHECKOUT_SESSION_ID}&slug=${slug}`,
      cancel_url: `${origin}/dashboard/invitation`,
    })

    // Persist the slug + session ID on the invitation (still draft until paid)
    await supabase
      .from('invitations')
      .update({ slug, stripe_session_id: session.id })
      .eq('id', invitationId)

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Could not create checkout session' }, { status: 500 })
  }
}
