# CI-Spellbook — Weekly Research Routine Operating Manual

> This file is the authoritative operating manual for the weekly auto-research routine. Any conflict between this file and the short system prompt that invoked the routine resolves in favor of **this file**.

---

## Overview

The routine wakes weekly (or on-demand), picks one or two target category files, researches candidate tools, proposes additions/edits/removals as a single PR, and stops. It never pushes to `main`.

---

## HARD RULES

1. **Never fabricate** a tool, description, URL, star count, or date. If you cannot confirm via fetch, drop the row.
2. **Never push to `main`**. All changes go through a PR.
3. **Never touch more than 2 files per run** (`public/markdown/` targets only).
4. **Never add news, blog posts, or articles** — this is a tools catalog.
5. **Prefer fewer, higher-quality entries** over padding the list.
6. **Never archive, delete, or rename** files in `public/markdown/` without explicit human instruction.
7. If the repo is in an unexpected state (this file missing, `architecture/` folder absent, etc.), open a self-repair PR, re-create what is missing, and **exit without doing research that week**.

---

## Step-by-step procedure

### STEP 1 — Read context (in this order)

1. This file (`architecture/routine-prompt.md`) — the operating manual.
2. `architecture/content-expansion-plan.md` — category priorities and cadence.
3. `architecture/roadmap.md` — broader plan (context only, do not change it).
4. The two most recent merged PRs whose title starts with `research:` — incorporate reviewer feedback. Use:
   ```
   gh pr list --repo companionintelligence/CI-Spellbook \
     --search 'research: in:title' --state merged --limit 2
   ```

### STEP 2 — Pick target file(s)

- Select **one or two** files from `public/markdown/` according to the priority + rotation rules in `content-expansion-plan.md`.
- **High priority** (AI Agents, AI Code Dev, Local-First AI): run every week. Budget: up to 6 additions, 4 edits.
- **Medium priority** (Art, Games, Databases, STT/TTS, Browser Automation, XR): rotate every 2 weeks. Budget: up to 4 additions, 3 edits.
- **Low priority** (Home Automation, Maker, Networking, Data Sources): rotate monthly. Budget: up to 2 additions, 2 edits.
- Rotate through categories in the same priority tier so no single file is touched every week.
- If two files are picked they must be from the **same** priority tier or one file + one new-category creation from `content-expansion-plan.md § Categories worth adding`.

### STEP 3 — Research candidates

Sources to query (use all three when practical):

| Source | Method |
| --- | --- |
| GitHub Search API | `gh api "search/repositories?q=<keywords>&sort=stars&order=desc"` |
| Web search | `WebSearch` for recent "best <category> tools" or HN/Reddit discussions |
| Direct fetch | `WebFetch` to verify README, star count, last commit, license for each candidate |

Filter every candidate through the **quality bar** (see below) before including it in the proposal.

### STEP 4 — Produce additions, edits, and removals

**Schema** — every row must have exactly these four columns:

| Column | Rules |
| --- | --- |
| `Tool` | `[Name](url)` — canonical GitHub or homepage URL |
| `Description` | Plain English, what it does, ≤ 140 chars, no marketing language |
| `Platforms` | Controlled vocabulary (see below), pipe-separated if multiple |
| `Notes` | Opinion, caveats, notable differentiators, ≤ 120 chars |

**Platforms vocabulary** (exact strings only):

`Cross-platform` · `Self-hosted` · `Web` · `macOS` · `Windows` · `Linux` · `iOS` · `Android` · `VS Code` · `JetBrains` · `Neovim` · `Vim` · `Chromium`

**Row ordering:** alphabetical by tool name within each `##` subcategory.

**Removals to propose** (do not remove silently — propose in PR):

| Trigger | Proposed action |
| --- | --- |
| Repo archived or deleted | Remove row; note replacement if any |
| No commits in 12+ months AND < 1k stars | Move to `## Archive` subsection or remove |
| URL renamed / project forked elsewhere | Update URL only |
| Superseded by a better entry already in the file | Remove older one |

### STEP 5 — Create branch and commit

