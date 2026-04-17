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

export function eventLabel(e: RsvpEvent): string {
  return e === 'wedding' ? 'Wedding' : 'Marriage ceremony'
}

export function routeLabel(r: InviteRoute): string {
  return r === 'family' ? 'Family' : 'Friends'
}
