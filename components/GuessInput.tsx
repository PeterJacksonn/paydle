'use client'

import { useState } from 'react'
import { getPotential } from '@/lib/scoring'

interface Props {
  hintsRevealed: number
  onGuess: (amount: number) => Promise<void>
}

export default function GuessInput({ hintsRevealed, onGuess }: Props) {
  const [raw, setRaw] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const potential = getPotential(hintsRevealed)
  const numericValue = parseInt(raw, 10)
  const formatted = raw ? numericValue.toLocaleString('en-GB') : ''
  const isValid = raw.length > 0 && !isNaN(numericValue) && numericValue > 0

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const stripped = e.target.value.replace(/[^0-9]/g, '')
    if (stripped.length <= 10) setRaw(stripped)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid || submitting) return
    setSubmitting(true)
    await onGuess(numericValue)
    setSubmitting(false)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">Potential</span>
        <span className="text-yellow-400 font-semibold">{potential.toLocaleString('en-GB')} pts</span>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg pointer-events-none">
            £
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={formatted}
            onChange={handleChange}
            placeholder="0"
            autoFocus
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-3 text-white text-lg font-medium placeholder-slate-600 focus:outline-none focus:border-yellow-400 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={!isValid || submitting}
          className="px-6 py-3 bg-yellow-400 text-slate-900 font-bold rounded-xl hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          {submitting ? '…' : 'Guess'}
        </button>
      </form>
    </div>
  )
}
