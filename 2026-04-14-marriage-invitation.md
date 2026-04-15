# Marriage Invitation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first digital marriage ceremony invitation in Next.js 14 with a scratch-to-reveal entry, animated candelabra, live countdown, and WhatsApp RSVP — deployable to Vercel.

**Architecture:** Two static routes (`/family`, `/friends`) share one `InvitationPage` component parameterised by `arrivalTime`. The entry experience is a canvas scratch layer; once revealed, the full invitation scrolls through seven sections. Music starts on scratch completion and respects tab visibility.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Google Fonts (Cinzel, Cormorant Garamond, Great Vibes), Canvas API, Page Visibility API.

---

## File Map

```
app/
  layout.tsx                  — root layout: fonts, metadata, viewport
  page.tsx                    — redirect / → /friends
  globals.css                 — Tailwind base + custom keyframes + CSS vars
  family/page.tsx             — <InvitationPage arrivalTime="16:30" />
  friends/page.tsx            — <InvitationPage arrivalTime="17:30" />
components/
  InvitationPage.tsx          — assembles all sections; 'use client'
  ScratchReveal.tsx           — canvas scratch + wax seal + card-open; 'use client'
  AudioPlayer.tsx             — audio element, fade-in, visibilitychange, mute toggle; 'use client'
  Candelabra.tsx              — SVG candelabra with 5 animated flames; 'use client'
  Countdown.tsx               — live ticking countdown accepting arrivalTime; 'use client'
  EventDetails.tsx            — date/time/venue rows accepting arrivalTime; pure
  DressCode.tsx               — two flip cards (Women/Men); 'use client'
  VenueMap.tsx                — styled iframe + Get Directions + Add to Calendar; pure
  PrivateNotice.tsx           — dark espresso notice panel with EN/Dhivehi toggle; 'use client'
  RSVPSection.tsx             — RSVP WhatsApp button + footer; pure
  OrnamentDivider.tsx         — reusable SVG diamond ornament divider; pure
  CornerOrnament.tsx          — reusable SVG corner floral; pure
public/
  audio/GooGooDolls-Iris.mp3
tailwind.config.ts
```

---

## Task 0: Project Bootstrap

**Files:**
- Create: `package.json` (via Next.js CLI)
- Create: `tailwind.config.ts`
- Create: `public/audio/GooGooDolls-Iris.mp3` (copy asset)

- [ ] **Step 1: Scaffold Next.js project**

```bash
cd /Users/zee/Desktop/private/zim-and-yanal
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*" \
  --no-turbopack
```

When prompted: answer Yes to all defaults. This creates `app/`, `components/` (empty), `public/`, `tailwind.config.ts`, `tsconfig.json`.

- [ ] **Step 2: Install Framer Motion**

```bash
npm install framer-motion
```

Expected: framer-motion added to `package.json` dependencies.

- [ ] **Step 3: Copy the MP3 into public**

```bash
mkdir -p public/audio
cp "GooGooDolls-Iris.mp3" public/audio/GooGooDolls-Iris.mp3
```

- [ ] **Step 4: Create .gitignore entry for brainstorm files**

Add to `.gitignore`:
```
.superpowers/
```

- [ ] **Step 5: Verify dev server starts**

```bash
npm run dev
```

Expected: `ready - started server on http://localhost:3000`. Open in browser, see default Next.js page. Kill with Ctrl+C.

- [ ] **Step 6: Commit**

```bash
git init
git add -A
git commit -m "feat: bootstrap Next.js 14 project with Tailwind + Framer Motion"
```

---

## Task 1: Design Tokens & Global Styles

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

- [ ] **Step 1: Extend Tailwind with project colour tokens and font families**

Replace the contents of `tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        champagne:    '#f7f0e4',
        parchment:    '#fdf8f0',
        sand:         '#f0e8d8',
        gold:         '#c9a96e',
        'gold-deep':  '#8a6030',
        espresso:     '#2a1808',
        'espresso-dk':'#1e1005',
        ink:          '#2a1808',
        muted:        '#9a7d5a',
      },
      fontFamily: {
        cinzel:    ['var(--font-cinzel)', 'serif'],
        cormorant: ['var(--font-cormorant)', 'serif'],
        vibes:     ['var(--font-vibes)', 'cursive'],
      },
      keyframes: {
        sealFloat: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-5px)' },
        },
        hintPulse: {
          '0%,100%': { opacity: '0.4' },
          '50%':     { opacity: '1' },
        },
        ambPulse: {
          '0%,100%': { opacity: '0.5' },
          '50%':     { opacity: '1' },
        },
        rsvpPulse: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(201,169,110,0.15), 0 6px 18px rgba(42,24,8,0.3)' },
          '50%':     { boxShadow: '0 0 0 8px rgba(201,169,110,0), 0 8px 26px rgba(42,24,8,0.45)' },
        },
        flOut: {
          '0%,100%': { transform: 'scaleX(1) scaleY(1) rotate(0deg)' },
          '15%':  { transform: 'scaleX(0.87) scaleY(1.07) rotate(-2.5deg)' },
          '35%':  { transform: 'scaleX(1.07) scaleY(0.93) rotate(1.5deg)' },
          '55%':  { transform: 'scaleX(0.91) scaleY(1.08) rotate(-1deg)' },
          '75%':  { transform: 'scaleX(1.05) scaleY(0.95) rotate(2deg)' },
        },
        flIn: {
          '0%,100%': { transform: 'scaleX(1) scaleY(1)', opacity: '0.9' },
          '30%': { transform: 'scaleX(0.8) scaleY(1.13)', opacity: '1' },
          '65%': { transform: 'scaleX(1.1) scaleY(0.88)', opacity: '0.82' },
        },
        flGlow: {
          '0%,100%': { opacity: '0.4' },
          '50%':     { opacity: '0.9' },
        },
        sparkleAnim: {
          '0%':   { opacity: '0.9', transform: 'scale(1) translate(0, 0)' },
          '100%': { opacity: '0',   transform: 'scale(0.3) translate(var(--tx), var(--ty))' },
        },
        blink: {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0' },
        },
      },
      animation: {
        sealFloat: 'sealFloat 4s ease-in-out infinite',
        hintPulse: 'hintPulse 2s ease-in-out infinite',
        ambPulse:  'ambPulse 3s ease-in-out infinite',
        rsvpPulse: 'rsvpPulse 3s ease-in-out infinite',
        flOut:     'flOut 1.8s ease-in-out infinite',
        flIn:      'flIn 1.2s ease-in-out infinite',
        flGlow:    'flGlow 2s ease-in-out infinite',
        sparkle:   'sparkleAnim linear forwards',
        blink:     'blink 0.9s step-end infinite',
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 2: Replace globals.css**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    -webkit-tap-highlight-color: transparent;
    background-color: #0d0a07;
  }
  body {
    @apply bg-champagne text-ink;
    font-family: var(--font-cormorant), Georgia, serif;
  }
}

@layer utilities {
  .gold-divider {
    @apply w-full h-px;
    background: linear-gradient(to right, transparent, #c9a96e, transparent);
  }
  .gold-border {
    @apply absolute inset-3 border border-gold/40 pointer-events-none;
  }
  .gold-border-inner {
    @apply absolute inset-[14px] border border-gold/20 pointer-events-none;
  }
  .card-grid {
    background-image:
      repeating-linear-gradient(0deg, transparent, transparent 22px, rgba(201,169,110,0.055) 22px, rgba(201,169,110,0.055) 23px),
      repeating-linear-gradient(90deg, transparent, transparent 22px, rgba(201,169,110,0.055) 22px, rgba(201,169,110,0.055) 23px);
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts app/globals.css
git commit -m "feat: design tokens, Tailwind theme and global CSS keyframes"
```

