interface MockupCardProps {
  variant: 'create' | 'share' | 'track'
}

export default function MockupCard({ variant }: MockupCardProps) {
  if (variant === 'create') return <CreateMockup />
  if (variant === 'share') return <ShareMockup />
  return <TrackMockup />
}

function CreateMockup() {
  return (
    <div className="w-full flex items-center justify-center py-4">
      <svg
        viewBox="0 0 480 360"
        className="w-full max-w-md drop-shadow-2xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="20" y="20" width="440" height="320" rx="12" fill="#fdf8f0" stroke="#c9a96e" strokeWidth="1.5" />
        <rect x="20" y="20" width="440" height="40" rx="12" fill="#f0e8d8" />
        <rect x="20" y="44" width="440" height="16" fill="#f0e8d8" />
        <circle cx="44" cy="40" r="5" fill="#c9a96e" opacity="0.4" />
        <circle cx="60" cy="40" r="5" fill="#c9a96e" opacity="0.4" />
        <circle cx="76" cy="40" r="5" fill="#c9a96e" opacity="0.4" />
        <rect x="100" y="30" width="240" height="20" rx="10" fill="#f7f0e4" stroke="#c9a96e" strokeWidth="0.75" />
        <text x="220" y="44" textAnchor="middle" fontSize="8" fill="#9a7d5a" fontFamily="sans-serif">wedvite.me/your-name</text>
        <rect x="140" y="78" width="200" height="242" rx="8" fill="white" stroke="#c9a96e" strokeWidth="1" />
        <line x1="160" y1="100" x2="320" y2="100" stroke="#c9a96e" strokeWidth="0.75" opacity="0.5" />
        <text x="240" y="122" textAnchor="middle" fontSize="9" fill="#9a7d5a" fontFamily="Georgia, serif">Together with their families</text>
        <text x="240" y="150" textAnchor="middle" fontSize="18" fill="#2a1808" fontFamily="Georgia, serif" fontStyle="italic">Sarah &amp; James</text>
        <text x="240" y="168" textAnchor="middle" fontSize="8" fill="#9a7d5a" fontFamily="sans-serif">request the pleasure of your company</text>
        <line x1="160" y1="180" x2="320" y2="180" stroke="#c9a96e" strokeWidth="0.75" opacity="0.5" />
        <text x="240" y="200" textAnchor="middle" fontSize="9" fill="#2a1808" fontFamily="sans-serif" fontWeight="600">Saturday, June 14, 2026</text>
        <text x="240" y="216" textAnchor="middle" fontSize="8" fill="#9a7d5a" fontFamily="sans-serif">The Grand Ballroom, New York</text>
        <rect x="196" y="248" width="88" height="28" rx="14" fill="#2a1808" />
        <text x="240" y="266" textAnchor="middle" fontSize="9" fill="#f7f0e4" fontFamily="sans-serif" fontWeight="600">RSVP Now</text>
        <line x1="160" y1="292" x2="320" y2="292" stroke="#c9a96e" strokeWidth="0.75" opacity="0.5" />
      </svg>
    </div>
  )
}

function ShareMockup() {
  const circles = [168, 196, 224, 252, 280, 308]
  return (
    <div className="w-full flex items-center justify-center py-4">
      <svg
        viewBox="0 0 480 380"
        className="w-full max-w-xs drop-shadow-2xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="130" y="10" width="220" height="360" rx="28" fill="#fdf8f0" stroke="#c9a96e" strokeWidth="1.5" />
        <rect x="148" y="26" width="184" height="8" rx="4" fill="#c9a96e" opacity="0.2" />
        <rect x="138" y="44" width="204" height="300" fill="white" />
        <rect x="152" y="58" width="176" height="190" rx="6" fill="#f7f0e4" stroke="#c9a96e" strokeWidth="0.75" />
        <text x="240" y="84" textAnchor="middle" fontSize="8" fill="#9a7d5a" fontFamily="Georgia, serif">You&apos;re invited to</text>
        <text x="240" y="108" textAnchor="middle" fontSize="16" fill="#2a1808" fontFamily="Georgia, serif" fontStyle="italic">Sarah &amp; James</text>
        <text x="240" y="124" textAnchor="middle" fontSize="7" fill="#9a7d5a" fontFamily="sans-serif">Wedding Celebration</text>
        <line x1="165" y1="134" x2="315" y2="134" stroke="#c9a96e" strokeWidth="0.5" opacity="0.5" />
        <text x="240" y="152" textAnchor="middle" fontSize="8" fill="#2a1808" fontFamily="sans-serif">June 14, 2026 · New York</text>
        <rect x="200" y="176" width="80" height="22" rx="11" fill="#2a1808" />
        <text x="240" y="191" textAnchor="middle" fontSize="8" fill="#f7f0e4" fontFamily="sans-serif">RSVP</text>
        <rect x="152" y="262" width="176" height="36" rx="6" fill="#f0e8d8" />
        <text x="240" y="283" textAnchor="middle" fontSize="7" fill="#9a7d5a" fontFamily="sans-serif">wedvite.me/sarah-james</text>
        {circles.map((cx, i) => (
          <circle key={i} cx={cx} cy="322" r="12" fill="#f0e8d8" stroke="#c9a96e" strokeWidth="0.75" />
        ))}
        <rect x="200" y="358" width="80" height="4" rx="2" fill="#c9a96e" opacity="0.3" />
      </svg>
    </div>
  )
}