```
git checkout -b research/$(date -u +%Y-%m-%d)-<category-slug>
git add public/markdown/<filename>.md
git commit -m "research: weekly <category short name> refresh $(date -u +%Y-%m-%d)"
git push -u origin research/$(date -u +%Y-%m-%d)-<category-slug>
```

The `<category-slug>` is a short kebab-case label derived from the file name (e.g., `ai-agents`, `local-ai`, `databases`).

### STEP 6 — Open PR

**Title format:**
```
research: weekly <category short name> refresh $(date -u +%Y-%m-%d)
```

**PR body template** (fill every section — do not omit empty sections, write "None" instead):

```markdown
## Target file(s)

- `public/markdown/<filename>.md`

## Additions

| Tool | Stars | Last commit | License | Distinct from existing? | Source |
| --- | --- | --- | --- | --- | --- |
| [Name](url) | 1234 | 2026-04-15 | MIT | Yes — does X which no existing entry does | [link] |

## Edits

| Row | Change | Reason |
| --- | --- | --- |
| [Tool](url) | Updated description from "..." to "..." | Original was inaccurate / stale |

## Removals

| Tool | Reason | Replacement (if any) |
| --- | --- | --- |
| [Tool](url) | Repo archived 2025-11 | [NewFork](url) |

## Quality-bar checklist

For each **addition** proposed above:

- [ ] ≥ 500 GitHub stars OR Notes column justifies lower count
- [ ] Last commit within 6 months OR intentionally stable (noted)
- [ ] OSS license confirmed
- [ ] Not archived
- [ ] Distinct from all existing entries in the file
- [ ] URL fetched and verified to match the description

## Reviewer notes

_Any context the reviewer should know: feedback from prior PRs incorporated, borderline calls, things deliberately left out._
```

### STEP 7 — Stop

Do not merge. Do not poll for reviews. Do not comment on the PR after opening it.

---

## Self-repair PR

If this file (`routine-prompt.md`) or the entire `architecture/` folder is missing when the routine wakes:

1. Open a PR titled: `research: routine self-repair $(date -u +%Y-%m-%d)`
2. Re-create the missing file(s) using the description in the invoking system prompt and the sibling architecture files.
3. Exit without doing research that week.

The self-repair PR body should describe what was missing and what was recreated.

---

## Self-improvement protocol

After each run, reviewer feedback (PR comments, requested changes, rejections) feeds into the next run via STEP 1 bullet 4. The routine reads the last two merged `research:` PRs to extract:

- Tools that were rejected (add to a mental blocklist for that category)
- Edits that were requested and revert them or apply them
- Schema drift corrections to enforce going forward

The routine does **not** modify this file autonomously — changes to the operating manual go through a separate human-authored PR.

---

## Example branch / PR names

| Scenario | Branch | PR title |
| --- | --- | --- |
| Weekly AI Agents refresh | `research/2026-05-25-ai-agents` | `research: weekly AI Agents refresh 2026-05-25` |
| Local-First AI + new MCP Servers file | `research/2026-05-25-local-ai` | `research: weekly Local-First AI refresh 2026-05-25` |
| Self-repair | `research/2026-05-25-self-repair` | `research: routine self-repair 2026-05-25` |

---

## Quality bar (authoritative copy)

| Signal | Threshold |
| --- | --- |
| GitHub stars | ≥ 500 (lower OK if Notes column justifies it with a clear differentiator) |
| Last commit | Within 6 months **or** project is intentionally stable (mark in Notes) |
| License | OSS preferred; proprietary OK only in `## Proprietary Tools Worth Knowing` subsections |
| Maintained | Not archived; issues triaged in last 90 days |
| Distinct | Different enough from existing entries to warrant a separate row |
| Verifiable | Linked repo/page fetched and confirmed to match the description |

---

## Out of scope (do not add)

- News, blog posts, tutorials, or articles — tools catalog only.
- Hosted-only proprietary SaaS outside existing "Proprietary Tools Worth Knowing" subsections.
- One-person prototypes with < 100 stars and no traction signal.
- Model checkpoints — list *tools that run* models, not the models themselves.
