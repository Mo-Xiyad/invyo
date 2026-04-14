'use client'
export default function InvitationPage({ arrivalTime }: { arrivalTime: '16:30' | '17:30' }) {
  return (
    <div className="min-h-screen bg-champagne flex items-center justify-center font-cinzel text-gold text-sm tracking-widest">
      Loading… ({arrivalTime})
    </div>
  )
}
