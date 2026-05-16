'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import PersonCard, { type PublicPerson, type RoundResult } from './PersonCard'
import GuessInput from './GuessInput'
import ScoreScreen from './ScoreScreen'
import HomeBackground from './HomeBackground'

interface SavedState {
  date: string
  results: RoundResult[]
  gameComplete: boolean
}

export default function GameBoard({ images = [] }: { images?: string[] }) {
  const [people, setPeople] = useState<PublicPerson[]>([])
  const [date, setDate] = useState('')
  const [currentRound, setCurrentRound] = useState(0)
  const [hintsRevealed, setHintsRevealed] = useState(0)
  const [results, setResults] = useState<RoundResult[]>([])
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null)
  const [gameComplete, setGameComplete] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch('/api/daily')
        if (!res.ok) throw new Error('Failed to load')
        const data = await res.json()
        setPeople(data.people)
        setDate(data.date)

        const storageKey = `paydle-${data.date}`
        const saved = localStorage.getItem(storageKey)
        if (saved) {
          const state: SavedState = JSON.parse(saved)
          setResults(state.results)
          setGameComplete(state.gameComplete)
          if (!state.gameComplete) setCurrentRound(state.results.length)
        }
      } catch {
        setError('Failed to load today\'s game. Please refresh.')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  function saveState(newResults: RoundResult[], complete: boolean) {
    if (!date) return
    const state: SavedState = { date, results: newResults, gameComplete: complete }
    localStorage.setItem(`paydle-${date}`, JSON.stringify(state))
  }

  async function handleGuess(guess: number) {
    const person = people[currentRound]
    const res = await fetch('/api/guess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ personId: person.id, guess, hintsUsed: hintsRevealed }),
    })
    const data = await res.json()

    const result: RoundResult = {
      personId: person.id,
      hintsUsed: hintsRevealed,
      guess,
      actual: data.actual,
      score: data.score,
      percentOff: data.percentOff,
    }

    const newResults = [...results, result]
    const complete = newResults.length === 5

    setRoundResult(result)
    setResults(newResults)
    saveState(newResults, complete)
  }

  function nextRound() {
    setCurrentRound((prev) => prev + 1)
    setHintsRevealed(0)
    setRoundResult(null)
  }

  const totalScore = results.reduce((sum, r) => sum + r.score, 0)
  const isLastRound = currentRound === 4

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-3">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Loading today&apos;s game…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center flex-1">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  if (gameComplete) {
    return (
      <main className="w-full max-w-lg mx-auto px-4 py-8 relative">
        <HomeBackground images={images} />
        <div className="relative z-10">
          <header className="text-center mb-8">
            <Link href="/">
              <h1 className="text-5xl font-bold text-yellow-400 tracking-tight hover:text-yellow-300 transition-colors">Paydle</h1>
            </Link>
            <p className="text-slate-500 text-sm mt-2">Daily salary guessing game</p>
          </header>
          <ScoreScreen results={results} people={people} date={date} />
        </div>
      </main>
    )
  }

  const currentPerson = people[currentRound]

  return (
    <main className="w-full max-w-lg mx-auto px-4 py-6 flex flex-col gap-5">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-yellow-400 tracking-tight">Paydle</h1>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm">
            Round <span className="text-white font-semibold">{currentRound + 1}</span> / 5
          </span>
          <span className="text-slate-400 text-sm">
            Score <span className="text-yellow-400 font-bold">{totalScore.toLocaleString('en-GB')}</span>
          </span>
        </div>
      </header>

      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i < results.length
                ? 'bg-yellow-400'
                : i === currentRound
                  ? 'bg-slate-600'
                  : 'bg-slate-800'
            }`}
          />
        ))}
      </div>

      {currentPerson && (
        <PersonCard
          person={currentPerson}
          hintsRevealed={hintsRevealed}
          onRevealHint={() => setHintsRevealed((prev) => Math.min(prev + 1, 3))}
          roundResult={roundResult}
        />
      )}

      {!roundResult && (
        <GuessInput hintsRevealed={hintsRevealed} onGuess={handleGuess} />
      )}

      {roundResult && (
        <button
          onClick={isLastRound ? () => setGameComplete(true) : nextRound}
          className="w-full py-3.5 bg-yellow-400 text-slate-900 font-bold rounded-xl hover:bg-yellow-300 transition-colors text-lg"
        >
          {isLastRound ? 'Final Score' : 'Next Round →'}
        </button>
      )}
    </main>
  )
}
