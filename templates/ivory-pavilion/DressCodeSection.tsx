'use client'

import Image from 'next/image'
import { useInvitationData } from './InvitationDataContext'
import { IvorySectionHeader } from './IvorySectionHeader'

function DressCard({
  label,
  description,
  imageSrc,
  color,
}: {
  label: string
  description: string
  imageSrc: string
  color?: string
}) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[#C8B99A]/45 bg-[#FAF8F5] px-4 py-6 text-center shadow-[0_20px_55px_rgba(156,139,120,0.1)] sm:px-6 sm:py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(232,223,208,0.35),transparent_60%)]" />
      <div className="relative">
        <Image src={imageSrc} alt={label} width={90} height={90} className="mx-auto h-20 w-20 object-contain" />
        <p
          className="mt-5 text-[10px] uppercase tracking-[0.35em] text-[#827B6F]"
          style={{ fontFamily: "'Source Serif 4', serif" }}
        >
          {label}
        </p>
        <p
          className="mt-3 text-[clamp(1.1rem,3.2vw,1.35rem)] font-medium italic leading-snug tracking-[0.02em] text-[#5c5348]"
          style={{ fontFamily: "'Source Serif 4', serif" }}
        >
          {description}
        </p>
        {color && (
          <div className="mt-5 flex flex-col items-center gap-2">
            <div className="h-9 w-9 rounded-full border-2 border-white shadow-sm ring-1 ring-[#E8DFD0]" style={{ backgroundColor: color }} />
            <span className="text-xs text-[#827B6F]/75">{color}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function DressCodeSection() {
  const data = useInvitationData()

  if (!data.dresscodeType && !data.dresscodeMen && !data.dresscodeWomen) return null

  return (
    <section
      className="relative overflow-hidden bg-[#EDE9E3] px-5 py-20 text-[#2C2416] sm:px-8"
      style={{ fontFamily: "'Source Serif 4', serif" }}
    >
      <div className="absolute inset-0 bg-[url('/templates/ivory-pavilion/corner-ornament.jpeg')] bg-cover bg-center opacity-[0.08]" />
      <div className="relative mx-auto max-w-5xl">
        <IvorySectionHeader eyebrow="Dress code" title={data.dresscodeType || 'An elegant evening'} />

        <div className="mt-12 grid gap-5 md:mt-14 md:grid-cols-2">
          <DressCard
            label="Gentlemen"
            description={data.dresscodeMen || 'Black Tuxedo'}
            imageSrc="/icons/dress-code/men-shirt-suspenders-bowtie-v2.png"
            color={data.dresscodeMenColor}
          />
          <DressCard
            label="Ladies"
            description={data.dresscodeWomen || 'Floor-length Gown'}
            imageSrc="/icons/dress-code/women-dress-blue-bodice.png"
            color={data.dresscodeWomenColor}
          />
        </div>
      </div>
    </section>
  )
}
