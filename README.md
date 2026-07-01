# DSA Dojo 🥋

A personal, colorful **LeetCode tracker** — live at
**https://shiva-shivanibokka.github.io/dsa-dojo/**

Neo-brutalist light theme: cream paper, thick ink borders, hard offset shadows,
loud accents. Built to make interview grinding feel like progress.

## How it works

- **Auto-synced from LeetCode.** A build-time script hits LeetCode's GraphQL
  endpoint (in GitHub Actions — no browser, no CORS) for the configured user and
  pulls: solved-by-difficulty stats, current streak, and recent accepted
  problems with their topic tags (→ patterns) and solve dates.
- **The accumulator.** LeetCode only exposes your *recent* solves publicly, so
  each run *merges* new problems into `public/problems.json` and commits it back.
  On a daily cron + every push, your history builds itself forward automatically.
- **You control** three things per problem, saved separately in
  `public/overrides.json`: **confidence** (Solid / Shaky / Forgot), a
  **revisit ⭐ flag**, and freeform **notes**. Problems you flag or mark "Forgot"
  surface in the **Needs Revisit** view — your spaced-repetition list.
- **Optional GitHub auto-sync.** Paste a fine-grained PAT (Contents: R/W on this
  repo only) in Settings and your edits commit straight to the repo. The token
  is stored **only in your browser** — never committed or sent anywhere but
  GitHub.

## Stack

Vite + React + TypeScript + Tailwind CSS, deployed to GitHub Pages via Actions.

## Scripts

```bash
npm run sync    # pull latest solves from LeetCode → public/problems.json
npm run dev     # local dev server
npm run build   # type-check + production build
```

Change the tracked user with `LEETCODE_USERNAME` (env) or `--user <handle>`.