---

## Task 2: Fonts & Root Layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace layout.tsx with font loading and metadata**

```tsx
// app/layout.tsx
import type { Metadata, Viewport } from 'next'
import { Cinzel, Cormorant_Garamond, Great_Vibes } from 'next/font/google'
import './globals.css'

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-cinzel',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const vibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-vibes',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ibrahim Zimam & Yanal Ahmed — Marriage Ceremony',
  description: 'You are invited.',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${cormorant.variable} ${vibes.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 2: Verify fonts compile**

```bash
npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully` with no type errors.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: load Cinzel, Cormorant Garamond, Great Vibes via next/font"
```

---

## Task 3: Routing

**Files:**
- Modify: `app/page.tsx`
- Create: `app/family/page.tsx`
- Create: `app/friends/page.tsx`

- [ ] **Step 1: Root redirect**

```tsx
// app/page.tsx
import { redirect } from 'next/navigation'
export default function Home() {
  redirect('/friends')
}
```

- [ ] **Step 2: Family route (placeholder)**

```tsx
// app/family/page.tsx
import InvitationPage from '@/components/InvitationPage'
export default function FamilyPage() {
  return <InvitationPage arrivalTime="16:30" />
}
```

- [ ] **Step 3: Friends route (placeholder)**

```tsx
// app/friends/page.tsx
import InvitationPage from '@/components/InvitationPage'
export default function FriendsPage() {
  return <InvitationPage arrivalTime="17:30" />
}
```

- [ ] **Step 4: Create stub InvitationPage so routes compile**

```tsx
// components/InvitationPage.tsx
'use client'
export default function InvitationPage({ arrivalTime }: { arrivalTime: '16:30' | '17:30' }) {
  return <div className="min-h-screen bg-champagne flex items-center justify-center font-cinzel text-gold text-sm tracking-widest">Loading… ({arrivalTime})</div>
}
```

- [ ] **Step 5: Verify routing works**

```bash
npm run dev
```

Open `http://localhost:3000` — should redirect to `http://localhost:3000/friends` showing "Loading… (17:30)".  
Open `http://localhost:3000/family` — should show "Loading… (16:30)".

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx app/family/page.tsx app/friends/page.tsx components/InvitationPage.tsx
git commit -m "feat: routing — / redirects to /friends, /family and /friends serve invitation"
```

---

## Task 4: Reusable Ornament Components

**Files:**
- Create: `components/CornerOrnament.tsx`
- Create: `components/OrnamentDivider.tsx`

- [ ] **Step 1: Create CornerOrnament**

```tsx
// components/CornerOrnament.tsx
// Renders a single gold SVG corner floral. Parent positions it absolute.
// Pass className for position (e.g. "top-2 left-2") and flip for mirroring.
type Props = { className?: string }

export default function CornerOrnament({ className = '' }: Props) {
  return (
    <svg
      className={`absolute pointer-events-none ${className}`}
      width="42" height="42" viewBox="0 0 42 42" fill="none"
    >
      <path d="M2 40 L2 2 L40 2" stroke="#c9a96e" strokeWidth="0.8" opacity="0.5" fill="none"/>
      <circle cx="12" cy="12" r="5" stroke="#c9a96e" strokeWidth="0.6" fill="none" opacity="0.38"/>
      <path d="M12 7 Q9 10 7 12 Q10 14 12 17 Q14 14 17 12 Q14 10 12 7Z"
            stroke="#c9a96e" strokeWidth="0.5" fill="none" opacity="0.38"/>
      <circle cx="12" cy="12" r="1.5" fill="#c9a96e" opacity="0.32"/>
      <path d="M18 12 Q23 8 27 2" stroke="#c9a96e" strokeWidth="0.45" fill="none" opacity="0.2"/>
      <path d="M12 18 Q8 23 2 27" stroke="#c9a96e" strokeWidth="0.45" fill="none" opacity="0.2"/>
    </svg>
  )
}
```

- [ ] **Step 2: Create OrnamentDivider**

```tsx
// components/OrnamentDivider.tsx
export default function OrnamentDivider() {
  return (
    <div className="text-center py-2">
      <svg width="96" height="22" viewBox="0 0 96 22" fill="none">
        <path d="M4 11 L36 11"  stroke="#c9a96e" strokeWidth="0.6" opacity="0.4"/>
        <path d="M60 11 L92 11" stroke="#c9a96e" strokeWidth="0.6" opacity="0.4"/>
        <path d="M48 3 Q43 7 41 11 Q43 15 48 19 Q53 15 55 11 Q53 7 48 3Z"
              stroke="#c9a96e" strokeWidth="0.7" fill="none" opacity="0.5"/>
        <circle cx="48" cy="11" r="1.4" fill="#c9a96e" opacity="0.5"/>
        <circle cx="7"  cy="11" r="1"   fill="#c9a96e" opacity="0.3"/>
        <circle cx="89" cy="11" r="1"   fill="#c9a96e" opacity="0.3"/>
      </svg>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/CornerOrnament.tsx components/OrnamentDivider.tsx
git commit -m "feat: reusable CornerOrnament and OrnamentDivider SVG components"
```

---

## Task 5: Candelabra Component

**Files:**
- Create: `components/Candelabra.tsx`

- [ ] **Step 1: Create the animated candelabra SVG**

```tsx
// components/Candelabra.tsx
'use client'
import { useEffect, useRef } from 'react'

// Each candle: { cx, cy (flame centre), candleY (rect top), candleH, boecheRx }
const CANDLES = [
  { id: 'c',  cx: 70,  cy: 17, candleY: 24, candleH: 22, bocheRx: 9,   delay: 0    },
  { id: 'l',  cx: 40,  cy: 28, candleY: 34, candleH: 18, bocheRx: 7,   delay: 0.37 },
  { id: 'r',  cx: 100, cy: 28, candleY: 34, candleH: 18, bocheRx: 7,   delay: 0.74 },
  { id: 'fl', cx: 18,  cy: 46, candleY: 50, candleH: 15, bocheRx: 6,   delay: 1.11 },
  { id: 'fr', cx: 122, cy: 46, candleY: 50, candleH: 15, bocheRx: 6,   delay: 1.48 },
]

function flameSize(id: string) {
  if (id === 'c')  return { outerR: 8, innerR: 5, glowR: 7 }
  if (id === 'l' || id === 'r') return { outerR: 7, innerR: 4, glowR: 5.5 }
  return { outerR: 6, innerR: 3.5, glowR: 4.5 }
}

export default function Candelabra({ className = '' }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    CANDLES.forEach((c) => {
      svg.querySelectorAll(`[data-candle="${c.id}"]`).forEach((el) => {
        ;(el as HTMLElement).style.animationDelay = `${c.delay}s`
      })
    })
  }, [])

  return (
    <svg ref={svgRef} viewBox="0 0 140 170" fill="none" className={className}>
      <defs>
        <filter id="cFlame">
          <feGaussianBlur stdDeviation="1.8" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="cGlow">
          <feGaussianBlur stdDeviation="3.2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="fgC" x1="70" y1="8"  x2="70" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#fff4aa"/>
          <stop offset="55%"  stopColor="#ffb830"/>
          <stop offset="100%" stopColor="#e05010" stopOpacity="0.6"/>
        </linearGradient>
        <linearGradient id="fgM" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#fff4aa"/>
          <stop offset="100%" stopColor="#ffb830" stopOpacity="0.75"/>
        </linearGradient>
        <linearGradient id="fgS" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#fff4aa"/>
          <stop offset="100%" stopColor="#ffa020" stopOpacity="0.55"/>
        </linearGradient>
      </defs>

      {CANDLES.map((c) => {
        const { outerR, innerR, glowR } = flameSize(c.id)
        const grad = c.id === 'c' ? 'url(#fgC)' : (c.id === 'l' || c.id === 'r') ? 'url(#fgM)' : 'url(#fgS)'
        const top = c.cy - outerR * 1.1
        return (
          <g key={c.id}>
            {/* glow halo */}
            <circle data-candle={c.id} className="animate-flGlow"
              cx={c.cx} cy={c.cy} r={glowR}
              fill="rgba(255,200,60,0.22)" filter="url(#cGlow)"/>
            {/* outer flame */}
            <path data-candle={c.id} className="animate-flOut" filter="url(#cFlame)"
              style={{ transformOrigin: `${c.cx}px ${c.cy}px` }}
              d={`M${c.cx} ${top} C${c.cx-outerR*0.7} ${c.cy-outerR*0.4} ${c.cx-outerR} ${c.cy} ${c.cx-outerR*0.3} ${c.cy+outerR*0.2} C${c.cx} ${c.cy+outerR*0.4} ${c.cx} ${c.cy+outerR*0.4} ${c.cx} ${c.cy+outerR*0.4} C${c.cx} ${c.cy+outerR*0.4} ${c.cx+outerR*0.3} ${c.cy+outerR*0.2} ${c.cx+outerR*0.3} ${c.cy} C${c.cx+outerR} ${c.cy-outerR*0.4} ${c.cx+outerR*0.7} ${top} ${c.cx} ${top}Z`}
              fill={grad}/>
            {/* inner bright core */}
            <path data-candle={c.id} className="animate-flIn" filter="url(#cFlame)"
              style={{ transformOrigin: `${c.cx}px ${c.cy}px` }}
              d={`M${c.cx} ${c.cy-innerR*1.5} C${c.cx-innerR*0.5} ${c.cy-innerR*0.5} ${c.cx-innerR*0.6} ${c.cy+innerR*0.3} ${c.cx} ${c.cy+innerR*0.5} C${c.cx+innerR*0.6} ${c.cy+innerR*0.3} ${c.cx+innerR*0.5} ${c.cy-innerR*0.5} ${c.cx} ${c.cy-innerR*1.5}Z`}
              fill="rgba(255,245,185,0.95)"/>
            {/* candle body */}
            <rect x={c.cx - 3} y={c.cy + outerR * 0.4}
              width="6" height={c.candleH} rx="1"
              fill="#f5e6c8" stroke="#c9a96e" strokeWidth="0.6"/>
            {/* bobeche */}
            <ellipse cx={c.cx} cy={c.cy + outerR * 0.4 + c.candleH}
              rx={c.bocheRx} ry="2.2"
              fill="#d4b896" stroke="#c9a96e" strokeWidth="0.65"/>
          </g>
        )
      })}

      {/* Arms */}
      <path d="M70 46 L70 80"            stroke="#8a6030" strokeWidth="2"   fill="none"/>
      <path d="M70 53 Q55 51 40 51.5"    stroke="#8a6030" strokeWidth="1.6" fill="none"/>
      <path d="M70 53 Q85 51 100 51.5"   stroke="#8a6030" strokeWidth="1.6" fill="none"/>
      <path d="M50 52 Q32 49 18 65"      stroke="#8a6030" strokeWidth="1.3" fill="none"/>
      <path d="M90 52 Q108 49 122 65"    stroke="#8a6030" strokeWidth="1.3" fill="none"/>

      {/* Stem nodes */}
      <ellipse cx="70" cy="88"  rx="5"  ry="3.5" stroke="#8a6030" strokeWidth="1" fill="#f5e6c8"/>
      <line x1="70" y1="91.5" x2="70" y2="104"  stroke="#8a6030" strokeWidth="2"/>
      <ellipse cx="70" cy="107" rx="4.5" ry="3"  stroke="#8a6030" strokeWidth="1" fill="#f5e6c8"/>
      <line x1="70" y1="110"  x2="70" y2="122"  stroke="#8a6030" strokeWidth="2"/>
      <ellipse cx="70" cy="125" rx="6"  ry="3.5" stroke="#8a6030" strokeWidth="1" fill="#f5e6c8"/>
      <line x1="70" y1="128.5" x2="70" y2="134" stroke="#8a6030" strokeWidth="2"/>

      {/* Base */}
      <ellipse cx="70" cy="138" rx="18" ry="5.5" stroke="#8a6030" strokeWidth="1.4" fill="#e8d0a0"/>
      <ellipse cx="70" cy="144" rx="26" ry="7"   stroke="#8a6030" strokeWidth="1.1" fill="#dfc090"/>
      <ellipse cx="70" cy="150" rx="30" ry="5"   stroke="#8a6030" strokeWidth="0.9" fill="#d8b880"/>
    </svg>
  )
}
```

- [ ] **Step 2: Quick smoke test — import Candelabra in InvitationPage stub and verify no TS errors**

```bash
npm run build 2>&1 | grep -E "error|Error|✓"
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 3: Commit**

