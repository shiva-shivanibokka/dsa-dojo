// Build-time LeetCode sync. Pulls, for the configured user:
//   - profile stats (ranking, solved-by-difficulty)   → the stat band
//   - submission calendar (current streak, active days) → the streak counter
//   - recent accepted problems (title, difficulty, topic tags) → the board
//
// LeetCode does NOT publicly expose a full historical solved list — only the
// most recent accepted submissions. So we run as an ACCUMULATOR: each run merges
// newly-seen problems into public/problems.json and keeps everything already
// there. On a weekly cron + every push, the history builds itself forward with
// zero manual entry (as long as fewer than the fetch limit are solved between
// runs). The user's confidence/revisit/notes live separately in overrides.json.
//
// Runs in Node (GitHub Actions or locally) — no browser, so no CORS. Usage:
//   node scripts/sync-leetcode.mjs [--user <handle>]

import fs from 'node:fs'
import path from 'node:path'

const args = process.argv.slice(2)
const USER = argVal('--user') || process.env.LEETCODE_USERNAME || 'YqGw1R8NKB'
const LIMIT = 20 // LeetCode caps recentAcSubmissionList around this
const GQL = 'https://leetcode.com/graphql'
const OUT = path.join(process.cwd(), 'public', 'problems.json')

function argVal(flag) {
  const i = args.indexOf(flag)
  return i !== -1 ? args[i + 1] : undefined
}

// LeetCode rejects requests without a browser-like Referer/UA.
const headers = {
  'Content-Type': 'application/json',
  Referer: `https://leetcode.com/u/${USER}/`,
  Origin: 'https://leetcode.com',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
}

async function gql(query, variables) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(GQL, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
      })
      if (res.status === 429) {
        await sleep(1500 * (attempt + 1))
        continue
      }
      if (!res.ok) {
        console.warn(`  ! GraphQL ${res.status}`)
        return null
      }
      const json = await res.json()
      if (json.errors) {
        console.warn(`  ! GraphQL errors: ${JSON.stringify(json.errors).slice(0, 200)}`)
        return null
      }
      return json.data
    } catch (e) {
      console.warn(`  ! network error: ${e.message}`)
      await sleep(1000)
    }
  }
  return null
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// --- queries ---------------------------------------------------------------
const Q_PROFILE = `
  query userProfile($username: String!) {
    matchedUser(username: $username) {
      profile { ranking }
      submitStatsGlobal { acSubmissionNum { difficulty count } }
    }
    allQuestionsCount { difficulty count }
  }`

const Q_CALENDAR = `
  query userCalendar($username: String!) {
    matchedUser(username: $username) {
      userCalendar { streak totalActiveDays submissionCalendar }
    }
  }`

const Q_RECENT = `
  query recentAc($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      title titleSlug timestamp
    }
  }`

const Q_QUESTION = `
  query question($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      questionFrontendId title difficulty
      topicTags { name }
    }
  }`

// --- helpers ---------------------------------------------------------------
function readExisting() {
  try {
    const j = JSON.parse(fs.readFileSync(OUT, 'utf8'))
    return {
      problems: Array.isArray(j.problems) ? j.problems : [],
      profile: j.profile && typeof j.profile === 'object' ? j.profile : null,
    }
  } catch {
    return { problems: [], profile: null }
  }
}

// Build the profile from whatever queries succeeded, falling back to the prior
// on-disk profile for any slice whose query returned null. This means a failed
// profile OR calendar query preserves the last good stats instead of zeroing
// them — each slice is only replaced when its own query genuinely succeeded.
function buildProfile(profileData, calendarData, prior) {
  const emptyByDiff = { Easy: { solved: 0, total: 0 }, Medium: { solved: 0, total: 0 }, Hard: { solved: 0, total: 0 } }

  const mu = profileData?.matchedUser
  let profileSlice
  if (profileData) {
    const byDifficulty = { ...emptyByDiff }
    let totalSolved = 0
    let ranking = null
    if (mu) {
      ranking = mu.profile?.ranking ?? null
      for (const row of mu.submitStatsGlobal?.acSubmissionNum || []) {
        if (row.difficulty === 'All') {
          totalSolved = row.count
          continue
        }
        if (byDifficulty[row.difficulty]) byDifficulty[row.difficulty].solved = row.count
      }
    }
    for (const row of profileData.allQuestionsCount || []) {
      if (byDifficulty[row.difficulty]) byDifficulty[row.difficulty].total = row.count
    }
    profileSlice = { ranking, totalSolved, byDifficulty }
  } else {
    // profile query failed — keep whatever we last had on disk
    profileSlice = {
      ranking: prior?.ranking ?? null,
      totalSolved: prior?.totalSolved ?? 0,
      byDifficulty: prior?.byDifficulty ?? { ...emptyByDiff },
    }
  }

  const cal = calendarData?.matchedUser?.userCalendar
  let calendarSlice
  if (cal) {
    let submissionsPastYear = 0
    const calendar = {} // 'YYYY-MM-DD' → count
    if (cal.submissionCalendar) {
      try {
        const map = JSON.parse(cal.submissionCalendar)
        for (const [ts, count] of Object.entries(map)) {
          submissionsPastYear += Number(count)
          const day = new Date(Number(ts) * 1000).toISOString().slice(0, 10)
          calendar[day] = (calendar[day] || 0) + Number(count)
        }
      } catch {
        /* ignore */
      }
    }
    calendarSlice = {
      streak: cal.streak ?? 0,
      totalActiveDays: cal.totalActiveDays ?? 0,
      submissionsPastYear,
      calendar,
    }
  } else {
    // calendar query failed — keep the last good streak/calendar
    calendarSlice = {
      streak: prior?.streak ?? 0,
      totalActiveDays: prior?.totalActiveDays ?? 0,
      submissionsPastYear: prior?.submissionsPastYear ?? 0,
      calendar: prior?.calendar ?? {},
    }
  }

  return { ...profileSlice, ...calendarSlice }
}

