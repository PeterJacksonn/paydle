import fs from 'fs'
import path from 'path'
import GameBoard from '@/components/GameBoard'

export default function PlayPage() {
  const peopleDir = path.join(process.cwd(), 'public', 'people')
  const images = fs.existsSync(peopleDir)
    ? fs.readdirSync(peopleDir)
        .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
        .map((f) => `/people/${f}`)
    : []

  return <GameBoard images={images} />
}
