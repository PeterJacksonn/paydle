'use client'

import { useEffect, useRef, useState } from 'react'
import { getPotential, scoreColor } from '@/lib/scoring'

function useCountUp(target: number, duration = 1000) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const start = performance.now()
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(eased * target))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [target, duration])

  return display
}

export interface PublicPerson {
  id: number
  name: string
  industry: string
  employer: string
  jobTitle: string
  image: string
}

export interface RoundResult {
  personId: number
  hintsUsed: number
  guess: number
  actual: number
  score: number
  percentOff: number
}

interface Props {
  person: PublicPerson
  hintsRevealed: number
  onRevealHint: () => void
  roundResult: RoundResult | null
}

const HINTS: { label: string; key: keyof PublicPerson }[] = [
  { label: 'Industry', key: 'industry' },
  { label: 'Employer', key: 'employer' },
  { label: 'Job Title', key: 'jobTitle' },
]

function PersonPhoto({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false)
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="relative w-[200px] h-[260px] mx-auto rounded-2xl overflow-hidden bg-slate-700 flex items-center justify-center">
      {!failed && (
        <img
          src={src}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover object-top"
          onError={() => setFailed(true)}
        />
      )}
      {failed && <span className="text-5xl font-bold text-slate-300">{initials}</span>}
    </div>
  )
}

function RoundResultPanel({ result }: { result: RoundResult }) {
  const animatedScore = useCountUp(result.score)
  const potential = getPotential(result.hintsUsed)
  return (
    <div className="mt-2 bg-slate-800 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <span className="text-slate-400 text-sm">Actual salary</span>
        <span className="text-yellow-400 font-bold text-lg">
          £{result.actual.toLocaleString('en-GB')}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-slate-400 text-sm">Your guess</span>
        <span className="text-white font-medium">
          £{result.guess.toLocaleString('en-GB')}
        </span>
      </div>
      <div className="border-t border-slate-700 pt-3 flex justify-between items-center">
        <span className="text-slate-400 text-sm">Round score</span>
        <span className="flex items-baseline gap-1">
          <span className={`font-bold text-xl ${scoreColor(result.score)}`}>
            {animatedScore.toLocaleString('en-GB')}
          </span>
          <span className="text-slate-500 text-sm font-medium">/ {potential.toLocaleString('en-GB')} pts</span>
        </span>
      </div>
    </div>
  )
}

export default function PersonCard({ person, hintsRevealed, onRevealHint, roundResult }: Props) {
  const nextHint = HINTS[hintsRevealed]
  const canRevealMore = hintsRevealed < 3 && !roundResult

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4">
      <PersonPhoto src={person.image} name={person.name} />

      <h2 className="text-2xl font-bold text-white text-center">{person.name}</h2>

      <div className="flex flex-col gap-2">
        {HINTS.slice(0, hintsRevealed).map((hint) => (
          <div
            key={hint.key}
            className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2"
          >
            <span className="text-emerald-400 text-sm font-semibold w-20 shrink-0">{hint.label}</span>
            <span className="text-white font-medium">{person[hint.key] as string}</span>
          </div>
        ))}
      </div>

      {canRevealMore && (
        <button
          onClick={onRevealHint}
          className="w-full py-2.5 rounded-xl border border-slate-600 text-slate-300 text-sm font-medium hover:border-slate-400 hover:text-white transition-colors"
        >
          Reveal {nextHint.label}
        </button>
      )}

      {roundResult && <RoundResultPanel result={roundResult} />}
    </div>
  )
}
