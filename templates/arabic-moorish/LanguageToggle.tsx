'use client';

import { useLanguage } from './LanguageContext';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      className="fixed top-4 right-4 z-50 w-12 h-12 rounded-full border-2 border-[#C8813A]/60 bg-[#1A1A2E]/80 backdrop-blur
        text-[#F5ECD7] text-xs font-lato flex items-center justify-center
        hover:border-[#C8813A] transition-colors active:scale-95"
      aria-label="Toggle language"
    >
      {language === 'en' ? 'ع' : 'EN'}
    </button>
  );
};

export default LanguageToggle;
