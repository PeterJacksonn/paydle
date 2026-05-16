'use client'

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
            <img
              key={i}
              src={src}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
