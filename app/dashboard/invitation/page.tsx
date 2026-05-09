import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import InvitationEditorClient from './InvitationEditorClient'
import type { InvitationData } from '@/lib/invitation-types'
import { getTemplateDefaults } from '@/lib/invitation-types'
import { TEMPLATES } from '@/lib/templates'

interface Props {
  searchParams: Promise<{ template?: string }>
}

export default async function InvitationPage({ searchParams }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const { template } = await searchParams
  const selectedTemplate = TEMPLATES.find(t => t.id === template && t.id !== 'coming-soon')
  const templateId = selectedTemplate?.id ?? 'riviera-dreams'

  // Load the draft specific to this (user, template) pair
  const { data: invitation } = await supabase
    .from('invitations')
    .select('id, data, status, template_id')
    .eq('user_id', user.id)
    .eq('template_id', templateId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return (
    <div className="h-full -m-6 md:-m-10 overflow-hidden">
      <InvitationEditorClient
        userId={user.id}
        invitationId={invitation?.id ?? null}
        savedData={(invitation?.data as Partial<InvitationData>) ?? null}
        templateId={templateId}
        templateDefaults={getTemplateDefaults(templateId)}
      />
    </div>
  )
}