function TrackMockup() {
  const stats = [
    { x: 32, label: 'Attending', value: '48', color: '#2a1808' },
    { x: 136, label: 'Pending', value: '12', color: '#c9a96e' },
    { x: 240, label: 'Declined', value: '3', color: '#9a7d5a' },
    { x: 344, label: 'Total Invited', value: '63', color: '#8a6030' },
  ]
  const guests = [
    { name: 'Emily & Robert Chen', plus: 'Yes', status: 'Attending', color: '#2a1808' },
    { name: 'Sophie Williams', plus: 'No', status: 'Attending', color: '#2a1808' },
    { name: 'Michael Brown', plus: '—', status: 'Pending', color: '#c9a96e' },
    { name: 'Isabella Turner', plus: 'Yes', status: 'Declined', color: '#9a7d5a' },
  ]
  return (
    <div className="w-full flex items-center justify-center py-4">
      <svg
        viewBox="0 0 480 340"
        className="w-full max-w-md drop-shadow-2xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="16" y="16" width="448" height="308" rx="12" fill="#fdf8f0" stroke="#c9a96e" strokeWidth="1.5" />
        <rect x="16" y="16" width="448" height="40" rx="12" fill="#f0e8d8" />
        <rect x="16" y="40" width="448" height="16" fill="#f0e8d8" />
        <text x="36" y="40" fontSize="11" fill="#2a1808" fontFamily="Georgia, serif" fontWeight="600">RSVP Dashboard</text>
        <rect x="366" y="24" width="78" height="24" rx="12" fill="#2a1808" />
        <text x="405" y="40" textAnchor="middle" fontSize="8" fill="#f7f0e4" fontFamily="sans-serif">+ Invite guest</text>
        {stats.map((stat) => (
          <g key={stat.label}>
            <rect x={stat.x} y="72" width="96" height="58" rx="8" fill="white" stroke="#c9a96e" strokeWidth="0.75" />
            <text x={stat.x + 48} y="101" textAnchor="middle" fontSize="22" fill={stat.color} fontFamily="Georgia, serif" fontWeight="700">{stat.value}</text>
            <text x={stat.x + 48} y="117" textAnchor="middle" fontSize="7" fill="#9a7d5a" fontFamily="sans-serif">{stat.label}</text>
          </g>
        ))}
        <rect x="32" y="146" width="416" height="22" rx="4" fill="#f0e8d8" />
        <text x="50" y="161" fontSize="7" fill="#9a7d5a" fontFamily="sans-serif">NAME</text>
        <text x="224" y="161" fontSize="7" fill="#9a7d5a" fontFamily="sans-serif">PLUS ONE</text>
        <text x="336" y="161" fontSize="7" fill="#9a7d5a" fontFamily="sans-serif">STATUS</text>
        {guests.map((guest, i) => (
          <g key={i}>
            <line x1="32" y1={180 + i * 28} x2="448" y2={180 + i * 28} stroke="#c9a96e" strokeWidth="0.4" opacity="0.4" />
            <text x="50" y={196 + i * 28} fontSize="8" fill="#2a1808" fontFamily="sans-serif">{guest.name}</text>
            <text x="234" y={196 + i * 28} fontSize="8" fill="#9a7d5a" fontFamily="sans-serif">{guest.plus}</text>
            <rect x="330" y={184 + i * 28} width="64" height="16" rx="8" fill={guest.color} opacity="0.12" />
            <text x="362" y={196 + i * 28} textAnchor="middle" fontSize="7" fill={guest.color} fontFamily="sans-serif" fontWeight="600">{guest.status}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}
