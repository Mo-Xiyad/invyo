import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/utils/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-04-22.dahlia' })

// Stripe sends raw body — must read before any parsing
export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ received: true })
    }

    const { invitation_id, slug } = session.metadata ?? {}
    if (!invitation_id || !slug) {
      console.error('Missing metadata in session:', session.id)
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase
      .from('invitations')
      .update({
        status: 'published',
        slug,
        published_at: new Date().toISOString(),
        stripe_payment_intent_id: session.payment_intent as string,
        stripe_session_id: session.id,
        amount_paid: session.amount_total,
        currency: session.currency,
      })
      .eq('id', invitation_id)

    if (error) {
      console.error('Failed to publish invitation after payment:', error)
      return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
    }

    console.log(`✓ Invitation ${invitation_id} published at ${slug}.invyo.uk`)
  }

  return NextResponse.json({ received: true })
}
