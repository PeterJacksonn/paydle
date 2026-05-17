import { getDailyPeople } from '@/lib/daily'
import { calculateScore } from '@/lib/scoring'
import { headers } from 'next/headers'

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 60_000
const MAX_REQUESTS = 10

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now >= entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }

  if (entry.count >= MAX_REQUESTS) return true

  entry.count++
  return false
}

export async function POST(request: Request) {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'

  if (isRateLimited(ip)) {
    return Response.json({ error: 'Too many requests' }, { status: 429 })
  }

  const body = await request.json()
  const { personId, guess, hintsUsed } = body

  if (typeof personId !== 'number' || typeof guess !== 'number' || guess < 0) {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }

  const hints = typeof hintsUsed === 'number' ? Math.min(Math.max(hintsUsed, 0), 3) : 3

  const today = new Date().toISOString().split('T')[0]
  const dailyPeople = getDailyPeople(today)
  const person = dailyPeople.find((p) => p.id === personId)

  if (!person) {
    return Response.json({ error: 'Invalid person for today' }, { status: 400 })
  }

  const score = calculateScore(guess, person.salary, hints)
  const percentOff = Math.round((Math.abs(guess - person.salary) / person.salary) * 100)

  return Response.json({ actual: person.salary, score, percentOff })
}
