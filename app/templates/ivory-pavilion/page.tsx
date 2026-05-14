import { createClient } from '@/utils/supabase/server'
import { IVORY_PAVILION_DEFAULTS } from '@/lib/invitation-types'
import IvoryPavilionTemplate from '@/templates/ivory-pavilion'

export default async function IvoryPavilionPreviewPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase
    .from('template_settings')
    .select('music_url')
    .eq('template_id', 'ivory-pavilion')
    .maybeSingle()

  const data = { ...IVORY_PAVILION_DEFAULTS, musicUrl: settings?.music_url ?? IVORY_PAVILION_DEFAULTS.musicUrl }

  return (
    <div className="flex min-h-screen items-start justify-center bg-[#2C2416] py-8">
      <div
        className="relative w-full max-w-[430px] overflow-hidden rounded-[2.5rem] shadow-2xl"
        style={{ transform: 'translateZ(0)' }}
      >
        <IvoryPavilionTemplate data={data} />
      </div>
    </div>
  )
}
