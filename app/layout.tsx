import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'Paydle — Daily Salary Guessing Game',
  description: 'Guess the salaries of UK public figures. New game every day.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full bg-slate-950 text-white flex flex-col antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
