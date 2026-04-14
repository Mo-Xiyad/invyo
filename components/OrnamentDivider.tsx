// components/OrnamentDivider.tsx
export default function OrnamentDivider() {
  return (
    <div className="text-center py-2">
      <svg width="96" height="22" viewBox="0 0 96 22" fill="none">
        <path d="M4 11 L36 11"  stroke="#c9a96e" strokeWidth="0.6" opacity="0.4"/>
        <path d="M60 11 L92 11" stroke="#c9a96e" strokeWidth="0.6" opacity="0.4"/>
        <path d="M48 3 Q43 7 41 11 Q43 15 48 19 Q53 15 55 11 Q53 7 48 3Z"
              stroke="#c9a96e" strokeWidth="0.7" fill="none" opacity="0.5"/>
        <circle cx="48" cy="11" r="1.4" fill="#c9a96e" opacity="0.5"/>
        <circle cx="7"  cy="11" r="1"   fill="#c9a96e" opacity="0.3"/>
        <circle cx="89" cy="11" r="1"   fill="#c9a96e" opacity="0.3"/>
      </svg>
    </div>
  )
}
