import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { getRedis } from '@/lib/redis'
import { RSVP_REDIS_KEY, type InviteRoute, type RsvpEvent, type RsvpRecord } from '@/lib/rsvp'

const NAME_MAX = 120
const NAME_MIN = 1

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!isRecord(body)) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const guestNameRaw = body.guestName
  const guestName =
    typeof guestNameRaw === 'string' ? guestNameRaw.trim().slice(0, NAME_MAX) : ''
  if (guestName.length < NAME_MIN) {
    return NextResponse.json({ error: 'Guest name is required' }, { status: 400 })
  }

  const event = body.event
  if (event !== 'marriage_ceremony' && event !== 'wedding') {
    return NextResponse.json({ error: 'Invalid event' }, { status: 400 })
  }

  const plusOne = body.plusOne === true

  const route = body.route
  if (route !== 'family' && route !== 'friends') {
    return NextResponse.json({ error: 'Invalid route' }, { status: 400 })
  }

  const record: RsvpRecord = {
    id: randomUUID(),
    guestName,
    event: event as RsvpEvent,
    plusOne,
    route: route as InviteRoute,
    submittedAt: new Date().toISOString(),
  }

  try {
    const redis = getRedis()
    await redis.lpush(RSVP_REDIS_KEY, JSON.stringify(record))
  } catch (e) {
    console.error('[rsvp] redis lpush failed', e)
    return NextResponse.json({ error: 'Could not save RSVP. Try again later.' }, { status: 503 })
  }

  return NextResponse.json({ ok: true, id: record.id })
}
