import { getDailyPeople } from '@/lib/daily'
import { calculateScore } from '@/lib/scoring'

export async function POST(request: Request) {
  const body = await request.json()
  const { personId, guess, hintsUsed } = body

  if (typeof personId !== 'number' || typeof guess !== 'number' || guess < 0) {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }

  const hints = typeof hintsUsed === 'number' ? Math.min(Math.max(hintsUsed, 0), 3) : 3

  const today = new Date().toISOString().split('T')[0]
  const dailyPeople = await getDailyPeople(today)
  const person = dailyPeople.find((p) => p.id === personId)

  if (!person) {
    return Response.json({ error: 'Invalid person for today' }, { status: 400 })
  }

  const score = calculateScore(guess, person.salary, hints)
  const percentOff = Math.round((Math.abs(guess - person.salary) / person.salary) * 100)

  return Response.json({ actual: person.salary, score, percentOff })
}
