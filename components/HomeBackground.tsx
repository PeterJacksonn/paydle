'use client'

import Image from 'next/image'

const COLS = 7
const ROWS = 14

export default function HomeBackground({ images }: { images: string[] }) {
  if (images.length === 0) return null

  const total = COLS * ROWS
  const tiles = Array.from({ length: total }, (_, i) => images[i % images.length])

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <style>{`
        @keyframes diagonal-scroll {
          from { transform: translate(0, 0); }
          to   { transform: translate(-300px, -300px); }
        }
      `}</style>

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          opacity: 0.17,
          filter: 'blur(8px)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-300px',
            left: '-300px',
            width: 'calc(100% + 600px)',
            height: 'calc(100% + 600px)',
            display: 'grid',
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            animation: 'diagonal-scroll 12s ease-in-out infinite alternate',
            willChange: 'transform',
          }}
        >
          {tiles.map((src, i) => (
            <div key={i} style={{ position: 'relative', aspectRatio: '5/6' }}>
              <Image
                src={src}
                alt=""
                fill
                sizes={`${Math.ceil(100 / COLS)}vw`}
                style={{ objectFit: 'cover', objectPosition: 'top' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
