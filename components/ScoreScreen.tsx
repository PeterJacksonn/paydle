'use client'

import { useEffect, useRef, useState } from 'react'
import { scoreColor } from '@/lib/scoring'
import type { PublicPerson, RoundResult } from './PersonCard'

function useCountUp(target: number, duration: number) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const start = performance.now()
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(eased * target))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [target, duration])

  return display
}

interface Props {
  results: RoundResult[]
  people: PublicPerson[]
  date: string
}

function scoreEmoji(score: number): string {
  if (score >= 700) return '🟩'
  if (score >= 500) return '🟨'
  if (score >= 250) return '🟧'
  return '🟥'
}

export default function ScoreScreen({ results, people, date }: Props) {
  const [copied, setCopied] = useState(false)
  const total = results.reduce((sum, r) => sum + r.score, 0)
  const animatedTotal = useCountUp(total, 1500)
  const maxPossible = 5000

  const displayDate = new Date(date + 'T00:00:00Z').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  function buildShareText() {
    const lines = [
      `Paydle ${displayDate} 🎯`,
      '',
      ...results.map((r, i) => {
        const person = people[i]
        return `${scoreEmoji(r.score)} ${person?.name ?? `Round ${i + 1}`}: ${r.score.toLocaleString('en-GB')} pts`
      }),
      '',
      `Total: ${total.toLocaleString('en-GB')} / ${maxPossible.toLocaleString('en-GB')} pts`,
    ]
    return lines.join('\n')
  }

  async function handleShare() {
    const text = buildShareText()
    if (navigator.share) {
      try {
        await navigator.share({ text })
        return
      } catch {
        // fall through to clipboard
      }
    }
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const percentage = Math.round((total / maxPossible) * 100)

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <p className="text-slate-400 text-sm mb-1">{displayDate}</p>
        <h2 className="text-3xl font-bold text-white">Game Over!</h2>
        <p className="text-8xl font-bold text-yellow-400 mt-2 tracking-tight">
          {animatedTotal.toLocaleString('en-GB')}
        </p>
        <p className="text-slate-500 text-sm mt-1">
          {percentage}% of {maxPossible.toLocaleString('en-GB')} possible
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {results.map((result, i) => {
          const person = people[i]
          return (
            <div
              key={result.personId}
              className="px-4 py-3 border-b border-slate-800 last:border-0"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-white font-semibold text-sm">{scoreEmoji(result.score)} {person?.name}</span>
                <span className={`font-bold text-sm shrink-0 ${scoreColor(result.score)}`}>
                  {result.score.toLocaleString('en-GB')} pts
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5">
                Actual £{result.actual.toLocaleString('en-GB')} · Guessed £{result.guess.toLocaleString('en-GB')} · {(['✨ 0 hints', '🟡 1 hint', '🟠 2 hints', '🔴 3 hints'])[result.hintsUsed]}
              </p>
            </div>
          )
        })}
      </div>

      <button
        onClick={handleShare}
        className="w-full py-3.5 bg-yellow-400 text-slate-900 font-bold rounded-xl hover:bg-yellow-300 transition-colors text-lg"
      >
        {copied ? 'Copied to clipboard!' : 'Share Results'}
      </button>

      <p className="text-center text-slate-600 text-sm">Come back tomorrow for a new game</p>
    </div>
  )
}
