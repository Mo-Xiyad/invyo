'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from './LanguageContext';
import { ChevronDown } from 'lucide-react';

const AboutCouple = () => {
  const { t, isArabic } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const photosRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!photosRef.current) return;
      const rect = photosRef.current.getBoundingClientRect();
      const viewH = window.innerHeight;
      const progress = 1 - rect.top / viewH;
      setScrollY(Math.max(0, Math.min(1, progress)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const swingL = Math.sin(scrollY * Math.PI * 2.5) * 6;
  const swingR = Math.sin(scrollY * Math.PI * 2.5 + 0.8) * -5;

  return (
    <section className="relative px-6 py-20 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #F5ECD7 0%, #F0E4C8 50%, #F5ECD7 100%)' }}>

      <div className="absolute inset-0 opacity-[0.07]"
        style={{ background: 'radial-gradient(ellipse at 70% 30%, rgba(200,129,58,0.3) 0%, transparent 50%)' }} />
      <div className="absolute inset-0 am-am-am-zellige-bg-dense opacity-[0.05]" />

      <div className="absolute top-0 inset-x-0 h-3 overflow-hidden">
        <svg viewBox="0 0 400 12" preserveAspectRatio="none" fill="none" className="w-full h-full">
          {Array.from({ length: 20 }, (_, i) => (
            <path key={i} d={`M${i * 20} 6 L${i * 20 + 10} 0 L${i * 20 + 20} 6 L${i * 20 + 10} 12Z`}
              stroke="#C8813A" strokeWidth="0.5" fill="rgba(200,129,58,0.06)" />
          ))}
        </svg>
      </div>

      <div className="max-w-sm mx-auto text-center relative z-10">
        <h2 className={`text-3xl text-[#1A1A2E] mb-3 ${isArabic ? 'font-amiri' : 'font-playfair'}`}>
          {t('Our Story', 'قصتنا')}
        </h2>
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-12 h-[1px] bg-[#C8813A]/30" />
          <svg viewBox="0 0 14 14" className="w-3.5 h-3.5" fill="#C8813A" fillOpacity="0.5">
            <path d="M7 0L8.3 4.7L13 5.5L9.1 8L10 13L7 10L4 13L4.9 8L1 5.5L5.7 4.7Z" />
          </svg>
          <div className="w-12 h-[1px] bg-[#C8813A]/30" />
        </div>

        <div ref={photosRef} className="flex items-start justify-center gap-6 mb-10">
          {/* Groom photo */}
          <div className="flex flex-col items-center">
            <div className="w-[1px] h-8 bg-[#C8813A]/40" />
            <div className="w-3 h-3 rounded-full border-2 border-[#C8813A]/60 bg-[#F5ECD7] -mb-1.5 relative z-10" />
            <div className="transition-transform duration-100 ease-out"
              style={{ transform: `rotate(${swingL}deg)`, transformOrigin: 'top center' }}>
              <div className="relative bg-white p-1.5 shadow-lg" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
                <div className="w-[120px] h-[150px] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/templates/arabic-moorish/ziyad.jpg" alt="The Groom"
                    className="w-full h-full object-cover object-top" />
                </div>
                <div className="mt-1.5 pb-1">
                  <p className={`text-[#1A1A2E] text-xs ${isArabic ? 'font-amiri text-sm' : 'font-playfair'}`}>
                    {t('Omar Mahmoud', 'عمر محمود')}
                  </p>
                  <p className="text-[#1A1A2E]/30 text-[10px] font-lato tracking-wide">
                    {t('The Groom', 'العريس')}
                  </p>
                </div>
              </div>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-4 bg-[#C8813A]/15 rounded-sm"
                style={{ backdropFilter: 'blur(1px)' }} />
            </div>
          </div>

          <div className="mt-20">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#C8813A" fillOpacity="0.25">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>

          {/* Bride photo */}
          <div className="flex flex-col items-center">
            <div className="w-[1px] h-12 bg-[#C8813A]/40" />
            <div className="w-3 h-3 rounded-full border-2 border-[#C8813A]/60 bg-[#F5ECD7] -mb-1.5 relative z-10" />
            <div className="transition-transform duration-100 ease-out"
              style={{ transform: `rotate(${swingR}deg)`, transformOrigin: 'top center' }}>
              <div className="relative bg-white p-1.5 shadow-lg" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
                <div className="w-[120px] h-[150px] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/templates/arabic-moorish/randa.jpg" alt="The Bride"
                    className="w-full h-full object-cover object-top" />
                </div>
                <div className="mt-1.5 pb-1">
                  <p className={`text-[#1A1A2E] text-xs ${isArabic ? 'font-amiri text-sm' : 'font-playfair'}`}>
                    {t('Layla Mansour', 'ليلى منصور')}
                  </p>
                  <p className="text-[#1A1A2E]/30 text-[10px] font-lato tracking-wide">
                    {t('The Bride', 'العروس')}
                  </p>
                </div>
              </div>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-4 bg-[#C8813A]/15 rounded-sm"
                style={{ backdropFilter: 'blur(1px)' }} />
            </div>
          </div>
        </div>

        <p className={`text-[#1A1A2E]/50 text-base leading-relaxed mb-6 ${isArabic ? 'font-amiri text-lg' : 'font-lato'}`}>
          {t(
            'Two hearts brought together by destiny, now beginning a beautiful journey as one.',
            'قلبان جمعهما القدر، يبدآن الآن رحلة جميلة معاً.'
          )}
        </p>

        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#C8813A]/25
            text-[#C8813A]/70 text-sm font-lato hover:bg-[#C8813A]/5 transition-all duration-300"
        >
          {expanded ? t('Hide', 'إخفاء') : t('Read More', 'اقرأ المزيد')}
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
        </button>

        <div className={`overflow-hidden transition-all duration-700 ease-in-out ${expanded ? 'max-h-[300px] opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'}`}>
          <p className={`text-[#1A1A2E]/45 text-sm leading-relaxed ${isArabic ? 'font-amiri text-base' : 'font-lato'}`}>
            {t(
              'We are grateful for your love and presence as we celebrate this new chapter of our lives. Your blessings mean the world to us as we start this journey together.',
              'نحن ممتنون لحبكم وحضوركم بينما نحتفل بهذا الفصل الجديد من حياتنا. بركاتكم تعني لنا الكثير بينما نبدأ هذه الرحلة معاً.'
            )}
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-3 overflow-hidden">
        <svg viewBox="0 0 400 12" preserveAspectRatio="none" fill="none" className="w-full h-full">
          {Array.from({ length: 20 }, (_, i) => (
            <path key={i} d={`M${i * 20} 6 L${i * 20 + 10} 0 L${i * 20 + 20} 6 L${i * 20 + 10} 12Z`}
              stroke="#C8813A" strokeWidth="0.5" fill="rgba(200,129,58,0.06)" />
          ))}
        </svg>
      </div>
    </section>
  );
};

export default AboutCouple;
