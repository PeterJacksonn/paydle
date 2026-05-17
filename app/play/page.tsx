import GameBoard from '@/components/GameBoard'
import people from '@/data/people.json'

const images = people.map((p) => p.image)

export default function PlayPage() {
  return <GameBoard images={images} />
}
