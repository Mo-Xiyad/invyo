# Marriage Invitation — Design Spec
**Date:** 2026-04-14  
**Project:** Digital Wedding Invitation — Ibrahim Zimam Ahmed Zahir & Yanal Ahmed Wafee  
**Deploy target:** Vercel  

---

## Context

A client requires a digital, mobile-first marriage ceremony invitation to be shared via messaging apps (WhatsApp, etc.). The event is the legal/religious ceremony — the wedding celebration is separate. The invitation must feel like a luxury physical invitation card that has been digitised: ornate, animated, Victorian-elegance theme. Two separate audience routes serve different arrival times while sharing all other content.

---

## Event Details

| Field | Value |
|-------|-------|
| Couple | Ibrahim Zimam Ahmed Zahir & Yanal Ahmed Wafee |
| Event | Marriage Ceremony |
| Date | Thursday, 8th May 2026 |
| Venue | Pavilion by Gold, Mafannu, Malé, Maldives |
| Family arrival | 16:30 |
| Friends arrival | 17:30 |
| Event ends | 19:30 |
| Dress — Women | Champagne Gold |
| Dress — Men | White & Navy Blue trousers |
| RSVP number | +46724551114 (WhatsApp) |
| RSVP deadline | 1st May 2026 |

---

## Routes

| Route | Arrival shown |
|-------|--------------|
| `/family` | 16:30 |
| `/friends` | 17:30 |

All other content is identical between routes. If someone visits `/` (root), redirect to `/friends` as the default.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Fonts | Cinzel (headers/labels) + Cormorant Garamond (body) + Great Vibes (script/names) — all via Google Fonts |
| Deployment | Vercel (zero-config) |
| Language | TypeScript |

---

## Design System

### Palette
| Token | Value | Use |
|-------|-------|-----|
| `champagne` | `#f7f0e4` | Page background, card face |
| `parchment` | `#fdf8f0` | Section backgrounds |
| `sand` | `#f0e8d8` | Alternate section bg (dress code) |
| `gold` | `#c9a96e` | Accents, borders, ornaments |
| `gold-deep` | `#8a6030` | Candelabra stem, details |
| `espresso` | `#2a1808` | Dark panel backgrounds, RSVP button |
| `espresso-dark` | `#1e1005` | Gradient pair for dark panels |
| `ink` | `#2a1808` | Body text |
| `muted` | `#9a7d5a` | Secondary text, labels |

### Typography
| Role | Font | Size / Weight |
|------|------|--------------|
| Names | Great Vibes | 34–38px |
| Script headings | Great Vibes | 20–30px |
| Section headings | Cormorant Garamond | 26–34px / 300 |
| Small caps labels | Cinzel | 7–10px / 400 / letter-spacing 4–6px |
| Body / italic detail | Cormorant Garamond Italic | 12–15px / 300 |

### Borders & Ornaments
- Double gold border: `inset 12px` + `inset 16px`, `rgba(201,169,110,0.4)` and `rgba(201,169,110,0.18)`
- SVG corner florals: L-bracket lines + diamond petal motif at each corner
- Section dividers: `linear-gradient(to right, transparent, gold, transparent)` 1px lines
- Diamond ornament divider: central SVG diamond with horizontal rules
- Subtle background grid: `repeating-linear-gradient` at 22px intervals, `rgba(201,169,110,0.055)`

---

## Screen Flow

```
1. Scratch Screen  →  2. Seal Tap  →  3. Card Opens  →  4. Invitation (scroll)
```

### Screen 1 — Scratch to Reveal
- Full-screen gold/champagne canvas overlay on top of the card
- Coating texture: diagonal brushed shimmer lines + fine crosshatch + radial vignette edges
- Label on coating: `"SCRATCH TO REVEAL · your invitation"` in Cinzel, muted brown
- User scratches with finger (touch) or mouse — `destination-out` canvas composite erases coating in 26px radius brush
- Progress bar at bottom tracks % scratched
- **Auto-reveal at 45% scratched**: remaining coating fades out, gold sparkle particles burst from seal centre, "Tap the seal to open" hint appears
- Beneath the coating: parchment card with double gold border, SVG corner ornaments, and the champagne wax seal centred

### Screen 2 — Wax Seal
- Champagne/gold radial gradient wax seal, 96px diameter
- Initials **Z & Y** in Great Vibes inside the seal
- Subtle floating bob animation (translateY -5px, 4s loop)
- On tap: card opens with scale + fade transition into the invitation content

