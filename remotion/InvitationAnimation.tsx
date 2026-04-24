import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion'

function easeOut(t: number) {
  return Easing.bezier(0.22, 1, 0.36, 1)(t)
}

function fade(frame: number, start: number, end: number): number {
  return interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOut,
  })
}

function slideUp(frame: number, start: number, end: number, distance = 18): number {
  return interpolate(frame, [start, end], [distance, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOut,
  })
}

function expand(frame: number, start: number, end: number): number {
  return interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOut,
  })
}

export const InvitationAnimation: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const s = (sec: number) => Math.round(sec * fps)

  const cardOpacity = fade(frame, 0, s(0.6))
  const eyebrowOpacity = fade(frame, s(0.7), s(1.4))
  const eyebrowY = slideUp(frame, s(0.7), s(1.4))
  const namesOpacity = fade(frame, s(1.5), s(2.3))
  const namesY = slideUp(frame, s(1.5), s(2.3), 24)
  const dividerScale = expand(frame, s(2.4), s(3.0))
  const dateOpacity = fade(frame, s(3.1), s(3.7))
  const dateY = slideUp(frame, s(3.1), s(3.7))
  const venueOpacity = fade(frame, s(3.5), s(4.1))
  const venueY = slideUp(frame, s(3.5), s(4.1))
  const btnScale = interpolate(frame, [s(4.2), s(4.8)], [0.7, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.34, 1.45, 0.64, 1),
  })
  const btnOpacity = fade(frame, s(4.2), s(4.8))

  return (
    <AbsoluteFill
      style={{
        background: '#f0f2ec',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          opacity: cardOpacity,
          background: 'white',
          borderRadius: 12,
          border: '1px solid rgba(221,226,216,0.95)',
          padding: '52px 60px',
          width: 480,
          textAlign: 'center',
          boxShadow: '0 24px 48px rgba(27,33,26,0.08)',
        }}
      >
        {/* Top ornament */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 28,
            opacity: eyebrowOpacity,
            transform: `translateY(${eyebrowY}px)`,
          }}
        >
          <div style={{ flex: 1, height: 1, background: 'rgba(201,169,110,0.4)' }} />
          <span style={{ color: '#c9a96e', fontSize: 10 }}>◆</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(201,169,110,0.4)' }} />
        </div>

        {/* Eyebrow text */}
        <p
          style={{
            opacity: eyebrowOpacity,
            transform: `translateY(${eyebrowY}px)`,
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#9a7d5a',
            fontFamily: 'sans-serif',
            marginBottom: 16,
          }}
        >
          Together with their families
        </p>

        {/* Names */}
        <h1
          style={{
            opacity: namesOpacity,
            transform: `translateY(${namesY}px)`,
            fontSize: 44,
            fontStyle: 'italic',
            color: '#2a1808',
            fontFamily: 'Georgia, serif',
            fontWeight: 400,
            margin: '0 0 8px 0',
            lineHeight: 1.15,
          }}
        >
          Sarah &amp; James
        </h1>
        <p
          style={{
            opacity: namesOpacity,
            transform: `translateY(${namesY}px)`,
            fontSize: 12,
            color: '#9a7d5a',
            fontFamily: 'sans-serif',
            marginBottom: 24,
          }}
        >
          request the pleasure of your company
        </p>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div
            style={{
              flex: 1,
              height: 1,
              background: 'rgba(201,169,110,0.35)',
              transform: `scaleX(${dividerScale})`,
              transformOrigin: 'right',
            }}
          />
          <span style={{ color: '#c9a96e', fontSize: 10, opacity: dividerScale }}>◆</span>
          <div
            style={{
              flex: 1,
              height: 1,
              background: 'rgba(201,169,110,0.35)',
              transform: `scaleX(${dividerScale})`,
              transformOrigin: 'left',
            }}
          />
        </div>

        {/* Date */}
        <p
          style={{
            opacity: dateOpacity,
            transform: `translateY(${dateY}px)`,
            fontSize: 14,
            fontWeight: 700,
            color: '#2a1808',
            fontFamily: 'sans-serif',
            marginBottom: 6,
          }}
        >
          Saturday, June 14, 2026
        </p>

        {/* Venue */}
        <p
          style={{
            opacity: venueOpacity,
            transform: `translateY(${venueY}px)`,
            fontSize: 12,
            color: '#9a7d5a',
            fontFamily: 'sans-serif',
            marginBottom: 32,
          }}
        >
          The Grand Ballroom · New York City
        </p>

        {/* RSVP button */}
        <div style={{ opacity: btnOpacity, transform: `scale(${btnScale})`, display: 'inline-block' }}>
          <div
            style={{
              background: '#2a1808',
              color: '#f7f0e4',
              borderRadius: 999,
              padding: '12px 36px',
              fontSize: 13,
              fontFamily: 'sans-serif',
              fontWeight: 600,
              letterSpacing: '0.05em',
              display: 'inline-block',
            }}
          >
            RSVP
          </div>
        </div>
      </div>
    </AbsoluteFill>
  )
}
