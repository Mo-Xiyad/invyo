'use client';

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  delay: number;
  size: number;
  color: string;
  shape: 'diamond' | 'star';
  duration: number;
}

const ConfettiEffect = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const colors = ['hsl(32, 55%, 50%)', 'hsl(164, 29%, 33%)', 'hsl(35, 46%, 66%)'];
    const newParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 1,
      size: 8 + Math.random() * 12,
      color: colors[i % colors.length],
      shape: i % 2 === 0 ? 'diamond' : 'star',
      duration: 1.5 + Math.random() * 1.5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute am-am-animate-confetti"
          style={{
            left: `${p.x}%`,
            top: -20,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          {p.shape === 'diamond' ? (
            <svg width={p.size} height={p.size} viewBox="0 0 10 10">
              <path d="M5 0L10 5L5 10L0 5Z" fill={p.color} />
            </svg>
          ) : (
            <svg width={p.size} height={p.size} viewBox="0 0 10 10">
              <path d="M5 0L6.1 3.5L10 3.8L7 6.2L7.9 10L5 7.8L2.1 10L3 6.2L0 3.8L3.9 3.5Z" fill={p.color} />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
};

export default ConfettiEffect;
