import { TEMPLATES } from '@/lib/templates'
import { createClient } from '@/utils/supabase/server'
import AdminTemplatesClient, { type AdminTemplateRecord } from './AdminTemplatesClient'

type TemplateSettingRow = {
  template_id: string
  music_url: string | null
  music_name: string | null
}

export default async function AdminTemplatesPage() {
  const supabase = await createClient()
  const templates = TEMPLATES.filter((template) => template.id !== 'coming-soon')
  const templateIds = templates.map((template) => template.id)

  const { data: settings } = await supabase
    .from('template_settings')
    .select('template_id, music_url, music_name')
    .in('template_id', templateIds)

  const settingsMap = new Map(
    ((settings ?? []) as TemplateSettingRow[]).map((setting) => [setting.template_id, setting])
  )

  const templateRecords: AdminTemplateRecord[] = templates.map((template) => {
    const setting = settingsMap.get(template.id)

    return {
      id: template.id,
      name: template.name,
      description: template.description,
      musicUrl: setting?.music_url ?? '',
      musicName: setting?.music_name ?? '',
    }
  })

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-lt-border bg-lt-surface p-8 shadow-sm">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-lt-muted">Templates</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold text-lt-ink">Template music settings</h1>
        <p className="mt-3 max-w-3xl font-sans text-sm text-lt-muted">
          Upload, replace, preview, or clear the soundtrack used by each live template preview.
        </p>
      </section>

      <AdminTemplatesClient templates={templateRecords} />
    </div>
  )
}