```bash
git add components/Candelabra.tsx
git commit -m "feat: Candelabra SVG with 5 animated flickering flames"
```

---

## Task 6: ScratchReveal Component

**Files:**
- Create: `components/ScratchReveal.tsx`

- [ ] **Step 1: Create the scratch canvas component**

```tsx
// components/ScratchReveal.tsx
'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import CornerOrnament from './CornerOrnament'

interface Props {
  onRevealed: () => void   // called once when scratch auto-completes
  onOpen: () => void       // called when wax seal is tapped after reveal
}

export default function ScratchReveal({ onRevealed, onOpen }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const scratching = useRef(false)
  const revealed   = useRef(false)
  const scratchCount = useRef(0)
  const [showHint, setShowHint]   = useState(false)
  const [showOpen, setShowOpen]   = useState(false)
  const [canvasVisible, setCanvasVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  // Draw the luxury gold scratch coating onto the canvas
  const drawCoating = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number) => {
    const grad = ctx.createLinearGradient(0, 0, W, H)
    grad.addColorStop(0,   '#dfc898')
    grad.addColorStop(0.3, '#f0e0b0')
    grad.addColorStop(0.5, '#f8eecc')
    grad.addColorStop(0.7, '#f0e0b0')
    grad.addColorStop(1,   '#d8b880')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)

    // Diagonal shimmer lines
    ctx.save()
    ctx.globalAlpha = 0.11
    ctx.strokeStyle = '#fff8e0'
    ctx.lineWidth = 1
    for (let i = -H; i < W + H; i += 14) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + H, H); ctx.stroke()
    }
    ctx.restore()

    // Fine crosshatch
    ctx.save()
    ctx.globalAlpha = 0.055
    ctx.strokeStyle = '#8a6020'
    ctx.lineWidth = 0.5
    for (let i = 0; i < W; i += 6) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,H); ctx.stroke() }
    for (let j = 0; j < H; j += 6) { ctx.beginPath(); ctx.moveTo(0,j); ctx.lineTo(W,j); ctx.stroke() }
    ctx.restore()

    // Vignette
    const vig = ctx.createRadialGradient(W/2, H/2, H*0.25, W/2, H/2, H*0.8)
    vig.addColorStop(0, 'rgba(0,0,0,0)')
    vig.addColorStop(1, 'rgba(100,60,0,0.18)')
    ctx.fillStyle = vig
    ctx.fillRect(0, 0, W, H)

    // Outer borders
    ctx.save()
    ctx.strokeStyle = 'rgba(180,130,50,0.5)'; ctx.lineWidth = 1.5
    ctx.strokeRect(10, 10, W - 20, H - 20)
    ctx.strokeStyle = 'rgba(180,130,50,0.25)'; ctx.lineWidth = 1
    ctx.strokeRect(14, 14, W - 28, H - 28)
    ctx.restore()

    // Instruction text
    ctx.save()
    ctx.textAlign = 'center'
    ctx.font = 'bold 11px Cinzel, serif'
    ctx.fillStyle = 'rgba(80,50,10,0.45)'
    ctx.fillText('SCRATCH TO REVEAL', W / 2, H / 2 - 16)
    ctx.font = '18px serif'
    ctx.fillStyle = 'rgba(80,50,10,0.3)'
    ctx.fillText('✦', W / 2, H / 2 + 8)
    ctx.font = '10px Cinzel, serif'
    ctx.fillStyle = 'rgba(80,50,10,0.35)'
    ctx.fillText('your invitation', W / 2, H / 2 + 28)
    ctx.restore()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const W = canvas.offsetWidth
    const H = canvas.offsetHeight
    canvas.width  = W * dpr
    canvas.height = H * dpr
    const ctx = canvas.getContext('2d')!
    ctx.scale(dpr, dpr)
    drawCoating(ctx, W, H)
  }, [drawCoating])

  const getPercent = useCallback((): number => {
    const canvas = canvasRef.current
    if (!canvas) return 0
    const ctx = canvas.getContext('2d')!
    const dpr = window.devicePixelRatio || 1
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    let transparent = 0
    for (let i = 3; i < data.length; i += 4) if (data[i] < 128) transparent++
    return (transparent / (canvas.width * canvas.height / dpr / dpr)) * 100
  }, [])

  const triggerReveal = useCallback(() => {
    if (revealed.current) return
    revealed.current = true
    setCanvasVisible(false)
    setProgress(100)
    setTimeout(() => {
      setShowHint(true)
      spawnSparkles()
      onRevealed()
    }, 800)
  }, [onRevealed])

  const scratchAt = useCallback((clientX: number, clientY: number) => {
    if (revealed.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const dpr  = window.devicePixelRatio || 1
    const x = (clientX - rect.left)
    const y = (clientY - rect.top)
    const ctx = canvas.getContext('2d')!
    ctx.globalCompositeOperation = 'destination-out'
    const g = ctx.createRadialGradient(x * dpr, y * dpr, 0, x * dpr, y * dpr, 26 * dpr)
    g.addColorStop(0,   'rgba(0,0,0,1)')
    g.addColorStop(0.6, 'rgba(0,0,0,0.9)')
    g.addColorStop(1,   'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.beginPath(); ctx.arc(x * dpr, y * dpr, 26 * dpr, 0, Math.PI * 2); ctx.fill()

    scratchCount.current++
    if (scratchCount.current % 6 === 0) {
      const pct = getPercent()
      setProgress(Math.min(99, pct * 2.2))
      if (pct > 45) triggerReveal()
    }
  }, [getPercent, triggerReveal])

  // Spawn sparkle DOM elements
  function spawnSparkles() {
    const seal = document.getElementById('wax-seal')
    const wrapper = document.getElementById('scratch-wrapper')
    if (!seal || !wrapper) return
    const sr = seal.getBoundingClientRect()
    const wr = wrapper.getBoundingClientRect()
    const cx = sr.left - wr.left + sr.width / 2
    const cy = sr.top  - wr.top  + sr.height / 2
    const colors = ['#c9a96e','#f5e6c8','#e0b860','#fff4aa']
    for (let i = 0; i < 18; i++) {
      const sp = document.createElement('div')
      const size  = 3 + Math.random() * 5
      const angle = (Math.PI * 2 * i) / 18 + Math.random() * 0.3
      const dist  = 50 + Math.random() * 60
      sp.style.cssText = `
        position:absolute;border-radius:50%;pointer-events:none;
        width:${size}px;height:${size}px;
        left:${cx - size/2}px;top:${cy - size/2}px;
        background:${colors[i % colors.length]};
        --tx:${Math.cos(angle)*dist}px;--ty:${Math.sin(angle)*dist}px;
        animation:sparkleAnim ${0.6+Math.random()*0.5}s ${Math.random()*0.2}s linear forwards;
      `
      wrapper.appendChild(sp)
      setTimeout(() => sp.remove(), 1200)
    }
  }

  const handleTapSeal = () => {
    if (!revealed.current) { triggerReveal(); return }
    setShowOpen(true)
    setTimeout(onOpen, 700)
  }

  // Mouse handlers
  const onMouseDown = (e: React.MouseEvent) => { scratching.current = true; scratchAt(e.clientX, e.clientY) }
  const onMouseMove = (e: React.MouseEvent) => { if (scratching.current) scratchAt(e.clientX, e.clientY) }
  const onMouseUp   = () => { scratching.current = false }

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => { scratching.current = true; scratchAt(e.touches[0].clientX, e.touches[0].clientY) }
  const onTouchMove  = (e: React.TouchEvent) => { e.preventDefault(); if (scratching.current) scratchAt(e.touches[0].clientX, e.touches[0].clientY) }
  const onTouchEnd   = () => { scratching.current = false }

  return (
    <div
      id="scratch-wrapper"
      className="relative w-full h-full bg-parchment card-grid overflow-hidden"
    >
      {/* Card borders */}
      <div className="gold-border" />
      <div className="gold-border-inner" />

      {/* Corner ornaments */}
      <CornerOrnament className="top-2 left-2" />
      <CornerOrnament className="top-2 right-2 scale-x-[-1]" />
      <CornerOrnament className="bottom-2 left-2 scale-y-[-1]" />
      <CornerOrnament className="bottom-2 right-2 [transform:scale(-1)]" />

      {/* Wax seal (beneath canvas) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <button
          id="wax-seal"
          onClick={handleTapSeal}
          className="w-24 h-24 rounded-full animate-sealFloat cursor-pointer border-0 bg-transparent p-0"
          style={{
            background: 'radial-gradient(circle at 32% 28%, #f0dba8, #c9a96e 45%, #a07840 75%, #8a6530)',
            boxShadow: '0 8px 30px rgba(100,70,20,0.5), 0 2px 8px rgba(0,0,0,0.2), inset 0 1px 5px rgba(255,255,255,0.3)',
          }}
        >
          <span className="font-vibes text-[32px] text-[rgba(45,20,0,0.72)] select-none">Z&Y</span>
        </button>
      </div>

      {/* Canvas scratch layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full rounded-[28px] touch-none cursor-crosshair transition-opacity duration-700"
        style={{ opacity: canvasVisible ? 1 : 0, pointerEvents: revealed.current ? 'none' : 'auto' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />

      {/* Progress bar */}
      {!revealed.current && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <div className="w-24 h-[3px] bg-gold/20 rounded-full overflow-hidden mx-auto mb-1">
            <div className="h-full bg-gold rounded-full transition-[width] duration-100" style={{ width: `${progress}%` }}/>
          </div>
          <span className="font-cinzel text-[7px] tracking-[3px] text-gold/70 uppercase">Scratch to reveal</span>
        </div>
      )}

      {/* Tap hint (after reveal) */}
      {showHint && (
        <div className="absolute bottom-12 left-0 right-0 text-center pointer-events-none animate-hintPulse">
          <p className="font-cinzel text-[8px] tracking-[4px] text-muted uppercase">Tap the seal to open</p>
          <span className="text-gold text-sm block mt-1">✦</span>
        </div>
      )}

      {/* Card-open flash overlay */}
      {showOpen && (
        <div className="absolute inset-0 bg-parchment z-20 animate-[fadeIn_0.7s_ease_forwards]" />
      )}
    </div>
  )
}
```

