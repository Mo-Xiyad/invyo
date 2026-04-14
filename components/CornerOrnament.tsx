// components/CornerOrnament.tsx
type Props = { className?: string }

export default function CornerOrnament({ className = '' }: Props) {
  return (
    <svg
      className={`absolute pointer-events-none ${className}`}
      width="42" height="42" viewBox="0 0 42 42" fill="none"
    >
      <path d="M2 40 L2 2 L40 2" stroke="#c9a96e" strokeWidth="0.8" opacity="0.5" fill="none"/>
      <circle cx="12" cy="12" r="5" stroke="#c9a96e" strokeWidth="0.6" fill="none" opacity="0.38"/>
      <path d="M12 7 Q9 10 7 12 Q10 14 12 17 Q14 14 17 12 Q14 10 12 7Z"
            stroke="#c9a96e" strokeWidth="0.5" fill="none" opacity="0.38"/>
      <circle cx="12" cy="12" r="1.5" fill="#c9a96e" opacity="0.32"/>
      <path d="M18 12 Q23 8 27 2" stroke="#c9a96e" strokeWidth="0.45" fill="none" opacity="0.2"/>
      <path d="M12 18 Q8 23 2 27" stroke="#c9a96e" strokeWidth="0.45" fill="none" opacity="0.2"/>
    </svg>
  )
}
