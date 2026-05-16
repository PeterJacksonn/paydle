import Link from 'next/link'

const steps = [
  {
    number: '1',
    title: 'See the person',
    description: "You're shown a photo and name of a UK public figure.",
  },
  {
    number: '2',
    title: 'Reveal hints (optional)',
    description:
      'Reveal up to 3 hints one at a time — Industry, Employer, then Job Title. Each hint you use lowers your score potential.',
  },
  {
    number: '3',
    title: 'Make your guess',
    description: 'Enter your best estimate of their annual salary in pounds. One guess per round.',
  },
  {
    number: '4',
    title: 'See how you did',
    description:
      'The actual salary is revealed along with how close you were and your points for the round.',
  },
]

const potentials = [
  { hints: '0 hints', score: '1,000 pts' },
  { hints: '1 hint', score: '850 pts' },
  { hints: '2 hints', score: '700 pts' },
  { hints: '3 hints', score: '550 pts' },
]

export default function HowToPlay() {
  return (
    <main className="w-full max-w-lg mx-auto px-4 py-10 flex flex-col gap-8">
      <div>
        <Link href="/" className="text-slate-500 text-sm hover:text-slate-300 transition-colors">
          ← Back
        </Link>
        <h1 className="text-3xl font-bold text-white mt-4">How to Play</h1>
        <p className="text-slate-400 mt-2">
          Five rounds per day, same people for everyone. New game at midnight.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {steps.map((step) => (
          <div key={step.number} className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-yellow-400 text-slate-900 font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
              {step.number}
            </div>
            <div>
              <p className="text-white font-semibold">{step.title}</p>
              <p className="text-slate-400 text-sm mt-0.5">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800">
          <p className="text-white font-semibold text-sm">Score potential</p>
          <p className="text-slate-500 text-xs mt-0.5">The fewer hints you use, the higher your potential score</p>
        </div>
        {potentials.map((row) => (
          <div key={row.hints} className="flex items-center justify-between px-4 py-3 border-b border-slate-800 last:border-0">
            <span className="text-slate-300 text-sm">{row.hints}</span>
            <span className="text-yellow-400 font-bold text-sm">{row.score}</span>
          </div>
        ))}
      </div>

<Link
        href="/play"
        className="w-full py-4 bg-yellow-400 text-slate-900 font-bold text-lg rounded-xl hover:bg-yellow-300 transition-colors text-center"
      >
        Play Today&apos;s Game
      </Link>
    </main>
  )
}