async function main() {
  console.log(`Syncing LeetCode for @${USER}`)

  const [profileData, calendarData, recentData] = await Promise.all([
    gql(Q_PROFILE, { username: USER }),
    gql(Q_CALENDAR, { username: USER }),
    gql(Q_RECENT, { username: USER, limit: LIMIT }),
  ])

  const priorData = readExisting()

  const profile = buildProfile(profileData, calendarData, priorData.profile)
  if (!profileData) console.warn('  ! profile query failed — preserving prior profile stats')
  if (!calendarData) console.warn('  ! calendar query failed — preserving prior streak/calendar')
  console.log(
    `  profile: ${profile.totalSolved} solved (E${profile.byDifficulty.Easy.solved}/M${profile.byDifficulty.Medium.solved}/H${profile.byDifficulty.Hard.solved}) · streak ${profile.streak}`,
  )

  // accumulate: keep everything we already have, keyed by slug
  const bySlug = new Map()
  for (const p of priorData.problems) bySlug.set(p.slug, p)

  const recent = recentData?.recentAcSubmissionList || []
  console.log(`  recent accepted returned: ${recent.length}`)

  let added = 0
  for (const sub of recent) {
    const slug = sub.titleSlug
    const solvedAt = sub.timestamp ? new Date(Number(sub.timestamp) * 1000).toISOString() : null
    const existing = bySlug.get(slug)

    // A prior run may have stored this slug with fallback data (id:0, empty tags,
    // difficulty:'Medium') because its Q_QUESTION fetch failed. Treat that as
    // un-enriched and re-attempt enrichment on later runs — only a fully-enriched
    // entry is skipped, so a transient failure isn't baked in forever.
    const enriched = (e) => e && e.id !== 0 && Array.isArray(e.tags) && e.tags.length > 0

    // keep the earliest solvedAt we've seen; enrich tags/difficulty once.
    if (existing) {
      if (solvedAt && (!existing.solvedAt || solvedAt < existing.solvedAt)) existing.solvedAt = solvedAt
      if (enriched(existing)) continue
    }

    const qd = await gql(Q_QUESTION, { titleSlug: slug })
    const q = qd?.question
    if (!q && existing) continue // enrichment still failing — keep the existing fallback, don't crash
    bySlug.set(slug, {
      id: q ? Number(q.questionFrontendId) : 0,
      slug,
      title: sub.title || q?.title || existing?.title || slug,
      difficulty: q?.difficulty || existing?.difficulty || 'Medium',
      tags: (q?.topicTags || []).map((t) => t.name),
      url: `https://leetcode.com/problems/${slug}/`,
      solvedAt: existing?.solvedAt ?? solvedAt,
    })
    if (!existing) added++
    await sleep(250) // be gentle with the endpoint
  }

  const problems = [...bySlug.values()].sort((a, b) => {
    const at = a.solvedAt || ''
    const bt = b.solvedAt || ''
    if (at && bt) return bt.localeCompare(at)
    return (b.id || 0) - (a.id || 0)
  })

  fs.mkdirSync(path.dirname(OUT), { recursive: true })
  const payload = {
    generatedAt: new Date().toISOString(),
    username: USER,
    profile,
    problems,
  }
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2) + '\n')
  console.log(`Wrote ${problems.length} problems (+${added} new) → public/problems.json`)

  if (!profileData && !recentData) {
    console.error('LeetCode returned no data — is the username correct / profile public?')
    // don't fail the build if we still have prior data on disk
    if (problems.length === 0) process.exit(1)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
