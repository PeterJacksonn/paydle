import Link from 'next/link'
import HomeBackground from '@/components/HomeBackground'
import people from '@/data/people.json'

const images = people.map((p) => p.image)

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center flex-1 px-4 text-center relative">
      <HomeBackground images={images} />

      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-6xl font-bold text-yellow-400 tracking-tight">Paydle</h1>
        <p className="mt-3 text-slate-400 text-lg max-w-sm">
          Guess the salaries of UK public figures. Five rounds, every day.
        </p>

        <div className="mt-10 flex flex-col gap-3 w-full max-w-xs">
          <Link
            href="/play"
            className="py-4 bg-yellow-400 text-slate-900 font-bold text-lg rounded-xl hover:bg-yellow-300 transition-colors"
          >
            Play Today&apos;s Game
          </Link>
          <Link
            href="/how-to-play"
            className="py-4 border border-slate-700 text-slate-300 font-medium rounded-xl hover:border-slate-500 hover:text-white transition-colors backdrop-blur-sm"
          >
            How to Play
          </Link>
        </div>
      </div>
    </main>
  )
}
