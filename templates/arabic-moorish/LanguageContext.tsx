'use client';

import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (en: string, ar: string) => string;
  isArabic: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (en: string, ar: string) => language === 'ar' ? ar : en;
  const isArabic = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isArabic }}>
      <div dir={isArabic ? 'rtl' : 'ltr'} className={isArabic ? 'font-amiri' : 'font-lato'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
