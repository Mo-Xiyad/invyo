import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getTemplateDefaults } from '@/lib/invitation-types'
import type { InvitationData } from '@/lib/invitation-types'
import ArabicMoorishTemplate from '@/templates/arabic-moorish'
import IvoryPavilionTemplate from '@/templates/ivory-pavilion'
import SidiBouSaidTemplate from '@/templates/riviera-dreams'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('invitations')
    .select('data')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (!data) return { title: 'Invitation | Invyo' }

  const d = data.data as Partial<InvitationData>
  const groomEn = d.groomNameEn ?? ''
  const brideEn = d.brideNameEn ?? ''
  return {
    title: groomEn && brideEn ? `${groomEn} & ${brideEn} — Wedding Invitation` : 'Wedding Invitation | Invyo',
  }
}

export default async function PublicInvitationPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: invitation } = await supabase
    .from('invitations')
    .select('id, data, template_id, status')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (!invitation) notFound()

  const data: InvitationData = {
    ...getTemplateDefaults(invitation.template_id),
    ...(invitation.data as Partial<InvitationData>),
  }

  if (invitation.template_id === 'riviera-dreams') {
    return (
      <SidiBouSaidTemplate
        invitationId={invitation.id}
        data={data}
      />
    )
  }

  if (invitation.template_id === 'ivory-pavilion') {
    return (
      <IvoryPavilionTemplate
        invitationId={invitation.id}
        data={data}
      />
    )
  }

  return (
    <ArabicMoorishTemplate
      invitationId={invitation.id}
      data={data}
    />
  )
}
