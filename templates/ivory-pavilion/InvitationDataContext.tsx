'use client'

import { createContext, useContext } from 'react'
import type { InvitationData } from '@/lib/invitation-types'
import { IVORY_PAVILION_DEFAULTS } from '@/lib/invitation-types'

export const InvitationDataContext = createContext<InvitationData>(IVORY_PAVILION_DEFAULTS)
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
