# Invyo — New Template Creation Guide

This guide covers everything needed to build, register, and wire up a new invitation template so it works with the editor, dashboard, RSVP system, subdomain routing, and background music.

---

## 1. Folder structure

```
templates/
└── your-template-id/          # kebab-case, unique
    ├── index.tsx               # Root component (required)
    ├── HeroSection.tsx
    ├── [other sections…]
    └── MusicToggle.tsx         # Template-specific music button (required — see §6)
```

Public assets go in:
```
public/templates/your-template-id/
    frame-1.png
    frame-2.png
    [any other images / video]
```

---

## 2. Register the template

Add an entry to `lib/templates.ts`:

```ts
{
  id: 'your-template-id',       // must match folder name exactly
  name: 'Human Readable Name',
  description: 'One-line description shown on the templates page.',
  tags: ['Modern', 'Minimal'],  // 2-4 tags shown as pills
  accentColor: '#C8A96E',
  bgFrom: '#F7FAFE',
  bgTo: '#E6EEF8',
  badgeLabel: 'New',            // optional — shown as a pill badge on the card
  previewPath: '/templates/your-template-id',
}
```

---

## 3. Root component contract (`index.tsx`)

The root component **must** accept these props:

```tsx
interface YourTemplateProps {
  invitationId?: string   // Supabase invitation row ID (for RSVP submissions)
  data?: InvitationData   // Merged user data; fall back to your template defaults
  previewMode?: boolean   // true when rendered inside the dashboard editor
}
```

Wrap everything with the shared providers:

```tsx
import { InvitationDataProvider } from '../arabic-moorish/InvitationDataContext'

export default function YourTemplate({
  invitationId,
  data = YOUR_TEMPLATE_DEFAULTS,
  previewMode = false,
}: YourTemplateProps) {
  return (
    <InvitationDataProvider data={data} previewMode={previewMode}>
      {/* your sections */}
    </InvitationDataProvider>
  )
}
```

---

## 4. Data & defaults

Add a `YOUR_TEMPLATE_DEFAULTS` constant to `lib/invitation-types.ts`:

```ts
export const YOUR_TEMPLATE_DEFAULTS: InvitationData = {
  groomNameEn: 'James',
  groomLastNameEn: 'Harrison',
  brideNameEn: 'Emma',
  brideLastNameEn: 'Sullivan',
  // … fill in all InvitationData fields
  musicUrl: '/music/background.mp3',  // ← always include
}
```

Then register it in `getTemplateDefaults()`:

```ts
export function getTemplateDefaults(templateId: string): InvitationData {
  if (templateId === 'arabic-moorish') return ARABIC_MOORISH_DEFAULTS
  if (templateId === 'your-template-id') return YOUR_TEMPLATE_DEFAULTS
  return DEFAULT_INVITATION_DATA
}
```

---

## 5. Preview page

Create `app/templates/your-template-id/page.tsx`:

```tsx
import { YOUR_TEMPLATE_DEFAULTS } from '@/lib/invitation-types'
import YourTemplate from '@/templates/your-template-id'

export default function YourTemplatePreviewPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center sm:py-12">
      {/* transform: translateZ(0) makes this a containing block for position:fixed children */}
      <div
        className="w-full sm:w-[390px] sm:min-h-[844px] sm:rounded-[44px] sm:shadow-2xl sm:overflow-hidden sm:ring-1 sm:ring-black/10"
        style={{ transform: 'translateZ(0)' }}
      >
        <YourTemplate data={YOUR_TEMPLATE_DEFAULTS} />
      </div>
    </div>
  )
}
```

> **Why `transform: translateZ(0)`?**
> This creates a CSS containing block for `position: fixed` children (video overlays, floating buttons).
> Without it, fixed elements escape the phone frame and attach to the viewport.

---

## 6. Background music & MusicToggle (REQUIRED)

### Shared hook — `lib/useBackgroundMusic.ts`

The audio logic (play/pause on visibility change, stop on unmount/navigation, mute toggle) lives in one shared hook. **Do not re-implement it per template.**

```ts
import { useBackgroundMusic } from '@/lib/useBackgroundMusic'

const { play, toggleMute, isMuted } = useBackgroundMusic({
  url: data.musicUrl || '/music/background.mp3',
  disabled: previewMode,   // never plays in editor preview
  volume: 0.3,
})
```

- Call `play()` on the user's first interaction (envelope open, tap-to-start, etc.)
- Pass `toggleMute` and `isMuted` to your template's own `MusicToggle` component.

### Per-template MusicToggle

**Every template must have its own `MusicToggle.tsx`** styled to match that template's design language (colours, shape, typography). This is intentional — the mute button is part of the template's visual identity.

Rules:
- Use `createPortal(…, document.body)` so the button is always fixed to the **viewport** (not the phone frame).
- Position it so it does not overlap the language toggle or other floating buttons.
- Hide it when `previewMode` is true (the editor handles its own controls).
- Only render it when the main invitation content is visible (not on the opening/envelope screen).

**Arabic Moorish reference** — `templates/arabic-moorish/MusicToggle.tsx`:
- Cream background `rgba(253, 246, 239, 0.92)`, gold border `rgba(200, 129, 58, 0.35)`
- Circular `44×44px`, positioned `bottom-8 right-5`
- Speaker-waves / Speaker-X SVG icons in gold `#C8813A`

**Wiring in `index.tsx`:**

```tsx
import MusicToggle from './MusicToggle'

// Inside JSX, after the main content is shown:
{!previewMode && <MusicToggle isMuted={isMuted} onToggle={toggleMute} />}
```

---

## 7. Editor sidebar fields

The editor at `app/dashboard/invitation/InvitationEditorClient.tsx` uses an `isRiviera` / template-ID flag to show/hide template-specific fields. Add your template's unique fields there:

```tsx
const isYourTemplate = templateId === 'your-template-id'

// Then in the JSX:
{isYourTemplate && (
  <Field label="Your custom field" … />
)}
```

The **Background music** section (using `MusicPicker`) is already in the Personalisation tab and applies to all templates — no extra work needed.

---

## 8. RSVP

The RSVP form must `POST` to `/api/rsvp` with the body:

```json
{
  "invitationId": "<uuid>",
  "name": "Guest Name",
  "attending": true,
  "message": "Optional message"
}
```

Use `data.rsvpDeadline` to display a "Kindly reply by …" notice.

---

## 9. Checklist before merging

- [ ] `lib/templates.ts` entry added
- [ ] `lib/invitation-types.ts` — defaults constant + `getTemplateDefaults()` case
- [ ] `app/templates/your-template-id/page.tsx` — preview page with phone frame
- [ ] Template accepts `{ invitationId, data, previewMode }` props
- [ ] `InvitationDataProvider` wraps the template
- [ ] `useBackgroundMusic` hook wired up (not custom audio logic)
- [ ] `MusicToggle.tsx` created, styled to match template, uses portal
- [ ] `MusicToggle` hidden in `previewMode`
- [ ] Public assets in `public/templates/your-template-id/`
- [ ] Template-specific editor fields added to `InvitationEditorClient.tsx`
- [ ] Build passes (`npm run build`)
