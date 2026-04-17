/** Shared RSVP shape for API + logistics + Redis JSON lines. */

export type InviteRoute = 'family' | 'friends'

export type RsvpEvent = 'marriage_ceremony' | 'wedding'

export type RsvpRecord = {
  id: string
  guestName: string
  event: RsvpEvent
  plusOne: boolean
  route: InviteRoute
  submittedAt: string
}

export const RSVP_REDIS_KEY = 'rsvp:entries'

/** Upstash `lrange` may return strings or auto-deserialized objects (default `automaticDeserialization: true`). */
export function parseRsvpListEntry(raw: unknown): RsvpRecord | null {
  let o: Record<string, unknown>
  if (typeof raw === 'string') {
    try {
      const parsed: unknown = JSON.parse(raw)
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return null
      o = parsed as Record<string, unknown>
    } catch {
      return null
    }
  } else if (typeof raw === 'object' && raw !== null && !Array.isArray(raw)) {
    o = raw as Record<string, unknown>
  } else {
    return null
  }

  const guestName = o.guestName
  if (typeof guestName !== 'string' || !guestName.trim()) return null

  const event = o.event
  if (event !== 'marriage_ceremony' && event !== 'wedding') return null

  const route = o.route
  if (route !== 'family' && route !== 'friends') return null

  if (typeof o.plusOne !== 'boolean') return null

  const submittedAt = o.submittedAt
  if (typeof submittedAt !== 'string' || !submittedAt) return null

  const id = o.id
  if (typeof id !== 'string' || !id) return null

  return {
    id,
    guestName,
    event,
    plusOne: o.plusOne,
    route,
    submittedAt,
  }
}

export function eventLabel(e: RsvpEvent): string {
  return e === 'wedding' ? 'Wedding' : 'Marriage ceremony'
}

export function routeLabel(r: InviteRoute): string {
  return r === 'family' ? 'Family' : 'Friends'
}