### Screen 3 — Card Opens
- Scale-in animation (0.95 → 1.0) with opacity 0 → 1, 0.7s ease
- Reveals: "Marriage Ceremony" label, names (Ibrahim Zimam & Yanal Ahmed), gold divider, date, venue, "Scroll to explore ↓" hint

### Screen 4 — Invitation (full scroll)
Seven sections, described below.

---

## Invitation Sections (in order)

### § 1 Hero
- Content: animated candelabra SVG + "Marriage Ceremony" label + names in Great Vibes + gold ornament divider + date + venue
- Candelabra: 5 candles (1 centre, 2 mid, 2 outer) with independent flickering flames
  - Each flame: outer SVG path (flickerOuter keyframe, 1.8s), inner bright core (flickerInner, 1.2s), radial glow halo (SVG filter + CSS pulse)
  - Each candle staggered by ~0.35s so flames never sync
  - Ambient warm glow radial gradient above candelabra, pulsing 3s loop
- Name animation: Framer Motion `whileInView` fade + translateY from 20px, staggered 0.15s per element
- Background: double gold border + SVG corner florals + grid pattern

### § 2 Countdown
- Dark espresso panel
- "Countdown" in Great Vibes script + "Until 8th May 2026" in Cinzel small caps
- Live ticking: days / hrs / min / sec — updates every 1 second via `setInterval`
- Target is **route-specific**: `/family` → `2026-05-08T16:30:00+05:00`, `/friends` → `2026-05-08T17:30:00+05:00` (Maldives UTC+5)
- `Countdown` component accepts an `arrivalTime` prop and computes target accordingly
- Large Cormorant Garamond numbers (36–40px / 300 weight), no boxes around them
- Subtle radial gold glow from top, pulsing

### § 3 Event Details
- Parchment background
- Section heading "Event Details" (Cormorant Garamond 26px)
- Three rows: Date / Arrival Time (route-specific) / Venue
  - `/family` shows `16:30 — 19:30`, `/friends` shows `17:30 — 19:30`
  - Small dark pill badge: "Ends at 19:30"
- Gold glyph icons (✦ ◷ ⌖) as row markers
- Framer Motion scroll-reveal per row, staggered

### § 4 Dress Code
- Sand background
- Two tappable cards: Women (Champagne Gold swatch) and Men (half-white / half-navy swatch)
- Tap flips the card to reveal a short description (CSS opacity transition, dark espresso back face)
- "Tap ✦" micro-label hints interaction

### § 5 The Venue
- "The Venue" heading + "Pavilion by Gold" in Great Vibes script + address
- Embedded Google Maps iframe (actual embed URL for Pavilion by Gold)
- Map styled with CSS filter: `sepia(0.55) saturate(0.65) brightness(0.97) contrast(1.08) hue-rotate(8deg)` to match champagne palette
- Gold L-corner ornaments over map (pure CSS)
- Soft vignette radial gradient at map edges
- Two buttons: "📍 Get Directions" (links to `https://maps.app.goo.gl/ntVCs2GkrDmSJBRp6`) and "🗓 Add to Calendar" (Google Calendar URL with event pre-filled — no download, works natively on mobile)

### § 6 Private Notice
- Dark espresso panel
- Candle emoji (🕯) — tappable, triggers small sparkle animation
- "A Private Ceremony" in Great Vibes
- Body text (Cormorant Garamond italic):
  > "This is an intimate, invitation-only event.  
  > Your invitation is personal to you.  
  > You are welcome to bring one guest (+1).  
  > We kindly ask that no additional family members attend."