- [ ] **Step 2: Add the fadeIn keyframe to tailwind.config.ts**

Open `tailwind.config.ts` and add inside `keyframes`:

```ts
fadeIn: {
  '0%':   { opacity: '0', transform: 'scale(0.96)' },
  '100%': { opacity: '1', transform: 'scale(1)' },
},
```

And in `animation`:

```ts
'[fadeIn_0.7s_ease_forwards]': 'fadeIn 0.7s ease forwards',
```

> Note: Tailwind arbitrary animation syntax `animate-[fadeIn_0.7s_ease_forwards]` works out of the box when the keyframe is defined in config.

- [ ] **Step 3: Commit**

```bash
git add components/ScratchReveal.tsx tailwind.config.ts
git commit -m "feat: ScratchReveal — canvas scratch coating, wax seal, auto-reveal at 45%, sparkles"
```

---

## Task 7: AudioPlayer Component

**Files:**
- Create: `components/AudioPlayer.tsx`

- [ ] **Step 1: Create AudioPlayer**

```tsx
// components/AudioPlayer.tsx
'use client'
import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react'

export interface AudioPlayerHandle {
  startMusic: () => void
}

const AudioPlayer = forwardRef<AudioPlayerHandle>((_, ref) => {
  const audioRef  = useRef<HTMLAudioElement>(null)
  const [muted, setMuted]     = useState(false)
  const [visible, setVisible] = useState(false)
  const wasPlaying = useRef(false)

  useImperativeHandle(ref, () => ({
    startMusic() {
      const audio = audioRef.current
      if (!audio) return
      audio.volume = 0
      audio.muted  = false
      audio.play().catch(() => {/* blocked — user hasn't interacted yet */})
      setVisible(true)
      // Fade in volume 0 → 0.5 over 1.5s
      const step = 0.5 / 30
      let v = 0
      const iv = setInterval(() => {
        v = Math.min(0.5, v + step)
        if (audioRef.current) audioRef.current.volume = v
        if (v >= 0.5) clearInterval(iv)
      }, 50)
    },
  }))

  useEffect(() => {
    const handleVisibility = () => {
      const audio = audioRef.current
      if (!audio) return
      if (document.hidden) {
        wasPlaying.current = !audio.paused
        audio.pause()
      } else if (wasPlaying.current) {
        audio.play().catch(() => {})
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setMuted(audio.muted)
  }

  return (
    <>
      {/* Hidden audio element */}
      <audio ref={audioRef} src="/audio/GooGooDolls-Iris.mp3" loop preload="auto" />

      {/* Mute toggle button */}
      {visible && (
        <button
          onClick={toggleMute}
          className="fixed bottom-5 right-5 z-50 w-9 h-9 rounded-full bg-espresso/80 border border-gold/30 flex items-center justify-center text-base transition-opacity duration-300"
          aria-label={muted ? 'Unmute music' : 'Mute music'}
        >
          {muted ? '🔇' : '🔊'}
        </button>
      )}
    </>
  )
})

AudioPlayer.displayName = 'AudioPlayer'
export default AudioPlayer
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build 2>&1 | grep -E "error|✓"
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 3: Commit**

```bash
git add components/AudioPlayer.tsx
git commit -m "feat: AudioPlayer — fade-in on startMusic(), visibilitychange pause/resume, mute toggle"
```

---

## Task 8: Countdown Component

**Files:**
- Create: `components/Countdown.tsx`

- [ ] **Step 1: Write the countdown logic helper (pure function, easy to test)**

```tsx
// components/Countdown.tsx
'use client'
import { useEffect, useState } from 'react'

