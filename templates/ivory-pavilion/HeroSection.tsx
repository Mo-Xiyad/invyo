'use client'

import { useInvitationData } from './InvitationDataContext'

const carattere = { fontFamily: "'Carattere', cursive" }
const serif = { fontFamily: "'Source Serif 4', serif" }

export default function HeroSection() {
  const data = useInvitationData()

  return (
    <section className="relative h-[100dvh] overflow-hidden bg-[#F5F0EB]">
      {/* Full-bleed background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/templates/ivory-pavilion/hero-frame.png)',
          backgroundSize: 'cover',
          backgroundPosition: '57% 50%',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center translate-y-[-70px] sm:translate-y-[-100px]">
        <p
          className="ivory-slide-up text-[10px] uppercase tracking-[0.35em] text-[#827B6F]"
          style={{ ...serif, animationDelay: '0.05s' }}
        >
          Together with their families
        </p>

        <h1
          className="ivory-slide-up mt-5 leading-tight text-[#827B6F]"
          style={{ ...carattere, fontSize: 'clamp(2.2rem, 6.5vw, 3rem)', animationDelay: '0.16s' }}
        >
          {data.groomNameEn}
          {data.groomLastNameEn ? ` ${data.groomLastNameEn}` : ''}
        </h1>

        <p
          className="ivory-slide-up my-1 text-lg uppercase tracking-[0.15em] text-[#827B6F]"
          style={{ ...serif, animationDelay: '0.26s' }}
        >
          &amp;
        </p>

        <h2
          className="ivory-slide-up leading-tight text-[#827B6F]"
          style={{ ...carattere, fontSize: 'clamp(2.2rem, 6.5vw, 3rem)', animationDelay: '0.36s' }}
        >
          {data.brideNameEn}
          {data.brideLastNameEn ? ` ${data.brideLastNameEn}` : ''}
        </h2>

      
      </div>

      {/* Scroll indicator */}
      <div
        className="ivory-fade-in absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ animationDelay: '1.2s' }}
      >
        <p className="text-[9px] uppercase tracking-[0.4em] text-[#827B6F]" style={serif}>
          Scroll
        </p>
        <div className="scroll-chevron">
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <path d="M8 0 L8 20" stroke="#827B6F" strokeWidth="1" strokeLinecap="round" />
            <path d="M2 14 L8 20 L14 14" stroke="#827B6F" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(6px); }
        }
        .ivory-slide-up {
          opacity: 0;
          animation: slideUp 0.9s ease forwards;
        }
        .ivory-fade-in {
          opacity: 0;
          animation: fadeIn 1s ease forwards;
        }
        .scroll-chevron {
          animation: scrollBounce 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
