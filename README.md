# Paydle

A daily salary guessing game I built for fun using Claude & Claude Code. You're shown a UK public figure, politician, footballer, TV presenter, CEO, and you have to guess their annual salary. Five rounds a day, same people for everyone, resets at midnight.

Live at [paydle.vercel.app](https://paydle.vercel.app)

## How it works

Each round you see a photo and name. You can reveal up to 3 hints (Industry → Employer → Job Title) but each one cuts your score potential. One guess per round, no going back. Scores are based on how close you are on a logarithmic scale, so being off by an order of magnitude hurts more than being off by 10%.

The daily lineup is seeded by date so everyone gets the same 5 people. Salaries are never sent to the browser until after you've guessed — the actual figure only comes back from the server as part of the result.

## The build

Next.js 16 and Tailwind CSS, deployed on Vercel.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Images

Person images are in the repo under `public/people/`. If you add new people to `data/people.json`, you can fetch their images from Wikipedia:

```bash
npm run download-images
```

This fetches thumbnails via the Wikipedia REST API, resizes to 500×600px, and saves to `public/people/`. Skips anyone who already has an image. Run `node scripts/check-images.js` to see who's missing.