- Gold badge: `INVITATION ONLY · +1 PERMITTED`
- Ambient glow pulse from top
- **Language toggle** — interactive EN ↔ Dhivehi toggle, this section only
  - Small pill toggle button showing `EN | ދިވެހި`, styled in gold/espresso
  - Default: English. On tap switches to Dhivehi (RTL text). Tapping again reverts.
  - Dhivehi translations:
    - Heading: `ޕްރައިވެޓް ރަސްމިއްޔާތެއް`
    - Body:
      > "މިއީ ދައުވަތު ދެވިފައިވާ ބޭފުޅުންނަށް ހާއްސަ ވަރަށް ގާތް ރަސްމިއްޔާތެކެވެ.  
      > ތިޔަ ބޭފުޅާ ލިބިވަޑައިގެންނެވި ދައުވަތަކީ ވަކިން ހާއްސަ ގޮތެއްގައި ތިޔަ ބޭފުޅާ ލިބިވަޑައިގަތުމަށް ދެވިފައިވާ ދައުވަތެކެވެ.  
      > ތިޔަ ބޭފުޅާ ވަޑައިގަތުމަށް +1 ހިމެނިދާނެ.  
      > ތިޔަ ބޭފުޅާ ނޫން ހާއްސަ ދައުވަތު ނެތް ފަރާތް ތަކުން ބައިވެރި ނުވުން ވަރަށް ވެސް އިލްތިމާސް ކުރަމެވެ."
    - Badge: `ދައުވަތު ލިބިފައިވާ ފަރާތްތަކަށް · +1 ހުއްދަ`
  - When Dhivehi is active: text direction `dir="rtl"`, Cormorant Garamond italic still used (Arabic-script feel; fallback fine for Dhivehi script as it uses Thaana which is RTL)

### § 7 RSVP
- "RSVP" small caps pre-label
- "Will you join us?" in Great Vibes
- Subtitle: "Please let us know if you'll be attending."
- Single button: **RSVP** (Cinzel, dark espresso background, gold border)
  - On tap: opens `https://wa.me/46724551114?text=Hi%2C%20I%20would%20like%20to%20RSVP%20for%20the%20Marriage%20Ceremony%20of%20Ibrahim%20Zimam%20%26%20Yanal%20Ahmed`
  - Breathing pulse animation (box-shadow ripple, 3s loop)
- Deadline: "Kindly reply by 1st May 2026"
- Footer: "With love, Zimam & Yanal" in Great Vibes / gold

---

## Background Music

| Field | Value |
|-------|-------|
| File | `GooGooDolls-Iris.mp3` |
| Placement | `public/audio/GooGooDolls-Iris.mp3` |
| Trigger | Starts playing when the scratch auto-completes (at 45% scratched) — same moment the sparkles fire and the seal is revealed |
| Loop | Yes — loops continuously while the invitation is open |
| Default volume | 0.5 (50%) — fade in from 0 over 1.5s so it doesn't startle |
| Tab visibility | Pauses immediately when the tab is hidden or the browser is minimised (Page Visibility API: `document.addEventListener('visibilitychange', ...)`) — resumes when the tab becomes visible again |
| User control | A small muted/unmuted toggle button fixed to the bottom-right corner (like the reference videos). Icon: 🔊 / 🔇. Defaults to playing; user can mute. |

### Implementation Notes — Music

```tsx
// components/AudioPlayer.tsx
// - Holds a ref to an <audio> element with src="/audio/GooGooDolls-Iris.mp3" loop
// - Exposes a play() method called by ScratchReveal on reveal completion
// - Listens to document visibilitychange:
//     document.hidden → audio.pause()
//     !document.hidden && wasPlaying → audio.play()
// - Fade-in: use a short setInterval to ramp audio.volume from 0 → 0.5 over 1.5s
// - Mute toggle: audio.muted = !audio.muted
// - NOTE: mobile browsers require a user gesture before audio can play.
//   The scratch interaction itself IS a user gesture (touchstart/touchmove),
//   so calling audio.play() inside the reveal callback is safe.
//   No extra tap-to-enable gate needed.
```

### Music Toggle Button (UI)
- Fixed position: `bottom: 20px, right: 20px`, `z-index: 50`
- Style: small dark espresso circle (36px), gold icon, slight opacity (0.8)
- Hidden until music starts playing (opacity transition)
- Does not appear on the scratch screen — only visible once card is open

---

## Animations Summary

| Element | Technique | Notes |
|---------|-----------|-------|
| Scratch coating | Canvas `destination-out` | 26px brush, auto-complete at 45% |
| Sparkle burst | CSS `@keyframes` + JS spawn | 18 particles on reveal |
| Wax seal float | CSS `@keyframes` translateY | 4s infinite |
| Card open | Framer Motion scale + opacity | 0.7s ease |
| Typewriter (names) | Framer Motion + JS char-split | Characters revealed one by one, blinking gold cursor `\|` at end, 60ms per char |
| Candle flames | CSS `@keyframes` (3 layers) | Staggered ~0.35s per candle |
| Ambient glow | CSS `@keyframes` opacity | 3s ease-in-out infinite |
| Section reveal | Framer Motion `whileInView` | fade + translateY(20px), once |
| Dress card flip | CSS opacity transition | 0.25s, tap toggle |
| Countdown tick | `setInterval` 1000ms | JS, live |
| RSVP pulse | CSS box-shadow `@keyframes` | 3s ease-in-out infinite |
| Music fade-in | JS `setInterval` volume ramp | 0 → 0.5 over 1.5s on scratch complete |

