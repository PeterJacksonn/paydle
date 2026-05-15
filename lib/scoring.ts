const POTENTIALS = [1000, 850, 700, 550]

export function calculateScore(guess: number, actual: number, hintsUsed: number): number {
  const accuracy = Math.max(0, 1 - Math.abs(Math.log10(guess / actual)))
  const potential = POTENTIALS[Math.min(hintsUsed, 3)]
  return Math.round(potential * accuracy)
}

export function getPotential(hintsUsed: number): number {
  return POTENTIALS[Math.min(hintsUsed, 3)]
}

export function scoreColor(score: number): string {
  if (score >= 900) return 'text-emerald-400'
  if (score >= 700) return 'text-green-400'
  if (score >= 500) return 'text-yellow-400'
  if (score >= 250) return 'text-orange-400'
  return 'text-red-400'
}
