'use client'

import Image from 'next/image'
import { useInvitationData } from '../arabic-moorish/InvitationDataContext'

const sbs = { fontFamily: "'Caveat', cursive" }
const sat = { fontFamily: "'Satisfy', cursive" }


export default function DressCodeSection() {
  const data = useInvitationData()

  if (!data.dresscodeType && !data.dresscodeMen && !data.dresscodeWomen) return null

  return (
    <section className="relative overflow-hidden bg-[#ECEEF3] px-8 py-16">
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(107,143,191,0.08),transparent_65%)]" />

      <div className="relative mx-auto max-w-sm">
        {/* Header */}
        <div className="mb-2 text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#6B8FBF]" style={sbs}>
            dress code
          </p>
          {data.dresscodeType && (
            <p className="mt-3 text-[28px] font-light text-[#1C2B4A]" style={sat}>
              {data.dresscodeType}
            </p>
          )}
        </div>

        {/* Men + Women cards */}
        <div className="mt-10 grid grid-cols-2 gap-4">
          {/* Men */}
          <div className="relative flex flex-col items-center overflow-hidden rounded-3xl border border-[#8BBCD8]/25 px-5 py-8 text-center">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/templates/sidi-bousaid/frame-2.png')" }}
            />
            <div className="relative z-[1] flex flex-col items-center">
              <Image
                src="/icons/dress-code/men-shirt-suspenders-bowtie-v2.png"
                alt="Gentlemen attire"
                width={64}
                height={64}
                className="h-16 w-16 object-contain drop-shadow-sm"
              />
              <p className="mt-5 text-[10px] uppercase tracking-[0.45em] text-[#6B8FBF]" style={sbs}>
                Gentlemen
              </p>
              <p className="mt-2 text-[15px] font-light leading-snug text-[#1C2B4A]" style={sbs}>
                {data.dresscodeMen || 'Suit & Tie'}
              </p>
              {data.dresscodeMenColor && (
                <div className="mt-4 flex flex-col items-center gap-1.5">
                  <div
                    className="h-8 w-8 rounded-full shadow-md ring-2 ring-white ring-offset-1"
                    style={{ backgroundColor: data.dresscodeMenColor }}
                  />
                  <span className="text-[10px] text-[#1C2B4A]/40" style={sbs}>
                    {data.dresscodeMenColor}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Women */}
          <div className="relative flex flex-col items-center overflow-hidden rounded-3xl border border-[#8BBCD8]/25 px-5 py-8 text-center">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/templates/sidi-bousaid/frame-2.png')" }}
            />
            <div className="relative z-[1] flex flex-col items-center">
              <Image
                src="/icons/dress-code/women-dress-blue-bodice.png"
                alt="Ladies attire"
                width={84}
                height={84}
                className="h-16 w-16 object-contain drop-shadow-sm"
              />
              <p className="mt-5 text-[10px] uppercase tracking-[0.45em] text-[#6B8FBF]" style={sbs}>
                Ladies
              </p>
              <p className="mt-2 text-[15px] font-light leading-snug text-[#1C2B4A]" style={sbs}>
                {data.dresscodeWomen || 'Cocktail Dress or Gown'}
              </p>
              {data.dresscodeWomenColor && (
                <div className="mt-4 flex flex-col items-center gap-1.5">
                  <div
                    className="h-8 w-8 rounded-full shadow-md ring-2 ring-white ring-offset-1"
                    style={{ backgroundColor: data.dresscodeWomenColor }}
                  />
                  <span className="text-[10px] text-[#1C2B4A]/40" style={sbs}>
                    {data.dresscodeWomenColor}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Note */}
        <p className="mt-8 text-center text-[13px] font-light italic leading-relaxed text-[#1C2B4A]/55" style={sbs}>
          We invite you to dress elegantly for this special celebration.
        </p>
      </div>
    </section>
  )
}
