import fs from 'fs/promises'
import path from 'path'

export interface Person {
  id: number
  name: string
  industry: string
  employer: string
  jobTitle: string
  salary: number
  image: string
}

export type PublicPerson = Omit<Person, 'salary'>

function seededRandom(seed: number) {
  let s = seed | 0
  return function () {
    s = Math.imul(s ^ (s >>> 15), s | 1)
    s ^= s + Math.imul(s ^ (s >>> 7), s | 61)
    return ((s ^ (s >>> 14)) >>> 0) / 4294967296
  }
}

function dateSeed(dateStr: string): number {
  return dateStr.split('-').reduce((acc, part, i) => acc + parseInt(part) * Math.pow(100, 2 - i), 0)
}

function pickIndices(seed: number, total: number, count: number): number[] {
  const rand = seededRandom(seed)
  const indices = Array.from({ length: total }, (_, i) => i)
  for (let i = total - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]]
  }
  return indices.slice(0, count)
}

export async function getDailyPeople(dateStr: string): Promise<Person[]> {
  const filePath = path.join(process.cwd(), 'data', 'people.json')
  const raw = await fs.readFile(filePath, 'utf-8')
  const all: Person[] = JSON.parse(raw)
  const indices = pickIndices(dateSeed(dateStr), all.length, 5)
  return indices.map((i) => all[i])
}
