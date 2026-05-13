import type { Metadata } from 'next'
import { ARABIC_MOORISH_DEFAULTS } from '@/lib/invitation-types'
import ArabicMoorishTemplate from '@/templates/arabic-moorish'
import { createClient } from '@/utils/supabase/server'

export const metadata: Metadata = {
  title: 'Arabic Moorish — Template Preview',
  robots: { index: false },
}

export default async function ArabicMoorishPreviewPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase
    .from('template_settings')
    .select('music_url')
    .eq('template_id', 'arabic-moorish')
    .maybeSingle()

  const data = {
    ...ARABIC_MOORISH_DEFAULTS,
    musicUrl: settings?.music_url ?? ARABIC_MOORISH_DEFAULTS.musicUrl,
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-100 sm:py-12">
        <ArabicMoorishTemplate data={data} />
    </div>
  )
}
