'use client';

import { useLanguage } from './LanguageContext';
import { useInvitationData } from './InvitationDataContext';

const MoorishArch = ({ children, accentColor = '#C8813A' }: { children: React.ReactNode; accentColor?: string }) => (
  <div className="relative pt-12 pb-6 px-4">
    {/* Outer arch SVG */}
    <svg viewBox="0 0 300 380" className="absolute inset-0 w-full h-full" preserveAspectRatio="none" fill="none">
      {/* Main arch shape */}
      <path
        d="M20 380 L20 120 Q20 20 150 20 Q280 20 280 120 L280 380"
        fill="rgba(245,236,215,0.5)"
        stroke={accentColor}
        strokeWidth="1.5"
        strokeOpacity="0.4"
      />
      {/* Inner arch */}
      <path
        d="M40 380 L40 130 Q40 45 150 45 Q260 45 260 130 L260 380"
        fill="rgba(255,255,255,0.6)"
        stroke={accentColor}
        strokeWidth="0.8"
        strokeOpacity="0.25"
      />
      {/* Keystone ornament */}
      <circle cx="150" cy="32" r="4" fill={accentColor} fillOpacity="0.3" />
      <circle cx="150" cy="32" r="2" fill={accentColor} fillOpacity="0.5" />

      {/* Arabesque side details - left */}
      <path d="M30 160 Q25 150 30 140" stroke={accentColor} strokeWidth="0.5" strokeOpacity="0.2" />
      <path d="M30 200 Q25 190 30 180" stroke={accentColor} strokeWidth="0.5" strokeOpacity="0.2" />
      <path d="M30 240 Q25 230 30 220" stroke={accentColor} strokeWidth="0.5" strokeOpacity="0.2" />

      {/* Arabesque side details - right */}
      <path d="M270 160 Q275 150 270 140" stroke={accentColor} strokeWidth="0.5" strokeOpacity="0.2" />
      <path d="M270 200 Q275 190 270 180" stroke={accentColor} strokeWidth="0.5" strokeOpacity="0.2" />
      <path d="M270 240 Q275 230 270 220" stroke={accentColor} strokeWidth="0.5" strokeOpacity="0.2" />

      {/* Top arch interlace pattern */}
      <path d="M60 100 Q105 55 150 55 Q195 55 240 100" stroke={accentColor} strokeWidth="0.5" strokeOpacity="0.15" fill="none" />
      <path d="M75 110 Q112 70 150 70 Q188 70 225 110" stroke={accentColor} strokeWidth="0.5" strokeOpacity="0.12" fill="none" />

      {/* Corner rosettes */}
      {[{ cx: 50, cy: 370 }, { cx: 250, cy: 370 }].map((p, i) => (
        <g key={i}>
          <circle cx={p.cx} cy={p.cy} r="8" fill="none" stroke={accentColor} strokeWidth="0.5" strokeOpacity="0.2" />
          <circle cx={p.cx} cy={p.cy} r="4" fill="none" stroke={accentColor} strokeWidth="0.4" strokeOpacity="0.15" />
          <circle cx={p.cx} cy={p.cy} r="1.5" fill={accentColor} fillOpacity="0.2" />
        </g>
      ))}

      {/* Bottom decorative line */}
      <line x1="60" y1="365" x2="240" y2="365" stroke={accentColor} strokeWidth="0.5" strokeOpacity="0.15" />
    </svg>

    {/* Content inside the arch */}
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

const DressCode = () => {
  const { t, isArabic } = useLanguage();
  const data = useInvitationData();

  return (
    <section className="relative px-4 py-20 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #F5ECD7 0%, #F0E4C8 50%, #F5ECD7 100%)' }}>

      {/* Subtle background texture */}
      <div className="absolute inset-0 am-am-zellige-bg-dense opacity-[0.03]" />

      {/* Section header */}
      <div className="max-w-sm mx-auto relative z-10">
        <div className="text-center mb-8">
          <h2 className={`text-3xl text-[#1A1A2E] mb-3 ${isArabic ? 'font-amiri' : 'font-playfair'}`}>
            {t('Dress Code', 'اللباس المناسب')}
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-[1px] bg-[#C8813A]/30" />
            <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none">
              <path d="M10 2L12 7L17 8L13 11.5L14 17L10 14L6 17L7 11.5L3 8L8 7Z" fill="#C8813A" fillOpacity="0.4" stroke="#C8813A" strokeWidth="0.5" strokeOpacity="0.3" />
            </svg>
            <div className="w-12 h-[1px] bg-[#C8813A]/30" />
          </div>
        </div>

        {/* Women - Moorish Arch */}
        <div className="mb-6">
          <MoorishArch accentColor="#B8D4E3">
            <div className="text-center">
              {/* Dress icon */}
              <div className="mb-5">
                <svg viewBox="0 0 60 80" className="w-14 h-[70px] mx-auto" fill="none">
                  <path d="M22 10C22 5 26 1 30 1S38 5 38 10" stroke="#C8813A" strokeWidth="0.8" opacity="0.5" />
                  <path d="M22 10C20 22 15 30 10 40L6 65H54L50 40C45 30 40 22 38 10" stroke="#C8813A" strokeWidth="0.8" opacity="0.5" />
                  <path d="M6 65L4 78H56L54 65" stroke="#C8813A" strokeWidth="0.8" opacity="0.5" />
                  <path d="M24 10 Q30 18 36 10" stroke="#C8813A" strokeWidth="0.5" opacity="0.4" />
                  {/* Flowing skirt detail lines */}
                  <path d="M18 40 Q24 50 20 65" stroke="#C8813A" strokeWidth="0.3" opacity="0.25" />
                  <path d="M30 25 L30 65" stroke="#C8813A" strokeWidth="0.3" opacity="0.2" />
                  <path d="M42 40 Q36 50 40 65" stroke="#C8813A" strokeWidth="0.3" opacity="0.25" />
                </svg>
              </div>

              <p className={`text-[#1A1A2E] text-xl mb-2 ${isArabic ? 'font-amiri' : 'font-playfair'}`}>
                {t('Women', 'النساء')}
              </p>

              {/* Divider */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-8 h-[0.5px] bg-[#C8813A]/20" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#C8813A]/30" />
                <div className="w-8 h-[0.5px] bg-[#C8813A]/20" />
              </div>

              <p className={`text-[#1A1A2E]/60 text-base leading-relaxed mb-6 ${isArabic ? 'font-amiri' : 'font-lato'}`}>
                {data.dresscodeWomen || t('Light blue or baby pink dress', 'فستان أزرق فاتح أو وردي بيبي')}
              </p>

              {/* Color swatch */}
              {data.dresscodeWomenColor && (
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full shadow-md" style={{ backgroundColor: data.dresscodeWomenColor }} />
                    <div className="absolute inset-[-4px] rounded-full border border-[#C8813A]/15" />
                    <div className="absolute inset-[-8px] rounded-full border border-[#C8813A]/8" />
                  </div>
                  <span className={`text-[11px] text-[#1A1A2E]/40 ${isArabic ? 'font-amiri' : 'font-lato'}`}>
                    {data.dresscodeWomenColor}
                  </span>
                </div>
              )}
            </div>
          </MoorishArch>
        </div>

        {/* Men - Moorish Arch */}
        <div>
          <MoorishArch accentColor="#C8813A">
            <div className="text-center">
              {/* Suit icon with necktie */}
              <div className="mb-5">
                <svg viewBox="0 0 60 80" className="w-14 h-[70px] mx-auto" fill="none">
                  {/* Suit jacket */}
                  <path d="M14 4L12 30L8 72H24L26 42H34L36 72H52L48 30L46 4" stroke="#C8813A" strokeWidth="0.8" opacity="0.5" />
                  {/* Lapels */}
                  <path d="M14 4L30 20L46 4" stroke="#C8813A" strokeWidth="0.8" opacity="0.5" />
                  {/* Necktie */}
                  <path d="M27 20L30 28L33 20" stroke="#C8813A" strokeWidth="0.6" opacity="0.5" fill="#C8813A" fillOpacity="0.1" />
                  <path d="M28 28L30 55L32 28" stroke="#C8813A" strokeWidth="0.6" opacity="0.5" fill="#C8813A" fillOpacity="0.08" />
                  {/* Tie knot */}
                  <circle cx="30" cy="20" r="1.5" fill="#C8813A" fillOpacity="0.3" />
                  {/* Pocket */}
                  <path d="M38 35L42 34L42 38" stroke="#C8813A" strokeWidth="0.4" opacity="0.3" />
                  {/* Button */}
                  <circle cx="30" cy="40" r="1" fill="#C8813A" fillOpacity="0.25" />
                </svg>
              </div>

              <p className={`text-[#1A1A2E] text-xl mb-2 ${isArabic ? 'font-amiri' : 'font-playfair'}`}>
                {t('Men', 'الرجال')}
              </p>

              {/* Divider */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-8 h-[0.5px] bg-[#C8813A]/20" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#C8813A]/30" />
                <div className="w-8 h-[0.5px] bg-[#C8813A]/20" />
              </div>

              <p className={`text-[#1A1A2E]/60 text-base leading-relaxed mb-6 ${isArabic ? 'font-amiri' : 'font-lato'}`}>
                {data.dresscodeMen || t('Navy Blue Suit & Necktie', 'بدلة كحلية و ربطة عنق')}
              </p>

              {/* Color swatch */}
              {data.dresscodeMenColor && (
                <div className="flex justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full shadow-md" style={{ backgroundColor: data.dresscodeMenColor }} />
                      <div className="absolute inset-[-4px] rounded-full border border-[#C8813A]/15" />
                      <div className="absolute inset-[-8px] rounded-full border border-[#C8813A]/8" />
                    </div>
                    <span className={`text-[11px] text-[#1A1A2E]/40 ${isArabic ? 'font-amiri' : 'font-lato'}`}>
                      {data.dresscodeMenColor}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </MoorishArch>
        </div>
      </div>
       {/* Kunaa woven band bottom */}
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

export default DressCode;
