const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const sharp = require('sharp')

const people = require('../data/people.json')
const publicDir = path.join(__dirname, '..', 'public', 'people')

const DELAY_MS = 1000
const RETRY_DELAY_MS = 2000
const MAX_RETRIES = 3

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function fetchBuffer(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'paydle-image-downloader/1.0' } })
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`)
  return res.buffer()
}

async function downloadPerson(person) {
  const wikiTitle = encodeURIComponent(person.name.replace(/ /g, '_'))
  const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${wikiTitle}`

  const apiRes = await fetch(apiUrl, { headers: { 'User-Agent': 'paydle-image-downloader/1.0' } })
  if (!apiRes.ok) throw new Error(`Wikipedia API returned ${apiRes.status}`)

  const data = await apiRes.json()
  if (!data.thumbnail?.source) throw new Error('no thumbnail in Wikipedia response')

  const imageBuffer = await fetchBuffer(data.thumbnail.source)
  const filename = path.basename(person.image)
  const dest = path.join(publicDir, filename)

  await sharp(imageBuffer)
    .resize(500, 600, { fit: 'cover', position: 'top' })
    .jpeg({ quality: 85 })
    .toFile(dest)

  return filename
}

async function run() {
  fs.mkdirSync(publicDir, { recursive: true })

  for (const person of people) {
    const filename = path.basename(person.image)
    const dest = path.join(publicDir, filename)

    if (fs.existsSync(dest)) {
      console.log(`⏭  ${person.name} — skipped`)
      continue
    }

    let lastErr
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await downloadPerson(person)
        console.log(`✓  ${person.name} → public/people/${filename}`)
        lastErr = null
        break
      } catch (err) {
        lastErr = err
        if (attempt < MAX_RETRIES) {
          console.log(`↻  ${person.name} — attempt ${attempt} failed (${err.message}), retrying in ${RETRY_DELAY_MS / 1000}s...`)
          await sleep(RETRY_DELAY_MS)
        }
      }
    }

    if (lastErr) {
      console.error(`✗  ${person.name}: ${lastErr.message}`)
    }

    await sleep(DELAY_MS)
  }
}

run()