---

## File Structure

```
app/
  layout.tsx          — root layout, fonts, metadata
  page.tsx            — redirect to /friends
  family/
    page.tsx          — invitation with arrivalTime="16:30"
  friends/
    page.tsx          — invitation with arrivalTime="17:30"
components/
  AudioPlayer.tsx     — audio element ref, play/pause, visibilitychange, fade-in, mute toggle
  ScratchReveal.tsx   — canvas scratch + wax seal + card open
  Candelabra.tsx      — SVG candelabra with animated flames
  Countdown.tsx       — live countdown timer
  EventDetails.tsx    — date/time/venue rows (accepts arrivalTime prop)
  DressCode.tsx       — flip cards
  VenueMap.tsx        — styled Google Maps iframe + buttons
  PrivateNotice.tsx   — dark espresso notice panel
  RSVPSection.tsx     — RSVP button + footer
  InvitationLayout.tsx — gold border + corner ornaments wrapper
public/
  audio/
    GooGooDolls-Iris.mp3
  fonts/              — (loaded via Google Fonts, no local files needed)
```

---

## Routing Logic

```tsx
// app/page.tsx
import { redirect } from 'next/navigation'
export default function Home() {
  redirect('/friends')
}

// app/friends/page.tsx
import Invitation from '@/components/InvitationPage'
export default function FriendsPage() {
  return <Invitation arrivalTime="17:30" />
}

// app/family/page.tsx
import Invitation from '@/components/InvitationPage'
export default function FamilyPage() {
  return <Invitation arrivalTime="16:30" />
}
```

---

## Key Implementation Notes

1. **Mobile-first**: max-width ~430px, no desktop layout needed. Center the card on larger screens with a dark background.
2. **Scratch canvas sizing**: canvas must match the screen pixel dimensions. Use `devicePixelRatio` for crisp rendering on retina screens.
3. **Candle flame SVG**: use `<filter>` with `feGaussianBlur` for the glow halo. Each `<g>` flame group has its own animation-delay set via JS after mount.
4. **Google Maps embed**: the iframe `src` is already confirmed working. Apply CSS filter via a wrapper class — do not inline style the iframe directly (Tailwind arbitrary value is fine: `[filter:sepia(0.55)_saturate(0.65)_brightness(0.97)_contrast(1.08)_hue-rotate(8deg)]`).
5. **WhatsApp RSVP URL**: `https://wa.me/46724551114?text=...` — pre-fill a polite message. URL-encode the text.
6. **Add to Calendar**: generate a `.ics` file blob on the client and trigger download, OR link to Google Calendar URL with event params.
7. **Fonts**: load via `next/font/google` in `layout.tsx` — Cinzel, Cormorant Garamond (weights 300, 400, italic), Great Vibes.
8. **No SEO needed**: add `<meta name="robots" content="noindex">` — this is a private invitation.

---

## Verification Checklist

- [ ] `/family` shows 16:30, `/friends` shows 17:30, `/` redirects to `/friends`
- [ ] Scratch coating renders at full canvas resolution (no blur on retina)
- [ ] Scratching 45%+ auto-completes and sparkles fire
- [ ] Tapping wax seal opens the card with animation
- [ ] All 5 candle flames flicker independently (no sync)
- [ ] Countdown ticks in real time to 8 May 2026
- [ ] Dress code cards flip on tap and flip back on second tap
- [ ] Google Maps loads and is sepia-tinted
- [ ] "Get Directions" links to correct Google Maps URL
- [ ] Music starts playing (fades in) exactly when scratch auto-completes
- [ ] Music pauses when tab is hidden / browser minimised; resumes on return
- [ ] Mute toggle button appears after music starts, correctly mutes/unmutes
- [ ] RSVP button opens WhatsApp with pre-filled message
- [ ] Private notice clearly states +1 only policy
- [ ] Fonts load correctly (Great Vibes, Cinzel, Cormorant Garamond)
- [ ] No horizontal scroll on mobile (375px viewport)
- [ ] Deploys to Vercel with zero config (`vercel deploy`)
