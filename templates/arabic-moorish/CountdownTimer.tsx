'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

const toArabicNumerals = (num: number): string => {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).padStart(2, '0').split('').map(d => arabicDigits[parseInt(d)] ?? d).join('');
};

const CountdownTimer = ({
  targetDate: targetDateStr,
  className = '',
}: { targetDate?: string; className?: string } = {}) => {
  const { t, isArabic } = useLanguage();
  const weddingDate = new Date(targetDateStr || '2026-06-27T19:00:00').getTime();

  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setMounted(true);
    const calc = () => {
      const diff = weddingDate - Date.now();
      return {
        days:    Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
        hours:   Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24)),
        minutes: Math.max(0, Math.floor((diff / (1000 * 60)) % 60)),
        seconds: Math.max(0, Math.floor((diff / 1000) % 60)),
      };
    };
    setTimeLeft(calc());
    const interval = setInterval(() => {
      const diff = weddingDate - Date.now();
      if (diff <= 0) { clearInterval(interval); return; }
      setTimeLeft(calc());
    }, 1000);
    return () => clearInterval(interval);
  }, [weddingDate]);

  const units = [
    { value: timeLeft.days, label: t('Days', 'يوم') },
    { value: timeLeft.hours, label: t('Hours', 'ساعة') },
    { value: timeLeft.minutes, label: t('Min', 'دقيقة') },
    { value: timeLeft.seconds, label: t('Sec', 'ثانية') },
  ];

  return (
    <div className={`flex justify-center gap-3 mt-8 ${className}`.trim()} dir={isArabic ? 'rtl' : 'ltr'}>
      {units.map((unit, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl border border-[#C8813A]/25 bg-[#C8813A]/[0.06] backdrop-blur-sm
            flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 am-am-zellige-bg opacity-[0.04]" />
            <span className="font-playfair text-2xl text-[#1A1A2E] relative z-10" suppressHydrationWarning>
              {mounted ? (isArabic ? toArabicNumerals(unit.value) : String(unit.value).padStart(2, '0')) : '--'}
            </span>
          </div>
          <span className={`text-[10px] mt-1.5 text-[#1A1A2E]/40 tracking-wider uppercase ${isArabic ? 'font-amiri text-xs' : 'font-lato'}`}>
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
