import Image from 'next/image'

interface MockupCardProps {
  variant: 'create' | 'share' | 'track'
}

export default function MockupCard({ variant }: MockupCardProps) {
  if (variant === 'create') return <CreateMockup />
  if (variant === 'share') return <ShareMockup />
  return <TrackMockup />
}

/** Create section — `public/assets/custom.png` */
function CreateMockup() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-lt-border bg-lt-surface shadow-[0_12px_40px_-12px_rgba(27,33,26,0.18)] md:rounded-[1.35rem]">
        <Image
          src="/assets/custom.png"
          alt="Customize your Invyo with themes, photos, and live preview"
          width={1402}
          height={1122}
          className="h-auto w-full"
          sizes="(max-width: 1024px) 100vw, min(672px, 50vw)"
        />
      </div>
    </div>
  )
}

/** Share section — `public/assets/ui-edits.png` */
function ShareMockup() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-lt-border bg-lt-surface shadow-[0_12px_40px_-12px_rgba(27,33,26,0.18)] md:rounded-[1.35rem]">
        <Image
          src="/assets/ui-edits.png"
          alt="Share your Invyo link with guests in messages, email, and social apps"
          width={1402}
          height={1122}
          className="h-auto w-full"
          sizes="(max-width: 1024px) 100vw, min(672px, 50vw)"
        />
      </div>
    </div>
  )
}

/** RSVP / track section — `public/assets/RSVP.png` */
function TrackMockup() {
  return (
    <div className="flex w-full items-center justify-center py-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-lt-border bg-lt-surface shadow-[0_12px_40px_-12px_rgba(27,33,26,0.18)] md:rounded-[1.35rem]">
        <Image
          src="/assets/RSVP.png"
          alt="RSVP dashboard: see who is attending, pending, and declined at a glance"
          width={1402}
          height={1122}
          className="h-auto w-full"
          sizes="(max-width: 1024px) 100vw, min(672px, 50vw)"
        />
      </div>
    </div>
  )
}
