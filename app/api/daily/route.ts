import { getDailyPeople } from '@/lib/daily'

export async function GET() {
  const today = new Date().toISOString().split('T')[0]
  const people = getDailyPeople(today)
  const publicPeople = people.map(({ salary: _salary, ...rest }) => rest)
  return Response.json({ date: today, people: publicPeople })
}
