'use client'

import { createContext, useContext } from 'react'
import type { InvitationData } from '@/lib/invitation-types'
import { DEFAULT_INVITATION_DATA } from '@/lib/invitation-types'

export const InvitationDataContext = createContext<InvitationData>(DEFAULT_INVITATION_DATA)
export const PreviewModeContext = createContext<boolean>(false)

export function useInvitationData() {
  return useContext(InvitationDataContext)
}

export function usePreviewMode() {
  return useContext(PreviewModeContext)
}

export function InvitationDataProvider({
  data,
  previewMode = false,
  children,
}: {
  data: InvitationData
  previewMode?: boolean
  children: React.ReactNode
}) {
  return (
    <PreviewModeContext.Provider value={previewMode}>
      <InvitationDataContext.Provider value={data}>
        {children}
      </InvitationDataContext.Provider>
    </PreviewModeContext.Provider>
  )
}
