import { execFileSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const PUBLIC_CV_REL = 'public/assets/cv_hector_carrion.pdf'

const MONTHS = {
  jan: 1,
  january: 1,
  feb: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  august: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12,
}

function parseFilenameYearMonth(filename) {
  const match = filename.match(
    /\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(20\d{2})\b/i
  )
  if (!match) return 0
  const month = MONTHS[match[1].toLowerCase()] || 0
  const year = Number(match[2]) || 0
  return year * 100 + month
}

function getShallowShas(cwd) {
  try {
    const gitDir = execFileSync('git', ['rev-parse', '--git-dir'], {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    const shallowPath = path.resolve(cwd, gitDir, 'shallow')
    if (fs.existsSync(shallowPath)) {
      return new Set(
        fs
          .readFileSync(shallowPath, 'utf8')
          .split(/\s+/)
          .map((s) => s.trim())
          .filter(Boolean)
      )
    }
  } catch {}
  return new Set()
}

function scoreCandidate(cwd, relPath, shallowShas) {
  const absPath = path.join(cwd, relPath)
  const stat = fs.statSync(absPath)
  const filenameDate = parseFilenameYearMonth(path.basename(relPath))
  const isRootPdf = relPath !== PUBLIC_CV_REL ? 1 : 0

  try {
    const status = execFileSync(
      'git',
      ['status', '--porcelain', '--', relPath],
      {
        cwd,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }
    ).trim()
    if (status) {
      return {
        relPath,
        absPath,
        tier: 3,
        time: stat.mtimeMs,
        filenameDate,
        isRootPdf,
      }
    }

    const logLine = execFileSync(
      'git',
      ['log', '-1', '--format=%H:%ct', '--', relPath],
      {
        cwd,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }
    ).trim()

    if (logLine) {
      const [sha, ctStr] = logLine.split(':')
      if (sha && !shallowShas.has(sha)) {
        return {
          relPath,
          absPath,
          tier: 2,
          time: Number(ctStr) || 0,
          filenameDate,
          isRootPdf,
        }
      }
    }
  } catch {}

  return {
    relPath,
    absPath,
    tier: 1,
    time: 0,
    filenameDate,
    isRootPdf,
  }
}

export function syncLatestCvPdf(cwd = process.cwd()) {
  const rootEntries = fs
    .readdirSync(cwd, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.toLowerCase().endsWith('.pdf'))
    .map((d) => d.name)

  const candidates = [...rootEntries]
  const publicCvAbs = path.join(cwd, PUBLIC_CV_REL)
  if (fs.existsSync(publicCvAbs)) {
    candidates.push(PUBLIC_CV_REL)
  }

  if (candidates.length === 0) return null

  const shallowShas = getShallowShas(cwd)
  const scored = candidates
    .map((rel) => scoreCandidate(cwd, rel, shallowShas))
    .sort((a, b) => {
      if (b.tier !== a.tier) return b.tier - a.tier
      if (b.time !== a.time) return b.time - a.time
      if (b.filenameDate !== a.filenameDate) {
        return b.filenameDate - a.filenameDate
      }
      return b.isRootPdf - a.isRootPdf
    })

  const winner = scored[0]
  if (winner.relPath !== PUBLIC_CV_REL) {
    fs.mkdirSync(path.dirname(publicCvAbs), { recursive: true })
    const srcBuf = fs.readFileSync(winner.absPath)
    const dstExists = fs.existsSync(publicCvAbs)
    const dstBuf = dstExists ? fs.readFileSync(publicCvAbs) : null
    if (!dstBuf || !srcBuf.equals(dstBuf)) {
      fs.writeFileSync(publicCvAbs, srcBuf)
      console.log(`[sync-cv] Synced "${winner.relPath}" -> ${PUBLIC_CV_REL}`)
    }
  }

  return winner.relPath
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) ===
    path.resolve(new URL(import.meta.url).pathname)
) {
  syncLatestCvPdf()
}
