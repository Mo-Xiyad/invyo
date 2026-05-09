import type { Metadata } from 'next'
import { DEFAULT_INVITATION_DATA } from '@/lib/invitation-types'
import SidiBouSaidTemplate from '@/templates/riviera-dreams'

export const metadata: Metadata = {
  title: 'Riviera Dreams — Template Preview',
  robots: { index: false },
}

export default function SidiBouSaidPreviewPage() {
  return <SidiBouSaidTemplate data={DEFAULT_INVITATION_DATA} />
}
