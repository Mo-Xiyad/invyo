import { createClient } from '@/utils/supabase/server'
import AdminTemplateMusicClient from '../AdminTemplateMusicClient'

type TemplateSettingRow = {
  template_id: string
  music_url: string | null
  music_name: string | null
}

export default async function AdminTemplatesPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase
    .from('template_settings')
    .select('template_id, music_url, music_name')

  const initial = Object.fromEntries(
    ((settings ?? []) as TemplateSettingRow[]).map(s => [
      s.template_id,
      { musicUrl: s.music_url ?? '', musicName: s.music_name ?? '' },
    ])
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-extrabold text-lt-ink">Templates</h1>
        <p className="mt-1 font-sans text-sm text-lt-muted">
          Upload, replace, preview, or clear the music for each template. Changes take effect immediately on the live preview.
        </p>
      </div>
      <AdminTemplateMusicClient initial={initial} />
    </div>
  )
}
