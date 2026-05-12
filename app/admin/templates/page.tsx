import { createClient } from '@/utils/supabase/server'
import AdminTemplateMusicClient from '../AdminTemplateMusicClient'

type TemplateSettingRow = {
  template_id: string
  music_url: string | null
  music_name: string | null
  image_url: string | null
  image_name: string | null
}

export default async function AdminTemplatesPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase
    .from('template_settings')
    .select('template_id, music_url, music_name, image_url, image_name')

  const rows = (settings ?? []) as TemplateSettingRow[]

  const initial = Object.fromEntries(
    rows.map(s => [s.template_id, { musicUrl: s.music_url ?? '', musicName: s.music_name ?? '' }])
  )
  const initialImages = Object.fromEntries(
    rows.map(s => [s.template_id, { imageUrl: s.image_url ?? '', imageName: s.image_name ?? '' }])
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-extrabold text-lt-ink">Templates</h1>
        <p className="mt-1 font-sans text-sm text-lt-muted">
          Upload music and card images for each template. Changes take effect immediately on the live site.
        </p>
      </div>
      <AdminTemplateMusicClient initial={initial} initialImages={initialImages} />
    </div>
  )
}
