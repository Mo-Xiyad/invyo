import type { Metadata } from 'next'
import { DEFAULT_INVITATION_DATA } from '@/lib/invitation-types'
import SidiBouSaidTemplate from '@/templates/riviera-dreams'

export const metadata: Metadata = {
  title: 'Riviera Dreams — Template Preview',
  robots: { index: false },
}

export default function SidiBouSaidPreviewPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center sm:py-12">
      {/* transform: translateZ(0) makes this a containing block for position:fixed children */}
      <div
        className="w-full sm:w-[390px] sm:min-h-[844px] sm:shadow-2xl sm:overflow-hidden"
      >
        <SidiBouSaidTemplate data={DEFAULT_INVITATION_DATA} />
      </div>
    </div>
  )
}