// arrivalTime: '16:30' | '17:30'
function getTarget(arrivalTime: string): Date {
  const [h, m] = arrivalTime.split(':').map(Number)
  // Maldives is UTC+5. Construct as UTC then subtract 5h.
  const d = new Date(Date.UTC(2026, 4, 8, h - 5, m, 0)) // month is 0-indexed, May=4
  return d
}

function calcRemaining(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now())
  return {
    days:  Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins:  Math.floor((diff % 3600000)  / 60000),
    secs:  Math.floor((diff % 60000)    / 1000),
  }
}

export default function Countdown({ arrivalTime }: { arrivalTime: string }) {
  const target = getTarget(arrivalTime)
  const [t, setT] = useState(calcRemaining(target))

  useEffect(() => {
    const iv = setInterval(() => setT(calcRemaining(target)), 1000)
    return () => clearInterval(iv)
  }, [arrivalTime]) // eslint-disable-line react-hooks/exhaustive-deps

  const fmt = (n: number) => String(n).padStart(2, '0')
  const units = [
    { value: t.days,  label: 'Days' },
    { value: t.hours, label: 'Hrs'  },
    { value: t.mins,  label: 'Min'  },
    { value: t.secs,  label: 'Sec'  },
  ]

  return (
    <section className="bg-espresso py-7 px-4 text-center relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-28 pointer-events-none animate-ambPulse"
           style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,200,80,0.08), transparent 65%)' }}/>

      <p className="font-vibes text-gold text-[22px] relative">Countdown</p>
      <p className="font-cinzel text-[7px] tracking-[4px] text-[#6a4a2a] uppercase mb-5 relative">
        Until 8th May 2026
      </p>

      <div className="flex justify-center relative">
        {units.map((u, i) => (
          <div key={u.label} className="flex items-start">
            <div className="text-center min-w-[44px]">
              <span className="font-cormorant font-light text-[38px] text-champagne leading-none block tabular-nums">
                {fmt(u.value)}
              </span>
              <span className="font-cinzel text-[6.5px] tracking-[2px] text-[#6a4a2a] uppercase mt-1 block">
                {u.label}
              </span>
            </div>
            {i < 3 && (
              <span className="text-[22px] text-gold/20 leading-[38px] px-0.5">·</span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Countdown.tsx
git commit -m "feat: Countdown — live ticking timer, route-specific target time (Maldives UTC+5)"
```

---

## Task 9: EventDetails Component

**Files:**
- Create: `components/EventDetails.tsx`

- [ ] **Step 1: Create EventDetails**

```tsx
// components/EventDetails.tsx
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

const rows = (arrivalTime: string) => [
  { glyph: '✦', label: 'Date',          value: 'Thursday, 8th May 2026', pill: null },
  { glyph: '◷', label: 'Arrival · Ends', value: `${arrivalTime} — 19:30`, pill: 'Ends at 19:30' },
  { glyph: '⌖', label: 'Venue',         value: 'Pavilion by Gold',       pill: null },
]

export default function EventDetails({ arrivalTime }: { arrivalTime: string }) {
  return (
    <section className="bg-parchment px-6 py-10">
      <motion.h2
        className="font-cormorant font-light text-[28px] text-ink text-center mb-1"
        initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
      >
        Event Details
      </motion.h2>
      <motion.p
        className="font-cormorant italic text-[13px] text-muted text-center mb-6"
        initial="hidden" whileInView="show" viewport={{ once: true }}
        variants={{ ...fadeUp, show: { ...fadeUp.show, transition: { delay: 0.1, duration: 0.55 } } }}
      >
        Everything you need to know
      </motion.p>

      <div className="max-w-[220px] mx-auto">
        {rows(arrivalTime).map((row, i) => (
          <motion.div
            key={row.label}
            className="flex items-start gap-3 py-2.5 border-b border-gold/10 last:border-b-0"
            initial="hidden" whileInView="show" viewport={{ once: true }}
            variants={{ ...fadeUp, show: { ...fadeUp.show, transition: { delay: i * 0.12, duration: 0.55 } } }}
          >
            <span className="text-gold text-[12px] w-4 text-center flex-shrink-0 mt-0.5">{row.glyph}</span>
            <div>
              <p className="font-cinzel text-[7px] tracking-[2.5px] text-muted uppercase mb-0.5">{row.label}</p>
              <p className="font-cormorant italic text-[15px] text-ink">{row.value}</p>
              {row.pill && (
                <span className="inline-block bg-espresso text-champagne font-cinzel text-[7.5px] tracking-[1.5px] px-2 py-0.5 rounded-full mt-1">
                  {row.pill}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/EventDetails.tsx
git commit -m "feat: EventDetails — date/time/venue rows with arrivalTime prop and scroll reveal"
```

---

## Task 10: DressCode Component

**Files:**
- Create: `components/DressCode.tsx`

- [ ] **Step 1: Create DressCode with flip cards**

```tsx
// components/DressCode.tsx
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

const cards = [
  {
    role: 'Women',
    name: 'Satin Champagne',
    swatchStyle: { background: 'linear-gradient(145deg, #f5e6c8, #d4b896)' },
    detail: 'Floor-length gown in satin champagne or ivory. Elegant and formal.',
  },
  {
    role: 'Men',
    name: 'White & Navy Blue',
    swatchStyle: { background: 'linear-gradient(145deg, #f0f0f0 0%, #f0f0f0 49%, #1a2a4a 50%)' },
    detail: 'White dress shirt with navy blue trousers. Formal attire.',
  },
]

export default function DressCode() {
  const [flipped, setFlipped] = useState<boolean[]>([false, false])

  const toggle = (i: number) => setFlipped((prev) => prev.map((v, idx) => idx === i ? !v : v))

  return (
    <section className="bg-sand px-5 py-9">
      <motion.h2
        className="font-cormorant font-light text-[28px] text-ink text-center mb-1"
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.55 }}
      >
        Dress Code
      </motion.h2>
      <p className="font-cormorant italic text-[12px] text-muted text-center mb-5">Tap a card to see details</p>

      <div className="flex gap-3">
        {cards.map((card, i) => (
          <button
            key={card.role}
            onClick={() => toggle(i)}
            className="flex-1 relative border border-gold/20 rounded-sm overflow-hidden min-h-[140px] bg-parchment"
          >
            {/* Front */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center p-3 transition-opacity duration-250 ${flipped[i] ? 'opacity-0' : 'opacity-100'}`}>
              <div className="w-11 h-11 rounded-full mb-2.5 shadow-md" style={card.swatchStyle}/>
              <p className="font-cinzel text-[7px] tracking-[3px] text-muted uppercase mb-1">{card.role}</p>
              <p className="font-cormorant italic text-[13px] text-ink leading-tight">{card.name}</p>
              <p className="font-cinzel text-[6.5px] tracking-[2px] text-gold mt-1.5 uppercase opacity-70">Tap ✦</p>
            </div>
            {/* Back */}
            <div className={`absolute inset-0 flex items-center justify-center p-3 bg-espresso transition-opacity duration-250 ${flipped[i] ? 'opacity-100' : 'opacity-0'}`}>
              <p className="font-cormorant italic text-[12px] text-champagne leading-relaxed text-center">{card.detail}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/DressCode.tsx
git commit -m "feat: DressCode — tap-to-flip cards for Women/Men dress code"
```

---

## Task 11: VenueMap Component

**Files:**
- Create: `components/VenueMap.tsx`

- [ ] **Step 1: Create VenueMap**

```tsx
// components/VenueMap.tsx
import { motion } from 'framer-motion'

const MAPS_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1563.8215046086982!2d73.50197245862587!3d4.175075788739645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b3f7f177cdaeed5%3A0xc64d6b60bacc23a3!2sPavilion%20by%20Gold!5e1!3m2!1sen!2sse!4v1776172404845!5m2!1sen!2sse'
const DIRECTIONS_URL = 'https://maps.app.goo.gl/ntVCs2GkrDmSJBRp6'
const CALENDAR_URL   = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Ibrahim+Zimam+%26+Yanal+Ahmed+%E2%80%94+Marriage+Ceremony&dates=20260508T113000Z%2F20260508T143000Z&details=Marriage+Ceremony&location=Pavilion+by+Gold%2C+Mafannu%2C+Mal%C3%A9%2C+Maldives'

export default function VenueMap() {
  return (
    <section className="bg-parchment px-5 py-9">
      <motion.h2
        className="font-cormorant font-light text-[28px] text-ink text-center mb-1"
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.55 }}
      >
        The Venue
      </motion.h2>
      <p className="font-vibes text-[26px] text-ink text-center mb-1">Pavilion by Gold</p>
      <p className="font-cormorant italic text-[12px] text-muted text-center leading-relaxed mb-4">
        Mafannu, Malé<br/>Maldives
      </p>

      {/* Styled map */}
      <div className="relative rounded-[6px] overflow-hidden mb-3"
           style={{ boxShadow: '0 0 0 1px rgba(201,169,110,0.35), 0 0 0 4px #fdf8f0, 0 0 0 5px rgba(201,169,110,0.2)' }}>
        {/* Corner ornaments */}
        {['top-1.5 left-1.5 border-t border-l','top-1.5 right-1.5 border-t border-r','bottom-1.5 left-1.5 border-b border-l','bottom-1.5 right-1.5 border-b border-r'].map((cls) => (
          <div key={cls} className={`absolute w-4 h-4 z-10 pointer-events-none border-gold/70 ${cls}`}/>
        ))}
        <iframe
          src={MAPS_EMBED}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="block w-full h-[170px] border-0"
          style={{ filter: 'sepia(0.55) saturate(0.65) brightness(0.97) contrast(1.08) hue-rotate(8deg)' }}
        />
      </div>

      <div className="flex gap-2">
        <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer"
           className="flex-1 border border-gold/40 text-muted font-cinzel text-[7.5px] tracking-[2px] uppercase py-2.5 rounded-sm text-center">
          📍 Get Directions
        </a>
        <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer"
           className="flex-1 border border-gold/40 text-muted font-cinzel text-[7.5px] tracking-[2px] uppercase py-2.5 rounded-sm text-center">
          🗓 Add to Calendar
        </a>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/VenueMap.tsx
git commit -m "feat: VenueMap — themed Google Maps iframe, Directions and Add to Calendar links"
```

---

## Task 12: PrivateNotice Component

**Files:**
- Create: `components/PrivateNotice.tsx`

- [ ] **Step 1: Create PrivateNotice with EN/Dhivehi toggle**

```tsx
'use client'
// components/PrivateNotice.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'

const CONTENT = {
  en: {
    heading: 'A Private Ceremony',
    body1: (<>This is an intimate,<br/>invitation-only event.</>),
    body2: (
      <>
        Your invitation is personal to you.<br/>
        You are welcome to bring<br/>
        one guest (+1).<br/><br/>
        We kindly ask that no additional<br/>
        family members attend.
      </>
    ),
    badge: 'Invitation Only · +1 Permitted',
    dir: 'ltr' as const,
  },
  dv: {
    heading: 'ޕްރައިވެޓް ރަސްމިއްޔާތެއް',
    body1: (<>މިއީ ދައުވަތު ދެވިފައިވާ ބޭފުޅުންނަށް ހާއްސަ<br/>ވަރަށް ގާތް ރަސްމިއްޔާތެކެވެ.</>),
    body2: (
      <>
        ތިޔަ ބޭފުޅާ ލިބިވަޑައިގެންނެވި ދައުވަތަކީ ވަކިން ހާއްސަ<br/>
        ގޮތެއްގައި ތިޔަ ބޭފުޅާ ލިބިވަޑައިގަތުމަށް ދެވިފައިވާ ދައުވަތެކެވެ.<br/>
        ތިޔަ ބޭފުޅާ ވަޑައިގަތުމަށް +1 ހިމެނިދާނެ.<br/><br/>
        ތިޔަ ބޭފުޅާ ނޫން ހާއްސަ ދައުވަތު ނެތް ފަރާތް ތަކުން<br/>
        ބައިވެރި ނުވުން ވަރަށް ވެސް އިލްތިމާސް ކުރަމެވެ.
      </>
    ),
    badge: 'ދައުވަތު ލިބިފައިވާ ފަރާތްތަކަށް · +1 ހުއްދަ',
    dir: 'rtl' as const,
  },
}

export default function PrivateNotice() {
  const [lang, setLang] = useState<'en' | 'dv'>('en')
  const c = CONTENT[lang]

  return (
    <section className="relative overflow-hidden px-6 py-9 text-center"
             style={{ background: 'linear-gradient(170deg, #2a1808, #1e1005)' }}>
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 pointer-events-none animate-ambPulse"
           style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,200,60,0.07), transparent 55%)' }}/>

      {/* Language toggle */}
      <div className="relative flex justify-center mb-4">
        <button
          onClick={() => setLang(l => l === 'en' ? 'dv' : 'en')}
          className="flex items-center gap-0 border border-gold/30 rounded-full overflow-hidden font-cinzel text-[7px] tracking-[2px] uppercase"
          aria-label="Toggle language"
        >
          <span className={`px-3 py-1.5 transition-colors duration-200 ${lang === 'en' ? 'bg-gold/20 text-champagne' : 'text-gold/50'}`}>
            EN
          </span>
          <span className="w-px h-4 bg-gold/20" />
          <span className={`px-3 py-1.5 transition-colors duration-200 font-sans text-[9px] ${lang === 'dv' ? 'bg-gold/20 text-champagne' : 'text-gold/50'}`}>
            ދިވެހި
          </span>
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <span className="text-[28px] block mb-3 relative">🕯</span>
        <h2 className="font-vibes text-[24px] text-champagne mb-3 relative">{c.heading}</h2>
        <div dir={c.dir}>
          <p className="font-cormorant italic text-[12.5px] text-gold/80 leading-[1.9] relative">
            {c.body1}
          </p>
          <div className="w-10 h-px mx-auto my-3" style={{ background: 'rgba(201,169,110,0.25)' }}/>
          <p className="font-cormorant italic text-[12.5px] text-gold/80 leading-[1.9] relative">
            {c.body2}
          </p>
          <span className="inline-block border border-gold/30 text-champagne font-cinzel text-[7px] tracking-[3px] uppercase px-3.5 py-1.5 mt-3.5 relative">
            {c.badge}
          </span>
        </div>
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/PrivateNotice.tsx
git commit -m "feat: PrivateNotice — dark panel with EN/Dhivehi toggle and +1 policy"
```

---

## Task 13: RSVPSection Component

**Files:**
- Create: `components/RSVPSection.tsx`

- [ ] **Step 1: Create RSVPSection**

```tsx
// components/RSVPSection.tsx
import { motion } from 'framer-motion'

const WA_URL = 'https://wa.me/46724551114?text=Hi%2C%20I%20would%20like%20to%20RSVP%20for%20the%20Marriage%20Ceremony%20of%20Ibrahim%20Zimam%20%26%20Yanal%20Ahmed%20on%208th%20May%202026.'

export default function RSVPSection() {
  return (
    <section className="bg-parchment px-6 pt-9 pb-14 text-center">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <p className="font-cinzel text-[7.5px] tracking-[5px] text-gold uppercase mb-2">RSVP</p>
        <h2 className="font-vibes text-[32px] text-ink mb-2">Will you join us?</h2>
        <p className="font-cormorant italic text-[12px] text-muted leading-relaxed mb-6">
          Please let us know if<br/>you&apos;ll be attending.
        </p>

        <a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center mx-auto mb-3 font-cinzel text-[11px] tracking-[6px] uppercase text-champagne rounded-sm animate-rsvpPulse"
          style={{
            background: '#2a1808',
            border: '1px solid rgba(201,169,110,0.35)',
            padding: '15px 20px',
            maxWidth: '220px',
          }}
        >
          RSVP
        </a>

        <p className="font-cormorant italic text-[11px] text-[#b09070]">
          Kindly reply by 1st May 2026
        </p>
      </motion.div>

      <div className="mt-10">
        <p className="font-vibes text-[20px] text-gold">With love, Zimam &amp; Yanal</p>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/RSVPSection.tsx
git commit -m "feat: RSVPSection — WhatsApp RSVP link, deadline, footer"
```

---

## Task 14: Hero Section & Typewriter Names

**Files:**
- Create: `components/HeroSection.tsx`

- [ ] **Step 1: Create HeroSection with typewriter animation**

```tsx
// components/HeroSection.tsx
'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Candelabra from './Candelabra'
import CornerOrnament from './CornerOrnament'

const NAME1 = 'Ibrahim Zimam'
const NAME2 = 'Yanal Ahmed'
const CHAR_DELAY = 60 // ms per character

export default function HeroSection() {
  const [line1, setLine1] = useState('')
  const [line2, setLine2] = useState('')
  const [showCursor1, setShowCursor1] = useState(true)
  const [showCursor2, setShowCursor2] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    const iv1 = setInterval(() => {
      i++
      setLine1(NAME1.slice(0, i))
      if (i >= NAME1.length) {
        clearInterval(iv1)
        setShowCursor1(false)
        setShowCursor2(true)
        let j = 0
        const iv2 = setInterval(() => {
          j++
          setLine2(NAME2.slice(0, j))
          if (j >= NAME2.length) {
            clearInterval(iv2)
            setTimeout(() => { setShowCursor2(false); setDone(true) }, 600)
          }
        }, CHAR_DELAY)
      }
    }, CHAR_DELAY)
    return () => clearInterval(iv1)
  }, [])

  return (
    <section className="relative bg-parchment card-grid px-5 pt-9 pb-7 text-center overflow-hidden">
      {/* Ambient candle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-36 pointer-events-none animate-ambPulse"
           style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,200,80,0.11), transparent 65%)' }}/>

      {/* Borders */}
      <div className="gold-border"/>
      <div className="gold-border-inner"/>

      {/* Corner ornaments */}
      <CornerOrnament className="top-1 left-1"/>
      <CornerOrnament className="top-1 right-1 scale-x-[-1]"/>
      <CornerOrnament className="bottom-1 left-1 scale-y-[-1]"/>
      <CornerOrnament className="bottom-1 right-1 [transform:scale(-1)]"/>

      {/* Candelabra */}
      <Candelabra className="w-36 mx-auto mb-5 relative"/>

      {/* Label */}
      <motion.p
        className="font-cinzel text-[7px] tracking-[6px] text-gold uppercase mb-3 relative"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
      >
        Marriage Ceremony
      </motion.p>

      {/* Typewriter names */}
      <div className="relative">
        <p className="font-vibes text-[34px] text-ink leading-tight">
          {line1}
          {showCursor1 && <span className="inline-block w-[2px] h-[0.9em] bg-gold ml-[1px] align-middle animate-blink"/>}
        </p>

        <motion.p
          className="font-vibes text-[26px] text-gold my-1"
          initial={{ opacity: 0 }} animate={{ opacity: line1.length === NAME1.length ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          &amp;
        </motion.p>

        <p className="font-vibes text-[34px] text-ink leading-tight">
          {line2}
          {showCursor2 && <span className="inline-block w-[2px] h-[0.9em] bg-gold ml-[1px] align-middle animate-blink"/>}
        </p>
      </div>

      {/* Divider */}
      {done && (
        <motion.div
          className="flex items-center gap-2 mx-auto my-4 max-w-[140px]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
        >
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.5))' }}/>
          <span className="text-gold text-[8px]">✦</span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(201,169,110,0.5))' }}/>
        </motion.div>
      )}

      {done && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
          <p className="font-cinzel text-[10px] tracking-[3px] text-[#5a3a1a] mb-1">8th May · MMXXVI</p>
          <p className="font-cormorant italic text-[13px] text-muted">Pavilion by Gold, Maldives</p>
        </motion.div>
      )}

      {/* Scroll hint */}
      {done && (
        <motion.p
          className="font-cinzel text-[7px] tracking-[3px] text-gold uppercase mt-5 animate-hintPulse"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        >
          Scroll ↓
        </motion.p>
      )}
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/HeroSection.tsx
git commit -m "feat: HeroSection — candelabra, typewriter names with blinking cursor, scroll reveal"
```

---

## Task 15: Assemble InvitationPage

**Files:**
- Modify: `components/InvitationPage.tsx`

- [ ] **Step 1: Replace stub InvitationPage with full assembly**

```tsx
// components/InvitationPage.tsx
'use client'
import { useRef, useState } from 'react'
import ScratchReveal from './ScratchReveal'
import HeroSection from './HeroSection'
import Countdown from './Countdown'
import EventDetails from './EventDetails'
import DressCode from './DressCode'
import VenueMap from './VenueMap'
import OrnamentDivider from './OrnamentDivider'
import PrivateNotice from './PrivateNotice'
import RSVPSection from './RSVPSection'
import AudioPlayer, { AudioPlayerHandle } from './AudioPlayer'

export default function InvitationPage({ arrivalTime }: { arrivalTime: '16:30' | '17:30' }) {
  const [phase, setPhase] = useState<'scratch' | 'open'>('scratch')
  const audioRef = useRef<AudioPlayerHandle>(null)

  const handleRevealed = () => {
    // Start music the moment the scratch completes
    audioRef.current?.startMusic()
  }

  const handleOpen = () => {
    setPhase('open')
  }

  return (
    // Outer wrapper: dark bg on desktop, invitation centred
    <div className="min-h-screen flex items-start justify-center" style={{ background: '#0d0a07' }}>
      <div className="w-full max-w-[430px] min-h-screen relative">

        {/* ── SCRATCH ENTRY SCREEN ── */}
        {phase === 'scratch' && (
          <div className="w-full h-screen">
            <ScratchReveal onRevealed={handleRevealed} onOpen={handleOpen} />
          </div>
        )}

        {/* ── INVITATION CONTENT ── */}
        {phase === 'open' && (
          <main className="bg-parchment">
            <HeroSection />
            <Countdown arrivalTime={arrivalTime} />
            <EventDetails arrivalTime={arrivalTime} />
            <DressCode />
            <VenueMap />
            <OrnamentDivider />
            <PrivateNotice />
            <RSVPSection />
          </main>
        )}

        {/* Audio player (always mounted so audio element is ready) */}
        <AudioPlayer ref={audioRef} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify both routes build without errors**

```bash
npm run build 2>&1 | tail -30
```

Expected: `✓ Compiled successfully`, no TypeScript errors, both `/family` and `/friends` listed in the route table.

- [ ] **Step 3: Commit**

```bash
git add components/InvitationPage.tsx
git commit -m "feat: assemble InvitationPage — scratch entry, all 7 sections, audio wired up"
```

---

## Task 16: End-to-End Verification

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Test `/` redirects to `/friends`**

Open `http://localhost:3000` — URL should change to `/friends`. Page shows scratch coating.

- [ ] **Step 3: Test scratch interaction**

Drag mouse across the scratch coating on `/friends`. Progress bar increments. At ~45% scratched the coating fades, sparkles appear, wax seal bobs.

- [ ] **Step 4: Test music starts on reveal**

After scratch completes, music (`Iris`) should begin playing (fading in). Check browser tab audio indicator appears.

- [ ] **Step 5: Test tab visibility pause**

While music plays, switch to a different browser tab. Music should pause. Return to the invitation tab — music resumes.

- [ ] **Step 6: Test seal tap opens card**

Tap the wax seal after scratch reveals it. Card should transition to the invitation content (HeroSection visible, typewriter starts).

- [ ] **Step 7: Test typewriter animation**

"Ibrahim Zimam" types out character by character with blinking gold cursor. Then "&" fades in. Then "Yanal Ahmed" types out. Cursor disappears when done.

- [ ] **Step 8: Test `/family` shows 16:30**

Open `http://localhost:3000/family`. After opening card, Event Details shows `16:30 — 19:30`. Countdown ticks toward `2026-05-08 16:30 Maldives time`.

- [ ] **Step 9: Test `/friends` shows 17:30**

Open `http://localhost:3000/friends`. Event Details shows `17:30 — 19:30`. Countdown ticks toward `2026-05-08 17:30 Maldives time`.

- [ ] **Step 10: Test dress code flip**

Tap Women card → flips to dark back with detail text. Tap again → flips back to swatch.

- [ ] **Step 11: Test Google Maps loads and is tinted**

Venue section: map loads showing Pavilion by Gold. Map should look warm/sepia, not default blue/green.

- [ ] **Step 12: Test mute toggle**

After music starts, 🔊 button appears bottom-right. Tap it → becomes 🔇, music mutes. Tap again → music resumes.

- [ ] **Step 13: Test RSVP button**

Tap RSVP → opens `wa.me/46724551114` with pre-filled text (on mobile opens WhatsApp; on desktop opens web.whatsapp.com).

- [ ] **Step 14: Test on mobile viewport**

Open Chrome DevTools → toggle device toolbar → iPhone 14 Pro (390px). Full invitation should fit with no horizontal scroll. Scratch works with touch simulation.

- [ ] **Step 15: Production build check**

```bash
npm run build
```

Expected: all routes compile, no errors, bundle sizes reasonable.

- [ ] **Step 16: Final commit**

```bash
git add -A
git commit -m "chore: verified all acceptance criteria — invitation ready for Vercel deploy"
```

---

## Task 17: Vercel Deploy

- [ ] **Step 1: Push to GitHub**

```bash
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

- [ ] **Step 2: Import project in Vercel**

Go to `vercel.com/new` → Import Git Repository → select the repo.  
Framework preset: **Next.js** (auto-detected).  
No environment variables needed.  
Click **Deploy**.

- [ ] **Step 3: Verify live URLs**

After deploy completes, Vercel provides a URL like `https://zim-and-yanal.vercel.app`.

- `https://<url>/` → redirects to `/friends`
- `https://<url>/friends` → invitation with 17:30
- `https://<url>/family`  → invitation with 16:30

- [ ] **Step 4: Share links with client**

Family link: `https://<url>/family`  
Friends link: `https://<url>/friends`

---

## Spec Coverage Check

| Spec Requirement | Task |
|-----------------|------|
| Next.js 14, Tailwind, Framer Motion, TypeScript | Task 0 |
| Cinzel + Cormorant Garamond + Great Vibes fonts | Task 2 |
| `/` → `/friends`, `/family` route, `/friends` route | Task 3 |
| Gold design tokens, CSS keyframes | Task 1 |
| Corner ornaments, ornament divider | Task 4 |
| Candelabra SVG, 5 candles, staggered flames | Task 5 |
| Canvas scratch coating with texture | Task 6 |
| Auto-reveal at 45%, sparkles, tap seal to open | Task 6 |
| Music starts on scratch complete, fade-in | Task 7 |
| Tab visibility pause/resume | Task 7 |
| Mute toggle button | Task 7 |
| Live countdown, route-specific target time | Task 8 |
| Event details with arrivalTime prop | Task 9 |
| Dress code flip cards | Task 10 |
| Styled Google Maps, themed with CSS filter | Task 11 |
| Get Directions + Add to Calendar links | Task 11 |
| Private notice, +1 policy | Task 12 |
| RSVP WhatsApp button, no "via WhatsApp" text | Task 13 |
| Typewriter name animation with blinking cursor | Task 14 |
| Mobile-first, max 430px, no horizontal scroll | Task 1 (viewport), Task 15 |
| noindex meta | Task 2 |
| Vercel deploy | Task 17 |
