import type { Metadata } from 'next'
import { DEFAULT_INVITATION_DATA } from '@/lib/invitation-types'
import SidiBouSaidTemplate from '@/templates/riviera-dreams'
import { createClient } from '@/utils/supabase/server'

export const metadata: Metadata = {
  title: 'Riviera Dreams — Template Preview',
  robots: { index: false },
}

export default async function SidiBouSaidPreviewPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase
    .from('template_settings')
    .select('music_url')
    .eq('template_id', 'riviera-dreams')
    .maybeSingle()

  const data = {
    ...DEFAULT_INVITATION_DATA,
    musicUrl: settings?.music_url ?? DEFAULT_INVITATION_DATA.musicUrl,
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-100 sm:py-12">
        <SidiBouSaidTemplate data={data} />
    </div>
  )
}
