'use client'

import React, { createContext, useContext, useState } from 'react'

type LangKey = 'lang1' | 'lang2'

interface RivieraLangContextType {
  activeLang: LangKey
  setActiveLang: (l: LangKey) => void
  t: (primary: string, secondary: string | undefined) => string
  isLang2: boolean
}

const RivieraLangContext = createContext<RivieraLangContextType | undefined>(undefined)

interface ProviderProps {
  children: React.ReactNode
  /** When provided, the provider runs in controlled mode (editor preview) */
  controlled?: { value: LangKey; onChange: (l: LangKey) => void }
}

export const RivieraLangProvider: React.FC<ProviderProps> = ({ children, controlled }) => {
  const [internalLang, setInternalLang] = useState<LangKey>('lang1')

  const activeLang = controlled ? controlled.value : internalLang
  const setActiveLang = controlled ? controlled.onChange : setInternalLang

  const t = (primary: string, secondary: string | undefined) =>
    activeLang === 'lang2' && secondary ? secondary : primary

  return (
    <RivieraLangContext.Provider value={{ activeLang, setActiveLang, t, isLang2: activeLang === 'lang2' }}>
      {children}
    </RivieraLangContext.Provider>
  )
}

export const useRivieraLang = () => {
  const ctx = useContext(RivieraLangContext)
  if (!ctx) throw new Error('useRivieraLang must be used within RivieraLangProvider')
  return ctx
}
