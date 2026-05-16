const fs = require('fs')
const path = require('path')

const people = require('../data/people.json')

const missing = people.filter((person) => {
  const dest = path.join(__dirname, '..', 'public', person.image)
  return !fs.existsSync(dest)
})

if (missing.length === 0) {
  console.log('✓ All images present')
} else {
  console.log(`Missing ${missing.length} / ${people.length} images:\n`)
  missing.forEach((p) => console.log(`  ✗  ${p.name} — ${p.image}`))
}
