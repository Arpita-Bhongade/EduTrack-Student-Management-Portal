import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbPath = path.join(__dirname, '..', 'data', 'db.json')

export function readDb() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'))
}

export function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
  return data
}
