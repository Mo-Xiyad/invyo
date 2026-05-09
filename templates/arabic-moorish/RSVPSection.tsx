'use client';

import { useState } from 'react';
import { useLanguage } from './LanguageContext';
import { useInvitationData } from './InvitationDataContext';
import { Check, Loader2, X } from 'lucide-react';
import ConfettiEffect from './ConfettiEffect';

type RSVPStatus = 'accept' | 'maybe' | 'decline' | null;

function thankYouMessage(
  response: 'accept' | 'maybe' | 'decline',
  t: (en: string, ar: string) => string,
): string {
  switch (response) {
    case 'accept':
      return t("We can't wait to celebrate with you!", 'لا يسعنا الانتظار للاحتفال معكم!');
    case 'maybe':
      return t(
        'Thank you for your reply. We hope you can join us — we would love to see you there.',
        'شكرًا لردكم. نأمل أن تتمكنوا من الحضور — يسعدنا أن نراكم بيننا.',
      );
    case 'decline':
      return t(
        'Thank you for letting us know. You will be missed, and we are grateful for your good wishes.',
        'شكرًا لإعلامنا. سنفتقدكم، ونشكركم على مشاعركم الطيبة.',
      );
  }
}

interface RSVPSectionProps {
  invitationId?: string;
}

