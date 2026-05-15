import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center flex-1 px-4 text-center">
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
          className="py-4 border border-slate-700 text-slate-300 font-medium rounded-xl hover:border-slate-500 hover:text-white transition-colors"
        >
          How to Play
        </Link>
      </div>

      <div className="mt-16 grid grid-cols-3 gap-6 text-center max-w-sm w-full">
        <div>
          <p className="text-2xl font-bold text-white">5</p>
          <p className="text-slate-500 text-xs mt-1">rounds per day</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-white">3</p>
          <p className="text-slate-500 text-xs mt-1">hints available</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-white">5,000</p>
          <p className="text-slate-500 text-xs mt-1">max score</p>
        </div>
      </div>
    </main>
  )
}