const RSVPSection = ({ invitationId }: RSVPSectionProps) => {
  const { t, isArabic } = useLanguage();
  const [status, setStatus] = useState<RSVPStatus>(null);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [plusOne, setPlusOne] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedResponse, setSubmittedResponse] = useState<'accept' | 'maybe' | 'decline' | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim() || !status) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), message: message.trim() || undefined, status, plusOne, invitationId }),
      });
      if (!res.ok) {
        setError(t('Could not send your RSVP. Please try again.', 'تعذر إرسال ردكم. حاولوا مرة أخرى.'));
        return;
      }
      setSubmittedResponse(status);
      setShowConfetti(status === 'accept');
      setTimeout(() => setSubmitted(true), 500);
    } catch {
      setError(t('Could not send your RSVP. Please try again.', 'تعذر إرسال ردكم. حاولوا مرة أخرى.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted && submittedResponse) {
    return (
      <section className="min-h-[80vh] flex flex-col items-center justify-center relative px-6 py-16 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #1A1A2E 0%, #252545 50%, #1A1A2E 100%)' }}>
        {showConfetti && <ConfettiEffect />}
        <div className="absolute inset-0 am-am-am-zellige-bg-dense opacity-[0.08]" />
        <div className="text-center am-am-animate-fade-in-up relative z-10 max-w-lg mx-auto">
          <svg viewBox="0 0 100 100" className="w-24 h-24 mx-auto mb-6 am-am-animate-pulse-glow" fill="none">
            <path d="M50 5L54 30L68 12L58 32L90 38L58 44L70 64L54 50L50 90L46 50L30 64L42 44L10 38L42 32L30 12L46 30Z"
              stroke="#C8813A" strokeWidth="0.8" fill="rgba(200,129,58,0.08)" />
            <circle cx="50" cy="50" r="15" stroke="#C8813A" strokeWidth="0.6" opacity="0.4" />
            <circle cx="50" cy="50" r="8" stroke="#3D6B5E" strokeWidth="0.5" opacity="0.3" />
            <ellipse cx="50" cy="50" rx="4" ry="3" fill="#3D6B5E" fillOpacity="0.2" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const cx = 50 + Math.cos(rad) * 22;
              const cy = 50 + Math.sin(rad) * 22;
              return <circle key={i} cx={cx} cy={cy} r="1.2" fill="#C8813A" fillOpacity="0.3" />;
            })}
          </svg>
          <p className={`text-2xl text-[#F5ECD7] leading-relaxed ${isArabic ? 'font-amiri' : 'font-playfair'}`}>
            {thankYouMessage(submittedResponse, t)}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative px-6 py-20 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #1A1A2E 0%, #252545 30%, #1A1A2E 60%, #252545 85%, #1A1A2E 100%)' }}>

      <div className="absolute inset-0 am-am-am-zellige-bg-dense opacity-[0.08]" />
      <div className="absolute inset-0 opacity-[0.1]"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(200,129,58,0.2), transparent 55%)' }} />

      <div className="relative z-10 w-full max-w-sm mx-auto">
        <div className="text-center mb-10">
          <h2 className={`text-3xl md:text-4xl text-[#F5ECD7] mb-3 ${isArabic ? 'font-amiri' : 'font-playfair'}`}>
            {t('Will You Join Us?', 'هل ستشاركوننا فرحتنا؟')}
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-[1px] bg-[#C8813A]/40" />
            <svg viewBox="0 0 14 14" className="w-3.5 h-3.5" fill="#C8813A" fillOpacity="0.5">
              <path d="M7 0L8.3 4.7L13 5.5L9.1 8L10 13L7 10L4 13L4.9 8L1 5.5L5.7 4.7Z" />
            </svg>
            <div className="w-12 h-[1px] bg-[#C8813A]/40" />
          </div>
        </div>

        {!status ? (
          <div className="flex flex-col gap-4">
            {[
              { key: 'accept' as const, icon: Check, label: t("Yes, I'll be there!", 'سأحضر بكل سرور'), border: 'border-[#3D6B5E]/50', text: 'text-[#F5ECD7]', bg: 'bg-[#3D6B5E]/20', hover: 'hover:bg-[#3D6B5E] hover:text-white' },
              { key: 'decline' as const, icon: X, label: t("No, I can't make it", 'أعتذر عن الحضور'), border: 'border-[#8B1A2E]/30', text: 'text-[#F5ECD7]/40', bg: 'bg-[#8B1A2E]/10', hover: 'hover:bg-[#8B1A2E]/20' },
            ].map(({ key, icon: Icon, label, border, text, bg, hover }) => (
              <button key={key} onClick={() => setStatus(key)}
                className={`h-14 rounded-2xl text-lg font-lato flex items-center justify-center gap-3 relative overflow-hidden border
                  ${border} ${text} ${bg} ${hover} transition-all duration-300 active:scale-95`}>
                <svg className="absolute top-1 left-2 w-5 h-5" viewBox="0 0 20 20" fill="none" opacity="0.15">
                  <path d="M2 2 Q2 10 10 10" stroke="#C8813A" strokeWidth="0.6" />
                </svg>
                <svg className="absolute bottom-1 right-2 w-5 h-5 rotate-180" viewBox="0 0 20 20" fill="none" opacity="0.15">
                  <path d="M2 2 Q2 10 10 10" stroke="#C8813A" strokeWidth="0.6" />
                </svg>
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-6 am-am-animate-fade-in-up">
            <div className="rounded-2xl border border-[#C8813A]/20 p-6 relative overflow-hidden"
              style={{ background: 'rgba(245,236,215,0.95)' }}>
              <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                <svg viewBox="0 0 200 30" width="180" fill="none" opacity="0.18">
                  <path d="M10 30 Q10 5 100 3 Q190 5 190 30" stroke="#C8813A" strokeWidth="0.8" />
                </svg>
              </div>
              <div className="absolute top-0 inset-x-4 h-2 overflow-hidden">
                <svg viewBox="0 0 300 8" preserveAspectRatio="none" fill="none" className="w-full h-full">
                  {Array.from({ length: 15 }, (_, i) => (
                    <path key={i} d={`M${i * 20} 4 L${i * 20 + 10} 0 L${i * 20 + 20} 4 L${i * 20 + 10} 8Z`}
                      stroke="#C8813A" strokeWidth="0.3" opacity="0.2" />
                  ))}
                </svg>
              </div>
              <label className={`block text-[#1A1A2E]/55 mb-2 text-sm pt-2 ${isArabic ? 'font-amiri' : 'font-lato'}`}>
                {t('Your Name', 'اسمك')}
              </label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full h-12 rounded-xl border border-[#C8813A]/20 bg-white/50 px-4 text-[#1A1A2E] font-lato
                  focus:outline-none focus:border-[#C8813A]/50 transition-colors placeholder:text-[#1A1A2E]/20"
                placeholder={t('Enter your name', 'أدخل اسمك')} />

              <label className={`block text-[#1A1A2E]/55 mb-2 text-sm mt-4 ${isArabic ? 'font-amiri' : 'font-lato'}`}>
                {t('Message for the couple', 'رسالة للعروسين')}{' '}
                <span className="text-[#1A1A2E]/30">({t('optional', 'اختياري')})</span>
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full resize-none rounded-xl border border-[#C8813A]/20 bg-white/50 px-4 py-3 text-[#1A1A2E] font-lato
                  focus:outline-none focus:border-[#C8813A]/50 transition-colors placeholder:text-[#1A1A2E]/20"
                placeholder={t('Share a warm wish…', 'شاركونا تهانيكم…')}
              />
            </div>

            <div className="rounded-2xl border border-[#C8813A]/20 p-6 flex items-center justify-between"
              style={{ background: 'rgba(245,236,215,0.95)' }}>
              <span className={`text-[#1A1A2E]/55 ${isArabic ? 'font-amiri' : 'font-lato'}`}>
                {t('Bringing a +1?', 'هل ستحضر برفقة شخص آخر؟')}
              </span>
              <button onClick={() => setPlusOne(!plusOne)}
                className={`w-14 h-8 rounded-full transition-colors duration-300 relative ${plusOne ? 'bg-[#3D6B5E]' : 'bg-[#C8813A]/20'}`}>
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-transform duration-300
                  ${plusOne ? (isArabic ? 'left-1' : 'right-1') : (isArabic ? 'right-1' : 'left-1')}`} />
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center font-lato">{error}</p>
            )}

            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={!name.trim() || isSubmitting}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#C8813A] to-[#D4AF7A]
                text-[#1A1A2E] text-lg font-lato font-semibold flex items-center justify-center gap-2
                hover:opacity-90 transition-opacity disabled:opacity-30 active:scale-95">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden /> : null}
              {t('Send RSVP', 'إرسال الرد')}
            </button>
            <button onClick={() => setStatus(null)}
              className="w-full text-[#F5ECD7]/30 text-sm font-lato hover:text-[#F5ECD7]/50 transition-colors">
              {t('← Change response', 'تغيير الإجابة →')}
            </button>
          </div>
        )}
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

export default RSVPSection;
